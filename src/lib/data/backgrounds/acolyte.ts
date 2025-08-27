import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const acolyte: BackgroundData = {
	name: 'Acolyte',
	image: base + '/background_icons/acolyte.jpg',
	description: 'You have spent your life in service to a temple of a specific god or pantheon of gods.',
	flavorDescription: 'You acted as an intermediary between the holy and mortal worlds, performing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine. You are not necessarily a cleric - performing sacred rites is not the same thing as channeling divine power.',
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
	featureDescription: 'As an acolyte, you command respect from worshipers of your faith. You can perform ceremonies for your deity. You and your companions can expect free healing and care at temples, shrines, or other established presences of your faith (though you must provide components for spells). Those who share your religion will support you at a modest lifestyle.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'acolyte_skills',
			description: 'You gain proficiency in Insight and Religion.',
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
			description: 'You can speak, read, and write two languages of your choice.',
			source: 'background:Acolyte',
			featureOptions: {
				placeholderText: 'Select 2 languages',
				options: ['Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'],
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
			description: 'You start with holy symbol, prayer book, incense, vestments, common clothes, and 15 gp.',
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
			description: 'You command respect from worshipers of your faith and can expect free healing and care at temples. Those who share your religion will support you at a modest lifestyle.',
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