/**
 * D&D 5e Feature & Trait Data for PDF Export
 * 
 * NEW ARCHITECTURE (Dynamic Lookup):
 * - Features are stored by name in the character store as strings
 * - During PDF generation, we look up the feature description from the original source files
 *   (class files, race files, background files) using feature-lookup.ts
 * - This maintains DRY principles - each feature description lives in only ONE place
 * - No need to maintain a separate dictionary!
 * 
 * BENEFITS:
 * - Single source of truth for feature descriptions
 * - Automatically includes ALL features from all classes/races/backgrounds
 * - No manual copying/pasting of descriptions
 * - Easy to maintain and extend
 */

import { lookupFeature, getFeatureDescription, cleanDescription } from './feature-lookup';
import type { Character } from '$lib/stores/character_store';

export interface FeatureData {
	name: string;
	description: string;
	source: 'class' | 'race' | 'background' | 'feat' | 'subclass';
	level?: number; // At what level this feature is gained (for class features)
}

import type {
	FeatureDescription,
	DescriptionBlock,
	ComputedValue,
	Ability
} from '$lib/data/types/Features';

type AbilityKey = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

const ABILITY_KEY_MAP: Record<Ability, AbilityKey> = {
	STR: 'strength',
	DEX: 'dexterity',
	CON: 'constitution',
	INT: 'intelligence',
	WIS: 'wisdom',
	CHA: 'charisma'
};

/**
 * Calculate ability modifier from ability score
 */
function abilityMod(score: number | null): number | null {
	if (score === null || score === 0) return null;
	return Math.floor((score - 10) / 2);
}

/**
 * Resolve a computed value using character data
 */
function resolveComputedValue(value: ComputedValue, character?: Character): number | null {
	if (!character) return null;

	switch (value.source) {
		case 'abilityScore': {
			const key = ABILITY_KEY_MAP[value.ability];
			return character[key];
		}

		case 'abilityMod': {
			const key = ABILITY_KEY_MAP[value.ability];
			return abilityMod(character[key]);
		}

		case 'derived': {
			return evaluateFormula(value.formula, character);
		}

		default:
			return null;
	}
}

/**
 * Evaluate a formula with character context
 */
function evaluateFormula(formula: string, character: Character): number | null {
	// --- Ability scores ---
	const STR = character.strength;
	const DEX = character.dexterity;
	const CON = character.constitution;
	const INT = character.intelligence;
	const WIS = character.wisdom;
	const CHA = character.charisma;

	// If any referenced score is missing, bail
	if (formula.includes('STR') && STR === null) return null;
	if (formula.includes('DEX') && DEX === null) return null;
	if (formula.includes('CON') && CON === null) return null;
	if (formula.includes('INT') && INT === null) return null;
	if (formula.includes('WIS') && WIS === null) return null;
	if (formula.includes('CHA') && CHA === null) return null;

	// --- Ability modifiers ---
	const STR_MOD = abilityMod(STR);
	const DEX_MOD = abilityMod(DEX);
	const CON_MOD = abilityMod(CON);
	const INT_MOD = abilityMod(INT);
	const WIS_MOD = abilityMod(WIS);
	const CHA_MOD = abilityMod(CHA);

	if (formula.includes('STR_MOD') && STR_MOD === null) return null;
	if (formula.includes('DEX_MOD') && DEX_MOD === null) return null;
	if (formula.includes('CON_MOD') && CON_MOD === null) return null;
	if (formula.includes('INT_MOD') && INT_MOD === null) return null;
	if (formula.includes('WIS_MOD') && WIS_MOD === null) return null;
	if (formula.includes('CHA_MOD') && CHA_MOD === null) return null;

	// Known Constants
	const PROF = 2;
	const LEVEL = 3;

	try {
		// Controlled evaluation: formulas come from your data files only
		return Function(
			'STR',
			'DEX',
			'CON',
			'INT',
			'WIS',
			'CHA',
			'STR_MOD',
			'DEX_MOD',
			'CON_MOD',
			'INT_MOD',
			'WIS_MOD',
			'CHA_MOD',
			'PROF',
			'LEVEL',
			`return ${formula};`
		)(
			STR,
			DEX,
			CON,
			INT,
			WIS,
			CHA,
			STR_MOD,
			DEX_MOD,
			CON_MOD,
			INT_MOD,
			WIS_MOD,
			CHA_MOD,
			PROF,
			LEVEL
		);
	} catch (e) {
		console.error('[PDF] Formula eval failed:', formula, e);
		return null;
	}
}

/**
 * Check if all computed values are available
 */
function allValuesAvailable(values: ComputedValue[], character?: Character): number | null {
	const resolved = values.map((v) => resolveComputedValue(v, character));

	if (resolved.some((v) => v === null || Number.isNaN(v))) {
		return null;
	}

	return resolved[0];
}

function serializeFeatureDescription(description: FeatureDescription, character?: Character): string {
	return description.blocks
		.map((block) => {
			switch (block.type) {
				case 'text':
					return block.text;

				case 'computed-inline': {
					// Process hints and insert computed values
					let result = block.text;
					let offset = 0;

					// Sort hints by their position in the text to insert in order
					const sortedHints = block.hints
						.map((hint) => ({
							...hint,
							position: result.indexOf(hint.afterText)
						}))
						.filter((hint) => hint.position !== -1)
						.sort((a, b) => a.position - b.position);

					// Insert hints from left to right
					for (const hint of sortedHints) {
						const value = resolveComputedValue(hint.computed, character);
						const hintText =
							value !== null
								? hint.hintFormat.replace('{value}', String(value))
								: hint.hintFormat.replace('{value}', '?');

						// Find position in current result (accounting for previous insertions)
						const insertPosition = result.indexOf(hint.afterText, offset);
						if (insertPosition !== -1) {
							const insertAt = insertPosition + hint.afterText.length;
							result = result.slice(0, insertAt) + ' ' + hintText + result.slice(insertAt);
							offset = insertAt + hintText.length + 1;
						}
					}

					return result;
				}

				case 'computed-replacement': {
					// Try to compute the value
					const value = allValuesAvailable(block.whenAvailable, character);

					if (value !== null) {
						// Use singular template if value is 1 and singular template exists
						if (value === 1 && block.singularTemplate) {
							return block.singularTemplate;
						}
						// Otherwise use replacement template
						return block.replacementTemplate.replace('{value}', String(value));
					} else {
						// Fall back to fallback text
						return block.fallbackText;
					}
				}

				default:
					return '';
			}
		})
		.join('\n'); // Single newline within a feature (no blank lines between blocks)
}


/**
 * DEPRECATED: Old hardcoded feature dictionary
 * Kept for backwards compatibility but no longer needed
 * The new system uses dynamic lookup from source files
 */
export const featureData: Record<string, FeatureData> = {};

/**
 * Get feature data by name using dynamic lookup
 * This replaces the old hardcoded dictionary approach
 * 
 * @param featureName - Name of the feature to look up
 * @param character - Optional character object to provide context (class, race, background)
 * @returns FeatureData if found, null otherwise
 */
export function getFeatureData(
	featureName: string,
	character?: Character
): FeatureData | null {
	const className = character?.class;
	// Prioritize subrace (e.g., "Rock Gnome") over base race (e.g., "Gnome")
	// SPECIES_MAP contains subspecies names like "Rock Gnome", "Hill Dwarf", etc.
	const raceName = character?.subrace || character?.race;
	const backgroundName = character?.background;

	const feature = lookupFeature(
		featureName,
		className,
		raceName,
		backgroundName
	);

	if (!feature) {
		return null;
	}

	let descriptionText: string;

	if (typeof feature.description === 'string') {
		// Legacy safety (should not happen anymore, but harmless)
		descriptionText = feature.description;
	} else {
		descriptionText = serializeFeatureDescription(feature.description, character);
	}

	// Clean description to remove tabs and other problematic characters for PDF (WinAnsi encoding)
	descriptionText = cleanDescription(descriptionText);

	return {
		name: feature.name,
		description: descriptionText,
		source: feature.source.includes('class')
			? 'class'
			: feature.source.includes('background')
			? 'background'
			: 'race',
		level: undefined
	};
}


/**
 * Check if a feature has data available
 */
export function hasFeatureData(featureName: string, character?: Character): boolean {
	return getFeatureData(featureName, character) !== null;
}

/**
 * Format feature for PDF display
 * Returns formatted string with name and description
 * Uses special marker <<BOLD:text>> to indicate bold text
 * 
 * @param featureName - Name of the feature
 * @param character - Character object to provide context for lookup
 */
export function formatFeatureForPDF(featureName: string, character?: Character): string {
	console.log('[formatFeatureForPDF] Processing feature:', featureName);
	const featureData = getFeatureData(featureName, character);
	
	if (!featureData) {
		console.log('[formatFeatureForPDF] Feature not found:', featureName);
		// If feature not found, just show the name with bullet
		return `• ${featureName}`;
	}
	
	console.log('[formatFeatureForPDF] Feature found:', featureData.name, 'Description length:', featureData.description.length);
	// Format: [[BOLD:Name]]. Description
	// Name is marked for bold rendering, followed by period and description on same line
	const result = `[[BOLD:${featureData.name}]]. ${featureData.description}`;
	console.log('[formatFeatureForPDF] Result:', result.substring(0, 200));
	return result;
}

/**
 * Format multiple features for PDF display
 * Separates each feature with double newline for spacing
 * 
 * @param featureNames - Array of feature names
 * @param character - Character object to provide context for lookup
 */
export function formatFeaturesForPDF(featureNames: string[], character?: Character): string {
	console.log('[formatFeaturesForPDF] Processing features:', featureNames);
	const result = featureNames
		.map(name => formatFeatureForPDF(name, character))
		.join('\n\n'); // Double newline creates space between features
	console.log('[formatFeaturesForPDF] Final result length:', result.length, 'Preview:', result.substring(0, 300));
	return result;
}

/**
 * DEPRECATED: Get list of features that have data available
 * The new system uses dynamic lookup, so all features are automatically available
 * Kept for backwards compatibility
 */
export function getAvailableFeatures(): string[] {
	return [];
}

/**
 * DEPRECATED: Get features by source (class, race, background, etc.)
 * The new system uses dynamic lookup from source files
 * Kept for backwards compatibility
 */
export function getFeaturesBySource(_source: FeatureData['source']): FeatureData[] {
	return [];
}
