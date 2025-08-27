import { get } from 'svelte/store';
import { character_store, type Character } from './character_store';

export type ConflictType = 'skill' | 'proficiency' | 'language' | 'feature';

export type Conflict = {
	type: ConflictType;
	value: string;
	sources: string[]; // e.g., ['bard.proficiencies', 'high_elf.keen_senses']
	affectedTabs?: string[]; // e.g., ['class', 'race'] - tabs that need user attention
};

export type ConflictDetectionResult = {
	hasConflicts: boolean;
	conflicts: Conflict[];
	tabsNeedingAttention: string[]; // unique list of tabs with conflicts
};

/**
 * Detects conflicts in the character store by analyzing what different scopes have added
 * Returns conflicts and which tabs need user attention
 */
export function detectConflicts(): ConflictDetectionResult {
	const character = get(character_store);
	const conflicts: Conflict[] = [];

	if (!character._provenance) {
		return { hasConflicts: false, conflicts: [], tabsNeedingAttention: [] };
	}

	// Group all additions by field type and value
	const additions: Record<ConflictType, Record<string, string[]>> = {
		skill: {},
		proficiency: {},
		language: {},
		feature: {}
	};

	// Analyze each scope's provenance
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

	// Get unique list of tabs needing attention
	const tabsNeedingAttention = [...new Set(conflicts.flatMap((c) => c.affectedTabs || []))];

	return {
		hasConflicts: conflicts.length > 0,
		conflicts,
		tabsNeedingAttention
	};
}

/**
 * Maps source scope IDs to the tabs where users can make changes
 * This helps identify which tabs need visual warning indicators
 */
function getTabsFromSources(sources: string[]): string[] {
	const tabs = new Set<string>();
	const changeableTabs = new Set<string>();

	// First pass: identify all tabs involved and which ones are user-changeable
	for (const source of sources) {
		if (source.startsWith('class:') || (source.startsWith('feature:') && isClassFeature(source))) {
			tabs.add('class');
			// Class features with user choices should be prioritized
			if (isUserChangeableClassFeature(source)) {
				changeableTabs.add('class');
			}
		} else if (source.startsWith('race:') || isSpeciesFeature(source)) {
			tabs.add('species');
			// Most species features are automatic, but some species have choices
			if (isUserChangeableSpeciesFeature(source)) {
				changeableTabs.add('species');
			}
		} else if (source.includes('background')) {
			tabs.add('background');
			changeableTabs.add('background'); // Most background features are choices
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
	// Class features are typically selected after choosing a class
	// Common class skill features
	return (
		scopeId.includes('Skill Proficiencies') ||
		scopeId.includes('Skills') ||
		scopeId.includes('Bonus Proficiencies') ||
		scopeId.includes('Expertise') ||
		scopeId.includes('college_of_lore')
	);
}

/**
 * Check if a feature scope belongs to a species
 * Species features include Keen Senses, Fey Ancestry, etc.
 */
function isSpeciesFeature(scopeId: string): boolean {
	// Species features are typically named after species traits
	return (
		scopeId.includes('Keen Senses') ||
		scopeId.includes('Fey Ancestry') ||
		scopeId.includes('Trance') ||
		scopeId.includes('Darkvision') ||
		scopeId.includes('Dwarven') ||
		scopeId.includes('Elven') ||
		scopeId.includes('Halfling') ||
		scopeId.includes('Draconic') ||
		scopeId.includes('Tool Proficiency')
	);
}

/**
 * Gets conflicts that affect a specific tab
 * Useful for showing warnings on individual tabs
 */
export function getConflictsForTab(tabName: string): Conflict[] {
	const result = detectConflicts();
	return result.conflicts.filter((conflict) => conflict.affectedTabs?.includes(tabName));
}

/**
 * Gets conflicts of a specific type (e.g., just skill conflicts)
 */
export function getConflictsByType(type: ConflictType): Conflict[] {
	const result = detectConflicts();
	return result.conflicts.filter((conflict) => conflict.type === type);
}

/**
 * Checks if a specific value would cause a conflict if added by a given source
 * Useful for real-time validation during selection
 */
export function wouldCauseConflict(type: ConflictType, value: string, newSource: string): boolean {
	const character = get(character_store);

	if (!character._provenance) return false;

	// Check if any other source has already added this value
	for (const [scopeId, prov] of Object.entries(character._provenance)) {
		if (scopeId === newSource) continue; // same source is fine

		const changes = '_set' in prov && prov._set ? prov._set : prov;
		if (!changes) continue;

		const fieldName = getFieldNameForType(type);
		const fieldValues = changes[fieldName];

		if (Array.isArray(fieldValues) && fieldValues.includes(value)) {
			return true; // conflict found
		}
	}

	return false;
}

/**
 * Helper to map conflict types to character store field names
 */
function getFieldNameForType(type: ConflictType): keyof Character {
	switch (type) {
		case 'skill':
			return 'skills';
		case 'proficiency':
			return 'proficiencies';
		case 'language':
			return 'languages';
		case 'feature':
			return 'features';
		default:
			throw new Error(`Unknown conflict type: ${type}`);
	}
}

/**
 * Gets conflicts where the user can take action (has changeable selections)
 */
export function getUserActionableConflicts(): Conflict[] {
	const result = detectConflicts();
	return result.conflicts.filter((conflict) => {
		// Check if any source in this conflict is user-changeable
		return conflict.sources.some(
			(source) =>
				isUserChangeableClassFeature(source) ||
				isUserChangeableRaceFeature(source) ||
				source.includes('background')
		);
	});
}

/**
 * Gets the primary tab users should visit to resolve conflicts
 * Prioritizes tabs where users can make changes
 */
export function getPrimaryResolutionTab(conflict: Conflict): string | null {
	const changeableSources = conflict.sources.filter(
		(source) =>
			isUserChangeableClassFeature(source) ||
			isUserChangeableRaceFeature(source) ||
			source.includes('background')
	);

	if (changeableSources.length === 0) {
		return null; // No user-changeable sources
	}

	// Return the first changeable tab
	for (const source of changeableSources) {
		if (source.startsWith('class:') || isClassFeature(source)) {
			return 'class';
		} else if (source.startsWith('race:') || isRaceFeature(source)) {
			return 'race';
		} else if (source.includes('background')) {
			return 'background';
		}
	}

	return null;
}
