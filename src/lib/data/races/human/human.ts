import { base } from '$app/paths';
import type { RaceData } from '$lib/data/types/RaceData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "human_ability_score",
	description: `
		Your Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma scores each increase by 1.
	`,
	source: "human",
	effects: [
		{ target: "strength", action: "modify", value: 1 },
		{ target: "dexterity", action: "modify", value: 1 },
		{ target: "constitution", action: "modify", value: 1 },
		{ target: "intelligence", action: "modify", value: 1 },
		{ target: "wisdom", action: "modify", value: 1 },
		{ target: "charisma", action: "modify", value: 1 }
	]
};

export const human: RaceData = {
	name: "Human",
	image: base + "/race_icons/human.jpg",
	description: `
		Humans are the most adaptable and ambitious people among the common races. 
		They are diverse in talents, motivations, and appearance.
	`,
	abilityScoreIncrease: "+1 to all ability scores",
	speed: "30 ft.",
	size: "Medium",
	knownLanguages: ["Common", "One extra language of your choice"],
	raceFeatures: [
		abilityScoreChoicePrompt
	]
};
