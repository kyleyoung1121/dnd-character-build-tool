import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	description: `
		Armor: Light armor <br>
		Weapons: Simple weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Arcana, Deception, History, Intimidation, Investigation, Nature, and Religion
	`,
	featureOptions: {
		placeholderText: "Select skills",
		options: [
			'Arcana',
			'Deception',
			'History',
			'Intimidation',
			'Investigation',
			'Nature',
			'Religion',
		],
		numPicks: 2,
	},
	source: 'warlock.proficiencies',
};

const otherworldlyPatronPrompt: FeaturePrompt = {
	name: 'Otherworldly Patron',
	description: 'Choose your Otherworldly Patron at 1st level.',
	featureOptions: {
		placeholderText: "-Choose a Patron-",
		options: [
			{
				name: 'The Archfey',
				optionDescription: `
					Your patron is a powerful being from the Feywild who grants you enchantment and illusion powers.
				`,
				nestedPrompts: [
					{
						name: 'Fey Presence',
						description: `
							As an action, you can cause creatures in a 10-foot cube to make a Wisdom saving throw or be charmed or frightened until the end of your next turn.
							You can use this feature once per short or long rest.
						`,
						source: 'warlock.archfey',
					},
				],
			},
			{
				name: 'The Fiend',
				optionDescription: `
					Your patron is a fiendish entity who grants you destructive fire and survival powers.
				`,
				nestedPrompts: [
					{
						name: 'Dark One’s Blessing',
						description: `
							When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level.
						`,
						source: 'warlock.fiend',
					},
				],
			},
			{
				name: 'The Great Old One',
				optionDescription: `
					Your patron is a mysterious entity from beyond reality, granting telepathic and madness-related powers.
				`,
				nestedPrompts: [
					{
						name: 'Awakened Mind',
						description: `
							You can communicate telepathically with any creature you can see within 30 feet.
						`,
						source: 'warlock.great_old_one',
					},
				],
			},
		],
		numPicks: 1,
	},
	source: 'warlock',
};

const pactMagicPrompt: FeaturePrompt = {
	name: 'Pact Magic',
	description: `
		You know two cantrips of your choice from the warlock spell list.
		You know two 1st-level spells.
		You regain spell slots on a short or long rest.
		You use Charisma as your spellcasting ability.
	`,
	source: 'warlock',
};

const eldritchInvocationsPrompt: FeaturePrompt = {
	name: 'Eldritch Invocations',
	description: `
		At 2nd level, you gain two eldritch invocations of your choice.
		These grant you various magical abilities.
	`,
	source: 'warlock',
	featureOptions: {
		placeholderText: "Select two Invocations",
		options: [
			'Agonizing Blast',
			'Armor of Shadows',
			'Beast Speech',
			'Beguiling Influence',
			'Devil’s Sight',
			'Eldritch Sight',
			'Fiendish Vigor',
			'Mask of Many Faces',
		],
		numPicks: 2,
	},
};

const classFeaturesPrompt: FeaturePrompt[] = [
	pactMagicPrompt,
	eldritchInvocationsPrompt,
];

export const warlock: ClassData = {
	name: 'Warlock',
	image: base + '/class_icons/warlock.jpg',
	description: 'A wielder of magic granted by a pact with an otherworldly being.',
	hitDie: 'd8',
	primaryAbility: 'Charisma',
	saves: ['Wisdom', 'Charisma'],
	armorProficiencies: ['Light Armor'],
	weaponProficiencies: ['Simple Weapons'],
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		otherworldlyPatronPrompt,
	],
};
