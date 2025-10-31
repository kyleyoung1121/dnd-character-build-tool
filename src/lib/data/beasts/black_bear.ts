import type { Beast } from './types';

export const black_bear: Beast = {
	name: 'Black Bear',
	sources: ['Druid (Circle of the Moon)'],
	type: 'Beast',
	size: 'Medium',
	speed: { walk: 40, climb: 30 },
	armor_class: 11,
	hit_points: { average: 19 },
	ability_scores: {
		STR: 15,
		DEX: 10,
		CON: 14,
		INT: 2,
		WIS: 12,
		CHA: 7
	},
	proficiencies: [
		{ name: 'Skills', text: 'Perception +5' },
		{ name: 'Senses', text: 'Darkvision 60 ft.; Passive Perception 15' }
	],
	challenge_rating: 0.5,
	xp: 100,
	abilities: [
		{
			name: 'Keen Smell',
			text: 'The bear has advantage on Wisdom (Perception) checks that rely on smell.'
		}
	],
	actions: [
		{
			name: 'Multiattack',
			text: 'The bear makes two Rend attacks.'
		},
		{
			name: 'Rend',
			text: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.'
		}
	]
};
