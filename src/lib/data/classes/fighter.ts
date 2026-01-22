import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { martialMeleeWeapons, martialRangedWeapons, twoHandedWeapons } from '../equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'fighter_skills_01',
	description: {
		blocks: [
			{ type: 'text', text: 'Armor: All armor, shields' },
			{ type: 'text', text: 'Weapons: Simple weapons, martial weapons' },
			{ type: 'text', text: 'Saving Throws: Strength, Constitution' },
			{ type: 'text', text: 'Skills: Choose two from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival' },
		]
	},
	featureOptions: {
		placeholderText: 'Select two skills',
		options: [
			'Acrobatics',
			'Animal Handling',
			'Athletics',
			'History',
			'Insight',
			'Intimidation',
			'Perception',
			'Survival'
		],
		numPicks: 2
	},
	source: 'fighter.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const fightingStylePrompt: FeaturePrompt = {
	name: 'Fighting Style',
	id: 'fighter_style_01',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a fighting style that suits your combat approach.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose a Fighting Style-',
		options: [
			{
				name: 'Archery',
				optionDescription: 'Master of ranged combat.',
				nestedPrompts: [
					{
						id: 'fighter_archery_style_desc',
						name: 'Archery Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain a +2 bonus to attack rolls you make with ranged weapons.' },
							]
						},
						source: 'fighter.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Defense',
				optionDescription: 'Defensive fighter who prioritizes protection.',
				nestedPrompts: [
					{
						id: 'fighter_defense_style_desc',
						name: 'Defense Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'While you are wearing armor, you gain a +1 bonus to AC.' },
							]
						},
						source: 'fighter.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Dueling',
				optionDescription: 'Expert with one-handed weapons.',
				nestedPrompts: [
					{
						id: 'fighter_dueling_style_desc',
						name: 'Dueling Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
							]
						},
						source: 'fighter.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Great Weapon Fighting',
				optionDescription: 'Master of two-handed weapons.',
				nestedPrompts: [
					{
						id: 'fighter_gwf_style_desc',
						name: 'Great Weapon Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property for you to gain this benefit.' },
							]
						},
						source: 'fighter.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Protection',
				optionDescription: 'Guardian who protects allies.',
				nestedPrompts: [
					{
						id: 'fighter_protection_style_desc',
						name: 'Protection Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.' },
							]
						},
						source: 'fighter.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Two-Weapon Fighting',
				optionDescription: 'Expert with dual-wielding combat.',
				nestedPrompts: [
					{
						id: 'fighter_twf_style_desc',
						name: 'Two-Weapon Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'When you fight with two weapons, you can add your ability modifier to the damage of the second attack.' },
							]
						},
						source: 'fighter.fighting_style',
						effects: []
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'fighter',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: '{userChoice} Fighting Style'
		}
	]
};

const secondWindPrompt: FeaturePrompt = {
	name: 'Second Wind',
	id: 'fighter_second_wind_01',
	description: {
		blocks: [
			{ type: 'text', text: 'You have a limited well of stamina to protect yourself. On your turn, you can use a bonus action to regain hit points equal to 1d10 + 3. Once used, must finish a short or long rest before using again.' },
		]
	},
	source: 'fighter',
	effects: [{ target: 'features', action: 'add', value: 'Second Wind' }]
};

const actionSurgePrompt: FeaturePrompt = {
	name: 'Action Surge',
	id: 'fighter_action_surge_01',
	description: {
		blocks: [
			{ type: 'text', text: 'You can take one additional action on your turn.  		Once used, must finish a short or long rest before using again.' },
		]
	},
	source: 'fighter',
	effects: [{ target: 'features', action: 'add', value: 'Action Surge' }]
};

const martialArchetypePrompt: FeaturePrompt = {
	name: 'Martial Archetype',
	id: 'fighter_archetype_01',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a Martial Archetype.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose an Archetype-',
		options: [
			{
				name: 'Champion',
				optionDescription: 'Focused on raw physical power and improving critical hits.',
				nestedPrompts: [
					{
						name: 'Improved Critical',
						id: 'fighter_champion_critical_01',
						description: {
							blocks: [
								{ type: 'text', text: 'Weapon attacks score a critical hit on 19 or 20.' },
							]
						},
						source: 'fighter.champion',
						effects: [{ target: 'features', action: 'add', value: 'Improved Critical' }]
					}
				]
			},
			{
				name: 'Battle Master',
				optionDescription:
					'A master of martial techniques, using maneuvers to control the battlefield.',
				nestedPrompts: [
					{
						name: 'Combat Superiority',
						id: 'fighter_battle_master_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn maneuvers that are fueled by special dice called superiority dice. You have four superiority dice, which are d8s. A superiority die is expended when you use it. You regain all expended superiority dice when you finish a short or long rest. Some maneuvers require your target to make a saving throw.'},
								{
									type: 'computed-replacement',
					
									whenAvailable: [
										{
											source: 'derived',
											formula: 'Math.max(10 + STR_MOD, 10 + DEX_MOD)'
										}
									],
					
									fallbackText:
										'The saving throw DC equals 10 + your Strength or Dexterity modifier (your choice).',
										
									replacementTemplate:
										'The saving throw DC is {value}.'
								}
							]
						},
						source: 'fighter.battle_master',
						effects: [{ target: 'features', action: 'add', value: 'Combat Superiority' }]
					},
					{
						name: 'Maneuvers',
						id: 'fighter_battle_master_maneuvers_01',
						description: {
							blocks: [
								{ type: 'text', text: 'Choose three maneuvers from the list below.' },
							]
						},
						featureOptions: {
							placeholderText: 'Select 3 maneuvers',
							options: [
								{
									name: "Commander's Strike",
									optionDescription: 'Direct an ally to strike.',
									nestedPrompts: [
										{
											id: 'fighter_commanders_strike_desc',
											name: "Commander's Strike",
											description: {
												blocks: [
													{ type: 'text', text: 'When you take the Attack action on your turn, you can forgo one of your attacks and use a bonus action to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to the attack\'s damage roll.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Disarming Attack',
									optionDescription: 'Force a target to drop their weapon.',
									nestedPrompts: [
										{
											id: 'fighter_disarming_attack_desc',
											name: 'Disarming Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm the target, forcing it to drop one item of your choice that it\'s holding. You add the superiority die to the attack\'s damage roll, and the target must make a Strength saving throw. On a failed save, it drops the object you choose. The object lands at its feet.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Distracting Strike',
									optionDescription: 'Distract a foe to aid an ally.',
									nestedPrompts: [
										{
											id: 'fighter_distracting_strike_desc',
											name: 'Distracting Strike',
											description: {
												blocks: [
													{ type: 'text', text: 'When you hit a creature with a weapon attack, you can expend one superiority die to distract the creature, giving your allies an opening. You add the superiority die to the attack\'s damage roll. The next attack roll against the target by an attacker other than you has advantage if the attack is made before the start of your next turn.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Evasive Footwork',
									optionDescription: 'Increase AC while moving.',
									nestedPrompts: [
										{
											id: 'fighter_evasive_footwork_desc',
											name: 'Evasive Footwork',
											description: {
												blocks: [
													{ type: 'text', text: 'When you move, you can expend one superiority die, rolling the die and adding the number rolled to your AC until you stop moving.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Feinting Attack',
									optionDescription: 'Feint to gain advantage on your attack.',
									nestedPrompts: [
										{
											id: 'fighter_feinting_attack_desc',
											name: 'Feinting Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'You can expend one superiority die and use a bonus action on your turn to feint, choosing one creature within 5 feet of you as your target. You have advantage on your next attack roll against that creature this turn. If that attack hits, add the superiority die to the attack\'s damage roll.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Goading Attack',
									optionDescription: 'Goad an enemy to attack you.',
									nestedPrompts: [
										{
											id: 'fighter_goading_attack_desc',
											name: 'Goading Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target into attacking you. You add the superiority die to the attack\'s damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Lunging Attack',
									optionDescription: 'Extend your reach for one attack.',
									nestedPrompts: [
										{
											id: 'fighter_lunging_attack_desc',
											name: 'Lunging Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, you add the superiority die to the attack\'s damage roll.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Maneuvering Attack',
									optionDescription: 'Allow an ally to move without provoking opportunity attacks.',
									nestedPrompts: [
										{
											id: 'fighter_maneuvering_attack_desc',
											name: 'Maneuvering Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. You add the superiority die to the attack\'s damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks from the target of your attack.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Menacing Attack',
									optionDescription: 'Frighten your opponent.',
									nestedPrompts: [
										{
											id: 'fighter_menacing_attack_desc',
											name: 'Menacing Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. You add the superiority die to the attack\'s damage roll, and the target must make a Wisdom saving throw. On a failed save, it is frightened of you until the end of your next turn.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Parry',
									optionDescription: 'Reduce damage from an attack.',
									nestedPrompts: [
										{
											id: 'fighter_parry_desc',
											name: 'Parry',
											description: {
												blocks: [
													{
														type: 'computed-replacement',
										
														whenAvailable: [
															{
																source: 'derived',
																formula: 'Math.max(0, DEX_MOD)'
															}
														],
										
														fallbackText:
															'When another creature damages you with a melee attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on your superiority die + your Dexterity modifier.',
															
														replacementTemplate:
															'When another creature damages you with a melee attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on your superiority die + {value}.'
													}
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Precision Attack',
									optionDescription: 'Add superiority die to attack roll.',
									nestedPrompts: [
										{
											id: 'fighter_precision_attack_desc',
											name: 'Precision Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Pushing Attack',
									optionDescription: 'Push your target away.',
									nestedPrompts: [
										{
											id: 'fighter_pushing_attack_desc',
											name: 'Pushing Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. You add the superiority die to the attack\'s damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you push the target up to 15 feet away from you.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Rally',
									optionDescription: "Bolster an ally's resolve.",
									nestedPrompts: [
										{
											id: 'fighter_rally_desc',
											name: 'Rally',
											description: {
												blocks: [
													{ type: 'text', text: 'On your turn, you can use a bonus action and expend one superiority die to bolster the resolve of one of your companions. When you do so, choose a friendly creature who can see or hear you.' },
													{
														type: 'computed-replacement',
										
														whenAvailable: [
															{
																source: 'derived',
																formula: 'Math.max(0, CHA_MOD)'
															}
														],
										
														fallbackText:
															'That creature gains temporary hit points equal to the superiority die roll + your Charisma modifier.',
										
														replacementTemplate:
															'That creature gains temporary hit points equal to the superiority die roll + {value}.'
													}
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Riposte',
									optionDescription: 'Strike back when an enemy misses you.',
									nestedPrompts: [
										{
											id: 'fighter_riposte_desc',
											name: 'Riposte',
											description: {
												blocks: [
													{ type: 'text', text: 'When a creature misses you with a melee attack, you can use your reaction and expend one superiority die to make a melee weapon attack against the creature. If you hit, you add the superiority die to the attack\'s damage roll.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Sweeping Attack',
									optionDescription: 'Strike an additional nearby enemy.',
									nestedPrompts: [
										{
											id: 'fighter_sweeping_attack_desc',
											name: 'Sweeping Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage another creature with the same attack. Choose another creature within 5 feet of the original target and within your reach. If the original attack roll would hit the second creature, it takes damage equal to the number you roll on your superiority die. The damage is of the same type dealt by the original attack.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								},
								{
									name: 'Trip Attack',
									optionDescription: 'Knock your target prone.',
									nestedPrompts: [
										{
											id: 'fighter_trip_attack_desc',
											name: 'Trip Attack',
											description: {
												blocks: [
													{ type: 'text', text: 'When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. You add the superiority die to the attack\'s damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you knock the target prone.' },
												]
											},
											source: 'fighter.battle_master',
											effects: []
										}
									]
								}
							],
							numPicks: 3
						},
						source: 'fighter.battle_master',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: '{userChoice}'
							}
						]
					},
					{
						name: 'Student of War',
						id: 'fighter_battle_master_student_war_01',
						description: {
							blocks: [
								{ type: 'text', text: 'Choose one type of artisan\'s tools to gain proficiency with.' },
							]
						},
						featureOptions: {
							placeholderText: 'Select artisan tools',
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
						source: 'fighter.battle_master',
						effects: [
							{
								target: 'proficiencies',
								action: 'add',
								value: '{userChoice}'
							}
						]
					}
				]
			},
			{
				name: 'Eldritch Knight',
				optionDescription: 'Blend magic with combat.',
				nestedPrompts: [
					{
						name: 'Weapon Bond',
						id: 'fighter_eldritch_weapon_bond_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn a ritual that creates a magical bond between you and one weapon. Once bonded, you can\'t be disarmed of that weapon unless you are incapacitated. If it is on the same plane of existence, you can summon that weapon as a bonus action on your turn, causing it to teleport instantly to your hand. You can have up to two bonded weapons, but can summon only one at a time with your bonus action.' },
							]
						},
						source: 'fighter.eldritch_knight',
						effects: [{ target: 'features', action: 'add', value: 'Weapon Bond' }]
					},
					{
						name: 'Spellcasting',
						id: 'fighter_eldritch_spellcasting_01',
						description: {
							blocks: [
								{ type: 'text', text: 'You augment your martial prowess with the ability to cast spells. You know two cantrips of your choice from the wizard spell list. You also know three 1st-level wizard spells of your choice, two of which you must choose from the abjuration and evocation spells on the wizard spell list. You use Intelligence as your spellcasting ability.' },
							]
						},
						source: 'fighter.eldritch_knight',
						effects: []
						//effects: [{ target: 'features', action: 'add', value: 'Eldritch Knight Spellcasting' }]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'fighter',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	fightingStylePrompt,
	secondWindPrompt,
	actionSurgePrompt
];

export const fighter: ClassData = {
	name: 'Fighter',
	image: base + '/class_icons/fighter.jpg',
	description: 'Versatile warriors skilled in all forms of combat.',
	hitDie: 'd10',
	primaryAbility: 'Strength or Dexterity',
	saves: ['Strength', 'Constitution'],
	armorProficiencies: ['All Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
	startingEquipment: {
		fixed: [
			"Explorer's pack (includes: backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hempen rope)"
		],
		choices: [
			{
				name: 'Armor',
				description: 'Choose your starting armor',
				options: [
					{
						label: 'Chain mail',
						items: ['Chain mail']
					},
					{
						label: 'Leather armor, longbow, and arrows',
						items: ['Leather armor', 'Longbow', '20 arrows']
					}
				]
			} as EquipmentChoice,
			{
				name: 'Primary Weapon Setup',
				description: 'Choose your main weapon configuration',
				options: [
					{
						label: 'Martial weapon and shield',
						subChoices: [
							{
								name: 'Martial Weapon',
								description: 'Choose a one-handed martial weapon (melee or ranged)',
								type: 'weapon-list',
								category: 'martial-one-handed',
								options: [
									...martialMeleeWeapons.filter((w) => !twoHandedWeapons.includes(w)),
									'Blowgun', // One-handed martial ranged
									'Hand crossbow', // One-handed martial ranged
									'Net' // One-handed martial ranged (thrown)
								],
								count: 1
							}
						],
						items: ['Shield'] // Shield is always included with this choice
					},
					{
						label: 'Two martial weapons',
						subChoices: [
							{
								name: 'Primary Martial Weapon',
								description: 'Choose your first martial weapon (melee or ranged)',
								type: 'weapon-list',
								category: 'martial-all',
								options: [...martialMeleeWeapons, ...martialRangedWeapons],
								count: 1
							},
							{
								name: 'Secondary Martial Weapon',
								description: 'Choose your second martial weapon (melee or ranged)',
								type: 'weapon-list',
								category: 'martial-all',
								options: [...martialMeleeWeapons, ...martialRangedWeapons],
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Ranged Option',
				description: 'Choose your ranged weapon or throwing weapons',
				options: [
					{
						label: 'Light crossbow and bolts',
						items: ['Light crossbow', '20 bolts']
					},
					{
						label: 'Two handaxes',
						items: ['Handaxe', 'Handaxe']
					}
				]
			} as EquipmentChoice
		]
	},
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, martialArchetypePrompt]
};