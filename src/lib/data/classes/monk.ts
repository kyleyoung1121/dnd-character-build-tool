import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/ClassFeatures';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	description: `
		Armor: None <br>
		Weapons: Simple weapons, shortswords <br>
		Saving Throws: Strength, Dexterity <br>
		Skills: Choose two from Acrobatics, Athletics, History, Insight, Religion, and Stealth
	`,
	featureOptions: {
		placeholderText: "Select skills",
		options: [
			'Acrobatics',
			'Athletics',
			'History',
			'Insight',
			'Religion',
			'Stealth',
		],
		numPicks: 2,
	},
	source: "monk.proficiencies",
};

const martialArtsPrompt: FeaturePrompt = {
	name: 'Martial Arts',
	description: `
		At 1st level, your practice of martial arts gives you the ability to use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
		You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die increases as you level.
		When you use the Attack action with an unarmed strike or monk weapon on your turn, you can make one unarmed strike as a bonus action.
	`,
	source: "monk"
};

const kiPrompt: FeaturePrompt = {
	name: 'Ki',
	description: `
		Starting at 2nd level, you can use your ki to fuel special martial arts techniques.
		You have a number of ki points equal to your monk level, which you can spend to use features like Flurry of Blows, Patient Defense, and Step of the Wind.
		Ki points are regained after a short or long rest.
	`,
	source: "monk"
};

const unarmoredMovementPrompt: FeaturePrompt = {
	name: 'Unarmored Movement',
	description: `
		Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield.
	`,
	source: "monk"
};

const monasticTraditionPrompt: FeaturePrompt = {
	name: 'Monastic Tradition',
	description: 'Choose a monastic tradition (subclass) at 3rd level.',
	featureOptions: {
		placeholderText: "-Choose a Tradition-",
		options: [
			{
				name: 'Way of the Open Hand',
				optionDescription: `
					This tradition emphasizes martial arts mastery, allowing you to manipulate your opponent's ki.
				`,
				nestedPrompts: [
					{
						name: 'Open Hand Technique',
						description: `
							When you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects:
							- It must succeed on a Dexterity saving throw or be knocked prone.
							- It must make a Strength saving throw or be pushed 15 feet away.
							- It can’t take reactions until the end of your next turn.
						`,
						source: "monk.open_hand"
					}
				],
			},
			{
				name: 'Way of Shadow',
				optionDescription: `
					This tradition teaches you to use shadows and stealth to confound your enemies.
				`,
				nestedPrompts: [
					{
						name: 'Shadow Arts',
						description: `
							You can use your ki to cast certain spells like darkness, darkvision, pass without trace, and silence.
						`,
						source: "monk.shadow"
					}
				],
			},
			{
				name: 'Way of the Four Elements',
				optionDescription: `
					You harness the elemental forces to perform martial arts techniques.
				`,
				nestedPrompts: [
					{
						name: 'Disciple of the Elements',
						description: `
							You can spend ki points to cast elemental disciplines.
						`,
						source: "monk.four_elements"
					}
				],
			}
		],
		numPicks: 1,
	},
	source: "monk",
};

const classFeaturesPrompt: FeaturePrompt[] = [
	martialArtsPrompt,
	kiPrompt,
	unarmoredMovementPrompt,
];

export const monk: ClassData = {
	name: 'Monk',
	image: base + '/class_icons/monk.jpg',
	description: 'Masters of martial arts harnessing the power of ki.',
	hitDie: 'd8',
	primaryAbility: 'Dexterity & Wisdom',
	saves: ['Strength', 'Dexterity'],
	armorProficiencies: [],
	weaponProficiencies: ['Simple Weapons', 'Shortswords'],
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		monasticTraditionPrompt,
	],
};
