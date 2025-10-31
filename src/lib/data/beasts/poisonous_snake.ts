import type { Beast } from './types';

export const poisonous_snake: Beast = {
	name: "Poisonous Snake",
	sources: ["Ranger (Beast Master)", "Warlock (Pact of the Chain)", "Wizard"],
	type: "beast",
	size: "Tiny",
	speed: {
		walk: 30,
		swim: 30
	},
	armor_class: 13,
	hit_points: {
		average: 2,
		formula: "1d4"
	},
	ability_scores: {
		STR: 2,
		DEX: 16,
		CON: 11,
		INT: 1,
		WIS: 10,
		CHA: 3
	},
	proficiencies: [
		{ name: "Senses", text: "Blindsight 10 ft., Passive Perception 10" }
	],
	challenge_rating: 0.125,
	xp: 25,
	abilities: [],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 1 piercing damage, and the target must make a DC 10 Constitution saving throw, taking 5 (2d4) poison damage on a failed save, or half as much on a successful one."
		}
	]
};
