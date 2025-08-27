import { get } from 'svelte/store';
import { character_store, type Character } from './character_store';

/**
 * Smart revert that only removes items that were actually added by the specific scope
 * This prevents removing items that were added by other sources
 */
export function smartRevertScope(scopeId: string): Character {
	const char = get(character_store);

	if (!char._provenance?.[scopeId]) {
		return char; // Nothing to revert
	}

	// Get what this scope added
	const prov = char._provenance[scopeId];
	const changes = '_set' in prov && prov._set ? prov._set : prov;

	if (!changes) {
		delete char._provenance[scopeId];
		return char;
	}

	// For each field that this scope modified
	for (const [fieldName, fieldValues] of Object.entries(changes)) {
		if (!Array.isArray(fieldValues)) continue;

		const typedKey = fieldName as keyof Character;
		const currentArray = char[typedKey] as any[];

		if (!Array.isArray(currentArray)) continue;

		// Rebuild the array by removing only this scope's contributions
		// and keeping items from other sources
		const newArray = rebuildArrayWithoutScope(
			currentArray,
			fieldValues,
			scopeId,
			fieldName,
			char._provenance
		);

		(char[typedKey] as any) = newArray;
	}

	// Remove this scope from provenance
	delete char._provenance[scopeId];

	return char;
}

/**
 * Rebuild an array by removing only items contributed by a specific scope
 * while preserving items from other sources
 */
function rebuildArrayWithoutScope(
	currentArray: string[],
	scopeContributions: string[],
	targetScopeId: string,
	fieldName: string,
	allProvenance: Record<string, any> | undefined
): string[] {
	if (!allProvenance) return currentArray;

	// Build a map of which scopes contributed which items
	const itemSources: Record<string, string[]> = {};

	for (const [scopeId, prov] of Object.entries(allProvenance)) {
		const changes = '_set' in prov && prov._set ? prov._set : prov;
		if (!changes || !Array.isArray(changes[fieldName])) continue;

		for (const item of changes[fieldName]) {
			if (!itemSources[item]) {
				itemSources[item] = [];
			}
			itemSources[item].push(scopeId);
		}
	}

	// Rebuild array, excluding items that ONLY come from the target scope
	const newArray: string[] = [];

	for (const item of currentArray) {
		const sources = itemSources[item] || [];

		// Keep the item if:
		// 1. It's not contributed by the target scope, OR
		// 2. It's contributed by other scopes in addition to the target scope
		const otherSources = sources.filter((s) => s !== targetScopeId);
		if (otherSources.length > 0) {
			newArray.push(item);
		}
	}

	return newArray;
}

/**
 * Test if removing a scope would cause the conflict to be resolved
 * without breaking other functionality
 */
export function canSafelyRevertScope(scopeId: string): boolean {
	const char = get(character_store);

	if (!char._provenance?.[scopeId]) {
		return false; // Nothing to revert
	}

	// For now, assume all user-selectable scopes can be safely reverted
	// This could be enhanced with more sophisticated logic
	return (
		scopeId.includes('Skill Proficiencies') ||
		scopeId.includes('Bonus Proficiencies') ||
		scopeId.includes('college_of_lore')
	);
}
