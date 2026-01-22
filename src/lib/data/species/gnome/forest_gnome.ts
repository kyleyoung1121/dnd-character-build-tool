import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'forest_gnome_ability_score',
	description: {
		blocks: [
			{ type: 'text', text: 'Your Constitution score increases by 1, and your Intelligence score increases by 2.' },
		]
	},
	source: 'forest_gnome',
	effects: [
		{
			target: 'constitution',
			action: 'modify',
			value: 1
		},
		{
			target: 'intelligence',
			action: 'modify',
			value: 2
		}
	]
};

export const forestGnome: SpeciesData = {
	name: 'Forest Gnome',
	image: base + '/species_icons/forest_gnome.jpg',
	description: `
		Forest gnomes are reclusive and whimsical, with a natural affinity for the forest. 
		They are adept at illusion magic and skilled at hiding in their natural surroundings.
	`,
	abilityScoreIncrease: '+2 Intelligence, +1 Constitution',
	speed: '25 ft.',
	size: 'Small',
	knownLanguages: ['Common', 'Gnomish'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: 'Speed',
			id: 'forest_gnome_speed',
			description: {
				blocks: [
					{ type: 'text', text: 'Your base walking speed is 25 feet.' },
				]
			},
			source: 'forest_gnome',
			effects: [{ target: 'speed', action: 'set', value: '25 ft.' }]
		},
		{
			name: 'Darkvision',
			id: 'forest_gnome_darkvision',
			description: {
				blocks: [
					{ type: 'text', text: 'Accustomed to life underground and in forests, you have superior vision in dark and dim conditions.  				You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
				]
			},
			source: 'forest_gnome',
			effects: [{ target: 'features', action: 'add', value: 'Darkvision' }]
		},
		{
			name: 'Gnome Cunning',
			id: 'forest_gnome_gnome_cunning',
			description: {
				blocks: [
					{ type: 'text', text: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.' },
				]
			},
			source: 'forest_gnome',
			effects: [{ target: 'features', action: 'add', value: 'Gnome Cunning' }]
		},
		{
			name: 'Natural Illusionist',
			id: 'forest_gnome_natural_illusionist',
			description: {
				blocks: [
					{ type: 'text', text: 'You know the Minor Illusion cantrip. Intelligence is your spellcasting ability for it.' },
				]
			},
			source: 'forest_gnome',
			effects: [{ target: 'features', action: 'add', value: 'Natural Illusionist' }]
		},
		{
			name: 'Speak with Small Beasts',
			id: 'forest_gnome_speak_with_small_beasts',
			description: {
				blocks: [
					{ type: 'text', text: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.' },
				]
			},
			source: 'forest_gnome',
			effects: [{ target: 'features', action: 'add', value: 'Speak with Small Beasts' }]
		}
	]
};