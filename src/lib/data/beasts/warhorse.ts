import type { Beast } from './types';

export const warhorse: Beast = {
	name: "Warhorse",
	sources: ["Druid (Circle of the Moon)"],
	type: "beast",
	size: "Large",
	speed: {
		walk: 60
	},
	armor_class: 11,
	hit_points: {
		average: 19
	},
	ability_scores: {
		STR: 18,
		DEX: 12,
		CON: 13,
		INT: 2,
		WIS: 12,
		CHA: 7
	},
	proficiencies: [
		{ name: "Senses", text: "Passive Perception 11" }
	],
	challenge_rating: 0.5,
	xp: 100,
	abilities: [
		{
			name: "Trampling Charge",
			text: "If the horse moves at least 20 feet straight toward a creature right before hitting it with a hooves attack, the target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the horse can take a bonus action to make another attack with its hooves against the target."
		}
	],
	actions: [
		{
			name: "Hooves",
			text: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage."
		}
	]
};
