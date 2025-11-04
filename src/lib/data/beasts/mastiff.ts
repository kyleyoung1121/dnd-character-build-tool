import type { Beast } from './types';

export const mastiff: Beast = {
	name: "Mastiff",
	sources: ["Druid", "Ranger"],
	type: "beast",
	size: "Medium",
	speed: {
		walk: 40
	},
	armor_class: 12,
	hit_points: {
		average: 5,
		formula: "1d8 + 1"
	},
	ability_scores: {
		STR: 13,
		DEX: 14,
		CON: 12,
		INT: 3,
		WIS: 12,
		CHA: 7
	},
	proficiencies: [
		{ name: "Skills", text: "Perception +3" },
		{ name: "Senses", text: "Passive Perception 13" }
	],
	challenge_rating: 0.125,
	xp: 25,
	abilities: [
		{
			name: "Keen Hearing and Smell",
			text: "The mastiff has advantage on Wisdom (Perception) checks that rely on hearing or smell."
		}
	],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."
		}
	]
};
