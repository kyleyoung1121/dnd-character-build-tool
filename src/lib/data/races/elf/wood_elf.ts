import { base } from '$app/paths';
import type { RaceData } from '$lib/data/types/RaceData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "wood_elf_ability_score",
	description: `
		Your Dexterity score increases by 2, and your Wisdom score increases by 1.
	`,
	source: "wood_elf",
	effects: [
		{
			target: "dexterity",
			action: "modify",
			value: 2
		},
		{
			target: "wisdom",
			action: "modify",
			value: 1
		}
	]
};

export const woodElf: RaceData = {
	name: "Wood Elf",
	image: base + "/race_icons/wood_elf.jpg",
	description: `
		Wood elves are reclusive and attuned to nature. They are swift, perceptive, and possess keen senses, thriving in forests and natural environments.
	`,
	abilityScoreIncrease: "+2 Dexterity, +1 Wisdom",
	speed: "35 ft.",
	size: "Medium",
	knownLanguages: ["Common", "Elvish"],
	raceFeatures: [
		abilityScoreChoicePrompt,
		{
			name: "Darkvision",
			id: "wood_elf_darkvision",
			description: `
				Accustomed to twilit forests, you have superior vision in dark and dim conditions. 
				You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.
			`,
			source: "wood_elf",
			effects: [{ target: "features", action: "add", value: "Darkvision" }]
		},
		{
			name: "Keen Senses",
			id: "wood_elf_keen_senses",
			description: `
				You have proficiency in the Perception skill.
			`,
			source: "wood_elf",
			effects: [{ target: "skills", action: "add", value: "Perception" }]
		},
		{
			name: "Fey Ancestry",
			id: "wood_elf_fey_ancestry",
			description: `
				You have advantage on saving throws against being charmed, and magic can't put you to sleep.
			`,
			source: "wood_elf",
			effects: [{ target: "features", action: "add", value: "Fey Ancestry" }]
		},
		{
			name: "Trance",
			id: "wood_elf_trance",
			description: `
				Elves don't need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. 
				After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.
			`,
			source: "wood_elf",
			effects: [{ target: "features", action: "add", value: "Trance" }]
		},
		{
			name: "Fleet of Foot",
			id: "wood_elf_fleet_of_foot",
			description: `
				Your base walking speed increases to 35 feet.
			`,
			source: "wood_elf",
			effects: [{ target: "speed", action: "set", value: "35 ft." }]
		},
		{
			name: "Mask of the Wild",
			id: "wood_elf_mask_of_the_wild",
			description: `
				You can attempt to hide even when you are only lightly obscured by natural phenomena, such as foliage, heavy rain, falling snow, mist, and other natural features.
			`,
			source: "wood_elf",
			effects: [{ target: "features", action: "add", value: "Mask of the Wild" }]
		}
	]
};
