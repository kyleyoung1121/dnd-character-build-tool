# Feature Importance System

## Overview

The feature importance system allows you to control which features appear on the printed character sheet while still maintaining their effects for calculations.

## Importance Levels

### `'important'` (Default)
- **Appears in**: Main Features and Traits box on Page 1
- **Use for**: Core class features, significant racial traits, major abilities
- **Examples**:
  - Rage (Barbarian)
  - Spellcasting (Casters)
  - Breath Weapon (Dragonborn)
  - Sneak Attack (Rogue)
  - Ki (Monk)

### `'minor'`
- **Appears in**: Secondary features section on Page 2 or later
- **Use for**: Tool proficiencies, languages, situational features, ribbon abilities
- **Examples**:
  - Tool proficiencies from backgrounds
  - Language proficiencies
  - Darkvision
  - Fey Ancestry (advantage on charm saves)
  - Trance (elf sleep trait)

### `'invisible'`
- **Appears in**: Never displayed on character sheet
- **Use for**: Features already calculated elsewhere, passive bonuses factored into other stats
- **Examples**:
  - Jack of All Trades (factored into skill modifiers)
  - Unarmored Defense (factored into AC calculation)
  - Ability Score Increases (already shown in ability scores)
  - Natural Armor (factored into AC)

## How to Add to Features

### TypeScript Interface

```typescript
export interface FeaturePrompt {
  name: string;
  id: string;
  description: FeatureDescription;
  source: string;
  effects?: FeatureEffect[];
  importance?: 'important' | 'minor' | 'invisible'; // Add this line
}
```

### Example Usage

```typescript
// Important feature (appears on Page 1)
const ragePrompt: FeaturePrompt = {
  name: 'Rage',
  id: 'barbarian_rage',
  description: { /* ... */ },
  source: 'barbarian',
  importance: 'important', // Explicitly mark as important
  effects: [
    {
      target: 'features',
      action: 'add',
      value: 'Rage'
    }
  ]
};

// Minor feature (appears on Page 2)
const darkvisionPrompt: FeaturePrompt = {
  name: 'Darkvision',
  id: 'dwarf_darkvision',
  description: { /* ... */ },
  source: 'dwarf',
  importance: 'minor', // Will appear on Page 2
  effects: [
    {
      target: 'features',
      action: 'add',
      value: 'Darkvision'
    }
  ]
};

// Invisible feature (never shown, but effects still apply)
const jackOfAllTradesPrompt: FeaturePrompt = {
  name: 'Jack of All Trades',
  id: 'bard_jack_of_all_trades',
  description: { /* ... */ },
  source: 'bard',
  importance: 'invisible', // Never displayed
  effects: [
    {
      target: 'features',
      action: 'add',
      value: 'Jack of All Trades' // Still added for calculations
    }
  ]
};
```

## Important Notes

1. **Effects Still Apply**: Even `'invisible'` features have their effects applied. They just don't appear in the features box.

2. **Default Behavior**: If you don't specify `importance`, it defaults to `'important'`. This means all existing features will continue to work as before.

3. **Filter in PDF Export**: The character-data-mapper can filter features using:
   ```typescript
   formatFeaturesForPDF(featureNames, character, 'important') // Only important
   formatFeaturesForPDF(featureNames, character, 'minor')     // Only minor
   formatFeaturesForPDF(featureNames, character, 'all')       // All except invisible
   formatFeaturesForPDF(featureNames, character)              // All except invisible (default)
   ```

4. **Invisible Features Always Filtered**: Regardless of the filter parameter, `'invisible'` features are never included in the PDF output.

## Migration Plan

Since all features default to `'important'`, you can migrate class-by-class:

1. Review all features in a class (e.g., barbarian.ts)
2. Add `importance: 'minor'` or `importance: 'invisible'` where appropriate
3. Test the PDF export to ensure it looks good
4. Move to the next class

No need to update everything at once!

## Files Modified

- `src/lib/data/types/Features.ts` - Added `importance` property to FeaturePrompt
- `src/lib/data/features/feature-data.ts` - Added filtering logic and importance to FeatureData
- `src/lib/data/features/feature-lookup.ts` - Preserves importance when looking up features

## Future Enhancements

- Page 2 could have a dedicated "Minor Features" section
- Could add importance-based sorting (important features first)
- Could add visual indicators for feature importance during character creation
