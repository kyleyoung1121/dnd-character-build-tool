/**
 * D&D 5e Weapon Data
 * Complete weapon properties for attack calculations
 */

export interface WeaponProperties {
name: string;
damage: string; // e.g., "1d8", "2d6"
damageType: string; // e.g., "slashing", "piercing", "bludgeoning"
attackAbility: 'STR' | 'DEX' | 'EITHER'; // Which ability modifier to use
properties: string[]; // weapon properties like "finesse", "versatile", "two-handed"
category: 'simple' | 'martial';
type: 'melee' | 'ranged';
}

/**
 * Complete weapon database for all D&D 5e weapons
 */
export const weaponData: Record<string, WeaponProperties> = {
// Simple Melee Weapons
'Club': {
name: 'Club',
damage: '1d4',
damageType: 'bludgeoning',
attackAbility: 'STR',
properties: ['light'],
category: 'simple',
type: 'melee'
},
'Dagger': {
name: 'Dagger',
damage: '1d4',
damageType: 'piercing',
attackAbility: 'EITHER',
properties: ['finesse', 'light', 'thrown'],
category: 'simple',
type: 'melee'
},
'Greatclub': {
name: 'Greatclub',
damage: '1d8',
damageType: 'bludgeoning',
attackAbility: 'STR',
properties: ['two-handed'],
category: 'simple',
type: 'melee'
},
'Handaxe': {
name: 'Handaxe',
damage: '1d6',
damageType: 'slashing',
attackAbility: 'STR',
properties: ['light', 'thrown'],
category: 'simple',
type: 'melee'
},
'Javelin': {
name: 'Javelin',
damage: '1d6',
damageType: 'piercing',
attackAbility: 'STR',
properties: ['thrown'],
category: 'simple',
type: 'melee'
},
'Light hammer': {
name: 'Light hammer',
damage: '1d4',
damageType: 'bludgeoning',
attackAbility: 'STR',
properties: ['light', 'thrown'],
category: 'simple',
type: 'melee'
},
'Mace': {
name: 'Mace',
damage: '1d6',
damageType: 'bludgeoning',
attackAbility: 'STR',
properties: [],
category: 'simple',
type: 'melee'
},
'Quarterstaff': {
name: 'Quarterstaff',
damage: '1d6',
damageType: 'bludgeoning',
attackAbility: 'STR',
properties: ['versatile (1d8)'],
category: 'simple',
type: 'melee'
},
'Sickle': {
name: 'Sickle',
damage: '1d4',
damageType: 'slashing',
attackAbility: 'STR',
properties: ['light'],
category: 'simple',
type: 'melee'
},
'Spear': {
name: 'Spear',
damage: '1d6',
damageType: 'piercing',
attackAbility: 'STR',
properties: ['thrown', 'versatile (1d8)'],
category: 'simple',
type: 'melee'
},

// Simple Ranged Weapons
'Light crossbow': {
name: 'Light crossbow',
damage: '1d8',
damageType: 'piercing',
attackAbility: 'DEX',
properties: ['ammunition', 'loading', 'two-handed'],
category: 'simple',
type: 'ranged'
},
'Dart': {
name: 'Dart',
damage: '1d4',
damageType: 'piercing',
attackAbility: 'EITHER',
properties: ['finesse', 'thrown'],
category: 'simple',
type: 'ranged'
},
'Shortbow': {
name: 'Shortbow',
damage: '1d6',
damageType: 'piercing',
attackAbility: 'DEX',
properties: ['ammunition', 'two-handed'],
category: 'simple',
type: 'ranged'
},
'Sling': {
name: 'Sling',
damage: '1d4',
damageType: 'bludgeoning',
attackAbility: 'DEX',
properties: ['ammunition'],
category: 'simple',
type: 'ranged'
},

// Martial Melee Weapons
'Battleaxe': {
name: 'Battleaxe',
damage: '1d8',
damageType: 'slashing',
attackAbility: 'STR',
properties: ['versatile (1d10)'],
category: 'martial',
type: 'melee'
},
'Flail': {
name: 'Flail',
damage: '1d8',
damageType: 'bludgeoning',
attackAbility: 'STR',
properties: [],
category: 'martial',
type: 'melee'
},
'Glaive': {
name: 'Glaive',
damage: '1d10',
damageType: 'slashing',
attackAbility: 'STR',
properties: ['heavy', 'reach', 'two-handed'],
category: 'martial',
type: 'melee'
},
'Greataxe': {
name: 'Greataxe',
damage: '1d12',
damageType: 'slashing',
attackAbility: 'STR',
properties: ['heavy', 'two-handed'],
category: 'martial',
type: 'melee'
},
'Greatsword': {
name: 'Greatsword',
damage: '2d6',
damageType: 'slashing',
attackAbility: 'STR',
properties: ['heavy', 'two-handed'],
category: 'martial',
type: 'melee'
},
'Halberd': {
name: 'Halberd',
damage: '1d10',
damageType: 'slashing',
attackAbility: 'STR',
properties: ['heavy', 'reach', 'two-handed'],
category: 'martial',
type: 'melee'
},
'Lance': {
name: 'Lance',
damage: '1d12',
damageType: 'piercing',
attackAbility: 'STR',
properties: ['reach', 'special'],
category: 'martial',
type: 'melee'
},
'Longsword': {
name: 'Longsword',
damage: '1d8',
damageType: 'slashing',
attackAbility: 'STR',
properties: ['versatile (1d10)'],
category: 'martial',
type: 'melee'
},
'Maul': {
name: 'Maul',
damage: '2d6',
damageType: 'bludgeoning',
attackAbility: 'STR',
properties: ['heavy', 'two-handed'],
category: 'martial',
type: 'melee'
},
'Morningstar': {
name: 'Morningstar',
damage: '1d8',
damageType: 'piercing',
attackAbility: 'STR',
properties: [],
category: 'martial',
type: 'melee'
},
'Pike': {
name: 'Pike',
damage: '1d10',
damageType: 'piercing',
attackAbility: 'STR',
properties: ['heavy', 'reach', 'two-handed'],
category: 'martial',
type: 'melee'
},
'Rapier': {
name: 'Rapier',
damage: '1d8',
damageType: 'piercing',
attackAbility: 'EITHER',
properties: ['finesse'],
category: 'martial',
type: 'melee'
},
'Scimitar': {
name: 'Scimitar',
damage: '1d6',
damageType: 'slashing',
attackAbility: 'EITHER',
properties: ['finesse', 'light'],
category: 'martial',
type: 'melee'
},
'Shortsword': {
name: 'Shortsword',
damage: '1d6',
damageType: 'piercing',
attackAbility: 'EITHER',
properties: ['finesse', 'light'],
category: 'martial',
type: 'melee'
},
'Trident': {
name: 'Trident',
damage: '1d6',
damageType: 'piercing',
attackAbility: 'STR',
properties: ['thrown', 'versatile (1d8)'],
category: 'martial',
type: 'melee'
},
'War pick': {
name: 'War pick',
damage: '1d8',
damageType: 'piercing',
attackAbility: 'STR',
properties: [],
category: 'martial',
type: 'melee'
},
'Warhammer': {
name: 'Warhammer',
damage: '1d8',
damageType: 'bludgeoning',
attackAbility: 'STR',
properties: ['versatile (1d10)'],
category: 'martial',
type: 'melee'
},
'Whip': {
name: 'Whip',
damage: '1d4',
damageType: 'slashing',
attackAbility: 'EITHER',
properties: ['finesse', 'reach'],
category: 'martial',
type: 'melee'
},

// Martial Ranged Weapons
'Blowgun': {
name: 'Blowgun',
damage: '1',
damageType: 'piercing',
attackAbility: 'DEX',
properties: ['ammunition', 'loading'],
category: 'martial',
type: 'ranged'
},
'Hand crossbow': {
name: 'Hand crossbow',
damage: '1d6',
damageType: 'piercing',
attackAbility: 'DEX',
properties: ['ammunition', 'light', 'loading'],
category: 'martial',
type: 'ranged'
},
'Heavy crossbow': {
name: 'Heavy crossbow',
damage: '1d10',
damageType: 'piercing',
attackAbility: 'DEX',
properties: ['ammunition', 'heavy', 'loading', 'two-handed'],
category: 'martial',
type: 'ranged'
},
'Longbow': {
name: 'Longbow',
damage: '1d8',
damageType: 'piercing',
attackAbility: 'DEX',
properties: ['ammunition', 'heavy', 'two-handed'],
category: 'martial',
type: 'ranged'
},
'Net': {
name: 'Net',
damage: '0',
damageType: 'special',
attackAbility: 'DEX',
properties: ['special', 'thrown'],
category: 'martial',
type: 'ranged'
}
};

/**
 * Get weapon data by name (case-insensitive, handles variations)
 */
export function getWeaponData(weaponName: string): WeaponProperties | null {
// Try exact match first
if (weaponData[weaponName]) {
return weaponData[weaponName];
}

// Try case-insensitive match
const lowerName = weaponName.toLowerCase();
const match = Object.keys(weaponData).find(
key => key.toLowerCase() === lowerName
);

return match ? weaponData[match] : null;
}

/**
 * Check if an item is a weapon
 */
export function isWeapon(itemName: string): boolean {
return getWeaponData(itemName) !== null;
}

/**
 * Extract weapon names from an inventory list
 */
export function extractWeaponsFromInventory(inventory: string[]): string[] {
return inventory.filter(item => {
// Handle plural forms (e.g., "Four javelins" -> "Javelin")
const normalizedItem = item.replace(/^(Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|\d+)\s+/i, '');
const singularItem = normalizedItem.replace(/s$/, '');

return isWeapon(item) || isWeapon(normalizedItem) || isWeapon(singularItem);
});
}

/**
 * Normalize weapon name from various formats
 * e.g., "Four javelins" -> "Javelin"
 */
export function normalizeWeaponName(itemName: string): string {
// Remove quantity prefix
let normalized = itemName.replace(/^(Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|\d+)\s+/i, '');

// Try to find exact match
if (getWeaponData(normalized)) {
return normalized;
}

// Try singular form
const singular = normalized.replace(/s$/i, '');
if (getWeaponData(singular)) {
return singular;
}

// Try with capital first letter
const capitalized = singular.charAt(0).toUpperCase() + singular.slice(1).toLowerCase();
if (getWeaponData(capitalized)) {
return capitalized;
}

return itemName; // Return original if no match found
}
