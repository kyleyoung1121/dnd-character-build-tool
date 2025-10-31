import type { Beast } from './types';

export const riding_horse: Beast = {
	name: "Riding Horse",
	sources: ["Druid"],
	type: "beast",
	size: "Large",
	speed: {
		walk: 60
	},
	armor_class: 10,
	hit_points: {
		average: 13,
		formula: "2d10+2"
	},
	ability_scores: {
		STR: 16,
		DEX: 10,
		CON: 12,
		INT: 2,
		WIS: 11,
		CHA: 7
	},
	proficiencies: [
		{ name: "Senses", text: "Passive Perception 10" }
	],
	challenge_rating: 0.25,
	xp: 50,
	abilities: [],
	actions: [
		{
			name: "Hooves",
			text: "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 8 (2d4 + 3) bludgeoning damage."
		}
	]
};
