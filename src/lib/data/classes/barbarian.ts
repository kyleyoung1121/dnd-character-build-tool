import { base } from '$app/paths';
import type { ClassData } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { martialMeleeWeapons, simpleWeapons } from '../equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	id: 'barbarian_skills_01',
	description: `
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Constitution <br>
		Skills: Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival
	`,
	featureOptions: {
		placeholderText: "Select 2 skills",
		options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
		numPicks: 2,
	},
	source: "barbarian.proficiencies",
	effects: [
		{
			target: "skills",
			action: "add",
			value: "{userChoice}"
		}
	]
};

const primalPathPrompt: FeaturePrompt = {
	name: 'Primal Path',
	id: 'barbarian_primal_path',
	description: 'Choose a path that shapes the nature of your rage.',
	featureOptions: {
		placeholderText: "-Choose an Option-",
		options: [
			{
				name: "Berserker",
				optionDescription: 'For some barbarians, rage is a means to an end — that end being violence. The Path of the Berserker is a path of untrammeled fury, slick with blood. As you enter the berserker’s rage, you thrill in the chaos of battle, heedless of your own health or well-being.',
				nestedPrompts: [
					{
						name: "Frenzy",
						id: "barbarian_berserker_frenzy",
						description: 'Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.',
						source: "barbarian.berserker",
						effects: [
							{
								target: "features",
								action: "add",
								value: "Frenzy"
							}
						]
					}
				]
			}, 
			{
				name: "Totem Warrior",
				optionDescription: 'The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration. In battle, your totem spirit fills you with supernatural might, adding magical fuel to your barbarian rage.',
				nestedPrompts: [
					{
						name: "Spirit Seeker",
						id: "barbarian_totem_spirit_seeker",
						description: 'Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. You gain the ability to cast the beast sense and speak with animals spells, but only as rituals, as described in the Spellcasting section.',
						source: "barbarian.totem_warrior",
						effects: [
							{
								target: "features",
								action: "add",
								value: "Spirit Seeker"
							}
						]
					},
					{
						name: "Totem Spirit",
						id: "barbarian_totem_totem_spirit",
						description: 'At 3rd level when you adopt this path, you choose a totem spirit and gain its feature. You must make or acquire a physical totem object - an amulet or similar adornment - that incorporates fur or feathers, claws, teeth, or bones of the totem animal.',
						source: "barbarian.totem_warrior",
						featureOptions: {
							placeholderText: "Choose your totem spirit...",
							options: [
								{
									name: "Bear",
									optionDescription: "While raging, you have resistance to all damage except psychic damage. The spirit of the bear makes you tough enough to stand up to any punishment.",
									nestedPrompts: [
										{
											name: "Bear Totem Warrior",
											id: "barbarian_bear_totem_warrior",
											description: "The bear spirit grants you incredible resilience. While raging, you have resistance to all damage except psychic damage.",
											source: "barbarian.totem_warrior.bear",
											effects: [
												{
													target: "features",
													action: "add",
													value: "Bear Totem Spirit"
												}
											]
										}
									]
								},
								{
									name: "Eagle",
									optionDescription: "While you're raging and aren't wearing heavy armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash action as a bonus action on your turn. The spirit of the eagle makes you into a predator who can weave through the fray with ease.",
									nestedPrompts: [
										{
											name: "Eagle Totem Warrior",
											id: "barbarian_eagle_totem_warrior",
											description: "The eagle spirit grants you incredible mobility. While raging and not wearing heavy armor, other creatures have disadvantage on opportunity attacks against you, and you can use the Dash action as a bonus action.",
											source: "barbarian.totem_warrior.eagle",
											effects: [
												{
													target: "features",
													action: "add",
													value: "Eagle Totem Spirit"
												}
											]
										}
									]
								},
								{
									name: "Wolf",
									optionDescription: "While you're raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you. The spirit of the wolf makes you a leader of hunters.",
									nestedPrompts: [
										{
											name: "Wolf Totem Warrior",
											id: "barbarian_wolf_totem_warrior",
											description: "The wolf spirit grants you leadership in battle. While raging, your friends have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you.",
											source: "barbarian.totem_warrior.wolf",
											effects: [
												{
													target: "features",
													action: "add",
													value: "Wolf Totem Spirit"
												}
											]
										}
									]
								}
							],
							numPicks: 1
						},
						effects: []
					}
				]
			}
		],
		numPicks: 1,
	},
	source: "barbarian",
	effects: [
		{
			target: "subclass",
			action: "set",
			value: "{userChoice}"
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	{
		name: "Rage",
		id: "barbarian_rage",
		description: 'In battle, you fight with primal ferocity. You can enter a rage as a bonus action...',
		source: "barbarian",
		effects: [
			{
				target: "features",
				action: "add",
				value: "Rage"
			}
		]
	},
	{
		name: 'Unarmored Defense',
		id: "barbarian_unarmored_defense",
		description: 'While not wearing armor, your AC equals 10 + Dex modifier + Con modifier.',
		source: "barbarian",
		effects: [
			{
				target: "features",
				action: "add",
				value: "Unarmored Defense"
			}
		]
	},
	{
		name: 'Reckless Attack',
		id: "barbarian_reckless_attack",
		description: 'You can throw aside all concern for defense to attack with fierce desperation.',
		source: "barbarian",
		effects: [
			{
				target: "features",
				action: "add",
				value: "Reckless Attack"
			}
		]
	},
	{
		name: 'Danger Sense',
		id: "barbarian_danger_sense",
		description: 'You have advantage on Dexterity saving throws against effects you can see.',
		source: "barbarian",
		effects: [
			{
				target: "features",
				action: "add",
				value: "Danger Sense"
			}
		]
	},
];

export const barbarian: ClassData = {
	name: 'Barbarian',
	image: base + '/class_icons/barbarian.jpg',
	description: 'Frenzied warriors fueled by primal rage.',
	hitDie: 'd12',
	primaryAbility: 'Strength',
	saves: ['Strength', 'Constitution'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
	startingEquipment: {
		fixed: [
			'Explorer\'s pack (includes: backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hempen rope)',
			'Four javelins'
		],
		choices: [
			{
				name: 'Primary Weapon',
				description: 'Choose your main melee weapon',
				options: [
					['Greataxe'],
					...martialMeleeWeapons.filter(w => w !== 'Greataxe').map(weapon => [weapon])
				]
			},
			{
				name: 'Secondary Weapons',
				description: 'Choose your secondary weapons',
				options: [
					['Two handaxes'],
					...simpleWeapons.filter(w => w !== 'Handaxe').map(weapon => [weapon])
				]
			}
		]
	},
	classFeatures: [
		proficienciesPrompt,
		...classFeaturesPrompt,
		primalPathPrompt,
	]
};
