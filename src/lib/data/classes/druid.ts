import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	description: `
		Armor: Light armor, medium armor (non-metal), shields (non-metal) <br>
		Weapons: Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, slings, spears <br>
		Saving Throws: Intelligence, Wisdom <br>
		Skills: Choose two from Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival
	`,
	featureOptions: {
		placeholderText: "Select two skills",
		options: [
			'Arcana',
			'Animal Handling',
			'Insight',
			'Medicine',
			'Nature',
			'Perception',
			'Religion',
			'Survival',
		],
		numPicks: 2,
	},
	source: "druid.proficiencies",
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	description: `
		You can prepare and cast spells using Wisdom as your spellcasting ability. 
		You know two cantrips and prepare a number of spells equal to your Wisdom modifier + druid level.
	`,
	source: "druid"
};

const wildShapePrompt: FeaturePrompt = {
	name: 'Wild Shape',
	description: `
		Starting at 2nd level, you can use your action to magically assume the shape of a beast you have seen before.
		You can use this feature twice per short or long rest.
	`,
	source: "druid"
};

const druidCirclePrompt: FeaturePrompt = {
	name: 'Druid Circle',
	description: 'Choose a Druid Circle at 2nd level.',
	featureOptions: {
		placeholderText: "-Choose a Circle-",
		options: [
			{
				name: "Circle of the Land",
				optionDescription: `
					Your magic draws on the energy of the land, granting you additional spells.
				`,
				nestedPrompts: [
					{
						name: "Bonus Cantrip",
						description: "You learn one additional druid cantrip.",
						source: "druid.circle_of_the_land",
					},
					{
						name: "Natural Recovery",
						description: `
							You can regain some expended spell slots during a short rest.
						`,
						source: "druid.circle_of_the_land",
					},
				],
			},
			{
				name: "Circle of the Moon",
				optionDescription: `
					You are a fierce shapeshifter, able to transform into more powerful beasts.
				`,
				nestedPrompts: [
					{
						name: "Combat Wild Shape",
						description: `
							You can use Wild Shape as a bonus action and transform into stronger creatures.
						`,
						source: "druid.circle_of_the_moon",
					},
					{
						name: "Circle Forms",
						description: `
							You can transform into beasts with a higher challenge rating than normal.
						`,
						source: "druid.circle_of_the_moon",
					},
				],
			},
		],
		numPicks: 1,
	},
	source: "druid",
};

const classFeaturesPrompt: FeaturePrompt[] = [
	spellcastingPrompt,
	wildShapePrompt,
];

export const druid: ClassData = {
	name: 'Druid',
	image: base + '/class_icons/druid.jpg',
	description: 'Masters of nature magic and shapeshifting, drawing power from the natural world.',
	hitDie: 'd8',
	primaryAbility: 'Wisdom',
	saves: ['Intelligence', 'Wisdom'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: [
		'Clubs',
		'Daggers',
		'Darts',
		'Javelins',
		'Maces',
		'Quarterstaffs',
		'Scimitars',
		'Slings',
		'Spears',
	],
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		druidCirclePrompt,
	],
};
