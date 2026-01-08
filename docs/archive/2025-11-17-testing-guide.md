# Testing Guide - Attacks & Spellcasting Feature

## Quick Test Steps

### Test 1: Barbarian with Fixed Equipment ✅

**Expected Result:** Fixed equipment weapons (javelins) should appear in attacks

1. Go to http://localhost:5173/
2. Click "Start Building" or go to Species tab
3. Select **Human** (or any species)
4. Go to **Class** tab → Select **Barbarian**
5. Choose a Primal Path (Berserker or Totem Warrior)
6. Select 2 skills
7. Go to **Abilities** tab → Assign ability scores (recommend STR 16, CON 14, DEX 12)
8. Go to **Background** tab → Select any background
9. Go to **Equipment** tab
   - You should see "Four javelins" listed under "Standard Equipment"
   - Select "Greataxe" as primary weapon
   - Make other equipment choices

10. Go to **Export** tab
11. Wait for PDF to generate
12. Look at the "Attacks & Spellcasting" box on the PDF

**Expected to see:**
```
Javelin       +5      1d6+3 piercing
Greataxe      +5      1d12+3 slashing
```

### Test 2: Rogue with Finesse Weapons ✅

**Expected Result:** Finesse weapons should use DEX modifier

1. Create a new character
2. Select **Rogue** class
3. Set abilities: DEX 16 (+3), STR 10 (+0)
4. In equipment, select weapons like:
   - Rapier or Shortsword
   - Daggers
5. Go to Export tab

**Expected attacks:**
```
Rapier        +5      1d8+3 piercing    (uses DEX +3)
Dagger        +5      1d4+3 piercing    (uses DEX +3)
```

### Test 3: Fighter with Multiple Weapons ✅

**Expected Result:** All selected weapons should appear

1. Create **Fighter** character
2. Select multiple weapons through equipment choices
3. Export and verify all weapons appear in attacks box
4. Check attack bonuses are correct for each weapon type

## What to Look For

### ✅ Success Indicators:

1. **Fixed Equipment Appears:** 
   - Barbarian javelins show up automatically
   - No need to manually select them

2. **Correct Attack Bonuses:**
   - Formula: `Ability Modifier + Proficiency Bonus` (if proficient)
   - Level 3 characters have +2 proficiency
   - Example: STR 16 (+3) + Prof (+2) = +5 total

3. **Correct Damage:**
   - Shows weapon damage dice
   - Includes ability modifier
   - Shows damage type
   - Example: `1d8+3 slashing`

4. **Finesse Weapons:**
   - Should use higher of STR or DEX
   - Example: Rapier with DEX 16, STR 10 → uses DEX

5. **Multiple Weapons:**
   - All selected weapons appear
   - Up to 5 weapons shown (PDF limitation)

### ❌ Potential Issues to Report:

1. Weapons not appearing in attacks box
2. Wrong attack bonus calculations
3. Missing ability modifier in damage
4. Fixed equipment not being added
5. Finesse weapons using wrong ability

## Browser Console Checks

Open browser console (F12) and check for errors:

```javascript
// Should not see any errors related to:
- weapon-data.ts
- character-data-mapper.ts
- equipment/+page.svelte
```

## Testing Different Classes

### Classes with Simple Weapons Only:
- **Wizard, Sorcerer:** Only get proficiency with simple weapons
- Test: Give them a longsword → should NOT add proficiency bonus

### Classes with Martial Weapons:
- **Fighter, Barbarian, Paladin, Ranger:** Get martial weapon proficiency
- Test: All weapons should add proficiency bonus

### Classes with Specific Weapon Proficiencies:
- **Rogue:** Simple weapons + hand crossbow, longsword, rapier, shortsword
- **Monk:** Simple weapons + shortswords
- **Druid:** Specific nature-themed weapons

## Advanced Testing

### Test with Real Character Build:

**Level 3 Human Fighter (Strength Build)**
- STR 18 (+4), DEX 12 (+1), CON 16 (+3)
- Equipment: Longsword, Shield, Javelins
- Expected Attacks:
  - Longsword: +6 to hit (STR +4, Prof +2), 1d8+4 slashing
  - Javelin: +6 to hit (STR +4, Prof +2), 1d6+4 piercing

**Level 3 Halfling Rogue (Dexterity Build)**
- STR 10 (+0), DEX 18 (+4), CON 14 (+2)
- Equipment: Rapier, Shortbow, Daggers
- Expected Attacks:
  - Rapier: +6 to hit (DEX +4, Prof +2), 1d8+4 piercing
  - Shortbow: +6 to hit (DEX +4, Prof +2), 1d6+4 piercing
  - Dagger: +6 to hit (DEX +4, Prof +2), 1d4+4 piercing

## Known Limitations

1. **Max 5 Weapons:** PDF template only has space for 5 attacks
2. **No Range/Ammo:** We're ignoring range and ammunition tracking
3. **No Versatile Damage:** Shows one-handed damage only (future enhancement)
4. **No Magic Weapons:** +1/+2/+3 weapons not yet supported
5. **No Spell Attacks:** Spell attack bonuses not yet in this box (future enhancement)

## Debugging Tips

### If weapons don't appear:

1. Check browser console for errors
2. Verify character.attacks array in character store:
   ```javascript
   // In browser console:
   $character_store.attacks
   // Should show array of weapon names like: ["Javelin", "Greataxe"]
   ```

3. Check if fixed equipment is being applied:
   ```javascript
   $character_store._provenance.class_fixed_equipment
   // Should show the fixed equipment data
   ```

### If attack bonuses are wrong:

1. Verify ability scores are set correctly
2. Check class proficiencies in character store
3. Verify weapon data for the weapon in question

### If damage is wrong:

1. Check weapon database in `src/lib/data/equipment/weapon-data.ts`
2. Verify ability modifier is being calculated correctly
3. Check PDF rendering in `character-data-mapper.ts`

## Success Criteria

✅ All tests pass if:
- Fixed equipment weapons appear automatically
- Selected equipment weapons appear in attacks
- Attack bonuses calculated correctly
- Damage includes ability modifier and type
- Finesse weapons use best ability
- No console errors
- PDF generates and displays correctly

## Next Steps After Testing

Once testing confirms everything works:

1. Test with all 12 classes
2. Test with various ability score combinations
3. Test with different equipment selections
4. Verify edge cases (no weapons, too many weapons, etc.)
5. Consider adding spell attacks (future enhancement)
6. Consider showing versatile damage (future enhancement)

---

**Happy Testing! 🎲⚔️**
