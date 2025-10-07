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
	return detectConflicts();
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
	if (!conflictResult.hasConflicts) {
		return {
			hasConflicts: false,
			conflicts: [],
			tabsNeedingAttention: []
		};
	}

	// Filter conflicts to only show warnings for tabs that have been visited
	// This prevents showing warnings for unconfigured tabs
	const filteredConflicts = conflictResult.conflicts.filter((conflict) => {
		return conflict.affectedTabs?.some((tab) => visited.has(tab)) ?? false;
	});

	const tabsNeedingAttention = [
		...new Set(filteredConflicts.flatMap((c) => c.affectedTabs || []))
	].filter((tab) => visited.has(tab));

	return {
		hasConflicts: filteredConflicts.length > 0,
		conflicts: filteredConflicts,
		tabsNeedingAttention
	};
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
