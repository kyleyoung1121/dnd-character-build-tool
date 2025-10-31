import type { Beast } from './types';

export const cat: Beast = {
	name: 'Cat',
	sources: ['Druid', 'Ranger', 'Warlock', 'Wizard'],
	type: 'Beast',
	size: 'Tiny',
	speed: { walk: 40, climb: 30 },
	armor_class: 12,
	hit_points: { average: 2, formula: '1d4' },
	ability_scores: {
		STR: 3,
		DEX: 15,
		CON: 10,
		INT: 3,
		WIS: 12,
		CHA: 7
	},
	proficiencies: [
		{ name: 'Skills', text: 'Perception +3, Stealth +4' },
		{ name: 'Senses', text: 'Passive Perception 13' }
	],
	challenge_rating: 0,
	xp: 10,
	abilities: [
		{
			name: 'Keen Smell',
			text: 'The cat has advantage on Wisdom (Perception) checks that rely on smell.'
		}
	],
	actions: [
		{
			name: 'Claws',
			text: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 slashing damage.'
		}
	]
};
