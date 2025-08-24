<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	import { dragonborn } from '$lib/data/species/dragonborn';
	import { halfElf } from '$lib/data/species/half_elf';
	import { tiefling } from '$lib/data/species/tiefling';
	import { highElf } from '$lib/data/species/elf/high_elf';
	import { woodElf } from '$lib/data/species/elf/wood_elf';
	import { darkElf } from '$lib/data/species/elf/dark_elf';
	import { hillDwarf } from '$lib/data/species/dwarf/hill_dwarf';
	import { mountainDwarf } from '$lib/data/species/dwarf/mountain_dwarf';
	import { rockGnome } from '$lib/data/species/gnome/rock_gnome';
	import { forestGnome } from '$lib/data/species/gnome/forest_gnome';
	import { lightfootHalfling } from '$lib/data/species/halfling/lightfoot_halfling';
	import { stoutHalfling } from '$lib/data/species/halfling/stout_halfling';
	import { human } from '$lib/data/species/human/human';
	import { variantHuman } from '$lib/data/species/human/variant_human';
	import { halfOrc } from '$lib/data/species/half_orc';

	import type { SpeciesData } from '$lib/data/types/SpeciesData';
	import type { FeaturePrompt } from '$lib/data/types/Features';

	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';
	import FeatureCardList from '$lib/components/FeatureCardList.svelte';
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';
	import { 
		isFeatureIncomplete,
		effectNeedsChoice 
	} from '$lib/components/feature-card-utils';

	// --- NEW: species group type ---
	interface SpeciesGroup {
		name: string;
		image: string;
		subraces: SpeciesData[];
	}

	const species: (SpeciesData | SpeciesGroup)[] = [
		dragonborn,
		{
			name: 'Dwarf',
			image: `${base}/species_icons/hill_dwarf.jpg`,
			subraces: [hillDwarf, mountainDwarf]
		},
		{
			name: 'Elf',
			image: `${base}/species_icons/high_elf.jpg`,
			subraces: [highElf, woodElf, darkElf]
		},
		{
			name: 'Gnome',
			image: `${base}/species_icons/rock_gnome.jpg`,
			subraces: [rockGnome, forestGnome]
		},
		halfElf,
		halfOrc,
		{
			name: 'Halfling',
			image: `${base}/species_icons/lightfoot_halfling.jpg`,
			subraces: [lightfootHalfling, stoutHalfling]
		},
		{
			name: 'Human',
			image: `${base}/species_icons/human.jpg`,
			subraces: [human, variantHuman]
		},
		tiefling
	];


	let selectedSpecies: SpeciesData | null = null;
	let selectedSpeciesData: SpeciesData | null = null;

	// Collapsible parent races
	let expandedSpecies = new Set<string>();
	function toggleSpeciesExpand(name: string) {
		if (expandedSpecies.has(name)) expandedSpecies.delete(name);
		else expandedSpecies.add(name);
		expandedSpecies = new Set(expandedSpecies); // force reactivity
	}

	// Responsive column distribution
	let isMobile = false;
	
	// Reactive distributions for different screen sizes
	$: column1Species = isMobile ? species : species.slice(0, 3);
	$: column2Species = isMobile ? [] : species.slice(3, 6);
	$: column3Species = isMobile ? [] : species.slice(6);
	
	// Track window width for responsiveness
	let windowWidth = 768; // default to desktop
	$: isMobile = windowWidth <= 768;
	
	function updateWindowWidth() {
		windowWidth = window.innerWidth;
	}

	// featureSelections maps feature.name -> array of picks (by index)
	let featureSelections: Record<string, (string | null)[]> = {};

	let expandedFeatures = new Set<string>();

	// Used to force Svelte to re-create <select> nodes so option lists refresh instantly
	let selectionVersion = 0;
	function bumpVersion() {
		selectionVersion = (selectionVersion + 1) % 1_000_000;
	}



	// Current feature list for the selected race
	$: mergedFeatures = selectedSpeciesData ? [...(selectedSpeciesData.speciesFeatures || [])] : [];

	// make sure this lives in <script> and stays after isFeatureIncomplete is defined
	$: featureStatuses = mergedFeatures.map((feature) => ({
		feature,
		incomplete: isFeatureIncomplete(feature, featureSelections)
	}));



	// Helper function needed by onMount
	function ensureArrayLen(arr: (string | null)[], len: number) {
		if (arr.length < len) {
			const oldLen = arr.length;
			arr.length = len;
			for (let i = oldLen; i < len; i++) arr[i] = null;
		}
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








	function removeSelectedSpecies() {
		if (selectedSpeciesData) {
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

			const allFeatureNames = collectFeatureNames(selectedSpeciesData.speciesFeatures || []);

			const prefixes = [
				`race:${selectedSpeciesData.name}`,
				...allFeatureNames.map((f) => `feature:${f}`)
			];

			for (const key of provKeys) {
				if (prefixes.some((prefix) => key.startsWith(prefix))) {
					revertChanges(state, key);
				}
			}
		}

		selectedSpeciesData = null;
		selectedSpecies = null;
		featureSelections = {};
		expandedFeatures = new Set();
		bumpVersion();
	}

	function confirmAddSpecies() {
		if (selectedSpecies) {
			selectedSpeciesData = selectedSpecies;
			selectedSpecies = null;
			featureSelections = {};
			expandedFeatures = new Set();

			applyChoice(`race:${selectedSpeciesData.name}`, {
				race: selectedSpeciesData.name
			});

			for (const feature of selectedSpeciesData.speciesFeatures || []) {
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




	// --- onMount for feature restoration ---
	onMount(() => {
		// Set up window resize listener for responsive behavior
		updateWindowWidth();
		window.addEventListener('resize', updateWindowWidth);
		
		// Cleanup function
		return () => {
			window.removeEventListener('resize', updateWindowWidth);
		};
		
		const state = get(character_store);

		if (state.race) {
			// Find race or subrace
			let found: SpeciesData | SpeciesGroup | undefined = species.find((r) => r.name === state.race);
			if (!found) {
				for (const speciesItem of species) {
					if ("subraces" in speciesItem) {
						const sub = speciesItem.subraces.find((sr) => sr.name === state.race);
						if (sub) {
							found = sub;
							break;
						}
					}
				}
			}

			if (found && !("subraces" in found)) {
				selectedSpeciesData = found;
				featureSelections = {};

				// Prepare arrays for static features
				if (state.features && found.speciesFeatures) {
					for (const feature of found.speciesFeatures) {
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
					const featureDef = found.speciesFeatures?.find((f) => f.name === featureName);
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
								return label; // return original label, not snake_case key!
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
	<!-- Show conflict warnings for this tab -->
	<ConflictWarning tabName="species" />
	
	<p class="intro-text">
		There are many different species your character can be, each with their own special traits and abilities.
	</p>

	{#if !selectedSpeciesData}
		<div class="race-cards">
			<!-- Column 1 -->
			<div class="race-column">
				{#each column1Species as speciesInfo}
					{#if 'subraces' in speciesInfo}
						<!-- Parent race container -->
						<div class="parent-race-container">
						<!-- Parent race button -->
						<button
							type="button"
							class="race-card parent-race-button"
							on:click={() => toggleSpeciesExpand(speciesInfo.name)}
							aria-expanded={expandedSpecies.has(speciesInfo.name)}
						>
							<div class="card-left">
								<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
								<span>{speciesInfo.name}</span>
							</div>
							<img
								class="card-arrow"
								src="{base}/basic_icons/blue_next.png"
								alt="toggle subraces"
							/>
						</button>

						{#if expandedSpecies.has(speciesInfo.name)}
							<div class="subrace-cards-container">
								{#each speciesInfo.subraces as subrace}
									<button
										class="race-card subrace-card"
										on:click={() => (selectedSpecies = subrace)}
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
							on:click={() => (selectedSpecies = speciesInfo)}
						>
							<div class="card-left">
								<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
								<span>{speciesInfo.name}</span>
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

			<!-- Column 2 -->
			<div class="race-column">
				{#each column2Species as speciesInfo}
					{#if 'subraces' in speciesInfo}
						<!-- Parent race container -->
						<div class="parent-race-container">
						<!-- Parent race button -->
						<button
							type="button"
							class="race-card parent-race-button"
							on:click={() => toggleSpeciesExpand(speciesInfo.name)}
							aria-expanded={expandedSpecies.has(speciesInfo.name)}
						>
							<div class="card-left">
								<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
								<span>{speciesInfo.name}</span>
							</div>
							<img
								class="card-arrow"
								src="{base}/basic_icons/blue_next.png"
								alt="toggle subraces"
							/>
						</button>

						{#if expandedSpecies.has(speciesInfo.name)}
							<div class="subrace-cards-container">
								{#each speciesInfo.subraces as subrace}
									<button
										class="race-card subrace-card"
										on:click={() => (selectedSpecies = subrace)}
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
							on:click={() => (selectedSpecies = speciesInfo)}
						>
							<div class="card-left">
								<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
								<span>{speciesInfo.name}</span>
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

			<!-- Column 3 -->
			<div class="race-column">
				{#each column3Species as speciesInfo}
					{#if 'subraces' in speciesInfo}
						<!-- Parent race container -->
						<div class="parent-race-container">
						<!-- Parent race button -->
						<button
							type="button"
							class="race-card parent-race-button"
							on:click={() => toggleSpeciesExpand(speciesInfo.name)}
							aria-expanded={expandedSpecies.has(speciesInfo.name)}
						>
							<div class="card-left">
								<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
								<span>{speciesInfo.name}</span>
							</div>
							<img
								class="card-arrow"
								src="{base}/basic_icons/blue_next.png"
								alt="toggle subraces"
							/>
						</button>

						{#if expandedSpecies.has(speciesInfo.name)}
							<div class="subrace-cards-container">
								{#each speciesInfo.subraces as subrace}
									<button
										class="race-card subrace-card"
										on:click={() => (selectedSpecies = subrace)}
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
							on:click={() => (selectedSpecies = speciesInfo)}
						>
							<div class="card-left">
								<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
								<span>{speciesInfo.name}</span>
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
		</div>
	{/if}



	{#if selectedSpecies}
		<!-- Popup Preview -->
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<span>CONFIRM ADD SPECIES</span>
					<button class="close-button" on:click={() => (selectedSpecies = null)}>×</button>
				</div>

				<div class="popup-body">
					<h2>{selectedSpecies.name}</h2>
					<p class="description">{selectedSpecies.description}</p>

					{#each selectedSpecies.speciesFeatures as feature}
						<div class="feature-card">
							<h4>{feature.name}</h4>
							<p>{@html feature.description}</p>
						</div>
					{/each}
				</div>

				<div class="popup-footer">
					<button class="cancel-button" on:click={() => (selectedSpecies = null)}>Cancel</button>
					<button class="add-button" on:click={confirmAddSpecies}>Add Species</button>
				</div>
			</div>
		</div>
	{/if}

	{#if selectedSpeciesData}
		<!-- Selected race view -->
		<div class="selected-race-card">
			<div class="selected-race-info">
				<img
					src={selectedSpeciesData.image}
					alt={`${selectedSpeciesData.name} icon`}
					class="selected-race-icon"
				/>
				<div class="selected-race-text">
					<h2>{selectedSpeciesData.name}</h2>
					<p class="description">{selectedSpeciesData.description}</p>
				</div>
				<button
					class="remove-race-button"
					on:click={removeSelectedSpecies}
					aria-label="Remove selected species"
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
		gap: 1rem;
		margin-top: 2rem;
		padding: 0 1rem; /* add horizontal padding */
		width: 100%;
		box-sizing: border-box;
	}

	/* Individual columns */
	.race-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Responsive columns behavior */
	@media (max-width: 768px) {
		.race-cards {
			flex-direction: column;
		}
		
		.race-column {
			flex: none;
		}
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
		width: 100%; /* fill column */
		min-width: 220px; /* optional: ensure not too narrow on small screens */
		box-sizing: border-box;
		margin-bottom: 1rem; /* space between species */
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
