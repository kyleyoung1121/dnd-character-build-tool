import type { FeaturePrompt, ComplexOption } from '$lib/data/types/Features';
import type { Character } from '$lib/stores/character_store';
import { get } from 'svelte/store';

/**
 * Utility to ensure an array has at least the specified length, filling with nulls
 */
export function ensureArrayLen(arr: (string | null)[], len: number): void {
	if (arr.length < len) {
		const oldLen = arr.length;
		arr.length = len;
		for (let i = oldLen; i < len; i++) arr[i] = null;
	}
}

/**
 * Check if a feature requires user input that hasn't been provided
 */
export function isFeatureIncomplete(
	feature: FeaturePrompt,
	selectionsMap: Record<string, (string | null)[]>
): boolean {
	if (!feature.featureOptions) return false;

	const selections = selectionsMap[feature.name] || [];
	const numPicks = feature.featureOptions.numPicks || 1;

	// Check if we have enough non-null selections
	const validSelections = selections.filter((s) => s !== null && s !== '');
	if (validSelections.length < numPicks) return true;

	// Check nested prompts for incomplete selections
	const nestedPrompts = getNestedPrompts(feature, selections);
	if (nestedPrompts.length > 0) {
		for (const nested of nestedPrompts) {
			if (isFeatureIncomplete(nested, selectionsMap)) return true;
		}
	}

	return false;
}

/**
 * Get nested prompts based on selected options
 */
export function getNestedPrompts(
	feature: FeaturePrompt,
	selectedOptions: (string | null)[]
): FeaturePrompt[] {
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

/**
 * Build a globally-aware option list for a given feature + index:
 * - No duplicates within the same feature (other indices)
 * - No duplicates across ANY other picks (top-level or nested) on this page
 * - No duplicates with what the character already has in the store (skills, languages, proficiencies)
 * - Always allow the *current* selection for this index so it doesn't disappear and show blank
 */
export function getGloballyAvailableOptions(
	feature: FeaturePrompt,
	index: number,
	featureSelections: Record<string, (string | null)[]>,
	characterStore: any
): (string | ComplexOption)[] {
	const options = feature.featureOptions?.options || [];
	const chosenHere = featureSelections[feature.name] || [];
	const currentValue = chosenHere[index] ?? null;

	// Everything currently on the character (store) + any in-progress picks in UI
	const state = get(characterStore) as Character;
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

/**
 * Clear nested feature selections when parent changes
 * Recursively clears all descendant selections
 */
export function clearNestedFeatureSelections(
	feature: FeaturePrompt,
	selections: Record<string, (string | null)[]>
): Record<string, (string | null)[]> {
	if (!feature.featureOptions) return selections;

	const newSelections = { ...selections };
	let mutated = false;

	// Helper function to recursively clear nested selections
	function clearRecursively(nestedFeature: FeaturePrompt) {
		if (newSelections[nestedFeature.name]) {
			delete newSelections[nestedFeature.name];
			mutated = true;
		}

		// Recursively clear any deeper nested selections
		if (nestedFeature.featureOptions) {
			for (const option of nestedFeature.featureOptions.options) {
				if (typeof option !== 'string' && option.nestedPrompts) {
					for (const deeperNested of option.nestedPrompts) {
						clearRecursively(deeperNested);
					}
				}
			}
		}
	}

	for (const option of feature.featureOptions.options) {
		if (typeof option !== 'string' && option.nestedPrompts) {
			for (const nested of option.nestedPrompts) {
				clearRecursively(nested);
			}
		}
	}

	return mutated ? newSelections : selections;
}

/**
 * Utility: does an effect require a user choice in its target or value?
 */
export function effectNeedsChoice(effect: any): boolean {
	return (
		(typeof effect.target === 'string' && effect.target.includes('{userChoice}')) ||
		(typeof effect.value === 'string' && effect.value.includes('{userChoice}'))
	);
}
