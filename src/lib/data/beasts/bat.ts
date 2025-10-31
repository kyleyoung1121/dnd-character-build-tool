import type { Beast } from './types';

export const bat: Beast = {
	name: 'Bat',
	sources: ['Ranger', 'Warlock', 'Wizard'],
	type: 'Beast',
	size: 'Tiny',
	speed: { walk: 5, fly: 30 },
	armor_class: 12,
	hit_points: { average: 1, formula: '1d4-1' },
	ability_scores: {
		STR: 2,
		DEX: 15,
		CON: 8,
		INT: 2,
		WIS: 12,
		CHA: 4
	},
	proficiencies: [
		{ name: 'Skills', text: 'Perception +3' },
		{ name: 'Senses', text: 'Blindsight 60 ft., Passive Perception 11' }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
		name: 'Echolocation',
		text: 'The bat has no blindsight while deafened.'
		},
		{
		name: 'Keen Hearing',
		text: 'The bat has advantage on Wisdom (Perception) checks that rely on hearing.'
		}
	],
	actions: [
		{
		name: 'Bite',
		text: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one creature. Hit: 1 piercing damage.'
		}
	]
};
