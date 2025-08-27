import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const proficienciesPrompt: FeaturePrompt = {
	id: 'rogue_proficiencies_01',
	name: 'Skill Proficiencies',
	description: `
		Armor: Light armor <br>
		Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords <br>
		Saving Throws: Dexterity, Intelligence <br>
		Skills: Choose four from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight of Hand, Stealth
	`,
	featureOptions: {
		placeholderText: 'Select skills',
		options: [
			'Acrobatics',
			'Athletics',
			'Deception',
			'Insight',
			'Intimidation',
			'Investigation',
			'Perception',
			'Performance',
			'Persuasion',
			'Sleight of Hand',
			'Stealth'
		],
		numPicks: 4
	},
	source: 'rogue.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const sneakAttackPrompt: FeaturePrompt = {
	id: 'rogue_sneak_attack_01',
	name: 'Sneak Attack',
	description: `
		Beginning at 1st level, you know how to strike subtly and exploit a foe’s distraction. 
		Once per turn, you can deal an extra 2d6 damage to one creature you hit with an attack if you have advantage on the attack roll. 
		The attack must use a finesse or a ranged weapon.
	`,
	source: 'rogue',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Sneak Attack'
		}
	]
};

const cunningActionPrompt: FeaturePrompt = {
	id: 'rogue_cunning_action_01',
	name: 'Cunning Action',
	description: `
		Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. 
		You can take a bonus action on each of your turns in combat to Dash, Disengage, or Hide.
	`,
	source: 'rogue',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Cunning Action'
		}
	]
};

const rogueArchetypePrompt: FeaturePrompt = {
	id: 'rogue_archetype_01',
	name: 'Roguish Archetype',
	description: 'Choose a Roguish Archetype at 3rd level.',
	featureOptions: {
		placeholderText: '-Choose an Archetype-',
		options: [
			{
				name: 'Thief',
				optionDescription: `Fast hands and second-story work. You gain the ability to use the Use Magic Device feature and climb faster.`,
				nestedPrompts: [
					{
						id: 'rogue_thief_fast_hands_01',
						name: 'Fast Hands',
						description: `You can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves’ tools to disarm a trap or open a lock, or take the Use Object action.`,
						source: 'rogue.thief',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Fast Hands'
							}
						]
					},
					{
						id: 'rogue_thief_second_story_01',
						name: 'Second-Story Work',
						description: `When you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier. 
						In addition, climbing no longer costs you extra movement.`,
						source: 'rogue.thief',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Second-Story Work'
							}
						]
					}
				]
			},
			{
				name: 'Assassin',
				optionDescription: `You are an expert at infiltration, disguise, and dealing deadly strikes.`,
				nestedPrompts: [
					{
						id: 'rogue_assassin_assassinate_01',
						name: 'Assassinate',
						description: `Starting at 3rd level, you have advantage on attack rolls against any creature that hasn’t taken a turn in the combat yet. 
						In addition, any hit you score against a creature that is surprised is a critical hit.`,
						source: 'rogue.assassin',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Assassinate'
							}
						]
					}
				]
			},
			{
				name: 'Arcane Trickster',
				optionDescription: `You gain limited spellcasting and the ability to use magic to enhance your trickery.`,
				nestedPrompts: [
					{
						id: 'rogue_arcane_trickster_spellcasting_01',
						name: 'Spellcasting',
						description: `You know three cantrips and three 1st-level spells from the wizard spell list, focusing on enchantment and illusion spells.`,
						source: 'rogue.arcane_trickster',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Arcane Trickster Spellcasting'
							}
						]
					},
					{
						id: 'rogue_arcane_trickster_mage_hand_01',
						name: 'Mage Hand Legerdemain',
						description: `When you cast Mage Hand, the spectral hand is invisible, and you can use it to pick locks and pockets, and perform other tasks.`,
						source: 'rogue.arcane_trickster',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Mage Hand Legerdemain'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'rogue',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [sneakAttackPrompt, cunningActionPrompt];

export const rogue: ClassData = {
	name: 'Rogue',
	image: base + '/class_icons/rogue.jpg',
	description: 'Sneaky and dexterous masters of stealth and trickery.',
	hitDie: 'd8',
	primaryAbility: 'Dexterity',
	saves: ['Dexterity', 'Intelligence'],
	armorProficiencies: ['Light Armor'],
	weaponProficiencies: ['Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
	startingEquipment: {
		fixed: ["Explorer's pack"],
		choices: []
	},
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt, rogueArchetypePrompt]
};
