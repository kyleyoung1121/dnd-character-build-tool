import type { Beast } from './types';

export const quasit: Beast = {
	name: "Quasit",
	sources: ["Warlock"],
	type: "fiend",
	size: "Tiny",
	speed: {
		walk: 40
	},
	armor_class: 13,
	hit_points: {
		average: 25,
		formula: "10d4"
	},
	ability_scores: {
		STR: 5,
		DEX: 17,
		CON: 10,
		INT: 7,
		WIS: 10,
		CHA: 10
	},
	proficiencies: [
		{ name: "Skills", text: "Stealth +5" },
		{ name: "Resistances", text: "Cold, Fire, Lightning" },
		{ name: "Immunities", text: "Poison; Poisoned" },
		{ name: "Senses", text: "Darkvision 120 ft.; Passive Perception 10" },
		{ name: "Languages", text: "Abyssal, Common" }
	],
	challenge_rating: 1,
	xp: 200,
	abilities: [
		{
			name: "Magic Resistance",
			text: "The quasit has Advantage on saving throws against spells and other magical effects."
		}
	],
	actions: [
		{
			name: "Rend",
			text: "Melee Attack Roll: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) slashing damage, and the target has the Poisoned condition until the start of the quasit’s next turn."
		},
		{
			name: "Invisibility",
			text: "The quasit casts Invisibility on itself, requiring no spell components and using Charisma as the spellcasting ability."
		},
		{
			name: "Scare (1/Day)",
			text: "Wisdom Saving Throw: DC 10, one creature within 20 feet. Failure: The target has the Frightened condition. At the end of each of its turns, the target repeats the save, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
		},
		{
			name: "Shape-Shift",
			text: "The quasit shape-shifts to resemble a bat (Speed 10 ft., Fly 40 ft.), a centipede (40 ft., Climb 40 ft.), or a toad (40 ft., Swim 40 ft.), or it returns to its true form. Its game statistics are the same in each form, except for its Speed. Any equipment it is wearing or carrying isn’t transformed."
		}
	]
};
