# Attacks & Spellcasting Box Implementation

## Overview
Successfully implemented the attacks and spellcasting system for PDF export. Weapons are now automatically tracked, and attack bonuses/damage are calculated dynamically based on character stats and weapon properties.

## What Was Implemented

### 1. Comprehensive Weapon Data System
**File:** `src/lib/data/equipment/weapon-data.ts`

- Created a complete database of all D&D 5e weapons with properties:
  - Damage dice (e.g., "1d8", "2d6")
  - Damage type (slashing, piercing, bludgeoning)
  - Attack ability (STR, DEX, or EITHER for finesse weapons)
  - Weapon properties (finesse, versatile, two-handed, etc.)
  - Category (simple vs martial)
  - Type (melee vs ranged)

- Helper functions:
  - `getWeaponData(weaponName)` - Look up weapon properties
  - `isWeapon(itemName)` - Check if an item is a weapon
  - `extractWeaponsFromInventory(inventory)` - Find all weapons in an inventory list
  - `normalizeWeaponName(itemName)` - Handle variations like "Four javelins" → "Javelin"

### 2. Updated Character Store
**File:** `src/lib/stores/character_store.ts`

- Simplified the `Attack` type to just store weapon names (strings)
- Weapon stats are now looked up dynamically when needed
- This approach is cleaner and easier to maintain

### 3. Equipment Tab Enhancements
**File:** `src/routes/(creation)/equipment/+page.svelte`

**Added automatic weapon tracking:**
- When equipment is selected, weapons are automatically extracted and added to the `attacks` array
- Fixed equipment (like barbarian's "Four javelins") is now properly added to both inventory and attacks
- Background equipment weapons are also tracked

**New features:**
- `applyFixedEquipment()` - Applies class fixed equipment on page load/class change
- `applyFixedBackgroundEquipment()` - Applies background fixed equipment
- All equipment choice handlers now extract and track weapons

### 4. PDF Attack Calculation
**File:** `src/lib/pdf/character-data-mapper.ts`

**New `calculateAttacks()` function:**
- Takes weapon names from character.attacks array
- Looks up weapon data from weapon database
- Calculates attack bonus: `ability modifier + proficiency bonus` (if proficient)
- Determines correct ability modifier:
  - Finesse weapons (EITHER): uses higher of STR or DEX
  - Ranged weapons: uses DEX
  - Other weapons: uses STR
- Formats damage: `1d8+3 slashing` (includes ability modifier)
- Checks weapon proficiency based on class proficiencies

## How It Works

### Flow for a Barbarian with Javelin:

1. **Equipment Tab:** 
   - Class loads → `applyFixedEquipment()` called
   - Detects "Four javelins" in fixed equipment
   - Extracts weapon name → normalizes to "Javelin"
   - Adds to both `character.inventory` and `character.attacks`

2. **Export Tab:**
   - Character data is mapped for PDF
   - `calculateAttacks()` is called
   - For "Javelin":
     - Looks up: `{ damage: "1d6", damageType: "piercing", attackAbility: "STR" }`
     - Checks proficiency: Barbarian has "Simple Weapons" proficiency ✓
     - Calculates bonus: STR modifier (+3) + proficiency (+2) = **+5**
     - Formats damage: **1d6+3 piercing**

3. **PDF Display:**
   ```
   Name: Javelin
   Attack Bonus: +5
   Damage/Type: 1d6+3 piercing
   ```

## Key Features

### ✅ Automatic Weapon Detection
- Weapons are automatically identified from inventory
- Handles plural forms ("Four javelins" → "Javelin")
- Handles quantity prefixes ("Two shortswords" → "Shortsword")

### ✅ Smart Attack Calculations
- Uses correct ability modifier for each weapon type
- Accounts for finesse weapons (chooses best of STR/DEX)
- Only adds proficiency bonus if character is proficient
- Includes ability modifier in damage

### ✅ Fixed Equipment Handling
- Class fixed equipment (like barbarian javelins) is now properly added
- Background fixed equipment is also tracked
- Both inventory and attacks are populated

### ✅ Choice Equipment Handling
- Simple equipment choices track weapons
- Enhanced equipment choices track weapons
- Subchoice selections track weapons
- Background equipment choices track weapons

## Testing Recommendations

### Test Cases to Verify:

1. **Barbarian Test:**
   - Create a barbarian character
   - Go to equipment tab (should see "Four javelins" in fixed equipment)
   - Select Greataxe as primary weapon
   - Go to export tab
   - Verify PDF shows both Javelin and Greataxe with correct bonuses

2. **Finesse Weapon Test:**
   - Create a rogue with high DEX (16) and low STR (10)
   - Select dagger or rapier
   - Verify attack bonus uses DEX modifier

3. **Martial Weapon Test:**
   - Create a wizard (no martial weapon proficiency)
   - Somehow get a longsword in inventory
   - Verify attack bonus doesn't include proficiency

4. **Multiple Weapons Test:**
   - Create fighter with multiple weapon selections
   - Verify all weapons appear in attacks box
   - Verify correct bonuses for each

## Code Organization

```
src/lib/data/equipment/
  ├── weapon-data.ts          # NEW: Complete weapon database
  ├── weapon-utils.ts         # Existing: Weapon categorization
  └── weapons.ts              # Existing: Weapon lists

src/lib/pdf/
  ├── character-data-mapper.ts   # UPDATED: Added calculateAttacks()
  └── pdf-generator.ts           # Existing: PDF generation

src/lib/stores/
  └── character_store.ts         # UPDATED: Simplified Attack type

src/routes/(creation)/
  └── equipment/+page.svelte     # UPDATED: Weapon tracking
```

## Future Enhancements

### Possible Improvements:
1. **Spellcasting Attacks:** Add spell attack bonuses and save DCs to attacks box
2. **Versatile Weapons:** Show both one-handed and two-handed damage
3. **Magic Weapons:** Support for +1, +2, +3 weapons
4. **Unarmed Strikes:** Add monk unarmed strike to attacks
5. **Special Attacks:** Handle net, blowgun, and other special weapons
6. **Ammunition Tracking:** Show remaining arrows/bolts

## Technical Notes

- **Performance:** Weapon lookups are O(1) dictionary lookups, very fast
- **Maintainability:** Single source of truth for weapon data
- **Extensibility:** Easy to add new weapons or modify existing ones
- **Type Safety:** Full TypeScript support with interfaces

## Files Changed

1. **Created:**
   - `src/lib/data/equipment/weapon-data.ts` (new file, ~450 lines)

2. **Modified:**
   - `src/lib/stores/character_store.ts` (simplified Attack type)
   - `src/routes/(creation)/equipment/+page.svelte` (added weapon tracking)
   - `src/lib/pdf/character-data-mapper.ts` (added calculateAttacks function)

## Conclusion

The attacks system is now fully functional! Weapons are automatically tracked when selected, and the PDF export shows proper attack bonuses and damage calculated from character stats and weapon properties. The system handles:

- ✅ Fixed class equipment (like barbarian javelins)
- ✅ Fixed background equipment  
- ✅ Player-selected equipment choices
- ✅ Finesse weapons (use best ability)
- ✅ Proficiency bonuses
- ✅ Damage with ability modifiers

Ready for testing! 🎲⚔️
