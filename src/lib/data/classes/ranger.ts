import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const proficienciesPrompt: FeaturePrompt = {
	id: 'ranger_proficiencies_01',
	name: 'Skill Proficiencies',
	description: `
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Dexterity <br>
		Skills: Choose three from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, and Survival
	`,
	featureOptions: {
		placeholderText: "Select skills",
		options: [
			'Animal Handling',
			'Athletics',
			'Insight',
			'Investigation',
			'Nature',
			'Perception',
			'Stealth',
			'Survival',
		],
		numPicks: 3,
	},
	source: "ranger.proficiencies",
	effects: [
		{
			target: "skills",
			action: "add",
			value: "{userChoice}"
		}
	]
};

const fightingStylePrompt: FeaturePrompt = {
	id: 'ranger_fighting_style_01',
	name: 'Fighting Style',
	description: 'Choose a fighting style to suit your combat approach.',
	featureOptions: {
		placeholderText: "-Choose a Fighting Style-",
		options: [
			'Archery',
			'Defense',
			'Dueling',
			'Two-Weapon Fighting'
		],
		numPicks: 1
	},
	source: "ranger",
	effects: [
		{
			target: "features",
			action: "add",
			value: "{userChoice} Fighting Style"
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	id: 'ranger_spellcasting_01',
	name: 'Spellcasting',
	description: `
		You have learned to cast ranger spells using Wisdom as your spellcasting ability. 
		At level 3, you know three 1st-level spells and have two 1st-level spell slots.
	`,
	source: "ranger",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Spellcasting"
		}
	]
};

const rangerArchetypePrompt: FeaturePrompt = {
	id: 'ranger_archetype_01',
	name: 'Ranger Archetype',
	description: 'Choose a Ranger Archetype at 3rd level.',
	featureOptions: {
		placeholderText: "-Choose an Archetype-",
		options: [
			{
				name: 'Hunter',
				optionDescription: `You focus on the art of hunting and gain abilities that improve your combat effectiveness.`,
				nestedPrompts: [
					{
						id: 'ranger_hunter_prey_01',
						name: 'Hunter’s Prey',
						description: `Choose one of the following options:`,
						featureOptions: {
							placeholderText: "-Choose an Option-",
							options: [
								'Colossus Slayer',
								'Giant Killer',
								'Horde Breaker'
							],
							numPicks: 1
						},
						source: 'ranger.hunter',
						effects: [
							{
								target: "features",
								action: "add",
								value: "{userChoice}"
							}
						]
					}
				]
			},
			{
				name: 'Beast Master',
				optionDescription: `You gain a beast companion to fight alongside you.`,
				nestedPrompts: [
					{
						id: 'ranger_companion_01',
						name: 'Ranger’s Companion',
						description: `You gain a beast companion that accompanies you on adventures and battles.`,
						source: 'ranger.beast_master',
						effects: [
							{
								target: "features",
								action: "add",
								value: "Ranger’s Companion"
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: "ranger",
	effects: [
		{
			target: "subclass",
			action: "set",
			value: "{userChoice}"
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	fightingStylePrompt,
	spellcastingPrompt,
	rangerArchetypePrompt,
];

export const ranger: ClassData = {
	name: 'Ranger',
	image: base + '/class_icons/ranger.jpg',
	description: 'Skilled hunters and trackers, masters of nature and survival.',
	hitDie: 'd10',
	primaryAbility: 'Dexterity & Wisdom',
	saves: ['Strength', 'Dexterity'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
	startingEquipment: {
		fixed: ['Explorer\'s pack'],
		choices: []
	},
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
	],
};
