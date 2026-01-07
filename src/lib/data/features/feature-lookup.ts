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
import type { FeaturePrompt, FeatureDescription } from '$lib/data/types/Features';

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
 * Serialize feature description from blocks to plain text
 */
function serializeFeatureDescription(
	description: FeatureDescription
): string {
	return description.blocks
		.map((block) => {
			switch (block.type) {
				case 'text':
					return block.text;

				case 'computed-inline':
					// PDFs should be readable but deterministic.
					// We do NOT try to compute here.
					return block.text;

				case 'computed-replacement':
					// PDF export happens after character creation,
					// but to be safe, use fallback text.
					return block.fallbackText;

				default:
					return '';
			}
		})
		.join('\n\n');
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
	return description
		// Convert <br> and <br/> tags to newlines
		.replace(/<br\s*\/?>/gi, '\n')
		// Remove list item tags but keep bullets
		.replace(/<li>/gi, '')
		.replace(/<\/li>/gi, '\n')
		// Remove ul/ol tags
		.replace(/<\/?ul>/gi, '')
		.replace(/<\/?ol>/gi, '')
		// Convert <strong> and <b> tags to PDF bold markers
		.replace(/<strong>([^<]+)<\/strong>/gi, '<<BOLD:$1>>')
		.replace(/<b>([^<]+)<\/b>/gi, '<<BOLD:$1>>')
		// Convert <i> and <em> tags to PDF italic markers
		.replace(/<i>([^<]+)<\/i>/gi, '<<ITALIC:$1>>')
		.replace(/<em>([^<]+)<\/em>/gi, '<<ITALIC:$1>>')
		// Remove any remaining HTML tags
		.replace(/<[^>]+>/g, '')
		// Replace tabs with spaces (PDF WinAnsi cannot encode tabs)
		.replace(/\t/g, ' ')
		// Replace other problematic whitespace characters
		.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '')
		// Normalize multiple spaces to single space
		.replace(/ {2,}/g, ' ')
		// Clean up whitespace at start/end of lines
		.split('\n').map(line => line.trim()).join('\n')
		// Clean up multiple newlines
		.replace(/\n{3,}/g, '\n\n')
		// Trim whitespace
		.trim();
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
		descriptionText = serializeFeatureDescription(feature.description);
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
