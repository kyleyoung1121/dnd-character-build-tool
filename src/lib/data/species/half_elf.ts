import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'half_elf_ability_score_choice',
	description: `
		Your Charisma score increases by 2, and two other ability scores of your choice 
		increase by 1 each.
	`,
	featureOptions: {
		placeholderText: '-Choose 2 Ability Scores-',
		options: ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom'],
		numPicks: 2
	},
	source: 'half_elf',
	effects: [
		{
			target: 'charisma',
			action: 'modify',
			value: 2
		},
		{
			target: '{userChoice}', // placeholder will resolve to e.g. "strength"
			action: 'modify',
			value: 1
		}
	]
};

// Skill Versatility Prompt
const skillVersatilityPrompt: FeaturePrompt = {
	name: 'Skill Versatility',
	id: 'half_elf_skill_versatility',
	description: `
		You gain proficiency in two skills of your choice.
	`,
	featureOptions: {
		placeholderText: '-Choose 2 Skills-',
		options: [
			'Acrobatics',
			'Animal Handling',
			'Arcana',
			'Athletics',
			'Deception',
			'History',
			'Insight',
			'Intimidation',
			'Investigation',
			'Medicine',
			'Nature',
			'Perception',
			'Performance',
			'Persuasion',
			'Religion',
			'Sleight of Hand',
			'Stealth',
			'Survival'
		],
		numPicks: 2
	},
	source: 'half_elf',
	effects: [
		{
			target: 'proficiencies',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

export const halfElf: SpeciesData = {
	name: 'Half-Elf',
	image: base + '/species_icons/half_elf.jpg',
	description: `
		Half-elves combine what some say are the best qualities of their elf and human parents. 
		They are charismatic, versatile, and find themselves at home in both societies, 
		though sometimes belonging fully to neither.
	`,
	abilityScoreIncrease: '+2 Charisma, +1 to two other ability scores of your choice',
	speed: '30 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'Elvish', 'One extra language of your choice'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: 'Darkvision',
			id: 'half_elf_darkvision',
			description: `
				Thanks to your elf blood, you have superior vision in dark and dim conditions. 
				You can see in dim light within 60 feet of you as if it were bright light, 
				and in darkness as if it were dim light.
			`,
			source: 'half_elf',
			effects: [{ target: 'features', action: 'add', value: 'Darkvision' }]
		},
		{
			name: 'Fey Ancestry',
			id: 'half_elf_fey_ancestry',
			description: `
				You have advantage on saving throws against being charmed, and magic can't put you to sleep.
			`,
			source: 'half_elf',
			effects: [{ target: 'features', action: 'add', value: 'Fey Ancestry' }]
		},
		skillVersatilityPrompt
	]
};
