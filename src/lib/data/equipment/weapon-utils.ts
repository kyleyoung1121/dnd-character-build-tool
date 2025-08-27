import { martialMeleeWeapons, martialRangedWeapons, simpleWeapons } from './weapons';

// Re-export individual arrays for direct use
export { martialMeleeWeapons, martialRangedWeapons, simpleWeapons } from './weapons';

// Weapon categorization utilities for equipment choices

export const weaponCategories = {
	'martial-melee': martialMeleeWeapons,
	'martial-ranged': martialRangedWeapons,
	'martial-all': [...martialMeleeWeapons, ...martialRangedWeapons],
	'simple-all': simpleWeapons,
	'simple-melee': simpleWeapons.filter((w) => !['Light crossbow', 'Shortbow', 'Sling'].includes(w)),
	'simple-ranged': ['Light crossbow', 'Shortbow', 'Sling']
};

export function getWeaponsByCategory(category: string): string[] {
	return weaponCategories[category as keyof typeof weaponCategories] || [];
}

// Weapon property helpers for better organization
export const twoHandedWeapons = [
	'Glaive',
	'Greataxe',
	'Greatsword',
	'Halberd',
	'Lance',
	'Maul',
	'Pike',
	'Heavy crossbow',
	'Longbow'
];

export const versatileWeapons = [
	'Battleaxe',
	'Longsword',
	'Trident',
	'Warhammer',
	'Quarterstaff',
	'Spear'
];

export const lightWeapons = [
	'Handaxe',
	'Light hammer',
	'Sickle',
	'Scimitar',
	'Shortsword',
	'Dagger',
	'Dart'
];

export function isWeaponTwoHanded(weapon: string): boolean {
	return twoHandedWeapons.includes(weapon);
}

export function canUseWithShield(weapon: string): boolean {
	return !isWeaponTwoHanded(weapon);
}
