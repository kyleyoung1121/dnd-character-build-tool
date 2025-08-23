import { base } from '$app/paths';
import type { RaceData } from '$lib/data/types/RaceData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: "Ability Score Increase",
	id: "high_elf_ability_score",
	description: `
		Your Dexterity score increases by 2, and your Intelligence score increases by 1.
	`,
	source: "high_elf",
	effects: [
		{
			target: "dexterity",
			action: "modify",
			value: 2
		},
		{
			target: "intelligence",
			action: "modify",
			value: 1
		}
	]
};

export const highElf: RaceData = {
	name: "High Elf",
	image: base + "/race_icons/high_elf.jpg",
	description: `
		High elves are known for their intellect, refinement, and mastery of magic. 
		They have keen senses, a love of learning, and an innate elegance.
	`,
	abilityScoreIncrease: "+2 Dexterity, +1 Intelligence",
	speed: "30 ft.",
	size: "Medium",
	knownLanguages: ["Common", "Elvish", "One extra language of your choice"],
	raceFeatures: [
		abilityScoreChoicePrompt,
		{
			name: "Darkvision",
			id: "high_elf_darkvision",
			description: `
				Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. 
				You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.
			`,
			source: "high_elf",
			effects: [{ target: "features", action: "add", value: "Darkvision" }]
		},
		{
			name: "Keen Senses",
			id: "high_elf_keen_senses",
			description: `
				You have proficiency in the Perception skill.
			`,
			source: "high_elf",
			effects: [{ target: "skills", action: "add", value: "Perception" }]
		},
		{
			name: "Fey Ancestry",
			id: "high_elf_fey_ancestry",
			description: `
				You have advantage on saving throws against being charmed, and magic can't put you to sleep.
			`,
			source: "high_elf",
			effects: [{ target: "features", action: "add", value: "Fey Ancestry" }]
		},
		{
			name: "Trance",
			id: "high_elf_trance",
			description: `
				Elves don't need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. 
				After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.
			`,
			source: "high_elf",
			effects: [{ target: "features", action: "add", value: "Trance" }]
		},
		{
			name: "Cantrip",
			id: "high_elf_cantrip",
			description: `
				You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.
			`,
			featureOptions: {
				placeholderText: "-Choose a Cantrip-",
				options: [
					"Acid Splash", "Blade Ward", "Chill Touch", "Dancing Lights",
					"Fire Bolt", "Friends", "Light", "Mage Hand",
					"Mending", "Message", "Minor Illusion", "Poison Spray",
					"Prestidigitation", "Ray of Frost", "Shocking Grasp", "True Strike"
				],
				numPicks: 1
			},
			source: "high_elf",
			effects: [
				{
					target: "spells",
					action: "add",
					value: "{userChoice}"
				}
			]
		}
	]
};
