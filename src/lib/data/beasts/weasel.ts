import type { Beast } from './types';

export const weasel: Beast = {
	name: "Weasel",
	sources: ["Warlock", "Wizard"],
	type: "beast",
	size: "Tiny",
	speed: {
		walk: 30,
		climb: 30
	},
	armor_class: 13,
	hit_points: {
		average: 1,
		formula: "1d4 - 1"
	},
	ability_scores: {
		STR: 3,
		DEX: 16,
		CON: 8,
		INT: 2,
		WIS: 12,
		CHA: 3
	},
	proficiencies: [
		{ name: "Skills", text: "Acrobatics +5, Perception +3, Stealth +5" },
		{ name: "Senses", text: "Darkvision 60 ft., Passive Perception 13" }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 1 piercing damage."
		}
	]
};
