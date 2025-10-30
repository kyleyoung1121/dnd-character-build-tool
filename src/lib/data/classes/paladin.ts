import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { martialWeapons, simpleWeapons } from '$lib/data/equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	id: 'paladin_proficiencies_01',
	name: 'Skill Proficiencies',
	description: `
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Athletics, Insight, Intimidation, Medicine, Persuasion, and Religion
	`,
	featureOptions: {
		placeholderText: 'Select skills',
		options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
		numPicks: 2
	},
	source: 'paladin.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const divineSensePrompt: FeaturePrompt = {
	id: 'paladin_divine_sense_01',
	name: 'Divine Sense',
	description: `
		As an action, you can open your awareness to detect good and evil until the start of your next turn. 
		You know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity.
		You can use this feature a number of times equal to 1 + your Charisma modifier per long rest.
	`,
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Divine Sense'
		}
	]
};

const layOnHandsPrompt: FeaturePrompt = {
	id: 'paladin_lay_on_hands_01',
	name: 'Lay on Hands',
	description: `
		You have a pool of healing power that replenishes when you take a long rest. 
		With that pool, you can restore a total of 15 hit points.
		As an action, you can touch a creature to restore any number of hit points remaining in the pool.
		Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.
		This feature has no effect on undead and constructs.
	`,
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Lay on Hands'
		}
	]
};

const fightingStylePrompt: FeaturePrompt = {
	id: 'paladin_fighting_style_01',
	name: 'Fighting Style',
	description: 'Choose a fighting style to enhance your combat ability.',
	featureOptions: {
		placeholderText: '-Choose a Fighting Style-',
		options: [
			{
				name: 'Defense',
				optionDescription: 'Defensive fighter who prioritizes protection.',
				nestedPrompts: [
					{
						id: 'paladin_defense_style_desc',
						name: 'Defense Fighting Style',
						description: 'While you are wearing armor, you gain a +1 bonus to AC.',
						source: 'paladin.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Dueling',
				optionDescription: 'Expert with one-handed weapons.',
				nestedPrompts: [
					{
						id: 'paladin_dueling_style_desc',
						name: 'Dueling Fighting Style',
						description:
							'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
						source: 'paladin.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Great Weapon Fighting',
				optionDescription: 'Master of two-handed weapons.',
				nestedPrompts: [
					{
						id: 'paladin_gwf_style_desc',
						name: 'Great Weapon Fighting Style',
						description:
							'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property for you to gain this benefit.',
						source: 'paladin.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Protection',
				optionDescription: 'Guardian who protects allies.',
				nestedPrompts: [
					{
						id: 'paladin_protection_style_desc',
						name: 'Protection Fighting Style',
						description:
							'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.',
						source: 'paladin.fighting_style',
						effects: []
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: '{userChoice} Fighting Style'
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	id: 'paladin_spellcasting_01',
	name: 'Spellcasting',
	description: `
		You can cast prepared paladin spells using Charisma as your spellcasting ability. 
		At level 3, you have access to 1st-level paladin spells.
	`,
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Spellcasting'
		}
	]
};

const divineSmitePrompt: FeaturePrompt = {
	id: 'paladin_divine_smite_01',
	name: 'Divine Smite',
	description: `
		When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage in addition to the weapon's damage.
		The extra damage is 2d8 for a 1st-level spell slot.
	`,
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Divine Smite'
		}
	]
};

const sacredOathPrompt: FeaturePrompt = {
	id: 'paladin_sacred_oath_01',
	name: 'Sacred Oath',
	description: 'Choose a Sacred Oath at 3rd level.',
	featureOptions: {
		placeholderText: '-Choose an Oath-',
		options: [
			{
				name: 'Oath of Devotion',
				optionDescription: `You strive to be a paragon of virtue and justice.`,
				nestedPrompts: [
					{
						id: 'paladin_oath_devotion_01',
						name: 'Oath Spells',
						description:
							"You gain oath-specific spells that are always prepared and don't count against your prepared spells limit. At 3rd level, you gain Protection from Evil and Good and Sanctuary.",
						source: 'paladin.oath_devotion',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Oath Spells'
							}
						]
					},
					{
						id: 'paladin_sacred_weapon_01',
						name: 'Sacred Weapon',
						description:
							'As an action, you can imbue one weapon that you are holding with positive energy. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration. You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.',
						source: 'paladin.oath_devotion',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Sacred Weapon'
							}
						]
					},
					{
						id: 'paladin_turn_unholy_01',
						name: 'Turn the Unholy',
						description:
							"As an action, you present your holy symbol and speak a prayer censuring fiends and undead. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.",
						source: 'paladin.oath_devotion',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Turn the Unholy'
							}
						]
					}
				]
			},
			{
				name: 'Oath of the Ancients',
				optionDescription: `You fight for the light and life in the world.`,
				nestedPrompts: [
					{
						id: 'paladin_oath_ancients_01',
						name: 'Oath Spells',
						description:
							"You gain oath-specific spells that are always prepared and don't count against your prepared spells limit. At 3rd level, you gain Ensnaring Strike and Speak with Animals.",
						source: 'paladin.oath_ancients',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Oath Spells'
							}
						]
					},
					{
						id: 'paladin_natures_wrath_01',
						name: "Nature's Wrath",
						description:
							'As an action, you can cause spectral vines to spring up and reach for a creature within 10 feet of you that you can see. The creature must succeed on a Strength or Dexterity saving throw (its choice) or be restrained. While restrained by the vines, the creature repeats the saving throw at the end of each of its turns. On a success, it frees itself and the vines vanish.',
						source: 'paladin.oath_ancients',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: "Nature's Wrath"
							}
						]
					},
					{
						id: 'paladin_turn_faithless_01',
						name: 'Turn the Faithless',
						description:
							"As an action, you present your holy symbol and speak a prayer censuring fey and fiends. Each fey or fiend that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.",
						source: 'paladin.oath_ancients',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Turn the Faithless'
							}
						]
					}
				]
			},
			{
				name: 'Oath of Vengeance',
				optionDescription: `You have set aside even your own righteousness to serve the greater good.`,
				nestedPrompts: [
					{
						id: 'paladin_oath_vengeance_01',
						name: 'Oath Spells',
						description:
							"You gain oath-specific spells that are always prepared and don't count against your prepared spells limit. At 3rd level, you gain Bane and Hunter's Mark.",
						source: 'paladin.oath_vengeance',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Oath Spells'
							}
						]
					},
					{
						id: 'paladin_abjure_enemy_01',
						name: 'Abjure Enemy',
						description:
							"As an action, you present your holy symbol and speak a prayer of denunciation, using your Channel Divinity. Choose one creature within 60 feet of you that you can see. That creature must make a Wisdom saving throw, unless it is immune to being frightened. Fiends and undead have disadvantage on this saving throw. On a failed save, the creature is frightened for 1 minute or until it takes any damage. While frightened, the creature's speed is 0, and it can't benefit from any bonus to its speed. On a successful save, the creature's speed is halved for 1 minute or until the creature takes any damage.",
						source: 'paladin.oath_vengeance',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Abjure Enemy'
							}
						]
					},
					{
						id: 'paladin_vow_enmity_01',
						name: 'Vow of Enmity',
						description:
							'As a bonus action, you can utter a vow of enmity against a creature you can see within 10 feet of you, using your Channel Divinity. You gain advantage on attack rolls against the creature for 1 minute or until it drops to 0 hit points or falls unconscious.',
						source: 'paladin.oath_vengeance',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Vow of Enmity'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'paladin',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	divineSensePrompt,
	layOnHandsPrompt,
	fightingStylePrompt,
	spellcastingPrompt,
	divineSmitePrompt
];

export const paladin: ClassData = {
	name: 'Paladin',
	image: base + '/class_icons/paladin.jpg',
	description: 'Holy warriors bound by sacred oaths, wielding divine power to protect and smite.',
	hitDie: 'd10',
	primaryAbility: 'Strength & Charisma',
	saves: ['Wisdom', 'Charisma'],
	armorProficiencies: ['All Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
	startingEquipment: {
		fixed: ['Chain mail', 'Holy symbol'],
		choices: [
			{
				name: 'Primary Weapons',
				description: 'Choose your weapon configuration',
				options: [
					{
						label: 'Martial weapon and shield',
						items: ['Shield'],
						subChoices: [
							{
								name: 'Martial Weapon',
								description: 'Choose a martial weapon',
								type: 'weapon-list',
								category: 'martial',
								options: martialWeapons,
								count: 1
							}
						]
					},
					{
						label: 'Two martial weapons',
						items: [],
						subChoices: [
							{
								name: 'First Martial Weapon',
								description: 'Choose your first martial weapon',
								type: 'weapon-list',
								category: 'martial',
								options: martialWeapons,
								count: 1
							},
							{
								name: 'Second Martial Weapon',
								description: 'Choose your second martial weapon',
								type: 'weapon-list',
								category: 'martial',
								options: martialWeapons,
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Secondary Weapon',
				description: 'Choose your ranged or secondary weapon',
				options: [
					{
						label: 'Five javelins',
						items: ['5 Javelins']
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
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, sacredOathPrompt]
};
