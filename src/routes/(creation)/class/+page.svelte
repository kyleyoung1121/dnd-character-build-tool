<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { barbarian } from '$lib/data/classes/barbarian';
	import { bard } from '$lib/data/classes/bard';
	import { cleric } from '$lib/data/classes/cleric';
	import { druid } from '$lib/data/classes/druid';
	import { fighter } from '$lib/data/classes/fighter';
	import { monk } from '$lib/data/classes/monk';
	import { paladin } from '$lib/data/classes/paladin';
	import { ranger } from '$lib/data/classes/ranger';
	import { rogue } from '$lib/data/classes/rogue';
	import { sorcerer } from '$lib/data/classes/sorcerer';
	import { warlock } from '$lib/data/classes/warlock';
	import { wizard } from '$lib/data/classes/wizard';
	import type { ClassData } from '$lib/data/types/ClassData';
	import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';

	const classes: ClassData[] = [
		barbarian, bard, cleric, druid, fighter, monk,
		paladin, ranger, rogue, sorcerer, warlock, wizard
	];

	let selectedClass: ClassData | null = null;
	let selectedClassData: ClassData | null = null;

	// featureSelections maps feature.name -> array of picks (by index)
	let featureSelections: Record<string, (string | null)[]> = {};

	let expandedFeatures = new Set<string>();

	// Used to force Svelte to re-create <select> nodes so option lists refresh instantly
	let selectionVersion = 0;

	function bumpVersion() {
		selectionVersion = (selectionVersion + 1) % 1_000_000;
	}

	function toggleFeatureExpand(name: string) {
		if (expandedFeatures.has(name)) expandedFeatures.delete(name);
		else expandedFeatures.add(name);
		expandedFeatures = new Set(expandedFeatures);
	}

	// Current feature list for the selected class
	$: mergedFeatures = selectedClassData
		? [...(selectedClassData.classFeatures || [])]
		: [];

	/**
	 * Build a globally-aware option list for a given feature + index:
	 * - No duplicates within the same feature (other indices)
	 * - No duplicates across ANY other picks (top-level or nested) on this page
	 * - No duplicates with what the character already has in the store (skills, languages, proficiencies)
	 * - Always allow the *current* selection for this index so it doesn't disappear and show blank
	 */
	function getGloballyAvailableOptions(feature: FeaturePrompt, index: number) {
		const options = feature.featureOptions?.options || [];
		const chosenHere = featureSelections[feature.name] || [];
		const currentValue = chosenHere[index] ?? null;

		// Everything currently on the character (store) + any in-progress picks in UI
		const state = get(character_store);
		const taken = new Set<string>();

		// Include store-backed sets that commonly correspond to dropdown options
		if (Array.isArray(state.skills)) for (const s of state.skills) taken.add(s);
		if (Array.isArray(state.languages)) for (const l of state.languages) taken.add(l);
		if (Array.isArray(state.proficiencies)) for (const p of state.proficiencies) taken.add(p);

		// Include every selection already made in the UI (across all features & nested)
		for (const [featName, picks] of Object.entries(featureSelections)) {
			for (const [i, pick] of (picks || []).entries()) {
				if (!pick) continue;
				// Don't count *this* select's current value as taken, so it remains visible
				if (featName === feature.name && i === index) continue;
				taken.add(pick);
			}
		}

		return options.filter((opt) => {
			const name = typeof opt === 'string' ? opt : opt.name;

			// Rule 1: cannot duplicate within the same feature (other indices)
			if (chosenHere.some((c, i) => c === name && i !== index)) return false;

			// Rule 2: allow the current index's already-chosen value
			if (currentValue === name) return true;

			// Rule 3: otherwise, must not be taken anywhere else
			if (taken.has(name)) return false;

			return true;
		});
	}

	function ensureArrayLen(arr: (string | null)[], len: number) {
		if (arr.length < len) {
			const oldLen = arr.length;
			arr.length = len;
			for (let i = oldLen; i < len; i++) arr[i] = null;
		}
	}

	function onSelectFeatureOption(feature: FeaturePrompt, index: number, selectedOption: string) {
		// Ensure array exists & has the right length
		const num = feature.featureOptions?.numPicks || 1;
		if (!featureSelections[feature.name]) {
			featureSelections[feature.name] = Array(num).fill(null);
		} else {
			ensureArrayLen(featureSelections[feature.name], num);
		}

		const prev = featureSelections[feature.name][index];
		featureSelections[feature.name][index] = selectedOption;

		// Force Svelte to react right away so other dropdowns update instantly
		featureSelections = { ...featureSelections };
		bumpVersion();

		if (prev !== selectedOption) {
			// If the chosen option changes, clean up any nested picks under the previous branch
			clearNestedFeatureSelections(feature, featureSelections);

			const scopeId = `feature:${feature.name}:${index}`;
			if (prev) {
				revertChanges(get(character_store), scopeId);
			}

			// Determine actual effects for this feature (skills, languages, subclass, etc.)
			const effects = feature.effects || [];
			const update: Record<string, any> = {};

			for (const effect of effects) {
				// Replace {userChoice} placeholder with the actual pick
				const value =
					effect.value === '{userChoice}' ? selectedOption : effect.value;

				// Array targets vs scalar targets:
				if (['skills', 'languages', 'proficiencies', 'features'].includes(effect.target)) {
					update[effect.target] = Array.isArray(value) ? value : [value];
				} else {
					// e.g. subclass, class, alignment, etc.
					update[effect.target] = value;
				}
			}

			applyChoice(scopeId, update);
		}
	}

	function clearNestedFeatureSelections(feature: FeaturePrompt, selections: Record<string, (string | null)[]>) {
		if (!feature.featureOptions) return;
		let mutated = false;

		for (const option of feature.featureOptions.options) {
			if (typeof option !== 'string' && option.nestedPrompts) {
				for (const nested of option.nestedPrompts) {
					if (selections[nested.name]) {
						delete selections[nested.name];
						mutated = true;
					}
				}
			}
		}

		// Force UI update if anything changed
		if (mutated) {
			featureSelections = { ...selections };
			bumpVersion();
		}
	}

	function getNestedPrompts(feature: FeaturePrompt, selectedOptions: (string | null)[]) {
		if (!feature.featureOptions) return [];
		const nested: FeaturePrompt[] = [];
		for (const option of feature.featureOptions.options) {
			const optionName = typeof option === 'string' ? option : option.name;
			if (
				selectedOptions.includes(optionName) &&
				typeof option !== 'string' &&
				option.nestedPrompts
			) {
				nested.push(...option.nestedPrompts);
			}
		}
		return nested;
	}

	function removeSelectedClass() {
		if (selectedClassData) {
			const state = get(character_store);
			const provKeys = Object.keys(state._provenance || {});

			// Recursively collect all features & nested prompts
			function collectFeatureNames(features: FeaturePrompt[]): string[] {
				const names: string[] = [];
				for (const feat of features) {
					names.push(feat.name);
					if (feat.featureOptions) {
						for (const opt of feat.featureOptions.options) {
							if (typeof opt !== 'string' && opt.nestedPrompts) {
								names.push(...collectFeatureNames(opt.nestedPrompts));
							}
						}
					}
				}
				return names;
			}

			const allFeatureNames = collectFeatureNames(selectedClassData.classFeatures || []);

			const prefixes = [
				`class:${selectedClassData.name}`,
				...allFeatureNames.map(f => `feature:${f}`)
			];

			for (const key of provKeys) {
				if (prefixes.some(prefix => key.startsWith(prefix))) {
					revertChanges(state, key);
				}
			}
		}

		selectedClassData = null;
		selectedClass = null;
		featureSelections = {};
		expandedFeatures = new Set();
		bumpVersion();
	}


	function confirmAddClass() {
		if (selectedClass) {
			selectedClassData = selectedClass;
			selectedClass = null;
			featureSelections = {};
			expandedFeatures = new Set();

			applyChoice(`class:${selectedClassData.name}`, {
				class: selectedClassData.name
			});

			for (const feature of selectedClassData.classFeatures || []) {
				if (!feature.featureOptions) {
					applyChoice(`feature:${feature.name}`, {
						features: [feature.name]
					});
				}
			}

			bumpVersion();
		}
	}

	function calculateMaxHP(hitDie: string | undefined) {
		if (!hitDie) return 'N/A';
		const match = hitDie.match(/d(\d+)/);
		if (!match) return 'N/A';
		const dieMax = parseInt(match[1], 10);
		const averagePerDie = Math.floor(dieMax / 2) + 1;
		return dieMax + averagePerDie * 2;
	}

	onMount(() => {
		const state = get(character_store);

		if (state.class) {
			// Restore selected class
			const found = classes.find(c => c.name === state.class);
			if (found) {
				selectedClassData = found;
				featureSelections = {};

				// Prepare arrays for static features (if you want to keep their cards primed)
				for (const feature of found.classFeatures || []) {
					if (state.features?.includes(feature.name)) {
						featureSelections[feature.name] = [];
					}
				}

				// Restore dynamic selections from provenance
				const provKeys = Object.keys(state._provenance || {});
				for (const key of provKeys) {
					if (!key.startsWith('feature:')) continue;
					const [, featureName, indexStr] = key.split(':');
					const index = parseInt(indexStr, 10) || 0;
					const stored: any = state._provenance?.[key];
					if (!stored) continue;

					// Ensure array exists & is sized for the feature
					const numPicks =
						found.classFeatures?.find(f => f.name === featureName)?.featureOptions?.numPicks || 1;

					if (!featureSelections[featureName]) {
						featureSelections[featureName] = Array(numPicks).fill(null);
					} else {
						ensureArrayLen(featureSelections[featureName], numPicks);
					}

					// Pick a representative value from the stored change
					let restored: string | null = null;

					if (Array.isArray(stored.skills) && stored.skills[0]) restored = stored.skills[0];
					else if (Array.isArray(stored.languages) && stored.languages[0]) restored = stored.languages[0];
					else if (Array.isArray(stored.proficiencies) && stored.proficiencies[0]) restored = stored.proficiencies[0];
					else if (Array.isArray(stored.features) && stored.features[0]) restored = stored.features[0];
					else if (typeof stored.subclass === 'string' && stored.subclass) restored = stored.subclass;
					else if (Array.isArray(stored.subclass) && stored.subclass[0]) restored = stored.subclass[0];
					else if (typeof stored.class === 'string' && stored.class) restored = stored.class;
					else if (Array.isArray(stored.class) && stored.class[0]) restored = stored.class[0];

					if (restored) {
						featureSelections[featureName][index] = restored;
					}
				}

				// Nudge reactivity after bulk restore
				featureSelections = { ...featureSelections };
				bumpVersion();
			}
		}
	});
</script>

<div class="main-content">
	<p class="intro-text">
		In Dungeons & Dragons, your character's class determines what they can do.
		It marks what role your character will play in your party of adventurers.
		Each class has strengths and weaknesses, so its important to use teamwork!
	</p>

	{#if !selectedClassData}
		<div class="class-cards">
			{#each classes as classInfo}
				<button class="class-card" on:click={() => (selectedClass = classInfo)}>
					<div class="card-left">
						<img src={classInfo.image} alt={`${classInfo.name} icon`} />
						<span>{classInfo.name}</span>
					</div>
					<img
						class="card-arrow"
						src="{base}/basic_icons/blue_next.png"
						alt="next arrow"
					/>
				</button>
			{/each}
		</div>
	{/if}

	{#if selectedClass}
		<!-- Popup Preview -->
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<span>CONFIRM ADD CLASS</span>
					<button class="close-button" on:click={() => (selectedClass = null)}>×</button>
				</div>

				<div class="popup-body">
					<h2>{selectedClass.name}</h2>
					<p class="description">{selectedClass.description}</p>
					<p><strong>Primary Ability:</strong> {selectedClass.primaryAbility}</p>

					{#each selectedClass.classFeatures as feature}
						<div class="feature-card">
							<h4>{feature.name}</h4>
							<p>{@html feature.description}</p>
						</div>
					{/each}
				</div>

				<div class="popup-footer">
					<button class="cancel-button" on:click={() => (selectedClass = null)}>Cancel</button>
					<button class="add-button" on:click={confirmAddClass}>Add Class</button>
				</div>
			</div>
		</div>
	{/if}

	{#if selectedClassData}
		<!-- Selected class view -->
		<div class="selected-class-card">
			<div class="selected-class-info">
				<img
					src={selectedClassData.image}
					alt={`${selectedClassData.name} icon`}
					class="selected-class-icon"
				/>
				<div class="selected-class-text">
					<h2>{selectedClassData.name}</h2>
					<p class="max-hp">Average Health: {calculateMaxHP(selectedClassData.hitDie)}</p>
				</div>
				<button
					class="remove-class-button"
					on:click={removeSelectedClass}
					aria-label="Remove selected class"
				>
					✕
				</button>
			</div>

			<!-- Render top-level features with collapsible cards -->
			{#each mergedFeatures as feature (feature.name)}
				<div class="feature-card">
					<button
						class="feature-header"
						type="button"
						on:click={() => toggleFeatureExpand(feature.name)}
					>
						<span class="feature-name">{feature.name}</span>
						<span class="expand-indicator">
							{expandedFeatures.has(feature.name) ? '–' : '+'}
						</span>
					</button>

					{#if expandedFeatures.has(feature.name)}
						<p>{@html feature.description}</p>

						{#if feature.featureOptions}
							{#each Array(feature.featureOptions.numPicks) as _, idx}
								{#key `${feature.name}:${idx}:${selectionVersion}`}
									<select
										value={featureSelections[feature.name]?.[idx] || ''}
										on:change={(e: Event) => {
											const target = e.target as HTMLSelectElement;
											onSelectFeatureOption(feature, idx, target.value);
										}}
									>
										<option value="" disabled>
											{feature.featureOptions.placeholderText || 'Select an option'}
										</option>

										{#each getGloballyAvailableOptions(feature, idx) as option (typeof option === 'string' ? option : option.name)}
											<option value={typeof option === 'string' ? option : option.name}>
												{typeof option === 'string' ? option : option.name}
											</option>
										{/each}
									</select>
								{/key}
							{/each}

							<!-- Render nested prompts expanded -->
							{#each getNestedPrompts(feature, featureSelections[feature.name] || []) as nestedFeature (nestedFeature.name)}
								<div class="feature-card nested">
									<h4>{nestedFeature.name}</h4>
									<p>{@html nestedFeature.description}</p>

									{#if nestedFeature.featureOptions}
										{#each Array(nestedFeature.featureOptions.numPicks) as _, nestedIdx}
											{#key `${nestedFeature.name}:${nestedIdx}:${selectionVersion}`}
												<select
													value={featureSelections[nestedFeature.name]?.[nestedIdx] || ''}
													on:change={(e: Event) => {
														const target = e.target as HTMLSelectElement;
														onSelectFeatureOption(nestedFeature, nestedIdx, target.value);
													}}
												>
													<option value="" disabled>
														{nestedFeature.featureOptions.placeholderText || 'Select an option'}
													</option>

													{#each getGloballyAvailableOptions(nestedFeature, nestedIdx) as option (typeof option === 'string' ? option : option.name)}
														<option value={typeof option === 'string' ? option : option.name}>
															{typeof option === 'string' ? option : option.name}
														</option>
													{/each}
												</select>
											{/key}
										{/each}
									{/if}
								</div>
							{/each}
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>


<style>
	.main-content {
		padding: 1.5rem;
		padding-top: 80px;
	}

	.intro-text {
		max-width: 50vw;
		margin: 0 auto;
		text-align: center;
		font-size: 1.1rem;
		color: #444;
	}

	.class-cards {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.class-card {
		width: 30%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		cursor: pointer;
		border: 2px solid #ccc;
		border-radius: 0.5rem;
		background-color: #f8f8f8;
		transition: background-color 0.2s ease;
		text-align: left;
	}

	.card-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.class-card img {
		width: 40px;
		height: 40px;
		object-fit: contain;
	}

	.card-arrow {
		width: 24px;
		height: 24px;
		object-fit: contain;
		margin-left: auto;
	}

	.class-card:hover,
	.class-card:focus {
		background-color: #e0e0e0;
		outline: none;
	}

	.class-card:focus {
		box-shadow: 0 0 0 3px rgba(100, 149, 237, 0.5);
	}

	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.popup-content {
		background: #fff;
		width: 50vw;
		height: 80vh;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
	}

	.popup-header {
		background: #222;
		color: white;
		padding: 12px 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.close-button {
		background: none;
		border: none;
		color: white;
		font-size: 1.2rem;
		cursor: pointer;
	}

	.popup-body {
		padding: 16px;
		overflow-y: auto;
		flex: 1;
	}

	.description {
		font-size: 0.95rem;
		color: #555;
		margin-bottom: 1rem;
	}

	.selected-class-card {
		max-width: 50vw;
		margin: 2rem auto 1rem auto;
		padding: 1rem 1.5rem;
		border: 2px solid #888;
		border-radius: 8px;
		background-color: #fafafa;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}

	.selected-class-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.selected-class-icon {
		width: 60px;
		height: 60px;
		object-fit: contain;
		border-radius: 6px;
		box-shadow: 0 0 5px rgba(0,0,0,0.1);
	}

	.selected-class-text {
		flex-grow: 1;
	}

	.selected-class-text h2 {
		margin: 0;
		font-weight: 700;
		font-size: 1.2rem;
	}

	.max-hp {
		font-size: 0.9rem;
		color: #666;
		margin-top: 4px;
	}

	.remove-class-button {
		font-size: 1.5rem;
		cursor: pointer;
		background: none;
		border: none;
		color: #c00;
		padding: 4px 8px;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}
	.remove-class-button:hover {
		background-color: #fdd;
	}

	.feature-card {
		border: 1px solid #ccc;
		border-radius: 6px;
		padding: 10px 12px;
		margin: 10px 0;
		background: #f9f9f9;
		width: 100%;
		max-width: 50vw;
		box-sizing: border-box;
	}

	.feature-card select {
		margin-top: 0.5rem;
		width: 100%;
		padding: 0.3rem 0.5rem;
		font-size: 1rem;
		border-radius: 4px;
		border: 1px solid #aaa;
	}

	.feature-card.nested {
		margin-left: 1rem;
		border-color: #888;
		background-color: #eee;
	}

	.popup-footer {
		padding: 12px 16px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		border-top: 1px solid #ddd;
		background: #f0f0f0;
	}

	.cancel-button {
		background-color: #333;
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.cancel-button:hover {
		background-color: #555;
	}

	.add-button {
		background-color: #2e7d32;
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.add-button:hover {
		background-color: #1b4d20;
	}

	/* Updated styles for collapsible feature headers */
	.feature-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		background: none;
		border: none;
		padding: 0.5rem 0;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
		text-align: left;
	}

	.feature-name {
		flex: 1;
	}

	.expand-indicator {
		font-size: 1.2rem;
		font-weight: bold;
		padding-left: 1rem;
	}
</style>
