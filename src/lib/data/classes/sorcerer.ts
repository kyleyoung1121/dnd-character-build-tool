import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons } from '$lib/data/equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	id: 'sorcerer_proficiencies_01',
	name: 'Skill Proficiencies',
	description: {
		blocks: [
			{ type: 'text', text: 'Armor: None' },
			{ type: 'text', text: 'Weapons: Daggers, darts, slings, quarterstaffs, light crossbows' },
			{ type: 'text', text: 'Saving Throws: Constitution, Charisma' },
			{ type: 'text', text: 'Skills: Choose two from Arcana, Deception, Insight, Intimidation, Persuasion, and Religion' },
		]
	},
	featureOptions: {
		placeholderText: 'Select skills',
		options: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
		numPicks: 2
	},
	source: 'sorcerer.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	id: 'sorcerer_spellcasting_01',
	name: 'Spellcasting',
	description: {
		blocks: [
			{ type: 'text', text: 'You know four cantrips of your choice from the sorcerer spell list.  		You know two 1st-level spells of your choice. 		You can cast spells using Charisma as your spellcasting ability.' },
		]
	},
	source: 'sorcerer',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Spellcasting'
		}
	]
};

const sorceryPointsPrompt: FeaturePrompt = {
	id: 'sorcerer_sorcery_points_01',
	name: 'Sorcery Points',
	description: {
		blocks: [
			{ type: 'text', text: 'Starting at 2nd level, you can use sorcery points to fuel your metamagic.  		You have a number of sorcery points equal to your sorcerer level (3). 		You regain all expended sorcery points when you finish a long rest.' },
		]
	},
	source: 'sorcerer',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Sorcery Points'
		}
	]
};

const metamagicPrompt: FeaturePrompt = {
	id: 'sorcerer_metamagic_01',
	name: 'Metamagic',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose two Metamagic options to customize your spells.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose Metamagic-',
		options: [
			{
				name: 'Careful Spell',
				optionDescription: 'Protect allies from your area spells.',
				nestedPrompts: [
					{
						id: 'sorcerer_careful_spell_desc',
						name: 'Careful Spell',
						description: {
							blocks: [
								{ type: 'text', text: 'When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell\\' },
							]
						},
						source: 'sorcerer.metamagic',
						effects: []
					}
				]
			},
			{
				name: 'Distant Spell',
				optionDescription: 'Increase the range of your spells.',
				nestedPrompts: [
					{
						id: 'sorcerer_distant_spell_desc',
						name: 'Distant Spell',
						description: {
							blocks: [
								{ type: 'text', text: 'When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell. When you cast a spell that has a range of touch, you can spend 1 sorcery point to make the range of the spell 30 feet.' },
							]
						},
						source: 'sorcerer.metamagic',
						effects: []
					}
				]
			},
			{
				name: 'Empowered Spell',
				optionDescription: 'Reroll damage dice for better results.',
				nestedPrompts: [
					{
						id: 'sorcerer_empowered_spell_desc',
						name: 'Empowered Spell',
						description: {
							blocks: [
								{ type: 'text', text: 'When you roll damage for a spell, you can spend 1 sorcery point to reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell.' },
							]
						},
						source: 'sorcerer.metamagic',
						effects: []
					}
				]
			},
			{
				name: 'Extended Spell',
				optionDescription: 'Double the duration of your spells.',
				nestedPrompts: [
					{
						id: 'sorcerer_extended_spell_desc',
						name: 'Extended Spell',
						description: {
							blocks: [
								{ type: 'text', text: 'When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration, to a maximum duration of 24 hours.' },
							]
						},
						source: 'sorcerer.metamagic',
						effects: []
					}
				]
			},
			{
				name: 'Heightened Spell',
				optionDescription: 'Make spells harder to resist.',
				nestedPrompts: [
					{
						id: 'sorcerer_heightened_spell_desc',
						name: 'Heightened Spell',
						description: {
							blocks: [
								{ type: 'text', text: 'When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target of the spell disadvantage on its first saving throw made against the spell.' },
							]
						},
						source: 'sorcerer.metamagic',
						effects: []
					}
				]
			},
			{
				name: 'Quickened Spell',
				optionDescription: 'Cast spells as a bonus action.',
				nestedPrompts: [
					{
						id: 'sorcerer_quickened_spell_desc',
						name: 'Quickened Spell',
						description: {
							blocks: [
								{ type: 'text', text: 'When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting.' },
							]
						},
						source: 'sorcerer.metamagic',
						effects: []
					}
				]
			},
			{
				name: 'Subtle Spell',
				optionDescription: 'Cast spells without components.',
				nestedPrompts: [
					{
						id: 'sorcerer_subtle_spell_desc',
						name: 'Subtle Spell',
						description: {
							blocks: [
								{ type: 'text', text: 'When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components.' },
							]
						},
						source: 'sorcerer.metamagic',
						effects: []
					}
				]
			},
			{
				name: 'Twinned Spell',
				optionDescription: 'Target two creatures with one spell.',
				nestedPrompts: [
					{
						id: 'sorcerer_twinned_spell_desc',
						name: 'Twinned Spell',
						description: {
							blocks: [
								{ type: 'text', text: 'When you cast a spell that targets only one creature and doesn\\' },
							]
						},
						source: 'sorcerer.metamagic',
						effects: []
					}
				]
			}
		],
		numPicks: 2
	},
	source: 'sorcerer',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const sorcerousOriginPrompt: FeaturePrompt = {
	id: 'sorcerer_origin_01',
	name: 'Sorcerous Origin',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose your Sorcerous Origin at 1st level.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose an Origin-',
		options: [
			{
				name: 'Draconic Bloodline',
				optionDescription: `You have draconic ancestry that grants you additional resilience.`,
				nestedPrompts: [
					{
						id: 'sorcerer_draconic_resilience_01',
						name: 'Draconic Resilience',
						description: {
							blocks: [
								{ type: 'text', text: 'Your AC equals 13 + your Dexterity modifier when not wearing armor.' },
							]
						},
						source: 'sorcerer.draconic_bloodline',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Draconic Resilience'
							}
						]
					}
				]
			},
			{
				name: 'Wild Magic',
				optionDescription: `Your innate magic is unpredictable and chaotic, causing surges of random magical effects.`,
				nestedPrompts: [
					{
						id: 'sorcerer_wild_magic_surge_01',
						name: 'Wild Magic Surge',
						description: {
							blocks: [
								{ type: 'text', text: 'After you cast a sorcerer spell of 1st level or higher, roll a d20. On a 1, roll on the Wild Magic Surge table to create a magical effect. The Wild Magic Surge table contains a variety of random magical effects that can occur. If that effect is a spell, it is too wild to be affected by your metamagic, and if it normally requires concentration, it doesn\'t require concentration in this case.' },
							]
						},
						source: 'sorcerer.wild_magic',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Wild Magic Surge'
							}
						]
					},
					{
						id: 'sorcerer_tides_of_chaos_01',
						name: 'Tides of Chaos',
						description: {
							blocks: [
								{ type: 'text', text: 'Once you use this feature, you must finish a long rest before you can use it again. Any time before you regain the use of this feature, the DM can have you roll on the Wild Magic Surge table immediately after you cast a sorcerer spell of 1st level or higher. You then regain the use of this feature.' },
							]
						},
						source: 'sorcerer.wild_magic',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Tides of Chaos'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'sorcerer',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	spellcastingPrompt,
	sorceryPointsPrompt,
	metamagicPrompt
];

export const sorcerer: ClassData = {
	name: 'Sorcerer',
	image: base + '/class_icons/sorcerer.jpg',
	description: 'Spellcasters who draw power from innate magical bloodlines or forces.',
	hitDie: 'd6',
	primaryAbility: 'Charisma',
	saves: ['Constitution', 'Charisma'],
	armorProficiencies: [],
	weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows'],
	startingEquipment: {
		fixed: ['2 Daggers'],
		choices: [
			{
				name: 'Ranged Weapon',
				description: 'Choose your ranged weapon',
				options: [
					{
						label: 'Light crossbow and 20 bolts',
						items: ['Light crossbow', '20 crossbow bolts']
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
								options: simpleWeapons,
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Spellcasting Focus',
				description: 'Choose your spellcasting focus',
				options: [
					{
						label: 'Component pouch',
						items: ['Component pouch']
					},
					{
						label: 'Arcane focus',
						items: [],
						subChoices: [
							{
								name: 'Arcane Focus Type',
								description: 'Choose your arcane focus',
								type: 'simple-list',
								options: ['Crystal', 'Orb', 'Rod', 'Staff', 'Wand'],
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
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, sorcerousOriginPrompt]
};