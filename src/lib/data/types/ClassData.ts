import type { FeaturePrompt } from './ClassFeatures';

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
	skillChoices?: FeaturePrompt;
	subclassChoices?: FeaturePrompt;
	classFeatures: FeaturePrompt[];
}
