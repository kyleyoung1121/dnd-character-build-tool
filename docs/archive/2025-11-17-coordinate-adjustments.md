# PDF Coordinate Adjustments Summary

## Overview
Made coordinate adjustments to align PDF character sheet data with the actual form fields on the blank template.

## Calculation Reference
- US Letter PDF: 612 points wide × 792 points tall
- **1/16th of page width**: 38.25 points
- **1/8th of page width**: 76.5 points  
- **3/16ths of page width**: 114.75 points
- **3/8ths of page width**: 229.5 points
- **3/4ths of page width**: 459 points

## Changes Made

### 1. Ability Scores ✅
**Adjustment**: Move left 38.25pts (1/16th), down 76.5pts (1/8th)

| Ability | Old X | Old Y | New X | New Y |
|---------|-------|-------|-------|-------|
| Strength (score) | 60 | 600 | 21.75 | 523.5 |
| Strength (modifier) | 60 | 625 | 21.75 | 548.5 |
| Dexterity (score) | 60 | 540 | 21.75 | 463.5 |
| Dexterity (modifier) | 60 | 565 | 21.75 | 488.5 |
| Constitution (score) | 60 | 480 | 21.75 | 403.5 |
| Constitution (modifier) | 60 | 505 | 21.75 | 428.5 |
| Intelligence (score) | 60 | 420 | 21.75 | 343.5 |
| Intelligence (modifier) | 60 | 445 | 21.75 | 368.5 |
| Wisdom (score) | 60 | 360 | 21.75 | 283.5 |
| Wisdom (modifier) | 60 | 385 | 21.75 | 308.5 |
| Charisma (score) | 60 | 300 | 21.75 | 223.5 |
| Charisma (modifier) | 60 | 325 | 21.75 | 248.5 |

### 2. Combat Stats (AC, Initiative, Speed) ✅
**Adjustment**: Move left 76.5pts (1/8th)

| Field | Old X | New X | Y (unchanged) |
|-------|-------|-------|---------------|
| Armor Class | 300 | 223.5 | 625 |
| Initiative | 380 | 303.5 | 625 |
| Speed | 460 | 383.5 | 625 |

### 3. Skills ✅
**Adjustment**: Move right 38.25pts (1/16th), up 229.5pts (3/8ths)

**First Column Skills**:
| Skill | Old X | Old Y | New X | New Y |
|-------|-------|-------|-------|-------|
| Acrobatics | 70 | 145 | 108.25 | 374.5 |
| Animal Handling | 70 | 133 | 108.25 | 362.5 |
| Arcana | 70 | 121 | 108.25 | 350.5 |
| Athletics | 70 | 109 | 108.25 | 338.5 |
| Deception | 70 | 97 | 108.25 | 326.5 |
| History | 70 | 85 | 108.25 | 314.5 |
| Insight | 70 | 73 | 108.25 | 302.5 |
| Intimidation | 70 | 61 | 108.25 | 290.5 |
| Investigation | 70 | 49 | 108.25 | 278.5 |
| Medicine | 70 | 37 | 108.25 | 266.5 |
| Nature | 70 | 25 | 108.25 | 254.5 |
| Perception | 70 | 13 | 108.25 | 242.5 |
| Performance | 70 | 1 | 108.25 | 230.5 |

**Second Column Skills**:
| Skill | Old X | Old Y | New X | New Y |
|-------|-------|-------|-------|-------|
| Persuasion | 200 | 145 | 238.25 | 374.5 |
| Religion | 200 | 133 | 238.25 | 362.5 |
| Sleight of Hand | 200 | 121 | 238.25 | 350.5 |
| Stealth | 200 | 109 | 238.25 | 338.5 |
| Survival | 200 | 97 | 238.25 | 326.5 |

### 4. Saving Throws ⚠️
**Requested**: Move left 114.75pts (3/16ths), up 459pts (3/4ths)

**Issue Found**: Moving left 114.75pts from x:70 would result in x:-44.75 (off the page).

**Current Solution**: Only adjusted Y coordinates (moved up 459pts), kept X at 70 pending further instruction.

| Saving Throw | X | Old Y | New Y |
|--------------|---|-------|-------|
| Strength | 70 | 250 | 709 |
| Dexterity | 70 | 235 | 694 |
| Constitution | 70 | 220 | 679 |
| Intelligence | 70 | 205 | 664 |
| Wisdom | 70 | 190 | 649 |
| Charisma | 70 | 175 | 634 |

**Note**: Added comment in code noting this may need adjustment after testing.

### 5. Proficiencies & Languages ✅
**Issue**: Text showing as "Lan..." (cut off at right edge)
**Solution**: Moved left from x:580 to x:400

| Field | Old X | New X | Y (unchanged) |
|-------|-------|-------|---------------|
| Proficiencies & Languages | 580 | 400 | 500 |

### 6. Removed Fields ✅

The following fields were removed from the PDF (no longer rendered):

1. **Experience Points** (was showing "900")
   - Removed from config at line 69
   - Commented out in pdf-generator.ts line 139

2. **Proficiency Bonus** (was in header)
   - Removed from config at line 76
   - Commented out in pdf-generator.ts line 140

3. **Passive Perception** (was in left column)
   - Removed from config at line 144
   - Commented out in pdf-generator.ts line 175

4. **Hit Dice** (was in combat section)
   - Removed from config at line 194
   - Commented out in pdf-generator.ts line 184

## Files Modified

1. **`src/lib/pdf/character-sheet-config.ts`**
   - Adjusted coordinates for ability scores, combat stats, skills, saving throws
   - Moved proficiencies & languages
   - Removed experiencePoints, proficiencyBonus, passivePerception, hitDice configs

2. **`src/lib/pdf/pdf-generator.ts`**
   - Commented out rendering calls for removed fields
   - Added comments explaining which fields were removed

## Testing Status

✅ All changes applied successfully  
✅ Project running and hot-reloading changes  
✅ No build errors detected  

⚠️ **User should verify**:
- Saving throws positioning (X coordinate may need adjustment)
- All other fields align with PDF template properly
- Text doesn't overflow or get cut off

## Next Steps

1. **Test the PDF preview** in the browser
2. **Check saving throws** - the X coordinate of 70 may need adjustment if they're not aligning properly
3. **Fine-tune any remaining misalignments** based on visual inspection
4. **Consider future spell pages** - coordinate system is now more accurate for adding additional pages

## How to Make Further Adjustments

To adjust any coordinate:
- **Move RIGHT**: Increase X value
- **Move LEFT**: Decrease X value
- **Move UP**: Increase Y value  
- **Move DOWN**: Decrease Y value

Remember: PDF coordinates start from **bottom-left corner** (unlike typical screen coordinates).
