import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const folkHero: BackgroundData = {
	name: 'Folk Hero',
	image: base + '/background_icons/folk_hero.jpg',
	description: 'You come from a humble social rank, but you are destined for so much more.',
	flavorDescription: 'Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere. You might have saved your village from a rampaging owlbear, or you might have stood up to the local tyrant.',
	skillProficiencies: ['Animal Handling', 'Survival'],
	toolProficiencies: ['One type of artisan\'s tools', 'Vehicles (land)'],
	equipment: [
		'Artisan\'s tools (one of your choice)',
		'Shovel',
		'Iron pot',
		'Common clothes',
		'Belt pouch with 10 gp'
	],
	startingEquipment: {
		fixed: [
			'Shovel',
			'Iron pot',
			'Common clothes',
			'Belt pouch with 10 gp'
		],
		choices: [
			{
				name: 'Artisan\'s Tools',
				description: 'Choose one type of artisan\'s tools',
				options: [
					['Alchemist\'s supplies'],
					['Brewer\'s supplies'],
					['Calligrapher\'s supplies'],
					['Carpenter\'s tools'],
					['Cartographer\'s tools'],
					['Cobbler\'s tools'],
					['Cook\'s utensils'],
					['Glassblower\'s tools'],
					['Jeweler\'s tools'],
					['Leatherworker\'s tools'],
					['Mason\'s tools'],
					['Painter\'s supplies'],
					['Potter\'s tools'],
					['Smith\'s tools'],
					['Tinker\'s tools'],
					['Weaver\'s tools'],
					['Woodcarver\'s tools']
				]
			}
		]
	},
	feature: 'Rustic Hospitality',
	featureDescription: 'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'folk_hero_skills',
			description: 'You gain proficiency in Animal Handling and Survival.',
			source: 'background:Folk Hero',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Animal Handling', 'Survival']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'folk_hero_tools',
			description: 'You gain proficiency with one type of artisan\'s tools and vehicles (land).',
			source: 'background:Folk Hero',
			featureOptions: {
				placeholderText: 'Select 1 artisan\'s tools',
				options: [
					'Alchemist\'s supplies',
					'Brewer\'s supplies',
					'Calligrapher\'s supplies',
					'Carpenter\'s tools',
					'Cartographer\'s tools',
					'Cobbler\'s tools',
					'Cook\'s utensils',
					'Glassblower\'s tools',
					'Jeweler\'s tools',
					'Leatherworker\'s tools',
					'Mason\'s tools',
					'Painter\'s supplies',
					'Potter\'s tools',
					'Smith\'s tools',
					'Tinker\'s tools',
					'Weaver\'s tools',
					'Woodcarver\'s tools'
				],
				numPicks: 1
			},
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['{userChoice}', 'Vehicles (land)']
				}
			]
		},
		{
			name: 'Equipment',
			id: 'folk_hero_equipment',
			description: 'You start with artisan\'s tools, shovel, iron pot, common clothes, and 10 gp.',
			source: 'background:Folk Hero',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Shovel',
						'Iron pot',
						'Common clothes',
						'Belt pouch with 10 gp'
					]
				}
			]
		},
		{
			name: 'Rustic Hospitality',
			id: 'folk_hero_feature',
			description: 'You fit in among common folk with ease and can find shelter among them. They will shield you from the law unless you\'ve shown yourself to be dangerous.',
			source: 'background:Folk Hero',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Rustic Hospitality'
				}
			]
		}
	]
};