import { base } from '$app/paths';
import type { ClassData, EquipmentChoice } from '$lib/data/types/ClassData';
import type { FeaturePrompt } from '$lib/data/types/Features';
import { simpleWeapons } from '$lib/data/equipment/weapons';

const proficienciesPrompt: FeaturePrompt = {
	id: 'ranger_proficiencies_01',
	name: 'Skill Proficiencies',
	description: {
		blocks: [
			{ type: 'text', text: 'Armor: Light armor, medium armor, shields' },
			{ type: 'text', text: 'Weapons: Simple weapons, martial weapons' },
			{ type: 'text', text: 'Saving Throws: Strength, Dexterity' },
			{ type: 'text', text: 'Skills: Choose three from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, and Survival' },
		]
	},
	featureOptions: {
		placeholderText: 'Select skills',
		options: [
			'Animal Handling',
			'Athletics',
			'Insight',
			'Investigation',
			'Nature',
			'Perception',
			'Stealth',
			'Survival'
		],
		numPicks: 3
	},
	source: 'ranger.proficiencies',
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};

const favoredEnemyPrompt: FeaturePrompt = {
	id: 'ranger_favored_enemy_01',
	name: 'Favored Enemy',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a type of creature as your favored enemy. You have significant experience studying, tracking, hunting, and even talking to a certain type of creature.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose a Favored Enemy-',
		options: [
			{
				name: 'Aberrations',
				optionDescription: 'Otherworldly beings with alien intelligence.',
				nestedPrompts: [
					{
						id: 'ranger_favored_aberrations_desc',
						name: 'Favored Enemy: Aberrations',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track aberrations, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Beasts',
				optionDescription: 'Natural animals and creatures of the wild.',
				nestedPrompts: [
					{
						id: 'ranger_favored_beasts_desc',
						name: 'Favored Enemy: Beasts',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track beasts, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Celestials',
				optionDescription: 'Divine beings from the Upper Planes.',
				nestedPrompts: [
					{
						id: 'ranger_favored_celestials_desc',
						name: 'Favored Enemy: Celestials',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track celestials, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Constructs',
				optionDescription: 'Animated objects and artificial creatures.',
				nestedPrompts: [
					{
						id: 'ranger_favored_constructs_desc',
						name: 'Favored Enemy: Constructs',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track constructs, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Dragons',
				optionDescription: 'Ancient, powerful, and magical reptilian creatures.',
				nestedPrompts: [
					{
						id: 'ranger_favored_dragons_desc',
						name: 'Favored Enemy: Dragons',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track dragons, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Elementals',
				optionDescription: 'Beings composed of pure elemental matter.',
				nestedPrompts: [
					{
						id: 'ranger_favored_elementals_desc',
						name: 'Favored Enemy: Elementals',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track elementals, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Fey',
				optionDescription: 'Magical creatures from the Feywild.',
				nestedPrompts: [
					{
						id: 'ranger_favored_fey_desc',
						name: 'Favored Enemy: Fey',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track fey, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Fiends',
				optionDescription: 'Evil beings from the Lower Planes.',
				nestedPrompts: [
					{
						id: 'ranger_favored_fiends_desc',
						name: 'Favored Enemy: Fiends',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track fiends, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Giants',
				optionDescription: 'Towering humanoid creatures of great size.',
				nestedPrompts: [
					{
						id: 'ranger_favored_giants_desc',
						name: 'Favored Enemy: Giants',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track giants, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Humanoids',
				optionDescription: 'Specific races of people and civilized creatures.',
				nestedPrompts: [
					{
						id: 'ranger_favored_humanoids_desc',
						name: 'Favored Enemy: Humanoids',
						description: {
							blocks: [
								{ type: 'text', text: 'You must choose two races of humanoid as your favored enemies. You have advantage on Wisdom (Survival) checks to track those specific humanoid races, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Select two humanoid races',
							options: [
								'Dragonborn',
								'Dwarves',
								'Elves',
								'Gnolls',
								'Gnomes',
								'Goblinoids',
								'Grimlock',
								'Halflings',
								'Humans',
								'Kobolds',
								'Lizardfolk',
								'Merfolk',
								'Orcs',
								'Sahuagin',
								'Werewolves (and other werecreatures)'
							],
							numPicks: 2
						}
					},
					{
						id: 'ranger_favored_humanoids_language',
						name: 'Favored Enemy Language',
						description: {
							blocks: [
								{ type: 'text', text: 'Choose one language that your favored enemies speak.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Monstrosities',
				optionDescription: 'Unnatural creatures and magical beasts.',
				nestedPrompts: [
					{
						id: 'ranger_favored_monstrosities_desc',
						name: 'Favored Enemy: Monstrosities',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track monstrosities, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Oozes',
				optionDescription: 'Amorphous creatures without fixed form.',
				nestedPrompts: [
					{
						id: 'ranger_favored_oozes_desc',
						name: 'Favored Enemy: Oozes',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track oozes, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Plants',
				optionDescription: 'Sentient vegetation and plant creatures.',
				nestedPrompts: [
					{
						id: 'ranger_favored_plants_desc',
						name: 'Favored Enemy: Plants',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track plants, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			},
			{
				name: 'Undead',
				optionDescription: 'Zombies, skeletons, and other undead creatures.',
				nestedPrompts: [
					{
						id: 'ranger_favored_undead_desc',
						name: 'Favored Enemy: Undead',
						description: {
							blocks: [
								{ type: 'text', text: 'You have advantage on Wisdom (Survival) checks to track undead, as well as on Intelligence checks to recall information about them. You also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.' },
							]
						},
						source: 'ranger.favored_enemy',
						effects: [],
						featureOptions: {
							placeholderText: 'Choose a language',
							options: [
								'Common',
								'Dwarvish',
								'Elvish',
								'Giant',
								'Gnomish',
								'Goblin',
								'Halfling',
								'Orc',
								'Abyssal',
								'Celestial',
								'Draconic',
								'Deep Speech',
								'Infernal',
								'Primordial',
								'Sylvan',
								'Undercommon'
							],
							numPicks: 1
						}
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'ranger',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Favored Enemy: {userChoice}'
		}
	]
};

const naturalExplorerPrompt: FeaturePrompt = {
	id: 'ranger_natural_explorer_01',
	name: 'Natural Explorer',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a favored terrain type. You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose a Favored Terrain-',
		options: [
			{
				name: 'Arctic',
				optionDescription: 'Frozen tundra and icy wilderness.',
				nestedPrompts: [
					{
						id: 'ranger_natural_arctic_desc',
						name: 'Natural Explorer: Arctic',
						description: {
							blocks: [
								{ type: 'text', text: 'When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in. While traveling for an hour or more in your favored terrain, you remain alert to danger, and if you are traveling alone, you can move stealthily at a normal pace.' },
							]
						},
						source: 'ranger.natural_explorer',
						effects: []
					}
				]
			},
			{
				name: 'Forest',
				optionDescription: 'Dense woods and jungle environments.',
				nestedPrompts: [
					{
						id: 'ranger_natural_forest_desc',
						name: 'Natural Explorer: Forest',
						description: {
							blocks: [
								{ type: 'text', text: 'When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in. While traveling for an hour or more in your favored terrain, you remain alert to danger, and if you are traveling alone, you can move stealthily at a normal pace.' },
							]
						},
						source: 'ranger.natural_explorer',
						effects: []
					}
				]
			},
			{
				name: 'Grassland',
				optionDescription: 'Open fields, plains, and prairies.',
				nestedPrompts: [
					{
						id: 'ranger_natural_grassland_desc',
						name: 'Natural Explorer: Grassland',
						description: {
							blocks: [
								{ type: 'text', text: 'When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in. While traveling for an hour or more in your favored terrain, you remain alert to danger, and if you are traveling alone, you can move stealthily at a normal pace.' },
							]
						},
						source: 'ranger.natural_explorer',
						effects: []
					}
				]
			},
			{
				name: 'Mountains',
				optionDescription: 'Rocky peaks and highland regions.',
				nestedPrompts: [
					{
						id: 'ranger_natural_mountains_desc',
						name: 'Natural Explorer: Mountains',
						description: {
							blocks: [
								{ type: 'text', text: 'When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in. While traveling for an hour or more in your favored terrain, you remain alert to danger, and if you are traveling alone, you can move stealthily at a normal pace.' },
							]
						},
						source: 'ranger.natural_explorer',
						effects: []
					}
				]
			},
			{
				name: 'Swamp',
				optionDescription: 'Wetlands and marshy areas.',
				nestedPrompts: [
					{
						id: 'ranger_natural_swamp_desc',
						name: 'Natural Explorer: Swamp',
						description: {
							blocks: [
								{ type: 'text', text: 'When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in. While traveling for an hour or more in your favored terrain, you remain alert to danger, and if you are traveling alone, you can move stealthily at a normal pace.' },
							]
						},
						source: 'ranger.natural_explorer',
						effects: []
					}
				]
			},
			{
				name: 'Coast',
				optionDescription: 'Beaches, cliffs, and coastal areas.',
				nestedPrompts: [
					{
						id: 'ranger_natural_coast_desc',
						name: 'Natural Explorer: Coast',
						description: {
							blocks: [
								{ type: 'text', text: 'When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in. While traveling for an hour or more in your favored terrain, you remain alert to danger, and if you are traveling alone, you can move stealthily at a normal pace.' },
							]
						},
						source: 'ranger.natural_explorer',
						effects: []
					}
				]
			},
			{
				name: 'Desert',
				optionDescription: 'Arid wastelands and sandy dunes.',
				nestedPrompts: [
					{
						id: 'ranger_natural_desert_desc',
						name: 'Natural Explorer: Desert',
						description: {
							blocks: [
								{ type: 'text', text: 'When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in. While traveling for an hour or more in your favored terrain, you remain alert to danger, and if you are traveling alone, you can move stealthily at a normal pace.' },
							]
						},
						source: 'ranger.natural_explorer',
						effects: []
					}
				]
			},
			{
				name: 'Underdark',
				optionDescription: 'Underground caves, tunnels, and cavern systems.',
				nestedPrompts: [
					{
						id: 'ranger_natural_underdark_desc',
						name: 'Natural Explorer: Underdark',
						description: {
							blocks: [
								{ type: 'text', text: 'When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you\'re proficient in. While traveling for an hour or more in your favored terrain, you remain alert to danger, and if you are traveling alone, you can move stealthily at a normal pace.' },
							]
						},
						source: 'ranger.natural_explorer',
						effects: []
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'ranger',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Natural Explorer: {userChoice}'
		}
	]
};

const fightingStylePrompt: FeaturePrompt = {
	id: 'ranger_fighting_style_01',
	name: 'Fighting Style',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a fighting style to suit your combat approach.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose a Fighting Style-',
		options: [
			{
				name: 'Archery',
				optionDescription: 'Expert archer with superior accuracy.',
				nestedPrompts: [
					{
						id: 'ranger_archery_style_desc',
						name: 'Archery Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain a +2 bonus to attack rolls you make with ranged weapons.' },
							]
						},
						source: 'ranger.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Defense',
				optionDescription: 'Defensive fighter who prioritizes protection.',
				nestedPrompts: [
					{
						id: 'ranger_defense_style_desc',
						name: 'Defense Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'While you are wearing armor, you gain a +1 bonus to AC.' },
							]
						},
						source: 'ranger.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Dueling',
				optionDescription: 'Expert with one-handed weapons.',
				nestedPrompts: [
					{
						id: 'ranger_dueling_style_desc',
						name: 'Dueling Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
							]
						},
						source: 'ranger.fighting_style',
						effects: []
					}
				]
			},
			{
				name: 'Two-Weapon Fighting',
				optionDescription: 'Master of fighting with two weapons.',
				nestedPrompts: [
					{
						id: 'ranger_two_weapon_style_desc',
						name: 'Two-Weapon Fighting Style',
						description: {
							blocks: [
								{ type: 'text', text: 'When you fight with two weapons, you can add your ability modifier to the damage of the second attack.' },
							]
						},
						source: 'ranger.fighting_style',
						effects: []
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'ranger',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: '{userChoice} Fighting Style'
		}
	]
};

const spellcastingPrompt: FeaturePrompt = {
	id: 'ranger_spellcasting_01',
	name: 'Spellcasting',
	description: {
		blocks: [
			{ type: 'text', text: 'You can cast prepared ranger spells using Wisdom as your spellcasting ability. You know three 1st-level ranger spells and have three 1st-level spell slots.' },
		]
	},
	source: 'ranger',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Spellcasting'
		}
	]
};

const primevalAwarenessPrompt: FeaturePrompt = {
	id: 'ranger_primeval_awareness_01',
	name: 'Primeval Awareness',
	description: {
		blocks: [
			{ type: 'text', text: 'You can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn\'t reveal the creatures\' location or number.' },
		]
	},
	source: 'ranger',
	effects: [
		{
			target: 'features',
			action: 'add',
			value: 'Primeval Awareness'
		}
	]
};

const rangerArchetypePrompt: FeaturePrompt = {
	id: 'ranger_archetype_01',
	name: 'Ranger Archetype',
	description: {
		blocks: [
			{ type: 'text', text: 'Choose a Ranger Archetype.' },
		]
	},
	featureOptions: {
		placeholderText: '-Choose an Archetype-',
		options: [
			{
				name: 'Hunter',
				optionDescription: `You focus on the art of hunting and gain abilities that improve your combat effectiveness.`,
				nestedPrompts: [
					{
						id: 'ranger_hunter_prey_01',
						name: 'Hunter’s Prey',
						description: {
							blocks: [
								{ type: 'text', text: 'Choose one of the following options:' },
							]
						},
						featureOptions: {
							placeholderText: '-Choose an Option-',
							options: [
								{
									name: 'Colossus Slayer',
									optionDescription: 'Specialize in taking down large foes.',
									nestedPrompts: [
										{
											id: 'ranger_colossus_slayer_desc',
											name: 'Colossus Slayer',
											description: {
												blocks: [
													{ type: 'text', text: 'Your tenacity can wear down the most potent foes. When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it\'s below its hit point maximum. You can deal this extra damage only once per turn.' },
												]
											},
											source: 'ranger.hunter',
											effects: []
										}
									]
								},
								{
									name: 'Giant Killer',
									optionDescription: 'Expert at fighting larger creatures.',
									nestedPrompts: [
										{
											id: 'ranger_giant_killer_desc',
											name: 'Giant Killer',
											description: {
												blocks: [
													{ type: 'text', text: 'When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack, provided that you can see the creature.' },
												]
											},
											source: 'ranger.hunter',
											effects: []
										}
									]
								},
								{
									name: 'Horde Breaker',
									optionDescription: 'Effective against groups of enemies.',
									nestedPrompts: [
										{
											id: 'ranger_horde_breaker_desc',
											name: 'Horde Breaker',
											description: {
												blocks: [
													{ type: 'text', text: 'Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.' },
												]
											},
											source: 'ranger.hunter',
											effects: []
										}
									]
								}
							],
							numPicks: 1
						},
						source: 'ranger.hunter',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: '{userChoice}'
							}
						]
					}
				]
			},
			{
				name: 'Beast Master',
				optionDescription: `You gain a beast companion to fight alongside you.`,
				nestedPrompts: [
					{
						id: 'ranger_companion_01',
						name: 'Ranger’s Companion',
						description: {
							blocks: [
								{ type: 'text', text: 'You gain a beast companion that accompanies you on your adventures and is trained to fight alongside you. Choose a beast that is no larger than Medium and that has a challenge rating of 1/4 or lower.' },
								{ type: 'text', text: '• Add your proficiency bonus (+2) to the beast\'s AC, attack rolls, and damage rolls, as well as to any saving throws and skills it is proficient in' },
								{ type: 'text', text: '• Its hit point maximum equals the hit point number in its stat block or 12, whichever is higher' },
								{ type: 'text', text: '• The beast obeys your commands as best as it can and takes its turn on your initiative' },
								{ type: 'text', text: '• On your turn, you can verbally command the beast where to move (no action required by you)' },
								{ type: 'text', text: '• You can use your action to verbally command it to take the Attack, Dash, Disengage, or Help action' },
								{ type: 'text', text: '• If you don\'t issue a command, the beast takes the Dodge action' },
								{ type: 'text', text: 'While traveling through your favored terrain with only the beast, you can move stealthily at a normal pace.' },
								{ type: 'text', text: 'If the beast dies, you can obtain a new companion by spending 8 hours magically bonding with a beast that isn\'t hostile to you and that meets the requirements.' },
							]
						},
						source: 'ranger.beast_master',
						effects: [
							{
								target: 'features',
								action: 'add',
								value: 'Ranger’s Companion'
							}
						]
					}
				]
			}
		],
		numPicks: 1
	},
	source: 'ranger',
	effects: [
		{
			target: 'subclass',
			action: 'set',
			value: '{userChoice}'
		}
	]
};

const classFeaturesPrompt: FeaturePrompt[] = [
	favoredEnemyPrompt,
	naturalExplorerPrompt,
	fightingStylePrompt,
	spellcastingPrompt,
	primevalAwarenessPrompt,
	rangerArchetypePrompt
];

export const ranger: ClassData = {
	name: 'Ranger',
	image: base + '/class_icons/ranger.jpg',
	description: 'Skilled hunters and trackers, masters of nature and survival.',
	hitDie: 'd10',
	primaryAbility: 'Dexterity & Wisdom',
	saves: ['Strength', 'Dexterity'],
	armorProficiencies: ['Light Armor', 'Medium Armor', 'Shields'],
	weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
	startingEquipment: {
		fixed: ['Longbow', 'Quiver of 20 arrows'],
		choices: [
			{
				name: 'Armor',
				description: 'Choose your armor',
				options: [
					{
						label: 'Scale mail',
						items: ['Scale mail']
					},
					{
						label: 'Leather armor',
						items: ['Leather armor']
					}
				]
			} as EquipmentChoice,
			{
				name: 'Melee Weapons',
				description: 'Choose your melee weapons',
				options: [
					{
						label: '2 shortswords',
						items: ['Shortsword', 'Shortsword']
					},
					{
						label: 'Two simple melee weapons',
						items: [],
						subChoices: [
							{
								name: 'First Simple Melee Weapon',
								description: 'Choose your first simple melee weapon',
								type: 'weapon-list',
								category: 'simple-melee',
								options: simpleWeapons.filter((w) => !['Light crossbow', 'Shortbow', 'Sling'].includes(w)),
								count: 1
							},
							{
								name: 'Second Simple Melee Weapon',
								description: 'Choose your second simple melee weapon',
								type: 'weapon-list',
								category: 'simple-melee',
								options: simpleWeapons.filter((w) => !['Light crossbow', 'Shortbow', 'Sling'].includes(w)),
								count: 1
							}
						]
					}
				]
			} as EquipmentChoice,
			{
				name: 'Equipment Pack',
				description: 'Choose your adventure kit',
				options: [
					{
						label: "Dungeoneer's pack",
						items: [
							"Dungeoneer's pack (includes: backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days of rations, waterskin, 50 feet of hempen rope)"
						]
					},
					{
						label: "Explorer's pack",
						items: [
							"Explorer's pack (includes: backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 feet of hempen rope)"
						]
					}
				]
			} as EquipmentChoice
		]
	},
	classFeatures: [proficienciesPrompt, ...classFeaturesPrompt]
};