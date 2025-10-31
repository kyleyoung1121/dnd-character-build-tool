import type { Beast } from './types';

export const brown_bear: Beast = {
	name: 'Brown Bear',
	sources: ['Druid (Circle of the Moon)'],
	type: 'Beast',
	size: 'Large',
	speed: { walk: 40, climb: 30 },
	armor_class: 11,
	hit_points: { average: 34 },
	ability_scores: {
		STR: 19,
		DEX: 10,
		CON: 16,
		INT: 2,
		WIS: 13,
		CHA: 7
	},
	proficiencies: [
		{ name: 'Skills', text: 'Perception +3' },
		{ name: 'Senses', text: 'Darkvision 60 ft.; Passive Perception 13' }
	],
	challenge_rating: 1,
	xp: 200,
	abilities: [
		{
			name: 'Keen Smell',
			text: 'The bear has advantage on Wisdom (Perception) checks that rely on smell.'
		}
	],
	actions: [
		{
			name: 'Multiattack',
			text: 'The bear makes one Bite attack and one Claw attack.'
		},
		{
			name: 'Bite',
			text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage.'
		},
		{
			name: 'Claw',
			text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) slashing damage. If the target is a Large or smaller creature, it has the Prone condition.'
		}
	]
};
