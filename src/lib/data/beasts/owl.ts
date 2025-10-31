import type { Beast } from './types';

export const owl: Beast = {
	name: "Owl",
	sources: ["Ranger (Beast Master)", "Warlock (Pact of the Chain)", "Wizard (Find Familiar)"],
	type: "beast",
	size: "Tiny",
	speed: {
		walk: 5,
		fly: 60
	},
	armor_class: 11,
	hit_points: {
		average: 1,
		formula: "1d4 - 1"
	},
	ability_scores: {
		STR: 3,
		DEX: 13,
		CON: 8,
		INT: 2,
		WIS: 12,
		CHA: 7
	},
	proficiencies: [
		{ name: "Skills", text: "Perception +3, Stealth +3" },
		{ name: "Senses", text: "Darkvision 120 ft., Passive Perception 13" }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: "Flyby",
			text: "The owl provokes no opportunity attacks when it flies out of an enemy’s reach."
		},
		{
			name: "Keen Hearing and Sight",
			text: "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
		}
	],
	actions: [
		{
			name: "Talons",
			text: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1 slashing damage."
		}
	]
};
