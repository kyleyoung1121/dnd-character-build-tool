import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { martialMeleeWeapons, twoHandedWeapons } from '../equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'fighter_skills_01',
	description: `
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Constitution <br>
		Skills: Choose two from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival
	`,
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
	description: 'Choose a fighting style that suits your combat approach.',
	featureOptions: {
		placeholderText: '-Choose a Fighting Style-',
		options: [
			{
				name: 'Archery',
				optionDescription: 'You gain a +2 bonus to attack rolls you make with ranged weapons.'
			},
			{
				name: 'Defense',
				optionDescription: 'While you are wearing armor, you gain a +1 bonus to AC.'
			},
			{
				name: 'Dueling',
				optionDescription:
					'When wielding a melee weapon in one hand and no other weapons, gain +2 to damage rolls.'
			},
			{
				name: 'Great Weapon Fighting',
				optionDescription: 'Reroll 1 or 2 on damage die for melee weapons wielded with two hands.'
			},
			{
				name: 'Protection',
				optionDescription:
					'Use your reaction to impose disadvantage on an attack against an ally within 5 feet.'
			},
			{
				name: 'Two-Weapon Fighting',
				optionDescription:
					'Add your ability modifier to the damage of the second attack when engaging in two-weapon fighting.'
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
	description: `
		You have a limited well of stamina to protect yourself. 
		On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.
		Once used, must finish a short or long rest before using again.
	`,
	source: 'fighter',
	effects: [{ target: 'features', action: 'add', value: 'Second Wind' }]
};

const actionSurgePrompt: FeaturePrompt = {
	name: 'Action Surge',
	id: 'fighter_action_surge_01',
	description: `
		Starting at 2nd level, you can take one additional action on your turn. 
		Once used, must finish a short or long rest before using again.
	`,
	source: 'fighter',
	effects: [{ target: 'features', action: 'add', value: 'Action Surge' }]
};

const martialArchetypePrompt: FeaturePrompt = {
	name: 'Martial Archetype',
	id: 'fighter_archetype_01',
	description: 'Choose a Martial Archetype at 3rd level.',
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
						description: 'Weapon attacks score a critical hit on 19 or 20.',
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
						description: 'Gain maneuvers and superiority dice to enhance attacks.',
						source: 'fighter.battle_master',
						effects: [{ target: 'features', action: 'add', value: 'Combat Superiority' }]
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
						description: 'Bond with weapons to summon them to your hand.',
						source: 'fighter.eldritch_knight',
						effects: [{ target: 'features', action: 'add', value: 'Weapon Bond' }]
					},
					{
						name: 'Spellcasting',
						id: 'fighter_eldritch_spellcasting_01',
						description: 'Learn a limited number of wizard spells.',
						source: 'fighter.eldritch_knight',
						effects: [{ target: 'features', action: 'add', value: 'Eldritch Knight Spellcasting' }]
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
								description: 'Choose a one-handed martial weapon',
								type: 'weapon-list',
								category: 'martial-melee',
								options: martialMeleeWeapons.filter(w => !twoHandedWeapons.includes(w)),
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
								description: 'Choose your first martial weapon',
								type: 'weapon-list',
								category: 'martial-melee',
								options: martialMeleeWeapons,
								count: 1
							},
							{
								name: 'Secondary Martial Weapon',
								description: 'Choose your second martial weapon',
								type: 'weapon-list',
								category: 'martial-melee',
								options: martialMeleeWeapons,
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
