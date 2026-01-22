import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const proficienciesPrompt: FeaturePrompt = {
	id: 'rogue_proficiencies_01',
	name: 'Skill Proficiencies',
	description: {
		blocks: [
			{ type: 'text', text: 'Armor: Light armor' },
			{ type: 'text', text: 'Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords' },
			{ type: 'text', text: 'Saving Throws: Dexterity, Intelligence' },
			{ type: 'text', text: 'Skills: Choose four from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight of Hand, Stealth' },
		]
	},
	featureOptions: {
		placeholderText: 'Select skills',
		options: [
			'Acrobatics',
			'Athletics',
			'Deception',
			'Insight',
			'Intimidation',
			'Investigation',
			'Perception',
			'Performance',
			'Persuasion',
			'Sleight of Hand',
			'Stealth'
		],
		numPicks: 4
	},
	source: 'rogue.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const expertisePrompt: FeaturePrompt = {
	id: 'rogue_expertise_01',
	name: 'Expertise',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools.  		Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.' },
			{ type: 'text', text: '<strong>Important:</strong> You can only choose expertise in skills you have already selected as proficiencies above, plus Thieves\' Tools (which all rogues are proficient with).' },
		]
	},
	featureOptions: {
		placeholderText: 'Select expertise options',
		dynamicOptionsGenerator: {
			type: 'proficient-skills-plus-tools',
			additionalOptions: ["Thieves' Tools"]
		},
		numPicks: 2
	},
	source: 'rogue',
	effects: [
		{
			target: 'expertise',
			action: 'add',
			value: '{userChoice}'
		},
		{
			target: 'features',
			action: 'add',
			value: 'Expertise: {userChoice}'
		}
	]
};

const sneakAttackPrompt: FeaturePrompt = {
	id: 'rogue_sneak_attack_01',
	name: 'Sneak Attack',
	description: {
		blocks: [
			{ type: 'text', text: 'You know how to strike subtly and exploit a foe’s distraction. Once per turn, you can deal an extra 2d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon. You don\'t need advantage on the attack roll if another enemy of the target is within 5 feet of it (such as one of your allies), that enemy isn\'t incapacitated, and you don\'t have disadvantage on the attack roll.' },
		]
	},
	source: 'rogue',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Sneak Attack'
		}
	]
};

const cunningActionPrompt: FeaturePrompt = {
	id: 'rogue_cunning_action_01',
	name: 'Cunning Action',
	description: {
		blocks: [
			{ type: 'text', text: 'Your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat to Dash, Disengage, or Hide.' },
		]
	},
	source: 'rogue',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Cunning Action'
		}
	]
};

const thievesCantPrompt: FeaturePrompt = {
	id: 'rogue_thieves_cant_01',
	name: "Thieves' Cant",
	description: {
		blocks: [
			{ type: 'text', text: 'During your rogue training you learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation.  		Only another creature that knows thieves\' cant understands such messages.  		It takes four times longer to convey such a message than it does to speak the same idea plainly.  		In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves\' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.' },
		]
	},
	source: 'rogue',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: "Thieves' Cant"
		}
	]
};

const rogueArchetypePrompt: FeaturePrompt = {
	id: 'rogue_archetype_01',
	name: 'Roguish Archetype',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a Roguish Archetype' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose an Archetype-',
		options: [
			{
				name: 'Thief',
				optionDescription: `Fast hands and second-story work. You gain the ability to use the Use Magic Device feature and climb faster.`,
				nestedPrompts: [
					{
						id: 'rogue_thief_fast_hands_01',
						name: 'Fast Hands',
						description: {
							blocks: [
								{ type: 'text', text: 'You can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves’ tools to disarm a trap or open a lock, or take the Use Object action.' },
							]
						},
						source: 'rogue.thief',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Fast Hands'
							}
						]
					},
					{
						id: 'rogue_thief_second_story_01',
						name: 'Second-Story Work',
						description: {
							blocks: [
								{ type: 'text', text: 'In addition, climbing no longer costs you extra movement.' },
							]
						},
						source: 'rogue.thief',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Second-Story Work'
							}
						]
					}
				]
			},
			{
				name: 'Assassin',
				optionDescription: `You are an expert at infiltration, disguise, and dealing deadly strikes.`,
				nestedPrompts: [
					{
						id: 'rogue_assassin_bonus_proficiencies_01',
						name: 'Bonus Proficiencies',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain proficiency with the disguise kit and the poisoner\'s kit.' },
							]
						},
						source: 'rogue.assassin',
						effects: [
							{
								target: 'proficiencies',
								action: 'add',
								value: ['Disguise kit', "Poisoner's kit"]
							},
							{
								target: 'features',
								action: 'add',
								value: "Bonus Proficiencies (Disguise Kit, Poisoner's Kit)"
							}
						]
					},
					{
						id: 'rogue_assassin_assassinate_01',
						name: 'Assassinate',
						description: {
							blocks: [
								{ type: 'text', text: 'In addition, any hit you score against a creature that is surprised is a critical hit.' },
							]
						},
						source: 'rogue.assassin',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Assassinate'
							}
						]
					}
				]
			},
			{
				name: 'Arcane Trickster',
				optionDescription: `You gain limited spellcasting and the ability to use magic to enhance your trickery.`,
				nestedPrompts: [
					{
						id: 'rogue_arcane_trickster_spellcasting_01',
						name: 'Spellcasting',
						description: {
							blocks: [
								{ type: 'text', text: '<strong>Cantrips</strong>' },
								{ type: 'text', text: 'You learn three cantrips: mage hand and two other cantrips of your choice from the wizard spell list.' },
								{ type: 'text', text: '<strong>Spells Known of 1st-Level and Higher</strong>' },
								{ type: 'text', text: 'You know three 1st-level wizard spells of your choice, two of which you must choose from the enchantment and illusion spells on the wizard spell list.' },
								{ type: 'text', text: '<strong>Spellcasting Ability</strong>' },
								{ type: 'text', text: 'Intelligence is your spellcasting ability for your wizard spells, since you learn your spells through dedicated study and memorization.' },
								{
									type: 'computed-replacement',
					
									whenAvailable: [
										{
											source: 'derived',
											formula: 'INT_MOD + 10'
										}
									],
					
									fallbackText:
										'<strong>Spell save DC</strong> = 10 + your Intelligence modifier',
										
									replacementTemplate:
										'<strong>Spell save DC</strong> = {value}'
								},
								{
									type: 'computed-replacement',
					
									whenAvailable: [
										{
											source: 'derived',
											formula: 'INT_MOD + 2'
										}
									],
					
									fallbackText:
										'<strong>Spell attack modifier</strong> = your Intelligence modifier + 2',
					
									replacementTemplate:
										'<strong>Spell attack modifier</strong> = +{value}'
								}
							]
						},
						source: 'rogue.arcane_trickster',
						effects: [],
						// effects: [
						// 	{
						// 		target: 'features',
						// 		action: 'add',
						// 		value: 'Arcane Trickster Spellcasting'
						// 	}
						// ],
					},
					{
						id: 'rogue_arcane_trickster_mage_hand_01',
						name: 'Mage Hand Legerdemain',
						description: {
							blocks: [
								{ type: 'text', text: '• You can stow one object the hand is holding in a container worn or carried by another creature' },
								{ type: 'text', text: '• You can retrieve an object in a container worn or carried by another creature' },
								{ type: 'text', text: '• You can use thieves\' tools to pick locks and disarm traps at range' },
								{ type: 'text', text: 'You can perform one of these tasks without being noticed by a creature if you succeed on a Dexterity (Sleight of Hand) check contested by the creature\'s Wisdom (Perception) check.' },
							]
						},
						source: 'rogue.arcane_trickster',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Mage Hand Legerdemain'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'rogue',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	expertisePrompt,
	sneakAttackPrompt,
	cunningActionPrompt,
	thievesCantPrompt
];

export const rogue: ClassData = {
	name: 'Rogue',
	image: base + '/class_icons/rogue.jpg',
	description: 'Sneaky and dexterous masters of stealth and trickery.',
	hitDie: 'd8',
	primaryAbility: 'Dexterity',
	saves: ['Dexterity', 'Intelligence'],
	armorProficiencies: ['Light Armor'],
	weaponProficiencies: ['Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
	startingEquipment: {
		fixed: ['Leather armor', 'Dagger', 'Dagger', "Thieves' tools"],
		choices: [
			{
				name: 'Primary Weapon',
				description: 'Choose your main melee weapon',
				options: [
					{
						label: 'Rapier',
						items: ['Rapier']
					},
					{
						label: 'Shortsword',
						items: ['Shortsword']
					}
				]
			} as EquipmentChoice,
			{
				name: 'Ranged Weapon',
				description: 'Choose your ranged option',
				options: [
					{
						label: 'Shortbow and quiver of 20 arrows',
						items: ['Shortbow', 'Quiver', '20 arrows']
					},
					{
						label: 'Shortsword',
						items: ['Shortsword']
					}
				]
			} as EquipmentChoice,
			{
				name: 'Equipment Pack',
				description: 'Choose your adventure kit',
				options: [
					{
						label: "Burglar's pack",
						items: [
							"Burglar's pack (includes: backpack, 1,000 ball bearings, 10 feet of string, bell, 5 candles, crowbar, hammer, 10 pitons, hooded lantern, 2 oil flasks, 5 days rations, tinderbox, waterskin, 50 feet of hempen rope)"
						]
					},
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
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, rogueArchetypePrompt]
};