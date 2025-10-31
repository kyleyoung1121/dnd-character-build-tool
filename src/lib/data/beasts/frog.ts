import type { Beast } from './types';

export const frog: Beast = {
	name: 'Frog',
	sources: ['Ranger', 'Warlock', 'Wizard'],
	type: 'Beast',
	size: 'Tiny',
	speed: { walk: 20, swim: 20 },
	armor_class: 11,
	hit_points: { average: 1, formula: '1d4-1' },
	ability_scores: {
		STR: 1,
		DEX: 13,
		CON: 8,
		INT: 1,
		WIS: 8,
		CHA: 3
	},
	proficiencies: [
		{ name: 'Skills', text: 'Perception +1, Stealth +3' },
		{ name: 'Senses', text: 'Darkvision 30 ft., Passive Perception 11' }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: 'Amphibious',
			text: 'The frog can breathe air and water.'
		},
		{
			name: 'Standing Leap',
			text: 'As part of its movement and without a running start, the frog can long jump up to 10 ft. and high jump up to 5 ft.'
		}
	],
	actions: []
};
