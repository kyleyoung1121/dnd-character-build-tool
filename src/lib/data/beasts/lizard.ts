import type { Beast } from './types';

export const lizard: Beast = {
	name: "Lizard",
	sources: ["Druid", "Warlock (Pact of the Chain)", "Wizard (Find Familiar)"],
	type: "beast",
	size: "Tiny",
	speed: {
		walk: 20,
		climb: 20
	},
	armor_class: 10,
	hit_points: {
		average: 2,
		formula: "1d4"
	},
	ability_scores: {
		STR: 2,
		DEX: 11,
		CON: 10,
		INT: 1,
		WIS: 8,
		CHA: 3
	},
	proficiencies: [
		{ name: "Senses", text: "Darkvision 30 ft., Passive Perception 9" }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: "Spider Climb",
			text: "The lizard can climb difficult surfaces, including ceilings, without needing to make an ability check."
		}
	],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 1 piercing damage."
		}
	]
};
