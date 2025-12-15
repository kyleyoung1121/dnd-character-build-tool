import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const sage: BackgroundData = {
	name: 'Sage',
	image: base + '/background_icons/sage.jpg',
	description: 'You spent years learning the lore of the multiverse.',
	flavorDescription:
		"You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you a master in your fields of study. You might be a librarian, wizard's apprentice, or student of an obscure school of magical theory.",
	skillProficiencies: ['Arcana', 'History'],
	languageCount: 2,
	equipment: [
		'Bottle of black ink',
		'Quill',
		'Small knife',
		'Letter from dead colleague',
		'Common clothes',
		'Belt pouch with 10 gp'
	],
	feature: 'Researcher',
	featureDescription:
		'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'sage_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Arcana and History.' },
				]
			},
			source: 'background:Sage',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Arcana', 'History']
				}
			]
		},
		{
			name: 'Languages',
			id: 'sage_languages',
			description: {
				blocks: [
					{ type: 'text', text: 'You can speak, read, and write two languages of your choice.' },
				]
			},
			source: 'background:Sage',
			featureOptions: {
				placeholderText: 'Select 2 languages',
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
				numPicks: 2
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
			id: 'sage_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with ink, quill, small knife, letter from dead colleague, common clothes, and 10 gp.' },
				]
			},
			source: 'background:Sage',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Bottle of black ink',
						'Quill',
						'Small knife',
						'Letter from dead colleague',
						'Common clothes',
						'Belt pouch with 10 gp'
					]
				}
			]
		},
		{
			name: 'Researcher',
			id: 'sage_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'When you don\'t know information, you often know where and from whom you can obtain it, usually from libraries, universities, or other learned persons.' },
				]
			},
			source: 'background:Sage',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Researcher'
				}
			]
		}
	]
};