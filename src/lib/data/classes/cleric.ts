import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
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
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	description: `
		You can prepare and cast spells using Wisdom as your spellcasting ability. 
		You know three cantrips and have prepared a number of spells equal to your Wisdom modifier + cleric level.
	`,
	source: "cleric"
};

const channelDivinityPrompt: FeaturePrompt = {
	name: 'Channel Divinity',
	description: `
		Starting at 2nd level, you can use Channel Divinity to fuel magical effects. 
		You have one use per short or long rest.
	`,
	source: "cleric"
};

const divineDomainPrompt: FeaturePrompt = {
	name: 'Divine Domain',
	description: 'Choose a Divine Domain at 1st level. Your choice grants domain features at 1st and 2nd level.',
	featureOptions: {
		placeholderText: "-Choose a Domain-",
		options: [
			{
				name: "Life Domain",
				optionDescription: `
					The Life Domain emphasizes healing and protection.
				`,
				nestedPrompts: [
					{
						name: "Bonus Proficiencies",
						description: "You gain proficiency with heavy armor.",
						source: "cleric.life_domain",
					},
					{
						name: "Disciple of Life",
						description: `
							Your healing spells are more effective, adding extra hit points.
						`,
						source: "cleric.life_domain",
					}
				],
			},
			{
				name: "Light Domain",
				optionDescription: `
					The Light Domain harnesses the power of fire and radiance.
				`,
				nestedPrompts: [
					{
						name: "Bonus Cantrip",
						description: "You learn the Light cantrip.",
						source: "cleric.light_domain",
					},
					{
						name: "Warding Flare",
						description: `
							You can impose disadvantage on an attacker as a reaction.
						`,
						source: "cleric.light_domain",
					}
				],
			},
			{
				name: "Trickery Domain",
				optionDescription: `
					The Trickery Domain focuses on deception and stealth.
				`,
				nestedPrompts: [
					{
						name: "Bonus Proficiencies",
						description: "You gain proficiency with the Stealth skill.",
						source: "cleric.trickery_domain",
					},
					{
						name: "Blessing of the Trickster",
						description: `
							You can grant advantage on Stealth checks to an ally.
						`,
						source: "cleric.trickery_domain",
					}
				],
			}
		],
		numPicks: 1,
	},
	source: "cleric",
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
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		divineDomainPrompt,
	],
};
