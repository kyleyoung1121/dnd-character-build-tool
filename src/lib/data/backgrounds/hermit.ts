import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const hermit: BackgroundData = {
	name: 'Hermit',
	image: base + '/background_icons/hermit.jpg',
	description:
		'You lived in seclusion for a formative part of your life, finding quiet contemplation and spiritual awareness.',
	flavorDescription:
		'You lived in seclusion—either in a sheltered community such as a monastery, or entirely alone—for a formative part of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some of the answers you were looking for.',
	skillProficiencies: ['Medicine', 'Religion'],
	toolProficiencies: ['Herbalism kit'],
	languageCount: 1,
	equipment: [
		'Herbalism kit',
		'Scroll case stuffed full of notes from your studies or prayers',
		'Winter blanket',
		'Belt pouch with 5 gp'
	],
	feature: 'Discovery',
	featureDescription:
		'The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'hermit_skills',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency in Medicine and Religion.' },
				]
			},
			source: 'background:Hermit',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Medicine', 'Religion']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'hermit_tools',
			description: {
				blocks: [
					{ type: 'text', text: 'You gain proficiency with herbalism kit.' },
				]
			},
			source: 'background:Hermit',
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['Herbalism kit']
				}
			]
		},
		{
			name: 'Languages',
			id: 'hermit_languages',
			description: {
				blocks: [
					{ type: 'text', text: 'You can speak, read, and write one language of your choice.' },
				]
			},
			source: 'background:Hermit',
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
			id: 'hermit_equipment',
			description: {
				blocks: [
					{ type: 'text', text: 'You start with herbalism kit, scroll case with notes, winter blanket, and 5 gp.' },
				]
			},
			source: 'background:Hermit',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Herbalism kit',
						'Scroll case stuffed full of notes from your studies or prayers',
						'Winter blanket',
						'Belt pouch with 5 gp'
					]
				}
			]
		},
		{
			name: 'Discovery',
			id: 'hermit_feature',
			description: {
				blocks: [
					{ type: 'text', text: 'Your hermitage granted you access to a unique and powerful discovery about the cosmos, nature, history, or forgotten knowledge.' },
				]
			},
			source: 'background:Hermit',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Discovery'
				}
			]
		}
	]
};