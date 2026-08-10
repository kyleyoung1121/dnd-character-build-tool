import { get } from 'svelte/store';
import { character_store } from '$lib/stores/character_store';
import { conflicts, activeConflicts, visitedTabs } from '$lib/stores/conflict_store';
import { detectConflicts } from '$lib/stores/conflict_detection';

/**
 * Debug function to check current conflict detection state
 * Call from browser console: window.debugConflicts()
 */
export function debugConflicts() {
    
    const char = get(character_store);
    const conflictResult = get(conflicts);
    const activeResult = get(activeConflicts);
    const visited = get(visitedTabs);
    
    if (char._provenance) {
        for (const [scopeId, prov] of Object.entries(char._provenance)) {
            const data = ('_set' in prov) ? prov._set : prov;
        }
    }
    
    return {
        character: char,
        conflicts: conflictResult,
        activeConflicts: activeResult,
        visitedTabs: Array.from(visited)
    };
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
    (window as any).debugConflicts = debugConflicts;
}
