# Conflict Detection System - Complete Guide

## Overview

The D&D character creator now has a **comprehensive, project-wide conflict detection system** that tracks validation errors across all tabs and provides visual feedback to guide users in resolving issues.

## Key Features

### 1. **Centralized Error Tracking** ✅
- All conflicts are tracked in a reactive store (`conflict_store.ts`)
- Conflicts are automatically detected when character state changes
- System tracks which tabs have been visited to avoid false warnings

### 2. **Visual Tab Highlighting** ✅
- Tabs with conflicts show a **red background** with pulsing animation
- Warning icon (⚠️) appears next to the tab name
- Multiple tabs can be highlighted simultaneously

### 3. **Feature Card Conflict Indicators** ✅
- Cards with conflicts show:
  - **⚠️ Warning icon**: User can change selection to resolve
  - **🔒 Lock icon**: Automatic grant (no user action available)
- Conflicting cards have light red background

### 4. **Spell Limit Validation** ✅
- Automatically detects when spell limits are exceeded
- Handles both Clerics (WIS-based) and Paladins (CHA-based)
- Properly counts cantrips separately from leveled spells
- Supports prepared spell classes (Cleric, Paladin, Druid)

## System Architecture

### Core Files

1. **`src/lib/stores/conflict_detection.ts`**
   - Main conflict detection logic
   - Detects skill/proficiency/language/feature duplicates
   - Spell limit violation detection
   - Maps conflicts to affected tabs

2. **`src/lib/stores/conflict_store.ts`**
   - Reactive store that wraps conflict detection
   - Filters conflicts based on visited tabs
   - Provides helper functions for querying conflicts

3. **`src/routes/(creation)/+layout.svelte`**
   - Renders navigation tabs
   - Applies red highlighting to tabs with conflicts
   - Shows warning icons

4. **`src/lib/components/FeatureCard.svelte`**
   - Individual feature card rendering
   - Shows warning/lock icons on conflicting features
   - Highlights cards with conflicts

5. **`src/lib/components/ConflictWarning.svelte`**
   - Collapsible warning banner shown on each page
   - Lists all conflicts affecting current tab
   - Provides resolution suggestions

## Conflict Types

### 1. Skills
**Example**: Bard grants Perception, High Elf also grants Perception

**Detection**: Both class and species add "Perception" to character skills

**Resolution**: User changes Bard skill selection to a different skill

### 2. Proficiencies
**Example**: Multiple sources grant the same weapon/armor proficiency

**Detection**: Duplicate entries in character proficiencies array

**Resolution**: User changes selection to different proficiency

### 3. Languages
**Example**: Background grants Common, species also grants Common

**Detection**: Duplicate entries in character languages array

**Resolution**: User changes language selection

### 4. Spell Limits
**Example**: 
- Cleric with WIS 16 (+3) can prepare 6 spells (WIS mod + 3)
- User selects 8 spells
- Remove Wood Elf species → WIS drops from 16 to 15 (+2) → only 5 spells allowed
- Conflict detected: 8 selected, 5 allowed

**Detection**: Compares selected spell count to dynamic spell limits

**Resolution**: User visits Spells tab and deselects excess spells

## Testing Scenarios

### Test 1: Bard + High Elf Perception Conflict

**Steps**:
1. Create new character
2. Select **Bard** class
3. In Bard skill proficiencies, select **Perception** (and 2 other skills)
4. Navigate to Species tab
5. Select **High Elf** (grants Perception automatically via Keen Senses)

**Expected Result**:
- ⚠️ **Class tab** turns red (user can change skill selection)
- ⚠️ **Species tab** turns red (automatic grant, cannot change)
- On Class page: Bard skill proficiency card shows **⚠️ warning icon**
- On Species page: Keen Senses feature shows **🔒 lock icon**
- Conflict warning banner appears on both pages explaining the issue

**Resolution**:
- Go back to Class tab
- Change Perception to a different skill (e.g., Athletics)
- Both tabs return to normal color
- Warning banner disappears

### Test 2: Cleric Spell Limit Exceeded

**Steps**:
1. Create new character
2. Select **Cleric** class
3. Select **Wood Elf** species (grants +1 WIS)
4. Navigate to Abilities tab
5. Set Wisdom to **15** (becomes 16 with Wood Elf bonus)
   - WIS modifier: +3
   - Spell limit: 6 leveled spells (WIS mod + 3)
6. Navigate to Spells tab
7. Select **6 leveled spells** and **3 cantrips**
8. Go back to Species tab
9. **Remove Wood Elf** selection

**Expected Result**:
- Wisdom drops from 16 to 15 (modifier +2)
- New spell limit: 5 leveled spells
- Yellow warning banner appears: "You have 6 spells but can only prepare 5"
- ⚠️ **Spells tab** turns red
- System prevents species removal until spells are fixed

**Resolution**:
- Click link in warning to go to Spells page
- Remove 1 leveled spell
- Now have 5/5 spells selected
- Go back to Species page
- Can now successfully remove Wood Elf

### Test 3: Paladin Spell Limit with Ability Score Change

**Steps**:
1. Create new character
2. Select **Paladin** class
3. Select **Half-Elf** species (grants +2 CHA)
4. Navigate to Abilities tab
5. Set Charisma to **15** (becomes 17 with Half-Elf bonus)
   - CHA modifier: +3
   - Spell limit: 4 first-level spells (CHA mod + 1)
6. Navigate to Spells tab
7. Select **4 first-level spells**
8. Go back to Abilities tab
9. **Lower Charisma from 15 to 12**

**Expected Result**:
- Charisma becomes 14 total (12 + 2 from Half-Elf)
- CHA modifier: +2
- New spell limit: 3 first-level spells
- Warning banner appears on Abilities page
- ⚠️ **Spells tab** turns red
- Warning says "You have 4 spells but can only prepare 3"

**Resolution**:
- Visit Spells page
- Remove 1 spell
- Spells tab returns to normal color

### Test 4: Multiple Conflicting Sources

**Steps**:
1. Create new character
2. Select **Ranger** class
3. In Ranger skill proficiencies, select **Stealth**
4. Navigate to Background tab
5. Select **Criminal** background
6. In Criminal skill selection, select **Stealth** and another skill

**Expected Result**:
- ⚠️ **Class tab** turns red
- ⚠️ **Background tab** turns red
- Conflict warning on both pages lists both sources
- Both Ranger and Criminal skill selection cards show **⚠️ warning icon**

**Resolution**:
- Change either Ranger skill or Criminal skill selection
- System allows changing either source
- Once changed, both tabs return to normal

## Implementation Details

### How Conflict Detection Works

1. **Character Changes Trigger Detection**
   ```typescript
   // In conflict_store.ts
   export const conflicts = derived(character_store, ($character) => {
       return detectConflicts();
   });
   ```

2. **Provenance Tracking**
   - Every feature/class/species/background tracks what it adds via `_provenance`
   - Format: `{ scopeId: { _set: { skills: [...], proficiencies: [...] } } }`
   - Conflict detection scans all scopes for duplicate additions

3. **Tab Mapping**
   ```typescript
   // Maps scope IDs to tab names
   'class:Bard' → 'class'
   'feature:Skill Proficiencies:0' → 'class'
   'high_elf.keen_senses' → 'species'
   'background:Criminal' → 'background'
   ```

4. **Spell Limit Calculation**
   - Reads character.spells array
   - Handles both string and object formats
   - Uses spell data to determine spell levels
   - Calculates dynamic limits based on ability scores
   - Handles unselected ability scores (< 8) by defaulting to 10

### User-Changeable vs Automatic Grants

**User-Changeable** (⚠️):
- Class skill selections
- Background skill selections
- Expertise selections
- Any dropdown with multiple options

**Automatic** (🔒):
- Racial features (e.g., High Elf Keen Senses)
- Class features without choices
- Background features without user selection
- Fixed class proficiencies

## Advanced Features

### Visited Tab Tracking
- System only shows warnings for tabs the user has visited
- Prevents false warnings on unconfigured tabs
- `markTabAsVisited()` called automatically on navigation

### Spell Limit Intelligence
- Handles prepared spell classes (Cleric, Paladin, Druid)
- Distinguishes cantrips from leveled spells
- Excludes domain/oath spells from limit calculations
- Accounts for racial spell bonuses separately

### Multiple Tabs Highlighted
- When conflicts affect multiple tabs, all are highlighted
- System prioritizes user-changeable tabs first
- User can resolve from any affected tab

## Future Export Integration

The conflict system is designed to support future export validation:

```typescript
// Pseudocode for export validation
if ($activeConflicts.hasConflicts) {
    showError("Cannot export: character has unresolved conflicts");
    highlightAffectedTabs($activeConflicts.tabsNeedingAttention);
    return false;
}
exportCharacter();
```

## Troubleshooting

### "Conflicts not showing up"
- Check if tab has been visited: `console.log($visitedTabs)`
- Verify character has conflicting selections
- Check browser console for errors in conflict detection

### "Tab not turning red"
- Verify conflict affects that specific tab
- Check `$activeConflicts.tabsNeedingAttention`
- Ensure `hasConflict(tabId)` returns true

### "Spell limits incorrect"
- Verify ability scores are set correctly
- Check character class (Cleric, Paladin, Druid)
- Ensure spell count includes only leveled spells, not cantrips
- Verify spell metadata includes correct tabSource

## Summary

The conflict detection system is **fully operational** and provides:
- ✅ Centralized project-wide error tracking
- ✅ Visual feedback via red tab highlighting
- ✅ Feature card indicators (warning/lock icons)
- ✅ Spell limit validation for prepared casters
- ✅ Ready for export validation integration

All core functionality requested by the user is now in place and working!
