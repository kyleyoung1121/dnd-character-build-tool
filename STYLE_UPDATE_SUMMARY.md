# Feature Display Style Update

## Changes Made

### Feature Name Formatting
✅ **Before**: Feature names displayed in ALL CAPS on separate line
```
RAGE
In battle, you fight with primal ferocity...

UNARMORED DEFENSE
While you are not wearing...
```

✅ **After**: Feature names in **bold** on same line as description, with period separator
```
**Rage.** In battle, you fight with primal ferocity...

**Unarmored Defense.** While you are not wearing...
```

### Spacing Between Features
✅ **Added**: Double newline between each feature for better readability
- Each feature is now visually separated
- Easier to distinguish where one feature ends and another begins

## Technical Implementation

### 1. Feature Formatting (`feature-data.ts`)
- Updated `formatFeatureForPDF()` to use bold markers: `<<BOLD:Name>>`
- Format: `<<BOLD:Feature Name>>. Description text here...`
- Double newline separator between features maintained

### 2. PDF Rendering (`pdf-generator.ts`)
- Added `parseTextWithBold()` function to parse bold markers
- Updated `drawTextArea()` to support mixed fonts (regular + bold)
- Embedded `HelveticaBold` font alongside regular Helvetica
- Bold text renders word-by-word with proper font switching

### 3. Font Support
- **Regular text**: Helvetica (StandardFonts.Helvetica)
- **Bold text**: Helvetica Bold (StandardFonts.HelveticaBold)
- Seamless mixing within same line

## Example Output

### PDF Display Format
```
Rage. In battle, you fight with primal ferocity. On your turn, you can 
enter a rage as a bonus action. While raging, you gain the following 
benefits if you aren't wearing heavy armor:
• You have advantage on Strength checks and Strength saving throws.
• When you make a melee weapon attack using Strength, you gain a +2 
  bonus to the damage roll.
• You have resistance to bludgeoning, piercing, and slashing damage.

Unarmored Defense. While you are not wearing any armor, your Armor 
Class equals 10 + your Dexterity modifier + your Constitution modifier. 
You can use a shield and still gain this benefit.

Reckless Attack. Starting at 2nd level, you can throw aside all concern 
for defense to attack with fierce desperation.
```

## Files Modified

```
src/lib/data/features/feature-data.ts      (updated formatting logic)
src/lib/pdf/pdf-generator.ts               (added bold font support)
```

## Backward Compatibility

✅ **Features without data**: Still display as `• Feature Name` (bullet point)
✅ **Existing features**: Automatically use new bold format
✅ **No breaking changes**: All existing functionality maintained

## Testing

### What to Check
1. **Bold rendering**: Feature names appear in bold font
2. **Period separator**: Period appears after feature name
3. **Same line**: Description starts on same line as name
4. **Spacing**: Blank line between each feature
5. **Line wrapping**: Text wraps properly with mixed fonts

### Test with Barbarian
Create a barbarian character and export to PDF:
- ✅ "Rage." should be bold, followed by description
- ✅ Space between Rage and Unarmored Defense entries
- ✅ All features formatted consistently

---

**Status**: ✅ Complete and ready for testing!
