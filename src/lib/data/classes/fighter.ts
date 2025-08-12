import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	description: `
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Constitution <br>
		Skills: Choose two from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival
	`,
	featureOptions: {
		placeholderText: "Select two skills",
		options: [
			'Acrobatics',
			'Animal Handling',
			'Athletics',
			'History',
			'Insight',
			'Intimidation',
			'Perception',
			'Survival',
		],
		numPicks: 2,
	},
	source: "fighter.proficiencies",
};

const fightingStylePrompt: FeaturePrompt = {
	name: 'Fighting Style',
	description: 'Choose a fighting style that suits your combat approach.',
	featureOptions: {
		placeholderText: "-Choose a Fighting Style-",
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
				optionDescription: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls.'
			},
			{
				name: 'Great Weapon Fighting',
				optionDescription: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon you are wielding with two hands, you can reroll the die.'
			},
			{
				name: 'Protection',
				optionDescription: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll.'
			},
			{
				name: 'Two-Weapon Fighting',
				optionDescription: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.'
			},
		],
		numPicks: 1,
	},
	source: "fighter"
};


const secondWindPrompt: FeaturePrompt = {
	name: 'Second Wind',
	description: `
		You have a limited well of stamina that you can draw on to protect yourself from harm. 
		On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. 
		Once you use this feature, you must finish a short or long rest before you can use it again.
	`,
	source: "fighter"
};

const actionSurgePrompt: FeaturePrompt = {
	name: 'Action Surge',
	description: `
		Starting at 2nd level, you can push yourself beyond your normal limits for a moment. 
		On your turn, you can take one additional action on top of your regular action and a possible bonus action. 
		Once you use this feature, you must finish a short or long rest before you can use it again.
	`,
	source: "fighter"
};

const martialArchetypePrompt: FeaturePrompt = {
	name: 'Martial Archetype',
	description: 'Choose a Martial Archetype at 3rd level.',
	featureOptions: {
		placeholderText: "-Choose an Archetype-",
		options: [
			{
				name: "Champion",
				optionDescription: `
					Focused on raw physical power and improving critical hits.
				`,
				nestedPrompts: [
					{
						name: 'Improved Critical',
						description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.',
						source: "fighter.champion",
					}
				],
			},
			{
				name: "Battle Master",
				optionDescription: `
					A master of martial techniques, using maneuvers to control the battlefield.
				`,
				nestedPrompts: [
					{
						name: 'Combat Superiority',
						description: `
							You gain a set of maneuvers and superiority dice to enhance your attacks.
						`,
						source: "fighter.battle_master",
					},
				],
			},
			{
				name: "Eldritch Knight",
				optionDescription: `
					You learn to cast spells and blend magic with combat.
				`,
				nestedPrompts: [
					{
						name: 'Weapon Bond',
						description: `
							You can bond with weapons to summon them to your hand.
						`,
						source: "fighter.eldritch_knight",
					},
					{
						name: 'Spellcasting',
						description: `
							You learn a limited number of wizard spells.
						`,
						source: "fighter.eldritch_knight",
					},
				],
			}
		],
		numPicks: 1,
	},
	source: "fighter",
};

const classFeaturesPrompt: FeaturePrompt[] = [
	fightingStylePrompt,
	secondWindPrompt,
	actionSurgePrompt,
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
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		martialArchetypePrompt,
	],
};
