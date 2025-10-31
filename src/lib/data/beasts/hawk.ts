import type { Beast } from './types';

export const hawk: Beast = {
	name: 'Hawk',
	sources: ['Ranger', 'Warlock', 'Wizard'],
	type: 'Beast',
	size: 'Tiny',
	speed: { walk: 10, fly: 60 },
	armor_class: 13,
	hit_points: { average: 1, formula: '1d4 - 1' },
	ability_scores: {
		STR: 5,
		DEX: 16,
		CON: 8,
		INT: 2,
		WIS: 14,
		CHA: 6
	},
	proficiencies: [
		{ name: 'Skills', text: 'Perception +4' },
		{ name: 'Senses', text: 'Passive Perception 14' }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: 'Keen Sight',
			text: 'The hawk has advantage on Wisdom (Perception) checks that rely on sight.'
		}
	],
	actions: [
		{
			name: 'Talons',
			text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 slashing damage.'
		}
	]
};
