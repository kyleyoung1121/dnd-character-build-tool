import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons } from '../equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	id: 'monk_proficiencies_01',
	name: 'Skill Proficiencies',
	description: {
		blocks: [
			{ type: 'text', text: 'Armor: None' },
			{ type: 'text', text: 'Weapons: Simple weapons, shortswords' },
			{ type: 'text', text: 'Saving Throws: Strength, Dexterity' },
			{ type: 'text', text: 'Skills: Choose two from Acrobatics, Athletics, History, Insight, Religion, and Stealth' },
		]
	},
	featureOptions: {
		placeholderText: 'Select skills',
		options: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
		numPicks: 2
	},
	source: 'monk.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const martialArtsPrompt: FeaturePrompt = {
	id: 'monk_martial_arts_01',
	name: 'Martial Arts',
	description: {
		blocks: [
			{ type: 'text', text: 'Your practice of martial arts gives you mastery of combat styles:' },
			{ type: 'text', text: '• Your unarmed strikes and monk weapons may use Dexterity for attack and damage modifiers.' },
			{ type: 'text', text: '• You can roll a d4 in place of the normal damage of your unarmed strike.' },
			{ type: 'text', text: '• When you use the Attack action with an unarmed strike or monk weapon, you can make one unarmed strike as a bonus action.' },
		]
	},
	source: 'monk',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Martial Arts'
		}
	]
};

const kiPrompt: FeaturePrompt = {
	id: 'monk_ki_01',
	name: 'Ki',
	description: {
		blocks: [
			{ type: 'text', text: 'Your training allows you to harness the mystic energy of ki. You have a pool of 3 ki points. You can spend these points to fuel various ki features. You regain all ki points on a short or long rest.' },
			{
				type: 'computed-replacement',

				whenAvailable: [
					{
						source: 'derived',
						formula: 'WIS_MOD + 10'
					}
				],

				fallbackText:
					'For certain Ki effects, the saving throw DC equals 10 + your Wisdom modifier.',
					
				replacementTemplate:
					'For certain Ki effects, the saving throw DC equals {value}.'
			}
		]
	},
	source: 'monk',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Ki'
		}
	]
};

const kiFeaturesPrompt: FeaturePrompt = {
	id: 'monk_ki_features_01',
	name: 'Ki Features',
	description: {
		blocks: [
			{ type: 'text', text: '<strong>Flurry of Blows</strong>' },
			{ type: 'text', text: 'Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.' },
			{ type: 'text', text: '<strong>Patient Defense</strong>' },
			{ type: 'text', text: 'You can spend 1 ki point to take the Dodge action as a bonus action on your turn.' },
			{ type: 'text', text: '<strong>Step of the Wind</strong>' },
			{ type: 'text', text: 'You can spend 1 ki point to take the Disengage or Dash action as a bonus action on your turn, and your jump distance is doubled for the turn.' },
		]
	},
	source: 'monk',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Flurry of Blows'
		},
		{
			target: 'features',
			action: 'add',
			value: 'Patient Defense'
		},
		{
			target: 'features',
			action: 'add',
			value: 'Step of the Wind'
		}
	]
};

const unarmoredMovementPrompt: FeaturePrompt = {
	id: 'monk_unarmored_movement_01',
	name: 'Unarmored Movement',
	description: {
		blocks: [
			{ type: 'text', text: 'Your speed increases by 10 feet while unarmored.' },
		]
	},
	source: 'monk',
	importance: 'invisible',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Unarmored Movement'
		}
	]
};

const deflectMissilesPrompt: FeaturePrompt = {
	id: 'monk_deflect_missiles_01',
	name: 'Deflect Missiles',
	description: {
		blocks: [
			{ 
				type: 'text', text: 'You can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack.' 
			},
			{
				type: 'computed-replacement',

				whenAvailable: [
					{
						source: 'derived',
						formula: 'DEX_MOD + 3'
					}
				],

				fallbackText:
					'When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + 3.',
					
				replacementTemplate:
					'When you do so, the damage you take from the attack is reduced by 1d10 + {value}.'
			},
			{ 
				type: 'text', text: 'If you reduce the damage to 0, you can catch the missile. You can then spend 1 ki point to make a ranged attack with the caught item, as part of the same reaction.' 
			},
		]
	},
	source: 'monk',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Deflect Missiles'
		}
	]
};

const monasticTraditionPrompt: FeaturePrompt = {
	id: 'monk_tradition_01',
	name: 'Monastic Tradition',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a monastic tradition (subclass).' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose a Tradition-',
		options: [
			{
				name: 'Way of the Open Hand',
				optionDescription: `This tradition emphasizes martial arts mastery, allowing you to manipulate your opponent's ki.`,
				nestedPrompts: [
					{
						id: 'monk_open_hand_technique_01',
						name: 'Open Hand Technique',
						description: {
							blocks: [
								{ type: 'text', text: 'When you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects:' },
								{ type: 'text', text: '• It must succeed on a Dexterity saving throw or be knocked prone.' },
								{ type: 'text', text: '• It must make a Strength saving throw or be pushed 15 feet away.' },
								{ type: 'text', text: '• It can\'t take reactions until the end of your next turn.' },
							]
						},
						source: 'monk.open_hand',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Open Hand Technique'
							}
						]
					}
				]
			},
			{
				name: 'Way of Shadow',
				optionDescription: `This tradition teaches you to use shadows and stealth to confound your enemies.`,
				nestedPrompts: [
					{
						id: 'monk_shadow_arts_01',
						name: 'Shadow Arts',
						description: {
							blocks: [
								{ type: 'text', text: 'As an action, you can spend 2 ki points to cast darkness, darkvision, pass without trace, or silence.' },
							]
						},
						source: 'monk.shadow',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Shadow Arts'
							}
						]
					}
				]
			},
			{
				name: 'Way of the Four Elements',
				optionDescription: `You harness the elemental forces to perform martial arts techniques.`,
				nestedPrompts: [
					{
						id: 'monk_elemental_attunement_01',
						name: 'Elemental Attunement',
						description: {
							blocks: [
								{ type: 'text', text: 'You can use your action to briefly control elemental forces nearby:' },
								{ type: 'text', text: '• Create a harmless, elemental sensory effect, such as a shower of sparks, a puff of wind, a spray of light mist, or a gentle rumbling of stone.' },
								{ type: 'text', text: '• Instantaneously light or snuff out a torch.' },
								{ type: 'text', text: '• Shape nearby elements within a 1-foot cube for 1 minute.' },
							]
						},
						source: 'monk.four_elements',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Elemental Attunement'
							}
						]
					},
					{
						id: 'monk_elemental_disciplines_01',
						name: 'Elemental Disciplines',
						description: {
							blocks: [
								{ type: 'text', text: 'You know one elemental discipline of your choice. An elemental discipline requires you to spend ki points each time you use it.' },
							]
						},
						featureOptions: {
							placeholderText: 'Choose an Elemental Discipline',
							options: [
								{
									name: 'Fangs of the Fire Snake',
									optionDescription:
										'When you use the Attack action on your turn, you can spend 1 ki point to cause tendrils of flame to stretch out from your fists and feet. Your reach with your unarmed strikes increases by 10 feet for the rest of this turn. These strikes deal fire damage, and if you spend 1 ki point when the attack hits, it also deals an extra 1d10 fire damage.',
									nestedPrompts: [
										{
											id: 'monk_fangs_fire_snake_01',
											name: 'Fangs of the Fire Snake',
											description: {
												blocks: [
													{ type: 'text', text: 'When you use the Attack action on your turn, you can spend 1 ki point to cause tendrils of flame to stretch out from your fists and feet. Your reach with your unarmed strikes increases by 10 feet for the rest of this turn. These strikes deal fire damage, and if you spend 1 ki point when the attack hits, it also deals an extra 1d10 fire damage.' },
												]
											},
											source: 'monk.four_elements.fangs_fire_snake',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Fangs of the Fire Snake'
												}
											]
										}
									]
								},
								{
									name: 'Fist of Four Thunders',
									optionDescription: 'You can spend 2 ki points to cast thunderwave.',
									nestedPrompts: [
										{
											id: 'monk_fist_four_thunders_01',
											name: 'Fist of Four Thunders',
											description: {
												blocks: [
													{ type: 'text', text: 'You can spend 2 ki points to cast thunderwave.' },
												]
											},
											source: 'monk.four_elements.fist_four_thunders',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Fist of Four Thunders'
												}
											]
										}
									]
								},
								{
									name: 'Fist of Unbroken Air',
									optionDescription:
										"You can create a blast of compressed air that strikes like a mighty fist. As an action, spend 2 ki points and choose a creature within 30 feet. That creature must succeed on a Strength saving throw or take 3d10 bludgeoning damage (you may choose to spend an additional ki point to deal an extra 1d10 damage). You can also push the creature up to 20 feet away and knock it prone. On a successful save, the creature takes half damage, and you don't push it or knock it prone.",
									nestedPrompts: [
										{
											id: 'monk_fist_unbroken_air_01',
											name: 'Fist of Unbroken Air',
											description: {
												blocks: [
													{ type: 'text', text: "You can create a blast of compressed air that strikes like a mighty fist. As an action, spend 2 ki points and choose a creature within 30 feet. That creature must succeed on a Strength saving throw or take 3d10 bludgeoning damage (you may choose to spend an additional ki point to deal an extra 1d10 damage). You can also push the creature up to 20 feet away and knock it prone. On a successful save, the creature takes half damage, and you don't push it or knock it prone." },
												]
											},
											source: 'monk.four_elements.fist_unbroken_air',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Fist of Unbroken Air'
												}
											]
										}
									]
								},
								{
									name: 'Rush of Gale Spirits',
									optionDescription: 'You can spend 2 ki points to cast gust of wind.',
									nestedPrompts: [
										{
											id: 'monk_rush_gale_spirits_01',
											name: 'Rush of Gale Spirits',
											description: {
												blocks: [
													{ type: 'text', text: 'You can spend 2 ki points to cast gust of wind.' },
												]
											},
											source: 'monk.four_elements.rush_gale_spirits',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Rush of Gale Spirits'
												}
											]
										}
									]
								},
								{
									name: 'Shape the Flowing River',
									optionDescription:
										"As an action, you can spend 1 ki point to manipulate an area of ice or water within a 30 feet cube. You can change water to ice within the area and vice versa, and you can reshape ice in any manner you choose. These modifications, such as creating a trench or a pillar, cannot exceed 15ft in size. You can't shape the ice to trap or injure a creature in the area.",
									nestedPrompts: [
										{
											id: 'monk_shape_flowing_river_01',
											name: 'Shape the Flowing River',
											description: {
												blocks: [
													{ type: 'text', text: 'As an action, you can spend 1 ki point to manipulate an area of ice or water within a 30 feet cube. You can change water to ice within the area and vice versa, and you can reshape ice in any manner you choose. These modifications, such as creating a trench or a pillar, cannot exceed 15ft in size. You can\'t shape the ice to trap or injure a creature in the area.' },
												]
											},
											source: 'monk.four_elements.shape_flowing_river',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Shape the Flowing River'
												}
											]
										}
									]
								},
								{
									name: 'Sweeping Cinder Strike',
									optionDescription: 'You can spend 2 ki points to cast burning hands.',
									nestedPrompts: [
										{
											id: 'monk_sweeping_cinder_strike_01',
											name: 'Sweeping Cinder Strike',
											description: {
												blocks: [
													{ type: 'text', text: 'You can spend 2 ki points to cast burning hands.' },
												]
											},
											source: 'monk.four_elements.sweeping_cinder_strike',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Sweeping Cinder Strike'
												}
											]
										}
									]
								},
								{
									name: 'Water Whip',
									optionDescription:
										"You can spend 2 ki points as an action to create a whip of water that shoves and pulls a creature to unbalance it. A creature within 30 feet of you must succeed on a Dexterity saving throw, or take 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can either knock it prone or pull it up to 25 feet closer to you. On a successful save, the creature takes half as much damage, and you don't pull it or knock it prone.",
									nestedPrompts: [
										{
											id: 'monk_water_whip_01',
											name: 'Water Whip',
											description: {
												blocks: [
													{ type: 'text', text: "You can spend 2 ki points as an action to create a whip of water that shoves and pulls a creature to unbalance it. A creature within 30 feet of you must succeed on a Dexterity saving throw, or take 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can either knock it prone or pull it up to 25 feet closer to you. On a successful save, the creature takes half as much damage, and you don't pull it or knock it prone." },
												]
											},
											source: 'monk.four_elements.water_whip',
											effects: [
												{
													target: 'features',
													action: 'add',
													value: 'Water Whip'
												}
											]
										}
									]
								}
							],
							numPicks: 1
						},
						source: 'monk.four_elements',
						importance: 'invisible',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Elemental Disciplines'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'monk',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const unarmoredDefensePrompt: FeaturePrompt = {
	id: 'monk_unarmored_defense_01',
	name: 'Unarmored Defense',
	description: {
		blocks: [
			{
				type: 'computed-inline',
				text: 'Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.',
				hints: [
					{
						afterText: 'your Dexterity modifier',
						computed: { source: 'abilityMod', ability: 'DEX' },
						hintFormat: '({value})'
					},
					{
						afterText: 'your Wisdom modifier',
						computed: { source: 'abilityMod', ability: 'WIS' },
						hintFormat: '({value})'
					}
				]
			}
		]
	},
	source: 'monk',
	importance: 'invisible',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Unarmored Defense'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	unarmoredDefensePrompt,
	martialArtsPrompt,
	kiPrompt,
	kiFeaturesPrompt,
	unarmoredMovementPrompt,
	deflectMissilesPrompt
];

export const monk: ClassData = {
	name: 'Monk',
	image: base + '/class_icons/monk.jpg',
	description: 'You are a master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
	cultureNotes: 'Monks make use of Ki, the magic that flows through living bodies, to create magical effects and to extend their bodies’ physical capabilities. Monks take their quests seriously, seeing them as personal tests of their physical and spiritual growth.',
	hitDie: 'd8',
	primaryAbility: 'Dexterity & Wisdom',
	saves: ['Strength', 'Dexterity'],
	armorProficiencies: [],
	weaponProficiencies: ['Simple Weapons', 'Shortswords'],
	startingEquipment: {
		fixed: ['10 Darts'],
		choices: [
			{
				name: 'Primary Weapon',
				description: 'Choose your weapon',
				options: [
					{
						label: 'Shortsword',
						items: ['Shortsword']
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
								options: simpleWeapons.filter((w) => !['Light crossbow', 'Shortbow', 'Sling'].includes(w)),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Equipment Pack',
				description: 'Choose your adventure kit',
				options: [
					{
						label: "Dungeoneer's pack",
						items: [
							"Dungeoneer's pack (includes: backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days of rations, waterskin, 50 feet of hempen rope)"
						]
					},
					{
						label: "Explorer's pack",
						items: [
							"Explorer's pack (includes: backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hempen rope)"
						]
					}
				]
			} as EquipmentChoice
		]
	},
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, monasticTraditionPrompt]
};