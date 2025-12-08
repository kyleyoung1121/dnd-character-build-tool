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

import { lookupFeature, getFeatureDescription } from './feature-lookup';
import type { Character } from '$lib/stores/character_store';

export interface FeatureData {
	name: string;
	description: string;
	source: 'class' | 'race' | 'background' | 'feat' | 'subclass';
	level?: number; // At what level this feature is gained (for class features)
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
	// Use dynamic lookup from source files
	const className = character?.class;
	const raceName = character?.race || character?.subrace;
	const backgroundName = character?.background;
	
	const feature = lookupFeature(featureName, className, raceName, backgroundName);
	
	if (!feature) {
		return null;
	}
	
	// Convert FeaturePrompt to FeatureData format
	return {
		name: feature.name,
		description: getFeatureDescription(featureName, className, raceName, backgroundName) || feature.description,
		source: feature.source.includes('class') ? 'class' : 
		        feature.source.includes('background') ? 'background' : 'race',
		level: undefined // Not easily accessible from FeaturePrompt
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
	const featureData = getFeatureData(featureName, character);
	
	if (!featureData) {
		// If feature not found, just show the name with bullet
		return `• ${featureName}`;
	}
	
	// Format: <<BOLD:Name>>. Description
	// Name is marked for bold rendering, followed by period and description on same line
	return `<<BOLD:${featureData.name}>>. ${featureData.description}`;
}

/**
 * Format multiple features for PDF display
 * Separates each feature with double newline for spacing
 * 
 * @param featureNames - Array of feature names
 * @param character - Character object to provide context for lookup
 */
export function formatFeaturesForPDF(featureNames: string[], character?: Character): string {
	return featureNames
		.map(name => formatFeatureForPDF(name, character))
		.join('\n\n'); // Double newline creates space between features
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
