import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const soldier: BackgroundData = {
	name: 'Soldier',
	image: base + '/background_icons/soldier.jpg',
	description: 'War has been your life for as long as you care to remember.',
	flavorDescription: 'You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield. You might have been part of a standing national army or a mercenary company, or perhaps a member of a local militia who rose to prominence during a recent war.',
	skillProficiencies: ['Athletics', 'Intimidation'],
	toolProficiencies: ['One type of gaming set', 'Vehicles (land)'],
	equipment: [
		'Insignia of rank',
		'Trophy from fallen enemy',
		'Deck of cards',
		'Common clothes',
		'Belt pouch with 10 gp'
	],
	feature: 'Military Rank',
	featureDescription: 'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'soldier_skills',
			description: 'You gain proficiency in Athletics and Intimidation.',
			source: 'background:Soldier',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Athletics', 'Intimidation']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'soldier_tools',
			description: 'You gain proficiency with one type of gaming set and vehicles (land).',
			source: 'background:Soldier',
			featureOptions: {
				placeholderText: 'Select 1 gaming set',
				options: ['Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set'],
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
			id: 'soldier_equipment',
			description: 'You start with insignia of rank, trophy from fallen enemy, deck of cards, common clothes, and 10 gp.',
			source: 'background:Soldier',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Insignia of rank',
						'Trophy from fallen enemy',
						'Deck of cards',
						'Common clothes',
						'Belt pouch with 10 gp'
					]
				}
			]
		},
		{
			name: 'Military Rank',
			id: 'soldier_feature',
			description: 'You have a military rank that commands respect from other soldiers. You can invoke your rank to influence soldiers and requisition simple equipment.',
			source: 'background:Soldier',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Military Rank'
				}
			]
		}
	]
};