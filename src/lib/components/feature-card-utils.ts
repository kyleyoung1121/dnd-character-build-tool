import type {
	FeaturePrompt,
	ComplexOption,
	DynamicOptionsGenerator
} from '$lib/data/types/Features';
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
	for (const option of feature.featureOptions.options || []) {
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
	let options = feature.featureOptions?.options || [];

	// Handle dynamic options generation
	if (feature.featureOptions?.dynamicOptionsGenerator) {
		options = generateDynamicOptions(
			feature.featureOptions.dynamicOptionsGenerator,
			characterStore,
			featureSelections
		);
	}
	const chosenHere = featureSelections[feature.name] || [];
	const currentValue = chosenHere[index] ?? null;

	// Everything currently on the character (store) + any in-progress picks in UI
	const state = get(characterStore) as Character;
	const taken = new Set<string>();

	// Special case: For expertise features, don't mark skills as "taken"
	// because expertise specifically requires choosing from already-taken skills
	const isExpertiseFeature = feature.name.toLowerCase().includes('expertise');

	// Include store-backed sets that commonly correspond to dropdown options
	// But skip skills for expertise features since they should be available
	if (Array.isArray(state.skills) && !isExpertiseFeature) {
		for (const s of state.skills) taken.add(s);
	}
	if (Array.isArray(state.languages)) for (const l of state.languages) taken.add(l);
	if (Array.isArray(state.proficiencies)) for (const p of state.proficiencies) taken.add(p);

	// For expertise features, we still want to track already-chosen expertise to prevent duplicates
	if (isExpertiseFeature && Array.isArray(state.expertise)) {
		for (const e of state.expertise) taken.add(e);
	}

	// Include every selection already made in the UI (across all features & nested)
	for (const [featName, picks] of Object.entries(featureSelections)) {
		for (const [i, pick] of (picks || []).entries()) {
			if (!pick) continue;
			// Don't count *this* select's current value as taken, so it remains visible
			if (featName === feature.name && i === index) continue;
			taken.add(pick);
		}
	}

	const finalFiltered = options.filter((opt) => {
		const name = typeof opt === 'string' ? opt : opt.name;

		// Rule 1: cannot duplicate within the same feature (other indices)
		if (chosenHere.some((c, i) => c === name && i !== index)) return false;

		// Rule 2: allow the current index's already-chosen value
		if (currentValue === name) return true;

		// Rule 3: For expertise features, ignore taken status for skills
		// (since expertise requires choosing from already-taken skills)
		if (isExpertiseFeature) {
			// For expertise, only block if this specific item is already chosen as expertise
			if (Array.isArray(state.expertise) && state.expertise.includes(name)) {
				return false;
			}
			return true; // Allow all other options for expertise
		}

		// Rule 3 (normal): otherwise, must not be taken anywhere else
		if (taken.has(name)) return false;

		return true;
	});

	// Store debug info for filtering
	if (typeof window !== 'undefined' && (window as any).dynamicOptionsDebug) {
		(window as any).dynamicOptionsDebug.filtering = {
			featureName: feature.name,
			index,
			isExpertiseFeature,
			rawOptions: options,
			chosenHere,
			currentValue,
			taken: Array.from(taken),
			expertiseAlreadyChosen: isExpertiseFeature ? state.expertise || [] : [],
			finalFiltered,
			timestamp: new Date().toISOString()
		};
	}

	return finalFiltered;
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
			for (const option of nestedFeature.featureOptions.options || []) {
				if (typeof option !== 'string' && option.nestedPrompts) {
					for (const deeperNested of option.nestedPrompts) {
						clearRecursively(deeperNested);
					}
				}
			}
		}
	}

	for (const option of feature.featureOptions.options || []) {
		if (typeof option !== 'string' && option.nestedPrompts) {
			for (const nested of option.nestedPrompts) {
				clearRecursively(nested);
			}
		}
	}

	return mutated ? newSelections : selections;
}

/**
 * Generate dynamic options based on character state
 */
export function generateDynamicOptions(
	generator: DynamicOptionsGenerator,
	characterStore: any,
	featureSelections?: Record<string, (string | null)[]>
): (string | ComplexOption)[] {
	const state = get(characterStore) as Character;

	// Store debug info for export tab
	if (typeof window !== 'undefined' && (window as any).dynamicOptionsDebug) {
		(window as any).dynamicOptionsDebug.lastCall = {
			generatorType: generator.type,
			additionalOptions: generator.additionalOptions,
			characterStoreState: state,
			skillsArray: state?.skills,
			featureSelections,
			timestamp: new Date().toISOString()
		};
	} else if (typeof window !== 'undefined') {
		(window as any).dynamicOptionsDebug = {
			lastCall: {
				generatorType: generator.type,
				additionalOptions: generator.additionalOptions,
				characterStoreState: state,
				skillsArray: state?.skills,
				featureSelections,
				timestamp: new Date().toISOString()
			}
		};
	}

	// Define common D&D skills once to avoid duplication
	const commonSkills = [
		'Acrobatics',
		'Animal Handling',
		'Arcana',
		'Athletics',
		'Deception',
		'History',
		'Insight',
		'Intimidation',
		'Investigation',
		'Medicine',
		'Nature',
		'Perception',
		'Performance',
		'Persuasion',
		'Religion',
		'Sleight of Hand',
		'Stealth',
		'Survival'
	];

	switch (generator.type) {
		case 'proficient-skills-plus-tools': {
			const options: string[] = [];

			// Add all skills the character is proficient in from the store
			if (Array.isArray(state.skills)) {
				options.push(...state.skills);
			}

			// Also check proficiencies - Half-Elf skills are stored there
			if (Array.isArray(state.proficiencies)) {
				// Only add skill proficiencies, not other types of proficiencies
				for (const prof of state.proficiencies) {
					if (commonSkills.includes(prof)) {
						options.push(prof);
					}
				}
			}

			// Also add skills from current page selections (not yet saved to store)
			if (featureSelections) {
				for (const [featureName, selections] of Object.entries(featureSelections)) {
					// Look for skill-related features - be more specific
					const isSkillFeature =
						featureName.toLowerCase().includes('skill') ||
						featureName.toLowerCase().includes('proficiencies') ||
						featureName === 'Skill Proficiencies' ||
						featureName.includes('Skills');

					if (isSkillFeature) {
						for (const selection of selections) {
							if (selection && typeof selection === 'string') {
								// Only add if it's a recognized skill
								if (commonSkills.includes(selection)) {
									options.push(selection);
								}
							}
						}
					}
				}
			}

			// Add the additional options (e.g., "Thieves' Tools" for rogues)
			options.push(...generator.additionalOptions);

			// Remove duplicates
			const finalOptions = [...new Set(options)];

			// Store final result in debug info
			if (typeof window !== 'undefined' && (window as any).dynamicOptionsDebug) {
				(window as any).dynamicOptionsDebug.lastCall.finalOptions = finalOptions;
			}

			return finalOptions;
		}
		default:
			return [];
	}
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
