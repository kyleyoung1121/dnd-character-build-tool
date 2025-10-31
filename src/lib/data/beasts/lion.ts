import type { Beast } from './types';

export const lion: Beast = {
	name: "Lion",
	sources: ["Druid (Circle of the Moon)"],
	type: "beast",
	size: "Large",
	speed: {
		walk: 50
	},
	armor_class: 12,
	hit_points: {
		average: 26,
		formula: "4d10 + 4"
	},
	ability_scores: {
		STR: 17,
		DEX: 15,
		CON: 11,
		INT: 3,
		WIS: 12,
		CHA: 8
	},
	proficiencies: [
		{ name: "Skills", text: "Perception +3, Stealth +6" },
		{ name: "Senses", text: "Passive Perception 13" }
	],
	challenge_rating: 1,
	xp: 200,
	abilities: [
		{
			name: "Keen Smell",
			text: "The lion has advantage on Wisdom (Perception) checks that rely on smell."
		},
		{
			name: "Pounce",
			text: "If the lion moves at least 20 feet straight toward a creature right before hitting it with a claw attack, the target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the lion can take a bonus action to make one bite attack against it."
		},
		{
			name: "Running Leap",
			text: "With a 10-foot running start, the lion can long jump up to 25 feet."
		}
	],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 7 (1d8 + 3) piercing damage."
		},
		{
			name: "Claws",
			text: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
		}
	]
};
