import type { Beast } from './types';

export const dire_wolf: Beast = {
	name: 'Dire Wolf',
	sources: ['Druid (Circle of the Moon)'],
	type: 'Beast',
	size: 'Large',
	speed: { walk: 50 },
	armor_class: 14,
	hit_points: { average: 37 },
	ability_scores: {
		STR: 17,
		DEX: 15,
		CON: 15,
		INT: 3,
		WIS: 12,
		CHA: 7
	},
	proficiencies: [
		{ name: 'Skills', text: 'Perception +3, Stealth +4' },
		{ name: 'Senses', text: 'Passive Perception 13' }
	],
	challenge_rating: 1,
	xp: 200,
	abilities: [
		{
			name: 'Keen Hearing and Smell',
			text: 'The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.'
		},
		{
			name: 'Pack Tactics',
			text: 'The wolf has advantage on attack rolls against a creature if at least one of the wolf’s allies is within 5 feet of the creature and isn’t incapacitated.'
		}
	],
	actions: [
		{
			name: 'Bite',
			text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.'
		}
	]
};
