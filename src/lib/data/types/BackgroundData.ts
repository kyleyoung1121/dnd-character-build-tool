import type { FeaturePrompt } from './Features';

export interface BackgroundEquipmentChoice {
	name: string;
	description: string;
	options: string[][];
}

export interface BackgroundEquipment {
	fixed: string[];
	choices: BackgroundEquipmentChoice[];
}

export interface BackgroundData {
	name: string;
	image: string;
	description: string;
	flavorDescription: string; // additional flavor text for the popup
	skillProficiencies: string[];
	languageCount?: number; // number of languages they can choose
	toolProficiencies?: string[];
	equipment: string[]; // deprecated - use startingEquipment instead
	startingEquipment?: BackgroundEquipment;
	feature: string; // special background feature name
	featureDescription: string; // description of the special feature
	backgroundFeatures: FeaturePrompt[];
	// Enhanced popup content
	enhancedFlavor?: string; // More immersive version of flavorDescription
	cultureNotes?: string; // Life before adventuring, connections
	popupImage?: string; // Enhanced artwork path
}
