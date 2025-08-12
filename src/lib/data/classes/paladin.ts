import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	description: `
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Athletics, Insight, Intimidation, Medicine, Persuasion, and Religion
	`,
	featureOptions: {
		placeholderText: "Select skills",
		options: [
			'Athletics',
			'Insight',
			'Intimidation',
			'Medicine',
			'Persuasion',
			'Religion',
		],
		numPicks: 2,
	},
	source: "paladin.proficiencies",
};

const divineSensePrompt: FeaturePrompt = {
	name: 'Divine Sense',
	description: `
		As an action, you can open your awareness to detect good and evil until the start of your next turn. 
		You can use this feature a number of times equal to 1 + your Charisma modifier per long rest.
	`,
	source: "paladin"
};

const layOnHandsPrompt: FeaturePrompt = {
	name: 'Lay on Hands',
	description: `
		You have a pool of healing power that replenishes when you take a long rest. 
		With that pool, you can restore a total number of hit points equal to your Paladin level × 5.
		As an action, you can touch a creature to restore any number of hit points remaining in the pool.
	`,
	source: "paladin"
};

const fightingStylePrompt: FeaturePrompt = {
	name: 'Fighting Style',
	description: 'Choose a fighting style to enhance your combat ability.',
	featureOptions: {
		placeholderText: "-Choose a Fighting Style-",
		options: [
			{
				name: 'Defense',
				optionDescription: 'While you are wearing armor, you gain a +1 bonus to AC.',
			},
			{
				name: 'Dueling',
				optionDescription: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
			},
			{
				name: 'Great Weapon Fighting',
				optionDescription: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll.',
			},
			{
				name: 'Protection',
				optionDescription: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll.',
			},
		],
		numPicks: 1,
	},
	source: "paladin",
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	description: `
		You can cast prepared paladin spells using Charisma as your spellcasting ability. 
		At level 3, you gain access to 1st-level paladin spells.
	`,
	source: "paladin"
};

const divineSmitePrompt: FeaturePrompt = {
	name: 'Divine Smite',
	description: `
		When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage in addition to the weapon's damage.
		The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st.
	`,
	source: "paladin"
};

const sacredOathPrompt: FeaturePrompt = {
	name: 'Sacred Oath',
	description: 'Choose a Sacred Oath at 3rd level.',
	featureOptions: {
		placeholderText: "-Choose an Oath-",
		options: [
			{
				name: 'Oath of Devotion',
				optionDescription: `
					You strive to be a paragon of virtue and justice.
				`,
				nestedPrompts: [
					{
						name: 'Oath Spells',
						description: 'You gain oath-specific spells at certain levels (not applicable at level 3).',
						source: 'paladin.oath_devotion',
					},
					{
						name: 'Sacred Weapon',
						description: 'You can add your Charisma modifier to attack rolls with a weapon.',
						source: 'paladin.oath_devotion',
					},
					{
						name: 'Turn the Unholy',
						description: 'As an action, you can censure fiends and undead.',
						source: 'paladin.oath_devotion',
					},
				]
			},
			{
				name: 'Oath of the Ancients',
				optionDescription: `
					You fight for the light and life in the world.
				`,
				nestedPrompts: [
					{
						name: 'Oath Spells',
						description: 'You gain oath-specific spells at certain levels (not applicable at level 3).',
						source: 'paladin.oath_ancients',
					},
					{
						name: 'Nature’s Wrath',
						description: 'You can invoke spectral guardians to hinder foes.',
						source: 'paladin.oath_ancients',
					},
					{
						name: 'Turn the Faithless',
						description: 'As an action, you can censure fey and fiends.',
						source: 'paladin.oath_ancients',
					},
				]
			}
		],
		numPicks: 1,
	},
	source: "paladin",
};

const classFeaturesPrompt: FeaturePrompt[] = [
	divineSensePrompt,
	layOnHandsPrompt,
	fightingStylePrompt,
	spellcastingPrompt,
	divineSmitePrompt,
];

export const paladin: ClassData = {
	name: 'Paladin',
	image: base + '/class_icons/paladin.jpg',
	description: 'Holy warriors bound by sacred oaths, wielding divine power to protect and smite.',
	hitDie: 'd10',
	primaryAbility: 'Strength & Charisma',
	saves: ['Wisdom', 'Charisma'],
	armorProficiencies: ['All Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		sacredOathPrompt,
	],
};
