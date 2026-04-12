import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'high_elf_ability_score',
	description: {
		blocks: [
			{ type: 'text', text: 'Your Dexterity score increases by 2, and your Intelligence score increases by 1.' },
		]
	},
	source: 'high_elf',
	effects: [
		{
			target: 'dexterity',
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

export const highElf: SpeciesData = {
	name: 'High Elf',
	image: base + '/species_icons/high_elf.jpg',
	description: `
		High elves are known for their intellect, refinement, and mastery of magic. 
		They have keen senses, a love of learning, and an innate elegance.
	`,
	abilityScoreIncrease: '+2 Dexterity, +1 Intelligence',
	speed: '30 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'Elvish', 'One extra language of your choice'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: 'Darkvision',
			id: 'high_elf_darkvision',
			description: {
				blocks: [
					{ type: 'text', text: 'Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions.  				You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.' },
				]
			},
			source: 'high_elf',
			effects: [{ target: 'features', action: 'add', value: 'Darkvision' }]
		},
		{
			name: 'Keen Senses',
			id: 'high_elf_keen_senses',
			description: {
				blocks: [
					{ type: 'text', text: 'You have proficiency in the Perception skill.' },
				]
			},
			source: 'high_elf',
			effects: [{ target: 'skills', action: 'add', value: 'Perception' }]
		},
		{
			name: 'Fey Ancestry',
			id: 'high_elf_fey_ancestry',
			description: {
				blocks: [
					{ type: 'text', text: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
				]
			},
			source: 'high_elf',
			effects: [{ target: 'features', action: 'add', value: 'Fey Ancestry' }]
		},
		{
			name: 'Trance',
			id: 'high_elf_trance',
			description: {
				blocks: [
					{ type: 'text', text: 'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.  				After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.' },
				]
			},
			source: 'high_elf',
			importance: 'minor',
			effects: [{ target: 'features', action: 'add', value: 'Trance' }]
		},
		{
			name: 'Cantrip',
			id: 'high_elf_cantrip',
			description: {
				blocks: [
					{ type: 'text', text: 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it. (Select this cantrip in the Spells tab)' },
				]
			},
			source: 'high_elf',
			effects: []
		},
		{
			name: 'Languages',
			id: 'high_elf_languages',
			description: {
				blocks: [
					{type: 'text', text: 'You can speak, read, and write Common and Elvish. Elvish is fluid, with subtle intonations and intricate grammar. Elven literature is rich and varied, and their songs and poems are famous among other races. Many bards learn their language so they can add Elvish ballads to their repertoires.'}
				]
			},
			source: 'high_elf',
			effects: [
				{ target: 'languages', action: 'add', value: 'Common'},
				{ target: 'languages', action: 'add', value: 'Elvish'},
				
			]
		},
		{
			name: 'Extra Language',
			id: 'high_elf_extra_language',
			description: {
				blocks: [
					{ type: 'text', text: 'You can speak, read, and write one extra language of your choice.' },
				]
			},
			source: 'high_elf',
			featureOptions: {
				placeholderText: 'Select 1 language',
				options: [
					'Common',
					'Dwarvish',
					'Elvish',
					'Giant',
					'Gnomish',
					'Goblin',
					'Halfling',
					'Orc',
					'Abyssal',
					'Celestial',
					'Draconic',
					'Deep Speech',
					'Infernal',
					'Primordial',
					'Sylvan',
					'Undercommon'
				],
				numPicks: 1
			},
			effects: [
				{
					target: 'languages',
					action: 'add',
					value: '{userChoice}'
				}
			]
		},
	]
};