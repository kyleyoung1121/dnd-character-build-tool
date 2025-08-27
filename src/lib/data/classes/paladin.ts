import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const proficienciesPrompt: FeaturePrompt = {
	id: 'paladin_proficiencies_01',
	name: 'Skill Proficiencies',
	description: `
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Athletics, Insight, Intimidation, Medicine, Persuasion, and Religion
	`,
	featureOptions: {
		placeholderText: 'Select skills',
		options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
		numPicks: 2
	},
	source: 'paladin.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const divineSensePrompt: FeaturePrompt = {
	id: 'paladin_divine_sense_01',
	name: 'Divine Sense',
	description: `
		As an action, you can open your awareness to detect good and evil until the start of your next turn. 
		You can use this feature a number of times equal to 1 + your Charisma modifier per long rest.
	`,
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Divine Sense'
		}
	]
};

const layOnHandsPrompt: FeaturePrompt = {
	id: 'paladin_lay_on_hands_01',
	name: 'Lay on Hands',
	description: `
		You have a pool of healing power that replenishes when you take a long rest. 
		With that pool, you can restore a total number of hit points equal to your Paladin level × 5.
		As an action, you can touch a creature to restore any number of hit points remaining in the pool.
	`,
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Lay on Hands'
		}
	]
};

const fightingStylePrompt: FeaturePrompt = {
	id: 'paladin_fighting_style_01',
	name: 'Fighting Style',
	description: 'Choose a fighting style to enhance your combat ability.',
	featureOptions: {
		placeholderText: '-Choose a Fighting Style-',
		options: ['Defense', 'Dueling', 'Great Weapon Fighting', 'Protection'],
		numPicks: 1
	},
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: '{userChoice} Fighting Style'
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	id: 'paladin_spellcasting_01',
	name: 'Spellcasting',
	description: `
		You can cast prepared paladin spells using Charisma as your spellcasting ability. 
		At level 3, you gain access to 1st-level paladin spells.
	`,
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Spellcasting'
		}
	]
};

const divineSmitePrompt: FeaturePrompt = {
	id: 'paladin_divine_smite_01',
	name: 'Divine Smite',
	description: `
		When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage in addition to the weapon's damage.
		The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st.
	`,
	source: 'paladin',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Divine Smite'
		}
	]
};

const sacredOathPrompt: FeaturePrompt = {
	id: 'paladin_sacred_oath_01',
	name: 'Sacred Oath',
	description: 'Choose a Sacred Oath at 3rd level.',
	featureOptions: {
		placeholderText: '-Choose an Oath-',
		options: [
			{
				name: 'Oath of Devotion',
				optionDescription: `You strive to be a paragon of virtue and justice.`,
				nestedPrompts: [
					{
						id: 'paladin_oath_devotion_01',
						name: 'Oath Spells',
						description:
							'You gain oath-specific spells at certain levels (not applicable at level 3).',
						source: 'paladin.oath_devotion',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Oath Spells'
							}
						]
					},
					{
						id: 'paladin_sacred_weapon_01',
						name: 'Sacred Weapon',
						description: 'You can add your Charisma modifier to attack rolls with a weapon.',
						source: 'paladin.oath_devotion',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Sacred Weapon'
							}
						]
					},
					{
						id: 'paladin_turn_unholy_01',
						name: 'Turn the Unholy',
						description: 'As an action, you can censure fiends and undead.',
						source: 'paladin.oath_devotion',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Turn the Unholy'
							}
						]
					}
				]
			},
			{
				name: 'Oath of the Ancients',
				optionDescription: `You fight for the light and life in the world.`,
				nestedPrompts: [
					{
						id: 'paladin_oath_ancients_01',
						name: 'Oath Spells',
						description:
							'You gain oath-specific spells at certain levels (not applicable at level 3).',
						source: 'paladin.oath_ancients',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Oath Spells'
							}
						]
					},
					{
						id: 'paladin_natures_wrath_01',
						name: 'Nature’s Wrath',
						description: 'You can invoke spectral guardians to hinder foes.',
						source: 'paladin.oath_ancients',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Nature’s Wrath'
							}
						]
					},
					{
						id: 'paladin_turn_faithless_01',
						name: 'Turn the Faithless',
						description: 'As an action, you can censure fey and fiends.',
						source: 'paladin.oath_ancients',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Turn the Faithless'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'paladin',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	divineSensePrompt,
	layOnHandsPrompt,
	fightingStylePrompt,
	spellcastingPrompt,
	divineSmitePrompt
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
	startingEquipment: {
		fixed: ["Explorer's pack"],
		choices: []
	},
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, sacredOathPrompt]
};
