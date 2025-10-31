import type { Beast } from './types';

export const wolf: Beast = {
	name: "Wolf",
	sources: ["Druid", "Ranger"],
	type: "beast",
	size: "Medium",
	speed: {
		walk: 40
	},
	armor_class: 13,
	hit_points: {
		average: 11,
		formula: "2d8 + 2"
	},
	ability_scores: {
		STR: 12,
		DEX: 15,
		CON: 12,
		INT: 3,
		WIS: 12,
		CHA: 6
	},
	proficiencies: [
		{ name: "Skills", text: "Perception +3, Stealth +4" },
		{ name: "Senses", text: "Passive Perception 13" }
	],
	challenge_rating: 0.25,
	xp: 50,
	abilities: [
		{
			name: "Keen Hearing and Smell",
			text: "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
		},
		{
			name: "Pack Tactics",
			text: "The wolf has advantage on attack rolls against a creature if at least one of the wolf’s allies is within 5 feet of the creature and isn’t incapacitated."
		}
	],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 1) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."
		}
	]
};
