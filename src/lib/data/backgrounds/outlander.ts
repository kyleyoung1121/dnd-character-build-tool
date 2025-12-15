import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const outlander: BackgroundData = {
	name: 'Outlander',
	image: base + '/background_icons/outlander.jpg',
	description:
		'You grew up in the wilds, far from civilization and the comforts of town and technology.',
	flavorDescription:
		"You've witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller could comprehend, and enjoyed the solitude of being the only thinking creature for miles in any direction.",
	skillProficiencies: ['Athletics', 'Survival'],
	toolProficiencies: ['One type of musical instrument'],
	languageCount: 1,
	equipment: ['Staff', 'Hunting trap', "Traveler's clothes", 'Belt pouch with 10 gp'],
	feature: 'Wanderer',
	featureDescription:
		'You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and shelter for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'outlander_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Athletics and Survival.' },
				]
			},
			source: 'background:Outlander',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Athletics', 'Survival']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'outlander_tools',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency with one type of musical instrument.' },
				]
			},
			source: 'background:Outlander',
			featureOptions: {
				placeholderText: 'Select 1 musical instrument',
				options: [
					'Bagpipes',
					'Drum',
					'Dulcimer',
					'Flute',
					'Lute',
					'Lyre',
					'Horn',
					'Pan flute',
					'Shawm',
					'Viol'
				],
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
			id: 'outlander_languages',
			description: {
				blocks: [
					{ type: 'text', text: 'You can speak, read, and write one language of your choice.' },
				]
			},
			source: 'background:Outlander',
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
			id: 'outlander_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with a staff, hunting trap, traveler\'s clothes, and 10 gp.' },
				]
			},
			source: 'background:Outlander',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: ['Staff', 'Hunting trap', "Traveler's clothes", 'Belt pouch with 10 gp']
				}
			]
		},
		{
			name: 'Wanderer',
			id: 'outlander_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'You have excellent memory for geography and can find food and shelter for yourself and up to five others each day in the wilderness.' },
				]
			},
			source: 'background:Outlander',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Wanderer'
				}
			]
		}
	]
};