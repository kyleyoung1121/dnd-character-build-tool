import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const gladiator: BackgroundData = {
	name: 'Gladiator',
	image: base + '/background_icons/gladiator.jpg',
	description:
		'A gladiator is as much an entertainer as any minstrel or circus performer, trained to make the arts of combat into a spectacle the crowd can enjoy.',
	flavorDescription:
		'A gladiator is as much an entertainer as any minstrel or circus performer, trained to make the arts of combat into a spectacle the crowd can enjoy. This kind of flashy combat is your entertainer routine, though you might also have some skills as a tumbler or actor. Using your By Popular Demand feature, you can find a place to perform in any place that features combat for entertainment—perhaps a gladiatorial arena or secret pit fighting club.',
	skillProficiencies: ['Acrobatics', 'Performance'],
	toolProficiencies: ['Disguise kit', 'One type of unusual weapon'],
	equipment: [
		'Favor of an admirer (letter, trinket, etc)',
		'Costume',
		'Belt pouch with 15 gp'
	],
	startingEquipment: {
		fixed: [
			'Favor of an admirer (letter, trinket, etc)',
			'Costume',
			'Belt pouch with 15 gp'
		],
		choices: []
	},
	feature: 'By Popular Demand',
	featureDescription:
		'You can always find a place to perform, usually in gladiatorial arenas, fighting pits, or similar venues. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'gladiator_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Acrobatics and Performance.' },
				]
			},
			source: 'background:Gladiator',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Acrobatics', 'Performance']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'gladiator_tools',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency with disguise kit and one type of unusual weapon.' },
				]
			},
			source: 'background:Gladiator',
			featureOptions: {
				placeholderText: 'Select 1 unusual weapon',
				options: ['Trident', 'Net', 'Whip', 'Spiked chain', 'Cestus', 'Gladius'],
				numPicks: 1
			},
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['Disguise kit']
				},
				{
					target: 'proficiencies',
					action: 'add',
					value: ['{userChoice}']
				}
			]
		},
		{
			name: 'Equipment',
			id: 'gladiator_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with an unusual weapon, favor of an admirer, costume, and 15 gp.' },
				]
			},
			source: 'background:Gladiator',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Favor of an admirer (letter, trinket, etc)',
						'Costume',
						'Belt pouch with 15 gp'
					]
				}
			]
		},
		{
			name: 'By Popular Demand',
			id: 'gladiator_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'You can find performance venues in gladiatorial arenas and fighting pits, receiving lodging and food. Your combat performances make you a recognizable local figure.' },
				]
			},
			source: 'background:Gladiator',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'By Popular Demand'
				}
			]
		}
	]
};