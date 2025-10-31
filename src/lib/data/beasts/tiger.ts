import type { Beast } from './types';

export const tiger: Beast = {
	name: "Tiger",
	sources: ["Druid (Circle of the Moon)"],
	type: "beast",
	size: "Large",
	speed: {
		walk: 40
	},
	armor_class: 12,
	hit_points: {
		average: 37
	},
	ability_scores: {
		STR: 17,
		DEX: 15,
		CON: 14,
		INT: 3,
		WIS: 12,
		CHA: 8
	},
	proficiencies: [
		{ name: "Skills", text: "Perception +3, Stealth +6" },
		{ name: "Senses", text: "Darkvision 60 ft., Passive Perception 13" }
	],
	challenge_rating: 1,
	xp: 200,
	abilities: [
		{
			name: "Keen Smell",
			text: "The tiger has advantage on Wisdom (Perception) checks that rely on smell."
		},
		{
			name: "Pounce",
			text: "If the tiger moves at least 20 feet straight toward a creature right before hitting it with a claw attack, it must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the tiger can take a bonus action to make one bite attack against it."
		}
	],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 8 (1d10 + 3) piercing damage."
		},
		{
			name: "Claws",
			text: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage."
		}
	]
};
