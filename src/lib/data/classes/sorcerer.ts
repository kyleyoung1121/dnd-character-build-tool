import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons } from '$lib/data/equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	id: 'sorcerer_proficiencies_01',
	name: 'Skill Proficiencies',
	description: `
		Armor: None <br>
		Weapons: Daggers, darts, slings, quarterstaffs, light crossbows <br>
		Saving Throws: Constitution, Charisma <br>
		Skills: Choose two from Arcana, Deception, Insight, Intimidation, Persuasion, and Religion
	`,
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
	description: `
		You know four cantrips of your choice from the sorcerer spell list. 
		You know two 1st-level spells of your choice.
		You can cast spells using Charisma as your spellcasting ability.
	`,
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
	description: `
		Starting at 2nd level, you can use sorcery points to fuel your metamagic. 
		You have a number of sorcery points equal to your sorcerer level (3).
		You regain all expended sorcery points when you finish a long rest.
	`,
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
	description: 'Choose two Metamagic options to customize your spells.',
	featureOptions: {
		placeholderText: '-Choose Metamagic-',
		options: [
			{
				name: 'Careful Spell',
				optionDescription: `When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the effect.`
			},
			{
				name: 'Distant Spell',
				optionDescription: `When you cast a spell with a range of 5 feet or greater, you can double the range.`
			},
			{
				name: 'Empowered Spell',
				optionDescription: `When you roll damage for a spell, you can reroll a number of damage dice up to your Charisma modifier.`
			},
			{
				name: 'Extended Spell',
				optionDescription: `When you cast a spell with a duration of 1 minute or longer, you can double the duration.`
			},
			{
				name: 'Heightened Spell',
				optionDescription: `You can give one target of a spell disadvantage on its first saving throw made against the spell.`
			},
			{
				name: 'Quickened Spell',
				optionDescription: `You can cast a spell that has a casting time of 1 action as a bonus action instead.`
			},
			{
				name: 'Subtle Spell',
				optionDescription: `You can cast a spell without any somatic or verbal components.`
			},
			{
				name: 'Twinned Spell',
				optionDescription: `When you cast a spell that targets only one creature and doesn’t have a range of self, you can target a second creature.`
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
	description: 'Choose your Sorcerous Origin at 1st level.',
	featureOptions: {
		placeholderText: '-Choose an Origin-',
		options: [
			{
				name: 'Draconic Bloodline',
				optionDescription: `You have draconic ancestry that grants you additional resilience and elemental affinity.`,
				nestedPrompts: [
					{
						id: 'sorcerer_draconic_resilience_01',
						name: 'Draconic Resilience',
						description: `Your hit point maximum increases by 1 per sorcerer level. 
						Your AC equals 13 + your Dexterity modifier when not wearing armor.`,
						source: 'sorcerer.draconic_bloodline',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Draconic Resilience'
							}
						]
					},
					{
						id: 'sorcerer_elemental_affinity_01',
						name: 'Elemental Affinity',
						description: `When you cast a spell that deals damage of the type associated with your draconic ancestry, 
						you can add your Charisma modifier to one damage roll of that spell.`,
						source: 'sorcerer.draconic_bloodline',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Elemental Affinity'
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
						description: `Beginning at 1st level, your spellcasting can unleash surges of wild magic.
						Your DM might ask you to roll on the Wild Magic Surge table after you cast a sorcerer spell.`,
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
						description: `You can gain advantage on one attack roll, ability check, or saving throw. 
						Once you use this feature, you must finish a long rest before you can use it again.`,
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
								options: simpleWeapons.map((w) => w.name),
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
						items: ['Arcane focus']
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
