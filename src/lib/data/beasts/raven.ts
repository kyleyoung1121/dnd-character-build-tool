import type { Beast } from './types';

export const raven: Beast = {
	name: "Raven",
	sources: ["Ranger", "Warlock (Pact of the Chain)", "Wizard"],
	type: "beast",
	size: "Tiny",
	speed: {
		walk: 10,
		fly: 50
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
		INT: 2,
		WIS: 12,
		CHA: 6
	},
	proficiencies: [
		{ name: "Skills", text: "Perception +3" },
		{ name: "Senses", text: "Passive Perception 13" }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: "Mimicry",
			text: "The raven can mimic simple sounds it has heard. A creature that hears the sounds can tell they are imitations with a successful DC 10 Wisdom (Insight) check."
		}
	],
	actions: [
		{
			name: "Beak",
			text: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1 piercing damage."
		}
	]
};
