import { base } from '$app/paths';
import type { RaceData } from '$lib/data/types/RaceData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "lightfoot_halfling_ability_score",
	description: `
		Your Dexterity score increases by 2.
	`,
	source: "lightfoot_halfling",
	effects: [
		{
			target: "dexterity",
			action: "modify",
			value: 2
		}
	]
};

export const lightfootHalfling: RaceData = {
	name: "Lightfoot Halfling",
	image: base + "/race_icons/lightfoot_halfling.jpg",
	description: `
		Lightfoot halflings are nimble and lucky, known for their stealth and friendly nature. 
		They often move unseen and have a knack for staying out of trouble.
	`,
	abilityScoreIncrease: "+2 Dexterity",
	speed: "25 ft.",
	size: "Small",
	knownLanguages: ["Common", "Halfling"],
	raceFeatures: [
		abilityScoreChoicePrompt,
		{
			name: "Lucky",
			id: "lightfoot_halfling_lucky",
			description: `
				When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, 
				you can reroll the die and must use the new roll.
			`,
			source: "lightfoot_halfling",
			effects: [{ target: "features", action: "add", value: "Lucky" }]
		},
		{
			name: "Brave",
			id: "lightfoot_halfling_brave",
			description: `
				You have advantage on saving throws against being frightened.
			`,
			source: "lightfoot_halfling",
			effects: [{ target: "features", action: "add", value: "Brave" }]
		},
		{
			name: "Halfling Nimbleness",
			id: "lightfoot_halfling_nimbleness",
			description: `
				You can move through the space of any creature that is of a size larger than yours.
			`,
			source: "lightfoot_halfling",
			effects: [{ target: "features", action: "add", value: "Halfling Nimbleness" }]
		},
		{
			name: "Naturally Stealthy",
			id: "lightfoot_halfling_naturally_stealthy",
			description: `
				You can attempt to hide even when obscured only by a creature that is at least one size larger than you.
			`,
			source: "lightfoot_halfling",
			effects: [{ target: "features", action: "add", value: "Naturally Stealthy" }]
		}
	]
};
