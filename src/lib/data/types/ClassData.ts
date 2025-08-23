import type { FeaturePrompt } from './Features';

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
	classFeatures: FeaturePrompt[];
}
