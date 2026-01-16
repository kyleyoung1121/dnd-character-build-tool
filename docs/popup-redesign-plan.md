# Enhanced Popup Redesign Plan

## Current Problem
The popups show feature lists which isn't engaging or helpful for understanding the flavor of each choice.

## Proposed Solution: Narrative-Focused Popups

### Content Structure
Each popup should include:

#### 1. **Flavor Text (1-2 sentences)**
- Immersive summary from PHB 2014 if available
- Hook the user with the essence of the choice

#### 2. **Culture/Society Notes** 
- **Species**: Common names, customs, traditions, societal roles
- **Classes**: Philosophy, training methods, typical members
- **Backgrounds**: Life before becoming an adventurer, connections

#### 3. **Enhanced Artwork**
- Not simple class/species icons
- Complex, detailed artwork that captures the flavor
- Should be from paid artists or official PHB art
- Placeholder system for now

#### 4. **Quick Reference**
- Key mechanical benefits (ability scores, proficiencies)
- Should be concise and scannable

## Data Structure Enhancements

### ClassData Additions
```typescript
export interface ClassData {
  // ... existing fields
  enhancedFlavor?: string; // 1-2 sentence immersive description
  cultureNotes?: string; // Training, philosophy, typical members
  popupImage?: string; // Enhanced artwork path
}
```

### SpeciesData Additions  
```typescript
export interface SpeciesData {
  // ... existing fields
  enhancedFlavor?: string; // 1-2 sentence immersive description
  cultureNotes?: string; // Common names, customs, traditions
  popupImage?: string; // Enhanced artwork path
}
```

### BackgroundData Enhancements
```typescript
export interface BackgroundData {
  // ... existing fields
  // flavorDescription already exists - we can enhance it
  enhancedFlavor?: string; // More immersive version
  cultureNotes?: string; // Life before adventuring, connections
  popupImage?: string; // Enhanced artwork path
}
```

## UI Changes

### New Popup Layout
```
┌─────────────────────────────────────────┐
│ [Header with title and close button]    │
├─────────────────────────────────────────┤
│ [Enhanced artwork - large, detailed]   │
├─────────────────────────────────────────┤
│ **Flavor Text** (1-2 sentences)        │
│                                         │
│ **Culture & Society**                  │
│ • Point 1                               │
│ • Point 2                               │
│ • Point 3                               │
├─────────────────────────────────────────┤
│ **Quick Reference**                     │
│ • Key mechanical benefit 1              │
│ • Key mechanical benefit 2              │
├─────────────────────────────────────────┤
│ [Cancel]              [Confirm]        │
└─────────────────────────────────────────┘
```

### Image Placeholder Strategy
Since we want to avoid AI-generated art, implement a placeholder system:
- Check for `popupImage` field first
- If not found, display placeholder with text like:
  - "Professional artwork of [name] goes here"
  - Use consistent placeholder styling

## Implementation Priority
1. **Data Structure Updates** - Add new fields to TypeScript interfaces
2. **Sample Content** - Add enhanced content to a few examples  
3. **UI Component Redesign** - Create new popup layout
4. **Image System** - Implement placeholder logic
5. **Rollout** - Apply to classes, species, backgrounds
