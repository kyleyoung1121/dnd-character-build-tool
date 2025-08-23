import { base } from '$app/paths';
import type { RaceData } from '$lib/data/types/RaceData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "variant_human_ability_score",
	description: `
		Two different ability scores of your choice increase by 1 each.
	`,
	featureOptions: {
		placeholderText: "-Choose 2 Ability Scores-",
		options: ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"],
		numPicks: 2
	},
	source: "variant_human",
	effects: [
		{
			target: "{userChoice}",
			action: "modify",
			value: 1
		}
	]
};

// Skill Versatility Prompt
const skillVersatilityPrompt: FeaturePrompt = {
	name: "Skill Versatility",
	id: "variant_human_skill_versatility",
	description: `
		You gain proficiency in one skill of your choice.
	`,
	featureOptions: {
		placeholderText: "-Choose 1 Skill-",
		options: [
			"Acrobatics", "Animal Handling", "Arcana", "Athletics",
			"Deception", "History", "Insight", "Intimidation",
			"Investigation", "Medicine", "Nature", "Perception",
			"Performance", "Persuasion", "Religion", "Sleight of Hand",
			"Stealth", "Survival"
		],
		numPicks: 1
	},
	source: "variant_human",
	effects: [
		{
			target: "proficiencies",
			action: "add",
			value: "{userChoice}"
		}
	]
};

export const variantHuman: RaceData = {
	name: "Variant Human",
	image: base + "/race_icons/variant_human.jpg",
	description: `
		Variant humans are highly adaptable, gaining two ability score increases of your choice and proficiency in one skill.
	`,
	abilityScoreIncrease: "+1 to two ability scores of your choice",
	speed: "30 ft.",
	size: "Medium",
	knownLanguages: ["Common", "One extra language of your choice"],
	raceFeatures: [
		abilityScoreChoicePrompt,
		skillVersatilityPrompt
	]
};
