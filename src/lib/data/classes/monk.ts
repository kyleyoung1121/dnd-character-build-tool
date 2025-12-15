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
			{ type: 'text', text: 'At 1st level, your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons:' },
			{ type: 'text', text: '• You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.' },
			{ type: 'text', text: '• You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die increases as you level.' },
			{ type: 'text', text: '• When you use the Attack action with an unarmed strike or monk weapon on your turn, you can make one unarmed strike as a bonus action.' },
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
			{ type: 'text', text: 'Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points. Your monk level determines the number of ki points you have. You can spend these points to fuel various ki features like Flurry of Blows, Patient Defense, and Step of the Wind. When you spend a ki point, it is unavailable until you finish a short or long rest, at the end of which you draw all of your expended ki points back into yourself. You must spend at least 30 minutes of the rest meditating to regain your ki points. Some of your ki features require your target to make a saving throw to resist the feature\'s effects. The saving throw DC is calculated as follows: Ki save DC = 8 + your proficiency bonus + your Wisdom modifier.' },
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
			{ type: 'text', text: 'Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield.' },
		]
	},
	source: 'monk',
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
			{ type: 'text', text: 'Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level. If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack, which has a normal range of 20 feet and a long range of 60 feet.' },
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
			{ type: 'text', text: 'Choose a monastic tradition (subclass) at 3rd level.' },
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
								{ type: 'text', text: 'As an action, you can spend 2 ki points to cast darkness, darkvision, pass without trace, or silence, without providing material components. Additionally, you gain the minor illusion cantrip if you don\'t already know it.' },
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
								{ type: 'text', text: 'You can use your action to briefly control elemental forces nearby, causing one of the following effects of your choice:' },
								{ type: 'text', text: '• Create a harmless, instantaneous sensory effect related to air, earth, fire, or water, such as a shower of sparks, a puff of wind, a spray of light mist, or a gentle rumbling of stone.' },
								{ type: 'text', text: '• Instantaneously light or snuff out a candle, a torch, or a small campfire.' },
								{ type: 'text', text: '• Chill or warm up to 1 pound of nonliving material for up to 1 hour.' },
								{ type: 'text', text: '• Cause earth, fire, water, or mist that can fit within a 1-foot cube to shape itself into a crude form you designate for 1 minute.' },
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
										'When you use the Attack action on your turn, you can spend 1 ki point to cause tendrils of flame to stretch out from your fists and feet. Your reach with your unarmed strikes increases by 10 feet for that action, as well as the rest of the turn. A hit with such an attack deals fire damage instead of bludgeoning damage, and if you spend 1 ki point when the attack hits, it also deals an extra 1d10 fire damage.',
									nestedPrompts: [
										{
											id: 'monk_fangs_fire_snake_01',
											name: 'Fangs of the Fire Snake',
											description: {
												blocks: [
													{ type: 'text', text: 'When you use the Attack action on your turn, you can spend 1 ki point to cause tendrils of flame to stretch out from your fists and feet. Your reach with your unarmed strikes increases by 10 feet for that action, as well as the rest of the turn. A hit with such an attack deals fire damage instead of bludgeoning damage, and if you spend 1 ki point when the attack hits, it also deals an extra 1d10 fire damage.' },
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
										"You can create a blast of compressed air that strikes like a mighty fist. As an action, you can spend 2 ki points and choose a creature within 30 feet of you. That creature must make a Strength saving throw. On a failed save, the creature takes 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can push the creature up to 20 feet away from you and knock it prone. On a successful save, the creature takes half as much damage, and you don't push it or knock it prone.",
									nestedPrompts: [
										{
											id: 'monk_fist_unbroken_air_01',
											name: 'Fist of Unbroken Air',
											description: {
												blocks: [
													{ type: 'text', text: 'You can create a blast of compressed air that strikes like a mighty fist. As an action, you can spend 2 ki points and choose a creature within 30 feet of you. That creature must make a Strength saving throw. On a failed save, the creature takes 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can push the creature up to 20 feet away from you and knock it prone. On a successful save, the creature takes half as much damage, and you don\'t push it or knock it prone.' },
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
										"As an action, you can spend 1 ki point to choose an area of ice or water no larger than 30 feet on a side within 120 feet of you. You can change water to ice within the area and vice versa, and you can reshape ice in the area in any manner you choose. You can raise or lower the ice's elevation, create or fill in a trench, erect or flatten a wall, or form a pillar. The extent of any such changes can't exceed half the area's largest dimension. For example, if you affect a 30-foot square, you can create a pillar up to 15 feet high, raise or lower the square's elevation by up to 15 feet, dig a trench up to 15 feet deep, and so on. You can't shape the ice to trap or injure a creature in the area.",
									nestedPrompts: [
										{
											id: 'monk_shape_flowing_river_01',
											name: 'Shape the Flowing River',
											description: {
												blocks: [
													{ type: 'text', text: 'As an action, you can spend 1 ki point to choose an area of ice or water no larger than 30 feet on a side within 120 feet of you. You can change water to ice within the area and vice versa, and you can reshape ice in the area in any manner you choose. You can raise or lower the ice\'s elevation, create or fill in a trench, erect or flatten a wall, or form a pillar. The extent of any such changes can\'t exceed half the area\'s largest dimension. For example, if you affect a 30-foot square, you can create a pillar up to 15 feet high, raise or lower the square\'s elevation by up to 15 feet, dig a trench up to 15 feet deep, and so on. You can\'t shape the ice to trap or injure a creature in the area.' },
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
										"You can spend 2 ki points as an action to create a whip of water that shoves and pulls a creature to unbalance it. A creature that you can see that is within 30 feet of you must make a Dexterity saving throw. On a failed save, the creature takes 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can either knock it prone or pull it up to 25 feet closer to you. On a successful save, the creature takes half as much damage, and you don't pull it or knock it prone.",
									nestedPrompts: [
										{
											id: 'monk_water_whip_01',
											name: 'Water Whip',
											description: {
												blocks: [
													{ type: 'text', text: 'You can spend 2 ki points as an action to create a whip of water that shoves and pulls a creature to unbalance it. A creature that you can see that is within 30 feet of you must make a Dexterity saving throw. On a failed save, the creature takes 3d10 bludgeoning damage, plus an extra 1d10 bludgeoning damage for each additional ki point you spend, and you can either knock it prone or pull it up to 25 feet closer to you. On a successful save, the creature takes half as much damage, and you don\'t pull it or knock it prone.' },
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

const classFeaturesPrompt: FeaturePrompt[] = [
	martialArtsPrompt,
	kiPrompt,
	kiFeaturesPrompt,
	unarmoredMovementPrompt,
	deflectMissilesPrompt
];

export const monk: ClassData = {
	name: 'Monk',
	image: base + '/class_icons/monk.jpg',
	description: 'Masters of martial arts harnessing the power of ki.',
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