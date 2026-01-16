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
	import { isFeatureIncomplete, effectNeedsChoice } from '$lib/components/feature-card-utils';
	import FeatureDescription from '$lib/components/FeatureDescription.svelte';
import EnhancedPopup from '$lib/components/EnhancedPopup.svelte';

	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';
	import { getSpellAccessForCharacter, getSpellsByLevel } from '$lib/data/spells';
	import FeatureCardList from '$lib/components/FeatureCardList.svelte';
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';

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

	// Spell limit warning state management
	let showSpellLimitWarning = false;
	let spellLimitWarningInfo = { currentCount: 0, newLimit: 0, excessCount: 0, abilityName: '' };

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

	/**
	 * Calculate ability modifier from ability score
	 */
	function getModifier(score: number): number {
		return Math.floor((score - 10) / 2);
	}

	/**
	 * Validate spell limits when species is about to be removed
	 * This checks if removing the species ability bonuses would cause spell limit violations
	 */
	function validateSpellLimitBeforeRemoval(): boolean {
		const currentCharacter = get(character_store);

		// Only validate if character has spells selected
		if (!currentCharacter.spells || currentCharacter.spells.length === 0) {
			return true; // No spells, no problem
		}

		// Only check for Cleric (WIS) and Paladin (CHA)
		if (currentCharacter.class !== 'Cleric' && currentCharacter.class !== 'Paladin') {
			return true; // Not a class with ability-based spell limits
		}

		if (!selectedSpeciesData) {
			return true; // No species selected
		}

		// Calculate what ability scores would be WITHOUT the species bonuses
		// We need to check what ability bonuses this species provides
		const tempCharacter = { ...currentCharacter };
		const abilityModifications: Record<string, number> = {};

		// Collect all ability modifications from this species by checking provenance
		// We only collect from provenance _mods to get the actual applied bonuses
		const prov = currentCharacter._provenance || {};
		const allFeatures = selectedSpeciesData.speciesFeatures || [];
		
		for (const feature of allFeatures) {
			// Look for provenance entries for this feature
			for (const [key, value] of Object.entries(prov)) {
				if (key.startsWith(`feature:${feature.name}`)) {
					const storedMods = (value as any)?._mods || {};
					for (const [modKey, modValue] of Object.entries(storedMods)) {
						if (!abilityModifications[modKey]) {
							abilityModifications[modKey] = 0;
						}
						abilityModifications[modKey] += modValue as number;
					}
				}
			}
		}

		// Calculate what ability scores would be after removing species
		const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
		for (const ability of abilities) {
			const currentScore = (currentCharacter as any)[ability] || 10;
			const bonus = abilityModifications[ability] || 0;
			(tempCharacter as any)[ability] = currentScore - bonus;
		}

		// Now check spell limits with the new ability scores
		let abilityName = '';
		let newModifier = 0;
		let newSpellLimit = 0;

		if (currentCharacter.class === 'Cleric') {
			abilityName = 'Wisdom';
			const newWisdom = tempCharacter.wisdom || 10;
			newModifier = getModifier(newWisdom);
			newSpellLimit = Math.max(1, newModifier + 3);
		} else if (currentCharacter.class === 'Paladin') {
			abilityName = 'Charisma';
			const newCharisma = tempCharacter.charisma || 10;
			newModifier = getModifier(newCharisma);
			newSpellLimit = Math.max(1, newModifier + 1);
		}

		// Get current prepared spell count (excluding always-prepared spells)
		const spellAccess = getSpellAccessForCharacter(currentCharacter);
		const alwaysPreparedSpells = spellAccess
			.filter(
				(access) =>
					access.chooseable === false ||
					(access.source === 'subclass' &&
						(access.sourceName?.includes('Domain') || access.sourceName?.includes('Oath')))
			)
			.flatMap((access) => access.spells || []);

		// Get list of all cantrip names to exclude them from the count
		const allCantrips = getSpellsByLevel(0);
		const cantripNames = new Set(allCantrips.map((spell) => spell.name));

		// Filter to only count leveled spells (exclude cantrips and always-prepared spells)
		// NOTE: currentCharacter.spells may contain strings OR objects with a 'name' property
		const preparedSpells = currentCharacter.spells.filter((spell) => {
			// Extract spell name (handle both string and object formats)
			const spellName = typeof spell === 'string' ? spell : spell.name;
			return !alwaysPreparedSpells.includes(spellName) && !cantripNames.has(spellName);
		});

		// If current prepared spells exceed new limit, show warning
		if (preparedSpells.length > newSpellLimit) {
			const excessCount = preparedSpells.length - newSpellLimit;
			spellLimitWarningInfo = {
				currentCount: preparedSpells.length,
				newLimit: newSpellLimit,
				excessCount: excessCount,
				abilityName: abilityName
			};
			showSpellLimitWarning = true;
			return false; // Validation failed
		} else {
			// Hide warning if spell count is within limits
			showSpellLimitWarning = false;
			return true; // Validation passed
		}
	}

	function dismissSpellLimitWarning() {
		showSpellLimitWarning = false;
	}

	function removeSelectedSpecies() {
		// First, validate spell limits
		validateSpellLimitBeforeRemoval();

		if (selectedSpeciesData) {
			// Use character_store.update() to ensure the store is properly updated
			character_store.update((state) => {
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

				// Revert all changes related to this species
				for (const key of provKeys) {
					if (prefixes.some((prefix) => key.startsWith(prefix))) {
						// revertChanges mutates state in place and returns it
						state = revertChanges(state, key);
					}
				}

				return state; // Return the modified state to update the store
			});
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

			// Determine if this is a subrace by checking if it's part of a species group
			let parentRace: string | null = null;
			for (const speciesItem of species) {
				if ('subraces' in speciesItem && speciesItem.subraces.includes(selectedSpeciesData)) {
					parentRace = speciesItem.name;
					break;
				}
			}

			if (parentRace) {
				// This is a subrace - set both race and subrace
				applyChoice(`race:${selectedSpeciesData.name}`, {
					race: parentRace,
					subrace: selectedSpeciesData.name
				});
			} else {
				// This is a main race - just set race
				applyChoice(`race:${selectedSpeciesData.name}`, {
					race: selectedSpeciesData.name
				});
			}

			for (const feature of selectedSpeciesData.speciesFeatures || []) {
				if (feature.featureOptions) {
					// Features with options: apply only static effects now, user choices later
					applyStaticEffectsForFeatureOnce(feature);
				} else {
					// Features without options: apply all effects immediately
					const scopeId = `feature:${feature.name}`;
					revertChanges(get(character_store), scopeId); // just in case

					// Collect updates from all effects (no user choices needed)
					const update: Record<string, any> = {};
					const modify: Record<string, number> = {};

					for (const effect of feature.effects || []) {
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

					// Apply the feature effects
					applyChoice(scopeId, update, modify);
				}
			}

			bumpVersion();
		}
	}

	// --- onMount for feature restoration ---
	onMount(() => {
		// Set up window resize listener for responsive behavior
		updateWindowWidth();
		window.addEventListener('resize', updateWindowWidth);

		const state = get(character_store);

		if (state.race) {
			// New format: look for subrace first if it exists
			let found: SpeciesData | SpeciesGroup | undefined;

			if (state.subrace) {
				// Look for the subrace in species groups
				for (const speciesItem of species) {
					if ('subraces' in speciesItem) {
						const sub = speciesItem.subraces.find((sr) => sr.name === state.subrace);
						if (sub) {
							found = sub;
							break;
						}
					}
				}
			} else {
				// Legacy format or species without subraces: look for exact race match
				found = species.find((r) => r.name === state.race);

				// If not found, maybe race is actually a subrace name (legacy)
				if (!found) {
					for (const speciesItem of species) {
						if ('subraces' in speciesItem) {
							const sub = speciesItem.subraces.find((sr) => sr.name === state.race);
							if (sub) {
								found = sub;
								break;
							}
						}
					}
				}
			}

			if (found && !('subraces' in found)) {
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

				const toSnakeCase = (str: string) => str.toLowerCase().replace(/\s+/g, '_');

				// Restore dynamic selections from provenance
				const prov = state._provenance || {};
				for (const key of Object.keys(prov)) {
					if (!key.startsWith('feature:')) continue;
					const parts = key.split(':'); // feature:FeatureName:<index|static>
					if (parts.length < 3) continue;
					const featureName = parts[1];
					const indexStr = parts[2];
					if (indexStr === 'static') continue;

					const index = Number.isFinite(parseInt(indexStr, 10)) ? parseInt(indexStr, 10) : null;
					if (index === null) continue;

					const stored: any = prov[key];
					const featureDef = found.speciesFeatures?.find((f) => f.name === featureName);
					if (!featureDef) continue;

					const opts = featureDef.featureOptions?.options || [];

					// Build map: snake_case => label
					const optionMap = new Map(
						opts.map((o) => {
							const label = typeof o === 'string' ? o : o.name;
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
							} else if (typeof arr === 'string') {
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

		// Return cleanup function at the end
		return () => {
			window.removeEventListener('resize', updateWindowWidth);
		};
	});
</script>

<div class="main-content">
	<!-- Show conflict warnings for this tab -->
	<ConflictWarning tabName="species" />

	<p class="intro-text">
		There are many different species your character can be, each with their own special traits and
		abilities.
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
							<button class="race-card" on:click={() => (selectedSpecies = speciesInfo)}>
								<div class="card-left">
									<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
									<span>{speciesInfo.name}</span>
								</div>
								<img class="card-arrow" src="{base}/basic_icons/blue_next.png" alt="next arrow" />
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
							<button class="race-card" on:click={() => (selectedSpecies = speciesInfo)}>
								<div class="card-left">
									<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
									<span>{speciesInfo.name}</span>
								</div>
								<img class="card-arrow" src="{base}/basic_icons/blue_next.png" alt="next arrow" />
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
							<button class="race-card" on:click={() => (selectedSpecies = speciesInfo)}>
								<div class="card-left">
									<img src={speciesInfo.image} alt={`${speciesInfo.name} icon`} />
									<span>{speciesInfo.name}</span>
								</div>
								<img class="card-arrow" src="{base}/basic_icons/blue_next.png" alt="next arrow" />
							</button>
						</div>
					{/if}
				{/each}
			</div>
		</div>
		
		<div class="quiz-link-container">
			<a href="{base}/species-quiz" class="quiz-link">
				Not sure? Take the Species quiz!
			</a>
		</div>
	{/if}

	{#if selectedSpecies}
		<!-- Enhanced Popup Preview -->
		<EnhancedPopup
			title="Add {selectedSpecies.name} to Character"
			itemName={selectedSpecies.name}
			isOpen={selectedSpecies !== null}
			onClose={() => selectedSpecies = null}
			onConfirm={confirmAddSpecies}
			confirmText="Add Species"
			flavorText={selectedSpecies.enhancedFlavor || selectedSpecies.description}
			cultureNotes={selectedSpecies.cultureNotes}
			imagePath={selectedSpecies.popupImage || selectedSpecies.image}
			imageAlt={`${selectedSpecies.name} artwork`}
		/>
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
				bind:featureSelections
				bind:expandedFeatures
				{selectionVersion}
				characterStore={character_store}
				onBumpVersion={() => selectionVersion++}
			/>
		</div>
	{/if}
</div>

<!-- Spell Limit Warning Banner -->
{#if showSpellLimitWarning}
	<div class="spell-limit-warning-banner">
		<div class="warning-content">
			<div class="warning-icon">⚠️</div>
			<div class="warning-text">
				<h3>Spell Limit Exceeded</h3>
				<p>
					Removing this species will reduce your {spellLimitWarningInfo.abilityName} bonus, which decreases
					your prepared spell limit. You currently have
					<strong>{spellLimitWarningInfo.currentCount} prepared spells</strong> but would only be able to prepare
					<strong>{spellLimitWarningInfo.newLimit}</strong>. Please visit the
					<a href="{base}/spells">Spells page</a>
					to remove
					<strong
						>{spellLimitWarningInfo.excessCount} spell{spellLimitWarningInfo.excessCount > 1
							? 's'
							: ''}</strong
					>
					before changing your species.
				</p>
			</div>
			<button class="warning-dismiss" on:click={dismissSpellLimitWarning} title="Dismiss warning">
				×
			</button>
		</div>
	</div>
{/if}

<style>
	.main-content {
		padding: var(--spacing-8) var(--spacing-4);
		padding-top: 80px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.intro-text {
		max-width: 50vw;
		margin: 0 auto;
		text-align: center;
		font-size: var(--font-size-md);
		color: var(--color-text-secondary);
	}

	/* Container for all race cards */
	.race-cards {
		display: flex;
		gap: var(--spacing-4);
		margin-top: var(--spacing-8);
		padding: 0 var(--spacing-8);
		width: 100%;
		box-sizing: border-box;
	}

	/* Individual columns */
	.race-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	/* Responsive columns behavior */
	@media (max-width: 768px) {
		.race-cards {
			flex-direction: column;
			padding: 0 var(--spacing-4);
		}

		.race-column {
			flex: none;
		}
	}

	@media (max-width: 480px) {
		.race-cards {
			padding: 0 var(--spacing-2);
		}
	}

	/* Individual race card (single or parent) */
	.race-card {
		width: 100%; /* fill parent width */
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-4) var(--spacing-6);
		font-size: var(--font-size-lg);
		cursor: pointer;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-background-alt);
		transition: background-color var(--transition-base);
		text-align: left;
	}

	.card-left {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
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
		transition: transform var(--transition-base);
	}

	.race-card:hover,
	.race-card:focus {
		background-color: var(--color-neutral-200);
		outline: none;
	}

	.race-card:focus {
		box-shadow: var(--shadow-focus);
	}

	/* Parent + subrace grouping */
	.parent-race-container {
		display: flex;
		flex-direction: column; /* stack parent + subraces */
		width: 100%; /* fill column */
		min-width: 220px; /* optional: ensure not too narrow on small screens */
		box-sizing: border-box;
		margin-bottom: var(--spacing-1); /* reduced space between species */
	}

	.parent-race-button {
		width: 100%; /* fill container */
	}

	.subrace-cards-container {
		display: flex;
		flex-direction: column; /* stack subraces vertically */
		gap: var(--spacing-2);
		width: 100%; /* fill parent container */
		padding-left: 5rem; /* indent for nesting */
		box-sizing: border-box;
		margin-top: var(--spacing-2);
	}

	/* Subrace card styling */
	.subrace-card {
		width: 100%; /* fill subrace container */
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-3) var(--spacing-4);
		border-radius: var(--radius-md);
		border: 2px solid var(--color-neutral-400);
		background-color: var(--color-neutral-50);
		cursor: pointer;
	}

	.subrace-card img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}

	.subrace-card:hover,
	.subrace-card:focus {
		background-color: var(--color-neutral-100);
	}

	/* Popup and modal styles remain unchanged */
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: var(--color-overlay);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.popup-content {
		background: var(--color-background);
		width: 50vw;
		height: 80vh;
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: var(--shadow-2xl);
	}

	.popup-header {
		background: var(--color-primary-dark);
		color: white;
		padding: var(--spacing-3) var(--spacing-4);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: var(--font-weight-bold);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.close-button {
		background: none;
		border: none;
		color: white;
		font-size: var(--font-size-lg);
		cursor: pointer;
	}

	.popup-body {
		padding: var(--spacing-4);
		overflow-y: auto;
		flex: 1;
	}

	.description {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		margin-bottom: var(--spacing-4);
	}

	.selected-race-card {
		max-width: 50vw;
		margin: var(--spacing-8) auto var(--spacing-4) auto;
		padding: var(--spacing-4) var(--spacing-6);
		border: 2px solid var(--color-neutral-500);
		border-radius: var(--radius-lg);
		background-color: var(--color-neutral-50);
		box-shadow: var(--shadow-md);
	}

	.selected-race-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
	}

	.selected-race-icon {
		width: 60px;
		height: 60px;
		object-fit: contain;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
	}

	.selected-race-text {
		flex-grow: 1;
	}

	.selected-race-text h2 {
		margin: 0;
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-lg);
	}

	.remove-race-button {
		font-size: var(--font-size-xl);
		cursor: pointer;
		background: none;
		border: none;
		color: var(--color-warning);
		padding: var(--spacing-1) var(--spacing-2);
		border-radius: var(--radius-sm);
		transition: background-color var(--transition-base);
	}
	.remove-race-button:hover {
		background-color: var(--color-warning-bg);
	}

	/* Feature card styling for popup content */
	.feature-card {
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		padding: var(--spacing-3);
		margin-bottom: var(--spacing-3);
		background-color: var(--color-neutral-50);
	}

	.feature-card h4 {
		margin: 0 0 var(--spacing-2) 0;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
	}

	.feature-card p {
		margin: 0;
		font-size: 0.9rem;
		color: #555;
		line-height: 1.4;
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

	/* Spell Limit Warning Banner Styles */
	.spell-limit-warning-banner {
		position: fixed;
		top: 70px; /* Below navbar */
		left: 0;
		right: 0;
		z-index: 1000;
		background: linear-gradient(135deg, #fef3c7, #fde68a); /* Warm yellow gradient */
		border: 2px solid #f59e0b; /* Orange border */
		border-radius: 8px;
		margin: 0 16px;
		box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
		animation: slideDown 0.3s ease-out;
	}

	.warning-content {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 16px 20px;
	}

	.warning-icon {
		font-size: 24px;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.warning-text {
		flex: 1;
	}

	.warning-text h3 {
		margin: 0 0 8px 0;
		color: #92400e; /* Darker amber */
		font-size: 1.1rem;
		font-weight: 600;
	}

	.warning-text p {
		margin: 0;
		color: #78350f; /* Dark amber */
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.warning-text a {
		color: #1d4ed8; /* Blue link */
		text-decoration: underline;
		font-weight: 500;
	}

	.warning-text a:hover {
		color: #1e40af;
	}

	.warning-dismiss {
		background: none;
		border: none;
		color: #92400e;
		font-size: 24px;
		font-weight: bold;
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: background-color 0.2s;
		flex-shrink: 0;
	}

	.warning-dismiss:hover {
		background-color: rgba(146, 64, 14, 0.1);
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.quiz-link-container {
		margin-top: 2rem;
		text-align: center;
	}

	.quiz-link {
		color: #2563eb;
		font-size: 1.1rem;
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	.quiz-link:hover {
		color: #1d4ed8;
	}
</style>
