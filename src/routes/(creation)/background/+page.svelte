<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import FeatureCardList from '$lib/components/FeatureCardList.svelte';
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';
	import { isFeatureIncomplete } from '$lib/components/feature-card-utils';
	import FeatureDescription from '$lib/components/FeatureDescription.svelte';

	// Import all backgrounds
	import { backgrounds } from '$lib/data/backgrounds/index';
	import type { BackgroundData } from '$lib/data/types/BackgroundData';
	import type { FeaturePrompt } from '$lib/data/types/Features';

	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';

	// Class-to-backgrounds mapping for simple view
	const classBackgroundsMap: Record<string, string[]> = {
		'Barbarian': ['Pirate', 'Outlander', 'Soldier'],
		'Bard': ['Charlatan', 'Entertainer', 'Guild Artisan'],
		'Cleric': ['Acolyte', 'Hermit', 'Noble', 'Sage'],
		'Druid': ['Hermit', 'Outlander', 'Pirate'],
		'Fighter': ['Entertainer', 'Folk Hero', 'Soldier'],
		'Monk': ['Criminal', 'Urchin', 'Sage'],
		'Paladin': ['Acolyte', 'Noble', 'Soldier'],
		'Ranger': ['Folk Hero', 'Hermit', 'Outlander'],
		'Rogue': ['Charlatan', 'Criminal', 'Pirate', 'Urchin'],
		'Sorcerer': ['Noble', 'Sage', 'Guild Artisan'],
		'Warlock': ['Criminal', 'Entertainer', 'Sage'],
		'Wizard': ['Hermit', 'Sage', 'Noble']
	};

	// Track whether to show simple or complex view
	const showSimpleView = writable(true);

	let selectedBackground: BackgroundData | null = null;
	let selectedBackgroundData: BackgroundData | null = null;

	// featureSelections maps feature.name -> array of picks (by index)
	let featureSelections: Record<string, (string | null)[]> = {};

	let expandedFeatures = new Set<string>();

	// Used to force Svelte to re-create <select> nodes so option lists refresh instantly
	let selectionVersion = 0;

	// Compute the backgrounds to display based on the view mode and selected class
	$: displayedBackgrounds = $showSimpleView && $character_store.class
		? backgrounds.filter(bg => {
				const classRecommendations = classBackgroundsMap[$character_store.class] || [];
				return classRecommendations.includes(bg.name);
			})
		: backgrounds;

	function bumpVersion() {
		selectionVersion = (selectionVersion + 1) % 1_000_000;
	}

	// Current feature list for the selected background
	$: mergedFeatures = selectedBackgroundData
		? [...(selectedBackgroundData.backgroundFeatures || [])]
		: [];

	// Check feature completion status
	$: featureStatuses = mergedFeatures.map((feature) => ({
		feature,
		incomplete: isFeatureIncomplete(feature, featureSelections)
	}));

	function removeSelectedBackground() {
		if (selectedBackgroundData) {
			const state = get(character_store);
			const provKeys = Object.keys(state._provenance || {});

			// Recursively collect all features & nested prompts
			function collectFeatureNames(features: FeaturePrompt[]): string[] {
				const names: string[] = [];
				for (const feat of features) {
					names.push(feat.name);
					if (feat.featureOptions && feat.featureOptions.options) {
						for (const opt of feat.featureOptions.options) {
							if (typeof opt !== 'string' && opt.nestedPrompts) {
								names.push(...collectFeatureNames(opt.nestedPrompts));
							}
						}
					}
				}
				return names;
			}

			const allFeatureNames = collectFeatureNames(selectedBackgroundData.backgroundFeatures || []);

			const prefixes = [
				`background:${selectedBackgroundData.name}`,
				...allFeatureNames.map((f) => `feature:${f}`),
				'background_equipment_' // Remove all background equipment when changing background
			];

			for (const key of provKeys) {
				if (prefixes.some((prefix) => key.startsWith(prefix))) {
					revertChanges(state, key);
				}
			}
		}

		selectedBackgroundData = null;
		selectedBackground = null;
		featureSelections = {};
		expandedFeatures = new Set();
		bumpVersion();
	}

	function confirmAddBackground() {
		if (selectedBackground) {
			selectedBackgroundData = selectedBackground;
			selectedBackground = null;
			featureSelections = {};
			expandedFeatures = new Set();

			applyChoice(`background:${selectedBackgroundData.name}`, {
				background: selectedBackgroundData.name
			});

			for (const feature of selectedBackgroundData.backgroundFeatures || []) {
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
							modify[target] = (modify[target] || 0) + value;
							break;
						}
					}
				}

				// Apply collected changes
				if (Object.keys(update).length > 0 || Object.keys(modify).length > 0) {
					applyChoice(scopeId, update, modify);
				}
			}

			// Initialize feature selection data
			for (const feature of selectedBackgroundData.backgroundFeatures || []) {
				if (feature.featureOptions) {
					const numPicks = feature.featureOptions.numPicks;
					featureSelections[feature.name] = new Array(numPicks).fill(null);
				}
			}

			bumpVersion();
		}
	}

	// Helper function needed by onMount
	function ensureArrayLen(arr: (string | null)[], len: number) {
		if (arr.length < len) {
			const oldLen = arr.length;
			arr.length = len;
			for (let i = oldLen; i < len; i++) arr[i] = null;
		}
	}

		// Check for existing background selection on mount and restore feature selections
	onMount(async () => {
		const state = get(character_store);
		if (!state.background) {
			console.log('[BG DEBUG] No background selected, skipping restoration');
			return;
		}

		console.log('[BG DEBUG] Starting background restoration for:', state.background);

		// Find selected background
		const found = backgrounds.find((bg) => bg.name === state.background);
		if (!found) {
			console.log('[BG DEBUG] Background not found in data:', state.background);
			return;
		}

		console.log('[BG DEBUG] Found background data:', found.name, 'with', found.backgroundFeatures?.length || 0, 'features');

		selectedBackgroundData = found;
		featureSelections = {};

		const toSnakeCase = (str: string) => str.toLowerCase().replace(/\s+/g, '_');

		// Helper: convert stored snake_case value to display label
		const tryRestoreFromValue = (val: string, optionMap: Map<string, string>) => {
			const snakeVal = toSnakeCase(val);
			console.log('[BG DEBUG] Trying to restore value:', val, '-> snake_case:', snakeVal);
			for (const [key, label] of optionMap.entries()) {
				if (snakeVal.includes(key)) {
					console.log('[BG DEBUG] Match found!', snakeVal, 'matches', key, '-> label:', label);
					return label;
				}
			}
			console.log('[BG DEBUG] No match found for:', snakeVal);
			return null;
		};

		// Helper: Check if a nested feature has deeper provenance
		const checkDeeperNestedProvenance = (feature: any, prov: any): boolean => {
			if (!feature.featureOptions?.options) return false;
			for (const opt of feature.featureOptions.options) {
				if (typeof opt !== 'string' && opt.nestedPrompts) {
					for (const nested of opt.nestedPrompts) {
						const hasNestedProv = Object.keys(prov).some(k => 
							k.startsWith(`feature:${nested.name}:`)
						);
						const hasDeeperProv = checkDeeperNestedProvenance(nested, prov);
						if (hasNestedProv || hasDeeperProv) return true;
					}
				}
			}
			return false;
		};

		// Recursive function to restore nested features with parent context
		const restoreNestedFeatureSelection = async (feature: FeaturePrompt, parentFeatureName: string, parentIndex: number) => {
			console.log('[BG DEBUG] Restoring nested feature:', feature.name, 'with parent:', parentFeatureName, 'index:', parentIndex);

			const numPicks = feature.featureOptions?.numPicks || 1;
			
			// Ensure the selection array exists
			if (!featureSelections[feature.name]) {
				featureSelections[feature.name] = Array(numPicks).fill(null);
			}
			
			const optionMap = new Map(
				(feature.featureOptions?.options || []).map((o) => [
					toSnakeCase(typeof o === 'string' ? o : o.name),
					typeof o === 'string' ? o : o.name
				])
			);

			const prov = state._provenance || {};

			for (let idx = 0; idx < numPicks; idx++) {
				// Skip if already restored
				if (featureSelections[feature.name][idx]) {
					console.log('[BG DEBUG] Nested feature', feature.name, 'index', idx, 'already restored');
					continue;
				}

				// Use the full nested path: parent_feature:parent_index:feature_name:index
				const key = `feature:${parentFeatureName}:${parentIndex}:${feature.name}:${idx}`;
				const stored: any = prov[key];

				console.log('[BG DEBUG] Nested restore: Feature', feature.name, 'parent', parentFeatureName, 'idx', idx, 'key', key, 'stored:', stored);

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
						} else if (typeof arr === 'string') {
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

				// If no direct provenance found, try to infer from deeper nested provenance
				if (!restored && feature.featureOptions?.options) {
					console.log('[BG DEBUG] Nested feature', feature.name, 'has no direct provenance, checking deeper nested options...');
					for (const opt of feature.featureOptions.options) {
						if (typeof opt !== 'string' && opt.nestedPrompts) {
							console.log('[BG DEBUG] Checking nested option', opt.name, 'with', opt.nestedPrompts.length, 'nested prompts');
							// Check if any deeper nested prompt of this option has provenance
							for (const nested of opt.nestedPrompts) {
								const hasNestedProv = Object.keys(prov).some(k => 
									k.startsWith(`feature:${parentFeatureName}:${parentIndex}:${feature.name}:${idx}:${nested.name}:`)
								);
								const hasDeeperProv = checkDeeperNestedProvenance(nested, prov);
								
								console.log('[BG DEBUG] Nested Feature', feature.name, 'Option', opt.name, 'Deeper Nested', nested.name, 'hasNestedProv:', hasNestedProv, 'hasDeeperProv:', hasDeeperProv);
								
								if (hasNestedProv || hasDeeperProv) {
									restored = opt.name;
									console.log('[BG DEBUG] Inferred nested selection:', opt.name, 'for nested feature', feature.name);
									break;
								}
							}
							if (restored) break;
						}
					}
				}

				if (restored) {
					featureSelections[feature.name][idx] = restored;
					console.log('[BG DEBUG] Set nested featureSelections[\'', feature.name, '\'][', idx, '] =', restored);
				}
			}
			
			// Recurse into deeper nested prompts if any
			if (feature.featureOptions?.options) {
				for (const o of feature.featureOptions.options) {
					if (typeof o !== 'string' && o.nestedPrompts) {
						const selectedVal = featureSelections[feature.name].find((v) => v === o.name);
						if (selectedVal) {
							for (const nested of o.nestedPrompts) {
								// Continue nesting with current feature as parent
								await restoreNestedFeatureSelection(nested, feature.name, 0);
							}
						}
					}
				}
			}
		};

		// Recursive function to restore a feature and its nested prompts
		const restoreFeatureSelection = async (feature: FeaturePrompt) => {
			console.log('[BG DEBUG] Processing feature:', feature.name, 'with options:', !!feature.featureOptions);

			// Skip features without options - they don't need restoration
			if (!feature.featureOptions) {
				console.log('[BG DEBUG] Skipping feature', feature.name, 'no featureOptions');
				return;
			}

			const numPicks = feature.featureOptions.numPicks || 1;
			console.log('[BG DEBUG] Feature', feature.name, 'numPicks:', numPicks);

			if (!featureSelections[feature.name]) {
				featureSelections[feature.name] = Array(numPicks).fill(null);
			} else {
				ensureArrayLen(featureSelections[feature.name], numPicks);
			}

			const opts = feature.featureOptions.options || [];
			const optionMap = new Map(
				opts.map((o) => [
					toSnakeCase(typeof o === 'string' ? o : o.name),
					typeof o === 'string' ? o : o.name
				])
			);
			console.log('[BG DEBUG] Feature', feature.name, 'has', opts.length, 'options:', opts.map(o => typeof o === 'string' ? o : o.name));

			const prov = state._provenance || {};
			console.log('[BG DEBUG] Provenance keys for', feature.name, ':', Object.keys(prov).filter(k => k.includes(feature.name)));

			for (let idx = 0; idx < numPicks; idx++) {
				// Skip if already restored
				if (featureSelections[feature.name][idx]) {
					console.log('[BG DEBUG] Feature', feature.name, 'index', idx, 'already restored');
					continue;
				}

				const key = `feature:${feature.name}:${idx}`;
				const stored: any = prov[key];

				console.log('[BG DEBUG] Restore: Feature', feature.name, 'idx', idx, 'key', key, 'stored:', stored);

				if (!stored) {
					console.log('[BG DEBUG] No stored data for key:', key);
					continue;
				}

				let restored: string | null = null;

				// Try to restore from _set values
				if (stored._set) {
					console.log('[BG DEBUG] Found _set data for', feature.name, ':', stored._set);
					
					// First try matching against effect targets
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
						} else if (typeof arr === 'string') {
							const maybe = tryRestoreFromValue(arr, optionMap);
							if (maybe) restored = maybe;
						}
						if (restored) break;
					}

					// If not found via effects, try all _set keys directly
					if (!restored) {
						console.log('[BG DEBUG] Trying all _set keys directly for', feature.name);
						for (const [setKey, setVal] of Object.entries(stored._set)) {
							console.log('[BG DEBUG] Checking _set key:', setKey, 'value:', setVal);
							if (Array.isArray(setVal)) {
								for (const val of setVal) {
									const maybe = tryRestoreFromValue(String(val), optionMap);
									if (maybe) {
										restored = maybe;
										break;
									}
								}
							} else if (typeof setVal === 'string') {
								const maybe = tryRestoreFromValue(setVal, optionMap);
								if (maybe) restored = maybe;
							}
							if (restored) break;
						}
					}
				}

				// Try to restore from _mods (for ability score bumps etc.)
				if (!restored && stored._mods) {
					console.log('[BG DEBUG] Trying _mods for', feature.name, ':', stored._mods);
					for (const modKey of Object.keys(stored._mods)) {
						const maybe = tryRestoreFromValue(modKey, optionMap);
						if (maybe) {
							restored = maybe;
							break;
						}
					}
				}

				// If no direct provenance found, try to infer from nested provenance
				// This handles features with empty effects
				if (!restored && feature.featureOptions?.options) {
					console.log('[BG DEBUG] Feature', feature.name, 'has no direct provenance, checking nested options...');
					for (const opt of feature.featureOptions.options) {
						if (typeof opt !== 'string' && opt.nestedPrompts) {
							console.log('[BG DEBUG] Checking option', opt.name, 'with', opt.nestedPrompts.length, 'nested prompts');
							// Check if any nested prompt of this option has provenance
							for (const nested of opt.nestedPrompts) {
								const hasNestedProv = Object.keys(prov).some(k => 
									k.startsWith(`feature:${nested.name}:`)
								);
								const hasDeeperProv = checkDeeperNestedProvenance(nested, prov);
								
								console.log('[BG DEBUG] Feature', feature.name, 'Option', opt.name, 'Nested', nested.name, 'hasNestedProv:', hasNestedProv, 'hasDeeperProv:', hasDeeperProv);
								
								if (hasNestedProv || hasDeeperProv) {
									restored = opt.name;
									console.log('[BG DEBUG] Inferred selection:', opt.name, 'for feature', feature.name);
									break;
								}
							}
							if (restored) break;
						}
					}
				}

				if (restored) {
					featureSelections[feature.name][idx] = restored;
					console.log('[BG DEBUG] Set featureSelections[\'', feature.name, '\'][', idx, '] =', restored);
				} else {
					console.log('[BG DEBUG] Failed to restore any value for feature:', feature.name, 'index:', idx);
				}
			}

			// Recurse into nested prompts if any
			if (feature.featureOptions?.options) {
				for (const o of feature.featureOptions.options) {
					if (typeof o !== 'string' && o.nestedPrompts) {
						const selectedVal = featureSelections[feature.name].find((v) => v === o.name);
						if (selectedVal) {
							console.log('[BG DEBUG] Found selection for', o.name, 'restoring nested prompts');
							for (const nested of o.nestedPrompts) {
								// Pass parent context to nested restoration
								await restoreNestedFeatureSelection(nested, feature.name, 0);
							}
						} else {
							// Even if parent selection is not restored, check if nested prompts have provenance data
							// This handles cases where the parent selection restoration failed but nested data exists
							console.log('[BG DEBUG] Parent selection for', o.name, 'not found, checking for nested provenance');
							for (const nested of o.nestedPrompts) {
								// Check for provenance at any index for this nested feature
								const hasNestedProvenance = Object.keys(prov).some(k => 
									k.startsWith(`feature:${nested.name}:`)
								);
								
								// Also recursively check if any deeper nested features have provenance
								const hasDeeperNestedProvenance = checkDeeperNestedProvenance(nested, prov);
								
								if (hasNestedProvenance || hasDeeperNestedProvenance) {
									console.log('[BG DEBUG] Found nested provenance for', nested.name, 'forcing parent selection');
									// Force parent selection to match this nested data existence
									if (!featureSelections[feature.name].includes(o.name)) {
										// Find first empty slot and set the parent selection
										const emptyIdx = featureSelections[feature.name].findIndex((v) => v === null);
										if (emptyIdx !== -1) {
											featureSelections[feature.name][emptyIdx] = o.name;
											console.log('[BG DEBUG] Set parent selection', o.name, 'at index', emptyIdx);
										}
									}
									// Now restore the nested prompt with parent context
									await restoreNestedFeatureSelection(nested, feature.name, 0);
								}
							}
						}
					}
				}
			}
		};

		// Restore all top-level features that have options
		console.log('[BG DEBUG] Starting restoration of', found.backgroundFeatures?.length || 0, 'background features');
		for (const feature of found.backgroundFeatures || []) {
			await restoreFeatureSelection(feature);
		}

		console.log('[BG DEBUG] Final featureSelections:', featureSelections);

		// Trigger Svelte reactivity
		featureSelections = { ...featureSelections };
		bumpVersion();
		console.log('[BG DEBUG] Background restoration completed');
	});
</script>

<div class="main-content">
	<!-- Show conflict warnings for this tab -->
	<ConflictWarning tabName="background" />

	<p class="intro-text">
		Your character's background reveals where you came from, how you became an adventurer, and your
		place in the world. Backgrounds provide skill proficiencies, languages, equipment, and special
		features that reflect your past experiences.
	</p>

	{#if !selectedBackgroundData}
		<!-- Floating toggle slider in bottom right -->
		{#if $character_store.class}
			<div class="floating-toggle">
				<div class="toggle-label">{$showSimpleView ? 'Recommended' : 'All Options'}</div>
				<label class="toggle-switch">
					<input 
						type="checkbox" 
						checked={!$showSimpleView}
						on:change={() => showSimpleView.set(!$showSimpleView)}
					/>
					<span class="toggle-slider"></span>
				</label>
			</div>
		{/if}

		{#if $showSimpleView && $character_store.class}
			<!-- Simple view with descriptions expanded -->
			<div class="simple-background-cards">
				{#each displayedBackgrounds as backgroundInfo}
					<div class="simple-background-card">
						<div class="simple-card-header">
							<img src={backgroundInfo.image} alt={`${backgroundInfo.name} icon`} class="simple-card-icon" />
							<h3>{backgroundInfo.name}</h3>
						</div>
						<p class="simple-card-description">{backgroundInfo.description}</p>
						<button 
							class="select-background-button" 
							on:click={() => (selectedBackground = backgroundInfo)}
						>
							Select {backgroundInfo.name}
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Complex view with all options (original grid) -->
			<div class="background-cards">
				{#each displayedBackgrounds as backgroundInfo}
					<button class="background-card" on:click={() => (selectedBackground = backgroundInfo)}>
						<div class="card-left">
							<img src={backgroundInfo.image} alt={`${backgroundInfo.name} icon`} />
							<span>{backgroundInfo.name}</span>
						</div>
						<img class="card-arrow" src="{base}/basic_icons/blue_next.png" alt="next arrow" />
					</button>
				{/each}
			</div>
		{/if}
	{/if}

	{#if selectedBackground}
		<!-- Popup Preview -->
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<span>CONFIRM ADD BACKGROUND</span>
					<button class="close-button" on:click={() => (selectedBackground = null)}>×</button>
				</div>

				<div class="popup-body">
					<p class="description">{selectedBackground.description}</p>

					{#each selectedBackground.backgroundFeatures as feature}
						<div class="feature-card">
							<h4>{feature.name}</h4>
							<FeatureDescription description={feature.description} />
						</div>
					{/each}
				</div>

				<div class="popup-footer">
					<button class="cancel-button" on:click={() => (selectedBackground = null)}>Cancel</button>
					<button class="add-button" on:click={confirmAddBackground}>Add Background</button>
				</div>
			</div>
		</div>
	{/if}

	{#if selectedBackgroundData}
		<!-- Selected background view -->
		<div class="selected-background-card">
			<div class="selected-background-info">
				<img
					src={selectedBackgroundData.image}
					alt={`${selectedBackgroundData.name} icon`}
					class="selected-background-icon"
				/>
				<div class="selected-background-text">
					<h2>{selectedBackgroundData.name}</h2>
					<p class="description">{selectedBackgroundData.description}</p>
				</div>
				<button
					class="remove-background-button"
					on:click={removeSelectedBackground}
					aria-label="Remove selected background"
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

	.background-cards {
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
		.background-cards {
			grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
			gap: 0.75rem; /* slightly smaller gap on tablets */
			padding: 0 1rem; /* medium padding on tablets */
		}
	}

	@media (max-width: 480px) {
		.background-cards {
			grid-template-columns: 1fr; /* single column on mobile */
			gap: 0.5rem; /* smaller gap on mobile */
			padding: 0 0.5rem; /* reduced padding on mobile */
		}
	}

	.background-card {
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

	.background-card img {
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

	.background-card:hover,
	.background-card:focus {
		background-color: #e0e0e0;
		outline: none;
	}

	.background-card:focus {
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

	.background-details {
		margin-bottom: 1.5rem;
	}

	.detail-section {
		margin-bottom: 1rem;
	}

	.detail-section h4 {
		font-weight: bold;
		margin-bottom: 0.25rem;
		color: #333;
	}

	.detail-section p {
		color: #666;
		margin: 0;
		font-size: 0.9rem;
	}

	.detail-section ul {
		margin: 0;
		padding-left: 1.5rem;
		color: #666;
		font-size: 0.9rem;
	}

	.feature-card {
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 12px;
		margin-bottom: 12px;
		background-color: #f9f9f9;
	}

	.feature-card h4 {
		margin: 0 0 8px 0;
		font-size: 1rem;
		font-weight: bold;
		color: #333;
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

	.selected-background-card {
		max-width: 50vw;
		margin: 2rem auto 1rem auto;
		padding: 1rem 1.5rem;
		border: 2px solid #888;
		border-radius: 8px;
		background-color: #fafafa;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}

	.selected-background-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.selected-background-icon {
		width: 50px;
		height: 50px;
		object-fit: contain;
	}

	.selected-background-text {
		flex: 1;
	}

	.selected-background-text h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #333;
	}

	.selected-background-text .description {
		margin: 0.25rem 0 0 0;
		color: #666;
		font-size: 0.9rem;
	}

	.remove-background-button {
		font-size: 1.5rem;
		cursor: pointer;
		background: none;
		border: none;
		color: #c00;
		padding: 4px 8px;
		border-radius: 4px;
		transition: background-color 0.2s ease;
		margin-left: auto;
		flex-shrink: 0;
	}

	.remove-background-button:hover {
		background-color: #fdd;
	}

	/* Floating toggle slider */
	.floating-toggle {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background-color: white;
		border: 2px solid #ccc;
		border-radius: 50px;
		padding: 0.75rem 1.25rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		z-index: 100;
		transition: box-shadow 0.3s ease;
	}

	.floating-toggle:hover {
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	}

	.toggle-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #333;
		white-space: nowrap;
	}

	/* Toggle switch styles */
	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 24px;
	}

	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #2563eb;
		transition: 0.3s;
		border-radius: 24px;
	}

	.toggle-slider:before {
		position: absolute;
		content: '';
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: 0.3s;
		border-radius: 50%;
	}

	input:checked + .toggle-slider {
		background-color: #10b981;
	}

	input:checked + .toggle-slider:before {
		transform: translateX(24px);
	}

	.toggle-slider:hover {
		box-shadow: 0 0 4px rgba(37, 99, 235, 0.4);
	}

	@media (max-width: 768px) {
		.floating-toggle {
			bottom: 1rem;
			right: 1rem;
			padding: 0.6rem 1rem;
		}

		.toggle-label {
			font-size: 0.8rem;
		}

		.toggle-switch {
			width: 40px;
			height: 20px;
		}

		.toggle-slider:before {
			height: 14px;
			width: 14px;
		}

		input:checked + .toggle-slider:before {
			transform: translateX(20px);
		}
	}

	/* Simple view styles */
	.simple-background-cards {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 2rem;
		padding: 0 2rem;
		max-width: 900px;
		margin-left: auto;
		margin-right: auto;
	}

	.simple-background-card {
		background-color: #f8f8f8;
		border: 2px solid #ccc;
		border-radius: 0.5rem;
		padding: 1.5rem;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.simple-background-card:hover {
		border-color: #2563eb;
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
	}

	.simple-card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.simple-card-icon {
		width: 50px;
		height: 50px;
		object-fit: contain;
	}

	.simple-card-header h3 {
		margin: 0;
		font-size: 1.5rem;
		color: #333;
		font-weight: bold;
	}

	.simple-card-description {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		color: #555;
		line-height: 1.6;
	}

	.select-background-button {
		background-color: #2e7d32;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		width: auto;
		display: inline-block;
	}

	.select-background-button:hover {
		background-color: #1b5e20;
	}

	@media (max-width: 768px) {
		.simple-background-cards {
			padding: 0 1rem;
		}

		.simple-background-card {
			padding: 1rem;
		}

		.simple-card-header h3 {
			font-size: 1.25rem;
		}

		.simple-card-description {
			font-size: 0.95rem;
		}
	}
</style>
