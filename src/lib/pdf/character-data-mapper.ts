/**
 * Character Data Mapper
 * 
 * This service maps data from the character store to the PDF field structure.
 * It handles data transformation, formatting, and calculation of derived values.
 */

import type { Character } from '$lib/stores/character_store';
import { getWeaponData } from '$lib/data/equipment/weapon-data';
import { formatFeaturesForPDF } from '$lib/data/features/feature-data';
import { barbarian } from '$lib/data/classes/barbarian';
import { bard } from '$lib/data/classes/bard';
import { cleric } from '$lib/data/classes/cleric';
import { druid } from '$lib/data/classes/druid';
import { fighter } from '$lib/data/classes/fighter';
import { monk } from '$lib/data/classes/monk';
import { paladin } from '$lib/data/classes/paladin';
import { ranger } from '$lib/data/classes/ranger';
import { rogue } from '$lib/data/classes/rogue';
import { sorcerer } from '$lib/data/classes/sorcerer';
import { warlock } from '$lib/data/classes/warlock';
import { wizard } from '$lib/data/classes/wizard';

export interface CharacterSheetData {
	// Page 1 - Header
	characterName: string;
	classAndLevel: string;
	background: string;
	species: string;
	alignment: string;
	experiencePoints: string;
	proficiencyBonus: string;
	
	// Page 1 - Ability Scores
	abilityScores: {
		strength: { score: string; modifier: string };
		dexterity: { score: string; modifier: string };
		constitution: { score: string; modifier: string };
		intelligence: { score: string; modifier: string };
		wisdom: { score: string; modifier: string };
		charisma: { score: string; modifier: string };
	};
	
	// Page 1 - Saving Throws
	savingThrows: {
		strength: string;
		dexterity: string;
		constitution: string;
		intelligence: string;
		wisdom: string;
		charisma: string;
	};
	
	// Page 1 - Skills
	skills: {
		[key: string]: string;
	};
	
	passivePerception: string;
	
	// Page 1 - Combat Stats
	armorClass: string;
	initiative: string;
	speed: string;
	hitPointMaximum: string;
	currentHitPoints: string;
	temporaryHitPoints: string;
	hitDice: string;
	
	// Page 1 - Attacks
	attacks: Array<{
		name: string;
		bonus: string;
		damage: string;
	}>;
	
	// Page 1 - Equipment & Features
	equipment: string;
	proficienciesAndLanguages: string;
	featuresAndTraits: string;
	
	// Page 2 - Character Details
	age: string;
	height: string;
	weight: string;
	eyes: string;
	skin: string;
	hair: string;
	
	// Page 2 - Backstory
	personalityTraits: string;
	ideals: string;
	bonds: string;
	flaws: string;
	
	// Page 2 - Additional Content
	additionalFeatures: string;
	treasureAndNotes: string;
}

/**
 * Calculate ability modifier from ability score
 */
function getModifier(score: number | null): number {
	if (score === null || score === 0) return 0;
	return Math.floor((score - 10) / 2);
}

/**
 * Format modifier with sign (+/-) 
 */
function formatModifier(modifier: number): string {
	if (modifier >= 0) return `+${modifier}`;
	return `${modifier}`;
}

/**
 * Get proficiency bonus for level 3 characters (always +2)
 */
function getProficiencyBonus(): number {
	return 2; // Level 3 characters always have +2 proficiency
}

/**
 * Calculate skill modifier (ability modifier + proficiency if proficient)
 */
function getSkillModifier(
	character: Character,
	abilityModifier: number,
	skillName: string
): number {
	const isProficient = character.skills?.includes(skillName) || false;
	const hasExpertise = character.expertise?.includes(skillName) || false;
	const hasJackOfAllTrades = character.features?.includes('Jack of All Trades') || false;
	
	let modifier = abilityModifier;
	if (isProficient) {
		modifier += getProficiencyBonus();
	}
	if (hasExpertise) {
		modifier += getProficiencyBonus(); // Expertise adds proficiency again
	}
	if (!isProficient && hasJackOfAllTrades) {
		modifier += 1; // Jack of All Trades adds +1 to unproficient skills
	}
	
	return modifier;
}

/**
 * Calculate saving throw modifier
 */
function getSavingThrowModifier(
	character: Character,
	abilityName: string,
	abilityModifier: number
): number {
	// Check if proficient in this saving throw
	const savingThrowName = `${abilityName} saving throw`;
	const isProficient = character.proficiencies?.some(
		prof => prof.toLowerCase().includes(savingThrowName.toLowerCase())
	) || false;
	
	return isProficient ? abilityModifier + getProficiencyBonus() : abilityModifier;
}

/**
 * Get class data by class name
 */
function getClassData(className: string | undefined) {
	if (!className) return null;
	
	const classMap: Record<string, any> = {
		'Barbarian': barbarian,
		'Bard': bard,
		'Cleric': cleric,
		'Druid': druid,
		'Fighter': fighter,
		'Monk': monk,
		'Paladin': paladin,
		'Ranger': ranger,
		'Rogue': rogue,
		'Sorcerer': sorcerer,
		'Warlock': warlock,
		'Wizard': wizard
	};
	
	return classMap[className] || null;
}

/**
 * Armor database with base AC and DEX modifier limits
 */
const armorData: Record<string, { type: 'light' | 'medium' | 'heavy'; baseAC: number; maxDex: number | null }> = {
	'padded': { type: 'light', baseAC: 11, maxDex: null },
	'padded armor': { type: 'light', baseAC: 11, maxDex: null },
	'leather': { type: 'light', baseAC: 11, maxDex: null },
	'leather armor': { type: 'light', baseAC: 11, maxDex: null },
	'studded leather': { type: 'light', baseAC: 12, maxDex: null },
	'studded leather armor': { type: 'light', baseAC: 12, maxDex: null },
	'hide': { type: 'medium', baseAC: 12, maxDex: 2 },
	'hide armor': { type: 'medium', baseAC: 12, maxDex: 2 },
	'chain shirt': { type: 'medium', baseAC: 13, maxDex: 2 },
	'scale mail': { type: 'medium', baseAC: 14, maxDex: 2 },
	'breastplate': { type: 'medium', baseAC: 14, maxDex: 2 },
	'half plate': { type: 'medium', baseAC: 15, maxDex: 2 },
	'ring mail': { type: 'heavy', baseAC: 14, maxDex: 0 },
	'chain mail': { type: 'heavy', baseAC: 16, maxDex: 0 },
	'splint': { type: 'heavy', baseAC: 17, maxDex: 0 },
	'splint armor': { type: 'heavy', baseAC: 17, maxDex: 0 },
	'plate': { type: 'heavy', baseAC: 18, maxDex: 0 },
	'plate armor': { type: 'heavy', baseAC: 18, maxDex: 0 }
};

/**
 * Get armor data from inventory
 * Returns the first armor found in inventory
 */
function getEquippedArmor(inventory: string[] | undefined): { type: string; baseAC: number; maxDex: number | null } | null {
	if (!inventory || inventory.length === 0) return null;
	
	for (const item of inventory) {
		const normalized = item.toLowerCase();
		for (const [armorName, data] of Object.entries(armorData)) {
			if (normalized.includes(armorName)) {
				return { type: data.type, baseAC: data.baseAC, maxDex: data.maxDex };
			}
		}
	}
	
	return null;
}

/**
 * Calculate AC from armor and DEX modifier
 */
function calculateArmorAC(armor: { baseAC: number; maxDex: number | null }, dexMod: number): number {
	if (armor.maxDex === null) {
		// Light armor: no DEX limit
		return armor.baseAC + dexMod;
	} else if (armor.maxDex === 0) {
		// Heavy armor: no DEX bonus
		return armor.baseAC;
	} else {
		// Medium armor: DEX capped at maxDex
		return armor.baseAC + Math.min(dexMod, armor.maxDex);
	}
}

/**
 * Determine if character is wearing armor from inventory
 */
function isWearingArmor(inventory: string[] | undefined): boolean {
	if (!inventory || inventory.length === 0) {
		console.log('[isWearingArmor] No inventory');
		return false;
	}
	
	console.log('[isWearingArmor] Checking inventory:', inventory);
	
	const armorKeywords = [
		'padded', 'leather', 'studded leather',
		'hide', 'chain shirt', 'scale mail', 'breastplate', 'half plate',
		'ring mail', 'chain mail', 'splint', 'plate'
	];
	
	const hasArmor = inventory.some(item => {
		const itemLower = item.toLowerCase();
		const match = armorKeywords.some(keyword => itemLower.includes(keyword));
		if (match) {
			console.log(`[isWearingArmor] Found armor: "${item}"`);
		}
		return match;
	});
	
	console.log('[isWearingArmor] Result:', hasArmor);
	return hasArmor;
}

/**
 * Determine if character has a shield from inventory
 */
function hasShield(inventory: string[] | undefined): boolean {
	if (!inventory || inventory.length === 0) {
		console.log('[hasShield] No inventory');
		return false;
	}
	
	console.log('[hasShield] Checking inventory:', inventory);
	const hasShieldItem = inventory.some(item => item.toLowerCase().includes('shield'));
	console.log('[hasShield] Result:', hasShieldItem);
	return hasShieldItem;
}

/**
 * Calculate hit points for level 3 character
 * HP = Hit Die Max (level 1) + Hit Die Average (level 2) + Hit Die Average (level 3) + (CON mod × 3)
 */
function calculateHitPoints(
	character: Character,
	conMod: number
): number {
	// Get class data to find hit die
	const classData = getClassData(character.class);
	if (!classData?.hitDie) return 0;
	
	// Parse hit die (e.g., 'd12' -> 12)
	const match = classData.hitDie.match(/d(\d+)/);
	if (!match) return 0;
	
	const dieMax = parseInt(match[1], 10);
	const averagePerDie = Math.floor(dieMax / 2) + 1;
	
	console.log('\n=== HP CALCULATION ===');
	console.log(`Class: ${character.class}, Hit Die: ${classData.hitDie}`);
	console.log(`Die Max: ${dieMax}, Average per Die: ${averagePerDie}`);
	console.log(`CON Modifier: ${conMod >= 0 ? '+' : ''}${conMod}`);
	
	// Level 1: max die
	// Level 2-3: average die
	let hp = dieMax + (averagePerDie * 2) + (conMod * 3);
	console.log(`Formula: ${dieMax} (L1 max) + ${averagePerDie}×2 (L2-3 avg) + ${conMod}×3 (CON) = ${hp}`);
	
	// Hill Dwarf Dwarven Toughness: +1 HP per level
	if (character.features?.includes('Dwarven Toughness')) {
		console.log(`Dwarven Toughness: +3 HP (level 3)`);
		hp += 3; // Level 3 character
	}
	
	const finalHP = Math.max(hp, 3);
	console.log(`Final HP: ${finalHP}`);
	console.log('======================\n');
	
	return finalHP; // Minimum 3 HP (1 per level)
}

/**
 * Calculate speed for character
 * Base speed from race + class modifiers
 */
function calculateSpeed(
	character: Character,
	inventory: string[] | undefined
): string {
	// Parse base speed from character store (set by race)
	// Speed is stored as string like '30 ft.' or '35 ft.'
	const baseSpeedMatch = character.speed?.toString().match(/(\d+)/);
	let speed = baseSpeedMatch ? parseInt(baseSpeedMatch[1], 10) : 30;
	
	console.log('\n=== SPEED CALCULATION ===');
	console.log(`Race: ${character.race}${character.subrace ? ` (${character.subrace})` : ''}`);
	console.log(`Base Speed from character.speed: ${character.speed}`);
	console.log(`Parsed Base Speed: ${speed} ft`);
	
	// Monk Unarmored Movement: +10 ft at level 3 (if not wearing armor AND not using shield)
	if (character.class === 'Monk' && character.features?.includes('Unarmored Movement')) {
		const wearingArmor = isWearingArmor(inventory);
		const usingShield = hasShield(inventory);
		
		console.log(`Monk Unarmored Movement: wearing armor=${wearingArmor}, using shield=${usingShield}`);
		
		if (!wearingArmor && !usingShield) {
			console.log(`Unarmored Movement bonus: +10 ft`);
			speed += 10;
		} else {
			console.log(`Unarmored Movement not applied (wearing armor or shield)`);
		}
	}
	
	console.log(`Final Speed: ${speed} ft`);
	console.log('=========================\n');
	
	return `${speed} ft`;
}

/**
 * Calculate armor class
 * Considers equipment AC, Unarmored Defense, and conditional bonuses
 * 
 * **Complete List of AC Sources in D&D 5e (Level 3):**
 * 
 * **Base AC Calculations (mutually exclusive - choose highest):**
 * 1. Unarmored: 10 + DEX modifier
 * 2. Armor: Armor base AC + DEX modifier (limited by armor type)
 *    - Light armor: base + full DEX (e.g., leather 11 + DEX)
 *    - Medium armor: base + min(DEX, 2) (e.g., scale mail 14 + min(DEX, 2))
 *    - Heavy armor: base + 0 (e.g., chain mail 16)
 * 3. Barbarian Unarmored Defense: 10 + DEX + CON (no armor, shields allowed)
 * 4. Monk Unarmored Defense: 10 + DEX + WIS (no armor, no shields)
 * 5. Draconic Sorcerer (Draconic Resilience): 13 + DEX (no armor, shields allowed)
 * 6. Warlock (Armor of Shadows invocation): 13 + DEX (no armor, shields allowed, at-will Mage Armor)
 * 
 * **AC Bonuses (stackable with base AC):**
 * 1. Shield: +2 AC (not compatible with Monk Unarmored Defense)
 * 2. Defense Fighting Style (Fighter/Paladin/Ranger): +1 AC when wearing armor
 * 
 * **Temporary AC Bonuses (not auto-calculated, require spell slots or resources):**
 * - Shield spell: +5 AC (reaction, 1 round)
 * - Shield of Faith spell: +2 AC (concentration, 10 minutes)
 * - Warding Bond spell: +1 AC (concentration, requires spell slot)
 * - Haste spell: +2 AC (concentration, 1 minute)
 * - These are NOT included in base AC calculation
 * 
 * **Species/Background AC Bonuses:**
 * - None in standard D&D 5e Player's Handbook races and backgrounds
 * 
 * **Other Class Features at Level 3:**
 * - No other class features provide AC bonuses at level 3
 * - Bladesong (Wizard) requires level 2+ and is temporary (bonus action activation)
 * - Forge Cleric bonus requires level 6
 * - Other defensive features come at higher levels
 */
function calculateArmorClass(
	character: Character,
	dexMod: number,
	conMod: number,
	wisMod: number,
	inventory: string[] | undefined
): number {
	const wearingArmor = isWearingArmor(inventory);
	const usingShield = hasShield(inventory);
	let bestAC = 10 + dexMod; // Default unarmored AC
	
	console.log('\n=== AC CALCULATION ===');
	console.log(`Class: ${character.class}`);
	console.log(`DEX: ${dexMod >= 0 ? '+' : ''}${dexMod}, CON: ${conMod >= 0 ? '+' : ''}${conMod}, WIS: ${wisMod >= 0 ? '+' : ''}${wisMod}`);
	console.log(`Wearing Armor: ${wearingArmor}, Using Shield: ${usingShield}`);
	
	// If wearing armor, calculate AC from armor + DEX
	if (wearingArmor) {
		const armor = getEquippedArmor(inventory);
		if (armor) {
			bestAC = calculateArmorAC(armor, dexMod);
			console.log(`Armor: ${armor.type} (base ${armor.baseAC}, max DEX ${armor.maxDex !== null ? armor.maxDex : 'unlimited'})`);
			console.log(`Armor AC: ${armor.baseAC} + ${armor.maxDex === null ? dexMod : (armor.maxDex === 0 ? 0 : Math.min(dexMod, armor.maxDex))} = ${bestAC}`);
		} else {
			console.log(`WARNING: Wearing armor but couldn't find armor data in inventory`);
		}
	} else if (!wearingArmor) {
		// Check for Unarmored Defense and other special AC calculations
		const alternatives: number[] = [];
		let hasSpecialUnarmoredDefense = false;
		
		// Barbarian Unarmored Defense: 10 + DEX + CON (shields allowed)
		if (character.class === 'Barbarian' && character.features?.includes('Unarmored Defense')) {
			const barbarianAC = 10 + dexMod + conMod;
			console.log(`Barbarian Unarmored Defense: 10 + ${dexMod} + ${conMod} = ${barbarianAC}`);
			alternatives.push(barbarianAC);
			hasSpecialUnarmoredDefense = true;
		}
		
		// Monk Unarmored Defense: 10 + DEX + WIS (shields NOT allowed)
		if (character.class === 'Monk' && character.features?.includes('Unarmored Defense') && !usingShield) {
			const monkAC = 10 + dexMod + wisMod;
			console.log(`Monk Unarmored Defense: 10 + ${dexMod} + ${wisMod} = ${monkAC}`);
			alternatives.push(monkAC);
			hasSpecialUnarmoredDefense = true;
		}
		
		// Draconic Sorcerer: 13 + DEX (shields allowed)
		if (character.class === 'Sorcerer' && character.features?.includes('Draconic Resilience')) {
			const draconicAC = 13 + dexMod;
			console.log(`Draconic Resilience: 13 + ${dexMod} = ${draconicAC}`);
			alternatives.push(draconicAC);
			hasSpecialUnarmoredDefense = true;
		}
		
		// Warlock Armor of Shadows: 13 + DEX (at-will Mage Armor, shields allowed)
		if (character.class === 'Warlock' && character.features?.includes('Armor of Shadows')) {
			const armorOfShadowsAC = 13 + dexMod;
			console.log(`Armor of Shadows: 13 + ${dexMod} = ${armorOfShadowsAC}`);
			alternatives.push(armorOfShadowsAC);
			hasSpecialUnarmoredDefense = true;
		}
		
		// Only add base unarmored AC if no special Unarmored Defense features
		if (!hasSpecialUnarmoredDefense) {
			const baseAC = 10 + dexMod;
			console.log(`Base unarmored AC: 10 + ${dexMod} = ${baseAC}`);
			alternatives.push(baseAC);
		}
		
		bestAC = Math.max(...alternatives);
		console.log(`Best AC from alternatives: ${bestAC}`);
	}
	
	// Add shield bonus (+2) if using shield and it's allowed
	if (usingShield) {
		// Monk Unarmored Defense does NOT allow shields
		const isMonkWithUnarmored = character.class === 'Monk' && character.features?.includes('Unarmored Defense');
		if (!isMonkWithUnarmored) {
			console.log(`Shield bonus: +2`);
			bestAC += 2;
		} else {
			console.log(`Shield bonus not applied (Monk Unarmored Defense)`);
		}
	}
	
	// Defense Fighting Style: +1 AC when wearing armor
	if (wearingArmor && character.features?.includes('Defense Fighting Style')) {
		console.log(`Defense Fighting Style: +1`);
		bestAC += 1;
	}
	
	console.log(`Final AC: ${bestAC}`);
	console.log('======================\n');
	
	return bestAC;
}

/**
 * Calculate attack data from weapon names
 * Looks up weapon properties and calculates attack bonus and damage
 */
function calculateAttacks(
	character: Character,
	strMod: number,
	dexMod: number
): Array<{ name: string; bonus: string; damage: string }> {
	if (!character.attacks || character.attacks.length === 0) {
		return [];
	}
	
	const proficiencyBonus = getProficiencyBonus();
	const attacks: Array<{ name: string; bonus: string; damage: string }> = [];
	
	// Assume proficiency with all weapons in attacks array
	// Players can only select weapons they're proficient with through the equipment tab
	
	for (const weaponName of character.attacks.slice(0, 5)) {
		const weaponData = getWeaponData(weaponName);
		
		if (!weaponData) {
			// If weapon not found in database, still add proficiency bonus
			attacks.push({
				name: weaponName,
				bonus: formatModifier(proficiencyBonus), // Still add prof bonus
				damage: ''
			});
			continue;
		}
		
		// Determine which ability modifier to use
		let abilityMod: number;
		if (weaponData.attackAbility === 'EITHER') {
			// Finesse weapons - use higher of STR or DEX
			abilityMod = Math.max(strMod, dexMod);
		} else if (weaponData.attackAbility === 'DEX') {
			abilityMod = dexMod;
		} else {
			// STR
			abilityMod = strMod;
		}
		
		// Calculate attack bonus: ability modifier + proficiency bonus
		// Always add proficiency since player can only select weapons they're proficient with
		const attackBonus = abilityMod + proficiencyBonus;
		
		// Format damage: dice + ability modifier + damage type
		let damageWithModifier: string;
		if (weaponData.damage === '0') {
			// Special weapons like net - no damage
			damageWithModifier = weaponData.damageType;
		} else if (!weaponData.damage.includes('d')) {
			// Flat damage weapons (like blowgun with damage "1")
			// Evaluate the expression: base damage + ability modifier
			const baseDamage = parseInt(weaponData.damage) || 0;
			const totalDamage = baseDamage + abilityMod;
			damageWithModifier = `${totalDamage} ${weaponData.damageType}`;
		} else {
			// Normal dice-based weapons
			damageWithModifier = `${weaponData.damage}${abilityMod !== 0 ? formatModifier(abilityMod) : ''} ${weaponData.damageType}`;
		}
		
		attacks.push({
			name: weaponData.name,
			bonus: formatModifier(attackBonus),
			damage: damageWithModifier.trim()
		});
	}
	
	return attacks;
}

/**
 * Format equipment with smart filtering and organization
 * - Filters out weapons (since they go in attacks section)
 * - Groups ranged weapons with their ammunition
 * - Organizes equipment in logical groups
 */
function formatEquipment(inventory: string[]): string {
	// Equipment categorization
	const armor: string[] = [];
	const shields: string[] = [];
	const tools: string[] = [];
	const instruments: string[] = [];
	const packs: string[] = [];
	const consumables: string[] = [];
	const misc: string[] = [];
	
	// Musical instruments list (for detection)
	const musicalInstruments = [
		'bagpipes', 'drum', 'dulcimer', 'flute', 'lute', 'lyre', 
		'horn', 'pan flute', 'shawm', 'viol', 'harp', 'violin'
	];
	
	// Weapons to exclude from equipment (they go in attacks section)
	const weaponKeywords = [
		'sword', 'axe', 'dagger', 'mace', 'hammer', 'spear', 'javelin', 'bow', 'crossbow',
		'club', 'greatclub', 'handaxe', 'light hammer', 'quarterstaff', 'sickle', 'flail',
		'glaive', 'greataxe', 'greatsword', 'halberd', 'lance', 'maul', 'morningstar',
		'pike', 'rapier', 'scimitar', 'shortsword', 'trident', 'war pick', 'warhammer',
		'whip', 'blowgun', 'hand crossbow', 'heavy crossbow', 'longbow', 'net', 'dart'
	];
	
	// Processed items to avoid duplicates (e.g., bolts already grouped with crossbow)
	const processed = new Set<number>();
	
	// Process each item
	for (let i = 0; i < inventory.length; i++) {
		if (processed.has(i)) continue;
		
		const item = inventory[i];
		const itemLower = item.toLowerCase();
		
		// Check if it's a shield
		if (itemLower === 'shield' || itemLower === 'shields') {
			shields.push(item);
			continue;
		}
		
		// Check if it's armor
		const isArmor = itemLower.includes('armor') || itemLower.includes('mail') || 
					itemLower.includes('studded') || itemLower.includes('plate') ||
					itemLower.includes('chain') || itemLower.includes('leather') ||
					itemLower.includes('padded') || itemLower.includes('hide') ||
					itemLower.includes('scale') || itemLower.includes('breastplate') ||
					itemLower.includes('half plate') || itemLower.includes('ring mail') ||
					itemLower.includes('splint');
			
		if (isArmor) {
			armor.push(item);
			continue;
		}
		
		// Check if it's a weapon (exclude from equipment)
		const isWeapon = weaponKeywords.some(keyword => itemLower.includes(keyword));
		if (isWeapon) {
			// Special case: ranged weapons with ammunition - skip both
			if (itemLower.includes('crossbow') || itemLower.includes('bow')) {
				// Find and mark ammunition as processed
				for (let j = i + 1; j < inventory.length; j++) {
					const nextItem = inventory[j].toLowerCase();
					if (nextItem.includes('bolt') || nextItem.includes('arrow')) {
						processed.add(j);
						break;
					}
				}
			}
			continue; // Skip weapons - they go in attacks section
		}
		
		// Check if it's an equipment pack (these get their own line)
		if (itemLower.includes('pack') && itemLower.includes('(includes:')) {
			packs.push(item);
			continue;
		}
		
		// Check if it's a musical instrument
		const isInstrument = musicalInstruments.some(inst => itemLower.includes(inst));
		if (isInstrument) {
			instruments.push(item);
			continue;
		}
		
		// Check if it's a tool or kit
		if (itemLower.includes('tools') || itemLower.includes('kit') || itemLower.includes('set')) {
			tools.push(item);
			continue;
		}
		
		// Check if it's consumable
		if (itemLower.includes('potion') || itemLower.includes('scroll') || 
			itemLower.includes('poison') || itemLower.includes('rune')) {
			consumables.push(item);
			continue;
		}
		
		// Everything else is misc
		misc.push(item);
	}
	
	// Build organized output with smart grouping
	const lines: string[] = [];
	
	// Armor & Shields (combined on one line)
	const defensiveGear: string[] = [...armor, ...shields];
	if (defensiveGear.length > 0) {
		lines.push(defensiveGear.join(', '));
	}
	
	// Tools & Instruments (combined on one line)
	const proficiencyItems: string[] = [...tools, ...instruments];
	if (proficiencyItems.length > 0) {
		lines.push(proficiencyItems.join(', '));
	}
	
	// Equipment Packs (each on its own line - they're long)
	if (packs.length > 0) {
		lines.push(...packs);
	}
	
	// Consumables (grouped on one line)
	if (consumables.length > 0) {
		lines.push(consumables.join(', '));
	}
	
	// Misc items (grouped on one line)
	if (misc.length > 0) {
		lines.push(misc.join(', '));
	}
	
	return lines.join('\n');
}

/**
 * Format proficiencies and languages grouped by type
 * Armor, weapons, instruments, tools, and languages are each combined into single lines
 */
function formatProficienciesAndLanguages(character: Character): string {
	const classData = getClassData(character.class);
	
	// Musical instruments list
	const instruments = [
		'Bagpipes', 'Drums', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 
		'Horn', 'Pan flute', 'Shawm', 'Viol'
	];
	
	// Specific weapon names (for racial/class proficiencies)
	const specificWeapons = [
		// Simple Melee
		'Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer', 
		'Mace', 'Quarterstaff', 'Sickle', 'Spear',
		// Simple Ranged
		'Light Crossbow', 'Dart', 'Shortbow', 'Sling',
		// Martial Melee
		'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd',
		'Lance', 'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier',
		'Scimitar', 'Shortsword', 'Trident', 'War Pick', 'Warhammer', 'Whip',
		// Martial Ranged
		'Blowgun', 'Hand Crossbow', 'Heavy Crossbow', 'Longbow', 'Net'
	];
	
	// Categorize proficiencies
	let armorProfs: string[] = [];
	let weaponProfs: string[] = [];
	const instrumentProfs: string[] = [];
	const toolProfs: string[] = [];
	const otherProfs: string[] = [];
	
	// Add class armor proficiencies
	if (classData?.armorProficiencies) {
		armorProfs.push(...classData.armorProficiencies);
	}
	
	// Add class weapon proficiencies
	if (classData?.weaponProficiencies) {
		weaponProfs.push(...classData.weaponProficiencies);
	}
	
	// Process character proficiencies array (from backgrounds, races, features)
	for (const prof of character.proficiencies || []) {
		// Skip saving throws
		if (prof.toLowerCase().includes('saving throw')) {
			continue;
		}
		
		// Check if it's an armor proficiency
		if (prof.includes('Armor') || prof === 'Shields') {
			if (!armorProfs.includes(prof)) {
				armorProfs.push(prof);
			}
		}
		// Check if it's a weapon proficiency (categories or specific weapons)
		else if (prof.includes('Weapons') || prof.includes('weapon') || specificWeapons.includes(prof)) {
			if (!weaponProfs.includes(prof)) {
				weaponProfs.push(prof);
			}
		}
		// Check if it's a musical instrument
		else if (instruments.includes(prof)) {
			instrumentProfs.push(prof);
		}
		// Check if it's a tool (ends with 'kit' or 'tools')
		else if (prof.toLowerCase().includes('kit') || prof.toLowerCase().includes('tools')) {
			toolProfs.push(prof);
		}
		// Check if it's a gaming set
		else if (prof.toLowerCase().includes('set')) {
			otherProfs.push(prof);
		}
		// Everything else
		else {
			otherProfs.push(prof);
		}
	}
	
	// Deduplicate armor proficiencies
	const hasAllArmor = armorProfs.some(prof => prof.toLowerCase().includes('all armor'));
	if (hasAllArmor) {
		// Remove specific armor types since "All Armor" covers everything
		const specificArmorTypes = ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'];
		armorProfs = armorProfs.filter(prof => !specificArmorTypes.includes(prof));
	}

	// Deduplicate weapon proficiencies
	const hasAllWeapons = weaponProfs.some(prof => prof.toLowerCase().includes('all weapons'));
	const hasSimpleWeapons = weaponProfs.some(prof => prof.toLowerCase().includes('simple weapons'));
	const hasMartialWeapons = weaponProfs.some(prof => prof.toLowerCase().includes('martial weapons'));
	
	if (hasAllWeapons) {
		// Remove all weapon categories and specific weapons since "All Weapons" covers everything
		const weaponCategories = ['Simple Weapons', 'Martial Weapons'];
		const specificWeaponsToRemove = specificWeapons.filter(weapon => 
			weaponProfs.includes(weapon)
		);
		weaponProfs = weaponProfs.filter(prof => 
			!weaponCategories.includes(prof) && !specificWeaponsToRemove.includes(prof)
		);
	} else {
		// If we have both Simple and Martial, remove individual simple weapons
		if (hasSimpleWeapons && hasMartialWeapons) {
			const simpleWeaponNames = [
				'Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer',
				'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Light Crossbow', 'Dart',
				'Shortbow', 'Sling'
			];
			weaponProfs = weaponProfs.filter(prof => !simpleWeaponNames.includes(prof));
		}
		// If we have Simple Weapons but not Martial, remove individual simple weapons
		else if (hasSimpleWeapons && !hasMartialWeapons) {
			const simpleWeaponNames = [
				'Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer',
				'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Light Crossbow', 'Dart',
				'Shortbow', 'Sling'
			];
			weaponProfs = weaponProfs.filter(prof => !simpleWeaponNames.includes(prof));
		}
		// If we have Martial Weapons but not Simple, remove individual martial weapons
		else if (hasMartialWeapons && !hasSimpleWeapons) {
			const martialWeaponNames = [
				'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd',
				'Lance', 'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier',
				'Scimitar', 'Shortsword', 'Trident', 'War Pick', 'Warhammer', 'Whip',
				'Blowgun', 'Hand Crossbow', 'Heavy Crossbow', 'Longbow', 'Net'
			];
			weaponProfs = weaponProfs.filter(prof => !martialWeaponNames.includes(prof));
		}
	}

	// Build output lines
	const lines: string[] = [];
	
	// Armor proficiencies (single line, bold title)
	if (armorProfs.length > 0) {
		lines.push(`<<BOLD:Armor:>> ${armorProfs.join(', ')}`);
	}
	
	// Weapon proficiencies (single line, bold title)
	if (weaponProfs.length > 0) {
		lines.push(`<<BOLD:Weapons:>> ${weaponProfs.join(', ')}`);
	}
	
	// Musical instruments (single line, bold title)
	if (instrumentProfs.length > 0) {
		lines.push(`<<BOLD:Instruments:>> ${instrumentProfs.join(', ')}`);
	}
	
	// Tools (single line, bold title)
	if (toolProfs.length > 0) {
		lines.push(`<<BOLD:Tools:>> ${toolProfs.join(', ')}`);
	}
	
	// Other proficiencies (single line, bold title)
	if (otherProfs.length > 0) {
		lines.push(`<<BOLD:Other:>> ${otherProfs.join(', ')}`);
	}
	
	// Languages (single line, bold title)
	if (character.languages && character.languages.length > 0) {
		if (lines.length > 0) {
			lines.push(''); // Empty line before languages
		}
		lines.push(`<<BOLD:Languages:>> ${character.languages.join(', ')}`);
	}
	
	return lines.join('\n');
}

/**
 * Map character store data to PDF field data
 */
export function mapCharacterToSheetData(character: Character): CharacterSheetData {
	// Calculate ability modifiers
	const strMod = getModifier(character.strength);
	const dexMod = getModifier(character.dexterity);
	const conMod = getModifier(character.constitution);
	const intMod = getModifier(character.intelligence);
	const wisMod = getModifier(character.wisdom);
	const chaMod = getModifier(character.charisma);
	
	// Format class and level
	const classAndLevel = character.class 
		? `${character.class} ${character.subclass ? `(${character.subclass}) ` : ''}`
		: '';
	
	// Format species (with subrace if applicable)
	const species = character.race
		? character.subrace
			? `${character.subrace} (${character.race})`
			: character.race
		: '';
	
	return {
		// Page 1 - Header
		characterName: character.name || '',
		classAndLevel,
		background: character.background || '',
		species,
		alignment: character.alignment || '',
		experiencePoints: '900', // Level 3 default
		proficiencyBonus: formatModifier(getProficiencyBonus()),
		
		// Page 1 - Ability Scores
		abilityScores: {
			strength: {
				score: String(character.strength || 10),
				modifier: formatModifier(strMod)
			},
			dexterity: {
				score: String(character.dexterity || 10),
				modifier: formatModifier(dexMod)
			},
			constitution: {
				score: String(character.constitution || 10),
				modifier: formatModifier(conMod)
			},
			intelligence: {
				score: String(character.intelligence || 10),
				modifier: formatModifier(intMod)
			},
			wisdom: {
				score: String(character.wisdom || 10),
				modifier: formatModifier(wisMod)
			},
			charisma: {
				score: String(character.charisma || 10),
				modifier: formatModifier(chaMod)
			}
		},
		
		// Page 1 - Saving Throws
		savingThrows: {
			strength: `${formatModifier(getSavingThrowModifier(character, 'Strength', strMod))} Strength Save`,
			dexterity: `${formatModifier(getSavingThrowModifier(character, 'Dexterity', dexMod))} Dexterity Save`,
			constitution: `${formatModifier(getSavingThrowModifier(character, 'Constitution', conMod))} Constitution Save`,
			intelligence: `${formatModifier(getSavingThrowModifier(character, 'Intelligence', intMod))} Intelligence Save`,
			wisdom: `${formatModifier(getSavingThrowModifier(character, 'Wisdom', wisMod))} Wisdom Save`,
			charisma: `${formatModifier(getSavingThrowModifier(character, 'Charisma', chaMod))} Charisma Save`
		},
		
		// Page 1 - Skills (ability abbreviations drawn separately in gray)
		skills: {
			acrobatics: `${formatModifier(getSkillModifier(character, dexMod, 'Acrobatics'))} Acrobatics`,
			animalHandling: `${formatModifier(getSkillModifier(character, wisMod, 'Animal Handling'))} Animal Handling`,
			arcana: `${formatModifier(getSkillModifier(character, intMod, 'Arcana'))} Arcana`,
			athletics: `${formatModifier(getSkillModifier(character, strMod, 'Athletics'))} Athletics`,
			deception: `${formatModifier(getSkillModifier(character, chaMod, 'Deception'))} Deception`,
			history: `${formatModifier(getSkillModifier(character, intMod, 'History'))} History`,
			insight: `${formatModifier(getSkillModifier(character, wisMod, 'Insight'))} Insight`,
			intimidation: `${formatModifier(getSkillModifier(character, chaMod, 'Intimidation'))} Intimidation`,
			investigation: `${formatModifier(getSkillModifier(character, intMod, 'Investigation'))} Investigation`,
			medicine: `${formatModifier(getSkillModifier(character, wisMod, 'Medicine'))} Medicine`,
			nature: `${formatModifier(getSkillModifier(character, intMod, 'Nature'))} Nature`,
			perception: `${formatModifier(getSkillModifier(character, wisMod, 'Perception'))} Perception`,
			performance: `${formatModifier(getSkillModifier(character, chaMod, 'Performance'))} Performance`,
			persuasion: `${formatModifier(getSkillModifier(character, chaMod, 'Persuasion'))} Persuasion`,
			religion: `${formatModifier(getSkillModifier(character, intMod, 'Religion'))} Religion`,
			sleightOfHand: `${formatModifier(getSkillModifier(character, dexMod, 'Sleight of Hand'))} Sleight of Hand`,
			stealth: `${formatModifier(getSkillModifier(character, dexMod, 'Stealth'))} Stealth`,
			survival: `${formatModifier(getSkillModifier(character, wisMod, 'Survival'))} Survival`
		},
		
		passivePerception: String(10 + getSkillModifier(character, wisMod, 'Perception')),
		
		// Page 1 - Combat Stats (calculated from derived stats functions)
		armorClass: String(calculateArmorClass(character, dexMod, conMod, wisMod, character.inventory)),
		initiative: formatModifier(dexMod),
		speed: calculateSpeed(character, character.inventory),
		hitPointMaximum: String(calculateHitPoints(character, conMod)),
		currentHitPoints: String(calculateHitPoints(character, conMod)), // Starts at max
		temporaryHitPoints: '0',
		hitDice: '3d8', // Level 3 default, could be calculated based on class
		
		// Page 1 - Attacks
		attacks: calculateAttacks(character, strMod, dexMod),
		
		// Page 1 - Equipment & Features
		equipment: formatEquipment(character.inventory || []),
		proficienciesAndLanguages: formatProficienciesAndLanguages(character),
		featuresAndTraits: formatFeaturesForPDF(character.features || [], character),
		
		// Page 2 - Character Details (placeholders for now)
		age: '',
		height: '',
		weight: '',
		eyes: '',
		skin: '',
		hair: '',
		
		// Page 2 - Backstory (placeholders)
		personalityTraits: '',
		ideals: '',
		bonds: '',
		flaws: '',
		
		// Page 2 - Additional Content
		additionalFeatures: '', // Could add spell list here
		treasureAndNotes: ''
	};
}
