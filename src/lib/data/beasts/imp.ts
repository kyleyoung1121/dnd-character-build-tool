import type { Beast } from './types';

export const imp: Beast = {
	name: "Imp",
	sources: ["Warlock"],
	type: "fiend",
	size: "Tiny",
	speed: {
		walk: 20,
		fly: 40
	},
	armor_class: 13,
	hit_points: {
		average: 21,
		formula: "6d4 + 6"
	},
	ability_scores: {
		STR: 6,
		DEX: 17,
		CON: 13,
		INT: 11,
		WIS: 12,
		CHA: 14
	},
	proficiencies: [
		{ name: "Skills", text: "Deception +4, Insight +3, Stealth +5" },
		{ name: "Resistances", text: "Cold" },
		{ name: "Immunities", text: "Fire, Poison; Poisoned" },
		{ name: "Senses", text: "Darkvision 120 ft. (unimpeded by magical Darkness); Passive Perception 11" },
		{ name: "Languages", text: "Common, Infernal" }
	],
	challenge_rating: 1,
	xp: 200,
	abilities: [
		{
			name: "Magic Resistance",
			text: "The imp has Advantage on saving throws against spells and other magical effects."
		}
	],
	actions: [
		{
			name: "Sting",
			text: "Melee Attack Roll: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage plus 7 (2d6) poison damage."
		},
		{
			name: "Invisibility",
			text: "The imp casts Invisibility on itself, requiring no spell components and using Charisma as the spellcasting ability."
		},
		{
			name: "Shape-Shift",
			text: "The imp shape-shifts to resemble a rat (Speed 20 ft.), a raven (20 ft., Fly 60 ft.), or a spider (20 ft., Climb 20 ft.), or it returns to its true form. Its game statistics are the same in each form, except for its Speed. Any equipment it is wearing or carrying isn’t transformed."
		}
	]
};
