# Feature Card Refactor Plan

## Problem

The class and race pages both implement nearly identical feature card systems with duplicated:

- HTML structure and styling
- Helper functions (isFeatureIncomplete, getGloballyAvailableOptions, etc.)
- State management logic
- Event handlers

This leads to maintenance issues where changes must be made in multiple places.

## Solution Architecture

### 1. Shared Component Structure

```
src/lib/components/
├── FeatureCard.svelte          # Main reusable component
├── FeatureCardList.svelte      # Container for multiple cards
└── feature-card-utils.ts       # Shared helper functions
```

### 2. FeatureCard.svelte Interface

```typescript
export interface FeatureCardProps {
	feature: FeaturePrompt;
	featureSelections: Record<string, (string | null)[]>;
	expandedFeatures: Set<string>;
	selectionVersion: number;
	onSelectOption: (feature: FeaturePrompt, index: number, value: string) => void;
	onToggleExpand: (featureName: string) => void;
	getAvailableOptions: (feature: FeaturePrompt, index: number) => (string | ComplexOption)[];
	nested?: boolean; // For styling differences
}
```

### 3. Shared Utilities (feature-card-utils.ts)

- `isFeatureIncomplete(feature, selections)`
- `getGloballyAvailableOptions(feature, index, selections, characterStore)`
- `getNestedPrompts(feature, selectedOptions)`
- `clearNestedFeatureSelections(feature, selections)`
- `ensureArrayLen(arr, len)`

### 4. FeatureCardList.svelte Interface

```typescript
export interface FeatureCardListProps {
	features: FeaturePrompt[];
	featureSelections: Record<string, (string | null)[]>;
	expandedFeatures: Set<string>;
	selectionVersion: number;
	onSelectOption: (feature: FeaturePrompt, index: number, value: string) => void;
	onToggleExpand: (featureName: string) => void;
	onBumpVersion: () => void;
}
```

## Implementation Steps

1. **Extract Utilities** - Move shared functions to `feature-card-utils.ts`
2. **Create FeatureCard Component** - Abstract the card rendering logic
3. **Create FeatureCardList Component** - Handle the list of cards with nested support
4. **Refactor Class Page** - Replace inline cards with shared component
5. **Refactor Race Page** - Replace inline cards with shared component
6. **Test & Optimize** - Ensure no functionality is lost

## Benefits

- ✅ Single source of truth for feature card logic
- ✅ Consistent styling and behavior
- ✅ Easier maintenance and bug fixes
- ✅ Better testability with isolated components
- ✅ Type safety with proper interfaces
