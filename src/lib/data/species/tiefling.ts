import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'tiefling_ability_score',
	description: `
		Your Charisma score increases by 2, and your Intelligence score increases by 1.
	`,
	source: 'tiefling',
	effects: [
		{
			target: 'charisma',
			action: 'modify',
			value: 2
		},
		{
			target: 'intelligence',
			action: 'modify',
			value: 1
		}
	]
};

export const tiefling: SpeciesData = {
	name: 'Tiefling',
	image: base + '/species_icons/tiefling.jpg',
	description: `
		Tieflings are imbued with infernal heritage, giving them a charismatic yet mysterious presence. 
		They often face suspicion, but their natural talents and magical gifts help them stand out.
	`,
	abilityScoreIncrease: '+2 Charisma, +1 Intelligence',
	speed: '30 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'Infernal'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: 'Darkvision',
			id: 'tiefling_darkvision',
			description: `
				Thanks to your infernal heritage, you can see in dim light within 60 feet of you as if it were bright light,
				and in darkness as if it were dim light.
			`,
			source: 'tiefling',
			effects: [{ target: 'features', action: 'add', value: 'Darkvision' }]
		},
		{
			name: 'Hellish Resistance',
			id: 'tiefling_hellish_resistance',
			description: `
				You have resistance to fire damage.
			`,
			source: 'tiefling',
			effects: [{ target: 'features', action: 'add', value: 'Hellish Resistance' }]
		},
		{
			name: 'Infernal Legacy',
			id: 'tiefling_infernal_legacy',
			description: `
				You know the Thaumaturgy cantrip. Once you reach 3rd level, you can cast Hellish Rebuke once per long rest as a 2nd-level spell. 
				Once you reach 5th level, you can also cast Darkness once per long rest. Charisma is your spellcasting ability for these spells.
			`,
			source: 'tiefling',
			effects: [{ target: 'features', action: 'add', value: 'Infernal Legacy' }]
		}
	]
};
