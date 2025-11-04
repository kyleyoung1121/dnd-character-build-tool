import type { Beast } from './types';

export const panther: Beast = {
	name: "Panther",
	sources: ["Druid", "Druid (Circle of the Moon)", "Ranger"],
	type: "beast",
	size: "Medium",
	speed: {
		walk: 50,
		climb: 40
	},
	armor_class: 12,
	hit_points: {
		average: 13,
		formula: "3d8"
	},
	ability_scores: {
		STR: 14,
		DEX: 15,
		CON: 10,
		INT: 3,
		WIS: 14,
		CHA: 7
	},
	proficiencies: [
		{ name: "Skills", text: "Perception +4, Stealth +6" },
		{ name: "Senses", text: "Passive Perception 14" }
	],
	challenge_rating: 0.25,
	xp: 50,
	abilities: [
		{
			name: "Keen Smell",
			text: "The panther has advantage on Wisdom (Perception) checks that rely on smell."
		},
		{
			name: "Pounce",
			text: "If the panther moves at least 20 feet straight toward a creature right before hitting it with a claw attack, it must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can take a bonus action to make one bite attack against it."
		}
	],
	actions: [
		{
			name: "Bite",
			text: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) piercing damage."
		},
		{
			name: "Claws",
			text: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage."
		}
	]
};
