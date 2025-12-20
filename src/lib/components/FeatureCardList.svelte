<script lang="ts">
	import type { FeaturePrompt } from '$lib/data/types/Features';
	import {
		clearNestedFeatureSelections,
		effectNeedsChoice,
		getNestedPrompts
	} from './feature-card-utils';
	import {
		applyChoice,
		revertChanges,
		applyChoiceWithSpellLimitCheck
	} from '$lib/stores/character_store_helpers';
	import { get } from 'svelte/store';
	import { conflicts } from '$lib/stores/conflict_store';
	import FeatureCard from './FeatureCard.svelte';

	// Props
	export let features: FeaturePrompt[];
	export let featureSelections: Record<string, (string | null)[]>;
	export let expandedFeatures: Set<string>;
	export let selectionVersion: number;
	export let characterStore: any;

	// Events
	export let onBumpVersion: () => void;

	// Handle feature option selection
	function handleSelectOption(feature: FeaturePrompt, index: number, selectedOption: string, parentFeatureName?: string | null) {
		if (!selectedOption) return;

		const normalizedChoice = selectedOption;
		const num = feature.featureOptions?.numPicks || 1;

		// Ensure the selection array exists and has the right length
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
		onBumpVersion();

		if (prev === normalizedChoice) return;

		// Clear any nested selections under the previous branch
		featureSelections = clearNestedFeatureSelections(feature, featureSelections);

		// Construct scopeId with parent context for nested features
		// Format: feature:ParentName:FeatureName:index for nested, or feature:FeatureName:index for top-level
		const scopeId = parentFeatureName 
			? `feature:${parentFeatureName}:${feature.name}:${index}`
			: `feature:${feature.name}:${index}`;
		
		// DEBUG: Log scopeId generation
		console.log(`[SCOPEID DEBUG] Saving selection: feature='${feature.name}', parent='${parentFeatureName || 'none'}', scopeId='${scopeId}'`);

		// Handle reverting any static nested effects that were tied to the previous choice
		// IMPORTANT: Do this BEFORE applying new effects to avoid smart removal incorrectly
		// removing items that were just added by the new choice
		if (prev) {
			const prevNested = getNestedPrompts(feature, [prev]) || [];
			for (const nested of prevNested) {
				if (nested.featureOptions) continue; // only static nested
				const prevNestedScopeId = parentFeatureName
					? `feature:${parentFeatureName}:${feature.name}:${index}:${nested.name}`
					: `feature:${feature.name}:${index}:${nested.name}`;
				// Use applyChoice with empty changes to trigger revert of this nested scope
				applyChoice(prevNestedScopeId, {});
			}
		}

		// Apply the new choice effects (applyChoice handles reverting previous effects automatically)
		applyFeatureEffects(feature, normalizedChoice, scopeId, index, parentFeatureName);

		// Force conflict detection to trigger immediately for reactive UI updates
		// The derived store should handle this automatically, but this ensures immediate updates
		setTimeout(() => {
			// Access the conflicts store to trigger derived computation
			get(conflicts);
		}, 0);
	}

	// Handle expanding/collapsing feature cards
	function handleToggleExpand(featureName: string) {
		if (expandedFeatures.has(featureName)) {
			expandedFeatures.delete(featureName);
		} else {
			expandedFeatures.add(featureName);
		}
		expandedFeatures = new Set(expandedFeatures);
	}

	// Helper functions (moved from individual pages)
	function ensureArrayLen(arr: (string | null)[], len: number) {
		if (arr.length < len) {
			const oldLen = arr.length;
			arr.length = len;
			for (let i = oldLen; i < len; i++) arr[i] = null;
		}
	}

	function applyFeatureEffects(
		feature: FeaturePrompt,
		choice: string,
		scopeId: string,
		index: number,
		parentFeatureName?: string | null
	) {
		// Prepare containers for ONLY the effects that depend on this choice
		const update: Record<string, any> = {};
		const modify: Record<string, number> = {};

		const effects = feature.effects || [];
		for (const effect of effects) {
			if (!effectNeedsChoice(effect)) continue; // skip static effects here

			// Replace {userChoice} anywhere in target or value with the chosen value.
			const replaceUC = (s: any, isTarget = false): any => {
				// Handle arrays - recursively replace in each element
				if (Array.isArray(s)) {
					return s.map(item => replaceUC(item, isTarget));
				}
				if (typeof s !== 'string') return s;
				let replaced = s.replace(/\{userChoice\}/g, choice);
				if (isTarget) {
					replaced = replaced.toLowerCase().replace(/\s+/g, '_');
				}
				return replaced;
			};

			const target = replaceUC(effect.target, true);
			const value = replaceUC(effect.value);

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
		
		// IMPORTANT: For features with no effects (e.g., Totem Spirit), store a marker so we can restore the choice
		// We use a special key '__userChoice' to preserve the selected option name
		if (Object.keys(update).length === 0 && Object.keys(modify).length === 0) {
			update['__userChoice' as any] = choice;
		}

		// Apply the choice-dependent effects for this top-level selection
		// Check if this is a subclass change that might affect spell limits
		const isSubclassChange = Object.keys(update).includes('subclass');
		if (isSubclassChange) {
			// Use spell limit checking for subclass changes
			applyChoiceWithSpellLimitCheck(scopeId, update, modify);
		} else {
			// Use regular apply for other changes
			applyChoice(scopeId, update, modify);
		}

		// Apply newly revealed static nested features (no user input) for THIS choice
		const newlyRevealed = getNestedPrompts(feature, [choice]) || [];
		for (const nested of newlyRevealed) {
			// Skip nested prompts that have their own options; those will be handled by user interaction later
			if (nested.featureOptions) continue;

			const nestedScopeId = parentFeatureName
				? `feature:${parentFeatureName}:${feature.name}:${index}:${nested.name}`
				: `feature:${feature.name}:${index}:${nested.name}`;
			// applyChoice handles reverting automatically, no need for manual revert

			const nestedUpdate: Record<string, any> = {};
			const nestedModify: Record<string, number> = {};

			for (const effect of nested.effects || []) {
				const target = effect.target;
				const value = effect.value;

				switch (effect.action) {
					case 'add': {
						const arr = Array.isArray(value) ? value : [value];
						if (!nestedUpdate[target]) nestedUpdate[target] = [];
						nestedUpdate[target].push(...arr);
						break;
					}
					case 'set': {
						nestedUpdate[target] = value;
						break;
					}
					case 'modify': {
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
</script>

<!-- Render all features as collapsible cards -->
{#each features as feature (feature.name)}
	{#key `${feature.name}:${selectionVersion}:${$conflicts.hasConflicts}`}
		<FeatureCard
			{feature}
			{featureSelections}
			{expandedFeatures}
			{selectionVersion}
			{characterStore}
			onSelectOption={handleSelectOption}
			onToggleExpand={handleToggleExpand}
		/>
	{/key}
{/each}
