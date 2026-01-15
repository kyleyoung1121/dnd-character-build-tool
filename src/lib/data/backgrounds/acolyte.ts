import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const acolyte: BackgroundData = {
	name: 'Acolyte',
	image: base + '/background_icons/acolyte.jpg',
	description:
		'You have spent your life in service to a temple of a specific god or pantheon of gods.',
	flavorDescription:
		'You acted as an intermediary between the holy and mortal worlds, performing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine. You are not necessarily a cleric - performing sacred rites is not the same thing as channeling divine power.',
	// Enhanced popup content for narrative preview
	enhancedFlavor: "Your hands have been anointed with holy oils, your voice trained in ancient prayers and sacred hymns. You are the bridge between the mortal world and the divine, guiding faithful souls toward salvation.",
	cultureNotes: "Acolytes often serve in temples, monasteries, or sacred groves, maintaining holy grounds and assisting clerics in their duties. You likely have deep connections within your faith community, contacts in other temples, and a network of fellow believers who share your devotion.",
	popupImage: "/background-popup-art/acolyte-temple-service.jpg", // Placeholder for professional artwork
	skillProficiencies: ['Insight', 'Religion'],
	languageCount: 2,
	equipment: [
		'Holy symbol (gift from your temple)',
		'Prayer book or prayer wheel',
		'5 sticks of incense',
		'Vestments',
		'Common clothes',
		'Belt pouch with 15 gp'
	],
	feature: 'Shelter of the Faithful',
	featureDescription:
		'As an acolyte, you command respect from worshipers of your faith. You can perform ceremonies for your deity. You and your companions can expect free healing and care at temples, shrines, or other established presences of your faith (though you must provide components for spells). Those who share your religion will support you at a modest lifestyle.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'acolyte_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Insight and Religion.' },
				]
			},
			source: 'background:Acolyte',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Insight', 'Religion']
				}
			]
		},
		{
			name: 'Languages',
			id: 'acolyte_languages',
			description: {
				blocks: [
					{ type: 'text', text: 'You can speak, read, and write two languages of your choice.' },
				]
			},
			source: 'background:Acolyte',
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
			id: 'acolyte_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with holy symbol, prayer book, incense, vestments, common clothes, and 15 gp.' },
				]
			},
			source: 'background:Acolyte',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Holy symbol (gift from your temple)',
						'Prayer book or prayer wheel',
						'5 sticks of incense',
						'Vestments',
						'Common clothes',
						'Belt pouch with 15 gp'
					]
				}
			]
		},
		{
			name: 'Shelter of the Faithful',
			id: 'acolyte_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'You command respect from worshipers of your faith and can expect free healing and care at temples. Those who share your religion will support you at a modest lifestyle.' },
				]
			},
			source: 'background:Acolyte',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Shelter of the Faithful'
				}
			]
		}
	]
};