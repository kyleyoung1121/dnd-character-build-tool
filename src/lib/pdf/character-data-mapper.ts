/**
 * Character Data Mapper
 * 
 * This service maps data from the character store to the PDF field structure.
 * It handles data transformation, formatting, and calculation of derived values.
 */

import type { Character } from '$lib/stores/character_store';
import { getWeaponData } from '$lib/data/equipment/weapon-data';
import { formatFeaturesForPDF } from '$lib/data/features/feature-data';

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
	
	let modifier = abilityModifier;
	if (isProficient) {
		modifier += getProficiencyBonus();
	}
	if (hasExpertise) {
		modifier += getProficiencyBonus(); // Expertise adds proficiency again
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
		
		// Page 1 - Combat Stats
		armorClass: String(character.ac || 10),
		initiative: formatModifier(dexMod),
		speed: `${character.speed || 30} ft`,
		hitPointMaximum: String(character.hp || 0),
		currentHitPoints: String(character.hp || 0), // Starts at max
		temporaryHitPoints: '0',
		hitDice: '3d8', // Level 3 default, could be calculated based on class
		
		// Page 1 - Attacks
		attacks: calculateAttacks(character, strMod, dexMod),
		
		// Page 1 - Equipment & Features
		equipment: (character.inventory || []).join('\n'),
		proficienciesAndLanguages: [
			...(character.proficiencies || []).map(p => `• ${p}`),
			'',
			'Languages:',
			...(character.languages || []).map(l => `• ${l}`)
		].join('\n'),
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
