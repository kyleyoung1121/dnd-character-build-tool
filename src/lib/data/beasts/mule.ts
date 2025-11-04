import type { Beast } from './types';

export const mule: Beast = {
	name: "Mule",
	sources: ["Druid", "Ranger"],
	type: "beast",
	size: "Medium",
	speed: {
		walk: 40
	},
	armor_class: 10,
	hit_points: {
		average: 11,
		formula: "2d8 + 2"
	},
	ability_scores: {
		STR: 14,
		DEX: 10,
		CON: 13,
		INT: 2,
		WIS: 10,
		CHA: 5
	},
	proficiencies: [
		{ name: "Senses", text: "Passive Perception 10" }
	],
	challenge_rating: 0.125,
	xp: 25,
	abilities: [
		{
			name: "Beast of Burden",
			text: "The mule is considered to be a Large animal for the purpose of its carrying capacity."
		},
		{
			name: "Sure-Footed",
			text: "The mule has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
		}
	],
	actions: [
		{
			name: "Hooves",
			text: "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 4 (1d4 +2) bludgeoning damage."
		}
	]
};
