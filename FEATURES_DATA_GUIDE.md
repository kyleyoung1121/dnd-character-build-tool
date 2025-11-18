# Features & Traits Data Guide

## Overview

This guide explains how to add feature descriptions to the D&D character builder. The architecture is now in place - you just need to add the feature data!

## How It Works

1. **Feature names** are stored in the character store as simple strings
2. **Feature data file** (`src/lib/data/features/feature-data.ts`) maps names to full descriptions
3. **PDF generation** looks up descriptions and formats them properly

## Current Status

✅ **Complete:**
- Architecture built
- Barbarian features added (all class + subclass features)
- PDF mapper updated to use descriptions

🔨 **To Do:**
- Add remaining class features (Fighter, Rogue, Wizard, etc.)
- Add racial features (Darkvision, Dwarven Resilience, etc.)
- Add background features

## How to Add Features

### Step 1: Find the Feature Name

Look in your class data files (e.g., `src/lib/data/classes/fighter.ts`) to find the exact feature name.

Example from barbarian.ts:
```typescript
effects: [
  {
    target: 'features',
    action: 'add',
    value: 'Rage'  // ← This is the feature name
  }
]
```

### Step 2: Get the Description

Copy the feature description from:
- D&D 5e SRD (System Reference Document) - free and legal
- D&D 5e Player's Handbook
- D&D 5e Basic Rules (free PDF from Wizards of the Coast)

### Step 3: Add to feature-data.ts

Open `src/lib/data/features/feature-data.ts` and add an entry:

```typescript
'Feature Name': {
  name: 'Feature Name',
  description: 'Full description here. Use <br> for line breaks. Use <br>• for bullet points.',
  source: 'class', // or 'race', 'background', 'feat', 'subclass'
  level: 1 // Optional: what level this is gained (for class features)
},
```

### Step 4: Format Guidelines

- **Name**: Must match EXACTLY what's in your class/race data files
- **Description**: 
  - Use `<br>` for line breaks
  - Use `<br>•` for bullet points
  - Keep formatting simple (PDF doesn't support complex HTML)
- **Source**: Choose from: `'class'`, `'race'`, `'background'`, `'feat'`, `'subclass'`
- **Level**: Optional, but helpful for organization

## Example: Adding Fighter Features

### 1. Check fighter.ts for feature names

```typescript
// In src/lib/data/classes/fighter.ts
{
  target: 'features',
  action: 'add',
  value: 'Second Wind'  // ← Feature name
}
```

### 2. Find the description

From D&D 5e SRD:
> "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again."

### 3. Add to feature-data.ts

```typescript
'Second Wind': {
  name: 'Second Wind',
  description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
  source: 'class',
  level: 1
},
```

## Quick Reference: What Features to Add

### Classes (Priority Order)
1. **Fighter** - Common starter class
   - Second Wind
   - Action Surge
   - Fighting Styles (Archery, Defense, Dueling, etc.)
   - Champion features (Improved Critical)
   - Battle Master features (Combat Superiority, Maneuvers)
   - Eldritch Knight features (Weapon Bond, Spellcasting)

2. **Rogue** - Common starter class
   - Sneak Attack
   - Thieves' Cant
   - Cunning Action
   - Uncanny Dodge
   - Expertise
   - Assassin/Thief/Arcane Trickster features

3. **Wizard** - Common starter class
   - Spellcasting
   - Arcane Recovery
   - School specialization features

4. **Cleric** - Common starter class
   - Spellcasting
   - Divine Domain features
   - Channel Divinity

5. Continue with other classes...

### Racial Features (Common Ones)
- **Darkvision** (most races)
- **Dwarven Resilience** (Dwarves)
- **Trance** (Elves)
- **Lucky** (Halflings)
- **Menacing** (Half-Orcs)
- **Breath Weapon** (Dragonborn)
- **Hellish Resistance** (Tieflings)

### Background Features
- **Feature: Discovery** (Sage)
- **Feature: Shelter of the Faithful** (Acolyte)
- **Feature: Criminal Contact** (Criminal)
- etc.

## Testing Your Work

1. Create a character with the features you added
2. Export to PDF
3. Check that:
   - Feature name appears
   - Full description is shown
   - Formatting looks good (line breaks, bullets)
   - No text overflow issues

## Tips for Efficiency

### Batch Processing
Work on one class at a time. For example, do all Fighter features in one session:
1. Open `src/lib/data/classes/fighter.ts`
2. List all feature names (Second Wind, Action Surge, etc.)
3. Look up all descriptions
4. Add them all to `feature-data.ts` in one go

### Copy-Paste Template
```typescript
'FEATURE_NAME': {
  name: 'FEATURE_NAME',
  description: '',
  source: 'class',
  level: 1
},
```

### Where to Find SRD Content
- **Official SRD**: https://dnd.wizards.com/resources/systems-reference-document
- **D&D 5e API**: https://www.dnd5eapi.co/ (structured data)
- **Open5e**: https://open5e.com/ (searchable SRD)

## Common Issues

### Issue: Feature not showing description in PDF
**Solution**: Check that the feature name in `feature-data.ts` EXACTLY matches the name in your class/race files (case-sensitive!)

### Issue: Text too long, overflowing PDF box
**Solution**: The PDF has limited space. Keep descriptions concise. Very long features may need to be summarized.

### Issue: Formatting looks wrong
**Solution**: 
- Only use `<br>` for line breaks
- Only use `•` for bullets
- Don't use complex HTML or markdown

## Progress Tracking

Create a checklist in this file as you complete classes:

- [x] Barbarian (COMPLETE)
- [ ] Fighter
- [ ] Rogue
- [ ] Wizard
- [ ] Cleric
- [ ] Ranger
- [ ] Paladin
- [ ] Bard
- [ ] Druid
- [ ] Sorcerer
- [ ] Warlock
- [ ] Monk
- [ ] Racial features
- [ ] Background features

## Questions?

If you run into issues:
1. Check that feature names match exactly
2. Test with a simple feature first
3. Look at the Barbarian examples in `feature-data.ts`
4. Ask the AI assistant for help with specific features

---

**Remember**: The architecture is built! You're just adding data. Each feature follows the same simple pattern. Take it one class at a time, and you'll have a complete database in no time! 🎲
