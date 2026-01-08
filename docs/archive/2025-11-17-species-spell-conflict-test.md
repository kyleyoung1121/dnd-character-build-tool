# Species Deselection Spell Conflict Warning - Test Guide

## Overview
This feature adds a conflict warning when removing a species would cause spell limit violations for Clerics and Paladins.

## What Was Implemented

### 1. Spell Limit Validation Function
- `validateSpellLimitBeforeRemoval()` - Checks if removing species ability bonuses would violate spell limits
- Calculates what ability scores would be WITHOUT the species bonuses
- Compares current prepared spell count against the new reduced limit
- Shows a warning banner if a conflict is detected

### 2. Warning Banner
- Displays at the top of the page when a spell limit conflict is detected
- Shows:
  - Current number of prepared spells
  - New spell limit (after species removal)
  - Number of excess spells that need to be removed
  - Link to the Spells page
- Can be dismissed by clicking the X button

### 3. Affected Classes
- **Cleric**: Prepared spells = WIS modifier + 3 (minimum 1)
- **Paladin**: Prepared spells = CHA modifier + 1 (minimum 1)

## Test Scenarios

### Scenario 1: Half-Elf Cleric with Wisdom Bonus

**Setup:**
1. Navigate to the Species page
2. Select **Half-Elf**
3. For "Ability Score Increase", choose **Wisdom** as one of your two +1 bonuses
4. Navigate to the Class page
5. Select **Cleric**
6. Navigate to the Abilities page
7. Assign ability scores ensuring Wisdom benefits from the Half-Elf bonus
   - Example: Assign 14 to Wisdom (base) + 1 (Half-Elf) = 15 total (modifier +2)
   - This gives you 2 + 3 = 5 prepared spells
8. Navigate to the Spells page
9. Select **5 prepared spells** from the Cleric spell list

**Test:**
1. Navigate back to the Species page
2. Click the **✕** button to remove Half-Elf

**Expected Result:**
- A yellow/orange warning banner appears at the top of the page
- The warning states:
  - "Removing this species will reduce your **Wisdom** bonus"
  - "You currently have **5 prepared spells** but would only be able to prepare **4**"
  - "Please visit the Spells page to remove **1 spell** before changing your species"
- The species is still removed (the warning is informational, not blocking)

### Scenario 2: Half-Elf Paladin with Charisma Bonus

**Setup:**
1. Navigate to the Species page
2. Select **Half-Elf**
3. The Half-Elf automatically gets **+2 Charisma** (plus +1 to two other abilities)
4. Navigate to the Class page
5. Select **Paladin**
6. Navigate to the Abilities page
7. Assign ability scores ensuring Charisma benefits from the Half-Elf +2 bonus
   - Example: Assign 13 to Charisma (base) + 2 (Half-Elf) = 15 total (modifier +2)
   - This gives you 2 + 1 = 3 prepared spells
8. Navigate to the Spells page
9. Select **3 prepared spells** from the Paladin spell list (level 1 spells only for level 3 character)

**Test:**
1. Navigate back to the Species page
2. Click the **✕** button to remove Half-Elf

**Expected Result:**
- A yellow/orange warning banner appears at the top of the page
- The warning states:
  - "Removing this species will reduce your **Charisma** bonus"
  - "You currently have **3 prepared spells** but would only be able to prepare **1**"
  - "Please visit the Spells page to remove **2 spells** before changing your species"
- The species is still removed

### Scenario 3: No Conflict - Spells Within New Limit

**Setup:**
1. Follow Scenario 1 setup
2. But only select **3 prepared spells** instead of 5

**Test:**
1. Navigate back to the Species page
2. Click the **✕** button to remove Half-Elf

**Expected Result:**
- **No warning banner appears** (because 3 spells is still within the new limit of 4)
- Species is removed normally

### Scenario 4: Non-Spellcaster Class

**Setup:**
1. Select **Half-Elf** on the Species page
2. Select **Fighter** on the Class page

**Test:**
1. Navigate back to the Species page
2. Click the **✕** button to remove Half-Elf

**Expected Result:**
- **No warning banner appears** (Fighter doesn't have ability-based spell limits)
- Species is removed normally

### Scenario 5: Druid with Wisdom Bonus

**Setup:**
1. Navigate to the Species page
2. Select **Half-Elf**
3. For "Ability Score Increase", choose **Wisdom** as one of your two +1 bonuses
4. Navigate to the Class page
5. Select **Druid**
6. Navigate to the Abilities page
7. Assign ability scores with Wisdom getting the Half-Elf bonus
   - Example: Assign 14 to Wisdom (base) + 1 (Half-Elf) = 15 total (modifier +2)
   - Druids prepare WIS modifier + 3 = 5 spells
8. Navigate to the Spells page
9. Select **5 prepared spells** from the Druid spell list

**Test:**
1. Navigate back to the Species page
2. Click the **✕** button to remove Half-Elf

**Expected Result:**
- A yellow/orange warning banner appears
- The warning states the spell limit will be reduced from 5 to 4
- User is prompted to remove 1 spell

## Key Implementation Details

### Ability Score Calculation
The validation function:
1. Scans all species features for ability score modifications
2. Handles both fixed bonuses (like Half-Elf's +2 CHA) and user-choice bonuses (like Half-Elf's +1 to two abilities)
3. Uses provenance data to determine which abilities the user actually chose
4. Calculates what the ability scores would be WITHOUT these bonuses

### Spell Counting
- Excludes "always prepared" spells (Domain spells for Clerics, Oath spells for Paladins)
- Only counts chooseable prepared spells against the limit
- Uses the same logic as the existing spell conflict detection system

### User Experience
- Warning is **informational**, not blocking - species can still be removed
- Warning banner has a dismiss button
- Clear call-to-action directing user to the Spells page
- Consistent styling with the existing spell warning on the Abilities page

## Code Files Modified

1. **src/routes/(creation)/species/+page.svelte**
   - Added import for `getSpellAccessForCharacter`
   - Added state variables for warning banner
   - Added `getModifier()` helper function
   - Added `validateSpellLimitBeforeRemoval()` function
   - Added `dismissSpellLimitWarning()` function
   - Modified `removeSelectedSpecies()` to call validation
   - Added warning banner HTML template
   - Added warning banner CSS styles

## Edge Cases Handled

1. **No spells selected**: No warning shown
2. **Class without ability-based limits**: No warning shown (e.g., Bard, Wizard, Sorcerer, Warlock)
3. **Species with no ability bonuses**: No warning shown
4. **Multiple ability bonuses**: Correctly identifies which abilities were chosen and calculates the impact
5. **Always-prepared spells**: Excluded from the count (Domain/Oath spells don't count against prepared spell limit)

## Related Features

This implementation mirrors the existing spell limit validation on the **Abilities page**, which shows a similar warning when:
- A Cleric's Wisdom score is decreased
- A Paladin's Charisma score is decreased

Both warnings help users understand when their spell selections need to be adjusted due to character changes.
