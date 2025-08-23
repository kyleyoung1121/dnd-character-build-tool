import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "half_orc_ability_score",
	description: `
		Your Strength score increases by 2, and your Constitution score increases by 1.
	`,
	source: "half_orc",
	effects: [
		{
			target: "strength",
			action: "modify",
			value: 2
		},
		{
			target: "constitution",
			action: "modify",
			value: 1
		}
	]
};

export const halfOrc: SpeciesData = {
	name: "Half-Orc",
	image: base + "/species_icons/half_orc.jpg",
	description: `
		Half-orcs are strong, resilient, and fierce warriors, often walking the line between 
		human and orc societies. Their imposing presence is matched by their natural 
		physical power and toughness.
	`,
	abilityScoreIncrease: "+2 Strength, +1 Constitution",
	speed: "30 ft.",
	size: "Medium",
	knownLanguages: ["Common", "Orc"],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: "Darkvision",
			id: "half_orc_darkvision",
			description: `
				Thanks to your orc heritage, you have superior vision in dark and dim conditions.
				You can see in dim light within 60 feet of you as if it were bright light, 
				and in darkness as if it were dim light.
			`,
			source: "half_orc",
			effects: [{ target: "features", action: "add", value: "Darkvision" }]
		},
		{
			name: "Relentless Endurance",
			id: "half_orc_relentless_endurance",
			description: `
				When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. 
				You can use this feature once per long rest.
			`,
			source: "half_orc",
			effects: [{ target: "features", action: "add", value: "Relentless Endurance" }]
		},
		{
			name: "Savage Attacks",
			id: "half_orc_savage_attacks",
			description: `
				When you score a critical hit with a melee weapon attack, you can roll one of the weapon’s damage dice 
				one additional time and add it to the extra damage of the critical hit.
			`,
			source: "half_orc",
			effects: [{ target: "features", action: "add", value: "Savage Attacks" }]
		}
	]
};
