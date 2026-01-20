import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const pirate: BackgroundData = {
	name: 'Pirate',
	image: base + '/background_icons/pirate.jpg',
	description:
		'You spent your youth under the sway of a dread pirate, a ruthless cutthroat who taught you how to survive in a world of sharks and savages.',
	flavorDescription:
		"You spent your youth under the sway of a dread pirate, a ruthless cutthroat who taught you how to survive in a world of sharks and savages. You've indulged in larceny on the high seas and sent more than one deserving soul to a briny grave. Fear and bloodshed are no strangers to you, and you've garnered a somewhat unsavory reputation in many a port town.",
	skillProficiencies: ['Athletics', 'Perception'],
	toolProficiencies: ["Navigator's tools", 'Vehicles (water)'],
	equipment: [
		"Navigator's tools",
		'Belaying pin (club)',
		'Silk rope (50 feet)',
		'Lucky charm such as a rabbit foot or small stone with a hole in the center',
		'Common clothes',
		'Belt pouch with 10 gp'
	],
	startingEquipment: {
		fixed: [
			"Navigator's tools",
			'Belaying pin (club)',
			'Silk rope (50 feet)',
			'Lucky charm such as a rabbit foot or small stone with a hole in the center',
			'Common clothes',
			'Belt pouch with 10 gp'
		],
		choices: []
	},
	feature: 'Bad Reputation',
	featureDescription:
		'No matter where you go, people are afraid of you due to your reputation. When you are in a civilized settlement, you can get away with minor criminal offenses, such as refusing to pay for food at a tavern or breaking down doors at a local shop, since most people will not report your activity to the authorities.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'pirate_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Athletics and Perception.' },
				]
			},
			source: 'background:Pirate',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Athletics', 'Perception']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'pirate_tools',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency with navigator\'s tools and vehicles (water).' },
				]
			},
			source: 'background:Pirate',
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ["Navigator's tools", 'Vehicles (water)']
				}
			]
		},
		{
			name: 'Equipment',
			id: 'pirate_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with a belaying pin (club), silk rope, lucky charm, common clothes, and 10 gp.' },
				]
			},
			source: 'background:Pirate',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Belaying pin (club)',
						'Silk rope (50 feet)',
						'Lucky charm such as a rabbit foot or small stone with a hole in the center',
						'Common clothes',
						'Belt pouch with 10 gp'
					]
				}
			]
		},
		{
			name: 'Bad Reputation',
			id: 'pirate_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'Your fearsome reputation allows you to get away with minor criminal offenses in civilized settlements, as most people won\'t report you to authorities.' },
				]
			},
			source: 'background:Pirate',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Bad Reputation'
				}
			]
		}
	]
};