import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const entertainer: BackgroundData = {
	name: 'Entertainer',
	image: base + '/background_icons/entertainer.jpg',
	description: 'You thrive in front of an audience and know how to entrance them, entertain them, and even inspire them.',
	flavorDescription: 'Your poetics can stir the hearts of those who hear you, awakening grief or joy, laughter or anger. Your music raises their spirits or captures their sorrow. Your dance steps captivate, your humor cuts to the quick. Whatever techniques you use, your art is your life.',
	skillProficiencies: ['Acrobatics', 'Performance'],
	toolProficiencies: ['Disguise kit', 'One type of musical instrument'],
	equipment: [
		'Musical instrument (one of your choice)',
		'Favor of an admirer (love letter, lock of hair, or trinket)',
		'Costume',
		'Belt pouch with 15 gp'
	],
	startingEquipment: {
		fixed: [
			'Favor of an admirer (love letter, lock of hair, or trinket)',
			'Costume',
			'Belt pouch with 15 gp'
		],
		choices: [
			{
				name: 'Musical Instrument',
				description: 'Choose one musical instrument',
				options: [
					['Bagpipes'],
					['Drums'],
					['Dulcimer'],
					['Flute'],
					['Lute'],
					['Lyre'],
					['Horn'],
					['Pan flute'],
					['Shawm'],
					['Viol']
				]
			}
		]
	},
	feature: 'By Popular Demand',
	featureDescription: 'You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble\'s court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'entertainer_skills',
			description: 'You gain proficiency in Acrobatics and Performance.',
			source: 'background:Entertainer',
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
			id: 'entertainer_tools',
			description: 'You gain proficiency with disguise kit and one type of musical instrument.',
			source: 'background:Entertainer',
			featureOptions: {
				placeholderText: 'Select 1 musical instrument',
				options: ['Bagpipes', 'Drums', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan flute', 'Shawm', 'Viol'],
				numPicks: 1
			},
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['Disguise kit', '{userChoice}']
				}
			]
		},
		{
			name: 'Equipment',
			id: 'entertainer_equipment',
			description: 'You start with a musical instrument, favor of an admirer, costume, and 15 gp.',
			source: 'background:Entertainer',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Favor of an admirer (love letter, lock of hair, or trinket)',
						'Costume',
						'Belt pouch with 15 gp'
					]
				}
			]
		},
		{
			name: 'By Popular Demand',
			id: 'entertainer_feature',
			description: 'You can always find a place to perform and receive free lodging and food. Your performances make you a local figure that strangers take a liking to.',
			source: 'background:Entertainer',
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