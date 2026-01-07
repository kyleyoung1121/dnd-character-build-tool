import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { martialMeleeWeapons, simpleWeapons } from '../equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'barbarian_skills_01',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'Armor: Light armor, medium armor, shields'
			},
			{
				type: 'text',
				text: 'Weapons: Simple weapons, martial weapons'
			},
			{
				type: 'text',
				text: 'Saving Throws: Strength, Constitution'
			},
			{
				type: 'text',
				text:
					'Skills: Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival'
			}
		]
	},
	featureOptions: {
		placeholderText: 'Select 2 skills',
		options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
		numPicks: 2
	},
	source: 'barbarian.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const primalPathPrompt: FeaturePrompt = {
	name: 'Primal Path',
	id: 'barbarian_primal_path',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'Choose a path that shapes the nature of your rage.'
			}
		]
	},
	featureOptions: {
		placeholderText: '-Choose an Option-',
		options: [
			{
				name: 'Berserker',
				optionDescription:
					'For some barbarians, rage is a means to an end — that end being violence. The Path of the Berserker is a path of untrammeled fury, slick with blood. As you enter the berserker’s rage, you thrill in the chaos of battle, heedless of your own health or well-being.',
				nestedPrompts: [
					{
						name: 'Frenzy',
						id: 'barbarian_berserker_frenzy',
						description: {
							blocks: [
								{
									type: 'text',
									text: "When you rage, you can enter a frenzy. For the rest of your rage, you can use a bonus action to make a melee weapon attack. When your rage ends, you suffer one level of exhaustion."
								}
							]
						},
						source: 'barbarian.berserker',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Frenzy'
							}
						]
					}
				]
			},
			{
				name: 'Totem Warrior',
				optionDescription:
					'The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration. In battle, your totem spirit fills you with supernatural might, adding magical fuel to your barbarian rage.',
				nestedPrompts: [
					{
						name: 'Spirit Seeker',
						id: 'barbarian_totem_spirit_seeker',
						description: {
							blocks: [
								{
									type: 'text',
									text: "Your path attunes you to the natural world. You can cast <i>beast sense</i> and <i>speak with animals</i>, but only as rituals (add 10 minutes)."
								}
							]
						},
						source: 'barbarian.totem_warrior',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Spirit Seeker'
							}
						]
					},
					{
						name: 'Totem Spirit',
						id: 'barbarian_totem_totem_spirit',
						description: {
							blocks: [
								{
									type: 'text',
									text: 'When you adopt this path, you choose a totem spirit and gain its feature. You must make or acquire a physical totem object - an amulet or similar adornment - that incorporates fur or feathers, claws, teeth, or bones of the totem animal.'
								}
							]
						},
						source: 'barbarian.totem_warrior',
						featureOptions: {
							placeholderText: 'Choose your totem spirit...',
							options: [
								{
									name: 'Bear',
									optionDescription:
										'While raging, you have resistance to all damage except psychic damage. The spirit of the bear makes you tough enough to stand up to any punishment.',
									nestedPrompts: [
										{
											name: 'Bear Totem Warrior',
											id: 'barbarian_bear_totem_warrior',
											description: {
												blocks: [
													{
														type: 'text',
														text: 'The bear spirit grants you incredible resilience. While raging, you have resistance to all damage except psychic damage.'
													}
												]
											},
											source: 'barbarian.totem_warrior.bear',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Bear Totem Spirit'
												}
											]
										}
									]
								},
								{
									name: 'Eagle',
									optionDescription:
										"While you're raging and aren't wearing heavy armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash action as a bonus action on your turn. The spirit of the eagle makes you into a predator who can weave through the fray with ease.",
									nestedPrompts: [
										{
											name: 'Eagle Totem Warrior',
											id: 'barbarian_eagle_totem_warrior',
											description: {
												blocks: [
													{
														type: 'text',
														text: 'The eagle spirit grants you incredible mobility. While raging and not wearing heavy armor, other creatures have disadvantage on opportunity attacks against you, and you can use the Dash action as a bonus action.'
													}
												]
											},
											source: 'barbarian.totem_warrior.eagle',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Eagle Totem Spirit'
												}
											]
										}
									]
								},
								{
									name: 'Wolf',
									optionDescription:
										"While you're raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you. The spirit of the wolf makes you a leader of hunters.",
									nestedPrompts: [
										{
											name: 'Wolf Totem Warrior',
											id: 'barbarian_wolf_totem_warrior',
											description: {
												blocks: [
													{
														type: 'text',
														text: 'The wolf spirit grants you leadership in battle. While raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you.'
													}
												]
											},
											source: 'barbarian.totem_warrior.wolf',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Wolf Totem Spirit'
												}
											]
										}
									]
								}
							],
							numPicks: 1
						},
						effects: []
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'barbarian',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	{
		name: 'Rage',
		id: 'barbarian_rage',
		description: {
			blocks: [
				{
					type: 'text',
					text:
						'On your turn, you can rage as a bonus action. Rage lasts 1 minute and ends early if you fall unconscious or if your turn ends and you haven’t attacked or taken damage since your last turn.'
				},
				{
					type: 'text',
					text: 'While raging, you gain:'
				},
				{
					type: 'text',
					text: '• Advantage on Strength checks and Strength saving throws'
				},
				{
					type: 'text',
					text: '• +2 bonus damage with Strength-based melee attacks'
				},
				{
					type: 'text',
					text: '• Resistance to bludgeoning, piercing, and slashing damage'
				},
				{
					type: 'text',
					text: 'You can’t cast or concentrate on spells while raging.'
				},
				{
					type: 'text',
					text: 'You can rage up to 3 times per long rest.'
				}
			]
		},
		source: 'barbarian',
		effects: [
			{
				target: 'features',
				action: 'add',
				value: 'Rage'
			}
		]
	},
	{
		name: 'Unarmored Defense',
		id: 'barbarian_unarmored_defense',
		description: {
			blocks: [
				{
					type: 'text',
					text: 'While not wearing armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier.'
				}
			]
		},
		source: 'barbarian',
		effects: [
			{
				target: 'features',
				action: 'add',
				value: 'Unarmored Defense'
			}
		]
	},
	{
		name: 'Reckless Attack',
		id: 'barbarian_reckless_attack',
		description: {
			blocks: [
				{
					type: 'text',
					text:
						'When you make your first attack on your turn, you can decide to attack recklessly.'
				},
				{
					type: 'text',
					text:
						'Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.'
				}
			]
		},
		source: 'barbarian',
		effects: [
			{
				target: 'features',
				action: 'add',
				value: 'Reckless Attack'
			}
		]
	},
	{
		name: 'Danger Sense',
		id: 'barbarian_danger_sense',
		description: {
			blocks: [
				{
					type: 'text',
					text:
						'You have an uncanny sense of when things nearby aren’t as they should be, helping you to dodge away from danger.'
				},
				{
					type: 'text',
					text:
						'You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells.'
				},
				{
					type: 'text',
					text:
						'To gain this benefit, you can’t be blinded, deafened, or incapacitated.'
				}
			]
		},
		source: 'barbarian',
		effects: [
			{
				target: 'features',
				action: 'add',
				value: 'Danger Sense'
			}
		]
	}
];


export const barbarian: ClassData = {
	name: 'Barbarian',
	image: base + '/class_icons/barbarian.jpg',
	description: 'Frenzied warriors fueled by primal rage.',
	hitDie: 'd12',
	primaryAbility: 'Strength',
	saves: ['Strength', 'Constitution'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
	startingEquipment: {
		fixed: [
			"Explorer's pack (includes: backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hempen rope)",
			'4 javelins'
		],
		choices: [
			{
				name: 'Primary Weapon',
				description: 'Choose your main melee weapon',
				options: [
					{
						label: 'Greataxe (recommended)',
						items: ['Greataxe']
					},
					{
						label: 'Other martial weapon',
						subChoices: [
							{
								name: 'Martial Melee Weapon',
								description: 'Choose a martial melee weapon',
								type: 'weapon-list',
								category: 'martial-melee',
								options: martialMeleeWeapons.filter((w) => w !== 'Greataxe'),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Secondary Weapons',
				description: 'Choose your secondary weapon option',
				options: [
					{
						label: '2 handaxes',
						items: ['Handaxe', 'Handaxe']
					},
					{
						label: 'Simple melee weapon',
						subChoices: [
							{
								name: 'Simple Melee Weapon',
								description: 'Choose a simple melee weapon',
								type: 'weapon-list',
								category: 'simple-melee',
								options: simpleWeapons.filter(
									(w) => !['Light crossbow', 'Shortbow', 'Sling'].includes(w)
								),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice
		]
	},
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, primalPathPrompt]
};
