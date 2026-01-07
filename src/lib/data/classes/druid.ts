import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { getWeaponsByCategory } from '$lib/data/equipment/weapon-utils';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'druid_skills_01',
	description: {
		blocks: [
			{ type: 'text', text: 'Armor: Light armor, medium armor (non-metal), shields (non-metal)' },
			{ type: 'text', text: 'Weapons: Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, slings, spears' },
			{ type: 'text', text: 'Saving Throws: Intelligence, Wisdom' },
			{ type: 'text', text: 'Skills: Choose two from Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival' },
		]
	},
	featureOptions: {
		placeholderText: 'Select two skills',
		options: [
			'Arcana',
			'Animal Handling',
			'Insight',
			'Medicine',
			'Nature',
			'Perception',
			'Religion',
			'Survival'
		],
		numPicks: 2
	},
	source: 'druid.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	id: 'druid_spellcasting_01',
	description: {
		blocks: [
			{ 
				type: 'text', text: 'You can prepare and cast spells using Wisdom as your spellcasting ability.' 
			},
			{
				type: 'computed-replacement',

				whenAvailable: [
					{
						source: 'derived',
						formula: 'Math.max(1, WIS_MOD + LEVEL)'
					}
				],

				fallbackText:
					'You know 2 cantrips and prepare a number of spells equal to your Wisdom modifier + 3 (minimum of 1).',

				replacementTemplate:
					'You know 2 cantrips and prepare {value} spells.',

				singularTemplate:
					'You know 2 cantrips and prepare 1 spell.',
			}
		]
	},
	source: 'druid',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Spellcasting'
		}
	]
};

const wildShapePrompt: FeaturePrompt = {
	name: 'Wild Shape',
	id: 'druid_wild_shape_01',
	description: {
		blocks: [
			{ type: 'text', text: 'You can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice, and you regain expended uses when you finish a short or long rest.' },
			{ type: 'text', text: '• You can\'t transform into a beast that has a flying or swimming speed.' },
			{ type: 'text', text: '• You can stay in a beast shape for up to 1 hour. You can revert to your normal form earlier by using a bonus action.' },
			{ type: 'text', text: '• Your game statistics are replaced by the statistics of the beast, but you retain your alignment, personality, and Intelligence, Wisdom, and Charisma scores. When you transform, you assume the beast\'s hit points. When you revert to your normal form, you return to the number of hit points you had before you transformed. However, if you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form.' },
			{ type: 'text', text: '• You can\'t cast spells, and your ability to speak or take any action that requires hands is limited to the capabilities of your beast form.' },
		]
	},
	source: 'druid',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Wild Shape'
		}
	]
};

const druidCirclePrompt: FeaturePrompt = {
	name: 'Druid Circle',
	id: 'druid_circle_01',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a Druid Circle.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose a Circle-',
		options: [
			{
				name: 'Circle of the Land (Arctic)',
				optionDescription:
					'Your magic draws on the energy of frigid lands, granting you spells of ice and survival.',
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_arctic_cantrip_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn one additional druid cantrip.' },
							]
						},
						source: 'druid.circle_of_the_land_arctic',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Circle Spells',
						id: 'druid_arctic_spells_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain Arctic-specific spells that are always prepared and do not count against your prepared spells limit.' },
							]
						},
						source: 'druid.circle_of_the_land_arctic',
						effects: [{ target: 'features', action: 'add', value: 'Circle Spells' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_arctic_recovery_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You can regain some expended spell slots during a short rest. You can recover spell slots with a combined level equal to or less than 2. You can\'t use this feature again until you finish a long rest.' },
							]
						},
						source: 'druid.circle_of_the_land_arctic',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Land (Coast)',
				optionDescription:
					'Your magic draws on the energy of coastal regions, granting you spells of water and wind.',
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_coast_cantrip_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn one additional druid cantrip.' },
							]
						},
						source: 'druid.circle_of_the_land_coast',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Circle Spells',
						id: 'druid_coast_spells_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain Coast-specific spells that are always prepared and do not count against your prepared spells limit.' },
							]
						},
						source: 'druid.circle_of_the_land_coast',
						effects: [{ target: 'features', action: 'add', value: 'Circle Spells' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_coast_recovery_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You can regain some expended spell slots during a short rest. You can recover spell slots with a combined level equal to or less than 2. You can\'t use this feature again until you finish a long rest.' },
							]
						},
						source: 'druid.circle_of_the_land_coast',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Land (Desert)',
				optionDescription:
					'Your magic draws on the energy of arid wastelands, granting you spells of heat and endurance.',
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_desert_cantrip_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn one additional druid cantrip.' },
							]
						},
						source: 'druid.circle_of_the_land_desert',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Circle Spells',
						id: 'druid_desert_spells_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain Desert-specific spells that are always prepared and do not count against your prepared spells limit.' },
							]
						},
						source: 'druid.circle_of_the_land_desert',
						effects: [{ target: 'features', action: 'add', value: 'Circle Spells' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_desert_recovery_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You can regain some expended spell slots during a short rest. You can recover spell slots with a combined level equal to or less than 2. You can\'t use this feature again until you finish a long rest.' },
							]
						},
						source: 'druid.circle_of_the_land_desert',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Land (Forest)',
				optionDescription:
					'Your magic draws on the energy of woodlands, granting you spells of growth and protection.',
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_forest_cantrip_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn one additional druid cantrip.' },
							]
						},
						source: 'druid.circle_of_the_land_forest',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Circle Spells',
						id: 'druid_forest_spells_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain Forest-specific spells that are always prepared and do not count against your prepared spells limit.' },
							]
						},
						source: 'druid.circle_of_the_land_forest',
						effects: [{ target: 'features', action: 'add', value: 'Circle Spells' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_forest_recovery_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You can regain some expended spell slots during a short rest. You can recover spell slots with a combined level equal to or less than 2. You can\'t use this feature again until you finish a long rest.' },
							]
						},
						source: 'druid.circle_of_the_land_forest',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Land (Grassland)',
				optionDescription:
					'Your magic draws on the energy of plains and meadows, granting you spells of movement and divination.',
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_grassland_cantrip_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn one additional druid cantrip.' },
							]
						},
						source: 'druid.circle_of_the_land_grassland',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Circle Spells',
						id: 'druid_grassland_spells_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain Grassland-specific spells that are always prepared and do not count against your prepared spells limit.' },
							]
						},
						source: 'druid.circle_of_the_land_grassland',
						effects: [{ target: 'features', action: 'add', value: 'Circle Spells' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_grassland_recovery_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You can regain some expended spell slots during a short rest. You can recover spell slots with a combined level equal to or less than 2. You can\'t use this feature again until you finish a long rest.' },
							]
						},
						source: 'druid.circle_of_the_land_grassland',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Land (Mountain)',
				optionDescription:
					'Your magic draws on the energy of peaks and stone, granting you spells of earth and sky.',
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_mountain_cantrip_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn one additional druid cantrip.' },
							]
						},
						source: 'druid.circle_of_the_land_mountain',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Circle Spells',
						id: 'druid_mountain_spells_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain Mountain-specific spells that are always prepared and do not count against your prepared spells limit.' },
							]
						},
						source: 'druid.circle_of_the_land_mountain',
						effects: [{ target: 'features', action: 'add', value: 'Circle Spells' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_mountain_recovery_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You can regain some expended spell slots during a short rest. You can recover spell slots with a combined level equal to or less than 2. You can\'t use this feature again until you finish a long rest.' },
							]
						},
						source: 'druid.circle_of_the_land_mountain',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Land (Swamp)',
				optionDescription:
					'Your magic draws on the energy of wetlands, granting you spells of decay and transformation.',
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_swamp_cantrip_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn one additional druid cantrip.' },
							]
						},
						source: 'druid.circle_of_the_land_swamp',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Circle Spells',
						id: 'druid_swamp_spells_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain Swamp-specific spells that are always prepared and do not count against your prepared spells limit.' },
							]
						},
						source: 'druid.circle_of_the_land_swamp',
						effects: [{ target: 'features', action: 'add', value: 'Circle Spells' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_swamp_recovery_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You can regain some expended spell slots during a short rest. You can recover spell slots with a combined level equal to or less than 2. You can\'t use this feature again until you finish a long rest.' },
							]
						},
						source: 'druid.circle_of_the_land_swamp',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Land (Underdark)',
				optionDescription:
					'Your magic draws on the energy of deep caverns, granting you spells of shadow and stone.',
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_underdark_cantrip_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn one additional druid cantrip.' },
							]
						},
						source: 'druid.circle_of_the_land_underdark',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Circle Spells',
						id: 'druid_underdark_spells_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain Underdark-specific spells that are always prepared and do not count against your prepared spells limit.' },
							]
						},
						source: 'druid.circle_of_the_land_underdark',
						effects: [{ target: 'features', action: 'add', value: 'Circle Spells' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_underdark_recovery_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You can regain some expended spell slots during a short rest. You can recover spell slots with a combined level equal to or less than 2. You can\'t use this feature again until you finish a long rest.' },
							]
						},
						source: 'druid.circle_of_the_land_underdark',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Moon',
				optionDescription: `You are a fierce shapeshifter, able to transform into more powerful beasts.`,
				nestedPrompts: [
					{
						name: 'Combat Wild Shape',
						id: 'druid_moon_combat_shape_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain the ability to use Wild Shape as a bonus action, rather than as an action. Additionally, while you are transformed by Wild Shape, you can use a bonus action to expend one spell slot to regain 1d8 hit points per level of the spell slot expended.' },
							]
						},
						source: 'druid.circle_of_the_moon',
						effects: [{ target: 'features', action: 'add', value: 'Combat Wild Shape' }]
					},
					{
						name: 'Circle Forms',
						id: 'druid_moon_circle_forms_01',
						description: {
							blocks: [
								{ type: 'text', text: 'The rites of your circle grant you the ability to transform into more dangerous animal forms. You can use your Wild Shape to transform into a beast with a challenge rating as high as 1.' },
							]
						},
						source: 'druid.circle_of_the_moon',
						effects: [{ target: 'features', action: 'add', value: 'Circle Forms' }]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'druid',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [spellcastingPrompt, wildShapePrompt];

export const druid: ClassData = {
	name: 'Druid',
	image: base + '/class_icons/druid.jpg',
	description: 'Masters of nature magic and shapeshifting, drawing power from the natural world.',
	hitDie: 'd8',
	primaryAbility: 'Wisdom',
	saves: ['Intelligence', 'Wisdom'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: [
		'Clubs',
		'Daggers',
		'Darts',
		'Javelins',
		'Maces',
		'Quarterstaffs',
		'Scimitars',
		'Slings',
		'Spears'
	],
	startingEquipment: {
		fixed: [
			'Leather armor',
			"Explorer's pack (includes: backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hempen rope)"
		],
		choices: [
			{
				name: 'Primary Equipment',
				description: 'Choose your primary equipment',
				options: [
					{
						label: 'Wooden shield',
						items: ['Wooden shield']
					},
					{
						label: 'Simple weapon',
						items: [],
						subChoices: [
							{
								name: 'Simple Weapon',
								description: 'Choose a simple weapon',
								type: 'weapon-list',
								category: 'simple',
								options: getWeaponsByCategory('simple-all'),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Melee Weapon',
				description: 'Choose your melee weapon',
				options: [
					{
						label: 'Scimitar',
						items: ['Scimitar']
					},
					{
						label: 'Simple melee weapon',
						items: [],
						subChoices: [
							{
								name: 'Simple Melee Weapon',
								description: 'Choose a simple melee weapon',
								type: 'weapon-list',
								category: 'simple-melee',
								options: getWeaponsByCategory('simple-melee'),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice
		]
	},
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, druidCirclePrompt]
};