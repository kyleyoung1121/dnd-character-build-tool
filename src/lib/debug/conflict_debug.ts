import { get } from 'svelte/store';
import { character_store } from '$lib/stores/character_store';
import { conflicts, activeConflicts, visitedTabs } from '$lib/stores/conflict_store';
import { detectConflicts } from '$lib/stores/conflict_detection';

/**
 * Debug function to check current conflict detection state
 * Call from browser console: window.debugConflicts()
 */
export function debugConflicts() {
    console.log('=== CONFLICT DETECTION DEBUG ===\n');
    
    const char = get(character_store);
    const conflictResult = get(conflicts);
    const activeResult = get(activeConflicts);
    const visited = get(visitedTabs);
    
    console.log('1. CHARACTER STATE:');
    console.log('   Class:', char.class);
    console.log('   Race:', char.race, '/', char.subrace);
    console.log('   Skills:', char.skills);
    console.log('   Provenance keys:', Object.keys(char._provenance || {}));
    console.log('');
    
    console.log('2. PROVENANCE DETAILS:');
    if (char._provenance) {
        for (const [scopeId, prov] of Object.entries(char._provenance)) {
            const data = ('_set' in prov) ? prov._set : prov;
            console.log(`   ${scopeId}:`, data);
        }
    }
    console.log('');
    
    console.log('3. VISITED TABS:', Array.from(visited));
    console.log('');
    
    console.log('4. RAW CONFLICTS (from detectConflicts):');
    console.log('   Has conflicts:', conflictResult.hasConflicts);
    console.log('   Count:', conflictResult.conflicts.length);
    if (conflictResult.conflicts.length > 0) {
        conflictResult.conflicts.forEach((c, i) => {
            console.log(`   [${i}] Type: ${c.type}, Value: "${c.value}"`);
            console.log(`       Sources:`, c.sources);
            console.log(`       Affected tabs:`, c.affectedTabs);
        });
    }
    console.log('');
    
    console.log('5. ACTIVE CONFLICTS (after filtering):');
    console.log('   Has conflicts:', activeResult.hasConflicts);
    console.log('   Count:', activeResult.conflicts.length);
    console.log('   Tabs needing attention:', activeResult.tabsNeedingAttention);
    console.log('');
    
    console.log('6. MANUAL DETECTION TEST:');
    const manualResult = detectConflicts();
    console.log('   Detected:', manualResult.hasConflicts);
    console.log('   Conflicts:', manualResult.conflicts.length);
    console.log('   Tabs:', manualResult.tabsNeedingAttention);
    console.log('');
    
    console.log('=== END DEBUG ===');
    
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
    console.log('✅ Debug function loaded: window.debugConflicts()');
}
