<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import FeatureCardList from '$lib/components/FeatureCardList.svelte';
	import ConflictWarning from '$lib/components/ConflictWarning.svelte';
	import { isFeatureIncomplete } from '$lib/components/feature-card-utils';

	// Import all backgrounds
	import { backgrounds } from '$lib/data/backgrounds/index';
	import type { BackgroundData } from '$lib/data/types/BackgroundData';
	import type { FeaturePrompt } from '$lib/data/types/Features';

	import { applyChoice, revertChanges } from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { character_store } from '$lib/stores/character_store';

	let selectedBackground: BackgroundData | null = null;
	let selectedBackgroundData: BackgroundData | null = null;

	// featureSelections maps feature.name -> array of picks (by index)
	let featureSelections: Record<string, (string | null)[]> = {};

	let expandedFeatures = new Set<string>();

	// Used to force Svelte to re-create <select> nodes so option lists refresh instantly
	let selectionVersion = 0;

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
	onMount(() => {
		const state = get(character_store);
		if (!state.background) return;

		// Find selected background
		const found = backgrounds.find((bg) => bg.name === state.background);
		if (!found) return;

		selectedBackgroundData = found;
		featureSelections = {};

		const toSnakeCase = (str: string) => str.toLowerCase().replace(/\s+/g, '_');

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
				opts.map((o) => [
					toSnakeCase(typeof o === 'string' ? o : o.name),
					typeof o === 'string' ? o : o.name
				])
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

				if (restored) {
					featureSelections[feature.name][idx] = restored;
				}
			}

			// Recurse into nested prompts if any
			if (feature.featureOptions?.options) {
				feature.featureOptions.options.forEach((o) => {
					if (typeof o !== 'string' && o.nestedPrompts) {
						const selectedVal = featureSelections[feature.name].find((v) => v === o.name);
						if (selectedVal) {
							o.nestedPrompts.forEach((nested) => restoreFeatureSelection(nested));
						}
					}
				});
			}
		};

		// Restore all top-level features
		found.backgroundFeatures?.forEach((feature) => restoreFeatureSelection(feature));

		// Trigger Svelte reactivity
		featureSelections = { ...featureSelections };
		bumpVersion();
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
		<div class="background-cards">
			{#each backgrounds as backgroundInfo}
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
							<p>{@html feature.description}</p>
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
</style>
