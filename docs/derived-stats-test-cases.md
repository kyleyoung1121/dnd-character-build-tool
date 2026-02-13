# Derived Stats Calculation - Test Cases

## Test Strategy
This document outlines test cases to verify HP, Speed, and AC calculations work correctly for various character combinations at level 3.

---

## Test Cases

### Test 1: Barbarian with Unarmored Defense
**Character:**
- Class: Barbarian
- Race: Human
- CON: 16 (+3)
- DEX: 14 (+2)
- Features: Unarmored Defense, Rage
- Equipment: No armor, No shield

**Expected Results:**
- **HP**: 10 (d12 max) + 7 (avg) + 7 (avg) + 9 (CON×3) = **33 HP**
- **Speed**: 30 ft (base Human)
- **AC**: 10 + 2 (DEX) + 3 (CON) = **15 AC** (Unarmored Defense)

---

### Test 2: Hill Dwarf Barbarian
**Character:**
- Class: Barbarian
- Race: Hill Dwarf
- CON: 18 (+4) [16 base + 2 racial]
- DEX: 12 (+1)
- Features: Unarmored Defense, Dwarven Toughness, Rage
- Equipment: No armor, No shield

**Expected Results:**
- **HP**: 10 (d12 max) + 7 (avg) + 7 (avg) + 12 (CON×3) + 3 (Dwarven Toughness) = **39 HP**
- **Speed**: 25 ft (dwarf base)
- **AC**: 10 + 1 (DEX) + 4 (CON) = **15 AC** (Unarmored Defense)

---

### Test 3: Monk with Unarmored Defense (No Armor/Shield)
**Character:**
- Class: Monk
- Race: Wood Elf
- DEX: 16 (+3)
- WIS: 14 (+2)
- Features: Unarmored Defense, Unarmored Movement, Martial Arts
- Equipment: No armor, No shield

**Expected Results:**
- **HP**: 8 (d8 max) + 5 (avg) + 5 (avg) = **18 HP** (assuming CON 10)
- **Speed**: 35 (Wood Elf) + 10 (Unarmored Movement) = **45 ft**
- **AC**: 10 + 3 (DEX) + 2 (WIS) = **15 AC** (Unarmored Defense)

---

### Test 4: Monk with Shield (Should NOT get speed bonus or use Unarmored Defense)
**Character:**
- Class: Monk
- Race: Human
- DEX: 16 (+3)
- WIS: 14 (+2)
- Features: Unarmored Defense, Unarmored Movement, Martial Arts
- Equipment: No armor, Shield

**Expected Results:**
- **HP**: 8 (d8 max) + 5 (avg) + 5 (avg) = **18 HP** (assuming CON 10)
- **Speed**: 30 ft (no bonus because shield)
- **AC**: 10 + 3 (DEX) = **13 AC** (shield disallows Monk Unarmored Defense, but doesn't count as armor)

---

### Test 5: Fighter with Chain Mail and Shield
**Character:**
- Class: Fighter
- Race: Human
- DEX: 12 (+1)
- STR: 16 (+3)
- CON: 14 (+2)
- Features: Second Wind, Action Surge
- Equipment: Chain Mail (AC 16), Shield

**Expected Results:**
- **HP**: 10 (d10 max) + 6 (avg) + 6 (avg) + 6 (CON×3) = **28 HP**
- **Speed**: 30 ft (base)
- **AC**: 16 (chain mail) + 2 (shield) = **18 AC**

---

### Test 6: Fighter with Defense Fighting Style
**Character:**
- Class: Fighter
- Race: Human
- DEX: 14 (+2)
- CON: 14 (+2)
- Features: Second Wind, Action Surge, Defense Fighting Style
- Equipment: Half Plate (AC 15), Shield

**Expected Results:**
- **HP**: 10 (d10 max) + 6 (avg) + 6 (avg) + 6 (CON×3) = **28 HP**
- **Speed**: 30 ft
- **AC**: 15 (half plate) + 2 (shield) + 1 (Defense) = **18 AC**

---

### Test 7: Draconic Bloodline Sorcerer (No Armor)
**Character:**
- Class: Sorcerer
- Subclass: Draconic Bloodline
- Race: Human
- DEX: 14 (+2)
- CON: 12 (+1)
- Features: Draconic Resilience, Spellcasting
- Equipment: No armor, No shield

**Expected Results:**
- **HP**: 6 (d6 max) + 4 (avg) + 4 (avg) + 3 (CON×3) + 3 (Draconic Resilience +1/level) = **20 HP**
  - Note: Draconic Resilience also affects HP! Need to check if this is implemented
- **Speed**: 30 ft
- **AC**: 13 + 2 (DEX) = **15 AC** (Draconic Resilience natural armor)

---

### Test 8: Warlock with Armor of Shadows Invocation
**Character:**
- Class: Warlock
- Race: Tiefling
- DEX: 16 (+3)
- CON: 12 (+1)
- Features: Pact Magic, Armor of Shadows (invocation)
- Equipment: No armor, No shield

**Expected Results:**
- **HP**: 8 (d8 max) + 5 (avg) + 5 (avg) + 3 (CON×3) = **21 HP**
- **Speed**: 30 ft
- **AC**: 13 + 3 (DEX) = **16 AC** (Armor of Shadows = permanent Mage Armor)

---

### Test 9: Barbarian with Armor (Unarmored Defense disabled)
**Character:**
- Class: Barbarian
- Race: Human
- DEX: 14 (+2)
- CON: 16 (+3)
- Features: Unarmored Defense, Rage
- Equipment: Hide Armor (AC 12), Shield

**Expected Results:**
- **HP**: 10 (d12 max) + 7 (avg) + 7 (avg) + 9 (CON×3) = **33 HP**
- **Speed**: 30 ft
- **AC**: 12 (hide) + 2 (DEX, max +2 for medium armor) + 2 (shield) = **16 AC**
  - Unarmored Defense does NOT apply because wearing armor
  - Shield bonus still applies

---

### Test 10: Wizard (Lowest HP)
**Character:**
- Class: Wizard
- Race: High Elf
- DEX: 14 (+2)
- CON: 10 (+0)
- INT: 16 (+3)
- Features: Spellcasting, Arcane Recovery
- Equipment: No armor, No shield

**Expected Results:**
- **HP**: 6 (d6 max) + 4 (avg) + 4 (avg) + 0 (CON×3) = **14 HP**
- **Speed**: 30 ft
- **AC**: 10 + 2 (DEX) = **12 AC** (no armor, no special features)

---

## Implementation Verification Checklist

### HP Calculation ✅
- [x] Uses correct hit die for each class
- [x] Level 1: max die value
- [x] Level 2-3: average die value (rounded up)
- [x] Adds CON modifier × 3
- [x] Hill Dwarf Dwarven Toughness: +3 HP at level 3
- [ ] ⚠️ Draconic Sorcerer Resilience: +3 HP at level 3 (NOT YET IMPLEMENTED)

### Speed Calculation ✅
- [x] Parses base speed from race (25 ft, 30 ft, or 35 ft)
- [x] Monk Unarmored Movement: +10 ft at level 3
- [x] Checks both armor AND shield for Monk speed bonus
- [x] No speed bonus if wearing armor
- [x] No speed bonus if using shield

### AC Calculation ✅
- [x] Base unarmored: 10 + DEX
- [x] Barbarian Unarmored Defense: 10 + DEX + CON (shields OK)
- [x] Monk Unarmored Defense: 10 + DEX + WIS (NO shields)
- [x] Draconic Sorcerer: 13 + DEX (shields OK)
- [x] Warlock Armor of Shadows: 13 + DEX (shields OK)
- [x] Uses character.ac from store when wearing armor
- [x] Shield bonus: +2 AC (when allowed)
- [x] Monk with shield: no Unarmored Defense, no shield bonus to Unarmored Defense
- [x] Defense Fighting Style: +1 AC when wearing armor

---

## Testing Instructions

To manually test these calculations:

1. **Create each test character** in the character builder
2. **Navigate to Export page** to generate PDF
3. **Check the PDF preview** or exported PDF for HP, Speed, AC values
4. **Compare against expected results** in this document

### Testing Tools
- Character builder: http://localhost:5173/
- Export page: http://localhost:5173/export

### Common Issues to Watch For
- **Shield not detected**: Check inventory item names include "shield"
- **Armor not detected**: Check armor keywords in `isWearingArmor()`
- **Feature names don't match**: Check exact feature string in character.features array
- **CON/DEX/WIS modifiers wrong**: Verify ability scores are set correctly

---

## Known Limitations

### Not Yet Implemented
1. **Tough Feat**: +2 HP per level (+6 at level 3)
   - Need to check if feat system is implemented
2. **Draconic Sorcerer HP Bonus**: Draconic Resilience gives +1 HP per level
   - Currently only implements the AC bonus
3. **Dual Wielder Feat**: +1 AC when dual wielding
   - Low priority, feat system may not be implemented

### Design Decisions
1. **Mage Armor spell**: NOT auto-calculated (requires spell slot)
2. **Armor of Shadows invocation**: IS auto-calculated (at-will ability)
3. **Shield with Monk**: Shield prevents both Unarmored Defense AND speed bonus
4. **Equipment detection**: Uses string matching on inventory items

---

## Future Enhancements

### Potential Improvements
1. **Hit dice display**: Calculate based on class (e.g., "3d12" for Barbarian)
2. **HP minimum**: Currently 3 HP minimum (1 per level)
3. **Armor detection**: More robust parsing of armor items
4. **Draconic Resilience HP**: Add +3 HP for Draconic Sorcerers
5. **Feat support**: Add Tough feat (+6 HP) if feat system exists

### Edge Cases to Consider
- Character with no class selected
- Character with no CON score (should default to 10)
- Character with negative CON modifier
- Multiple Unarmored Defense sources (shouldn't happen, but...)
- Equipment items with non-standard names

---

## Test Results Log

### Manual Test Results
_To be filled in during testing_

| Test # | Character | HP Expected | HP Actual | Speed Expected | Speed Actual | AC Expected | AC Actual | Pass? |
|--------|-----------|-------------|-----------|----------------|--------------|-------------|-----------|-------|
| 1 | Barbarian | 33 | - | 30 ft | - | 15 | - | - |
| 2 | Hill Dwarf Barb | 39 | - | 25 ft | - | 15 | - | - |
| 3 | Monk (no armor) | 18 | - | 45 ft | - | 15 | - | - |
| 4 | Monk (shield) | 18 | - | 30 ft | - | 13 | - | - |
| 5 | Fighter (armor) | 28 | - | 30 ft | - | 18 | - | - |
| 6 | Fighter (Defense) | 28 | - | 30 ft | - | 18 | - | - |
| 7 | Draconic Sorc | 20 | - | 30 ft | - | 15 | - | - |
| 8 | Warlock | 21 | - | 30 ft | - | 16 | - | - |
| 9 | Barbarian (armor) | 33 | - | 30 ft | - | 16 | - | - |
| 10 | Wizard | 14 | - | 30 ft | - | 12 | - | - |

---

## Automated Testing (Future)

### Unit Test Structure
```typescript
describe('calculateHitPoints', () => {
  test('Barbarian level 3 with 16 CON', () => {
    const character = { class: 'Barbarian', constitution: 16, features: [] };
    expect(calculateHitPoints(character, 3)).toBe(33);
  });
  
  test('Hill Dwarf with Dwarven Toughness', () => {
    const character = { 
      class: 'Barbarian', 
      constitution: 18, 
      features: ['Dwarven Toughness', 'Unarmored Defense'] 
    };
    expect(calculateHitPoints(character, 4)).toBe(39);
  });
});
```

### Integration Test Ideas
1. Create character through UI → Export PDF → Parse PDF → Verify values
2. Use Playwright/Cypress to automate character creation
3. Compare PDF field values against expected calculations
