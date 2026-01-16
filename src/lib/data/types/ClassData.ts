import type { FeaturePrompt } from './Features';

// Sub-choice that requires user to pick specific items
export interface EquipmentSubChoice {
	name: string;
	description: string;
	type: 'weapon-list' | 'armor-list' | 'simple-list';
	category?: string; // e.g., 'martial-melee', 'simple-weapons', etc.
	options: string[]; // specific items to choose from
	count: number; // how many to pick
}

// An option that might need sub-choices
export interface EquipmentOption {
	label: string; // What the user sees: "Martial weapon + Shield"
	items?: string[]; // Direct items if no sub-choices needed
	subChoices?: EquipmentSubChoice[]; // Sub-choices needed to resolve
	requires?: string[]; // Required proficiencies (e.g., ['Heavy Armor'], ['Martial Weapons'])
}

// Enhanced equipment choice supporting multi-step selection
export interface EquipmentChoice {
	name: string;
	description: string;
	options: EquipmentOption[];
}

// Legacy support for simple choices
export interface SimpleEquipmentChoice {
	name: string;
	description: string;
	options: string[][];
}

export interface ClassData {
	name: string;
	image: string;
	description: string;
	hitDie: string;
	primaryAbility: string;
	saves: string[];
	armorProficiencies: string[];
	weaponProficiencies: string[];
	toolProficiencies?: string[];
	startingEquipment: {
		fixed: string[];
		choices: (EquipmentChoice | SimpleEquipmentChoice)[];
	};
	classFeatures: FeaturePrompt[];
	// Enhanced popup content
	enhancedFlavor?: string; // 1-2 sentence immersive description
	cultureNotes?: string; // Training, philosophy, typical members
	popupImage?: string; // Enhanced artwork path
}
