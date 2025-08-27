import { get } from 'svelte/store';
import { character_store, type Character } from './character_store';
import { revertChanges } from './character_store_helpers';
import { smartRevertScope, canSafelyRevertScope } from './smart_revert';
import { detectConflicts, type Conflict, type ConflictType } from './conflict_detection';

export type ResolutionAction = {
	type: 'revert_scope' | 'suggest_alternative';
	description: string;
	scopeId?: string;
	alternatives?: string[];
};

export type ConflictResolution = {
	conflict: Conflict;
	possibleActions: ResolutionAction[];
	recommendedAction?: ResolutionAction;
};

/**
 * Get resolution options for a specific conflict
 */
export function getResolutionOptions(conflict: Conflict): ConflictResolution {
	const actions: ResolutionAction[] = [];

	// For each source, offer to revert that scope
	for (const source of conflict.sources) {
		const description = getSourceDescription(source);
		actions.push({
			type: 'revert_scope',
			description: `Remove ${conflict.value} from ${description}`,
			scopeId: source
		});
	}

	// If this is a user-selected skill (not automatically granted), suggest alternatives
	const userSelectableSources = conflict.sources.filter(isUserSelectableSource);
	if (userSelectableSources.length > 0) {
		const alternatives = getSuggestedAlternatives(conflict);
		if (alternatives.length > 0) {
			actions.push({
				type: 'suggest_alternative',
				description: `Choose a different ${conflict.type} instead`,
				alternatives
			});
		}
	}

	// Recommend action: prioritize user choices over automatic grants
	const automaticSources = conflict.sources.filter((source) => !isUserSelectableSource(source));
	const recommendedAction =
		automaticSources.length > 0 && userSelectableSources.length > 0
			? actions.find((a) => a.type === 'suggest_alternative')
			: actions[0];

	return {
		conflict,
		possibleActions: actions,
		recommendedAction
	};
}

/**
 * Automatically resolve conflicts by prioritizing user selections over automatic grants
 */
export function autoResolveConflicts(): { resolved: number; remaining: Conflict[] } {
	const result = detectConflicts();
	if (!result.hasConflicts) {
		return { resolved: 0, remaining: [] };
	}

	let resolved = 0;

	for (const conflict of result.conflicts) {
		const userSources = conflict.sources.filter(isUserSelectableSource);
		const autoSources = conflict.sources.filter((source) => !isUserSelectableSource(source));

		// If we have both user selections and automatic grants, revert the user selections
		if (userSources.length > 0 && autoSources.length > 0) {
			for (const userSource of userSources) {
				if (canSafelyRevertScope(userSource)) {
					smartRevertScope(userSource);
					resolved++;
				}
			}
			// Update store after all reverts
			character_store.set(get(character_store));
		}
	}

	// Check remaining conflicts after resolution
	const finalResult = detectConflicts();
	return { resolved, remaining: finalResult.conflicts };
}

/**
 * Resolve a specific conflict by reverting a specific scope using smart revert
 */
export function resolveConflictByReverting(conflict: Conflict, scopeId: string): boolean {
	if (!conflict.sources.includes(scopeId)) {
		return false;
	}

	// Use smart revert to avoid removing items from other sources
	smartRevertScope(scopeId);

	// Update the character store with the reverted character
	const updatedChar = get(character_store);
	character_store.set(updatedChar);

	// Check if conflict is resolved
	const newResult = detectConflicts();
	const stillConflicted = newResult.conflicts.some(
		(c) => c.type === conflict.type && c.value === conflict.value
	);

	return !stillConflicted;
}

/**
 * Get suggested alternatives for a conflicted value
 */
function getSuggestedAlternatives(conflict: Conflict): string[] {
	// This is a simplified version - could be enhanced with more sophisticated logic
	const commonAlternatives: Record<ConflictType, Record<string, string[]>> = {
		skill: {
			Perception: ['Investigation', 'Insight', 'Survival', 'Nature'],
			Stealth: ['Sleight of Hand', 'Acrobatics', 'Deception'],
			Athletics: ['Acrobatics', 'Survival'],
			Arcana: ['Investigation', 'History', 'Religion'],
			History: ['Investigation', 'Arcana', 'Religion'],
			Investigation: ['Perception', 'Insight', 'Arcana'],
			Medicine: ['Nature', 'Survival', 'Insight'],
			Nature: ['Survival', 'Animal Handling', 'Medicine'],
			Survival: ['Nature', 'Animal Handling', 'Medicine']
		},
		proficiency: {},
		language: {},
		feature: {}
	};

	const suggestions = commonAlternatives[conflict.type]?.[conflict.value] || [];

	// Filter out suggestions that would also cause conflicts
	const character = get(character_store);
	const existingValues = getExistingValues(character, conflict.type);

	return suggestions.filter((suggestion) => !existingValues.includes(suggestion));
}

/**
 * Get existing values of a specific type from the character
 */
function getExistingValues(character: Character, type: ConflictType): string[] {
	switch (type) {
		case 'skill':
			return character.skills || [];
		case 'proficiency':
			return character.proficiencies || [];
		case 'language':
			return character.languages || [];
		case 'feature':
			return character.features || [];
		default:
			return [];
	}
}

/**
 * Check if a source represents a user-selectable choice vs automatic grant
 */
function isUserSelectableSource(source: string): boolean {
	// Sources that contain 'proficiencies' typically represent user choices
	// Sources with specific feature names are typically automatic
	return (
		source.includes('.proficiencies') ||
		source.includes('.skills') ||
		source.includes('_skills_') ||
		source.includes('bonus_proficiencies')
	);
}

/**
 * Convert source ID to human-readable description
 */
function getSourceDescription(source: string): string {
	if (source.startsWith('bard.')) return 'Bard class selection';
	if (source.startsWith('fighter.')) return 'Fighter class selection';
	if (source.startsWith('wizard.')) return 'Wizard class selection';
	if (source.startsWith('high_elf.')) return 'High Elf racial trait';
	if (source.startsWith('hill_dwarf.')) return 'Hill Dwarf racial trait';
	if (source.startsWith('wood_elf.')) return 'Wood Elf racial trait';
	if (source.startsWith('dark_elf.')) return 'Dark Elf racial trait';
	if (source.includes('college_of_lore')) return 'College of Lore feature';

	// Fallback: try to extract meaningful parts
	const parts = source.split('.');
	if (parts.length >= 2) {
		return `${parts[0]} ${parts[parts.length - 1]}`;
	}

	return source;
}

/**
 * Get all conflicts that can be auto-resolved (have both user and automatic sources)
 */
export function getAutoResolvableConflicts(): Conflict[] {
	const result = detectConflicts();
	return result.conflicts.filter((conflict) => {
		const userSources = conflict.sources.filter(isUserSelectableSource);
		const autoSources = conflict.sources.filter((source) => !isUserSelectableSource(source));
		return userSources.length > 0 && autoSources.length > 0;
	});
}

/**
 * Check if there are any conflicts that need manual resolution
 */
export function hasManualConflicts(): boolean {
	const result = detectConflicts();
	const manualConflicts = result.conflicts.filter((conflict) => {
		const userSources = conflict.sources.filter(isUserSelectableSource);
		// Manual conflicts are those where all sources are user-selectable or all are automatic
		return userSources.length === 0 || userSources.length === conflict.sources.length;
	});
	return manualConflicts.length > 0;
}
