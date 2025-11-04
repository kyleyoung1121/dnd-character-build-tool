import type { Beast } from './types';

export const spider: Beast = {
	name: "Spider",
	sources: ["Druid", "Warlock", "Wizard"],
	type: "beast",
	size: "Tiny",
	speed: {
		walk: 20,
		climb: 20
	},
	armor_class: 12,
	hit_points: {
		average: 1,
		formula: "1d4-1"
	},
	ability_scores: {
		STR: 2,
		DEX: 14,
		CON: 8,
		INT: 1,
		WIS: 10,
		CHA: 2
	},
	proficiencies: [
		{ name: "Skills", text: "Stealth +4" },
		{ name: "Senses", text: "Darkvision 30 ft., Passive Perception 10" }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: "Spider Climb",
			text: "The spider can climb difficult surfaces, including ceilings, without needing to make an ability check."
		},
		{
			name: "Web Walker",
			text: "The spider ignores movement restrictions caused by webs, and knows the location of any other creature in contact with the same web."
		}
	],
	actions: [
		{
			name: "Bite",
			text: "Melee Attack Roll: +4, reach 5 ft. Hit: 1 piercing damage plus 2 (1d4) poison damage."
		}
	]
};
