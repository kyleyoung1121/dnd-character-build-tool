// src/data/beasts/pseudodragon.ts
import type { Beast } from './types';

export const pseudodragon: Beast = {
	name: 'Pseudodragon',
	sources: ['Warlock'],
	type: 'Beast',
	size: 'Tiny',
	speed: { walk: 15, fly: 60 },
	armor_class: 14,
	hit_points: { average: 10, formula: '3d4+3' },
	ability_scores: { STR: 6, DEX: 15, CON: 13, INT: 10, WIS: 12, CHA: 10 },
	proficiencies: [
		{ name: 'Skills', text: 'Perception +5, Stealth +4' },
		{ name: 'Senses', text: 'Blindsight 10 ft., Darkvision 60 ft., Passive Perception 15' },
		{ name: 'Languages', text: 'Understands Common and Draconic but can’t speak' }
	],
	challenge_rating: 0.25,
	xp: 50,
	abilities: [
		{ name: 'Magic Resistance', text: 'The pseudodragon has advantage on saving throws against spells and other magical effects.' }
	],
	actions: [
		{ name: 'Multiattack', text: 'The pseudodragon makes two Bite attacks.' },
		{ name: 'Bite', text: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 4 (1d4 + 2) piercing damage.' },
		{ name: 'Sting', text: 'The pseudodragon targets one creature it can see within 5 ft. DC 12 Constitution saving throw or take 5 (2d4) poison damage and be poisoned and unconscious for up to 1 hour.' }
	]
};
