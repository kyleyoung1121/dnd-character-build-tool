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
	function handleSelectOption(feature: FeaturePrompt, index: number, selectedOption: string, parentFeatureName?: string | null, parentIndex?: number | null) {
		// console.log(`[HANDLE_SELECT] Called with:`, {
		// 	feature: feature.name,
		// 	index,
		// 	selectedOption,
		// 	parentFeatureName,
		// 	parentIndex
		// });
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

		// IMPORTANT: When changing from one complex option to another (like switching subclasses),
		// we need to revert ALL nested feature scopes from the previous selection.
		// This ensures that selections like Knowledge Domain's languages/skills are cleaned up
		// when switching to a different domain.
		if (prev) {
			// Build the scope ID pattern for the previous selection
			const prevScopeId = parentFeatureName && parentIndex !== null && parentIndex !== undefined
				? `feature:${parentFeatureName}:${parentIndex}:${feature.name}:${index}`
				: `feature:${feature.name}:${index}`;
			
			// Find and revert all scopes that are children of this feature
			// Pattern: starts with prevScopeId followed by a colon (indicating nested scope)
			const state = get(characterStore);
			if (state._provenance) {
				const scopesToRevert = Object.keys(state._provenance).filter(key => 
					key.startsWith(prevScopeId + ':')
				);
				
			//console.log(`[CLEANUP] Looking for nested scopes under: ${prevScopeId}`);
			//console.log(`[CLEANUP] All provenance keys:`, Object.keys(state._provenance));
			//console.log(`[CLEANUP] Found scopes to revert:`, scopesToRevert);
				
				for (const scopeKey of scopesToRevert) {
					revertChanges(state, scopeKey);
				}
			}
			
			// Also revert the parent scope itself (will be reapplied below)
			revertChanges(get(characterStore), prevScopeId);
		}

		// Clear any nested selections under the previous branch
		featureSelections = clearNestedFeatureSelections(feature, featureSelections);

		// Construct scopeId with parent context for nested features
		// Format: feature:ParentName:ParentIndex:FeatureName:index for nested, or feature:FeatureName:index for top-level
		// NOTE: The 'index' represents which dropdown (0, 1, 2...) for numPicks > 1
		// This ensures each selection gets its own scopeId and doesn't overwrite previous ones
		const scopeId = parentFeatureName && parentIndex !== null && parentIndex !== undefined
			? `feature:${parentFeatureName}:${parentIndex}:${feature.name}:${index}`
			: `feature:${feature.name}:${index}`;
		
		// DEBUG: Log scopeId generation
		// //console.log(`[SCOPEID] Saving selection:`, {
		// 	feature: feature.name,
		// 	parent: parentFeatureName || 'none',
		// 	parentIndex: parentIndex !== null && parentIndex !== undefined ? parentIndex : 'none',
		// 	scopeId,
		// 	index,
		// 	selectedOption
		// });

		// Handle reverting any static nested effects that were tied to the previous choice
		// IMPORTANT: Do this BEFORE applying new effects to avoid smart removal incorrectly
		// removing items that were just added by the new choice
		if (prev) {
			const prevNested = getNestedPrompts(feature, [prev]) || [];
			for (const nested of prevNested) {
				if (nested.featureOptions) {
					// For nested features with featureOptions (e.g., Knowledge Domain skills/languages),
					// we need to revert ALL possible selections (numPicks)
					const numPicks = nested.featureOptions.numPicks || 1;
					for (let nestedIdx = 0; nestedIdx < numPicks; nestedIdx++) {
						const prevNestedScopeId = parentFeatureName && parentIndex !== null && parentIndex !== undefined
							? `feature:${parentFeatureName}:${parentIndex}:${feature.name}:${index}:${nested.name}:${nestedIdx}`
							: `feature:${feature.name}:${index}:${nested.name}:${nestedIdx}`;
						//console.log(`[CLEANUP] Reverting nested feature with options: ${prevNestedScopeId}`);
						applyChoice(prevNestedScopeId, {});
					}
				} else {
					// Static nested features (no user options)
					const prevNestedScopeId = parentFeatureName && parentIndex !== null && parentIndex !== undefined
						? `feature:${parentFeatureName}:${parentIndex}:${feature.name}:${index}:${nested.name}`
						: `feature:${feature.name}:${index}:${nested.name}`;
					// Use applyChoice with empty changes to trigger revert of this nested scope
					applyChoice(prevNestedScopeId, {});
				}
			}

			// ALSO revert nested prompt effects from the previous option's nestedPrompts
			// This handles cleanup for invocations and similar features
			if (feature.featureOptions) {
				const prevOption = feature.featureOptions.options.find(opt => opt.name === prev);
				if (prevOption?.nestedPrompts) {
					for (const prevOptionNested of prevOption.nestedPrompts) {
						const prevOptionNestedScopeId = parentFeatureName && parentIndex !== null && parentIndex !== undefined
							? `feature:${parentFeatureName}:${parentIndex}:${feature.name}:${index}:${prevOptionNested.name}`
							: `feature:${feature.name}:${index}:${prevOptionNested.name}`;
						// Use applyChoice with empty changes to trigger revert of this nested scope
						applyChoice(prevOptionNestedScopeId, {});
					}
				}
			}
		}

		// Apply the new choice effects (applyChoice handles reverting previous effects automatically)
		//console.log(`[BEFORE_APPLY] About to call applyFeatureEffects for "${feature.name}" with choice "${normalizedChoice}"`);
		applyFeatureEffects(feature, normalizedChoice, scopeId, index, parentFeatureName, parentIndex);

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
		parentFeatureName?: string | null,
		parentIndex?: number | null
	) {
		//console.log(`[APPLY_EFFECTS] Called for feature "${feature.name}" with choice "${choice}"`);
		//console.log(`[APPLY_EFFECTS] Feature has featureOptions:`, !!feature.featureOptions);
		//console.log(`[APPLY_EFFECTS] Parent feature:`, parentFeatureName || 'none');
		//console.log(`[APPLY_EFFECTS] Full feature object:`, feature);
		
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
					// Don't transform targets that are already valid camelCase property names
					// (e.g., dragonbornElement, dragonbornBreathShape)
					// Only transform targets that look like feature names with spaces
					if (replaced.includes(' ')) {
						replaced = replaced.toLowerCase().replace(/\s+/g, '_');
					}
				}
				return replaced;
			};

			const target = replaceUC(effect.target, true);
			const value = replaceUC(effect.value);

			// DEFENSIVE: Skip this effect if value still contains {userChoice} after replacement
			// This should never happen if effectNeedsChoice works correctly, but prevents bugs
			if (typeof value === 'string' && value.includes('{userChoice}')) {
				console.warn(`[APPLY_EFFECTS] Skipping effect because value still contains {userChoice}:`, effect);
				continue;
			}

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
		//console.log(`[NESTED] Found ${newlyRevealed.length} nested prompts for choice "${choice}" on feature "${feature.name}"`);
		for (const nested of newlyRevealed) {
			//console.log(`[NESTED] Processing nested feature: "${nested.name}", hasOptions: ${!!nested.featureOptions}`);
			//console.log(`[NESTED] Nested effects:`, nested.effects);
			// Skip nested prompts that have their own options; those will be handled by user interaction later
			if (nested.featureOptions) {
				//console.log(`[NESTED] Skipping "${nested.name}" because it has featureOptions`);
				continue;
			}

			const nestedScopeId = parentFeatureName && parentIndex !== null && parentIndex !== undefined
				? `feature:${parentFeatureName}:${parentIndex}:${feature.name}:${index}:${nested.name}`
				: `feature:${feature.name}:${index}:${nested.name}`;
			// applyChoice handles reverting automatically, no need for manual revert

			const nestedUpdate: Record<string, any> = {};
			const nestedModify: Record<string, number> = {};

			for (const effect of nested.effects || []) {
				const target = effect.target;
				const value = effect.value;

				// DEFENSIVE: Skip this static nested effect if it contains {userChoice}
				// Static nested features should never have {userChoice} placeholders
				if (typeof value === 'string' && value.includes('{userChoice}')) {
					console.warn(`[NESTED] Skipping static nested effect with {userChoice}:`, effect);
					continue;
				}

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

			//console.log(`[NESTED] Applying choice for "${nested.name}" with scopeId: ${nestedScopeId}`);
			//console.log(`[NESTED] Update:`, nestedUpdate, 'Modify:', nestedModify);
			applyChoice(nestedScopeId, nestedUpdate, nestedModify);
		}

		// ALSO apply effects from nested prompts of the selected option itself
		// This handles cases like Warlock invocations where the option (e.g., "Beguiling Influence")
		// has its own nestedPrompts array with effects that need to be applied
		if (feature.featureOptions) {
			//console.log(`[OPTION_NESTED] Checking for nested prompts in selected option: "${choice}"`);
			const selectedOption = feature.featureOptions.options.find(opt => opt.name === choice);
			//console.log(`[OPTION_NESTED] Selected option:`, selectedOption);
			if (selectedOption?.nestedPrompts) {
				//console.log(`[OPTION_NESTED] Found ${selectedOption.nestedPrompts.length} nested prompts in option "${choice}"`);
				for (const optionNested of selectedOption.nestedPrompts) {
					//console.log(`[OPTION_NESTED] Processing option nested: "${optionNested.name}"`);
					//console.log(`[OPTION_NESTED] Effects:`, optionNested.effects);
					const optionNestedScopeId = parentFeatureName && parentIndex !== null && parentIndex !== undefined
						? `feature:${parentFeatureName}:${parentIndex}:${feature.name}:${index}:${optionNested.name}`
						: `feature:${feature.name}:${index}:${optionNested.name}`;

					const optionNestedUpdate: Record<string, any> = {};
					const optionNestedModify: Record<string, number> = {};

					for (const effect of optionNested.effects || []) {
						const target = effect.target;
						const value = effect.value;

						// DEFENSIVE: Skip this option nested effect if it contains {userChoice}
						// Option nested features should never have {userChoice} placeholders
						if (typeof value === 'string' && value.includes('{userChoice}')) {
							console.warn(`[OPTION_NESTED] Skipping effect with {userChoice}:`, effect);
							continue;
						}

						switch (effect.action) {
							case 'add': {
								const arr = Array.isArray(value) ? value : [value];
								if (!optionNestedUpdate[target]) optionNestedUpdate[target] = [];
								optionNestedUpdate[target].push(...arr);
								break;
							}
							case 'set': {
								optionNestedUpdate[target] = value;
								break;
							}
							case 'modify': {
								const amount = Number(value);
								if (!isNaN(amount)) {
									optionNestedModify[target] = (optionNestedModify[target] ?? 0) + amount;
								}
								break;
							}
						}
					}

					//console.log(`[OPTION_NESTED] Applying choice for "${optionNested.name}" with scopeId: ${optionNestedScopeId}`);
					//console.log(`[OPTION_NESTED] Update:`, optionNestedUpdate, 'Modify:', optionNestedModify);
					applyChoice(optionNestedScopeId, optionNestedUpdate, optionNestedModify);
				}
			} else {
				//console.log(`[OPTION_NESTED] No nested prompts found in selected option "${choice}"`);
			}
		}
	}
</script>

<!-- Render all features as collapsible cards -->
{#each features as feature (feature.name)}
	<FeatureCard
		{feature}
		{featureSelections}
		{expandedFeatures}
		{selectionVersion}
		{characterStore}
		onSelectOption={handleSelectOption}
		onToggleExpand={handleToggleExpand}
	/>
{/each}
