import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons } from '../equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'cleric_skills_01',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'Armor: Light armor, medium armor, shields'
			},
			{
				type: 'text',
				text: 'Weapons: Simple weapons'
			},
			{
				type: 'text',
				text: 'Saving Throws: Wisdom, Charisma'
			},
			{
				type: 'text',
				text: 'Skills: Choose two from History, Insight, Medicine, Persuasion, Religion'
			}
		]
	},
	featureOptions: {
		placeholderText: 'Select two skills',
		options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
		numPicks: 2
	},
	source: 'cleric.proficiencies',
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
	id: 'cleric_spellcasting_01',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'You can prepare and cast spells using Wisdom as your spellcasting ability.'
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
					'You know three cantrips and have prepared a number of spells equal to your Wisdom modifier + cleric level.',
					

				replacementTemplate:
					'You know three cantrips and have {value} spells prepared.'
			}
		]
	},
	source: 'cleric',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Spellcasting'
		}
	]
};

const channelDivinityPrompt: FeaturePrompt = {
	name: 'Channel Divinity',
	id: 'cleric_channel_divinity_01',
	description: {
		blocks: [
			{
				type: 'text',
				text:
					'You can use Channel Divinity to fuel magical effects as an action by presenting your holy symbol and calling upon your deity. Each use expends your Channel Divinity until you finish a short or long rest.'
			},
			{
				type: 'text',
				text:
					'Turn Undead: As an action, each undead within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from you as it can.'
			},
			{
				type: 'text',
				text:
					'Your Divine Domain grants additional ways to use Channel Divinity.'
			}
		]
	},
	source: 'cleric',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Channel Divinity'
		}
	]
};

const divineDomainPrompt: FeaturePrompt = {
	name: 'Divine Domain',
	id: 'cleric_divine_domain_01',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'Choose a Divine Domain. Your choice grants you domain spells and other features.'
			}
		]
	},
	featureOptions: {
		placeholderText: '-Choose a Domain-',
		options: [
			{
				name: 'Life Domain',
				optionDescription: `The Life Domain emphasizes healing and protection. These clerics are revered healers who can preserve life and nurture others.`,
				nestedPrompts: [
					{
						name: 'Bonus Proficiencies',
						id: 'cleric_life_armor_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: 'You gain proficiency with heavy armor.'
								}
							]
						},
						source: 'cleric.life_domain',
						effects: [{ target: 'proficiencies', action: 'add', value: 'Heavy Armor' }]
					},
					{
						name: 'Disciple of Life',
						id: 'cleric_life_healing_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "Your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell's level."
								}
							]
						},
						source: 'cleric.life_domain',
						effects: [{ target: 'features', action: 'add', value: 'Disciple of Life' }]
					},
					{
						name: 'Channel Divinity: Preserve Life',
						id: 'cleric_life_channel_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can't restore a creature to more than half of its hit point maximum."
								}
							]
						},
						source: 'cleric.life_domain',
						effects: [
							{ target: 'features', action: 'add', value: 'Channel Divinity: Preserve Life' }
						]
					}
				]
			},
			{
				name: 'Light Domain',
				optionDescription: `The Light Domain harnesses the power of fire and radiance to burn away darkness and heal allies.`,
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'cleric_light_cantrip_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You learn the Light cantrip if you don't already know it. This cantrip doesn't count against the number of cleric cantrips you know."
								}
							]
						},
						source: 'cleric.light_domain',
						effects: [{ target: 'spells', action: 'add', value: 'Light' }]
					},
					{
						name: 'Warding Flare',
						id: 'cleric_light_flare_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "When a creature within 30 feet of you attacks you, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses. An attacker that can't be blinded is immune to this feature. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest."
								}
							]
						},
						source: 'cleric.light_domain',
						effects: [{ target: 'features', action: 'add', value: 'Warding Flare' }]
					},
					{
						name: 'Channel Divinity: Radiance of the Dawn',
						id: 'cleric_light_channel_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "As an action, you present your holy symbol, dispelling any magical darkness within 30 feet of you. Additionally, each hostile creature within 30 feet of you must make a Constitution saving throw. A creature takes radiant damage equal to 2d10 + your cleric level on a failed saving throw, and half as much damage on a successful one. A creature that has total cover from you is not affected."
								}
							]
						},
						source: 'cleric.light_domain',
						effects: [
							{ target: 'features', action: 'add', value: 'Channel Divinity: Radiance of the Dawn' }
						]
					}
				]
			},
			{
				name: 'Knowledge Domain',
				optionDescription: `The Knowledge Domain focuses on learning, secrets, and the acquisition of wisdom through study and divine insight.`,
				nestedPrompts: [
					{
						name: 'Blessings of Knowledge (Languages)',
						id: 'cleric_knowledge_languages_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You learn two languages of your choice."
								}
							]
						},
						featureOptions: {
							placeholderText: 'Select two languages',
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
							numPicks: 2
						},
						source: 'cleric.knowledge_domain',
						effects: [{ target: 'languages', action: 'add', value: '{userChoice}' }]
					},
					{
						name: 'Blessings of Knowledge (Skills)',
						id: 'cleric_knowledge_skills_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You become proficient in your choice of two of the following skills: Arcana, History, Nature, or Religion. Your proficiency bonus is doubled for any ability check you make that uses either of these skills."
								}
							]
						},
						featureOptions: {
							placeholderText: 'Select two skills',
							options: ['Arcana', 'History', 'Nature', 'Religion'],
							numPicks: 2
						},
						source: 'cleric.knowledge_domain',
						effects: [
							{ target: 'skills', action: 'add', value: '{userChoice}' },
							{ target: 'features', action: 'add', value: 'Blessings of Knowledge (Expert)' }
						]
					},
					{
						name: 'Channel Divinity: Knowledge of the Ages',
						id: 'cleric_knowledge_channel_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "As an action, you choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool."
								}
							]
						},
						source: 'cleric.knowledge_domain',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Channel Divinity: Knowledge of the Ages'
							}
						]
					}
				]
			},
			{
				name: 'Nature Domain',
				optionDescription: `The Nature Domain connects clerics to the natural world, granting them power over plants, animals, and the elements.`,
				nestedPrompts: [
					{
						name: 'Acolyte of Nature',
						id: 'cleric_nature_skills_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You learn one druid cantrip of your choice (selected in the Spells tab). You also gain proficiency in your choice of one of the following skills: Animal Handling, Nature, or Survival."
								}
							]
						},
						featureOptions: {
							placeholderText: 'Select one skill',
							options: ['Animal Handling', 'Nature', 'Survival'],
							numPicks: 1
						},
						source: 'cleric.nature_domain',
						effects: [
							{ target: 'skills', action: 'add', value: '{userChoice}' },
							{ target: 'features', action: 'add', value: 'Acolyte of Nature' }
						]
					},
					{
						name: 'Bonus Proficiencies',
						id: 'cleric_nature_armor_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You gain proficiency with heavy armor."
								}
							]
						},
						source: 'cleric.nature_domain',
						effects: [{ target: 'proficiencies', action: 'add', value: 'Heavy Armor' }]
					},
					{
						name: 'Channel Divinity: Charm Animals and Plants',
						id: 'cleric_nature_channel_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "As an action, you present your holy symbol and invoke the name of your deity. Each beast or plant creature that can see you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is charmed by you for 1 minute or until it takes damage. While it is charmed by you, it is friendly to you and other creatures you designate."
								}
							]
						},
						source: 'cleric.nature_domain',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Channel Divinity: Charm Animals and Plants'
							}
						]
					}
				]
			},
			{
				name: 'Tempest Domain',
				optionDescription: `The Tempest Domain commands the power of storm and sky, wielding thunder and lightning to smite enemies.`,
				nestedPrompts: [
					{
						name: 'Bonus Proficiencies',
						id: 'cleric_tempest_proficiencies_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You gain proficiency with martial weapons and heavy armor."
								}
							]
						},
						source: 'cleric.tempest_domain',
						effects: [
							{ target: 'proficiencies', action: 'add', value: 'Martial Weapons' },
							{ target: 'proficiencies', action: 'add', value: 'Heavy Armor' }
						]
					},
					{
						name: 'Wrath of the Storm',
						id: 'cleric_tempest_wrath_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage (your choice) on a failed saving throw, and half as much damage on a successful one. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest."
								}
							]
						},
						source: 'cleric.tempest_domain',
						effects: [{ target: 'features', action: 'add', value: 'Wrath of the Storm' }]
					},
					{
						name: 'Channel Divinity: Destructive Wrath',
						id: 'cleric_tempest_channel_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling."
								}
							]
						},
						source: 'cleric.tempest_domain',
						effects: [
							{ target: 'features', action: 'add', value: 'Channel Divinity: Destructive Wrath' }
						]
					}
				]
			},
			{
				name: 'Trickery Domain',
				optionDescription: `The Trickery Domain focuses on deception, stealth, and misdirection to confound enemies and aid allies.`,
				nestedPrompts: [
					{
						name: 'Bonus Proficiencies',
						id: 'cleric_trickery_skill_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You gain proficiency with the Stealth skill."
								}
							]
						},
						source: 'cleric.trickery_domain',
						effects: [{ target: 'skills', action: 'add', value: 'Stealth' }]
					},
					{
						name: 'Blessing of the Trickster',
						id: 'cleric_trickery_feature_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "As an action, you choose one creature other than yourself within 30 feet of you that you can see. You can't target a creature again with this feature until the target finishes a long rest. Until the blessing ends, the target has advantage on Dexterity (Stealth) checks. The blessing lasts for 1 hour or until you use this feature again."
								}
							]
						},
						source: 'cleric.trickery_domain',
						effects: [{ target: 'features', action: 'add', value: 'Blessing of the Trickster' }]
					},
					{
						name: 'Channel Divinity: Invoke Duplicity',
						id: 'cleric_trickery_channel_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "As an action, you create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration (as if you were concentrating on a spell). The illusion appears in an unoccupied space that you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you. For the duration, you can cast spells as though you were in the illusion's space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature, given how distracting the illusion is to the target."
								}
							]
						},
						source: 'cleric.trickery_domain',
						effects: [
							{ target: 'features', action: 'add', value: 'Channel Divinity: Invoke Duplicity' }
						]
					}
				]
			},
			{
				name: 'War Domain',
				optionDescription: `The War Domain focuses on battle and conflict, empowering clerics to lead from the front lines.`,
				nestedPrompts: [
					{
						name: 'Bonus Proficiencies',
						id: 'cleric_war_proficiencies_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You gain proficiency with martial weapons and heavy armor."
								}
							]
						},
						source: 'cleric.war_domain',
						effects: [
							{ target: 'proficiencies', action: 'add', value: 'Martial Weapons' },
							{ target: 'proficiencies', action: 'add', value: 'Heavy Armor' }
						]
					},
					{
						name: 'War Priest',
						id: 'cleric_war_priest_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "When you use the Attack action, you can make one weapon attack as a bonus action. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest."
								}
							]
						},
						source: 'cleric.war_domain',
						effects: [{ target: 'features', action: 'add', value: 'War Priest' }]
					},
					{
						name: 'Channel Divinity: Guided Strike',
						id: 'cleric_war_channel_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses."
								}
							]
						},
						source: 'cleric.war_domain',
						effects: [
							{ target: 'features', action: 'add', value: 'Channel Divinity: Guided Strike' }
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'cleric',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [spellcastingPrompt, channelDivinityPrompt];

export const cleric: ClassData = {
	name: 'Cleric',
	image: base + '/class_icons/cleric.jpg',
	description: 'Holy warriors who wield divine magic to heal, protect, and smite foes.',
	hitDie: 'd8',
	primaryAbility: 'Wisdom',
	saves: ['Wisdom', 'Charisma'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons'],
	startingEquipment: {
		fixed: ['Shield', 'Holy symbol'],
		choices: [
			{
				name: 'Primary Weapon',
				description: 'Choose your main weapon',
				options: [
					{
						label: 'Mace',
						items: ['Mace']
					},
					{
						label: 'Warhammer',
						items: ['Warhammer'],
						requires: ['Martial Weapons']
					}
				]
			} as EquipmentChoice,
			{
				name: 'Armor',
				description: 'Choose your armor',
				options: [
					{
						label: 'Scale mail',
						items: ['Scale mail']
					},
					{
						label: 'Leather armor',
						items: ['Leather armor']
					},
					{
						label: 'Chain mail',
						items: ['Chain mail'],
						requires: ['Heavy Armor']
					}
				]
			} as EquipmentChoice,
			{
				name: 'Ranged Weapon',
				description: 'Choose your ranged option',
				options: [
					{
						label: 'Light crossbow and 20 bolts',
						items: ['Light crossbow', '20 crossbow bolts']
					},
					{
						label: 'Simple weapon',
						subChoices: [
							{
								name: 'Simple Weapon',
								description: 'Choose a simple weapon',
								type: 'weapon-list',
								category: 'simple',
								options: simpleWeapons,
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
						label: "Priest's pack",
						items: [
							"Priest's pack (includes: backpack, blanket, 10 candles, tinderbox, alms box, 2 blocks of incense, censer, vestments, 2 days of rations, waterskin)"
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
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, divineDomainPrompt]
};
