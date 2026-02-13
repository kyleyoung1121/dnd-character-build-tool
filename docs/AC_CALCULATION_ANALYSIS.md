# AC Calculation Analysis

## Summary
The AC calculation system in `src/lib/pdf/character-data-mapper.ts` is **correctly implemented** with support for Defense Fighting Style and other AC modifiers.

## Current Implementation Status

### ✅ Implemented Features

#### Base AC Calculations (mutually exclusive - highest is used):
1. **Unarmored**: 10 + DEX modifier
2. **Armor-based**: 
   - Light armor: base + full DEX (e.g., Leather 11 + DEX)
   - Medium armor: base + min(DEX, 2) (e.g., Scale Mail 14 + min(DEX, 2))
   - Heavy armor: base only (e.g., Chain Mail 16)
3. **Barbarian Unarmored Defense**: 10 + DEX + CON (shields allowed)
4. **Monk Unarmored Defense**: 10 + DEX + WIS (no shields allowed)
5. **Draconic Sorcerer (Draconic Resilience)**: 13 + DEX (shields allowed)
6. **Warlock (Armor of Shadows invocation)**: 13 + DEX (shields allowed)

#### AC Bonuses (stackable):
1. **Shield**: +2 AC (not compatible with Monk Unarmored Defense)
2. **Defense Fighting Style** (Fighter/Paladin/Ranger): **+1 AC when wearing armor**

### Defense Fighting Style - Implementation Details

**Location**: `src/lib/pdf/character-data-mapper.ts` lines 443-446

```typescript
// Defense Fighting Style: +1 AC when wearing armor
if (wearingArmor && character.features?.includes('Defense Fighting Style')) {
    bestAC += 1;
}
```

**Feature Name Check**: The code checks for `'Defense Fighting Style'` in the character's features array.

**How It Gets Added**:
- **Fighter** (`src/lib/data/classes/fighter.ts` lines 162-163):
  ```typescript
  effects: [
      {
          target: 'features',
          action: 'add',
          value: '{userChoice} Fighting Style'  // "Defense" → "Defense Fighting Style"
      }
  ]
  ```

- **Paladin** (`src/lib/data/classes/paladin.ts` lines 172-175):
  ```typescript
  effects: [
      {
          target: 'features',
          action: 'add',
          value: '{userChoice} Fighting Style'  // "Defense" → "Defense Fighting Style"
      }
  ]
  ```

- **Ranger** (`src/lib/data/classes/ranger.ts` lines 886-891):
  ```typescript
  effects: [
      {
          target: 'features',
          action: 'add',
          value: '{userChoice} Fighting Style'  // "Defense" → "Defense Fighting Style"
      }
  ]
  ```

**When User Selects**: When a player selects "Defense" from the Fighting Style dropdown:
1. `{userChoice}` is replaced with "Defense"
2. The template adds " Fighting Style"
3. Final feature added: **"Defense Fighting Style"**
4. This matches the exact string checked in the AC calculation

### Conditions for Defense Fighting Style Bonus

The +1 AC bonus is applied when **BOTH** conditions are met:
1. `wearingArmor === true` - Character must be wearing armor
2. `character.features?.includes('Defense Fighting Style')` - Character must have the feature

### Test Cases

#### Example 1: Fighter with Defense Fighting Style
- **Class**: Fighter
- **Fighting Style**: Defense
- **Armor**: Half Plate (base AC 15)
- **Shield**: Yes (+2)
- **DEX**: 14 (+2 modifier)
- **Expected AC**: 15 (armor base, DEX capped at +2 for medium armor) + 2 (shield) + 1 (Defense) = **18 AC**

#### Example 2: Paladin with Defense Fighting Style
- **Class**: Paladin
- **Fighting Style**: Defense
- **Armor**: Chain Mail (base AC 16, heavy armor)
- **Shield**: Yes (+2)
- **DEX**: 10 (+0 modifier)
- **Expected AC**: 16 (armor base, no DEX for heavy armor) + 2 (shield) + 1 (Defense) = **19 AC**

#### Example 3: Fighter with Defense Fighting Style BUT No Armor
- **Class**: Fighter
- **Fighting Style**: Defense
- **Armor**: None
- **Shield**: No
- **DEX**: 16 (+3 modifier)
- **Expected AC**: 10 + 3 (unarmored) = **13 AC** (Defense does NOT apply without armor)

#### Example 4: Ranger with Defense Fighting Style
- **Class**: Ranger
- **Fighting Style**: Defense
- **Armor**: Studded Leather (base AC 12)
- **Shield**: No
- **DEX**: 16 (+3 modifier)
- **Expected AC**: 12 + 3 (light armor, full DEX) + 1 (Defense) = **16 AC**

## Exceptions and Edge Cases

### Currently Handled:
- ✅ Monk Unarmored Defense prevents shield bonus
- ✅ Defense Fighting Style only applies when wearing armor
- ✅ Multiple AC formulas are evaluated and highest is chosen
- ✅ Medium armor caps DEX bonus at +2
- ✅ Heavy armor gets no DEX bonus

### Not Implemented (By Design - Temporary/Resource-Based):
These are **intentionally excluded** because they require spell slots, reactions, or temporary activation:
- ❌ Shield spell (+5 AC, reaction, 1 round)
- ❌ Shield of Faith spell (+2 AC, concentration, 10 minutes)
- ❌ Haste spell (+2 AC, concentration, 1 minute)
- ❌ Warding Bond spell (+1 AC, concentration)
- ❌ Bladesong (Wizard, bonus action activation)

### No Other AC Bonuses Exist at Level 3:
- Species/Backgrounds: No AC bonuses in standard D&D 5e PHB
- Other class features: No permanent AC bonuses available at level 3

## Conclusion

**Defense Fighting Style is correctly implemented.** The feature name matches exactly between:
1. What gets added to `character.features` when selected ("Defense Fighting Style")
2. What the AC calculation checks for (`'Defense Fighting Style'`)

The logic correctly applies +1 AC bonus only when wearing armor, which matches D&D 5e rules.

## Related Files
- **AC Calculation**: `src/lib/pdf/character-data-mapper.ts` (lines 375-449)
- **Fighter Fighting Styles**: `src/lib/data/classes/fighter.ts` (lines 20-165)
- **Paladin Fighting Styles**: `src/lib/data/classes/paladin.ts` (lines 87-177)
- **Ranger Fighting Styles**: `src/lib/data/classes/ranger.ts` (lines 803-893)
