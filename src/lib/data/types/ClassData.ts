import type { FeaturePrompt } from './Features';

export interface EquipmentChoice {
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
		choices: EquipmentChoice[];
	};
	classFeatures: FeaturePrompt[];
}
