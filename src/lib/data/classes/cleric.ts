import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'cleric_skills_01',
	description: `
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from History, Insight, Medicine, Persuasion, Religion
	`,
	featureOptions: {
		placeholderText: "Select two skills",
		options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
		numPicks: 2,
	},
	source: "cleric.proficiencies",
	effects: [
		{
			target: "skills",
			action: "add",
			value: "{userChoice}"
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	id: 'cleric_spellcasting_01',
	description: `
		You can prepare and cast spells using Wisdom as your spellcasting ability. 
		You know three cantrips and have prepared a number of spells equal to your Wisdom modifier + cleric level.
	`,
	source: "cleric",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Spellcasting"
		}
	]
};

const channelDivinityPrompt: FeaturePrompt = {
	name: 'Channel Divinity',
	id: 'cleric_channel_divinity_01',
	description: `
		Starting at 2nd level, you can use Channel Divinity to fuel magical effects. 
		You have one use per short or long rest.
	`,
	source: "cleric",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Channel Divinity"
		}
	]
};

const divineDomainPrompt: FeaturePrompt = {
	name: 'Divine Domain',
	id: 'cleric_divine_domain_01',
	description: 'Choose a Divine Domain at 1st level. Your choice grants domain features at 1st and 2nd level.',
	featureOptions: {
		placeholderText: "-Choose a Domain-",
		options: [
			{
				name: "Life Domain",
				optionDescription: `The Life Domain emphasizes healing and protection.`,
				nestedPrompts: [
					{
						name: "Bonus Proficiencies",
						id: "cleric_life_armor_01",
						description: "You gain proficiency with heavy armor.",
						source: "cleric.life_domain",
						effects: [
							{ target: "proficiencies", action: "add", value: "Heavy Armor" }
						]
					},
					{
						name: "Disciple of Life",
						id: "cleric_life_healing_01",
						description: `Your healing spells are more effective, adding extra hit points.`,
						source: "cleric.life_domain",
						effects: [
							{ target: "features", action: "add", value: "Disciple of Life" }
						]
					}
				]
			},
			{
				name: "Light Domain",
				optionDescription: `The Light Domain harnesses the power of fire and radiance.`,
				nestedPrompts: [
					{
						name: "Bonus Cantrip",
						id: "cleric_light_cantrip_01",
						description: "You learn the Light cantrip.",
						source: "cleric.light_domain",
						effects: [
							{ target: "spells", action: "add", value: "Light" }
						]
					},
					{
						name: "Warding Flare",
						id: "cleric_light_flare_01",
						description: `You can impose disadvantage on an attacker as a reaction.`,
						source: "cleric.light_domain",
						effects: [
							{ target: "features", action: "add", value: "Warding Flare" }
						]
					}
				]
			},
			{
				name: "Trickery Domain",
				optionDescription: `The Trickery Domain focuses on deception and stealth.`,
				nestedPrompts: [
					{
						name: "Bonus Proficiencies",
						id: "cleric_trickery_skill_01",
						description: "You gain proficiency with the Stealth skill.",
						source: "cleric.trickery_domain",
						effects: [
							{ target: "skills", action: "add", value: "Stealth" }
						]
					},
					{
						name: "Blessing of the Trickster",
						id: "cleric_trickery_feature_01",
						description: `You can grant advantage on Stealth checks to an ally.`,
						source: "cleric.trickery_domain",
						effects: [
							{ target: "features", action: "add", value: "Blessing of the Trickster" }
						]
					}
				]
			}
		],
		numPicks: 1,
	},
	source: "cleric",
	effects: [
		{
			target: "subclass",
			action: "set",
			value: "{userChoice}"
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	spellcastingPrompt,
	channelDivinityPrompt,
];

export const cleric: ClassData = {
	name: 'Cleric',
	image: base + '/class_icons/cleric.jpg',
	description: 'Holy warriors who wield divine magic to heal, protect, and smite foes.',
	hitDie: 'd8',
	primaryAbility: 'Wisdom',
	saves: ['Wisdom', 'Charisma'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons'],
	startingEquipment: {
		fixed: ['Explorer\'s pack'],
		choices: []
	},
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		divineDomainPrompt,
	],
};
