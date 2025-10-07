import { get } from 'svelte/store';
import { character_store, type Character } from './character_store';
import { getSpellAccessForCharacter, getSpellsByLevel, type Spell } from '$lib/data/spells';

export type ConflictType = 'skill' | 'proficiency' | 'language' | 'feature' | 'spell_limit';

export type SpellLimitViolation = {
	level: string; // 'cantrips', 'level1', 'level2'
	selected: number;
	limit: number;
	excess: number;
};

export type Conflict = {
	type: ConflictType;
	value: string;
	sources?: string[]; // e.g., ['bard.proficiencies', 'high_elf.keen_senses'] - for regular conflicts
	violations?: SpellLimitViolation[]; // for spell limit conflicts
	causes?: string[]; // what changes caused this (for spell limits)
	affectedTabs?: string[]; // e.g., ['class', 'race'] - tabs that need user attention
};

/**
 * Check for conflicts in character build - overlapping sources granting the same value
 */
export function detectConflicts(): {
	hasConflicts: boolean;
	conflicts: Conflict[];
	tabsNeedingAttention: string[];
} {
	const character = get(character_store);
	const conflicts: Conflict[] = [];

	if (!character) {
		return {
			hasConflicts: false,
			conflicts: [],
			tabsNeedingAttention: []
		};
	}

	// Group all additions by field type and value
	const additions: Record<ConflictType, Record<string, string[]>> = {
		skill: {},
		proficiency: {},
		language: {},
		feature: {},
		spell_limit: {} // Not used for additions, but required for type consistency
	};

	// Analyze each scope's provenance
	if (!character._provenance) {
		return {
			hasConflicts: false,
			conflicts: [],
			tabsNeedingAttention: []
		};
	}

	for (const [scopeId, prov] of Object.entries(character._provenance)) {
		// Handle both old flat format and new structured format
		const changes = '_set' in prov && prov._set ? prov._set : prov;
		if (!changes) continue;

		// Check each field type for additions
		for (const [fieldName, fieldValues] of Object.entries(changes)) {
			if (!Array.isArray(fieldValues)) continue;

			let conflictType: ConflictType;
			switch (fieldName) {
				case 'skills':
					conflictType = 'skill';
					break;
				case 'proficiencies':
					conflictType = 'proficiency';
					break;
				case 'languages':
					conflictType = 'language';
					break;
				case 'features':
					conflictType = 'feature';
					break;
				default:
					continue; // skip non-array fields or unknown types
			}

			// Track what this scope added
			for (const value of fieldValues) {
				if (!additions[conflictType][value]) {
					additions[conflictType][value] = [];
				}
				additions[conflictType][value].push(scopeId);
			}
		}
	}

	// Find conflicts (values added by multiple sources)
	for (const [conflictType, valueMap] of Object.entries(additions)) {
		if (conflictType === 'spell_limit') continue; // Skip spell_limit as it's handled separately
		for (const [value, sources] of Object.entries(valueMap)) {
			if (sources.length > 1) {
				const affectedTabs = getTabsFromSources(sources);

				conflicts.push({
					type: conflictType as ConflictType,
					value,
					sources,
					affectedTabs
				});
			}
		}
	}

	// Check for spell limit violations
	const spellLimitConflicts = detectSpellLimitViolations(character);
	conflicts.push(...spellLimitConflicts);

	// Get unique list of tabs needing attention
	const tabsNeedingAttention = [...new Set(conflicts.flatMap((c) => c.affectedTabs || []))];

	return {
		hasConflicts: conflicts.length > 0,
		conflicts,
		tabsNeedingAttention
	};
}

/**
 * Detect spell limit violations
 */
function detectSpellLimitViolations(character: Character): Conflict[] {
	const conflicts: Conflict[] = [];

	// Only check if character has spells selected
	if (!character._provenance?.['spell_selections']) {
		return conflicts;
	}

	// Get spell selections from character store
	const spellSelectionsData = character._provenance['spell_selections'];
	const actualData = (spellSelectionsData as any)?._set || spellSelectionsData;
	if (!actualData?.spells || !Array.isArray(actualData.spells)) {
		return conflicts;
	}

	const selectedSpells = new Set(actualData.spells as string[]);

	// Calculate current spell limits (mirroring the logic from spells page)
	const spellLimits = calculateSpellLimits(character);

	// Count selected spells by level
	const spellCounts = countSelectedSpells(character, selectedSpells);

	// Check for violations
	const violations: SpellLimitViolation[] = [];

	// Check cantrips
	if (spellCounts.cantrips > spellLimits.cantrips) {
		violations.push({
			level: 'cantrips',
			selected: spellCounts.cantrips,
			limit: spellLimits.cantrips,
			excess: spellCounts.cantrips - spellLimits.cantrips
		});
	}

	// Check spell levels (considering shared vs separate limits)
	if (spellLimits.isSharedLimits) {
		const totalLeveled = spellCounts.level1 + spellCounts.level2;
		if (totalLeveled > spellLimits.sharedLeveled) {
			violations.push({
				level: 'leveled',
				selected: totalLeveled,
				limit: spellLimits.sharedLeveled,
				excess: totalLeveled - spellLimits.sharedLeveled
			});
		}
	} else {
		// Separate limits
		if (spellCounts.level1 > spellLimits.level1) {
			violations.push({
				level: 'level1',
				selected: spellCounts.level1,
				limit: spellLimits.level1,
				excess: spellCounts.level1 - spellLimits.level1
			});
		}

		if (spellCounts.level2 > spellLimits.level2) {
			violations.push({
				level: 'level2',
				selected: spellCounts.level2,
				limit: spellLimits.level2,
				excess: spellCounts.level2 - spellLimits.level2
			});
		}
	}

	// If we have violations, create a conflict
	if (violations.length > 0) {
		// Try to determine what caused this (if we can detect recent changes)
		const causes = determineSpellLimitCauses(character);

		conflicts.push({
			type: 'spell_limit',
			value: `${violations.length} spell limit violation${violations.length > 1 ? 's' : ''}`,
			violations,
			causes,
			affectedTabs: ['spells']
		});
	}

	return conflicts;
}

/**
 * Calculate spell limits for a character (mirroring spells page logic)
 */
function calculateSpellLimits(character: Character) {
	const spellAccess = getSpellAccess(character);
	const limits = {
		cantrips: 0,
		level1: 0,
		level2: 0,
		sharedLeveled: 0,
		isSharedLimits: false
	};

	spellAccess.forEach((access) => {
		if (access.chooseable !== false) {
			// Only count class and subclass access toward limits
			const countsTowardLimits =
				access.source === 'class' || access.source === 'subclass' || access.source === 'feature';

			if (access.chooseCantripCount !== undefined || access.chooseSpellCount !== undefined) {
				if (access.chooseFrom && access.chooseFrom.length > 0) {
					// Handle cantrip limits
					if (access.chooseCantripCount !== undefined && countsTowardLimits) {
						limits.cantrips += access.chooseCantripCount;
					}

					// Handle leveled spell limits
					if (access.chooseSpellCount !== undefined && countsTowardLimits) {
						// For simplicity, assume this can choose both level 1 and 2 spells (shared limits)
						// This matches the typical D&D behavior for most classes
						limits.isSharedLimits = true;
						limits.sharedLeveled += access.chooseSpellCount;
					}
				}
			}
			// Legacy format support
			else if (access.chooseCount && countsTowardLimits) {
				if (access.chooseFrom && access.chooseFrom.length > 0) {
					limits.cantrips += access.chooseCount;
					limits.isSharedLimits = true;
					limits.sharedLeveled += access.chooseCount;
				}
			}
		}
	});

	return limits;
}

/**
 * Count selected spells by level using proper spell data
 */
function countSelectedSpells(character: Character, selectedSpells: Set<string>) {
	const counts = {
		cantrips: 0,
		level1: 0,
		level2: 0
	};

	// Get all spells by level to look up selected spells
	const cantrips = getSpellsByLevel(0);
	const level1Spells = getSpellsByLevel(1);
	const level2Spells = getSpellsByLevel(2);

	// Create lookup maps for faster searching
	const cantripNames = new Set(cantrips.map((s) => s.name));
	const level1Names = new Set(level1Spells.map((s) => s.name));
	const level2Names = new Set(level2Spells.map((s) => s.name));

	for (const spellName of selectedSpells) {
		if (cantripNames.has(spellName)) {
			counts.cantrips++;
		} else if (level1Names.has(spellName)) {
			counts.level1++;
		} else if (level2Names.has(spellName)) {
			counts.level2++;
		}
		// Note: Spells above level 2 are ignored since we only track up to level 2
	}

	return counts;
}

/**
 * Get spell access for character (using the same logic as spells page)
 */
function getSpellAccess(character: Character) {
	return getSpellAccessForCharacter(character);
}

/**
 * Try to determine what caused spell limit violations
 */
function determineSpellLimitCauses(character: Character): string[] {
	const causes: string[] = [];

	// Check if subclass changed recently (heuristic)
	if (character.subclass) {
		causes.push(`Subclass: ${character.subclass}`);
	}

	// Check if class changed
	if (character.class) {
		causes.push(`Class: ${character.class}`);
	}

	return causes;
}

/**
 * Maps source scope IDs to the tabs where users can make changes
 * This helps identify which tabs need visual warning indicators
 */
function getTabsFromSources(sources: string[]): string[] {
	const tabs = new Set<string>();
	const changeableTabs = new Set<string>();

	// First pass: identify all tabs involved and which ones are user-changeable
	// Check in priority order: background first, then species, then class
	for (const source of sources) {
		// Check background first (most specific)
		if (
			source.startsWith('background:') ||
			source.includes('background') ||
			isBackgroundFeature(source)
		) {
			tabs.add('background');
			// Most background features are user choices
			if (isUserChangeableBackgroundFeature(source)) {
				changeableTabs.add('background');
			}
		} else if (source.startsWith('race:') || isSpeciesFeature(source)) {
			tabs.add('species');
			// Most species features are automatic, but some species have choices
			if (isUserChangeableSpeciesFeature(source)) {
				changeableTabs.add('species');
			}
		} else if (
			source.startsWith('class:') ||
			(source.startsWith('feature:') && isClassFeature(source))
		) {
			tabs.add('class');
			// Class features with user choices should be prioritized
			if (isUserChangeableClassFeature(source)) {
				changeableTabs.add('class');
			}
		}
	}

	// Prioritize user-changeable tabs, but include all involved tabs for context
	const result = Array.from(tabs);
	const changeable = Array.from(changeableTabs);

	// Sort so changeable tabs come first (these get the red warning)
	return [...changeable, ...result.filter((tab) => !changeable.includes(tab))];
}

/**
 * Check if a class feature represents a user choice
 */
function isUserChangeableClassFeature(scopeId: string): boolean {
	// Features that involve user selection (have indices like :0, :1)
	return (
		/:\d+$/.test(scopeId) &&
		(scopeId.includes('Skill Proficiencies') ||
			scopeId.includes('Bonus Proficiencies') ||
			scopeId.includes('Expertise') ||
			scopeId.includes('college_of_lore'))
	);
}

/**
 * Check if a species feature represents a user choice
 */
function isUserChangeableSpeciesFeature(scopeId: string): boolean {
	// Most species features are automatic, but some have choices
	return (
		/:\d+$/.test(scopeId) &&
		(scopeId.includes('Tool Proficiency') ||
			scopeId.includes('Cantrip') ||
			scopeId.includes('Draconic Ancestry'))
	);
}

/**
 * Check if a feature scope belongs to a class
 * Class features include skills from bard, fighter, etc.
 */
function isClassFeature(scopeId: string): boolean {
	return /^(class:|feature:)(bard|fighter|ranger|rogue|wizard|paladin|cleric|barbarian|druid|monk|sorcerer|warlock)/i.test(
		scopeId
	);
}

/**
 * Check if a feature scope belongs to a species
 */
function isSpeciesFeature(scopeId: string): boolean {
	return /^(feature:)(high_elf|variant_human|half_elf|dragonborn|drow|deep_gnome|wood_elf|lightfoot_halfling|stout_halfling|half_orc|githyanki|custom_lineage)/i.test(
		scopeId
	);
}

/**
 * Check if a feature scope belongs to a background
 */
function isBackgroundFeature(scopeId: string): boolean {
	return /^(feature:)(acolyte|criminal|folk_hero|noble|sage|soldier|charlatan|entertainer|guild_artisan|hermit|outlander|sailor|urchin|custom_background)/i.test(
		scopeId
	);
}

/**
 * Check if a background feature represents a user choice
 */
function isUserChangeableBackgroundFeature(scopeId: string): boolean {
	// Most background features are user choices
	return /:\d+$/.test(scopeId) && isBackgroundFeature(scopeId);
}
