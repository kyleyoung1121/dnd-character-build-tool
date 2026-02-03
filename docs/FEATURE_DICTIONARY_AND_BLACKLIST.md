# Feature Dictionary and Blacklist System

## Overview

The export page feature box now has two new systems to make it more robust and flexible:

1. **Feature Description Dictionary** - Custom descriptions for special cases
2. **Feature Blacklist** - Filter out specific features that shouldn't be displayed

Both systems are located in `src/lib/data/features/feature-data.ts`

---

## Feature Description Dictionary

### Purpose
The dictionary provides custom descriptions for features where the normal lookup system cannot work or is insufficient.

### Use Cases
- **Multiple effects bundled into one card**: Like "Ki Features" which combines Flurry of Blows, Patient Defense, and Step of the Wind
- **Special formatting needed**: Features that need custom PDF formatting
- **No single source**: Features that don't have a single definitive source to look up from

### Example
```typescript
const FEATURE_DESCRIPTION_DICTIONARY: Record<string, string> = {
	'Ki Features': 'Your training allows you to harness the mystic energy of ki. You have a pool of 3 ki points. <<BOLD:Flurry of Blows>>. Immediately after you take the Attack action...'
};
```

### How to Add New Entries
1. Open `src/lib/data/features/feature-data.ts`
2. Add a new entry to `FEATURE_DESCRIPTION_DICTIONARY`
3. Use the feature name as the key (must match exactly)
4. Use `<<BOLD:Text>>` markers for bold text within descriptions
5. The main feature name will automatically get bold formatting

**Note**: The dictionary is checked FIRST before the normal lookup system. If a feature name exists in the dictionary, that description will be used instead of looking it up from class/species/background files.

---

## Feature Blacklist

### Purpose
The blacklist removes specific features from the PDF feature box even if they're in the character's features array.

### Use Cases
- **Better represented elsewhere**: Like skill expertise which is already shown in the skills section
- **Reduce clutter**: Remove duplicate or implicit information
- **Edge cases**: Handle rare structural issues where normal importance markers can't be used

### Example
```typescript
const FEATURE_BLACKLIST: string[] = [
	'Expertise: Acrobatics',
	'Expertise: Animal Handling',
	'Expertise: Athletics',
	// ... (all expertise skills EXCEPT Thieves' Tools)
];
```

### Current Implementation
The blacklist currently filters out all skill expertise entries EXCEPT "Expertise: Thieves' Tools", which should appear in the feature box since it's special tool expertise rather than a skill.

### How to Add New Entries
1. Open `src/lib/data/features/feature-data.ts`
2. Add the exact feature name to `FEATURE_BLACKLIST` array
3. The feature must match the exact string in the character's features array

**Note**: The blacklist is processed BEFORE importance filtering. Blacklisted features are completely removed regardless of their importance level.

---

## Processing Order

When generating the PDF feature box, features are processed in this order:

1. **Start with character.features array**
2. **Apply blacklist filter** → Remove blacklisted features
3. **Apply importance filter** → Remove invisible features (and optionally minor/important based on filter)
4. **For each remaining feature:**
   - Check dictionary first → Use custom description if found
   - Otherwise → Use normal lookup from class/species/background files
5. **Format and combine** → Join with double newlines

---

## Alternatives: When to Use Each System

### Use Importance Markers When:
- The feature is defined in a class/species/background file
- You want to control visibility in the normal workflow
- The feature is always hidden for everyone (e.g., "Unarmored Movement")

```typescript
importance: 'invisible'  // Never shows in PDF
importance: 'minor'      // Shows only with minor filter
importance: 'important'  // Shows by default (or with important filter)
```

### Use Blacklist When:
- The feature name is dynamic (e.g., "Expertise: {userChoice}")
- The structure of prompts doesn't allow importance markers
- You need to blacklist specific instances but not all (e.g., all expertise except Thieves' Tools)

### Use Dictionary When:
- Multiple effects need to be bundled into one description
- The same feature name appears multiple times with different descriptions
- You need special formatting that can't be achieved through normal lookup

---

## Testing

### How to Test the Blacklist
1. Create a Rogue character with expertise skills
2. Go to the export page
3. Verify that expertise skills do NOT appear in the feature box
4. Add "Expertise: Thieves' Tools" to the character
5. Verify that Thieves' Tools expertise DOES appear

### How to Test the Dictionary
1. Create a Monk character (level 3)
2. Ensure the character has "Ki Features" in their features array
3. Go to the export page
4. Verify that "Ki Features" shows a custom bundled description with all three ki abilities

---

## Notes

- Both systems are case-sensitive and require exact string matches
- The blacklist is checked before the dictionary
- Console logs are included for debugging - check browser console during PDF generation
- These systems do not affect the character store - only the PDF export display
