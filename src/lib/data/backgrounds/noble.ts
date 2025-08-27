import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const noble: BackgroundData = {
	name: 'Noble',
	image: base + '/background_icons/noble.jpg',
	description: 'You understand wealth, power, and privilege.',
	flavorDescription: 'You carry a noble title, and your family owns land, collects taxes, and wields significant political influence. You might be a pampered aristocrat unfamiliar with work or discomfort, a former merchant just elevated to the nobility, or a disinherited scoundrel with a disproportionate sense of entitlement.',
	skillProficiencies: ['History', 'Persuasion'],
	toolProficiencies: ['One type of gaming set'],
	languageCount: 1,
	equipment: [
		'Fine clothes',
		'Signet ring',
		'Scroll of pedigree',
		'Purse with 25 gp'
	],
	feature: 'Position of Privilege',
	featureDescription: 'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure, and other people of high birth treat you as a member of the same social sphere.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'noble_skills',
			description: 'You gain proficiency in History and Persuasion.',
			source: 'background:Noble',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['History', 'Persuasion']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'noble_tools',
			description: 'You gain proficiency with one type of gaming set.',
			source: 'background:Noble',
			featureOptions: {
				placeholderText: 'Select 1 gaming set',
				options: ['Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set'],
				numPicks: 1
			},
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: '{userChoice}'
				}
			]
		},
		{
			name: 'Languages',
			id: 'noble_languages',
			description: 'You can speak, read, and write one language of your choice.',
			source: 'background:Noble',
			featureOptions: {
				placeholderText: 'Select 1 language',
				options: ['Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'],
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
		{
			name: 'Equipment',
			id: 'noble_equipment',
			description: 'You start with fine clothes, signet ring, scroll of pedigree, and 25 gp.',
			source: 'background:Noble',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Fine clothes',
						'Signet ring',
						'Scroll of pedigree',
						'Purse with 25 gp'
					]
				}
			]
		},
		{
			name: 'Position of Privilege',
			id: 'noble_feature',
			description: 'People are inclined to think the best of you. You are welcome in high society and the common folk make every effort to accommodate you.',
			source: 'background:Noble',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Position of Privilege'
				}
			]
		}
	]
};