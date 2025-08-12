import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	description: `
		Weapons: Daggers, darts, slings, quarterstaffs, light crossbows <br>
		Saving Throws: Intelligence, Wisdom <br>
		Skills: Choose two from Arcana, History, Insight, Investigation, Medicine, and Religion
	`,
	featureOptions: {
		placeholderText: "Select skills",
		options: [
			'Arcana',
			'History',
			'Insight',
			'Investigation',
			'Medicine',
			'Religion',
		],
		numPicks: 2,
	},
	source: 'wizard.proficiencies',
};

const arcaneRecoveryPrompt: FeaturePrompt = {
	name: 'Arcane Recovery',
	description: `
		Once per day when you finish a short rest, you can recover expended spell slots with a combined level equal to or less than half your wizard level (rounded up).
	`,
	source: 'wizard',
};

const spellcastingPrompt: FeaturePrompt = {
	name: 'Spellcasting',
	description: `
		You know three cantrips from the wizard spell list.
		You know six 1st-level wizard spells.
		You prepare spells from your spellbook, using Intelligence as your spellcasting ability.
	`,
	source: 'wizard',
};

const arcaneTraditionPrompt: FeaturePrompt = {
	name: 'Arcane Tradition',
	description: 'Choose an Arcane Tradition at 2nd level.',
	featureOptions: {
		placeholderText: "-Choose an Arcane Tradition-",
		options: [
			{
				name: 'School of Evocation',
				optionDescription: `
					You focus on spells that manipulate energy and produce powerful effects.
					At 2nd level, you gain features that allow you to sculpt evocation spells.
				`,
				nestedPrompts: [
					{
						name: 'Evocation Savant',
						description: `
							The gold and time you must spend to copy an evocation spell into your spellbook is halved.
						`,
						source: 'wizard.evocation',
					},
					{
						name: 'Sculpt Spells',
						description: `
							When you cast an evocation spell that affects other creatures you can see, you can protect some of them from the spell’s full force.
						`,
						source: 'wizard.evocation',
					},
				],
			},
			{
				name: 'School of Illusion',
				optionDescription: `
					You specialize in illusion magic, enhancing your ability to deceive.
				`,
				nestedPrompts: [
					{
						name: 'Illusion Savant',
						description: `
							The gold and time you must spend to copy an illusion spell into your spellbook is halved.
						`,
						source: 'wizard.illusion',
					},
					{
						name: 'Improved Minor Illusion',
						description: `
							When you cast Minor Illusion, you can create both a sound and an image with a single casting.
						`,
						source: 'wizard.illusion',
					},
				],
			},
		],
		numPicks: 1,
	},
	source: 'wizard',
};

const classFeaturesPrompt: FeaturePrompt[] = [
	arcaneRecoveryPrompt,
	spellcastingPrompt,
	arcaneTraditionPrompt,
];

export const wizard: ClassData = {
	name: 'Wizard',
	image: base + '/class_icons/wizard.jpg',
	description: 'Scholars of magic who manipulate arcane forces through study and practice.',
	hitDie: 'd6',
	primaryAbility: 'Intelligence',
	saves: ['Intelligence', 'Wisdom'],
	armorProficiencies: [],
	weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows'],
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
	],
};
