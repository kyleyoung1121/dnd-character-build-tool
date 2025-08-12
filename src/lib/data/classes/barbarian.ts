import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	description: `
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Constitution <br>
		Skills: Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival
	`,
	featureOptions: {
		placeholderText: "",
		options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
		numPicks: 2,
	},
	source: "barbarian.proficiencies",
};

const primalPathPrompt: FeaturePrompt = {
	name: 'Primal Path',
	description: 'Choose a path that shapes the nature of your rage.',
	featureOptions: {
		placeholderText: "-Choose an Option-",
		options: [
			{
				name: "Berserker",
				optionDescription: ' \
					For some barbarians, rage is a means to an end — that end being violence. \
					The Path of the Berserker is a path of untrammeled fury, slick with blood. \
					As you enter the berserker’s rage, you thrill in the chaos of battle, heedless of your own health or well-being. \
				',
				nestedPrompts: [
					{
						name: "Frenzy",
						description: ' \
							Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. \
							If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. \
							When your rage ends, you suffer one level of exhaustion. \
						',
						source: "barbarian.berserker"
					}
				]
			}, {
				name: "Totem Warrior",
				optionDescription: ' \
					The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration. \
					In battle, your totem spirit fills you with supernatural might, adding magical fuel to your barbarian rage. \
				',
				nestedPrompts: [
					{
						name: "Spirit Seeker",
						description: ' \
							Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. \
							You gain the ability to cast the beast sense and speak with animals spells, \
							but only as rituals, as described in the Spellcasting section. \
						',
						source: "barbarian.totem_warrior"
					}, {
						name: "Totem Spirit",
						description: ' \
							Choose a totem spirit and gain its feature. \
							At 3rd level when you adopt this path, you gain the ability to cast the beast sense and speak with animals spells, \
							but only as rituals, as described in the Spellcasting section. \
						',
						source: "barbarian.totem_warrior"
					}

				]
			}
		],
		numPicks: 1,
	},
	source: "barbarian",
};

const classFeaturesPrompt: FeaturePrompt[] = [
	{
		name: "Rage",
		description: 'In battle, you fight with primal ferocity. You can enter a rage as a bonus action...',
		source: "barbarian"
	}, {
		name: 'Unarmored Defense',
		description: 'While not wearing armor, your AC equals 10 + Dex modifier + Con modifier.',
		source: "barbarian"
	},
	{
		name: 'Reckless Attack',
		description: 'You can throw aside all concern for defense to attack with fierce desperation.',
		source: "barbarian"
	},
	{
		name: 'Danger Sense',
		description: 'You have advantage on Dexterity saving throws against effects you can see.',
		source: "barbarian"
	},
]

export const barbarian: ClassData = {
	name: 'Barbarian',
	image: base + '/class_icons/barbarian.jpg',
	description: 'Frenzied warriors fueled by primal rage.',
	hitDie: 'd12',
	primaryAbility: 'Strength',
	saves: ['Strength', 'Constitution'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		primalPathPrompt,
	]

};
