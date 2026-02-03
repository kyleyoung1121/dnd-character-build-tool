# Feature Dictionary & Blacklist Implementation

**Date**: 2025-01-XX  
**Status**: ✅ Complete  
**Files Modified**: 
- `src/lib/data/features/feature-data.ts`

**Files Created**:
- `docs/FEATURE_DICTIONARY_AND_BLACKLIST.md`

---

## Summary

Enhanced the export page feature box with two new systems to make feature display more robust and flexible:

1. **Feature Description Dictionary** - Provides custom descriptions for special cases
2. **Feature Blacklist** - Filters out specific features that shouldn't be displayed

---

## Problem Statement

### 1. Multiple Effects in One Card

**Issue**: When a prompt adds multiple effects (like Monk's Ki Features), the normal lookup system would fetch the same description for each effect.

**Example**: 
- Feature: "Ki Features"
- Effects added: "Flurry of Blows", "Patient Defense", "Step of the Wind"
- Problem: If we try to look up each sub-feature individually, we get incomplete information
- Solution needed: Bundle all three abilities into one comprehensive description

### 2. Blacklisting Specific Entries

**Issue**: Some features should not be displayed even when they're in the features array, and the normal importance system can't handle all cases.

**Example**:
- Feature pattern: `Expertise: {userChoice}` (e.g., "Expertise: Acrobatics", "Expertise: Stealth")
- Problem: We want to show "Expertise: Thieves' Tools" but hide all skill expertise (already shown in skills section)
- Challenge: The prompt structure doesn't allow us to set importance markers differently for each choice
- Solution needed: Blacklist specific feature names

---

## Implementation

### Feature Description Dictionary

**Location**: `src/lib/data/features/feature-data.ts` (line ~386)

```typescript
const FEATURE_DESCRIPTION_DICTIONARY: Record<string, string> = {
	'Ki Features': 'Your training allows you to harness the mystic energy of ki...'
	// Add more as needed
};
```

**How it works**:
1. Dictionary is checked FIRST before normal lookup
2. If feature name exists in dictionary, use that description
3. Otherwise, fall back to normal class/species/background lookup
4. Use `<<BOLD:Text>>` markers for bold formatting within descriptions

**Current entries**:
- `Ki Features`: Bundles Flurry of Blows, Patient Defense, and Step of the Wind into one comprehensive description

### Feature Blacklist

**Location**: `src/lib/data/features/feature-data.ts` (line ~406)

```typescript
const FEATURE_BLACKLIST: string[] = [
	'Expertise: Acrobatics',
	'Expertise: Animal Handling',
	// ... all expertise skills EXCEPT Thieves' Tools
];
```

**How it works**:
1. Applied BEFORE importance filtering
2. Completely removes blacklisted features from display
3. Case-sensitive, requires exact string match
4. Processed in first filter pass

**Current entries**:
- All skill expertise entries EXCEPT "Expertise: Thieves' Tools"
- Rationale: Skill expertise is already represented in the skills section with doubled proficiency bonus; tool expertise should still appear as it's more special

---

## Processing Flow

When generating the PDF feature box:

```
character.features array
    ↓
[1] Blacklist Filter
    ↓
[2] Importance Filter (invisible, minor, important)
    ↓
[3] For each remaining feature:
    ├─→ Check dictionary → Use custom if found
    └─→ Otherwise → Normal lookup from class/species/background
    ↓
[4] Format with [[BOLD:Name]] markers
    ↓
[5] Join with double newlines
    ↓
PDF display
```

---

## Code Changes

### Modified Function: `formatFeaturesForPDF`

**Before**:
```typescript
// Single pass filtering by importance only
const filteredFeatures = featureNames.filter(name => {
	const featureData = getFeatureData(name, character);
	// ... importance checks
});
```

**After**:
```typescript
// First pass: Blacklist filtering
const nonBlacklistedFeatures = featureNames.filter(name => {
	if (FEATURE_BLACKLIST.includes(name)) {
		console.log(`  Blacklisted feature removed: "${name}"`);
		return false;
	}
	return true;
});

// Second pass: Importance filtering
const filteredFeatures = nonBlacklistedFeatures.filter(name => {
	// ... importance checks
});

// Check dictionary before normal lookup
const result = filteredFeatures.map((name) => {
	if (FEATURE_DESCRIPTION_DICTIONARY[name]) {
		return `[[BOLD:${name}]]. ${FEATURE_DESCRIPTION_DICTIONARY[name]}`;
	}
	return formatFeatureForPDF(name, character);
});
```

---

## Usage Examples

### Adding to Dictionary

```typescript
const FEATURE_DESCRIPTION_DICTIONARY: Record<string, string> = {
	'Ki Features': '...',
	'Channel Divinity Options': 'You can use your Channel Divinity to fuel these effects. <<BOLD:Turn Undead>>. As an action, you present your holy symbol...',
};
```

### Adding to Blacklist

```typescript
const FEATURE_BLACKLIST: string[] = [
	'Expertise: Acrobatics',
	'Some Other Feature Name',
];
```

---

## When to Use Each System

### Use Normal Lookup When:
- Feature has a single, definitive source
- Description is in class/species/background files
- Normal lookup works 99% of the time ✅

### Use Importance Markers When:
- You control the feature definition
- Feature should never show (importance: 'invisible')
- Located in: class/species/background TypeScript files

### Use Dictionary When:
- Multiple effects bundled into one card
- Same feature name appears with different descriptions
- Special formatting needed for PDF
- Cannot be looked up from a single source

### Use Blacklist When:
- Feature name is dynamic (e.g., `Expertise: {userChoice}`)
- Prompt structure doesn't allow importance markers
- Need to filter specific instances, not all
- Edge cases where normal systems can't handle it

---

## Testing

### Test Cases

1. **Monk Ki Features** (Dictionary)
   - Create level 3 Monk
   - Go to export page
   - Verify "Ki Features" shows bundled description with all three abilities

2. **Rogue Expertise** (Blacklist)
   - Create Rogue with expertise in Acrobatics and Stealth
   - Go to export page
   - Verify expertise skills do NOT appear in feature box
   - Check skills section shows doubled proficiency bonus

3. **Thieves' Tools Expertise** (Blacklist Exception)
   - Create Rogue with "Expertise: Thieves' Tools"
   - Go to export page
   - Verify Thieves' Tools expertise DOES appear in feature box

---

## Benefits

### Robustness
- Handles edge cases that normal lookup can't
- Provides fallback for complex feature structures
- Prevents duplicate/redundant information

### Flexibility
- Easy to add new custom descriptions
- Simple blacklist maintenance
- No need to modify prompt structures

### Maintainability
- Clear separation of concerns
- Well-documented use cases
- Console logging for debugging

---

## Future Enhancements

Potential improvements:

1. **Pattern Matching in Blacklist**
   - Support regex or wildcards (e.g., `Expertise: *` except `Expertise: Thieves' Tools`)
   - Would reduce blacklist size

2. **Dictionary Templating**
   - Support variables in dictionary descriptions
   - Dynamic content based on character data

3. **Admin UI**
   - Web interface to manage dictionary and blacklist
   - No need to edit TypeScript files

4. **Auto-detection**
   - Automatically detect when multiple related features should be bundled
   - Use AI to generate bundled descriptions

---

## Notes

- Both systems are case-sensitive
- Blacklist is processed before importance filtering
- Dictionary is checked before normal lookup
- Console logs included for debugging (check browser console during PDF generation)
- These systems only affect PDF export display, not the character store
- No breaking changes to existing functionality

---

## Related Documentation

- [FEATURE_DICTIONARY_AND_BLACKLIST.md](./FEATURE_DICTIONARY_AND_BLACKLIST.md) - User guide and reference
- [FEATURE_IMPORTANCE_GUIDE.md](../FEATURE_IMPORTANCE_GUIDE.md) - Importance marker system
- [2025-11-17-features-sources-explanation.md](./2025-11-17-features-sources-explanation.md) - Feature lookup architecture
