import { get } from 'svelte/store';
import { character_store, type Character } from './character_store';

// New internal provenance shape for a scope:
// {
//   _set: Partial<Character> | undefined       // values that were set/added
//   _prevScalars: Partial<Character> | null    // original scalar values (before set)
//   _mods: Record<string, number> | null       // numeric deltas applied (e.g., { strength: +1 })
//   _modsPrev: Partial<Character> | null       // original values (before mods), to restore exactly
// }
// NOTE: We keep backward compatibility with the old "flat" provenance shape.

export function applyChoice(
	scopeId: string,
	changes: Partial<Character> = {},
	mods?: Record<string, number>
) {
	character_store.update((char) => {
		// If this scope already applied something, revert it first (fresh apply)
		if (char._provenance?.[scopeId]) {
			char = revertChanges(char, scopeId);
		}

		const prevScalars: Partial<Character> = {};
		const modsPrev: Partial<Character> = {};

		// 1) Apply "set / add" style updates (backward compatible)
		for (const [key, value] of Object.entries(changes)) {
			const typedKey = key as keyof Character;
			const current = char[typedKey] as any;

			if (Array.isArray(current) && Array.isArray(value)) {
				// ADD semantics for arrays
				(char[typedKey] as any) = [...current, ...value];
			} else {
				// SET semantics for scalars (remember prior value for perfect revert)
				prevScalars[typedKey] = current as any;
				(char[typedKey] as any) = value as any;
			}
		}

		// 2) Apply numeric MODIFICATIONS with exact restore
		if (mods) {
			for (const [key, rawDelta] of Object.entries(mods)) {
				const typedKey = key as keyof Character;
				const before = char[typedKey] as any; // may be number | null
				modsPrev[typedKey] = before;

				const delta = Number(rawDelta) || 0;
				const base = typeof before === 'number' ? before : 0;
				(char[typedKey] as any) = base + delta;
			}
		}

		// 3) Provenance
		char._provenance ??= {};
		char._provenance[scopeId] = {
			_set: Object.keys(changes).length ? changes : null,
			_prevScalars: Object.keys(prevScalars).length ? prevScalars : null,
			_mods: mods && Object.keys(mods).length ? mods : null,
			_modsPrev: Object.keys(modsPrev).length ? modsPrev : null
		} as any;

		return char;
	});
}

export function revertChanges(char: Character, scopeId: string): Character {
	const prov = char._provenance?.[scopeId];
	if (!prov) return char;

	// Use smart revert logic for arrays to avoid removing items from other sources
	// Backward compatibility: old flat provenance shape
	if (!('_set' in prov) && !('_mods' in prov)) {
		// Keep provenance reference for analysis BEFORE deletion
		const provenanceForAnalysis = char._provenance;

		for (const [key, value] of Object.entries(prov)) {
			const typedKey = key as keyof Character;
			if (Array.isArray(char[typedKey]) && Array.isArray(value)) {
				// Use smart removal that preserves items from other sources
				(char[typedKey] as any) = smartRemoveFromArray(
					char[typedKey] as any,
					value,
					scopeId,
					key,
					provenanceForAnalysis
				);
			} else {
				(char[typedKey] as any) = Array.isArray(value) ? [] : null;
			}
		}
		delete char._provenance?.[scopeId];
		return char;
	}

	const { _set, _prevScalars, _mods, _modsPrev } = prov as {
		_set?: Partial<Character> | null;
		_prevScalars?: Partial<Character> | null;
		_mods?: Record<string, number> | null;
		_modsPrev?: Partial<Character> | null;
	};

	// IMPORTANT: Keep a reference to provenance BEFORE deletion for smart removal
	const provenanceForAnalysis = char._provenance;

	// 1) Revert sets/adds with smart logic
	if (_set) {
		for (const [key, value] of Object.entries(_set)) {
			const typedKey = key as keyof Character;
			if (Array.isArray(value)) {
				// Use smart removal that preserves items from other sources
				// Use provenanceForAnalysis BEFORE we delete the scope
				(char[typedKey] as any) = smartRemoveFromArray(
					char[typedKey] as any,
					value,
					scopeId,
					key,
					provenanceForAnalysis
				);
			} else {
				// restore precise prior scalar if we recorded it; else null fallback
				const prev = _prevScalars?.[typedKey];
				(char[typedKey] as any) = prev ?? null;
			}
		}
	}

	// 2) Revert numeric modifications
	if (_mods) {
		for (const key of Object.keys(_mods)) {
			const typedKey = key as keyof Character;
			// restore exact previous value if we captured it
			if (_modsPrev && Object.prototype.hasOwnProperty.call(_modsPrev, typedKey)) {
				(char[typedKey] as any) = _modsPrev[typedKey] as any;
			} else {
				// fallback: subtract delta (should rarely be needed)
				const delta = Number(_mods[key]) || 0;
				const current = char[typedKey] as any;
				const base = typeof current === 'number' ? current : 0;
				(char[typedKey] as any) = base - delta;
			}
		}
	}

	// Delete scope AFTER all processing is complete
	delete char._provenance?.[scopeId];
	return char;
}

/**
 * Smart array removal that removes the correct number of instances contributed by target scope
 * while preserving instances from other sources
 */
function smartRemoveFromArray(
	currentArray: string[],
	itemsToRemove: string[],
	targetScopeId: string,
	fieldName: string,
	allProvenance: Record<string, any> | undefined
): string[] {
	if (!allProvenance) {
		// Fallback to old behavior if no provenance available
		return currentArray.filter((item: any) => !itemsToRemove.includes(item));
	}

	// Build a map of how many times each scope contributed each item
	const itemContributions: Record<string, Record<string, number>> = {}; // item -> {scopeId -> count}

	for (const [scopeId, prov] of Object.entries(allProvenance)) {
		const changes = '_set' in prov && prov._set ? prov._set : prov;
		if (!changes || !Array.isArray(changes[fieldName])) continue;

		for (const item of changes[fieldName]) {
			if (!itemContributions[item]) {
				itemContributions[item] = {};
			}
			itemContributions[item][scopeId] = (itemContributions[item][scopeId] || 0) + 1;
		}
	}

	// Calculate how many instances we should remove for each item
	const instancesToRemove: Record<string, number> = {};
	for (const item of itemsToRemove) {
		const contributions = itemContributions[item] || {};
		instancesToRemove[item] = contributions[targetScopeId] || 0;
	}

	// Rebuild array by removing the correct number of instances
	const newArray: string[] = [];
	const itemsRemovedCount: Record<string, number> = {};

	for (const item of currentArray) {
		if (itemsToRemove.includes(item)) {
			const shouldRemove = instancesToRemove[item] || 0;
			const alreadyRemoved = itemsRemovedCount[item] || 0;

			if (alreadyRemoved < shouldRemove) {
				// Remove this instance (contributed by target scope)
				itemsRemovedCount[item] = alreadyRemoved + 1;
				// Don't add to newArray (effectively removing it)
			} else {
				// Keep this instance (contributed by other scopes)
				newArray.push(item);
			}
		} else {
			// Item not in removal list, always keep
			newArray.push(item);
		}
	}

	return newArray;
}

/**
 * Enhanced applyChoice that checks for spell limit violations and shows immediate feedback
 * This is specifically for class/subclass changes that might affect spell limits
 * Temporarily disabled to fix circular import issues
 */
export function applyChoiceWithSpellLimitCheck(
	scopeId: string,
	changes: Partial<Character> = {},
	mods?: Record<string, number>
): {
	applied: boolean;
	spellLimitViolations?: import('./conflict_detection').SpellLimitViolation[];
} {
	// Apply the change normally for now
	applyChoice(scopeId, changes, mods);

	// TODO: Re-implement spell limit checking without circular imports
	return {
		applied: true
	};
}

/**
 * Enhanced applyChoice that checks for conflicts before applying
 * Returns conflict information if conflicts would be created
 * Temporarily disabled to fix circular import issues
 */
export function applyChoiceWithConflictCheck(
	scopeId: string,
	changes: Partial<Character> = {},
	mods?: Record<string, number>
): { applied: boolean; conflicts?: import('./conflict_detection').Conflict[] } {
	// Apply the change normally for now
	applyChoice(scopeId, changes, mods);

	// TODO: Re-implement conflict checking without circular imports
	return {
		applied: true
	};
}

/**
 * Get a summary of what each scope has contributed to the character
 * Useful for debugging and conflict resolution UI
 */
export function getProvenanceSummary(): Record<
	string,
	{
		skills: string[];
		proficiencies: string[];
		languages: string[];
		features: string[];
	}
> {
	const char = get(character_store);
	const summary: Record<string, any> = {};

	if (!char._provenance) return summary;

	for (const [scopeId, prov] of Object.entries(char._provenance)) {
		const changes = '_set' in prov && prov._set ? prov._set : prov;
		if (!changes) continue;

		summary[scopeId] = {
			skills: Array.isArray(changes.skills) ? [...changes.skills] : [],
			proficiencies: Array.isArray(changes.proficiencies) ? [...changes.proficiencies] : [],
			languages: Array.isArray(changes.languages) ? [...changes.languages] : [],
			features: Array.isArray(changes.features) ? [...changes.features] : []
		};
	}

	return summary;
}
