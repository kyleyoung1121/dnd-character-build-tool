import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const knight: BackgroundData = {
	name: 'Knight',
	image: base + '/background_icons/knight.jpg',
	description:
		'You understand wealth, power, and privilege as a knight who has sworn fealty to a sovereign.',
	flavorDescription:
		'A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature instead of the Position of Privilege feature. One of your commoner retainers is replaced by a noble who serves as your squire, aiding you in exchange for training on his or her own path to knighthood. Your two remaining retainers might include a groom to care for your horse and a servant to polish your armor (and even help you put it on).',
	skillProficiencies: ['History', 'Persuasion'],
	toolProficiencies: ['One type of gaming set'],
	languageCount: 1,
	equipment: ['Signet ring', 'Scroll of pedigree', 'Fine clothes', 'Belt pouch with 25 gp'],
	feature: 'Retainers',
	featureDescription:
		'You have the service of three retainers loyal to your family. One is a noble who serves as your squire, aiding you in exchange for training on their own path to knighthood. Your two remaining retainers might include a groom to care for your horse and a servant to polish your armor. Your retainers can perform mundane tasks for you, but they do not fight for you, will not follow you into obviously dangerous areas, and will leave if they are frequently endangered.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'knight_skills',
			description: 'You gain proficiency in History and Persuasion.',
			source: 'background:Knight',
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
			id: 'knight_tools',
			description: 'You gain proficiency with one type of gaming set.',
			source: 'background:Knight',
			featureOptions: {
				placeholderText: 'Select 1 gaming set',
				options: ['Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set'],
				numPicks: 1
			},
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['{userChoice}']
				}
			]
		},
		{
			name: 'Languages',
			id: 'knight_languages',
			description: 'You can speak, read, and write one language of your choice.',
			source: 'background:Knight',
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
		{
			name: 'Equipment',
			id: 'knight_equipment',
			description: 'You start with a signet ring, scroll of pedigree, fine clothes, and 25 gp.',
			source: 'background:Knight',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: ['Signet ring', 'Scroll of pedigree', 'Fine clothes', 'Belt pouch with 25 gp']
				}
			]
		},
		{
			name: 'Retainers',
			id: 'knight_feature',
			description:
				'You have three retainers: a noble squire training for knighthood, and two others such as a groom and servant who perform mundane tasks.',
			source: 'background:Knight',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Retainers'
				}
			]
		}
	]
};
