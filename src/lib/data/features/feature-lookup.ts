/**
 * Feature Lookup Utility
 * 
 * Dynamically extracts feature descriptions from class, race, and background data files
 * instead of maintaining a separate dictionary.
 * 
 * ARCHITECTURE:
 * - Features are stored as FeaturePrompt objects in class/race/background data
 * - During PDF generation, we look up the feature by name in the appropriate source
 * - This maintains DRY principles - each feature description lives in only ONE place
 */

import type { ClassData } from '$lib/data/types/ClassData';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { BackgroundData } from '$lib/data/types/BackgroundData';
import type { FeaturePrompt, FeatureDescription, ComputedValue } from '$lib/data/types/Features';
import type { Character } from '$lib/stores/character_store';

// Import all classes
import { barbarian } from '../classes/barbarian';
import { bard } from '../classes/bard';
import { cleric } from '../classes/cleric';
import { druid } from '../classes/druid';
import { fighter } from '../classes/fighter';
import { monk } from '../classes/monk';
import { paladin } from '../classes/paladin';
import { ranger } from '../classes/ranger';
import { rogue } from '../classes/rogue';
import { sorcerer } from '../classes/sorcerer';
import { warlock } from '../classes/warlock';
import { wizard } from '../classes/wizard';

// Import all species
import { dragonborn } from '../species/dragonborn';
import { halfElf } from '../species/half_elf';
import { halfOrc } from '../species/half_orc';
import { tiefling } from '../species/tiefling';
import { highElf } from '../species/elf/high_elf';
import { woodElf } from '../species/elf/wood_elf';
import { darkElf } from '../species/elf/dark_elf';
import { hillDwarf } from '../species/dwarf/hill_dwarf';
import { mountainDwarf } from '../species/dwarf/mountain_dwarf';
import { rockGnome } from '../species/gnome/rock_gnome';
import { forestGnome } from '../species/gnome/forest_gnome';
import { lightfootHalfling } from '../species/halfling/lightfoot_halfling';
import { stoutHalfling } from '../species/halfling/stout_halfling';
import { human } from '../species/human/human';
import { variantHuman } from '../species/human/variant_human';

// Import all backgrounds
import { backgrounds } from '../backgrounds/index';

/**
 * Map class names to their data
 */
const CLASS_MAP: Record<string, ClassData> = {
	'Barbarian': barbarian,
	'Bard': bard,
	'Cleric': cleric,
	'Druid': druid,
	'Fighter': fighter,
	'Monk': monk,
	'Paladin': paladin,
	'Ranger': ranger,
	'Rogue': rogue,
	'Sorcerer': sorcerer,
	'Warlock': warlock,
	'Wizard': wizard
};

/**
 * Map species names to their data
 */
const SPECIES_MAP: Record<string, SpeciesData> = {
	'Dragonborn': dragonborn,
	'Half-Elf': halfElf,
	'Half-Orc': halfOrc,
	'Tiefling': tiefling,
	'High Elf': highElf,
	'Wood Elf': woodElf,
	'Dark Elf': darkElf,
	'Drow': darkElf, // Alias
	'Hill Dwarf': hillDwarf,
	'Mountain Dwarf': mountainDwarf,
	'Rock Gnome': rockGnome,
	'Forest Gnome': forestGnome,
	'Lightfoot Halfling': lightfootHalfling,
	'Stout Halfling': stoutHalfling,
	'Human': human,
	'Variant Human': variantHuman
};

/**
 * Map background names to their data
 */
const BACKGROUND_MAP: Record<string, BackgroundData> = {};
backgrounds.forEach(bg => {
	BACKGROUND_MAP[bg.name] = bg;
});

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

	const ABILITY_KEY_MAP: Record<string, keyof Pick<Character, 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'>> = {
		STR: 'strength',
		DEX: 'dexterity',
		CON: 'constitution',
		INT: 'intelligence',
		WIS: 'wisdom',
		CHA: 'charisma'
	};

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

/**
 * Serialize feature description from blocks to plain text with fancy description computation
 */
function serializeFeatureDescription(
	description: FeatureDescription,
	character?: Character
): string {
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
						// Fall back to fallback text when values not available
						return block.fallbackText;
					}
				}

				default:
					return '';
			}
		})
		.join('\n');
}

/**
 * Recursively search for a feature by name in a list of FeaturePrompts
 * This handles nested features in complex options
 */
function findFeatureInList(featureName: string, features: FeaturePrompt[]): FeaturePrompt | null {
	const normalizedSearchName = featureName.trim().toLowerCase();
	
	for (const feature of features) {
		// Check if this feature matches
		const normalizedFeatureName = feature.name.trim().toLowerCase();
		if (normalizedFeatureName === normalizedSearchName) {
			return feature;
		}
		
		// Search in nested prompts if this feature has options
		if (feature.featureOptions?.options) {
			for (const option of feature.featureOptions.options) {
				// Handle complex options with nested prompts
				if (typeof option !== 'string' && option.nestedPrompts) {
					const found = findFeatureInList(featureName, option.nestedPrompts);
					if (found) return found;
				}
			}
		}
	}
	
	return null;
}

/**
 * Search for a feature in class data
 */
function findFeatureInClass(className: string, featureName: string): FeaturePrompt | null {
	const classData = CLASS_MAP[className];
	if (!classData) return null;
	
	return findFeatureInList(featureName, classData.classFeatures || []);
}

/**
 * Search for a feature in species data
 */
function findFeatureInSpecies(speciesName: string, featureName: string): FeaturePrompt | null {
	const speciesData = SPECIES_MAP[speciesName];
	if (!speciesData) return null;
	
	return findFeatureInList(featureName, speciesData.speciesFeatures || []);
}

/**
 * Search for a feature in background data
 */
function findFeatureInBackground(backgroundName: string, featureName: string): FeaturePrompt | null {
	const backgroundData = BACKGROUND_MAP[backgroundName];
	if (!backgroundData) return null;
	
	return findFeatureInList(featureName, backgroundData.backgroundFeatures || []);
}

/**
 * Clean HTML tags and special characters from description for PDF display
 * The PDF library (WinAnsi encoding) cannot handle certain special characters
 * Convert supported HTML tags to PDF markers for styling
 */
export function cleanDescription(description: string): string {
	console.log('[cleanDescription] INPUT:', description.substring(0, 200));
	
	let result = description;
	
	// Convert <br> and <br/> tags to newlines
	result = result.replace(/<br\s*\/?>/gi, '\n');
	
	// Remove list item tags but keep bullets
	result = result.replace(/<li>/gi, '');
	result = result.replace(/<\/li>/gi, '\n');
	
	// Remove ul/ol tags
	result = result.replace(/<\/?ul>/gi, '');
	result = result.replace(/<\/?ol>/gi, '');
	
	// Convert <strong> and <b> tags to PDF bold markers
	// Use .*? for non-greedy matching of any content except newlines
	console.log('[cleanDescription] BEFORE strong replace');
	console.log('[cleanDescription] Input length:', result.length);
	let replacementCount = 0;
	result = result.replace(/<strong>(.*?)<\/strong>/gi, (match, p1) => {
		replacementCount++;
		const replacement = `[[BOLD:${p1}]]`;
		console.log(`[cleanDescription] STRONG MATCH #${replacementCount}:`, match, 'CAPTURED:', p1, 'REPLACING WITH:', replacement);
		return replacement;
	});
	console.log('[cleanDescription] Made', replacementCount, 'replacements');
	console.log('[cleanDescription] Result length after strong:', result.length);
	result = result.replace(/<b>(.*?)<\/b>/gi, '[[BOLD:$1]]');
	
	// Convert <i> and <em> tags to PDF italic markers
	result = result.replace(/<i>(.*?)<\/i>/gi, '[[ITALIC:$1]]');
	result = result.replace(/<em>(.*?)<\/em>/gi, '[[ITALIC:$1]]');
	
	console.log('[cleanDescription] AFTER tag conversion (first 400 chars):', result.substring(0, 400));
	console.log('[cleanDescription] AFTER tag conversion (chars 400-800):', result.substring(400, 800));
	
	// Remove any remaining HTML tags
	result = result.replace(/<[^>]+>/g, '');
	
	// Replace tabs with spaces (PDF WinAnsi cannot encode tabs)
	result = result.replace(/\t/g, ' ');
	
	// Replace other problematic whitespace characters
	result = result.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '');
	
	// Normalize multiple spaces to single space
	result = result.replace(/ {2,}/g, ' ');
	
	// Clean up whitespace at start/end of lines
	result = result.split('\n').map(line => line.trim()).join('\n');
	
	// Clean up multiple newlines
	result = result.replace(/\n{3,}/g, '\n\n');
	
	// Trim whitespace
	result = result.trim();
	
	console.log('[cleanDescription] OUTPUT:', result.substring(0, 200));
	
	return result;
}

/**
 * Look up feature description from original source data
 * 
 * @param featureName - Name of the feature to look up
 * @param className - Character's class name (optional)
 * @param speciesName - Character's species/race name (optional)
 * @param backgroundName - Character's background name (optional)
 * @returns FeaturePrompt if found, null otherwise
 */
export function lookupFeature(
	featureName: string,
	className?: string,
	speciesName?: string,
	backgroundName?: string
): FeaturePrompt | null {
	// Try class first if provided
	if (className) {
		const feature = findFeatureInClass(className, featureName);
		if (feature) return feature;
	}
	
	// Try species if provided
	if (speciesName) {
		const feature = findFeatureInSpecies(speciesName, featureName);
		if (feature) return feature;
	}
	
	// Try background if provided
	if (backgroundName) {
		const feature = findFeatureInBackground(backgroundName, featureName);
		if (feature) return feature;
	}
	
	// If no source provided, search everywhere
	if (!className && !speciesName && !backgroundName) {
		// Try all classes
		for (const cls of Object.keys(CLASS_MAP)) {
			const feature = findFeatureInClass(cls, featureName);
			if (feature) return feature;
		}
		
		// Try all species
		for (const species of Object.keys(SPECIES_MAP)) {
			const feature = findFeatureInSpecies(species, featureName);
			if (feature) return feature;
		}
		
		// Try all backgrounds
		for (const bg of Object.keys(BACKGROUND_MAP)) {
			const feature = findFeatureInBackground(bg, featureName);
			if (feature) return feature;
		}
	}
	
	return null;
}

/**
 * Get a formatted feature description for PDF
 * Returns the feature name and description formatted for display
 */
export function getFeatureDescription(
	featureName: string,
	character?: Character,
	className?: string,
	speciesName?: string,
	backgroundName?: string
): string | null {
	const feature = lookupFeature(featureName, className, speciesName, backgroundName);
	
	if (!feature) {
		return null;
	}
	
	// Serialize the description from blocks to text
	let descriptionText: string;
	if (typeof feature.description === 'string') {
		// Legacy safety
		descriptionText = feature.description;
	} else {
		descriptionText = serializeFeatureDescription(feature.description, character);
	}
	
	// Clean and return
	return cleanDescription(descriptionText);
}

/**
 * Check if a feature exists in the data
 */
export function hasFeature(
	featureName: string,
	className?: string,
	speciesName?: string,
	backgroundName?: string
): boolean {
	return lookupFeature(featureName, className, speciesName, backgroundName) !== null;
}
