import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const sailor: BackgroundData = {
	name: 'Sailor',
	image: base + '/background_icons/sailor.jpg',
	description:
		'You sailed on a seagoing vessel for years, facing down mighty storms, monsters of the deep, and those who wanted to sink your craft.',
	flavorDescription:
		'You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft to the bottomless depths. Your first love is the distant line of the horizon, but the time has come to try your hand at something new.',
	skillProficiencies: ['Athletics', 'Perception'],
	toolProficiencies: ["Navigator's tools", 'Vehicles (water)'],
	equipment: [
		'Belaying pin (club)',
		'Silk rope (50 feet)',
		'Lucky charm such as a rabbit foot or small stone with a hole in the center',
		'Common clothes',
		'Belt pouch with 10 gp'
	],
	feature: "Ship's Passage",
	featureDescription:
		"When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, or another ship you have good relations with (perhaps one captained by a former crewmate). Because you're calling in a favor, you can't be certain of a schedule or route that will meet your every need. Your Dungeon Master will determine how long it takes to get where you want to go. In return for your free passage, you and your companions are expected to assist the crew during the voyage.",
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'sailor_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Athletics and Perception.' },
				]
			},
			source: 'background:Sailor',
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
			id: 'sailor_tools',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency with navigator\'s tools and vehicles (water).' },
				]
			},
			source: 'background:Sailor',
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
			id: 'sailor_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with a belaying pin (club), silk rope, lucky charm, common clothes, and 10 gp.' },
				]
			},
			source: 'background:Sailor',
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
			name: "Ship's Passage",
			id: 'sailor_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'You can secure free passage on sailing ships for yourself and companions, though you\'re expected to assist the crew during the voyage.' },
				]
			},
			source: 'background:Sailor',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: "Ship's Passage"
				}
			]
		}
	]
};