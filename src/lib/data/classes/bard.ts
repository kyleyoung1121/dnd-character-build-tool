import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'bard_skills_01',
	description: `
		Armor: Light armor <br>
		Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords <br>
		Saving Throws: Dexterity, Charisma <br>
		Skills: Choose any three
	`,
	featureOptions: {
		placeholderText: "Select 3 skills",
		options: [
			'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight',
			'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance',
			'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival',
		],
		numPicks: 3,
	},
	source: "bard.proficiencies",
	effects: [
		{
			target: "skills",
			action: "add",
			value: "{userChoice}"
		}
	]
};

const bardicInspirationPrompt: FeaturePrompt = {
	name: 'Bardic Inspiration',
	id: 'bard_feature_01',
	description: `
		You can inspire others through stirring words or music. 
		Use a bonus action to give one creature other than yourself within 60 feet an inspiration die (a d6). 
		This die can be added to ability checks, attack rolls, or saving throws.
		You can use this feature a number of times equal to your Charisma modifier (minimum of once), and regain all uses on a long rest.
	`,
	source: "bard",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Bardic Inspiration"
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	id: 'bard_feature_02',
	description: `
		You know two cantrips of your choice from the bard spell list. 
		You know four 1st-level spells of your choice.
		You can cast spells using Charisma as your spellcasting ability.
	`,
	source: "bard",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Spellcasting"
		}
	]
};

const jackOfAllTradesPrompt: FeaturePrompt = {
	name: 'Jack of All Trades',
	id: 'bard_feature_03',
	description: `
		Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn’t already include your proficiency bonus.
	`,
	source: "bard",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Jack of All Trades"
		}
	]
};

const songOfRestPrompt: FeaturePrompt = {
	name: 'Song of Rest',
	id: 'bard_feature_04',
	description: `
		Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. 
		If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.
	`,
	source: "bard",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Song of Rest"
		}
	]
};

const bardCollegePrompt: FeaturePrompt = {
	name: 'Bard College',
	id: 'bard_subclass_01',
	description: 'Choose a Bard College at 3rd level.',
	featureOptions: {
		placeholderText: "-Choose a College-",
		options: [
			{
				name: "College of Lore",
				optionDescription: `
					You learn additional magical secrets and gain Cutting Words to hinder foes.
				`,
				nestedPrompts: [
					{
						name: 'Bonus Proficiencies',
						id: 'bard_lore_skills_01',
						description: 'You gain proficiency with three skills of your choice.',
						featureOptions: {
							placeholderText: "Select three skills",
							options: [
								'Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight',
								'Intimidation','Investigation','Medicine','Nature','Perception','Performance',
								'Persuasion','Religion','Sleight of Hand','Stealth','Survival',
							],
							numPicks: 3,
						},
						source: 'bard.college_of_lore',
						effects: [
							{
								target: "skills",
								action: "add",
								value: "{userChoice}"
							}
						]
					},
					{
						name: 'Cutting Words',
						id: 'bard_lore_feature_01',
						description: `
							When a creature you can see within 60 feet makes an attack roll, ability check, or damage roll, 
							you can use your reaction to expend one use of Bardic Inspiration, subtracting the roll from the creature’s roll.
						`,
						source: 'bard.college_of_lore',
						effects: [
							{
								target: "features",
								action: "add",
								value: "Cutting Words"
							}
						]
					}
				]
			},
			{
				name: "College of Valor",
				optionDescription: `
					You gain proficiency with medium armor, shields, and martial weapons. 
					You can inspire others to fight with valor.
				`,
				nestedPrompts: [
					{
						name: 'Bonus Proficiencies',
						id: 'bard_valor_proficiencies_01',
						description: 'You gain proficiency with medium armor, shields, and martial weapons.',
						source: 'bard.college_of_valor',
						effects: [
							{
								target: "proficiencies",
								action: "add",
								value: "Medium Armor"
							},
							{
								target: "proficiencies",
								action: "add",
								value: "Shields"
							},
							{
								target: "proficiencies",
								action: "add",
								value: "Martial Weapons"
							}
						]
					},

					{
						name: 'Combat Inspiration',
						id: 'bard_valor_feature_01',
						description: `
							Your Bardic Inspiration can be used to add to damage rolls or AC as well as ability checks, attack rolls, and saving throws.
						`,
						source: 'bard.college_of_valor',
						effects: [
							{
								target: "features",
								action: "add",
								value: "Combat Inspiration"
							}
						]
					}
				]
			}
		],
		numPicks: 1,
	},
	source: "bard",
	effects: [
		{
			target: "subclass",
			action: "set",
			value: "{userChoice}"
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	bardicInspirationPrompt,
	spellcastingPrompt,
	jackOfAllTradesPrompt,
	songOfRestPrompt,
];

export const bard: ClassData = {
	name: 'Bard',
	image: base + '/class_icons/bard.jpg',
	description: 'Inspiring leaders who weave magic through words and music.',
	hitDie: 'd8',
	primaryAbility: 'Charisma',
	saves: ['Dexterity', 'Charisma'],
	armorProficiencies: ['Light Armor'],
	weaponProficiencies: [
		'Simple Weapons',
		'Hand Crossbows',
		'Longswords',
		'Rapiers',
		'Shortswords',
	],
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		bardCollegePrompt,
	],
};
