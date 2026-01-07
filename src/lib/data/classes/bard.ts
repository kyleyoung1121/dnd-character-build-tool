import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons, musicalInstruments } from '../equipment/weapons';

const skillProficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'bard_skills_01',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'Armor: Light armor'
			},
			{
				type: 'text',
				text: 'Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords'
			},
			{
				type: 'text',
				text: 'Saving Throws: Dexterity, Charisma'
			},
			{
				type: 'text',
				text: 'Skills: Choose any three'
			}
		]
	},
	featureOptions: {
		placeholderText: 'Select 3 skills',
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
			'Survival'
		],
		numPicks: 3
	},
	source: 'bard.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const musicalInstrumentProficienciesPrompt: FeaturePrompt = {
	name: 'Musical Instrument Proficiencies',
	id: 'bard_instruments_01',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'Choose three musical instruments of your choice.'
			}
		]
	},
	featureOptions: {
		placeholderText: 'Select 3 musical instruments',
		options: [
			'Bagpipes',
			'Drum',
			'Dulcimer',
			'Flute',
			'Lute',
			'Lyre',
			'Horn',
			'Pan flute',
			'Shawm',
			'Viol'
		],
		numPicks: 3
	},
	source: 'bard.instruments',
	effects: [
		{
			target: 'proficiencies',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const bardicInspirationPrompt: FeaturePrompt = {
	name: 'Bardic Inspiration',
	id: 'bard_feature_01',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'You can inspire others through stirring words or music. You use a bonus action to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.'
			},
			{
				type: 'text',
				text: 'Once within the next 10 minutes, the creature can roll the die, adding it to an ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die.'
			},
			{
				type: 'computed-replacement',

				whenAvailable: [
					{
						source: 'derived',
						formula: 'Math.max(1, CHA_MOD)'
					}
				],

				fallbackText:
					'You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.',

				replacementTemplate:
					'You can use this feature {value} times per long rest.',

				singularTemplate:
					'You can use this feature once per long rest.',
			}
		]
	},	

	source: 'bard',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Bardic Inspiration'
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	id: 'bard_feature_02',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. Your spells are part of your vast repertoire, magic that you can tune to different situations. You know 2 cantrips and 6 leveled spells.'
			}
		]
	},
	source: 'bard',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Spellcasting'
		}
	]
};

const jackOfAllTradesPrompt: FeaturePrompt = {
	name: 'Jack of All Trades',
	id: 'bard_feature_03',
	description: {
		blocks: [
			{
				type: 'text',
				text: "You can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus."
			}
		]
	},
	source: 'bard',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Jack of All Trades'
		}
	]
};

const songOfRestPrompt: FeaturePrompt = {
	name: 'Song of Rest',
	id: 'bard_feature_04',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'You can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.'
			}
		]
	},
	source: 'bard',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Song of Rest'
		}
	]
};

const expertisePrompt: FeaturePrompt = {
	name: 'Expertise',
	id: 'bard_feature_05',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.'
			}
		]
	},
	featureOptions: {
		placeholderText: 'Select 2 skills for expertise',
		dynamicOptionsGenerator: {
			type: 'proficient-skills-plus-tools',
			additionalOptions: [] // No additional options for Bard (unlike Rogue which gets Thieves' Tools)
		},
		numPicks: 2
	},
	source: 'bard.expertise',
	effects: [
		{
			target: 'expertise',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const bardCollegePrompt: FeaturePrompt = {
	name: 'Bard College',
	id: 'bard_subclass_01',
	description: {
		blocks: [
			{
				type: 'text',
				text: 'Choose a Bard College.'
			}
		]
	},
	featureOptions: {
		placeholderText: '-Choose a College-',
		numPicks: 1,
		options: [
			{
				name: 'College of Lore',
				optionDescription: `
					You learn additional magical secrets and gain Cutting Words to hinder foes.
				`,
				nestedPrompts: [
					{
						name: 'Bonus Proficiencies',
						id: 'bard_lore_skills_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: 'You gain proficiency with three skills of your choice.'
								}
							]
						},
						featureOptions: {
							placeholderText: 'Select three skills',
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
								'Survival'
							],
							numPicks: 3
						},
						source: 'bard.college.lore',
						effects: [
							{
								target: 'skills',
								action: 'add',
								value: '{userChoice}'
							}
						]
					},
					{
						name: 'Cutting Words',
						id: 'bard_lore_feature_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: "You learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature's roll."
								}
							]
						},
						source: 'bard.college.lore',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Cutting Words'
							}
						]
					}
				]
			},
			{
				name: 'College of Valor',
				optionDescription: `
					You gain proficiency with medium armor, shields, and martial weapons, and your bardic inspiration can be used in combat.
				`,
				nestedPrompts: [
					{
						name: 'Bonus Proficiencies',
						id: 'bard_valor_proficiencies_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: 'You gain proficiency with medium armor, shields, and martial weapons.'
								}
							]
						},
						source: 'bard.college.valor',
						effects: [
							{
								target: 'proficiencies',
								action: 'add',
								value: ['Medium Armor', 'Shields', 'Martial weapons']
							}
						]
					},
					{
						name: 'Combat Inspiration',
						id: 'bard_valor_feature_01',
						description: {
							blocks: [
								{
									type: 'text',
									text: 'A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, after seeing the roll but before knowing whether it hits or misses.'
								}
							]
						},
						source: 'bard.college.valor',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Combat Inspiration'
							}
						]
					}
				]
			}
		]
	},
	source: 'bard.college',
	effects: []
};

const classFeaturesPrompt = [
	bardicInspirationPrompt,
	spellcastingPrompt,
	jackOfAllTradesPrompt,
	songOfRestPrompt,
	expertisePrompt
];

export const bard: ClassData = {
	name: 'Bard',
	image: base + '/class_icons/bard.jpg',
	description: 'Inspiring leaders who weave magic through words and music.',
	hitDie: 'd8',
	primaryAbility: 'Charisma',
	saves: ['Dexterity', 'Charisma'],
	armorProficiencies: ['Light Armor'],
	weaponProficiencies: ['Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
	startingEquipment: {
		fixed: ['Leather armor', 'Dagger'],
		choices: [
			{
				name: 'Primary Weapon',
				description: 'Choose your main weapon',
				options: [
					{
						label: 'Rapier',
						items: ['Rapier']
					},
					{
						label: 'Longsword',
						items: ['Longsword']
					},
					{
						label: 'Simple weapon',
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
				name: 'Equipment Pack',
				description: 'Choose your adventure kit',
				options: [
					{
						label: "Diplomat's pack",
						items: [
							"Diplomat's pack (includes: chest, 2 cases for maps and scrolls, fine clothes, ink bottle, ink pen, lamp, 2 oil flasks, 5 sheets of paper, vial of perfume, sealing wax, soap)"
						]
					},
					{
						label: "Entertainer's pack",
						items: [
							"Entertainer's pack (includes: backpack, bedroll, 2 costumes, 5 candles, 5 days of rations, waterskin, disguise kit)"
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Musical Instrument',
				description: 'Choose your musical instrument',
				options: [
					{
						label: 'Lute',
						items: ['Lute']
					},
					{
						label: 'Other musical instrument',
						subChoices: [
							{
								name: 'Musical Instrument',
								description: 'Choose a musical instrument',
								type: 'simple-list',
								options: musicalInstruments.filter((i) => i !== 'Lute'),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice
		]
	},
	classFeatures: [
		skillProficienciesPrompt,
		musicalInstrumentProficienciesPrompt,
		...classFeaturesPrompt,
		bardCollegePrompt
	]
};
