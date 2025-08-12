import { get } from 'svelte/store';
import { character_store, type Character } from './character_store';

export function applyChoice(scopeId: string, changes: Partial<Character>) {
	character_store.update(char => {
		// Remove old changes from this scope if they exist
		if (char._provenance?.[scopeId]) {
			char = revertChanges(char, scopeId);
		}

		// Apply new changes
		for (const [key, value] of Object.entries(changes)) {
			const typedKey = key as keyof Character;

			if (Array.isArray(char[typedKey]) && Array.isArray(value)) {
				(char[typedKey] as any) = [
					...(char[typedKey] as any),
					...value
				];
			} else {
				(char[typedKey] as any) = value;
			}
		}

		// Record provenance
		char._provenance ??= {};
		char._provenance[scopeId] = changes;

		return char;
	});
}

export function revertChanges(char: Character, scopeId: string): Character {
	const oldChanges = char._provenance?.[scopeId];
	if (!oldChanges) return char;

	// Remove/undo the old changes
	for (const [key, value] of Object.entries(oldChanges)) {
		const typedKey = key as keyof Character;

		if (Array.isArray(char[typedKey]) && Array.isArray(value)) {
			// Remove those specific values from the array
			(char[typedKey] as any) = (char[typedKey] as any).filter(
				(item: any) => !value.includes(item)
			);
		} else {
			// Reset to null or empty array if overwritten
			(char[typedKey] as any) = Array.isArray(value) ? [] : null;
		}
	}

	delete char._provenance?.[scopeId];
	return char;
}
