# Proficiency-to-Equipment Auto-Grant System

## Overview
This system automatically grants equipment items when users select tool, instrument, or gaming set proficiencies. It eliminates confusion for kids by removing duplicate equipment selections and clearly showing which items are granted via proficiencies.

## Implementation Summary

### 1. Mapping System (`src/lib/data/proficiency-equipment-mapping.ts`)
- **Purpose**: Central database of which proficiencies grant which equipment
- **Coverage**: 50+ proficiency types including:
  - Musical instruments (10 types)
  - Artisan's tools (17 types)
  - Gaming sets (4 types)
  - Specialized tools (disguise kit, poisoner's kit, forgery kit, herbalism kit, navigator's tools)
  - Thieves' tools (with special Rogue handling)
  - Vehicles (land/water - proficiency only, no equipment)

**Key Functions**:
- `getEquipmentForProficiency(proficiency, characterClass)`: Returns equipment item for a proficiency
- `getEquipmentFromProficiencies(proficiencies, characterClass)`: Batch conversion
- `shouldHideEquipmentChoice(itemName, proficiencies)`: Determines if equipment option should be hidden

**Special Cases**:
- **Rogue Thieves' Tools**: Not granted as equipment because it's already in starter equipment
- **Vehicles**: Proficiency granted but no physical vehicle added to equipment

### 2. Auto-Sync Store (`src/lib/stores/proficiency_equipment_sync.ts`)
- **Purpose**: Watches proficiency changes and automatically grants equipment
- **Mechanism**: Store subscription that triggers on proficiency array changes
- **Scope ID**: `'proficiency_granted_equipment'` for provenance tracking
- **Integration**: Uses existing `applyChoice()` mechanism for seamless integration

**Key Functions**:
- `initializeProficiencyEquipmentSync()`: Initializes the subscription (called in layout)
- `getProficiencyGrantedEquipment()`: Returns current proficiency-granted items
- `syncEquipmentFromProficiencies()`: Internal sync function

### 3. Equipment Page Updates (`src/routes/(creation)/equipment/+page.svelte`)

#### New 3rd Section: "Equipment from Proficiencies"
- Displays between class and background equipment sections
- Shows all items granted via proficiencies
- Purple accent color to differentiate from class (blue) and background (green)
- Explanatory text: "You automatically receive these items based on your proficiency selections from class, subclass, species, and background."

#### Duplicate Filtering
**Class Equipment Filtering**:
- `shouldHideClassEquipmentChoice()`: Hides entire equipment choice if ALL options grant proficiency-granted items
- Example: Bard's "Musical Instrument" choice is hidden because all 3 instruments are now granted via proficiency

**Background Equipment Filtering**:
- `shouldHideBackgroundOption()`: Hides individual background equipment options if ALL items are proficiency-granted
- Example: Entertainer background won't show instrument options if already granted

### 4. Bug Fix: Rogue Assassin (`src/lib/data/classes/rogue.ts`)
- **Issue**: Assassin subclass only granted a feature text, not actual proficiencies
- **Fix**: Added proficiencies effect to properly grant disguise kit and poisoner's kit proficiencies

### 5. Initialization (`src/routes/+layout.svelte`)
- Added `onMount()` hook to call `initializeProficiencyEquipmentSync()`
- Ensures system is active as soon as app loads

## Proficiency Sources Covered

### Class/Subclass
- **Bard**: 3 musical instruments (all auto-granted)
- **Fighter (Battle Master)**: 1 artisan's tool
- **Rogue (Assassin)**: Disguise kit, poisoner's kit

### Species
- **Dwarf (Hill & Mountain)**: 1 artisan's tool proficiency
- **Rock Gnome**: Tinker's tools

### Backgrounds (All 16)
- **Charlatan**: Disguise kit, forgery kit
- **Criminal**: Gaming set, thieves' tools
- **Entertainer**: Musical instrument
- **Folk Hero**: Artisan's tools, vehicles (land)
- **Guild Artisan**: Artisan's tools
- **Hermit**: Herbalism kit
- **Noble**: Gaming set
- **Outlander**: Musical instrument
- **Sailor/Pirate**: Navigator's tools
- **Soldier**: Gaming set
- **Urchin**: Disguise kit, thieves' tools
- And more...

## User Experience Improvements

### Before
1. User selects 3 musical instruments as Bard proficiencies
2. User goes to equipment page, confused why they need to select instrument again
3. User might think they get 4 total instruments (3 proficiencies + 1 equipment)

### After
1. User selects 3 musical instruments as Bard proficiencies
2. All 3 instruments automatically added to inventory
3. Equipment page shows:
   - Standard Bard equipment (rapier, pack, etc.)
   - **New section**: "Equipment from Proficiencies" showing 3 instruments with purple badges
   - Background equipment (NO duplicate instrument selection shown)
4. Clear and unambiguous - no confusion

## Technical Details

### Provenance Tracking
- Uses scope ID `'proficiency_granted_equipment'`
- Integrates with existing character store provenance system
- Automatic reversion when proficiencies change

### Reactivity
- Store subscription detects proficiency array changes
- UI automatically updates via reactive `$:` statements
- No manual refresh needed

### Performance
- Array equality checking prevents unnecessary updates
- Batch processing of proficiencies
- Efficient filtering algorithms

## Testing Checklist
- [x] Bard: 3 musical instruments granted, musical instrument choice hidden
- [x] Fighter Battle Master: Artisan tool granted
- [x] Rogue Assassin: Disguise kit and poisoner's kit proficiencies AND equipment granted
- [x] Dwarf: Tool proficiency grants tool equipment
- [x] Rock Gnome: Tinker's tools granted
- [x] Backgrounds: All tool/instrument/kit proficiencies grant equipment
- [x] Vehicles: Proficiency granted but NO vehicle equipment
- [x] Rogue + Thieves' tools: No duplicate (already in starter equipment)
- [x] Duplicate filtering: Background options hidden when proficiency-granted
- [x] UI: Purple section displays correctly
- [x] Store: Equipment persists and updates reactively

## Files Modified/Created

### New Files
1. `src/lib/data/proficiency-equipment-mapping.ts` - Mapping rules
2. `src/lib/stores/proficiency_equipment_sync.ts` - Auto-sync logic

### Modified Files
1. `src/routes/(creation)/equipment/+page.svelte` - UI updates and filtering
2. `src/lib/data/classes/rogue.ts` - Assassin proficiency fix
3. `src/routes/+layout.svelte` - Initialization

## Edge Cases Handled
1. **Rogue Thieves' Tools**: Special logic to not grant equipment (already in starter)
2. **Vehicles**: Proficiency granted but no physical vehicle
3. **Array Updates**: Only syncs when proficiency array actually changes
4. **Empty States**: Gracefully handles characters with no proficiencies
5. **Index Mapping**: Correctly maps filtered options back to original indices for selection tracking
