import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';

const proficienciesPrompt: FeaturePrompt = {
	id: 'monk_proficiencies_01',
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
	effects: [
		{
			target: "skills",
			action: "add",
			value: "{userChoice}"
		}
	]
};

const martialArtsPrompt: FeaturePrompt = {
	id: 'monk_martial_arts_01',
	name: 'Martial Arts',
	description: `
		At 1st level, your practice of martial arts gives you the ability to use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
		You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die increases as you level.
		When you use the Attack action with an unarmed strike or monk weapon on your turn, you can make one unarmed strike as a bonus action.
	`,
	source: "monk",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Martial Arts"
		}
	]
};

const kiPrompt: FeaturePrompt = {
	id: 'monk_ki_01',
	name: 'Ki',
	description: `
		Starting at 2nd level, you can use your ki to fuel special martial arts techniques.
		You have a number of ki points equal to your monk level, which you can spend to use features like Flurry of Blows, Patient Defense, and Step of the Wind.
		Ki points are regained after a short or long rest.
	`,
	source: "monk",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Ki"
		}
	]
};

const unarmoredMovementPrompt: FeaturePrompt = {
	id: 'monk_unarmored_movement_01',
	name: 'Unarmored Movement',
	description: `
		Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield.
	`,
	source: "monk",
	effects: [
		{
			target: "features",
			action: "add",
			value: "Unarmored Movement"
		}
	]
};

const monasticTraditionPrompt: FeaturePrompt = {
	id: 'monk_tradition_01',
	name: 'Monastic Tradition',
	description: 'Choose a monastic tradition (subclass) at 3rd level.',
	featureOptions: {
		placeholderText: "-Choose a Tradition-",
		options: [
			{
				name: 'Way of the Open Hand',
				optionDescription: `This tradition emphasizes martial arts mastery, allowing you to manipulate your opponent's ki.`,
				nestedPrompts: [
					{
						id: 'monk_open_hand_technique_01',
						name: 'Open Hand Technique',
						description: `
							When you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects:
							- It must succeed on a Dexterity saving throw or be knocked prone.
							- It must make a Strength saving throw or be pushed 15 feet away.
							- It can’t take reactions until the end of your next turn.
						`,
						source: "monk.open_hand",
						effects: [
							{
								target: "features",
								action: "add",
								value: "Open Hand Technique"
							}
						]
					}
				]
			},
			{
				name: 'Way of Shadow',
				optionDescription: `This tradition teaches you to use shadows and stealth to confound your enemies.`,
				nestedPrompts: [
					{
						id: 'monk_shadow_arts_01',
						name: 'Shadow Arts',
						description: `
							You can use your ki to cast certain spells like darkness, darkvision, pass without trace, and silence.
						`,
						source: "monk.shadow",
						effects: [
							{
								target: "features",
								action: "add",
								value: "Shadow Arts"
							}
						]
					}
				]
			},
			{
				name: 'Way of the Four Elements',
				optionDescription: `You harness the elemental forces to perform martial arts techniques.`,
				nestedPrompts: [
					{
						id: 'monk_elements_disciple_01',
						name: 'Disciple of the Elements',
						description: `You can spend ki points to cast elemental disciplines.`,
						source: "monk.four_elements",
						effects: [
							{
								target: "features",
								action: "add",
								value: "Disciple of the Elements"
							}
						]
					}
				]
			}
		],
		numPicks: 1,
	},
	source: "monk",
	effects: [
		{
			target: "subclass",
			action: "set",
			value: "{userChoice}"
		}
	]
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
	startingEquipment: {
		fixed: ['Explorer\'s pack'],
		choices: []
	},
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		monasticTraditionPrompt,
	],
};
