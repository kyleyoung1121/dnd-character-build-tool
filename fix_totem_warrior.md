# Totem Warrior Feature Issue Analysis & Solution

## Problem Description
Barbarian Totem Warrior subclass selections (like "Eagle") are not appearing in the features array when exported to PDF, even though the user makes the selection in the UI.

## Root Cause Analysis

Based on the code structure in `barbarian.ts`, here's what should happen:

1. User selects "Totem Warrior" for Primal Path
2. User selects "Eagle" for the Totem Spirit nested choice  
3. This should trigger the "Eagle Totem Warrior" nested prompt
4. "Eagle Totem Warrior" has an effect: `{ target: 'features', action: 'add', value: 'Eagle Totem Spirit' }`
5. "Eagle Totem Spirit" should appear in character.features array

## The Issue

Looking at the structure in `barbarian.ts` lines 154-178:

```typescript
{
    name: 'Eagle',
    optionDescription: "...",
    nestedPrompts: [
        {
            name: 'Eagle Totem Warrior',
            id: 'barbarian_eagle_totem_warrior', 
            description: { ... },
            source: 'barbarian.totem_warrior.eagle',
            effects: [
                {
                    target: 'features',
                    action: 'add', 
                    value: 'Eagle Totem Spirit'
                }
            ]
        }
    ]
}
```

The nested prompt "Eagle Totem Warrior" is a **static feature** (no featureOptions), so it should be automatically applied when "Eagle" is selected.

## Debugging Points

With our added debugging, we should see in the console:

1. `[OPTION_NESTED]` logs when "Eagle" is selected
2. `[OPTION_NESTED] Processing option nested: "Eagle Totem Warrior"`
3. `[OPTION_NESTED] Effects:` showing the add to features effect
4. `[OPTION_NESTED] Applying choice` with the update containing features: ['Eagle Totem Spirit']

## Potential Issues

1. **Scope ID Construction**: The nested feature scope might be constructed incorrectly
2. **Effect Processing**: The effect to add "Eagle Totem Spirit" might not be processed
3. **Character Store Update**: The applyChoice might not be updating the character store
4. **Feature Lookup**: The feature name "Eagle Totem Spirit" might not be found during PDF lookup

## Testing Steps

1. Create a Barbarian character
2. Select Totem Warrior path 
3. Select Eagle as totem spirit
4. Check browser console for debugging output
5. Go to export tab and check features array
6. Check if "Eagle Totem Spirit" appears in features

## Expected Fix

If the debugging shows the effect is being applied but "Eagle Totem Spirit" doesn't appear, then:

1. Check if applyChoice is working correctly
2. Verify the character store is being updated
3. Check if there are any conflicts or cleanup happening

If "Eagle Totem Spirit" is in the features array but not showing in PDF:

1. Check if the feature lookup finds "Eagle Totem Spirit" in barbarian.ts
2. Verify the feature description is properly formatted
3. Check if the PDF formatting is working correctly

## Next Actions

1. Run the debugging version
2. Follow the test steps above  
3. Analyze the console output
4. Fix the specific issue found (likely in FeatureCardList.svelte or character store)