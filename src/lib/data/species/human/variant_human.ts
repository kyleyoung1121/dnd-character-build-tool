import { base } from '$app/paths';
import type { SpeciesData } from '$lib/data/types/SpeciesData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons, martialWeapons } from '$lib/data/equipment/weapons';

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
		options: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
		numPicks: 2
	},
	source: 'variant_human',
	effects: [
		{
			target: '{userChoice}',
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
										{ type: 'text', text: '• Hidden enemies do not gain advantage on attacks against you.' },
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
								target: 'proficiencies',
								action: 'add',
								value: 'Heavy Armor'
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
										{
											type: 'computed-replacement',

											whenAvailable: [
												{
													source: 'derived',
													formula: 'Math.max(3, CHA_MOD + 3)'
												}
											],

											fallbackText:
												'You can spend 10 minutes inspiring your companions. You and your allies gain temporary hit points equal to 3 + your Charisma modifier.',

											replacementTemplate:
												'You can spend 10 minutes inspiring your companions. You and your allies gain {value} temporary hit points.',

											singularTemplate:
												'You can spend 10 minutes inspiring your companions. You and your allies gain 1 temporary hit point.',
										},
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
								target: 'proficiencies',
								action: 'add',
								value: 'Light Armor'
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

			// Magic Initiate
			{
				name: 'Magic Initiate',
				optionDescription: 'You learn two cantrips and one 1st level spell from another class.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_magic_initiate',
						name: 'Magic Initiate',
						description: {
							blocks: [
										{ type: 'text', text: 'Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class\'s spell list.' },
										{ type: 'text', text: 'In addition, choose one 1st level spell to learn from the same list. Using this feat, you can cast the spell once at its lowest level, and you must finish a long rest before you can cast it this way again.' },
									]
						},
						featureOptions: {
							placeholderText: 'Select a spellcasting class',
							options: [
								'Bard',
								'Cleric',
								'Druid',
								'Sorcerer',
								'Warlock',
								'Wizard',
							],
							numPicks: 1,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Magic Initiate {userChoice} (Cantrips)'
							},
							{
								target: 'features',
								action: 'add',
								value: 'Magic Initiate {userChoice} (Once per LR spell)'
							},
						]
					}
				]
			},

			// Martial Adept
			{
				name: 'Martial Adept',
				optionDescription: 'Your training allows you to perform special combat maneuvers.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_martial_adept',
						name: 'Martial Adept',
						description: {
							blocks: [
										{ type: 'text', text: '• You learn two battle maneuvers of your choice. If a maneuver requires a saving throw, the DC is equal to 10 + your Strength or Dexterity modifier.' },
										{ type: 'text', text: '• You gain one superiority die, which is a d6. You regain this die on a short or long rest.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Martial Adept'
							},
						]
					}
				]
			},

			// Medium Armor Master
			{
				name: 'Medium Armor Master',
				optionDescription: 'You have practiced moving in medium armor.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_medium_armor_master',
						name: 'Medium Armor Master',
						description: {
							blocks: [
										{ type: 'text', text: '• Wearing medium armor cannot impose disadvantage on Stealth checks.' },
										{ type: 'text', text: '• When you are wearing medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Medium Armor Master'
							},
						]
					}
				]
			},

			// Mobile
			{
				name: 'Mobile',
				optionDescription: 'You are exceptionally speedy and agile.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_mobile',
						name: 'Mobile',
						description: {
							blocks: [
										{ type: 'text', text: '• Your speed increases by 10ft.' },
										{ type: 'text', text: '• When you take the Dash action, difficult terrain doesn\'t cost you extra movement on that turn.' },
										{ type: 'text', text: '• When you attempt a melee attack against a creature, that creature cannot make opportunity attacks against you for the rest of the turn.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Mobile'
							},
						]
					}
				]
			},

			// Moderately Armored
			{
				name: 'Moderately Armored',
				optionDescription: 'You have trained to master the use of medium armor and shields.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_moderately_armored',
						name: 'Moderately Armored',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Strength or Dexterity score by 1.' },
										{ type: 'text', text: '• You gain proficiency with medium armor and shields.' },
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
								value: 'Moderately Armored'
							},
							{
								target: 'proficiencies',
								action: 'add',
								value: 'Medium Armor'
							},
							{
								target: 'proficiencies',
								action: 'add',
								value: 'Shields'
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

			// Mounted Combatant
			{
				name: 'Mounted Combatant',
				optionDescription: 'You are a dangerous foe to face while mounted.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_mounted combatant',
						name: 'Mounted Combatant',
						description: {
							blocks: [
										{ type: 'text', text: '• You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount.' },
										{ type: 'text', text: '• You can force any attacks targeting your mount to instead target you.' },
										{ type: 'text', text: '• If your mount is subjected to a Dexterity saving throw to only take half damage, it may instead take no damage on a success and only half damage on a fail.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Mounted Combatant'
							},
						]
					}
				]
			},
			
			// Observant
			{
				name: 'Observant',
				optionDescription: 'You are quick to notice details of your environment.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_observant',
						name: 'Observant',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Intelligence or Wisdom score by 1.' },
										{ type: 'text', text: '• You can read the lips of any creature speaking a language you can understand.' },
										{ type: 'text', text: '• You have a +5 bonus to your passive Perception and passive Investigation.' },
									]
						},
						featureOptions: {
							placeholderText: 'Increase Intelligence or Wisdom',
							options: ['Intelligence', 'Wisdom'],
							numPicks: 1,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Observant'
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

			// Polearm Master
			{
				name: 'Polearm Master',
				optionDescription: 'You are a master of weapons with great reach.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_polearm_master',
						name: 'Polearm Master',
						description: {
							blocks: [
										{ type: 'text', text: '• When you take the attack action with a Glaive, Halberd, Quarterstaff, or Spear, you can use a bonus action to make an attack with the opposite end of the weapon. Use the same modifiers, but with a d4 as the damage dice.' },
										{ type: 'text', text: '• While you are wielding a Glaive, Halberd, Quarterstaff, or Spear, other creatures provoke an opportunity attack from you when they enter the reach you have with that weapon.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Polearm Master'
							},
						]
					}
				]
			},

			// Resilient
			{
				name: 'Resilient',
				optionDescription: 'You are well attuned to a particular ability.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_resilient',
						name: 'Resilient',
						description: {
							blocks: [
										{ type: 'text', text: '• Choose one ability score. Increase that ability score by 1.' },
										{ type: 'text', text: '• You gain proficiency in saving throws using the choosen ability.' },
									]
						},
						featureOptions: {
							placeholderText: 'Choose one ability score.',
							options: ['Strength', 'Dexterity', 'Constituion', 'Intelligence', 'Wisdom', 'Charisma'],
							numPicks: 1,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Resilient'
							},
							{
								target: '{userChoice.toLowerCase()}',
								action: 'modify',
								value: 1,
							},
							{
								target: 'proficiencies',
								action: 'add',
								value: '{userChoice} Saving Throw',
							},
						]
					}
				]
			},

			// Ritual Caster
			{
				name: 'Ritual Caster',
				optionDescription: 'You have learned a number of spells that you can cast as a rituals.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_ritual_caster',
						name: 'Ritual Caster',
						description: {
							blocks: [
										{ type: 'text', text: 'You have learned a number of spells that you can cast as a rituals. These spells are written in a ritual book.' },
										{ type: 'text', text: 'When you choose the feat, you aquire a ritual book holding two 1st level spells. Choose one of the following classes: bard, cleric, druid, sorcerer, warlock, wizard. You must choose spells with the ritual tag.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Ritual Caster'
							},
						]
					}
				]
			},

			// Savage Attacker
			{
				name: 'Savage Attacker',
				optionDescription: 'Your strikes are particularly brutal.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_savage_attacker',
						name: 'Savage Attacker',
						description: {
							blocks: [
										{ type: 'text', text: 'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Savage Attacker'
							},
						]
					}
				]
			},

			// Sentinel
			{
				name: 'Sentinel',
				optionDescription: 'You have mastered techniques to take advantage of every drop in any enemy\'s guard.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_sentinel',
						name: 'Sentinel',
						description: {
							blocks: [
										{ type: 'text', text: '• When you hit a creature with an opportunity attack, the creature\'s speed becomes 0 for the rest of the turn.' },
										{ type: 'text', text: '• Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.' },
										{ type: 'text', text: '• When a creature within 5ft. of you makes an attack against a target other than you (and that target doesn\'t have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Sentinel'
							},
						]
					}
				]
			},

			// Sharpshooter
			{
				name: 'Sharpshooter',
				optionDescription: 'You have mastered ranged weapons and can make shots that others find impossible.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_sharpshooter',
						name: 'Sharpshooter',
						description: {
							blocks: [
										{ type: 'text', text: '• Attacking at long range doesn\'t impose disadvantage on your ranged weapon attack rolls.' },
										{ type: 'text', text: '• Your ranged weapon attacks ignore half cover and three-quarters cover.' },
										{ type: 'text', text: '• Before you make an attack with a ranged weapon, you can choose to take a -5 penalty to the attack roll. If your attack hits, you add +10 to the attack\'s damage.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Sharpshooter'
							},
						]
					}
				]
			},

			// Shield Master
			{
				name: 'Shield Master',
				optionDescription: 'You use shields not just for protection but also for offense.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_shield_master',
						name: 'Shield Master',
						description: {
							blocks: [
										{ type: 'text', text: 'While you use a shield, you gain the following benefits:' },
										{ type: 'text', text: '• If you take the Attack action on your turn, you can use a bonus action to try to shove a creature with your shield.' },
										{ type: 'text', text: '• You can add your shield\'s AC bonus (+2) to any Dexterity saving throw you make against a spell or other harmful effect that targets only you.' },
										{ type: 'text', text: '• If you are subjected to an effect that allows you to make a Dexterity to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interpose your shield between yourself and the source of the effect.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Shield Master'
							},
						]
					}
				]
			},

			// Skilled
			{
				name: 'Skilled',
				optionDescription: 'You have a variety of talents.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_skilled',
						name: 'Skilled',
						description: {
							blocks: [
										{ type: 'text', text: 'You gain proficiency in any 3 skills of your choice.' },
									]
						},
						featureOptions: {
							placeholderText: 'Select three skills',
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
							numPicks: 3,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Skilled'
							},
							{
								target: 'skills',
								action: 'add',
								value: '{userChoice}',
							}
						]
					}
				]
			},

			// Skulker
			{
				name: 'Skulker',
				optionDescription: 'You are an expert in slinking through shadows.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_skulker',
						name: 'Skulker',
						description: {
							blocks: [
										{ type: 'text', text: '• You can try to hide when you are lightly obscured.' },
										{ type: 'text', text: '• When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn\'t reveal your position.' },
										{ type: 'text', text: '• Dim light doesn\'t impose disadvantage on your Perception checks relying on sight.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Skulker'
							},
						]
					}
				]
			},

			// Spell Sniper
			{
				name: 'Spell Sniper',
				optionDescription: 'You have learned to enhance your spells for ranged combat.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_spell_sniper',
						name: 'Spell Sniper',
						description: {
							blocks: [
										{ type: 'text', text: '• When you make a ranged spell attack, the spell\'s range is doubled.' },
										{ type: 'text', text: '• Your ranged spell attacks ignore cover.' },
										{ type: 'text', text: '• You learn one cantrip that requires an attack roll.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Spell Sniper'
							},
						]
					}
				]
			},

			// Tavern Brawler
			{
				name: 'Tavern Brawler',
				optionDescription: 'You are accustomed to rough-and-tumble fighting.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_tavern_brawler',
						name: 'Tavern Brawler',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Strength or Constitution score by 1.' },
										{ type: 'text', text: '• You are proficient in improvised weapons.' },
										{ type: 'text', text: '• You unarmed strikes now use a d4 for damage.' },
										{ type: 'text', text: '• When you hit a creature with an unarmed strike or an improvised weapon, you can use a bonus action to attempt to grapple the target.' },
									]
						},
						featureOptions: {
							placeholderText: 'Increase Strength or Constitution',
							options: ['Strength', 'Constitution'],
							numPicks: 1,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Tavern Brawler'
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

			// Tough
			{
				name: 'Tough',
				optionDescription: 'You are more resilient than the average hero.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_tough',
						name: 'Tough',
						description: {
							blocks: [
										{ type: 'text', text: 'Your hit point maximum increases by 6.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Tough'
							},
						]
					}
				]
			},

			// War Caster
			{
				name: 'War Caster',
				optionDescription: 'You have practiced casting spells in the midst of combat.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_war_caster',
						name: 'War Caster',
						description: {
							blocks: [
										{ type: 'text', text: '• You have advantage on checks made to maintain concentration on your spells.' },
										{ type: 'text', text: '• You can cast spells even when you are holding a shield/weapon.' },
										{ type: 'text', text: '• When making an opportunity attack, you can instead cast a spell at the target creature. The spell must take only 1 Action and target only that creature.' },
									]
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'War Caster'
							},
						]
					}
				]
			},

			// Weapon Master
			{
				name: 'Weapon Master',
				optionDescription: 'DESC.',
				nestedPrompts: [
					{
						id: 'variant_human_feat_weapon_master_ability',
						name: 'Ability Score Increase',
						description: {
							blocks: [
										{ type: 'text', text: '• Increase your Strength or Dexterity score by 1.' },
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
								target: '{userChoice.toLowerCase()}',
								action: 'modify',
								value: 1,
							}
						]
					},
					{
						id: 'variant_human_feat_weapon_master_profs',
						name: 'Weapon Proficiencies',
						description: {
							blocks: [
										{ type: 'text', text: '• You gain four weapons (and their proficiencies).' },
									]
						},
						featureOptions: {
							placeholderText: 'Select 4 Weapons',
							options: [...simpleWeapons, ...martialWeapons],
							numPicks: 4,
						},
						source: 'variant_human.feats',
						effects: [
							{
								target: 'proficiencies',
								action: 'add',
								value: '{userChoice}',
							}
						]
					}
				]
			},
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