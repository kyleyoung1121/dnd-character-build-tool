import type { Beast } from './types';

export const rat: Beast = {
	name: "Rat",
	sources: ["Druid", "Ranger", "Warlock (Pact of the Chain)", "Wizard"],
	type: "beast",
	size: "Tiny",
	speed: {
		walk: 20
	},
	armor_class: 10,
	hit_points: {
		average: 1,
		formula: "1d4-1"
	},
	ability_scores: {
		STR: 2,
		DEX: 11,
		CON: 9,
		INT: 2,
		WIS: 10,
		CHA: 4
	},
	proficiencies: [
		{ name: "Senses", text: "Darkvision 30 ft., Passive Perception 10" }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: "Keen Smell",
			text: "The rat has advantage on Wisdom (Perception) checks that rely on smell."
		}
	],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +0 to hit, reach 5 ft., one creature. Hit: 1 piercing damage."
		}
	]
};
