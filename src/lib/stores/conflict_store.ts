import { writable, derived } from 'svelte/store';
import { character_store } from './character_store';
import { detectConflicts, type Conflict } from './conflict_detection';

type ConflictDetectionResult = {
	hasConflicts: boolean;
	conflicts: Conflict[];
	tabsNeedingAttention: string[];
};

/**
 * Reactive store that automatically detects conflicts when character changes
 */
export const conflicts = derived(character_store, ($character) => {
	console.log('[Conflict Store] Character changed, detecting conflicts...');
	console.log('[Conflict Store] Character:', {
		class: $character?.class,
		race: $character?.race,
		subrace: $character?.subrace,
		charisma: $character?.charisma,
		spells: $character?.spells,
		spellsLength: $character?.spells?.length
	});
	const result = detectConflicts();
	console.log('[Conflict Store] Detection result:', result);
	return result;
});

/**
 * Store for tracking which tabs have been visited
 * This helps us know when to show warnings vs when tabs haven't been configured yet
 */
export const visitedTabs = writable<Set<string>>(new Set());

/**
 * Derived store that combines conflict info with visited tab info
 * Only shows warnings for tabs that have been visited (configured)
 */
export const activeConflicts = derived([conflicts, visitedTabs], ([conflictResult, visited]) => {
	console.log('[Active Conflicts] Deriving active conflicts...');
	console.log('[Active Conflicts] Input conflicts:', conflictResult);
	console.log('[Active Conflicts] Visited tabs:', Array.from(visited));
	
	if (!conflictResult.hasConflicts) {
		console.log('[Active Conflicts] No conflicts detected');
		return {
			hasConflicts: false,
			conflicts: [],
			tabsNeedingAttention: []
		};
	}

	// Filter conflicts to only show warnings for tabs that have been visited
	// This prevents showing warnings for unconfigured tabs
	// EXCEPTION: Spell limit violations always show (urgent and actionable)
	const filteredConflicts = conflictResult.conflicts.filter((conflict) => {
		// Always include spell limit violations regardless of visited tabs
		if (conflict.type === 'spell_limit') {
			return true;
		}
		
		const hasVisitedTab = conflict.affectedTabs?.some((tab) => visited.has(tab)) ?? false;
		return hasVisitedTab;
	});

	// Get all tabs from filtered conflicts
	// For spell limit violations, include the tabs even if not visited (urgent/actionable)
	const tabsNeedingAttention = [
		...new Set(filteredConflicts.flatMap((c) => c.affectedTabs || []))
	].filter((tab) => {
		// Always include tabs from spell limit violations
		const hasSpellLimitConflict = filteredConflicts.some(
			(c) => c.type === 'spell_limit' && c.affectedTabs?.includes(tab)
		);
		if (hasSpellLimitConflict) {
			return true;
		}
		// Otherwise only include if tab has been visited
		return visited.has(tab);
	});

	const result = {
		hasConflicts: filteredConflicts.length > 0,
		conflicts: filteredConflicts,
		tabsNeedingAttention
	};
	console.log('[Active Conflicts] Final result:', result);
	return result;
});

/**
 * Helper functions for managing visited tabs
 */
export function markTabAsVisited(tabName: string) {
	visitedTabs.update((visited) => {
		const newVisited = new Set(visited);
		newVisited.add(tabName);
		return newVisited;
	});
}

export function isTabVisited(tabName: string): boolean {
	let visited: Set<string>;
	const unsubscribe = visitedTabs.subscribe((v) => (visited = v));
	unsubscribe();
	return visited!.has(tabName);
}

/**
 * Get conflicts that specifically affect a given tab
 */
export function getConflictsForTab(tabName: string): Conflict[] {
	let currentConflicts: ConflictDetectionResult;
	const unsubscribe = conflicts.subscribe((c) => (currentConflicts = c));
	unsubscribe();

	return currentConflicts!.conflicts.filter(
		(conflict) => conflict.affectedTabs?.includes(tabName) ?? false
	);
}

/**
 * Check if a specific tab has any conflicts
 */
export function tabHasConflicts(tabName: string): boolean {
	return getConflictsForTab(tabName).length > 0;
}
