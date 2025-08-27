// D&D 5e weapon lists for equipment selection

export const simpleWeapons = [
	// Melee weapons
	'Club',
	'Dagger',
	'Dart',
	'Handaxe',
	'Javelin',
	'Light hammer',
	'Mace',
	'Quarterstaff',
	'Sickle',
	'Spear',
	
	// Ranged weapons
	'Light crossbow',
	'Shortbow',
	'Sling'
];

export const martialMeleeWeapons = [
	'Battleaxe',
	'Flail',
	'Glaive',
	'Greataxe',
	'Greatsword',
	'Halberd',
	'Lance',
	'Longsword',
	'Maul',
	'Morningstar',
	'Pike',
	'Rapier',
	'Scimitar',
	'Shortsword',
	'Trident',
	'War pick',
	'Warhammer',
	'Whip'
];

export const martialRangedWeapons = [
	'Blowgun',
	'Hand crossbow',
	'Heavy crossbow',
	'Longbow',
	'Net'
];

export const martialWeapons = [
	...martialMeleeWeapons,
	...martialRangedWeapons
];

export const simpleWielding = simpleWeapons.filter(weapon => 
	!['Light crossbow', 'Shortbow', 'Sling'].includes(weapon)
);