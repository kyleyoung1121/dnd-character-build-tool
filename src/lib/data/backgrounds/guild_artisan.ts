import { base } from '$app/paths';
import type { BackgroundData } from '../types/BackgroundData';

export const guildArtisan: BackgroundData = {
	name: 'Guild Artisan',
	image: base + '/background_icons/guild_artisan.jpg',
	description:
		"You are a member of an artisan's guild, skilled in a particular field and closely associated with other artisans.",
	flavorDescription:
		"You are a member of an artisan's guild, skilled in a particular field and closely associated with other artisans. You are a well-established part of the mercantile world, freed by talent and wealth from the constraints of a feudal social order. You learned your skills as an apprentice to a master artisan, under the sponsorship of your guild, until you became a master in your own right.",
	skillProficiencies: ['Insight', 'Persuasion'],
	toolProficiencies: ["One type of artisan's tools"],
	languageCount: 1,
	equipment: [
		"Artisan's tools (one of your choice)",
		'Letter of introduction from your guild',
		"Traveler's clothes",
		'Belt pouch with 15 gp'
	],
	startingEquipment: {
		fixed: [
			'Letter of introduction from your guild',
			"Traveler's clothes",
			'Belt pouch with 15 gp'
		],
		choices: [
			{
				name: "Artisan's Tools",
				description: "Choose one type of artisan's tools",
				options: [
					["Alchemist's supplies"],
					["Brewer's supplies"],
					["Calligrapher's supplies"],
					["Carpenter's tools"],
					["Cartographer's tools"],
					["Cobbler's tools"],
					["Cook's utensils"],
					["Glassblower's tools"],
					["Jeweler's tools"],
					["Leatherworker's tools"],
					["Mason's tools"],
					["Painter's supplies"],
					["Potter's tools"],
					["Smith's tools"],
					["Tinker's tools"],
					["Weaver's tools"],
					["Woodcarver's tools"]
				]
			}
		]
	},
	feature: 'Guild Membership',
	featureDescription:
		'As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed. In some cities and towns, a guildhall offers a central place to meet other members of your profession, which can be a good place to meet potential patrons, allies, or hirelings.',
	backgroundFeatures: [
		{
			name: 'Skill Proficiencies',
			id: 'guild_artisan_skills',
			description: 'You gain proficiency in Insight and Persuasion.',
			source: 'background:Guild Artisan',
			effects: [
				{
					target: 'skills',
					action: 'add',
					value: ['Insight', 'Persuasion']
				}
			]
		},
		{
			name: 'Tool Proficiencies',
			id: 'guild_artisan_tools',
			description: "You gain proficiency with one type of artisan's tools.",
			source: 'background:Guild Artisan',
			featureOptions: {
				placeholderText: "Select 1 artisan's tools",
				options: [
					"Alchemist's supplies",
					"Brewer's supplies",
					"Calligrapher's supplies",
					"Carpenter's tools",
					"Cartographer's tools",
					"Cobbler's tools",
					"Cook's utensils",
					"Glassblower's tools",
					"Jeweler's tools",
					"Leatherworker's tools",
					"Mason's tools",
					"Painter's supplies",
					"Potter's tools",
					"Smith's tools",
					"Tinker's tools",
					"Weaver's tools",
					"Woodcarver's tools"
				],
				numPicks: 1
			},
			effects: [
				{
					target: 'proficiencies',
					action: 'add',
					value: ['{userChoice}']
				}
			]
		},
		{
			name: 'Languages',
			id: 'guild_artisan_languages',
			description: 'You can speak, read, and write one language of your choice.',
			source: 'background:Guild Artisan',
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
			id: 'guild_artisan_equipment',
			description:
				"You start with artisan's tools, letter of introduction from your guild, traveler's clothes, and 15 gp.",
			source: 'background:Guild Artisan',
			effects: [
				{
					target: 'inventory',
					action: 'add',
					value: [
						'Letter of introduction from your guild',
						"Traveler's clothes",
						'Belt pouch with 15 gp'
					]
				}
			]
		},
		{
			name: 'Guild Membership',
			id: 'guild_artisan_feature',
			description:
				'Your guild membership provides lodging, food, and funeral arrangements. Guildhalls offer meeting places for potential patrons and allies.',
			source: 'background:Guild Artisan',
			effects: [
				{
					target: 'features',
					action: 'add',
					value: 'Guild Membership'
				}
			]
		}
	]
};
