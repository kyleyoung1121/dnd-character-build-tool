# Quick Start: Testing Guide

## 2-Minute Test 🚀

### Test 1: Barbarian Feature Formatting (NEW!)
1. Go to http://localhost:5173
2. Start new character
3. Select **Barbarian** class
4. Choose **Berserker** subclass
5. Navigate to **Export** tab
6. Scroll to "Features & Traits" section

**✅ Expected Result:**
```
Rage. In battle, you fight with primal ferocity. On your turn, 
you can enter a rage as a bonus action.

While raging, you gain the following benefits if you aren't 
wearing heavy armor:
• You have advantage on Strength checks and Strength saving throws.
• When you make a melee weapon attack using Strength, you gain a 
  +2 bonus to the damage roll.
• You have resistance to bludgeoning, piercing, and slashing damage.

[blank line]

Unarmored Defense. While you are not wearing any armor, your Armor 
Class equals 10 + your Dexterity modifier + your Constitution 
modifier. You can use a shield and still gain this benefit.

[blank line]

Reckless Attack. Starting at 2nd level, you can throw aside all...
```

**✅ Check:**
- [ ] "Rage" is in **bold**
- [ ] Period after "Rage"
- [ ] Description starts on same line as "Rage."
- [ ] Blank line between Rage and Unarmored Defense
- [ ] All features formatted the same way

---

### Test 2: Barbarian Weapon Restrictions
1. Same character (Barbarian)
2. Go to **Equipment** tab
3. Find "Primary Weapon" choice
4. Select "Other martial weapon"
5. Open the dropdown

**✅ Expected Result:**
- Dropdown shows: Battleaxe, Flail, Longsword, Rapier, etc.
- Dropdown does NOT show: Blowgun, Longbow, Heavy crossbow, Hand crossbow

**✅ Check:**
- [ ] Only melee weapons visible
- [ ] No ranged weapons (bow, crossbow) in list

---

### Test 3: Fighter Ranged Weapons with Shield
1. Start new character
2. Select **Fighter** class
3. Go to **Equipment** tab
4. Find "Primary Weapon Setup"
5. Select "Martial weapon and shield"
6. Open the dropdown

**✅ Expected Result:**
- Dropdown shows melee weapons: Longsword, Rapier, Warhammer, etc.
- Dropdown ALSO shows: **Hand crossbow**, **Blowgun**, **Net**

**✅ Check:**
- [ ] Hand crossbow is in the list
- [ ] Blowgun is in the list
- [ ] Net is in the list
- [ ] Shield automatically included

---

### Test 4: Attack Bonuses
1. New Barbarian character
2. Set **Strength** to 16 (+3 modifier)
3. Go to Equipment tab (auto-equipped with javelins)
4. Go to Export tab
5. Look at "Attacks & Spellcasting" section

**✅ Expected Result:**
- Javelin attack bonus: **+5**
  - (STR +3 + Proficiency +2 = +5)
- Javelin damage: **1d6+3 piercing**

**✅ Check:**
- [ ] Attack bonus is +5 (not +3)
- [ ] Damage includes +3 modifier

---

### Test 5: Fixed Equipment Cleanup
1. Create **Barbarian** (gets "Four javelins" automatically)
2. Go to Equipment tab - confirm javelins present
3. Go back to **Class** tab
4. Deselect Barbarian
5. Go to Equipment tab again

**✅ Expected Result:**
- Javelins are GONE
- Equipment cleared when class removed

**✅ Check:**
- [ ] Javelins disappear after class deselection
- [ ] No stuck equipment

---

## 30-Second Smoke Test

**Just want to verify it works? Do this:**

1. Create Barbarian
2. Go to Export
3. Check Features & Traits section

**✅ Pass if you see:**
- **Bold** feature names (not ALL CAPS)
- Names and descriptions on same line with period
- Blank lines between features

---

## Found an Issue?

### Report Format:
```
**Test Failed**: Test #2 (Barbarian Weapon Restrictions)
**Expected**: Only melee weapons in dropdown
**Actual**: Saw "Blowgun" in the list
**Steps**: 
1. Created Barbarian
2. Went to Equipment tab
3. Selected "Other martial weapon"
4. Opened dropdown
```

### Common Issues & Solutions:

**Issue**: Feature names still in ALL CAPS
- **Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: No bold formatting
- **Solution**: Check PDF export (not just preview page)

**Issue**: Dropdown not showing weapons
- **Solution**: Make sure class is selected first

---

## What to Test in PDF Export

1. Click "Download PDF" button on Export page
2. Open the downloaded PDF
3. Check Features & Traits section on page 1

**✅ In the PDF, verify:**
- [ ] Feature names are bold
- [ ] Descriptions are regular font
- [ ] Spacing looks good
- [ ] Text doesn't overflow the box

---

## Next: Add More Features

Once testing passes, see **FEATURES_DATA_GUIDE.md** to add:
- Fighter features
- Rogue features  
- Wizard features
- Racial features
- Background features

**Template is ready - just copy-paste descriptions!**

---

## Quick Links

- **User Guide**: FEATURES_DATA_GUIDE.md
- **Full Testing**: TESTING_CHECKLIST.md
- **Implementation Details**: COMPLETE_IMPLEMENTATION_SUMMARY.md
- **Style Changes**: STYLE_UPDATE_SUMMARY.md

---

**Ready? Start with Test #1 above! 🎲**
