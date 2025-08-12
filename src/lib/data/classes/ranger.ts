import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
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
};

const fightingStylePrompt: FeaturePrompt = {
	name: 'Fighting Style',
	description: 'Choose a fighting style to suit your combat approach.',
	featureOptions: {
		placeholderText: "-Choose a Fighting Style-",
		options: [
			{
				name: 'Archery',
				optionDescription: 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
			},
			{
				name: 'Defense',
				optionDescription: 'While you are wearing armor, you gain a +1 bonus to AC.',
			},
			{
				name: 'Dueling',
				optionDescription: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
			},
			{
				name: 'Two-Weapon Fighting',
				optionDescription: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
			},
		],
		numPicks: 1,
	},
	source: "ranger",
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	description: `
		You have learned to cast ranger spells using Wisdom as your spellcasting ability. 
		At level 3, you know three 1st-level spells and have two 1st-level spell slots.
	`,
	source: "ranger"
};

const rangerArchetypePrompt: FeaturePrompt = {
	name: 'Ranger Archetype',
	description: 'Choose a Ranger Archetype at 3rd level.',
	featureOptions: {
		placeholderText: "-Choose an Archetype-",
		options: [
			{
				name: 'Hunter',
				optionDescription: `
					You focus on the art of hunting and gain abilities that improve your combat effectiveness.
				`,
				nestedPrompts: [
					{
                        name: 'Hunter’s Prey',
                        description: `Choose one of the following options:`,
                        featureOptions: {
                            placeholderText: "-Choose an Option-",
                            options: [
                                {
                                    name: 'Colossus Slayer',
                                    optionDescription: 'Extra 1d8 damage once per turn to creatures below their max HP.',
                                },
                                {
                                    name: 'Giant Killer',
                                    optionDescription: 'When a Large or larger creature attacks you, you can use your reaction to attack it immediately.',
                                },
                                {
                                    name: 'Horde Breaker',
                                    optionDescription: 'Once per turn, you can make an additional attack against a different creature within 5 feet of the original target.',
                                },
                            ],
                            numPicks: 1,
                        },
                        source: 'ranger.hunter',
                    }
				]
			},
			{
				name: 'Beast Master',
				optionDescription: `
					You gain a beast companion to fight alongside you.
				`,
				nestedPrompts: [
					{
						name: 'Ranger’s Companion',
						description: `
							You gain a beast companion that accompanies you on adventures and battles.
						`,
						source: 'ranger.beast_master',
					}
				]
			}
		],
		numPicks: 1,
	},
	source: "ranger",
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
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
	],
};
