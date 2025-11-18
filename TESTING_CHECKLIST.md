# Testing Checklist

## Weapon Selection Fixes

### Test 1: Barbarian Martial Weapons
**Expected**: Barbarian should ONLY get martial **melee** weapons, not ranged

1. Create new character
2. Select **Barbarian** class
3. Go to Equipment tab
4. Select "Other martial weapon" option
5. Check dropdown list

✅ **Pass**: Only martial melee weapons (battleaxe, longsword, etc.)
❌ **Fail**: If you see blowgun, longbow, or heavy crossbow

---

### Test 2: Fighter Shield + Martial Weapon
**Expected**: Fighter with shield should have access to one-handed ranged weapons

1. Create new character
2. Select **Fighter** class
3. Go to Equipment tab
4. Select "Martial weapon and shield" option
5. Check dropdown list

✅ **Pass**: Includes hand crossbow, blowgun, and net
❌ **Fail**: If these ranged weapons are missing

---

### Test 3: Fighter Two Martial Weapons
**Expected**: Fighter can select ANY martial weapons (melee or ranged)

1. Create new character
2. Select **Fighter** class
3. Go to Equipment tab
4. Select "Two martial weapons" option
5. Check both dropdown lists

✅ **Pass**: Both dropdowns include melee AND ranged martial weapons
❌ **Fail**: If ranged weapons are missing

---

## Attack & Equipment Fixes

### Test 4: Fixed Equipment Added to Attacks
**Expected**: Barbarian's "Four javelins" should appear in attacks array

1. Create new character
2. Select **Barbarian** class
3. Go to Equipment tab (equipment auto-applied)
4. Go to Export page
5. Check Attacks & Spellcasting section

✅ **Pass**: Javelin appears in attacks list with attack bonus and damage
❌ **Fail**: If javelin is missing from attacks

---

### Test 5: Fixed Equipment Cleanup
**Expected**: Fixed equipment should disappear when class is changed

1. Create new character
2. Select **Barbarian** class (gets "Four javelins")
3. Go to Equipment tab - confirm javelins appear
4. Go back to Class tab
5. Deselect Barbarian (or select different class)
6. Go to Equipment tab again

✅ **Pass**: Javelins no longer appear
❌ **Fail**: If javelins stick around

---

### Test 6: Proficiency Bonus in Attacks
**Expected**: Attack bonuses should include +2 proficiency bonus

1. Create new character
2. Set Strength to 16 (+3 modifier)
3. Select **Barbarian** class
4. Go to Export page
5. Check javelin attack bonus

✅ **Pass**: Shows +5 (STR +3 + Prof +2)
❌ **Fail**: If it shows only +3

---

### Test 7: Blowgun Flat Damage
**Expected**: Blowgun should show "3" not "1+2"

1. Create new character
2. Set Dexterity to 14 (+2 modifier)
3. Select **Fighter** class
4. Go to Equipment tab
5. Select "Martial weapon and shield" → Blowgun
6. Go to Export page
7. Check blowgun damage

✅ **Pass**: Shows "3 piercing"
❌ **Fail**: If it shows "1+2 piercing"

---

## Feature Descriptions (NEW!)

### Test 8: Barbarian Feature Descriptions
**Expected**: Features should show full descriptions, not just names

1. Create new character
2. Select **Barbarian** class
3. Complete character creation (choose Primal Path)
4. Go to Export page
5. Look at Features & Traits section

✅ **Pass**: Shows feature names AND full descriptions
- "RAGE\nIn battle, you fight with primal ferocity..."
- "UNARMORED DEFENSE\nWhile you are not wearing..."

❌ **Fail**: If it only shows "• Rage" or "• Unarmored Defense"

---

### Test 9: Missing Feature Graceful Handling
**Expected**: Features without data should still show (just name)

1. Create new character
2. Select **Fighter** class (features not yet in database)
3. Go to Export page
4. Look at Features & Traits section

✅ **Pass**: Shows "• Second Wind" (just the name, since no data exists yet)
❌ **Fail**: If it crashes or shows nothing

---

## Integration Tests

### Test 10: Complete Barbarian Flow
**Expected**: Full character creation and export works end-to-end

1. Create character named "Grok"
2. Select **Barbarian** class
3. Set abilities: STR 16, DEX 14, CON 16
4. Choose **Berserker** primal path
5. Go to Equipment tab
   - Verify "Four javelins" present
   - Select "Other martial weapon" → Greataxe
   - Verify only melee weapons in dropdown
6. Go to Export page
7. Check PDF preview:
   - ✅ Name: Grok
   - ✅ Class: Barbarian (Berserker)
   - ✅ Attacks: Javelin (+5, 1d6+3 piercing), Greataxe (+5, 1d12+3 slashing)
   - ✅ Features: RAGE with full description, FRENZY with full description
   - ✅ Proficiency bonus: +2

---

## Quick Smoke Test

Run this 2-minute test to verify everything works:

1. **Create Barbarian**
   - Equipment dropdown: no ranged weapons ✅
   - Export: Javelin in attacks ✅
   - Export: Rage shows full description ✅

2. **Create Fighter**
   - "Shield + martial weapon": includes hand crossbow ✅
   - "Two martial weapons": includes all martial weapons ✅
   - Blowgun damage: shows "3 piercing" ✅

3. **Change Class Test**
   - Create Barbarian (has javelins)
   - Switch to Fighter
   - Javelins disappear ✅

---

## Reporting Issues

If any tests fail, report with:
- Test number (e.g., "Test 5 failed")
- What you expected
- What actually happened
- Any console errors

---

**All tests passing?** 🎉 Ready to add more features using `FEATURES_DATA_GUIDE.md`!
