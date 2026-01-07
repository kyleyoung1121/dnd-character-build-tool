import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const proficienciesPrompt: FeaturePrompt = {
	id: 'wizard_proficiencies',
	name: 'Skill Proficiencies',
	description: {
		blocks: [
			{ type: 'text', text: 'Weapons: Daggers, darts, slings, quarterstaffs, light crossbows' },
			{ type: 'text', text: 'Saving Throws: Intelligence, Wisdom' },
			{ type: 'text', text: 'Skills: Choose two from Arcana, History, Insight, Investigation, Medicine, and Religion' },
		]
	},
	featureOptions: {
		placeholderText: 'Select skills',
		options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
		numPicks: 2
	},
	source: 'wizard.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const arcaneRecoveryPrompt: FeaturePrompt = {
	id: 'wizard_arcane_recovery',
	name: 'Arcane Recovery',
	description: {
		blocks: [
			{ type: 'text', text: 'Once per day when you finish a short rest, you can recover expended spell slots with a combined level equal to or less than 2.' },
		]
	},
	source: 'wizard',
	effects: []
};

const spellcastingPrompt: FeaturePrompt = {
	id: 'wizard_spellcasting',
	name: 'Spellcasting',
	description: {
		blocks: [
			{ type: 'text', text: 'You know three cantrips from the wizard spell list. You know six 1st-level wizard spells. You prepare spells from your spellbook, using Intelligence as your spellcasting ability.' },
		]
	},
	source: 'wizard',
	effects: []
};

const arcaneTraditionPrompt: FeaturePrompt = {
	id: 'wizard_arcane_tradition',
	name: 'Arcane Tradition',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose an Arcane Tradition.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose an Arcane Tradition-',
		options: [
			{
				name: 'School of Abjuration',
				optionDescription: `
					You focus on magic that blocks, banishes, and protects. You can weave magic into a ward that protects you from harm.
				`,
				nestedPrompts: [
					{
						id: 'wizard_abjuration_savant',
						name: 'Abjuration Savant',
						description: {
							blocks: [
								{ type: 'text', text: 'The gold and time you must spend to copy an abjuration spell into your spellbook is halved.' },
							]
						},
						source: 'wizard.abjuration',
						effects: []
					},
					{
						id: 'wizard_arcane_ward',
						name: 'Arcane Ward',
						description: {
							blocks: [
								{ 
									type: 'text', text: 'When you cast an abjuration spell of 1st level or higher, you can simultaneously create a magical ward on yourself that lasts until you finish a long rest.' 
								},
								{
									type: 'computed-replacement',
					
									whenAvailable: [
										{
											source: 'derived',
											formula: 'INT_MOD + 6'
										}
									],
					
									fallbackText:
										'The ward has hit points equal to 6 + your Intelligence modifier. Whenever you take damage, the ward takes the damage instead. If this damage reduces the ward to 0 hit points, you take any remaining damage.',
										
									replacementTemplate:
										'The ward has {value} hit points. Whenever you take damage, the ward takes the damage instead. If this damage reduces the ward to 0 hit points, you take any remaining damage.',

									singularTemplate:
										'The ward has 1 hit point. Whenever you take damage, the ward takes the damage instead. If this damage reduces the ward to 0 hit points, you take any remaining damage.',
								}
							]
						},
						source: 'wizard.abjuration',
						effects: []
					}
				]
			},
			{
				name: 'School of Conjuration',
				optionDescription: `
					You focus on conjuring creatures and objects to your side. You can conjure billowing clouds of killing fog or summon creatures to fight on your behalf.
				`,
				nestedPrompts: [
					{
						id: 'wizard_conjuration_savant',
						name: 'Conjuration Savant',
						description: {
							blocks: [
								{ type: 'text', text: 'The gold and time you must spend to copy a conjuration spell into your spellbook is halved.' },
							]
						},
						source: 'wizard.conjuration',
						effects: []
					},
					{
						id: 'wizard_minor_conjuration',
						name: 'Minor Conjuration',
						description: {
							blocks: [
								{ type: 'text', text: 'You can use your action to conjure an inanimate object in your hand or on the ground in an unoccupied space within 10 feet. The object must be no larger than 3 feet on a side and weigh no more than 10 pounds. It lasts for 1 hour or until you use this feature again.' },
							]
						},
						source: 'wizard.conjuration',
						effects: []
					}
				]
			},
			{
				name: 'School of Divination',
				optionDescription: `
					You focus on spells that reveal information and predict the future. Glimpses of the future begin to press in on your awareness.
				`,
				nestedPrompts: [
					{
						id: 'wizard_divination_savant',
						name: 'Divination Savant',
						description: {
							blocks: [
								{ type: 'text', text: 'The gold and time you must spend to copy a divination spell into your spellbook is halved.' },
							]
						},
						source: 'wizard.divination',
						effects: []
					},
					{
						id: 'wizard_portent',
						name: 'Portent',
						description: {
							blocks: [
								{ type: 'text', text: 'When you finish a long rest, roll two d20s and record the numbers. You can replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of these foretelling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn. Each foretelling roll can be used only once.' },
							]
						},
						source: 'wizard.divination',
						effects: []
					}
				]
			},
			{
				name: 'School of Enchantment',
				optionDescription: `
					You focus on magic that beguiles and charms people and monsters. You can make yourself supernaturally charming.
				`,
				nestedPrompts: [
					{
						id: 'wizard_enchantment_savant',
						name: 'Enchantment Savant',
						description: {
							blocks: [
								{ type: 'text', text: 'The gold and time you must spend to copy an enchantment spell into your spellbook is halved.' },
							]
						},
						source: 'wizard.enchantment',
						effects: []
					},
					{
						id: 'wizard_hypnotic_gaze',
						name: 'Hypnotic Gaze',
						description: {
							blocks: [
								{ type: 'text', text: 'As an action, choose one creature you can see within 5 feet. If the target can see or hear you, it must succeed on a Wisdom saving throw against your wizard spell save DC or be charmed until the end of your next turn. The charmed creature\'s speed drops to 0, and it is incapacitated and visibly dazed. On subsequent turns, you can use your action to maintain this effect, extending its duration until the end of your next turn. However, the effect ends if you move more than 5 feet away from the creature.' },
							]
						},
						source: 'wizard.enchantment',
						effects: []
					}
				]
			},
			{
				name: 'School of Evocation',
				optionDescription: `
					You focus on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid.
				`,
				nestedPrompts: [
					{
						id: 'wizard_evocation_savant',
						name: 'Evocation Savant',
						description: {
							blocks: [
								{ type: 'text', text: 'The gold and time you must spend to copy an evocation spell into your spellbook is halved.' },
							]
						},
						source: 'wizard.evocation',
						effects: []
					},
					{
						id: 'wizard_sculpt_spells',
						name: 'Sculpt Spells',
						description: {
							blocks: [
								{ type: 'text', text: 'When you cast an evocation spell that affects other creatures you can see, you can choose a number of them equal to 1 + the spell\'s level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.' },
							]
						},
						source: 'wizard.evocation',
						effects: []
					}
				]
			},
			{
				name: 'School of Illusion',
				optionDescription: `
					You focus on magic that dazzles the senses, befuddles the mind, and tricks even the wisest folk. You learn to make the illusory seem real.
				`,
				nestedPrompts: [
					{
						id: 'wizard_illusion_savant',
						name: 'Illusion Savant',
						description: {
							blocks: [
								{ type: 'text', text: 'The gold and time you must spend to copy an illusion spell into your spellbook is halved.' },
							]
						},
						source: 'wizard.illusion',
						effects: []
					},
					{
						id: 'wizard_improved_minor_illusion',
						name: 'Improved Minor Illusion',
						description: {
							blocks: [
								{ type: 'text', text: 'You learn the Minor Illusion cantrip. If you already know it, you learn a different wizard cantrip. When you cast Minor Illusion, you can create both a sound and an image with a single casting.' },
							]
						},
						source: 'wizard.illusion',
						effects: []
					}
				]
			},
			{
				name: 'School of Necromancy',
				optionDescription: `
					You focus on magic that manipulates the life force of living creatures and animates the undead. You can drain life from others to heal your wounds.
				`,
				nestedPrompts: [
					{
						id: 'wizard_necromancy_savant',
						name: 'Necromancy Savant',
						description: {
							blocks: [
								{ type: 'text', text: 'The gold and time you must spend to copy a necromancy spell into your spellbook is halved.' },
							]
						},
						source: 'wizard.necromancy',
						effects: []
					},
					{
						id: 'wizard_grim_harvest',
						name: 'Grim Harvest',
						description: {
							blocks: [
								{ type: 'text', text: 'Once per turn when you kill one or more creatures with a spell of 1st level or higher, you regain hit points equal to twice the spell\'s level (or three times if the spell is necromancy). This doesn\'t work on constructs or undead.' },
							]
						},
						source: 'wizard.necromancy',
						effects: []
					}
				]
			},
			{
				name: 'School of Transmutation',
				optionDescription: `
					You are a student of spells that modify energy and matter. You can temporarily alter the physical properties of objects.
				`,
				nestedPrompts: [
					{
						id: 'wizard_transmutation_savant',
						name: 'Transmutation Savant',
						description: {
							blocks: [
								{ type: 'text', text: 'The gold and time you must spend to copy a transmutation spell into your spellbook is halved.' },
							]
						},
						source: 'wizard.transmutation',
						effects: []
					},
					{
						id: 'wizard_minor_alchemy',
						name: 'Minor Alchemy',
						description: {
							blocks: [
								{ type: 'text', text: 'You can temporarily alter the physical properties of one nonmagical object. You perform a 10-minute procedure to transform a 1-foot cube of material (wood, stone, iron, copper, or silver) into a different material. After 1 hour, or if you lose concentration, the material reverts to its original substance.' },
							]
						},
						source: 'wizard.transmutation',
						effects: []
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'wizard',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	arcaneRecoveryPrompt,
	spellcastingPrompt,
	arcaneTraditionPrompt
];

export const wizard: ClassData = {
	name: 'Wizard',
	image: base + '/class_icons/wizard.jpg',
	description: 'Scholars of magic who manipulate arcane forces through study and practice.',
	hitDie: 'd6',
	primaryAbility: 'Intelligence',
	saves: ['Intelligence', 'Wisdom'],
	armorProficiencies: [],
	weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows'],
	startingEquipment: {
		fixed: ['Spellbook'],
		choices: [
			{
				name: 'Primary Weapon',
				description: 'Choose your weapon',
				options: [
					{
						label: 'Quarterstaff',
						items: ['Quarterstaff']
					},
					{
						label: 'Dagger',
						items: ['Dagger']
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
						label: "Scholar's pack",
						items: [
							"Scholar's pack (includes: backpack, book of lore, ink bottle, ink pen, 10 sheets of parchment, little bag of sand, small knife)"
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
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt]
};