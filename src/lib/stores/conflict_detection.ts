import { get } from 'svelte/store';
import { character_store, type Character } from './character_store';
import { getSpellAccessForCharacter, getSpellsByLevel } from '$lib/data/spells';

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
	console.log('[Conflict Detection] Checking spell limit violations...');
	console.log('[Conflict Detection] Character state:', {
		class: character.class,
		charisma: character.charisma,
		spells: character.spells,
		spellsType: typeof character.spells,
		spellsIsArray: Array.isArray(character.spells),
		spellsLength: character.spells?.length,
		provenance: Object.keys(character._provenance || {})
	});
	const spellLimitConflicts = detectSpellLimitViolations(character);
	console.log('[Conflict Detection] Spell limit conflicts found:', spellLimitConflicts.length, spellLimitConflicts);
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

	console.log('[Spell Limit] Checking character:', {
		class: character.class,
		charisma: character.charisma,
		spells: character.spells,
		spellsLength: character.spells?.length
	});

	// Only check if character has spells selected
	if (!character.spells || !Array.isArray(character.spells) || character.spells.length === 0) {
		console.log('[Spell Limit] No spells found, returning empty');
		return conflicts;
	}

	// Extract spell names and metadata from character.spells array
	const spellsWithMetadata: Array<{ name: string; tabSource?: string }> = character.spells.map((spell) => {
		if (typeof spell === 'string') {
			return { name: spell };
		} else if (typeof spell === 'object' && spell !== null && 'name' in spell) {
			return {
				name: (spell as any).name,
				tabSource: (spell as any).tabSource
			};
		}
		return { name: '' };
	}).filter((spell) => spell.name !== '');

	const selectedSpells = new Set(spellsWithMetadata.map(s => s.name));
	console.log('[Spell Limit] Selected spells:', Array.from(selectedSpells));

	// Calculate current spell limits (mirroring the logic from spells page)
	const spellLimits = calculateSpellLimits(character);
	console.log('[Spell Limit] Calculated limits:', spellLimits);

	// Count selected spells by level
	const spellCounts = countSelectedSpells(character, spellsWithMetadata);
	console.log('[Spell Limit] Spell counts:', spellCounts);

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
		console.log('[Spell Limit] *** VIOLATIONS FOUND ***:', violations);
		// Try to determine what caused this (if we can detect recent changes)
		const causes = determineSpellLimitCauses(character);

		const conflict = {
			type: 'spell_limit' as const,
			value: `${violations.length} spell limit violation${violations.length > 1 ? 's' : ''}`,
			violations,
			causes,
			affectedTabs: ['spells']
		};
		conflicts.push(conflict);
		console.log('[Spell Limit] Created conflict:', conflict);
	} else {
		console.log('[Spell Limit] No violations detected');
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
			// Only count class and subclass access toward limits, not race/feat bonuses
			// Exclude subclass entries with extended names (like "Nature Domain - Druid Cantrip")
			// as they are handled in separate tabs
			const countsTowardLimits =
				access.source === 'class' ||
				(access.source === 'subclass' && !access.sourceName.includes(' - ')) ||
				access.source === 'feature';

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
 * Only count spells from sources that contribute to main limits
 * Excludes spells selected from Circle of Land or feature tabs based on tabSource metadata
 */
function countSelectedSpells(
	character: Character,
	spellsWithMetadata: Array<{ name: string; tabSource?: string }>
) {
	const counts = {
		cantrips: 0,
		level1: 0,
		level2: 0
	};

	// Get spell access to determine sources
	const spellAccess = getSpellAccess(character);

	// Create maps of spells that come from sources that count toward main limits
	const limitCountingSpells = {
		cantrips: new Set<string>(),
		level1: new Set<string>(),
		level2: new Set<string>()
	};

	// Get all spells by level for reference
	const cantrips = getSpellsByLevel(0);
	const level1Spells = getSpellsByLevel(1);
	const level2Spells = getSpellsByLevel(2);

	// Process each spell access to find which spells count toward limits
	spellAccess.forEach((access) => {
		if (access.chooseable !== false) {
			// All class and regular subclass spells are in the pool
			// We'll filter based on tabSource when counting
			const isStandardAccess =
				access.source === 'class' ||
				(access.source === 'subclass' && !access.sourceName.includes(' - ')) ||
				access.source === 'feature';

			if (isStandardAccess && access.chooseFrom && access.chooseFrom.length > 0) {
				// Add spells from this access to our tracking sets
				access.chooseFrom.forEach((className) => {
					// Check cantrips
					if (access.maxSpellLevel === undefined || access.maxSpellLevel >= 0) {
						const classCantrips = cantrips.filter((spell) => spell.classes.includes(className));
						classCantrips.forEach((spell) => limitCountingSpells.cantrips.add(spell.name));
					}

					// Check level 1 spells
					if (access.maxSpellLevel === undefined || access.maxSpellLevel >= 1) {
						const classLevel1 = level1Spells.filter((spell) => spell.classes.includes(className));
						classLevel1.forEach((spell) => limitCountingSpells.level1.add(spell.name));
					}

					// Check level 2 spells
					if (access.maxSpellLevel === undefined || access.maxSpellLevel >= 2) {
						const classLevel2 = level2Spells.filter((spell) => spell.classes.includes(className));
						classLevel2.forEach((spell) => limitCountingSpells.level2.add(spell.name));
					}
				});
			}
		}
	});

	// Count selected spells that come from limit-counting sources
	// EXCLUDE spells selected from Circle of Land or feature tabs based on tabSource
	for (const spell of spellsWithMetadata) {
		const spellName = spell.name;
		const tabSource = spell.tabSource || '';
		
		// Skip spells selected from Circle of Land tab
		if (tabSource.includes('Circle of the Land')) {
			continue;
		}
		
		// Skip spells selected from feature tabs (Pact of the Tome, etc.)
		if (tabSource.includes('Pact of the') || tabSource.includes('Book of Ancient')) {
			continue;
		}
		
		// Count the spell if it's in a limit-counting source
		if (limitCountingSpells.cantrips.has(spellName)) {
			counts.cantrips++;
		} else if (limitCountingSpells.level1.has(spellName)) {
			counts.level1++;
		} else if (limitCountingSpells.level2.has(spellName)) {
			counts.level2++;
		}
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

	// Check for ability score changes that affect spell limits
	if (character.class === 'Cleric' || character.class === 'Druid') {
		// Handle unselected ability scores (< 8 likely means just racial bonus)
		const rawWisdom = character.wisdom || 10;
		const wisdomScore = rawWisdom < 8 ? 10 : rawWisdom;
		const wisdomModifier = Math.floor((wisdomScore - 10) / 2);
		const expectedSpells = Math.max(1, wisdomModifier + 3);
		causes.push(
			`Wisdom ${wisdomScore} (${wisdomModifier >= 0 ? '+' : ''}${wisdomModifier}) allows ${expectedSpells} prepared spells`
		);
	} else if (character.class === 'Paladin') {
		// Handle unselected ability scores (< 8 likely means just racial bonus)
		const rawCharisma = character.charisma || 10;
		const charismaScore = rawCharisma < 8 ? 10 : rawCharisma;
		const charismaModifier = Math.floor((charismaScore - 10) / 2);
		const expectedSpells = Math.max(1, charismaModifier + 1);
		causes.push(
			`Charisma ${charismaScore} (${charismaModifier >= 0 ? '+' : ''}${charismaModifier}) allows ${expectedSpells} prepared spells`
		);
	}

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
	// Check if starts with class:
	if (scopeId.startsWith('class:')) {
		return true;
	}
	
	// Check if it's a class-related feature
	// Class features are typically from the class page and include things like:
	// - feature:Skill Proficiencies:0 (class skills)
	// - feature:Expertise:0 (class features)
	// - feature:Fighting Style:0 (class features)
	if (scopeId.startsWith('feature:')) {
		// Features with skill/expertise/class-specific names are from class
		const featureName = scopeId.split(':')[1]?.toLowerCase() || '';
		return (
			featureName.includes('skill prof') ||
			featureName.includes('expertise') ||
			featureName.includes('fighting style') ||
			featureName.includes('bonus prof') ||
			featureName.includes('martial arts') ||
			featureName.includes('unarmored') ||
			featureName.includes('spellcasting') ||
			featureName.includes('channel divinity') ||
			featureName.includes('wild shape')
		);
	}
	
	return false;
}

/**
 * Check if a feature scope belongs to a species
 */
function isSpeciesFeature(scopeId: string): boolean {
	// Check if it starts with race: or species:
	if (scopeId.startsWith('race:') || scopeId.startsWith('species:')) {
		return true;
	}
	
	// Check if it's a species-related feature
	// Species features are typically from the species page and include things like:
	// - feature:Keen Senses (elf racial feature)
	// - feature:Darkvision (various races)
	// - feature:Draconic Ancestry:0 (dragonborn choice)
	if (scopeId.startsWith('feature:')) {
		const featureName = scopeId.split(':')[1]?.toLowerCase() || '';
		// Known species features
		return (
			featureName.includes('keen sense') ||
			featureName.includes('darkvision') ||
			featureName.includes('fey ancestry') ||
			featureName.includes('trance') ||
			featureName.includes('lucky') ||
			featureName.includes('brave') ||
			featureName.includes('dwarven') ||
			featureName.includes('draconic') ||
			featureName.includes('gnome cunning') ||
			featureName.includes('hellish') ||
			featureName.includes('infernal') ||
			featureName.includes('menacing') ||
			featureName.includes('relentless') ||
			featureName.includes('savage') ||
			featureName.includes('ability score increase') || // racial ASI
			featureName.includes('stonecunning') ||
			featureName.includes('tool proficiency') // dwarf/gnome tools
		);
	}
	
	return false;
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

/**
 * Get the primary tab that can resolve a conflict
 * Returns the tab where users can make changes to fix the conflict
 */
export function getPrimaryResolutionTab(conflict: Conflict): string | null {
	if (!conflict.affectedTabs || conflict.affectedTabs.length === 0) {
		return null;
	}

	// For spell limit conflicts, prioritize the spells tab
	if (conflict.type === 'spell_limit') {
		return 'spells';
	}

	// For other conflicts, return the first tab where users can make changes
	// affectedTabs are already sorted with changeable tabs first
	return conflict.affectedTabs[0];
}
