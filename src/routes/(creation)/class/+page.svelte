<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import FeatureCardList from '$lib/components/FeatureCardList.svelte';
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';
	import { 
		isFeatureIncomplete
	} from '$lib/components/feature-card-utils';
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
	import type { FeaturePrompt } from '$lib/data/types/Features';

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



	// Current feature list for the selected class
	$: mergedFeatures = selectedClassData
		? [...(selectedClassData.classFeatures || [])]
		: [];

	// make sure this lives in <script> and stays after isFeatureIncomplete is defined
	$: featureStatuses = mergedFeatures.map((feature) => ({
	feature,
	incomplete: isFeatureIncomplete(feature, featureSelections) // <-- pass the map
	}));
















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
				// Skip features with options; those will be applied later
				if (feature.featureOptions) continue;

				const scopeId = `feature:${feature.name}`;
				revertChanges(get(character_store), scopeId); // just in case

				// Collect updates from static effects
				const update: Record<string, any> = {};
				const modify: Record<string, number> = {};

				for (const effect of feature.effects || []) {
					const target = effect.target;
					const value = effect.value;

					switch (effect.action) {
						case "add": {
							const arr = Array.isArray(value) ? value : [value];
							if (!update[target]) update[target] = [];
							update[target].push(...arr);
							break;
						}
						case "set": {
							update[target] = value;
							break;
						}
						case "modify": {
							const amount = Number(value);
							if (!isNaN(amount)) {
								modify[target] = (modify[target] ?? 0) + amount;
							}
							break;
						}
					}
				}

				// Apply the static base-level feature
				applyChoice(scopeId, update, modify);
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

	// Helper function needed by onMount
	function ensureArrayLen(arr: (string | null)[], len: number) {
		if (arr.length < len) {
			const oldLen = arr.length;
			arr.length = len;
			for (let i = oldLen; i < len; i++) arr[i] = null;
		}
	}








	// --- onMount for class feature restoration ---
	onMount(() => {
		const state = get(character_store);

		if (!state.class) return;

		// Find selected class
		const found = classes.find(c => c.name === state.class);
		if (!found) return;

		selectedClassData = found;
		featureSelections = {};

		const toSnakeCase = (str: string) => str.toLowerCase().replace(/\s+/g, "_");

		// Helper: convert stored snake_case value to display label
		const tryRestoreFromValue = (val: string, optionMap: Map<string, string>) => {
			const snakeVal = toSnakeCase(val);
			for (const [key, label] of optionMap.entries()) {
				if (snakeVal.includes(key)) return label;
			}
			return null;
		};

		// Recursive function to restore a feature and its nested prompts
		const restoreFeatureSelection = (feature: FeaturePrompt) => {
			const numPicks = feature.featureOptions?.numPicks || 1;

			if (!featureSelections[feature.name]) {
				featureSelections[feature.name] = Array(numPicks).fill(null);
			} else {
				ensureArrayLen(featureSelections[feature.name], numPicks);
			}

			const opts = feature.featureOptions?.options || [];
			const optionMap = new Map(
				opts.map(o => [toSnakeCase(typeof o === 'string' ? o : o.name), typeof o === 'string' ? o : o.name])
			);

			const prov = state._provenance || {};

			for (let idx = 0; idx < numPicks; idx++) {
				// Skip if already restored
				if (featureSelections[feature.name][idx]) continue;

				const key = `feature:${feature.name}:${idx}`;
				const stored: any = prov[key];

				let restored: string | null = null;

				if (stored?._set) {
					for (const effect of feature.effects || []) {
						const target = effect.target;
						const arr = stored._set[target];
						if (Array.isArray(arr)) {
							for (const val of arr) {
								const maybe = tryRestoreFromValue(val, optionMap);
								if (maybe) {
									restored = maybe;
									break;
								}
							}
						} else if (typeof arr === "string") {
							const maybe = tryRestoreFromValue(arr, optionMap);
							if (maybe) restored = maybe;
						}
						if (restored) break;
					}
				}

				if (!restored && stored?._mods) {
					for (const modKey of Object.keys(stored._mods)) {
						const maybe = tryRestoreFromValue(modKey, optionMap);
						if (maybe) {
							restored = maybe;
							break;
						}
					}
				}

				if (restored) {
					featureSelections[feature.name][idx] = restored;
				}
			}

			// Recurse into nested prompts if any
			if (feature.featureOptions?.options) {
				feature.featureOptions.options.forEach(o => {
					if (typeof o !== "string" && o.nestedPrompts) {
						const selectedVal = featureSelections[feature.name].find(v => v === o.name);
						if (selectedVal) {
							o.nestedPrompts.forEach(nested => restoreFeatureSelection(nested));
						}
					}
				});
			}
		};

		// Restore all top-level features
		found.classFeatures?.forEach(feature => restoreFeatureSelection(feature));

		// Trigger Svelte reactivity
		featureSelections = { ...featureSelections };
		bumpVersion();
	});

</script>

<div class="main-content">
	<!-- Show conflict warnings for this tab -->
	<ConflictWarning tabName="class" />
	
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

			<!-- Use shared feature card components -->
			<FeatureCardList
				features={mergedFeatures}
				bind:featureSelections={featureSelections}
				bind:expandedFeatures={expandedFeatures}
				selectionVersion={selectionVersion}
				characterStore={character_store}
				onBumpVersion={() => selectionVersion++}
			/>
		</div>
	{/if}
</div>



<style>
	.main-content {
		padding: 2rem 1rem;
		padding-top: 80px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.intro-text {
		max-width: 50vw;
		margin: 0 auto;
		text-align: center;
		font-size: 1.1rem;
		color: #444;
	}

	.class-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
		gap: 1rem;
		margin-top: 2rem;
		padding: 0 2rem; /* increased horizontal padding for better visual spacing */
		width: 100%;
		align-items: start; /* align items to top of their grid area */
		box-sizing: border-box;
	}

	/* Responsive grid behavior - matches species page breakpoints */
	@media (max-width: 768px) {
		.class-cards {
			grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
			gap: 0.75rem; /* slightly smaller gap on tablets */
			padding: 0 1rem; /* medium padding on tablets */
		}
	}

	@media (max-width: 480px) {
		.class-cards {
			grid-template-columns: 1fr; /* single column on mobile */
			gap: 0.5rem; /* smaller gap on mobile */
			padding: 0 0.5rem; /* reduced padding on mobile */
		}
	}

	.class-card {
		width: 100%; /* fill grid cell */
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem; /* match species padding */
		font-size: 1.2rem;
		cursor: pointer;
		border: 2px solid #ccc;
		border-radius: 0.5rem;
		background-color: #f8f8f8;
		transition: background-color 0.2s ease;
		text-align: left;
		box-sizing: border-box;
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
		border: 2px solid #ccc; /* default border slightly thicker for visibility */
		border-radius: 6px;
		padding: 10px 12px;
		margin: 10px 0;
		background: #f9f9f9;
		width: 100%;
		max-width: 50vw;
		box-sizing: border-box;
		transition: border-color 0.2s ease; /* smooth transition when state changes */
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


</style>
