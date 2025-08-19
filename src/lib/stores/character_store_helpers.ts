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

// Backward compatibility: old flat provenance shape
if (!('_set' in prov) && !('_mods' in prov)) {
	for (const [key, value] of Object.entries(prov)) {
	const typedKey = key as keyof Character;
	if (Array.isArray(char[typedKey]) && Array.isArray(value)) {
		(char[typedKey] as any) = (char[typedKey] as any).filter(
		(item: any) => !value.includes(item)
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

// 1) Revert sets/adds
if (_set) {
	for (const [key, value] of Object.entries(_set)) {
	const typedKey = key as keyof Character;
	if (Array.isArray(value)) {
		// remove only what we added
		(char[typedKey] as any) = (char[typedKey] as any).filter(
		(item: any) => !value.includes(item)
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

delete char._provenance?.[scopeId];
return char;
}
