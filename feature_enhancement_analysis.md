# Feature Enhancement Analysis - Export Tab Issues & Solutions

## Current Issues Identified

### 1. Totem Warrior Issue (FIXED)
**Problem**: Barbarian totem warrior subselection (Eagle) not appearing in export features box.

**Root Cause**: The nested "Eagle Totem Warrior" feature effect adding "Eagle Totem Spirit" to features array may not be processing correctly.

**Solution Applied**: Added comprehensive debugging to:
- `FeatureCardList.svelte` - nested prompt processing
- `feature-lookup.ts` - feature lookup debugging  
- `feature-data.ts` - PDF formatting debugging
- `character-data-mapper.ts` - export features debugging

**Status**: Debugging implemented, ready for testing.

---

### 2. Dragonborn Features Display Issue
**Problem**: Some dragonborn features show partial descriptions. For example:
- Breath weapon shows nice description
- But then shows bullet points like "elemental affinity: acid" and "breath shape"
- User wants custom enhanced descriptions combining the element and shape info

**Current Implementation**: Dragonborn has separate features:
- `Breath Weapon` (base feature)
- `Elemental Affinity: {userChoice}` (e.g., "Elemental Affinity: Fire")  
- `Breath Weapon Shape: {userChoice}` (e.g., "Breath Weapon Shape: 15 ft. Cone")

**User's Vision**: Instead of 3 separate bullet points, have 2 enhanced features:
1. **Enhanced Breath Weapon**: "You can exhale destructive fire energy in a 15-foot cone..."
2. **Enhanced Elemental Affinity**: "You have resistance to fire damage..."

---

## Proposed Architecture: Dynamic Feature Enhancement

### Core Concept
Allow features to be dynamically enhanced based on user selections, rather than just displaying separate bullet points.

### Implementation Strategy

#### 1. Feature Enhancement System
Create a new system in `feature-data.ts` that can:
- Detect related features (e.g., base + modifiers)
- Combine them into enhanced descriptions
- Replace multiple simple features with fewer, richer ones

#### 2. Enhancement Rules Engine
```typescript
interface FeatureEnhancement {
  triggerFeatures: string[];           // Features that trigger this enhancement
  replacementFeature: {
    name: string;
    descriptionTemplate: string;      // Template with placeholders
    placeholders: {
      [key: string]: {
        source: 'feature' | 'userChoice' | 'computed';
        pattern?: string;             // Regex to extract value
        fallback?: string;
      }
    }
  };
}
```

#### 3. Dragonborn Enhancement Example
```typescript
const dragonbornEnhancements: FeatureEnhancement[] = [
  {
    triggerFeatures: [
      'Breath Weapon',
      'Elemental Affinity:*',         // Wildcard match
      'Breath Weapon Shape:*'
    ],
    replacementFeature: {
      name: 'Draconic Breath Weapon',
      descriptionTemplate: 'You can use your action to exhale destructive {element} energy in a {shape}. Each creature in the area must make a Dexterity saving throw (DC 8 + proficiency bonus + Constitution modifier). On a failed save, the creature takes 2d6 {element} damage, or half as much on a successful one. You can use this feature once per short or long rest.',
      placeholders: {
        element: {
          source: 'feature',
          pattern: 'Elemental Affinity: (\\w+)',
          fallback: 'elemental'
        },
        shape: {
          source: 'feature', 
          pattern: 'Breath Weapon Shape: (.+)',
          fallback: 'cone or line'
        }
      }
    }
  },
  {
    triggerFeatures: ['Damage Resistance', 'Elemental Affinity:*'],
    replacementFeature: {
      name: 'Draconic Resistance',
      descriptionTemplate: 'You have resistance to {element} damage due to your draconic heritage.',
      placeholders: {
        element: {
          source: 'feature',
          pattern: 'Elemental Affinity: (\\w+)',
          fallback: 'elemental'
        }
      }
    }
  }
];
```

#### 4. Modified formatFeaturesForPDF Function
```typescript
export function formatFeaturesForPDF(featureNames: string[], character?: Character): string {
  // First pass: identify enhancement opportunities
  const enhancements = detectEnhancements(featureNames, character);
  
  // Second pass: apply enhancements and remove replaced features
  const enhancedFeatures = applyEnhancements(featureNames, enhancements, character);
  
  // Third pass: format for PDF as usual
  return enhancedFeatures
    .map(name => formatFeatureForPDF(name, character))
    .join('\n\n');
}
```

### Benefits of This Approach

1. **Backwards Compatible**: Existing features still work as-is
2. **Flexible**: Can enhance any combination of features
3. **Maintainable**: Enhancement rules live in separate configuration
4. **User-Friendly**: Results in cleaner, more narrative descriptions
5. **Extensible**: Can add enhancements for other species/classes

### Implementation Priority

**Phase 1**: Core enhancement system
**Phase 2**: Dragonborn enhancements  
**Phase 3**: Other species/class enhancements
**Phase 4**: UI to preview enhancements

---

## Alternative Simple Solution

For a quicker fix without major architecture changes:

### Enhanced Feature Descriptions
Modify the existing dragonborn features to have dynamic descriptions that read user choices:

```typescript
// In dragonborn.ts
{
  name: 'Breath Weapon',
  description: {
    blocks: [
      {
        type: 'computed-inline',
        text: 'You can use your action to exhale destructive energy. You exhale {element} damage in a {shape} (DC 8 + proficiency + Constitution modifier). Creatures take 2d6 {element} damage, half on successful Dexterity save. Recharges on short/long rest.',
        hints: [
          {
            afterText: '{element}',
            computed: { source: 'userSelection', feature: 'Elemental Affinity' }
          },
          {
            afterText: '{shape}', 
            computed: { source: 'userSelection', feature: 'Breath Shape' }
          }
        ]
      }
    ]
  }
}
```

This approach:
- Requires less architectural change
- Solves the immediate Dragonborn issue
- Can be implemented incrementally
- Provides basis for future enhancements

---

## Recommendation

Start with the **Alternative Simple Solution** for Dragonborn to quickly address the user's concern, then implement the **Dynamic Feature Enhancement** system for a more robust long-term solution.

Both the Totem Warrior debugging and Dragonborn enhancement suggestions are now documented and ready for implementation.