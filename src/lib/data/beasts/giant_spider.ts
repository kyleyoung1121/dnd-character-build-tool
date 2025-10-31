import type { Beast } from './types';

export const giant_spider: Beast = {
	name: 'Giant Spider',
	sources: ['Druid (Circle of the Moon)'],
	type: 'Beast',
	size: 'Large',
	speed: { walk: 30, climb: 30 },
	armor_class: 14,
	hit_points: { average: 26 },
	ability_scores: {
		STR: 14,
		DEX: 16,
		CON: 12,
		INT: 2,
		WIS: 11,
		CHA: 4
	},
	proficiencies: [
		{ name: 'Skills', text: 'Stealth +7' },
		{ name: 'Senses', text: 'Blindsight 10 ft., Darkvision 60 ft., Passive Perception 10' }
	],
	challenge_rating: 1,
	xp: 200,
	abilities: [
		{
			name: 'Spider Climb',
			text: 'The spider can climb difficult surfaces, including ceilings, without needing to make an ability check.'
		},
		{
			name: 'Web Sense',
			text: 'While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.'
		},
		{
			name: 'Web Walker',
			text: 'The spider ignores movement restrictions caused by webs.'
		}
	],
	actions: [
		{
			name: 'Bite',
			text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 9 (2d8) poison damage on a failed save, or half as much on a successful one. If the poison damage reduces the target to 0 hit points, it is stable but poisoned for 1 hour and paralyzed while poisoned.'
		},
		{
			name: 'Web (Recharge 5–6)',
			text: 'Ranged Weapon Attack: +5 to hit, range 30/60 ft., one creature. Hit: The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can be attacked (AC 10; HP 5; vulnerability to fire; immunity to bludgeoning, poison, and psychic damage).'
		}
	]
};
