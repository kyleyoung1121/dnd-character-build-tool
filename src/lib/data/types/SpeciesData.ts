import type { FeaturePrompt } from './Features';

export interface SpeciesData {
	name: string;
	image: string;
	description: string;
	abilityScoreIncrease: string; // e.g. "+2 Dexterity, +1 Wisdom"
	speed: string; // e.g. "30 ft."
	size: string; // Small / Medium
	knownLanguages: string[];
	speciesFeatures: FeaturePrompt[]; // parallels classFeatures
}
