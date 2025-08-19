<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	import { dragonborn } from '$lib/data/races/dragonborn';
	import { halfElf } from '$lib/data/races/half_elf';
	import { tiefling } from '$lib/data/races/tiefling';
	import { highElf } from '$lib/data/races/elf/high_elf';
	import { woodElf } from '$lib/data/races/elf/wood_elf';
	import { darkElf } from '$lib/data/races/elf/dark_elf';
	import { hillDwarf } from '$lib/data/races/dwarf/hill_dwarf';
	import { mountainDwarf } from '$lib/data/races/dwarf/mountain_dwarf';
	import { rockGnome } from '$lib/data/races/gnome/rock_gnome';
	import { forestGnome } from '$lib/data/races/gnome/forest_gnome';
	import { lightfootHalfling } from '$lib/data/races/halfling/lightfoot_halfling';
	import { stoutHalfling } from '$lib/data/races/halfling/stout_halfling';
	import { human } from '$lib/data/races/human/human';
	import { variantHuman } from '$lib/data/races/human/variant_human';
	import { halfOrc } from '$lib/data/races/half_orc';

	import type { RaceData } from '$lib/data/types/RaceData';
	import type { FeaturePrompt } from '$lib/data/types/Features';

	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';

	// --- NEW: race group type ---
	interface RaceGroup {
		name: string;
		image: string;
		subraces: RaceData[];
	}

	const races: (RaceData | RaceGroup)[] = [
		dragonborn,
		{
			name: 'Dwarf',
			image: `${base}/race_icons/hill_dwarf.jpg`,
			subraces: [hillDwarf, mountainDwarf]
		},
		{
			name: 'Elf',
			image: `${base}/race_icons/high_elf.jpg`,
			subraces: [highElf, woodElf, darkElf]
		},
		{
			name: 'Gnome',
			image: `${base}/race_icons/rock_gnome.jpg`,
			subraces: [rockGnome, forestGnome]
		},
		halfElf,
		halfOrc,
		{
			name: 'Halfling',
			image: `${base}/race_icons/lightfoot_halfling.jpg`,
			subraces: [lightfootHalfling, stoutHalfling]
		},
		{
			name: 'Human',
			image: `${base}/race_icons/human.jpg`,
			subraces: [human, variantHuman]
		},
		tiefling
	];


	let selectedRace: RaceData | null = null;
	let selectedRaceData: RaceData | null = null;

	// Collapsible parent races
	let expandedRaces = new Set<string>();
	function toggleRaceExpand(name: string) {
		if (expandedRaces.has(name)) expandedRaces.delete(name);
		else expandedRaces.add(name);
		expandedRaces = new Set(expandedRaces); // force reactivity
	}

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

	// Current feature list for the selected race
	$: mergedFeatures = selectedRaceData ? [...(selectedRaceData.raceFeatures || [])] : [];

	// make sure this lives in <script> and stays after isFeatureIncomplete is defined
	$: featureStatuses = mergedFeatures.map((feature) => ({
		feature,
		incomplete: isFeatureIncomplete(feature, featureSelections)
	}));

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

	/** Utility: does an effect require a user choice in its target or value? */
	function effectNeedsChoice(e: any) {
		return (
			(typeof e.target === 'string' && e.target.includes('{userChoice}')) ||
			(typeof e.value === 'string' && e.value.includes('{userChoice}'))
		);
	}

	/** Apply the static (choice-independent) effects for a feature exactly once. */
	function applyStaticEffectsForFeatureOnce(feature: FeaturePrompt) {
		const staticEffects = (feature.effects || []).filter((e) => !effectNeedsChoice(e));
		if (!staticEffects.length) return;

		const update: Record<string, any> = {};
		const modify: Record<string, number> = {};

		for (const effect of staticEffects) {
			const target = effect.target;
			const value = effect.value;

			switch (effect.action) {
				case 'add': {
					const arr = Array.isArray(value) ? value : [value];
					if (!update[target]) update[target] = [];
					update[target].push(...arr);
					break;
				}
				case 'set': {
					update[target] = value;
					break;
				}
				case 'modify': {
					const amount = Number(value);
					if (!isNaN(amount)) {
						modify[target] = (modify[target] ?? 0) + amount;
					}
					break;
				}
			}
		}

		applyChoice(`feature:${feature.name}:static`, update, modify);
	}

	// --- onSelectFeatureOption (Race Tab) ---
	function onSelectFeatureOption(
		feature: FeaturePrompt,
		index: number,
		selectedOption: string
	) {
		// We store the raw option label; targets will be snake-cased when needed.
		const normalizedChoice = selectedOption;

		// Ensure the selection array exists and has the right length
		const num = feature.featureOptions?.numPicks || 1;
		if (!featureSelections[feature.name]) {
			featureSelections[feature.name] = Array(num).fill(null);
		} else {
			ensureArrayLen(featureSelections[feature.name], num);
		}

		const prev = featureSelections[feature.name][index];

		// Make a deep copy of the selections array for reactivity
		const updatedSelections = [...featureSelections[feature.name]];
		updatedSelections[index] = normalizedChoice;

		// Update the main store object with a new array reference
		featureSelections = { ...featureSelections, [feature.name]: updatedSelections };
		bumpVersion();

		if (prev === normalizedChoice) return;

		// Clear any nested selections under the previous branch
		clearNestedFeatureSelections(feature, featureSelections);

		const scopeId = `feature:${feature.name}:${index}`;

		// Revert previous top-level choice effects
		if (prev) {
			revertChanges(get(character_store), scopeId);

			// Also revert any static nested effects tied to the previous choice
			const prevNested = getNestedPrompts(feature, [prev]) || [];
			for (const nested of prevNested) {
				if (nested.featureOptions) continue; // only static nested
				const prevNestedScopeId = `feature:${feature.name}:${index}:${nested.name}`;
				revertChanges(get(character_store), prevNestedScopeId);
			}
		}

		// Prepare containers for ONLY the effects that depend on this choice
		const update: Record<string, any> = {};
		const modify: Record<string, number> = {};

		const effects = feature.effects || [];
		for (const effect of effects) {
			if (!effectNeedsChoice(effect)) continue; // skip static effects here

			// Replace {userChoice} anywhere in target or value with the chosen value.
			const replaceUC = (s: any, isTarget = false) => {
				if (typeof s !== "string") return s;
				let replaced = s.replace(/\{userChoice\}/g, normalizedChoice);
				if (isTarget) {
					replaced = replaced.toLowerCase().replace(/\s+/g, "_");
				}
				return replaced;
			};

			const target = replaceUC(effect.target, true);
			const value = replaceUC(effect.value);

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

		// Apply the choice-dependent effects for this top-level selection
		applyChoice(scopeId, update, modify);

		// ✅ Apply newly revealed static nested features (no user input) for THIS choice
		const newlyRevealed = getNestedPrompts(feature, [normalizedChoice]) || [];
		for (const nested of newlyRevealed) {
			// Skip nested prompts that have their own options; those will be handled by user interaction later
			if (nested.featureOptions) continue;

			const nestedScopeId = `feature:${feature.name}:${index}:${nested.name}`;
			revertChanges(get(character_store), nestedScopeId); // ensure idempotence

			const nestedUpdate: Record<string, any> = {};
			const nestedModify: Record<string, number> = {};

			for (const effect of nested.effects || []) {
				const target = effect.target;
				const value = effect.value;

				switch (effect.action) {
					case "add": {
						const arr = Array.isArray(value) ? value : [value];
						if (!nestedUpdate[target]) nestedUpdate[target] = [];
						nestedUpdate[target].push(...arr);
						break;
					}
					case "set": {
						nestedUpdate[target] = value;
						break;
					}
					case "modify": {
						const amount = Number(value);
						if (!isNaN(amount)) {
							nestedModify[target] = (nestedModify[target] ?? 0) + amount;
						}
						break;
					}
				}
			}

			applyChoice(nestedScopeId, nestedUpdate, nestedModify);
		}
	}


	function clearNestedFeatureSelections(
		feature: FeaturePrompt,
		selections: Record<string, (string | null)[]>
	) {
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

	function removeSelectedRace() {
		if (selectedRaceData) {
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

			const allFeatureNames = collectFeatureNames(selectedRaceData.raceFeatures || []);

			const prefixes = [
				`race:${selectedRaceData.name}`,
				...allFeatureNames.map((f) => `feature:${f}`)
			];

			for (const key of provKeys) {
				if (prefixes.some((prefix) => key.startsWith(prefix))) {
					revertChanges(state, key);
				}
			}
		}

		selectedRaceData = null;
		selectedRace = null;
		featureSelections = {};
		expandedFeatures = new Set();
		bumpVersion();
	}

	function confirmAddRace() {
		if (selectedRace) {
			selectedRaceData = selectedRace;
			selectedRace = null;
			featureSelections = {};
			expandedFeatures = new Set();

			applyChoice(`race:${selectedRaceData.name}`, {
				race: selectedRaceData.name
			});

			for (const feature of selectedRaceData.raceFeatures || []) {
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

				// ✅ Only apply the feature if its effects exist
				// (no auto-push into features[] unless the effect targets it)
				applyChoice(scopeId, update, modify);
			}

			bumpVersion();
		}
	}


	function isFeatureIncomplete(
		feature: FeaturePrompt,
		selectionsMap: Record<string, (string | null)[]>
	): boolean {
		// No options => not marked incomplete/complete (leave default styling)
		if (!feature.featureOptions) return false;

		const numPicks = feature.featureOptions.numPicks ?? 1;
		const selections = selectionsMap[feature.name];

		// Not touched or undersized => incomplete
		if (!selections || selections.length < numPicks) return true;

		// Any empty slot => incomplete
		if (selections.some((s) => !s)) return true;

		// Only check nested prompts for options that are actually selected
		const selectedNames = selections.filter(Boolean) as string[];

		for (const opt of feature.featureOptions.options) {
			if (typeof opt !== 'string') {
				if (selectedNames.includes(opt.name) && opt.nestedPrompts) {
					for (const nested of opt.nestedPrompts) {
						if (isFeatureIncomplete(nested, selectionsMap)) return true;
					}
				}
			}
		}

		// Fully complete
		return false;
	}

	// --- onMount for feature restoration ---
	onMount(() => {
		const state = get(character_store);

		if (state.race) {
			// Find race or subrace
			let found: RaceData | RaceGroup | undefined = races.find((r) => r.name === state.race);
			if (!found) {
				for (const race of races) {
					if ("subraces" in race) {
						const sub = race.subraces.find((sr) => sr.name === state.race);
						if (sub) {
							found = sub;
							break;
						}
					}
				}
			}

			if (found && !("subraces" in found)) {
				selectedRaceData = found;
				featureSelections = {};

				// Prepare arrays for static features
				if (state.features && found.raceFeatures) {
					for (const feature of found.raceFeatures) {
						if (state.features.includes(feature.name)) {
							const numPicks = feature.featureOptions?.numPicks || 1;
							featureSelections[feature.name] = Array(numPicks).fill(null);
						}
					}
				}

				const toSnakeCase = (str: string) => str.toLowerCase().replace(/\s+/g, "_");

				// Restore dynamic selections from provenance
				const prov = state._provenance || {};
				for (const key of Object.keys(prov)) {
					if (!key.startsWith("feature:")) continue;
					const parts = key.split(":"); // feature:FeatureName:<index|static>
					if (parts.length < 3) continue;
					const featureName = parts[1];
					const indexStr = parts[2];
					if (indexStr === "static") continue;

					const index = Number.isFinite(parseInt(indexStr, 10))
						? parseInt(indexStr, 10)
						: null;
					if (index === null) continue;

					const stored: any = prov[key];
					const featureDef = found.raceFeatures?.find((f) => f.name === featureName);
					if (!featureDef) continue;

					const opts = featureDef.featureOptions?.options || [];

					// Build map: snake_case => label
					const optionMap = new Map(
						opts.map((o) => {
							const label = typeof o === "string" ? o : o.name;
							return [toSnakeCase(label), label];
						})
					);

					let restored: string | null = null;

					// --- Helper: check if any stored value *contains* an option ---
					const tryRestoreFromValue = (val: string) => {
						const snakeVal = toSnakeCase(val);
						for (const [key, label] of optionMap.entries()) {
							if (snakeVal.includes(key)) {
								return key; // return normalized key
							}
						}
						return null;
					};

					// --- Check _set values ---
					if (stored?._set) {
						for (const effect of featureDef.effects || []) {
							const target = effect.target;
							const arr = stored._set[target];
							if (Array.isArray(arr)) {
								for (const val of arr) {
									const maybe = tryRestoreFromValue(val);
									if (maybe) {
										restored = maybe;
										break;
									}
								}
							} else if (typeof arr === "string") {
								const maybe = tryRestoreFromValue(arr);
								if (maybe) restored = maybe;
							}
							if (restored) break;
						}
					}

					// --- Check _mods (for ability score bumps etc.) ---
					if (!restored && stored?._mods) {
						for (const modKey of Object.keys(stored._mods)) {
							const maybe = tryRestoreFromValue(modKey);
							if (maybe) {
								restored = maybe;
								break;
							}
						}
					}

					// Save into featureSelections
					if (restored) {
						const numPicks = featureDef.featureOptions?.numPicks || 1;
						if (!featureSelections[featureName]) {
							featureSelections[featureName] = Array(numPicks).fill(null);
						} else {
							ensureArrayLen(featureSelections[featureName], numPicks);
						}
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
		There are many different kinds of creatures you character can be, each with their own special traits and abilities.
	</p>

	{#if !selectedRaceData}
		<div class="race-cards">
			{#each races as raceInfo}
				{#if 'subraces' in raceInfo}
					<!-- Parent race container -->
					<div class="parent-race-container">
						<!-- Parent race button -->
						<button
							type="button"
							class="race-card parent-race-button"
							on:click={() => toggleRaceExpand(raceInfo.name)}
							aria-expanded={expandedRaces.has(raceInfo.name)}
						>
							<div class="card-left">
								<img src={raceInfo.image} alt={`${raceInfo.name} icon`} />
								<span>{raceInfo.name}</span>
							</div>
							<img
								class="card-arrow"
								src="{base}/basic_icons/blue_next.png"
								alt="toggle subraces"
							/>
						</button>

						{#if expandedRaces.has(raceInfo.name)}
							<div class="subrace-cards-container">
								{#each raceInfo.subraces as subrace}
									<button
										class="race-card subrace-card"
										on:click={() => (selectedRace = subrace)}
									>
										<div class="card-left">
											<img src={subrace.image} alt={`${subrace.name} icon`} />
											<span>{subrace.name}</span>
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
					</div>
				{:else}
					<!-- Single race container -->
					<div class="parent-race-container">
						<button
							class="race-card"
							on:click={() => (selectedRace = raceInfo)}
						>
							<div class="card-left">
								<img src={raceInfo.image} alt={`${raceInfo.name} icon`} />
								<span>{raceInfo.name}</span>
							</div>
							<img
								class="card-arrow"
								src="{base}/basic_icons/blue_next.png"
								alt="next arrow"
							/>
						</button>
					</div>
				{/if}
			{/each}
		</div>
	{/if}



	{#if selectedRace}
		<!-- Popup Preview -->
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<span>CONFIRM ADD RACE</span>
					<button class="close-button" on:click={() => (selectedRace = null)}>×</button>
				</div>

				<div class="popup-body">
					<h2>{selectedRace.name}</h2>
					<p class="description">{selectedRace.description}</p>

					{#each selectedRace.raceFeatures as feature}
						<div class="feature-card">
							<h4>{feature.name}</h4>
							<p>{@html feature.description}</p>
						</div>
					{/each}
				</div>

				<div class="popup-footer">
					<button class="cancel-button" on:click={() => (selectedRace = null)}>Cancel</button>
					<button class="add-button" on:click={confirmAddRace}>Add Race</button>
				</div>
			</div>
		</div>
	{/if}

	{#if selectedRaceData}
		<!-- Selected race view -->
		<div class="selected-race-card">
			<div class="selected-race-info">
				<img
					src={selectedRaceData.image}
					alt={`${selectedRaceData.name} icon`}
					class="selected-race-icon"
				/>
				<div class="selected-race-text">
					<h2>{selectedRaceData.name}</h2>
					<p class="description">{selectedRaceData.description}</p>
				</div>
				<button
					class="remove-race-button"
					on:click={removeSelectedRace}
					aria-label="Remove selected race"
				>
					✕
				</button>
			</div>

			<!-- Render top-level features with collapsible cards -->
			{#each mergedFeatures as feature (feature.name)}
				<div class="feature-card {isFeatureIncomplete(feature, featureSelections) ? 'incomplete' : feature.featureOptions ? 'complete' : ''}">
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
											<option value={(typeof option === 'string' ? option : option.name).toLowerCase().replace(/\s+/g, "_")}>
												{typeof option === 'string' ? option : option.name}
											</option>
										{/each}
									</select>
								{/key}
							{/each}

							<!-- Render nested prompts expanded -->
							{#each getNestedPrompts(feature, featureSelections[feature.name] || []) as nestedFeature (nestedFeature.name)}
								<div class="feature-card nested {isFeatureIncomplete(nestedFeature, featureSelections) ? 'incomplete' : nestedFeature.featureOptions ? 'complete' : ''}">
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
														<option value={(typeof option === 'string' ? option : option.name).toLowerCase().replace(/\s+/g, "_")}>
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

	/* Container for all race cards */
	.race-cards {
		display: flex;
		flex-direction: column; /* vertical stack */
		gap: 1rem;
		margin-top: 2rem;
		align-items: center; /* center the parent cards */
		width: 100%;
	}

	/* Individual race card (single or parent) */
	.race-card {
		width: 100%; /* fill parent width */
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
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

	.race-card img {
		width: 40px;
		height: 40px;
		object-fit: contain;
	}

	.card-arrow {
		width: 24px;
		height: 24px;
		object-fit: contain;
		margin-left: auto;
		transition: transform 0.2s ease;
	}

	/* Rotate arrow when expanded */
	.race-card.expanded .card-arrow {
		transform: rotate(90deg);
	}

	.race-card:hover,
	.race-card:focus {
		background-color: #e0e0e0;
		outline: none;
	}

	.race-card:focus {
		box-shadow: 0 0 0 3px rgba(100, 149, 237, 0.5);
	}

	/* Parent + subrace grouping */
	.parent-race-container {
		display: flex;
		flex-direction: column; /* stack parent + subraces */
		width: 33%; /* 1/3 screen */
		min-width: 220px; /* optional: ensure not too narrow on small screens */
		box-sizing: border-box;
	}

	.parent-race-button {
		width: 100%; /* fill container */
	}

	.subrace-cards-container {
		display: flex;
		flex-direction: column; /* stack subraces vertically */
		gap: 0.5rem;
		width: 100%; /* fill parent container */
		padding-left: 5rem; /* indent for nesting */
		box-sizing: border-box;
		margin-top: 0.5rem; /* space between parent and first subrace */
	}

	/* Subrace card styling */
	.subrace-card {
		width: 100%; /* fill subrace container */
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.8rem 1rem;
		border-radius: 6px;
		border: 2px solid #bbb;
		background-color: #fafafa;
		cursor: pointer;
	}

	.subrace-card img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}

	.subrace-card:hover,
	.subrace-card:focus {
		background-color: #e8e8e8;
	}

	/* Popup and modal styles remain unchanged */
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

	.selected-race-card {
		max-width: 50vw;
		margin: 2rem auto 1rem auto;
		padding: 1rem 1.5rem;
		border: 2px solid #888;
		border-radius: 8px;
		background-color: #fafafa;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}

	.selected-race-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.selected-race-icon {
		width: 60px;
		height: 60px;
		object-fit: contain;
		border-radius: 6px;
		box-shadow: 0 0 5px rgba(0,0,0,0.1);
	}

	.selected-race-text {
		flex-grow: 1;
	}

	.selected-race-text h2 {
		margin: 0;
		font-weight: 700;
		font-size: 1.2rem;
	}

	.remove-race-button {
		font-size: 1.5rem;
		cursor: pointer;
		background: none;
		border: none;
		color: #c00;
		padding: 4px 8px;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}
	.remove-race-button:hover {
		background-color: #fdd;
	}

	/* Feature cards */
	.feature-card {
		border: 2px solid #ccc;
		border-radius: 6px;
		padding: 10px 12px;
		margin: 10px 0;
		background: #f9f9f9;
		width: 100%;
		max-width: 50vw;
		box-sizing: border-box;
		transition: border-color 0.2s ease;
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
		background-color: #eee;
		border-color: #888;
	}

	.feature-card.incomplete {
		border-color: red;
	}

	.feature-card.complete {
		border-color: #4a90e2;
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
