import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const urchin: BackgroundData = {
	name: 'Urchin',
	image: base + '/background_icons/urchin.jpg',
	description:
		'You grew up on the streets alone, orphaned, and poor, surviving by your wits and determination.',
	flavorDescription:
		"You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or provide for you, so you learned to provide for yourself. You fought fiercely over food and kept a constant watch out for other desperate souls who might steal from you. You slept on rooftops and in alleyways, exposed to the elements, and endured sickness without the advantage of medicine or a place to recuperate. You've survived despite all odds, and did so through cunning, strength, speed, or some combination of each.",
	skillProficiencies: ['Sleight of Hand', 'Stealth'],
	toolProficiencies: ['Disguise kit', "Thieves' tools"],
	equipment: [
		'Small knife',
		'Map of the city you grew up in',
		'Pet mouse',
		'Token to remember your parents by',
		'Common clothes',
		'Belt pouch with 10 gp'
	],
	startingEquipment: {
		fixed: [
			'Small knife',
			'Map of the city you grew up in',
			'Pet mouse',
			'Token to remember your parents by',
			'Common clothes',
			'Belt pouch with 10 gp'
		],
		choices: []
	},
	feature: 'City Secrets',
	featureDescription:
		'You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'urchin_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Sleight of Hand and Stealth.' },
				]
			},
			source: 'background:Urchin',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Sleight of Hand', 'Stealth']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'urchin_tools',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency with disguise kit and thieves\' tools.' },
				]
			},
			source: 'background:Urchin',
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['Disguise kit', "Thieves' tools"]
				}
			]
		},
		{
			name: 'Equipment',
			id: 'urchin_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with a small knife, city map, pet mouse, token from parents, common clothes, and 10 gp.' },
				]
			},
			source: 'background:Urchin',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Small knife',
						'Map of the city you grew up in',
						'Pet mouse',
						'Token to remember your parents by',
						'Common clothes',
						'Belt pouch with 10 gp'
					]
				}
			]
		},
		{
			name: 'City Secrets',
			id: 'urchin_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'You know secret urban passages and can travel between city locations twice as fast as normal when not in combat.' },
				]
			},
			source: 'background:Urchin',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'City Secrets'
				}
			]
		}
	]
};