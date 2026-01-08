# Features & Traits - All Sources Explained

## Overview
The **Features & Traits** section on the PDF character sheet includes features from **ALL sources**, not just class features. This is a comprehensive list of everything that makes the character special!

## What Goes in Features & Traits?

### ✅ Class Features
From the character's class and subclass:
- **Barbarian**: Rage, Unarmored Defense, Reckless Attack, Danger Sense, Frenzy, Bear Totem Spirit, etc.
- **Fighter**: Second Wind, Action Surge, Fighting Style (Archery/Defense/etc.), Improved Critical, Combat Superiority, etc.
- **Wizard**: Spellcasting, Arcane Recovery, Arcane Ward, Minor Conjuration, etc.
- **Cleric**: Spellcasting, Channel Divinity, Divine Domain features, etc.
- And all other classes...

### ✅ Species/Racial Features
From the character's race/species:
- **Dragonborn**: Breath Weapon, Damage Resistance, Elemental Affinity
- **Elf (all subraces)**: Darkvision, Fey Ancestry, Trance
- **Wood Elf**: Mask of the Wild
- **Half-Orc**: Relentless Endurance, Savage Attacks
- **Tiefling**: Hellish Resistance, Infernal Legacy
- **Dwarf**: Dwarven Resilience, Stonecunning
- **Halfling**: Lucky, Brave
- And all other species...

### ✅ Background Features
From the character's background:
- **Acolyte**: Shelter of the Faithful
- **Criminal**: Criminal Contact
- **Sage**: Researcher
- And all other backgrounds...

## How the System Works

### Character Store
All features from all sources are stored in a **single array**: `character.features: string[]`

Example for a Level 3 Wood Elf Fighter with Acolyte background:
```typescript
character.features = [
  // Class features
  "Second Wind",
  "Action Surge", 
  "Archery Fighting Style",
  
  // Species features
  "Darkvision",
  "Fey Ancestry",
  "Trance",
  "Mask of the Wild",
  
  // Background features
  "Shelter of the Faithful"
]
```

### PDF Generation Process
1. **Collect all feature names** from `character.features` array
2. **For each feature name**, call `lookupFeature()` with character context:
   - Pass character's class
   - Pass character's race/species
   - Pass character's background
3. **Dynamic lookup** searches in the appropriate source file:
   - Checks class files first (if class provided)
   - Then species files (if species provided)
   - Then background files (if background provided)
   - Falls back to searching all files if source unknown
4. **Extract description** from the found feature
5. **Clean and format** for PDF display
6. **Render on PDF** with bold feature name + description

### Example Lookup Flow

**Feature**: "Darkvision" for a Wood Elf Fighter

```
formatFeaturesForPDF(["Darkvision", ...], character)
  ↓
lookupFeature("Darkvision", "Fighter", "Wood Elf", "Acolyte")
  ↓
Try class files: Not found in Fighter
  ↓
Try species files: Found in Wood Elf!
  ↓
Return FeaturePrompt with description:
"You can see in dim light within 60 feet of you as if it 
were bright light, and in darkness as if it were dim light..."
  ↓
Clean HTML tags and special characters
  ↓
Format for PDF: "<<BOLD:Darkvision>>. You can see in dim light..."
```

## Order of Features

The order in which features appear depends on when they were added during character creation:

1. **Species features** - Added first during species selection
2. **Class features** - Added second during class selection  
3. **Background features** - Added third during background selection

However, since all features are in one array, they can appear intermixed. The PDF generator processes them in the order they appear in the array.

### Why This Works Well
- **Chronological**: Features appear roughly in the order the player selected them
- **Natural flow**: Players see species traits, then class abilities, then background features
- **Single source of truth**: No need to track separate arrays for each source

## Code Architecture

### Feature Addition (During Character Creation)
```typescript
// In class file (e.g., fighter.ts)
{
  name: 'Second Wind',
  effects: [
    { target: 'features', action: 'add', value: 'Second Wind' }
  ]
}

// In species file (e.g., wood_elf.ts)
{
  name: 'Darkvision',
  effects: [
    { target: 'features', action: 'add', value: 'Darkvision' }
  ]
}

// In background file (e.g., acolyte.ts)
{
  name: 'Shelter of the Faithful',
  effects: [
    { target: 'features', action: 'add', value: 'Shelter of the Faithful' }
  ]
}
```

All three add to the same `character.features` array!

### Feature Lookup (During PDF Generation)
```typescript
// character-data-mapper.ts
featuresAndTraits: formatFeaturesForPDF(
  character.features || [], // All features from all sources
  character                 // Context for smart lookup
)

// feature-data.ts
export function formatFeaturesForPDF(
  featureNames: string[], 
  character?: Character
): string {
  return featureNames
    .map(name => formatFeatureForPDF(name, character))
    .join('\n\n');
}

// feature-lookup.ts
export function lookupFeature(
  featureName: string,
  className?: string,      // Used to search class files
  speciesName?: string,    // Used to search species files
  backgroundName?: string  // Used to search background files
): FeaturePrompt | null {
  // Smart search through all source files
}
```

## Benefits of This Approach

### ✅ Automatic Coverage
- **No manual work** - All features from all sources automatically included
- **New classes/species/backgrounds** work immediately
- **No need to categorize** features by source

### ✅ Single Source of Truth
- Feature descriptions live in their original files
- No duplication or copying needed
- Updates automatically reflected in PDFs

### ✅ Smart Context-Aware Lookup
- Knows which class/species/background to search first
- Faster lookups with context
- Falls back to global search if needed

### ✅ Flexible and Extensible
- Easy to add new feature sources (feats, magic items, etc.)
- Works with homebrew content
- Supports complex nested features

## What About Other Things?

### Not in Features & Traits
Some things have their own dedicated sections on the character sheet:

- **Skills** → Separate skills section
- **Languages** → "Proficiencies & Languages" section
- **Proficiencies** (armor, weapons, tools) → "Proficiencies & Languages" section
- **Spells** → Page 2 additional features (or separate spell sheet)
- **Equipment** → Equipment section
- **Ability Score Increases** → Already applied to ability scores

### Features vs Proficiencies
- **Feature**: Special ability or trait (Darkvision, Rage, Second Wind)
- **Proficiency**: Trained skill or equipment familiarity (Longbow proficiency, Athletics skill)

## Testing the System

To verify all sources are working:

1. **Create a character with diverse features**:
   - Class: Fighter (Second Wind, Action Surge)
   - Species: Wood Elf (Darkvision, Fey Ancestry, Trance, Mask of the Wild)
   - Background: Acolyte (Shelter of the Faithful)

2. **Export to PDF**

3. **Check Features & Traits section** should show:
   - ✅ All class features with descriptions
   - ✅ All species features with descriptions
   - ✅ All background features with descriptions
   - ✅ Proper formatting (bold names, clean text)

## Conclusion

The system is **already handling all feature sources correctly**! The `character.features` array collects features from classes, species, and backgrounds all in one place, and the dynamic lookup system finds descriptions from the appropriate source files. No changes needed - it's working as designed! 🎉
