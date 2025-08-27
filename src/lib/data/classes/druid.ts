import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons } from '$lib/data/equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'druid_skills_01',
	description: `
		Armor: Light armor, medium armor (non-metal), shields (non-metal) <br>
		Weapons: Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, slings, spears <br>
		Saving Throws: Intelligence, Wisdom <br>
		Skills: Choose two from Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival
	`,
	featureOptions: {
		placeholderText: 'Select two skills',
		options: [
			'Arcana',
			'Animal Handling',
			'Insight',
			'Medicine',
			'Nature',
			'Perception',
			'Religion',
			'Survival'
		],
		numPicks: 2
	},
	source: 'druid.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	id: 'druid_spellcasting_01',
	description: `
		You can prepare and cast spells using Wisdom as your spellcasting ability. 
		You know two cantrips and prepare a number of spells equal to your Wisdom modifier + druid level.
	`,
	source: 'druid',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Spellcasting'
		}
	]
};

const wildShapePrompt: FeaturePrompt = {
	name: 'Wild Shape',
	id: 'druid_wild_shape_01',
	description: `
		Starting at 2nd level, you can use your action to magically assume the shape of a beast you have seen before.
		You can use this feature twice per short or long rest.
	`,
	source: 'druid',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Wild Shape'
		}
	]
};

const druidCirclePrompt: FeaturePrompt = {
	name: 'Druid Circle',
	id: 'druid_circle_01',
	description: 'Choose a Druid Circle at 2nd level.',
	featureOptions: {
		placeholderText: '-Choose a Circle-',
		options: [
			{
				name: 'Circle of the Land',
				optionDescription: `Your magic draws on the energy of the land, granting you additional spells.`,
				nestedPrompts: [
					{
						name: 'Bonus Cantrip',
						id: 'druid_land_cantrip_01',
						description: 'You learn one additional druid cantrip.',
						source: 'druid.circle_of_the_land',
						effects: [{ target: 'spells', action: 'add', value: 'User chooses one druid cantrip' }]
					},
					{
						name: 'Natural Recovery',
						id: 'druid_land_recovery_01',
						description: `
							You can regain some expended spell slots during a short rest.
						`,
						source: 'druid.circle_of_the_land',
						effects: [{ target: 'features', action: 'add', value: 'Natural Recovery' }]
					}
				]
			},
			{
				name: 'Circle of the Moon',
				optionDescription: `You are a fierce shapeshifter, able to transform into more powerful beasts.`,
				nestedPrompts: [
					{
						name: 'Combat Wild Shape',
						id: 'druid_moon_combat_shape_01',
						description: `
							You can use Wild Shape as a bonus action and transform into stronger creatures.
						`,
						source: 'druid.circle_of_the_moon',
						effects: [{ target: 'features', action: 'add', value: 'Combat Wild Shape' }]
					},
					{
						name: 'Circle Forms',
						id: 'druid_moon_circle_forms_01',
						description: `
							You can transform into beasts with a higher challenge rating than normal.
						`,
						source: 'druid.circle_of_the_moon',
						effects: [{ target: 'features', action: 'add', value: 'Circle Forms' }]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'druid',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [spellcastingPrompt, wildShapePrompt];

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
		'Spears'
	],
	startingEquipment: {
		fixed: ['Leather armor', "Explorer's pack"],
		choices: [
			{
				name: 'Primary Equipment',
				description: 'Choose your primary equipment',
				options: [
					{
						label: 'Wooden shield',
						items: ['Wooden shield']
					},
					{
						label: 'Simple weapon',
						items: [],
						subChoices: [
							{
								name: 'Simple Weapon',
								description: 'Choose a simple weapon',
								type: 'weapon-list',
								category: 'simple',
								options: simpleWeapons.map((w) => w.name),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Melee Weapon',
				description: 'Choose your melee weapon',
				options: [
					{
						label: 'Scimitar',
						items: ['Scimitar']
					},
					{
						label: 'Simple melee weapon',
						items: [],
						subChoices: [
							{
								name: 'Simple Melee Weapon',
								description: 'Choose a simple melee weapon',
								type: 'weapon-list',
								category: 'simple-melee',
								options: simpleWeapons.filter((w) => w.type === 'melee').map((w) => w.name),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice
		]
	},
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, druidCirclePrompt]
};
