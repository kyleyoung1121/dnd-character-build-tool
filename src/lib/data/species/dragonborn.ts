import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'dragonborn_ability_score_choice',
	description: {
		blocks: [
			{ type: 'text', text: 'Your Strength score increases by 2, and your Charisma score increases by 1.' }
		]
	},
	source: 'dragonborn',
	effects: [
		{
			target: 'strength',
			action: 'modify',
			value: 2
		},
		{
			target: 'charisma',
			action: 'modify',
			value: 1
		}
	]
};

// Core elemental relation prompt
const draconicElementPrompt: FeaturePrompt = {
	name: 'Elemental Affinity',
	id: 'dragonborn_elemental_affinity',
	description: {
		blocks: [
			{ type: 'text', text: 'Your draconic heritage manifests as a connection to a destructive element. 		Choose the damage type that both your breath weapon and your natural resistance 		are associated with.' }
		]
	},
	featureOptions: {
		placeholderText: '-Choose an Element-',
		options: ['Acid', 'Cold', 'Fire', 'Lightning', 'Poison'],
		numPicks: 1
	},
	source: 'dragonborn',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Elemental Affinity: {userChoice}'
		}
	]
};

// Breath weapon prompt: let user specify shape
const breathShapePrompt: FeaturePrompt = {
	name: 'Breath Shape',
	id: 'dragonborn_breath_shape',
	description: {
		blocks: [
			{ type: 'text', text: 'Your breath weapon takes a particular form. Choose the shape of your exhalation.' }
		]
	},
	featureOptions: {
		placeholderText: '-Choose a Shape-',
		options: ['15 ft. Cone', '5 ft. by 30 ft. Line'],
		numPicks: 1
	},
	source: 'dragonborn',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Breath Weapon Shape: {userChoice}'
		}
	]
};

const speciesFeatures: FeaturePrompt[] = [
	{
		name: 'Breath Weapon',
		id: 'dragonborn_breath_weapon',
		description: {
			blocks: [
				{ type: 'text', text: 'You can use your action to exhale destructive energy.  			The damage type is determined by your Elemental Affinity, and the area of effect 			by your chosen Breath Shape.' }
			]
		},
		source: 'dragonborn',
		effects: [
			{
				target: 'features',
				action: 'add',
				value: 'Breath Weapon'
			}
		]
	},
	{
		name: 'Damage Resistance',
		id: 'dragonborn_damage_resistance',
		description: {
			blocks: [
				{ type: 'text', text: 'You have resistance to the damage type associated with your Elemental Affinity.' }
			]
		},
		source: 'dragonborn',
		effects: [
			{
				target: 'features',
				action: 'add',
				value: 'Damage Resistance'
			}
		]
	}
];

export const dragonborn: SpeciesData = {
	name: 'Dragonborn',
	image: base + '/species_icons/dragonborn.jpg',
	description: `
		Dragonborn look like dragons who walk on two legs. They don't have wings or tails, but they still are capable of unleashing the powerful breath of their ancestors.
	`,
	abilityScoreIncrease: '+2 Strength, +1 Charisma',
	speed: '30 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'Draconic'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		draconicElementPrompt,
		breathShapePrompt,
		...speciesFeatures
	]
};
