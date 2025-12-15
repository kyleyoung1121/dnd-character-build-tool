import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'variant_human_ability_score',
	description: {
		blocks: [
			{ type: 'text', text: 'Two different ability scores of your choice increase by 1 each.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose 2 Ability Scores-',
		options: ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'],
		numPicks: 2
	},
	source: 'variant_human',
	effects: [
		{
			target: '{userChoice}',
			action: 'modify',
			value: 1
		}
	]
};

// Skill Versatility Prompt
const skillVersatilityPrompt: FeaturePrompt = {
	name: 'Skill Versatility',
	id: 'variant_human_skill_versatility',
	description: {
		blocks: [
			{ type: 'text', text: 'You gain proficiency in one skill of your choice.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose 1 Skill-',
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
		numPicks: 1
	},
	source: 'variant_human',
	effects: [
		{
			target: 'proficiencies',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

export const variantHuman: SpeciesData = {
	name: 'Variant Human',
	image: base + '/species_icons/variant_human.jpg',
	description: `
		Variant humans are highly adaptable, gaining two ability score increases of your choice and proficiency in one skill.
	`,
	abilityScoreIncrease: '+1 to two ability scores of your choice',
	speed: '30 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'One extra language of your choice'],
	speciesFeatures: [abilityScoreChoicePrompt, skillVersatilityPrompt]
};