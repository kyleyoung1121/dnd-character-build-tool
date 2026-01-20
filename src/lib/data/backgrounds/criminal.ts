import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const criminal: BackgroundData = {
	name: 'Criminal',
	image: base + '/background_icons/criminal.jpg',
	description: 'You are an experienced criminal with a history of breaking the law.',
	flavorDescription:
		"You have spent a lot of time among other criminals and still have contacts within the criminal underworld. You're far closer than most people to the world of murder, theft, and violence that pervades the underbelly of civilization, and you have survived by flouting the rules and regulations of society.",
	skillProficiencies: ['Deception', 'Stealth'],
	toolProficiencies: ['One type of gaming set', "Thieves' tools"],
	equipment: ['Crowbar', 'Dark common clothes with hood', 'Belt pouch with 15 gp'],
	startingEquipment: {
		fixed: [
			'Crowbar',
			'Dark common clothes with hood',
			'Belt pouch with 15 gp'
		],
		choices: []
	},
	feature: 'Criminal Contact',
	featureDescription:
		'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'criminal_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Deception and Stealth.' },
				]
			},
			source: 'background:Criminal',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Deception', 'Stealth']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'criminal_tools',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency with one type of gaming set and thieves\' tools.' },
				]
			},
			source: 'background:Criminal',
			featureOptions: {
				placeholderText: 'Select 1 gaming set',
				options: ['Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set'],
				numPicks: 1
			},
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['{userChoice}', "Thieves' tools"]
				}
			]
		},
		{
			name: 'Equipment',
			id: 'criminal_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with a crowbar, dark common clothes with hood, and 15 gp.' },
				]
			},
			source: 'background:Criminal',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: ['Crowbar', 'Dark common clothes with hood', 'Belt pouch with 15 gp']
				}
			]
		},
		{
			name: 'Criminal Contact',
			id: 'criminal_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'You have a reliable contact within the criminal underworld who can deliver messages and provide information about criminal activities.' },
				]
			},
			source: 'background:Criminal',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Criminal Contact'
				}
			]
		}
	]
};