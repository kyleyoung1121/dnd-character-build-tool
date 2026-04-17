import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';

// Ability Score Choice Prompt
const abilityScoreChoicePrompt: FeaturePrompt = {
	name: 'Ability Score Increase',
	id: 'variant_human_ability_score',
	description: {
		blocks: [
			{ type: 'text', text: 'Two different ability scores of your choice increase by 1 each.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose 2 Ability Scores-',
		options: ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'],
		numPicks: 2
	},
	source: 'variant_human',
	effects: [
		{
			target: '{userChoice.toLowerCase()}',
			action: 'modify',
			value: 1
		}
	]
};

// Skill Versatility Prompt
const skillVersatilityPrompt: FeaturePrompt = {
	name: 'Skill Versatility',
	id: 'variant_human_skill_versatility',
	description: {
		blocks: [
			{ type: 'text', text: 'You gain proficiency in one skill of your choice.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose 1 Skill-',
		options: [
			'Acrobatics',
			'Animal Handling',
			'Arcana',
			'Athletics',
			'Deception',
			'History',
			'Insight',
			'Intimidation',
			'Investigation',
			'Medicine',
			'Nature',
			'Perception',
			'Performance',
			'Persuasion',
			'Religion',
			'Sleight of Hand',
			'Stealth',
			'Survival'
		],
		numPicks: 1
	},
	source: 'variant_human',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

// Feat Prompt
const featPrompt: FeaturePrompt = {
	name: 'Feat',
	id: 'variant_human_feat',
	description: {
		blocks: [
			{ type: 'text', text: 'You gain one feat of your choice.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose 1 Feat-',
		options: [
			// Actor
			{
				name: 'Actor',
				optionDescription: 'You are skilled at mimicry and dramatics.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_actor',
						name: 'Actor',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Charisma score by 1' },
										{ type: 'text', text: '• Gain advantage on Deception & Performance checks while trying to pass yourself off as another person.' },
										{ type: 'text', text: '• You can mimic the speech/sounds made by a person/creature. A listener can see through your mimicry with an Insight roll against your Deception roll.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Actor'
							},
							{
								target: 'charisma',
								action: 'modify',
								value: 1
							}
						]
					}
				]
			},

			// Alert
			{
				name: 'Alert',
				optionDescription: 'You are always on the lookout for danger.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_alert',
						name: 'Alert',
						description: {
							blocks: [
										{ type: 'text', text: '• +5 to Initiative rolls' },
										{ type: 'text', text: '• You can\'t be surprised.' },
										{ type: 'text', text: '• Enemies cannot gain advantage on attacks against you by being unseen.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Alert'
							},
						]
					}
				]
			},

			// Athlete
			{
				name: 'Athlete',
				optionDescription: 'You have undergone extensive physical training',
				nestedPrompts: [
					{
						id: 'variant_human_feat_athlete',
						name: 'Athlete',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Strength or Dexterity score by 1' },
										{ type: 'text', text: '• Standing up from prone only costs you 5ft. of movement.' },
										{ type: 'text', text: '• Climbing doesn\'t cost extra movement.' },
										{ type: 'text', text: '• You only need to move 5ft. to perform a running long/high jump.' },
									]
						},
						featureOptions: {
							placeholderText: 'Increase Strength or Dexterity',
							options: ['Strength', 'Dexterity'],
							numPicks: 1,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Athlete'
							},
							{
								target: '{userChoice.toLowerCase()}',
								action: 'modify',
								value: 1,
							}
						]
					}
				]
			},

			// Charger
			{
				name: 'Charger',
				optionDescription: 'You are skilled in running down opponents.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_charger',
						name: 'Charger',
						description: {
							blocks: [
										{ type: 'text', text: 'When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature.' },
										{ type: 'text', text: 'If you move at least 10ft. in a straight line before taking this bonus action, your attack/shove gains one of the benefits below:' },
										{ type: 'text', text: '• If you make a melee weapon attack and hit: Gain a +5 bonus to the attack\'s damage roll.' },
										{ type: 'text', text: '• If you chose to shove and succeed: Push the target up to 10ft. away from you.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Charger'
							},
						]
					}
				]
			},

			// Crossbow Expert
			{
				name: 'Crossbow Expert',
				optionDescription: 'You have extensive practice with the crossbow',
				nestedPrompts: [
					{
						id: 'variant_human_feat_crossbow_expert',
						name: 'Crossbow Expert',
						description: {
							blocks: [
										{ type: 'text', text: '• Being within 5ft. of a hostile creature doesn\'t give you disadvantage on your ranged attack rolls.' },
										{ type: 'text', text: '• When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Crossbow Expert'
							},
						]
					}
				]
			},

			// Defensive Duelist
			{
				name: 'Defensive Duelist',
				optionDescription: 'You\'ve leared to deflect blows in the heat of the battle',
				nestedPrompts: [
					{
						id: 'variant_human_feat_defensive_duelist',
						name: 'Defensive Duelist',
						description: {
							blocks: [
										{ type: 'text', text: 'While wielding a finesse weapon, when another creature hits you with a melee attack, you can use your reaction to add +2 to your AC, potentially causing the attack to miss.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Defensive Duelist'
							},
						]
					}
				]
			},

			// Dual Wielder
			{
				name: 'Dual Wielder',
				optionDescription: 'You\'ve mastered fighting with two weapons',
				nestedPrompts: [
					{
						id: 'variant_human_feat_dual_wielder',
						name: 'Dual Wielder',
						description: {
							blocks: [
										{ type: 'text', text: '• Gain a +1 bonus to your AC while dual wielding melee weapons.' },
										{ type: 'text', text: '• You can use two weapon fighting even when the one-handed weapons you are wielding aren\'t light' },
										{ type: 'text', text: '• You can draw or stow two weapons when you would normally be able to draw or stow only one.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Dual Wielder'
							},
						]
					}
				]
			},

			// Dungeon Delver
			{
				name: 'Dungeon Delver',
				optionDescription: 'You are alert to the hidden traps and secret doors found in many dungeons.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_dungeon_delver',
						name: 'Dungeon Delver',
						description: {
							blocks: [
										{ type: 'text', text: '• You have advantage on Perception/Investigation checks made to find secret doors.' },
										{ type: 'text', text: '• You have advantage on saving throws made to avoid or resist traps.' },
										{ type: 'text', text: '• You have resistance to the damage dealt by traps.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Dungeon Delver'
							},
						]
					}
				]
			},

			// Durable
			{
				name: 'Durable',
				optionDescription: 'You are hardy and resilient.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_durable',
						name: 'Durable',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Constitution score by 1.' },
										{ type: 'text', text: '• ' },
										{
											type: 'computed-inline',
											text: '• When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals twice your CON modifier.',
											hints: [
												{
													afterText: 'CON modifier',
													computed: { source: 'abilityMod', ability: 'CON' },
													hintFormat: '({value})'
												}
											]
										},
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Durable'
							},
							{
								target: 'constitution',
								action: 'modify',
								value: 1
							}
						]
					}
				]
			},

			// Elemental Adept
			{
				name: 'Elemental Adept',
				optionDescription: 'You are skilled in running down opponents.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_elemental_adept_element_selection',
						name: 'Elemental Adept (Element Selection)',
						description: {
							blocks: [
										{ type: 'text', text: 'Choose one of the following damage types: acid, cold, fire, lightning, or thunder.' },
									]
						},
						featureOptions: {
							placeholderText: 'Choose an elemental damage type',
							options: ['Acid', 'Cold', 'Fire', 'Lightning', 'Thunder'],
							numPicks: 1,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'elementalAdeptElement',
								action: 'add',
								value: '{userChoice}'
							},
						]
					},
					{
						id: 'variant_human_feat_elemental_adept_benefits',
						name: 'Elemental Adept',
						description: {
							blocks: [
										{ type: 'text', text: 'Spells you cast ignore resistance to that type. In addition, when your spells deal damage of that type, you may treat any 1 on a damage dice as a 2.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Elemental Adept'
							},
						]
					},
				]
			},

			// Grappler
			{
				name: 'Grappler',
				optionDescription: 'You can hold your own in close-quarters grappling.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_grappler',
						name: 'Grappler',
						description: {
							blocks: [
										{ type: 'text', text: '• You have advantage on attack rolls against a creature you are grappling.' },
										{ type: 'text', text: '• You can use your action to try to pin a creature grapple by you. Make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Grappler'
							},
						]
					}
				]
			},

			// Great Weapon Master
			{
				name: 'Great Weapon Master',
				optionDescription: 'You can hold your own in close-quarters grappling.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_great_weapon_master',
						name: 'Great Weapon Master',
						description: {
							blocks: [
										{ type: 'text', text: '• When you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.' },
										{ type: 'text', text: '• Before making an attack with a heavy weapon, you can choose to take a -5 penalty to hit. If this attack hits, you may add +10 to its damage.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Great Weapon Master'
							},
						]
					}
				]
			},

			// Healer
			{
				name: 'Healer',
				optionDescription: 'You are an able physician, allowing you to mend wounds quickly.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_healer',
						name: 'Healer',
						description: {
							blocks: [
										{ type: 'text', text: '• When you use a healer\'s kit to stabilize a dying creature, that creature also regains 1 hit point.' },
										{ type: 'text', text: '• As an action, you can spend one use of the healer\'s kit to restore 1d6 + 7 hitpoints to it.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Healer'
							},
						]
					}
				]
			},

			// Heavily Armored
			{
				name: 'Heavily Armored',
				optionDescription: 'You have trained to master the use of heavy armor.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_heavily_armored',
						name: 'Heavily Armored',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Strength score by 1.' },
										{ type: 'text', text: '• You gain proficiency with heavy armor.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Heavily Armored'
							},
							{
								target: 'strength',
								action: 'modify',
								value: 1
							}
						]
					}
				]
			},

			// Heavy Armor Master
			{
				name: 'Heavy Armor Master',
				optionDescription: 'You can use your armor to deflect strikes that would kill others.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_heavy_armor_master',
						name: 'Heavy Armor Master',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Strength score by 1.' },
										{ type: 'text', text: '• If you are already proficient in heavy armor, any non-magical physical damage is reduced by 3 while wearing heavy armor.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Heavy Armor Master'
							},
							{
								target: 'strength',
								action: 'modify',
								value: 1
							}
						]
					}
				]
			},

			// Inspiring Leader
			{
				name: 'Inspiring Leader',
				optionDescription: 'You know how to bolster the confidence of your allies.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_inspiring_leader',
						name: 'Inspiring Leader',
						description: {
							blocks: [
										{ type: 'text', text: 'You can spend 10 minutes inspiring your companions. You and your allies gain temporary hit points equal to 3 + your Charisma modifier.' },
										{ type: 'text', text: 'Affected creatures cannot gain temporary hit points this way again until a short or long rest.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Inspiring Leader'
							},
						]
					}
				]
			},

			// Keen Mind
			{
				name: 'Keen Mind',
				optionDescription: 'You have a mind that can track time, direction, and detail with uncanny precision.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_keen_mind',
						name: 'Keen Mind',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Intelligence score by 1.' },
										{ type: 'text', text: '• You always know which way is north.' },
										{ type: 'text', text: '• You always know the number of hours left until the next sunrise or sunset.' },
										{ type: 'text', text: '• You can accurately recall anything you have seen or heard within the past month.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Keen Mind'
							},
							{
								target: 'intelligence',
								action: 'modify',
								value: 1
							}
						]
					}
				]
			},

			// Lightly Armored
			{
				name: 'Lightly Armored',
				optionDescription: 'You have trained to master the use of light armor.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_lightly_armored',
						name: 'Lightly Armored',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Strength or Dexterity score by 1.' },
										{ type: 'text', text: '• You gain proficiency with light armor.' },
									]
						},
						featureOptions: {
							placeholderText: 'Increase Strength or Dexterity',
							options: ['Strength', 'Dexterity'],
							numPicks: 1,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Lightly Armored'
							},
							{
								target: '{userChoice.toLowerCase()}',
								action: 'modify',
								value: 1,
							}
						]
					}
				]
			},

			// Linguist
			{
				name: 'Linguist',
				optionDescription: 'You have studied languages and codes.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_linguist',
						name: 'Linguist',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Intelligence score by 1.' },
										{ type: 'text', text: '• You learn three languages of your choice.' },
										{ type: 'text', text: '• You can ably create written ciphers. Other\'s can decode your cipher if you teach them how, or if they succeed on an Intelligence check (DC equal to your Intelligence score + 2)' },
									]
						},
						featureOptions: {
							placeholderText: 'Select three languages',
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
							numPicks: 3,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Linguist'
							},
							{
								target: 'intelligence',
								action: 'modify',
								value: 1
							},
							{
								target: 'languages',
								action: 'add',
								value: '{userChoice}',
							}
						]
					}
				]
			},

			// Lucky
			{
				name: 'Lucky',
				optionDescription: 'You have inexplicable luck that seems to kick in at just the right moment.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_lucky',
						name: 'Lucky',
						description: {
							blocks: [
										{ type: 'text', text: 'You have 3 luck points. You can spend one of your luck points to reroll a d20 test. You can use either result.' },
										{ type: 'text', text: 'You can also spend one luck point to cause an attacker to reroll an attack against you. You can have them use either result.' },
										{ type: 'text', text: 'You regain all luck points when you finish a long rest.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Lucky'
							},
						]
					}
				]
			},

			// Mage Slayer
			{
				name: 'Mage Slayer',
				optionDescription: 'You have practiced techniques useful in melee combat against spellcasters.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_mage_slayer',
						name: 'Mage Slayer',
						description: {
							blocks: [
										{ type: 'text', text: '• When a creature within 5ft. of you casts a spell, you can use your reaction to make a melee weapon attack against that creature.' },
										{ type: 'text', text: '• When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration.' },
										{ type: 'text', text: '• You have advantage on saving throws against spells cast by creatures within 5ft. of you.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Mage Slayer'
							},
						]
					}
				]
			},

			// // placeholder
			// {
			// 	name: 'Keen',
			// 	optionDescription: 'DESC.',
			// 	nestedPrompts: [
			// 		{
			// 			id: 'variant_human_feat_keen_mind',
			// 			name: 'Keen',
			// 			description: {
			// 				blocks: [
			// 							{ type: 'text', text: '• ' },
			// 							{ type: 'text', text: '• ' },
			// 						]
			// 			},
			// 			source: 'variant_human.feats',
			// 			effects: [
			// 				{
			// 					target: 'features',
			// 					action: 'add',
			// 					value: 'Keen'
			// 				},
			// 			]
			// 		}
			// 	]
			// },
		],
		numPicks: 1
	},
	source: 'variant_human',
	effects: [
		{
			target: 'feats',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

export const variantHuman: SpeciesData = {
	name: 'Variant Human',
	image: base + '/species_icons/variant_human.jpg',
	description: `
		Variant humans are highly adaptable, gaining two ability score increases of your choice and proficiency in one skill.
	`,
	abilityScoreIncrease: '+1 to two ability scores of your choice',
	speed: '30 ft.',
	size: 'Medium',
	knownLanguages: ['Common', 'One extra language of your choice'],
	speciesFeatures: [
		abilityScoreChoicePrompt, 
		skillVersatilityPrompt, 
		{
			name: 'Languages',
			id: 'variant_human_extra_language',
			description: {
				blocks: [
					{ type: 'text', text: 'You can speak, read, and write command & one extra language of your choice.' },
				]
			},
			source: 'variant_human',
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
				},
				{ target: 'languages', action: 'add', value: 'Common'},
			]
		},
		featPrompt,
	]
};