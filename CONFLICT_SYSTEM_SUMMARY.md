# Conflict Detection System - Implementation Summary

## What Was Implemented

The D&D character creator now has a **fully functional, project-wide conflict detection and validation system**.

## Key Accomplishments

### 1. ✅ Centralized Error Store
- Created reactive conflict tracking in `conflict_store.ts`
- All validation errors tracked in one place
- Automatic detection when character state changes
- Ready for export validation integration

### 2. ✅ Visual Tab Highlighting
- Tabs with errors/conflicts show **red background**
- Warning icon (⚠️) displayed on tab
- Pulsing animation draws attention
- Multiple tabs can be highlighted simultaneously

### 3. ✅ Feature Card Conflict Indicators
- Cards with conflicts show visual indicators:
  - **⚠️ Warning icon**: User-changeable selection (can fix conflict)
  - **🔒 Lock icon**: Automatic grant (no user action available)
- Light red background on conflicting cards
- Tooltips explain the conflict type

### 4. ✅ Spell Limit Validation Integration
- Fixed spell limit detection to read from `character.spells`
- Handles both string and object spell formats
- Properly distinguishes cantrips from leveled spells
- Supports Cleric (WIS+3), Paladin (CHA+1), and Druid (WIS+3)
- Handles unselected ability scores correctly (< 8 treated as 10)
- Marks Spells tab red when limits exceeded

## Technical Changes Made

### File: `src/lib/stores/conflict_detection.ts`

**Change 1: Fixed spell data reading**
```typescript
// OLD: Read from wrong location
if (!character._provenance?.['spell_selections']) {
    return conflicts;
}

// NEW: Read from character.spells
if (!character.spells || !Array.isArray(character.spells)) {
    return conflicts;
}

// Extract spell names (handle both strings and objects)
const spellNames = character.spells.map((spell) => {
    if (typeof spell === 'string') return spell;
    if (typeof spell === 'object' && spell !== null && 'name' in spell) {
        return (spell as any).name;
    }
    return '';
}).filter((name) => name !== '');
```

**Change 2: Fixed ability score handling**
```typescript
// Added check for unselected ability scores
if (character.class === 'Cleric' || character.class === 'Druid') {
    const rawWisdom = character.wisdom || 10;
    const wisdomScore = rawWisdom < 8 ? 10 : rawWisdom; // Default unselected to 10
    const wisdomModifier = Math.floor((wisdomScore - 10) / 2);
    const expectedSpells = Math.max(1, wisdomModifier + 3);
    // ...
}
```

**Change 3: Removed unused import**
```typescript
// Cleaned up unused Spell type import
import { getSpellAccessForCharacter, getSpellsByLevel } from '$lib/data/spells';
```

## How It Works

### Conflict Detection Flow

1. **Character changes** → `character_store` updates
2. **Derived store** `conflicts` automatically recalculates
3. **Provenance analysis** detects duplicate additions across scopes
4. **Spell limit check** validates selected spells vs dynamic limits
5. **Tab mapping** determines which tabs need attention
6. **Visual updates** tabs and cards highlight with red/icons

### Spell Limit Detection

```
For Cleric/Druid:
- Spell Limit = Wisdom Modifier + 3 (minimum 1)
- Count only leveled spells (exclude cantrips and domain spells)

For Paladin:
- Spell Limit = Charisma Modifier + 1 (minimum 1)
- Count only leveled spells (exclude cantrips and oath spells)

If selected spells > limit:
→ Create conflict with affectedTabs: ['spells']
→ Spells tab turns red
→ Warning banner shows on relevant pages
```

### Multi-Level Feedback System

The system provides feedback at multiple levels:

1. **Local warnings** (abilities/species pages): Immediate yellow banner when changes would cause conflicts
2. **Global tab highlighting**: Red tabs show project-wide errors
3. **Feature card indicators**: Precise identification of conflicting selections
4. **Conflict warning component**: Detailed explanation and resolution guidance

## Testing Scenarios

### Scenario 1: Skill Conflict (Bard + High Elf Perception)
**Result**: ✅ Both Class and Species tabs turn red, cards show ⚠️/🔒 icons

### Scenario 2: Spell Limit Exceeded (Cleric + Species Removal)
**Result**: ✅ Spells tab turns red, warning banner appears on species page

### Scenario 3: Ability Score Change (Paladin Charisma)
**Result**: ✅ Warning on abilities page, Spells tab turns red

### Scenario 4: Multiple Conflicts
**Result**: ✅ All affected tabs highlighted, each shows relevant warnings

## User Experience Flow

### Example: Resolving Bard/High Elf Perception Conflict

1. User selects Bard, chooses Perception skill
2. User selects High Elf (also grants Perception)
3. **System Response**:
   - ⚠️ Class tab turns red
   - ⚠️ Species tab turns red
   - Warning banner appears on both pages
   - Bard skill card shows ⚠️ (can change)
   - High Elf Keen Senses shows 🔒 (automatic)
4. User goes to Class tab
5. Changes Perception to Athletics
6. **System Response**:
   - Both tabs return to normal color
   - Warning banners disappear
   - Conflict resolved!

## Future Integration: Export Validation

The system is designed to support export blocking:

```typescript
// Future implementation
function exportCharacter() {
    if ($activeConflicts.hasConflicts) {
        showError("Cannot export character with unresolved conflicts");
        
        // Highlight all tabs needing attention
        $activeConflicts.tabsNeedingAttention.forEach(tab => {
            highlightTab(tab);
        });
        
        return false; // Block export
    }
    
    // Export successful
    downloadCharacterSheet();
}
```

## System Architecture

### Core Components

```
conflict_detection.ts
    ↓ (detects conflicts)
conflict_store.ts
    ↓ (reactive store)
+layout.svelte (tab highlighting)
FeatureCard.svelte (card indicators)
ConflictWarning.svelte (warning banners)
```

### Data Flow

```
User Action
    ↓
Character Store Update
    ↓
Conflict Detection Runs
    ↓
Conflict Store Updates
    ↓
UI Components React
    ↓
Visual Feedback (red tabs, icons, warnings)
```

## Benefits

### For Users
- Clear visual feedback about what needs fixing
- Guidance on where to go to resolve issues
- Prevention of invalid character builds
- Professional, polished experience

### For Developers
- Centralized error tracking (single source of truth)
- Easy to add new conflict types
- Reactive system (no manual updates needed)
- Ready for export validation

### For the Project
- **Project-wide validation** tracking exactly as requested
- **Red tab highlighting** for error identification
- **Feature card indicators** with warning/lock icons
- **Ready for export blocking** when user requests it

## What's Next

The conflict detection system is **complete and operational**. Future enhancements could include:

1. **Export validation**: Block export if conflicts exist
2. **Conflict resolution suggestions**: Auto-fix buttons
3. **Advanced analytics**: Track common conflict patterns
4. **Persistent state**: Remember dismissed warnings
5. **Additional conflict types**: Equipment conflicts, feat prerequisites, etc.

## Documentation

- **CONFLICT_DETECTION_GUIDE.md**: Comprehensive testing and usage guide
- **CONFLICT_SYSTEM_SUMMARY.md**: This implementation summary
- **Inline code comments**: Detailed technical documentation

## Status: ✅ COMPLETE

All requested features have been implemented:
- ✅ Project-wide error tracking store
- ✅ Red tab highlighting for errors
- ✅ Feature card conflict indicators (⚠️/🔒)
- ✅ Spell limit validation integration
- ✅ Ready for export validation

The system is **production-ready** and fully functional!
