import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	description: `
		Armor: Light armor <br>
		Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords <br>
		Saving Throws: Dexterity, Charisma <br>
		Skills: Choose any three
	`,
	featureOptions: {
		placeholderText: "Select skills",
		options: [
			'Acrobatics',
			'Animal Handling',
			'Arcana',
			'Athletics',
			'Deception',
			'History',
			'Insight',
			'Intimidation',
			'Investigation',
			'Medicine',
			'Nature',
			'Perception',
			'Performance',
			'Persuasion',
			'Religion',
			'Sleight of Hand',
			'Stealth',
			'Survival',
		],
		numPicks: 3,
	},
	source: "bard.proficiencies",
};

const bardicInspirationPrompt: FeaturePrompt = {
	name: 'Bardic Inspiration',
	description: `
		You can inspire others through stirring words or music. 
		Use a bonus action to give one creature other than yourself within 60 feet an inspiration die (a d6). 
		This die can be added to ability checks, attack rolls, or saving throws.
		You can use this feature a number of times equal to your Charisma modifier (minimum of once), and regain all uses on a long rest.
	`,
	source: "bard"
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	description: `
		You know two cantrips of your choice from the bard spell list. 
		You know four 1st-level spells of your choice.
		You can cast spells using Charisma as your spellcasting ability.
	`,
	source: "bard"
};

const jackOfAllTradesPrompt: FeaturePrompt = {
	name: 'Jack of All Trades',
	description: `
		Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn’t already include your proficiency bonus.
	`,
	source: "bard"
};

const songOfRestPrompt: FeaturePrompt = {
	name: 'Song of Rest',
	description: `
		Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. 
		If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.
	`,
	source: "bard"
};

const bardCollegePrompt: FeaturePrompt = {
	name: 'Bard College',
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
                        description: 'You gain proficiency with three skills of your choice.',
                        featureOptions: {
                            placeholderText: "Select three skills",
                            options: [
                                'Acrobatics',
                                'Animal Handling',
                                'Arcana',
                                'Athletics',
                                'Deception',
                                'History',
                                'Insight',
                                'Intimidation',
                                'Investigation',
                                'Medicine',
                                'Nature',
                                'Perception',
                                'Performance',
                                'Persuasion',
                                'Religion',
                                'Sleight of Hand',
                                'Stealth',
                                'Survival',
                            ],
                            numPicks: 3,
                        },
                        source: 'bard.college_of_lore',
                    },
					{
						name: 'Cutting Words',
						description: `
							When a creature you can see within 60 feet makes an attack roll, ability check, or damage roll, 
							you can use your reaction to expend one use of Bardic Inspiration, subtracting the roll from the creature’s roll.
						`,
						source: 'bard.college_of_lore',
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
						description: 'You gain proficiency with medium armor, shields, and martial weapons.',
						source: 'bard.college_of_valor',
					},
					{
						name: 'Combat Inspiration',
						description: `
							Your Bardic Inspiration can be used to add to damage rolls or AC as well as ability checks, attack rolls, and saving throws.
						`,
						source: 'bard.college_of_valor',
					}
				]
			}
		],
		numPicks: 1,
	},
	source: "bard",
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
