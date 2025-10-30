# Debugging Conflict Detection - Current Status

## What I've Added

I've added extensive debug logging throughout the conflict detection system to help diagnose why conflicts aren't being detected.

### Debug Logging Locations

1. **`src/lib/stores/conflict_detection.ts`**
   - Logs when detection runs
   - Shows character state and provenance
   - Displays what additions were found
   - Reports conflicts found
   - Shows final results with tabs needing attention

2. **`src/lib/stores/conflict_store.ts`**
   - Logs when tabs are marked as visited
   - Shows active conflict filtering process
   - Displays which tabs have conflicts

3. **`src/lib/debug/conflict_debug.ts`**
   - New debug helper function
   - Call `window.debugConflicts()` in browser console
   - Shows complete state of conflict detection system

## How to Debug

### Step 1: Test Bard + High Elf Perception Conflict

1. Open your browser and navigate to the character creator
2. Open browser console (F12)
3. Navigate to **Class** tab
4. Select **Bard** class
5. In Bard skill proficiencies, select **Perception** (and 2 other skills)
6. Navigate to **Species** tab  
7. Select **High Elf** (grants Perception via Keen Senses)

### Step 2: Check Console Output

Look for these log messages:

```
[Visited Tabs] Marking tab as visited: class
[Visited Tabs] Marking tab as visited: species
[Conflict Detection] Running detection...
[Conflict Detection] Provenance: {...}
[Conflict Detection] Additions: {...}
[Conflict Detection] Found conflict: skill "Perception" from sources: [...]
[Active Conflicts] tabsNeedingAttention: [...]
```

### Step 3: Use Debug Function

In the console, type:
```javascript
window.debugConflicts()
```

This will show:
- Current character state
- All provenance entries
- Visited tabs
- Raw conflicts detected
- Active conflicts after filtering
- Tabs that should be red

### Step 4: Test Spell Limits

1. Create new character
2. Select **Cleric** class
3. Select **Wood Elf** species (+1 WIS)
4. Go to Abilities tab, set Wisdom to **15** (total 16)
5. Go to Spells tab, select **6 leveled spells**
6. Go back to Species tab
7. Try to remove Wood Elf
8. Check console for spell limit violation logs

## What to Look For

### If Conflicts ARE Detected But Tabs Aren't Red:

Check if:
- `[Conflict Detection] Found conflict` appears in logs ✓
- `[Active Conflicts] tabsNeedingAttention` is empty ✗
- Tabs are in visited list ✓

This means: **Filtering issue** - conflicts detected but not shown

### If Conflicts Are NOT Detected:

Check if:
- `[Conflict Detection] Additions` shows duplicate skills ✗
- Provenance has both `feature:Skill Proficiencies:X` and `feature:Keen Senses` ✗

This means: **Detection issue** - provenance not tracking correctly

### If Spell Limits Don't Show:

Check if:
- Character has spells array populated ✗
- Spell limit calculation runs ✗
- Violation created with affectedTabs: ['spells'] ✗

This means: **Spell detection issue**

## Possible Issues I'm Investigating

### Issue 1: Timing Problem
The conflict detection might be running before both class and species are fully applied to the character. The stores are reactive, but maybe there's a race condition.

### Issue 2: Provenance Format
The new structured provenance format (`_set`, `_mods`) might not be getting parsed correctly in some cases.

### Issue 3: Tab ID Mismatch  
The tab IDs used in conflict detection might not match the tab IDs in the navigation (e.g., "class" vs "Class").

### Issue 4: Visited Tab Filtering Too Aggressive
The active conflicts store only shows conflicts for visited tabs. Maybe both tabs need to be visited before conflicts appear?

## Next Steps

**Please run the test scenarios above and share:**

1. What you see in the browser console
2. The output of `window.debugConflicts()`
3. Whether any errors appear

This will help me identify the exact issue and fix it properly.

## Quick Test Commands

```javascript
// Check if conflict detection is working at all
window.debugConflicts()

// Check visited tabs
console.log('Visited:', Array.from($visitedTabs))

// Manually trigger conflict detection
import { detectConflicts } from '$lib/stores/conflict_detection'
console.log(detectConflicts())
```

## Current Hypothesis

Based on the code review, I believe the most likely issues are:

1. **Timing**: Conflict detection runs before provenance is fully populated
2. **Tab Filtering**: Both tabs must be visited before conflict shows
3. **Reactive Updates**: The derived store might not be triggering UI updates

I'm continuing to investigate and will fix the root cause once I understand what's happening from the debug logs.
