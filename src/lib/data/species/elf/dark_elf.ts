import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'dark_elf_ability_score',
	description: `
		Your Dexterity score increases by 2, and your Charisma score increases by 1.
	`,
	source: 'dark_elf',
	effects: [
		{
			target: 'dexterity',
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

export const darkElf: SpeciesData = {
	name: 'Dark Elf (Drow)',
	image: base + '/species_icons/dark_elf.jpg',
	description: `
		Drows are a subterranean subrace of elves with darkvision and innate magical abilities. 
		They are known for their dexterity, stealth, and charm, but often face distrust from other races.
	`,
	abilityScoreIncrease: '+2 Dexterity, +1 Charisma',
	speed: '30 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'Elvish'],
	speciesFeatures: [
		abilityScoreChoicePrompt,
		{
			name: 'Darkvision',
			id: 'dark_elf_darkvision',
			description: `
				Accustomed to life underground, you have superior vision in dark and dim conditions. 
				You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.
			`,
			source: 'dark_elf',
			effects: [{ target: 'features', action: 'add', value: 'Darkvision' }]
		},
		{
			name: 'Keen Senses',
			id: 'dark_elf_keen_senses',
			description: `
				You have proficiency in the Perception skill.
			`,
			source: 'dark_elf',
			effects: [{ target: 'skills', action: 'add', value: 'Perception' }]
		},
		{
			name: 'Fey Ancestry',
			id: 'dark_elf_fey_ancestry',
			description: `
				You have advantage on saving throws against being charmed, and magic can't put you to sleep.
			`,
			source: 'dark_elf',
			effects: [{ target: 'features', action: 'add', value: 'Fey Ancestry' }]
		},
		{
			name: 'Trance',
			id: 'dark_elf_trance',
			description: `
				Elves don't need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.
				After resting this way, you gain the same benefit as 8 hours of sleep.
			`,
			source: 'dark_elf',
			effects: [{ target: 'features', action: 'add', value: 'Trance' }]
		},
		{
			name: 'Drow Magic',
			id: 'dark_elf_drow_magic',
			description: `
				You know the Dancing Lights cantrip. At 3rd level, you can cast Faerie Fire once per long rest, and at 5th level, you can cast Darkness once per long rest. 
				Charisma is your spellcasting ability for these spells.
			`,
			source: 'dark_elf',
			effects: [{ target: 'features', action: 'add', value: 'Drow Magic' }]
		},
		{
			name: 'Sunlight Sensitivity',
			id: 'dark_elf_sunlight_sensitivity',
			description: `
				You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.
			`,
			source: 'dark_elf',
			effects: [{ target: 'features', action: 'add', value: 'Sunlight Sensitivity' }]
		}
	]
};
