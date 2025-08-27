import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'stout_halfling_ability_score',
	description: `
		Your Dexterity score increases by 2, and your Constitution score increases by 1.
	`,
	source: 'stout_halfling',
	effects: [
		{
			target: 'dexterity',
			action: 'modify',
			value: 2
		},
		{
			target: 'constitution',
			action: 'modify',
			value: 1
		}
	]
};

export const stoutHalfling: SpeciesData = {
	name: 'Stout Halfling',
	image: base + '/species_icons/stout_halfling.jpg',
	description: `
		Stout halflings are hardy and resilient, often living in rugged environments. 
		They are nimble and lucky, with a natural resistance to poison.
	`,
	abilityScoreIncrease: '+2 Dexterity, +1 Constitution',
	speed: '25 ft.',
	size: 'Small',
	knownLanguages: ['Common', 'Halfling'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: 'Lucky',
			id: 'stout_halfling_lucky',
			description: `
				When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, 
				you can reroll the die and must use the new roll.
			`,
			source: 'stout_halfling',
			effects: [{ target: 'features', action: 'add', value: 'Lucky' }]
		},
		{
			name: 'Brave',
			id: 'stout_halfling_brave',
			description: `
				You have advantage on saving throws against being frightened.
			`,
			source: 'stout_halfling',
			effects: [{ target: 'features', action: 'add', value: 'Brave' }]
		},
		{
			name: 'Stout Resilience',
			id: 'stout_halfling_resilience',
			description: `
				You have advantage on saving throws against poison, and you have resistance against poison damage.
			`,
			source: 'stout_halfling',
			effects: [{ target: 'features', action: 'add', value: 'Stout Resilience' }]
		}
	]
};
