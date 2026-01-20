/**
 * Proficiency to Equipment Mapping System
 * 
 * This system automatically grants equipment items when certain proficiencies are selected.
 * It tracks which proficiencies should grant physical items vs. which are proficiency-only.
 * 
 * **Exceptions:**
 * - Vehicles (land/water): Proficiency only, no physical vehicle granted
 * - Thieves' Tools from Rogue class: Already included in Rogue starter equipment
 */

export interface ProficiencyEquipmentRule {
	/** The exact proficiency string to match */
	proficiency: string;
	
	/** The equipment item(s) to grant (null if proficiency-only) */
	equipment: string | null;
	
	/** Source that grants this proficiency */
	source: string;
	
	/** Whether this proficiency already grants equipment through starter equipment */
	alreadyInStarterEquipment?: boolean;
}

/**
 * Master list of proficiency-to-equipment mappings
 * 
 * Sources covered:
 * - Bard: Musical instruments (3 proficiencies → 3 instruments)
 * - Fighter (Battle Master): Artisan's tools (Student of War)
 * - Rogue (Assassin): Disguise kit, Poisoner's kit
 * - Dwarves (Hill/Mountain): Artisan's tools
 * - Rock Gnome: Tinker's tools
 * - Backgrounds: All tool/instrument/gaming set proficiencies
 */
export const PROFICIENCY_EQUIPMENT_RULES: ProficiencyEquipmentRule[] = [
	// ===== MUSICAL INSTRUMENTS =====
	{ proficiency: 'Bagpipes', equipment: 'Bagpipes', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Drum', equipment: 'Drum', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Drums', equipment: 'Drums', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Dulcimer', equipment: 'Dulcimer', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Flute', equipment: 'Flute', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Lute', equipment: 'Lute', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Lyre', equipment: 'Lyre', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Horn', equipment: 'Horn', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Pan flute', equipment: 'Pan flute', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Shawm', equipment: 'Shawm', source: 'bard|entertainer|outlander' },
	{ proficiency: 'Viol', equipment: 'Viol', source: 'bard|entertainer|outlander' },

	// ===== ARTISAN'S TOOLS =====
	{ proficiency: "Alchemist's supplies", equipment: "Alchemist's supplies", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Brewer's supplies", equipment: "Brewer's supplies", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Calligrapher's supplies", equipment: "Calligrapher's supplies", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Carpenter's tools", equipment: "Carpenter's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Cartographer's tools", equipment: "Cartographer's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Cobbler's tools", equipment: "Cobbler's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Cook's utensils", equipment: "Cook's utensils", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Glassblower's tools", equipment: "Glassblower's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Jeweler's tools", equipment: "Jeweler's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Leatherworker's tools", equipment: "Leatherworker's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Mason's tools", equipment: "Mason's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Painter's supplies", equipment: "Painter's supplies", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Potter's tools", equipment: "Potter's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Smith's tools", equipment: "Smith's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Tinker's tools", equipment: "Tinker's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan|rock_gnome' },
	{ proficiency: "Weaver's tools", equipment: "Weaver's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },
	{ proficiency: "Woodcarver's tools", equipment: "Woodcarver's tools", source: 'battle_master|dwarf|hill_dwarf|mountain_dwarf|folk_hero|guild_artisan' },

	// ===== GAMING SETS =====
	{ proficiency: 'Dice set', equipment: 'Dice set', source: 'criminal|charlatan|noble|knight|soldier' },
	{ proficiency: 'Dragonchess set', equipment: 'Dragonchess set', source: 'criminal|charlatan|noble|knight|soldier' },
	{ proficiency: 'Playing card set', equipment: 'Playing card set', source: 'criminal|charlatan|noble|knight|soldier' },
	{ proficiency: 'Three-Dragon Ante set', equipment: 'Three-Dragon Ante set', source: 'criminal|charlatan|noble|knight|soldier' },

	// ===== SPECIALIZED TOOLS =====
	{ proficiency: 'Disguise kit', equipment: 'Disguise kit', source: 'charlatan|assassin|urchin' },
	{ proficiency: "Poisoner's kit", equipment: "Poisoner's kit", source: 'assassin' },
	{ proficiency: 'Forgery kit', equipment: 'Forgery kit', source: 'charlatan' },
	{ proficiency: 'Herbalism kit', equipment: 'Herbalism kit', source: 'hermit' },

	// ===== THIEVES' TOOLS =====
	// Rogue class grants thieves' tools proficiency, but item is already in starter equipment
	{ proficiency: "Thieves' tools", equipment: "Thieves' tools", source: 'criminal|urchin', alreadyInStarterEquipment: false },
	{ proficiency: "Thieves' tools", equipment: null, source: 'rogue', alreadyInStarterEquipment: true },

	// ===== VEHICLES (PROFICIENCY ONLY - NO EQUIPMENT) =====
	{ proficiency: 'Vehicles (land)', equipment: null, source: 'folk_hero|soldier' },
	{ proficiency: 'Vehicles (water)', equipment: null, source: 'sailor|pirate' },

	// ===== UNUSUAL WEAPONS (GLADIATOR) =====
	{ proficiency: 'Trident', equipment: 'Trident', source: 'gladiator' },
	{ proficiency: 'Net', equipment: 'Net', source: 'gladiator' },
	{ proficiency: 'Whip', equipment: 'Whip', source: 'gladiator' },
	{ proficiency: 'Spiked chain', equipment: 'Spiked chain', source: 'gladiator' },
	{ proficiency: 'Cestus', equipment: 'Cestus', source: 'gladiator' },
	{ proficiency: 'Gladius', equipment: 'Gladius', source: 'gladiator' },
];

/**
 * Determines if a proficiency should grant equipment
 * 
 * @param proficiency - The proficiency string to check
 * @param characterClass - The character's class (to check for Rogue)
 * @returns Equipment item name or null
 */
export function getEquipmentForProficiency(proficiency: string, characterClass?: string): string | null {
	// Find all matching rules for this proficiency
	const matchingRules = PROFICIENCY_EQUIPMENT_RULES.filter(rule => rule.proficiency === proficiency);
	
	if (matchingRules.length === 0) {
		return null;
	}

	// Special case: Thieves' tools for Rogue class
	if (proficiency === "Thieves' tools" && characterClass === 'Rogue') {
		// Rogue already has thieves' tools in starter equipment
		return null;
	}

	// Return the first equipment item found (most rules return the same equipment anyway)
	const rule = matchingRules.find(r => r.equipment !== null);
	return rule?.equipment ?? null;
}

/**
 * Gets all equipment items that should be granted based on character's proficiencies
 * 
 * @param proficiencies - Array of proficiency strings
 * @param characterClass - The character's class (optional, for special rules)
 * @returns Array of equipment item names to grant
 */
export function getEquipmentFromProficiencies(proficiencies: string[], characterClass?: string): string[] {
	const equipmentItems: string[] = [];
	
	for (const proficiency of proficiencies) {
		const equipment = getEquipmentForProficiency(proficiency, characterClass);
		if (equipment) {
			equipmentItems.push(equipment);
		}
	}
	
	return equipmentItems;
}

/**
 * Checks if an equipment choice should be hidden because the item
 * is already granted via proficiency
 * 
 * @param itemName - The equipment item name
 * @param proficiencies - Character's proficiencies
 * @returns true if this choice should be hidden
 */
export function shouldHideEquipmentChoice(itemName: string, proficiencies: string[]): boolean {
	// Check if any proficiency would grant this exact item
	return proficiencies.some(prof => {
		const equipment = getEquipmentForProficiency(prof);
		return equipment === itemName;
	});
}

/**
 * Get proficiency-granted equipment filtered by source category
 * 
 * @param proficiencies - Array of proficiency strings
 * @param characterClass - Character's class (for matching class sources)
 * @param characterSubclass - Character's subclass (for matching subclass-specific sources like 'battle_master' or 'assassin')
 * @param characterBackground - Character's background (for matching background sources)
 * @param characterSpecies - Character's species (for matching species sources)
 * @param sourceCategory - Filter by 'class', 'background', or 'species'
 * @returns Array of equipment items for that source
 */
export function getEquipmentFromProficienciesBySource(
	proficiencies: string[],
	characterClass: string | undefined,
	characterSubclass: string | undefined,
	characterBackground: string | undefined,
	characterSpecies: string | undefined,
	sourceCategory: 'class' | 'background' | 'species'
): string[] {
	const equipmentItems: string[] = [];
	
	// Normalize character identifiers to match source strings
	const normalizedClass = characterClass?.toLowerCase().replace(/\s+/g, '_');
	const normalizedSubclass = characterSubclass?.toLowerCase().replace(/\s+/g, '_');
	const normalizedBackground = characterBackground?.toLowerCase().replace(/\s+/g, '_');
	const normalizedSpecies = characterSpecies?.toLowerCase().replace(/\s+/g, '_');
	
	// Source patterns for each category
	// Note: patterns match anywhere in pipe-separated source strings (e.g., 'battle_master|dwarf|folk_hero')
	const sourcePatterns: Record<string, RegExp> = {
		class: /(bard|battle_master|fighter|rogue|assassin|monk|barbarian|cleric|druid|paladin|ranger|sorcerer|warlock|wizard)/i,
		background: /(acolyte|charlatan|criminal|entertainer|folk_hero|gladiator|guild_artisan|hermit|knight|noble|outlander|sailor|pirate|soldier|urchin)/i,
		species: /(dwarf|rock_gnome|gnome|elf|halfling|dragonborn|half_elf|half_orc|tiefling|human)/i
	};
	
	for (const proficiency of proficiencies) {
		// Find matching rules for this proficiency
		const matchingRules = PROFICIENCY_EQUIPMENT_RULES.filter(
			rule => rule.proficiency === proficiency
		);
		
		if (matchingRules.length === 0) continue;
		
		// Special case: Thieves' tools for Rogue class
		if (proficiency === "Thieves' tools" && characterClass === 'Rogue' && sourceCategory === 'class') {
			// Skip - already in starter equipment
			continue;
		}
		
		// Find the rule that matches BOTH the source category AND the character's actual source
		let matchedEquipment: string | null = null;
		
		for (const rule of matchingRules) {
			if (!rule.equipment) continue;
			
			const sourceLower = rule.source.toLowerCase();
			
			// Check if this rule matches the requested category
			if (sourceCategory === 'class' && normalizedClass) {
				// Check if the rule's source contains this character's class OR subclass
				// Subclass-specific sources like 'battle_master' or 'assassin' should match
				if (sourceLower.includes(normalizedClass) || 
				    (normalizedSubclass && sourceLower.includes(normalizedSubclass))) {
					matchedEquipment = rule.equipment;
					break;
				}
			} else if (sourceCategory === 'background' && normalizedBackground) {
				// Check if the rule's source contains this character's background
				if (sourceLower.includes(normalizedBackground)) {
					matchedEquipment = rule.equipment;
					break;
				}
			} else if (sourceCategory === 'species' && normalizedSpecies) {
				// Check if the rule's source contains this character's species
				if (sourceLower.includes(normalizedSpecies)) {
					matchedEquipment = rule.equipment;
					break;
				}
			}
		}
		
		if (matchedEquipment) {
			equipmentItems.push(matchedEquipment);
		}
	}
	
	return equipmentItems;
}
