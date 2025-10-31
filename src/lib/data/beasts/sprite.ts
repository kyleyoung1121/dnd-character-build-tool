import type { Beast } from './types';

export const sprite: Beast = {
	name: "Sprite",
	sources: ["Warlock"],
	type: "fey",
	size: "Tiny",
	speed: {
		walk: 10,
		fly: 40
	},
	armor_class: 15,
	hit_points: {
		average: 10,
		formula: "4d4"
	},
	ability_scores: {
		STR: 3,
		DEX: 18,
		CON: 10,
		INT: 14,
		WIS: 13,
		CHA: 11
	},
	proficiencies: [
		{ name: "Skills", text: "Perception +3, Stealth +8" },
		{ name: "Senses", text: "Passive Perception 13" },
		{ name: "Languages", text: "Common, Elvish, Sylvan" }
	],
	challenge_rating: 0.25,
	xp: 50,
	abilities: [],
	actions: [
		{
			name: "Needle Sword",
			text: "Melee Attack Roll: +6 to hit, reach 5 ft. Hit: 6 (1d4 + 4) Piercing damage."
		},
		{
			name: "Enchanting Bow",
			text: "Ranged Attack Roll: +6 to hit, range 40/160 ft. Hit: 1 Piercing damage, and the target has the Charmed condition until the start of the sprite’s next turn."
		},
		{
			name: "Heart Sight",
			text: "Charisma Saving Throw: DC 10, one creature within 5 feet the sprite can see (Celestials, Fiends, and Undead automatically fail the save). Failure: The sprite knows the target’s emotions and alignment."
		},
		{
			name: "Invisibility",
			text: "The sprite casts Invisibility on itself, requiring no spell components and using Charisma as the spellcasting ability."
		}
	]
};
