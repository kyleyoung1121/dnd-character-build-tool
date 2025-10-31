import type { Beast } from './types';

export const crab: Beast = {
	name: 'Crab',
	sources: ['Warlock', 'Wizard'],
	type: 'Beast',
	size: 'Tiny',
	speed: { walk: 20, swim: 20 },
	armor_class: 11,
	hit_points: { average: 3, formula: '1d4 + 1' },
	ability_scores: {
		STR: 6,
		DEX: 11,
		CON: 12,
		INT: 1,
		WIS: 8,
		CHA: 2
	},
	proficiencies: [
		{ name: 'Skills', text: 'Stealth +2' },
		{ name: 'Senses', text: 'Blindsight 30 ft., Passive Perception 9' }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: 'Amphibious',
			text: 'The crab can breathe air and water.'
		}
	],
	actions: [
		{
			name: 'Claw',
			text: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 bludgeoning damage.'
		}
	]
};
