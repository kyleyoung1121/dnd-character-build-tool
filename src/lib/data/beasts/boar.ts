import type { Beast } from './types';

export const boar: Beast = {
	name: 'Boar',
	sources: ['Druid', 'Ranger'],
	type: 'Beast',
	size: 'Medium',
	speed: { walk: 40 },
	armor_class: 11,
	hit_points: { average: 11, formula: '2d8 + 2' },
	ability_scores: {
		STR: 13,
		DEX: 11,
		CON: 12,
		INT: 2,
		WIS: 9,
		CHA: 5
	},
	proficiencies: [
		{ name: 'Senses', text: 'Passive Perception 9' }
	],
	challenge_rating: 0.25,
	xp: 50,
	abilities: [
		{
			name: 'Charge',
			text: 'If the boar moves at least 20 feet straight toward a creature right before hitting it with a tusk attack, the target takes an extra 3 (1d6) slashing damage and must succeed on a DC 11 Strength saving throw or be knocked prone.'
		},
		{
			name: 'Relentless',
			text: 'If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead. This ability recharges after the boar finishes a short or long rest.'
		}
	],
	actions: [
		{
			name: 'Tusk',
			text: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage.'
		}
	]
};
