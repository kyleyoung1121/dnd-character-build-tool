# D&D Character Builder - Architecture

**Last Updated:** 2025-01-15

This is a living document that describes the current architecture of the D&D Character Builder project. When architectural changes are made, this document should be updated to reflect the new state.

---

## Tech Stack

- **Framework:** SvelteKit 2.0 + TypeScript
- **Styling:** Tailwind CSS v4.0
- **Build Tool:** Vite 7.0.6
- **Svelte Version:** 5.0
- **Deployment:** Static site generation with @sveltejs/adapter-static

---

## Project Structure

```
src/
├── routes/
│   ├── (creation)/                    # Character creation flow
│   │   ├── +layout.svelte            # Tab navigation wrapper
│   │   ├── class/+page.svelte        # Class selection
│   │   ├── species/+page.svelte      # Species/race selection
│   │   ├── abilities/+page.svelte    # Ability scores
│   │   ├── background/+page.svelte   # Background selection
│   │   ├── equipment/+page.svelte    # Equipment choices
│   │   ├── spells/+page.svelte       # Spell selection
│   │   ├── beasts/+page.svelte       # Beast companion/familiar
│   │   └── export/+page.svelte       # PDF export
│   ├── +layout.svelte                # Root layout
│   ├── +page.svelte                  # Landing page
│   └── welcome/+page.svelte          # Welcome screen
├── lib/
│   ├── components/                   # Reusable Svelte components
│   │   ├── FeatureCard.svelte       # Individual feature card
│   │   ├── FeatureCardList.svelte   # List of feature cards
│   │   ├── FeatureDescription.svelte # Feature text rendering
│   │   ├── ConflictWarning.svelte   # Conflict detection UI
│   │   ├── BeastCard.svelte         # Beast companion card
│   │   └── CharacterSheet.svelte    # Character sheet display
│   ├── data/                         # D&D game data
│   │   ├── classes/                 # 12 class definitions
│   │   ├── species/                 # Race/species definitions
│   │   ├── backgrounds/             # Background definitions
│   │   ├── beasts/                  # Beast stat blocks
│   │   ├── spells.ts                # Spell data
│   │   ├── equipment/               # Weapons and gear
│   │   ├── features/                # Feature descriptions
│   │   └── types/                   # TypeScript interfaces
│   ├── stores/                      # Svelte stores
│   │   ├── character_store.ts      # Main character state
│   │   ├── character_store_helpers.ts # State manipulation
│   │   ├── conflict_detection.ts   # Conflict detection logic
│   │   ├── conflict_store.ts       # Conflict state management
│   │   └── notification_store.ts   # Toast notifications
│   ├── pdf/                         # PDF generation
│   │   ├── pdf-generator.ts        # Main PDF logic
│   │   ├── character-sheet-config.ts # PDF field mapping
│   │   └── character-data-mapper.ts # Data transformation
│   └── debug/                       # Debugging utilities
└── static/                          # Static assets
    ├── class_icons/
    ├── species_icons/
    ├── background_icons/
    └── pdf-templates/
```

---

## Core Systems

### 1. Character State Management

**Primary Store:** `src/lib/stores/character_store.ts`

The character store is a Svelte writable store containing all character data:

```typescript
export type Character = {
  // Basic Info
  name: string;
  class: string;
  race: string;
  background: string;
  level: number;
  
  // Ability Scores
  strength: number | null;
  dexterity: number | null;
  constitution: number | null;
  intelligence: number | null;
  wisdom: number | null;
  charisma: number | null;
  
  // Collections
  skills: string[];
  proficiencies: string[];
  languages: string[];
  features: string[];
  spells: (string | SpellSelection)[];
  inventory: string[];
  attacks: Attack[];
  
  // Computed Stats
  hp: number | null;
  ac: number | null;
  speed: number | null;
  
  // Provenance Tracking (see below)
  _provenance?: Record<string, Partial<Character>>;
};
```

### 2. Provenance System

**Purpose:** Track which component/feature made which changes to enable clean reversions.

**How it works:**
- Every change is tagged with a `scopeId` (e.g., `"class:Barbarian"`, `"feature:Skill Proficiencies:0"`)
- Changes are stored in `character._provenance[scopeId]`
- When a class/subclass/feature is deselected, we can cleanly revert only those changes

**Example:**
```typescript
_provenance: {
  "class:Barbarian": {
    _set: {
      hp: 12,
      skills: ["Athletics", "Intimidation"],
      features: ["Rage", "Unarmored Defense"]
    }
  },
  "high_elf.keen_senses": {
    _set: {
      skills: ["Perception"]
    }
  }
}
```

### 3. Feature System

**Core Type:** `FeaturePrompt` (defined in `src/lib/data/types/Features.ts`)

Features represent any choice or ability in D&D:
- Class features (Rage, Sneak Attack, Spellcasting)
- Racial traits (Darkvision, Dwarven Resilience)
- Background features
- Subclass features

**Key Concept:** Features can be **static** (automatically applied) or **interactive** (require user choice).

**Structure:**
```typescript
interface FeaturePrompt {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: DescriptionBlock; // Rich text description
  source: string;                // Where it comes from (e.g., "barbarian.rage")
  
  // For interactive features:
  featureOptions?: {
    placeholderText: string;
    options: string[] | FeatureOption[];
    numPicks: number;
  };
  
  // What changes this feature makes:
  effects?: FeatureEffect[];
  
  // Nested features (e.g., subclass features):
  nestedPrompts?: FeaturePrompt[];
}
```

**Feature Effects:**
```typescript
interface FeatureEffect {
  target: string;  // Character property: "skills", "hp", "features", etc.
  action: "add" | "remove" | "set" | "modify";
  value: any;      // Can use "{userChoice}" placeholder
}
```

### 4. Nested Features & Deep Nesting

**Challenge:** Some features are nested 4+ levels deep.

**Example:** Warlock Pact Boons
```
Warlock Class
  └─ Pact Boon (choose one)
      └─ Pact of the Chain
          └─ Eldritch Invocations (choose 2)
              └─ Beguiling Influence
                  └─ Description (shows details)
```

**Solution:** Provenance keys include parent context:
- Format: `feature:ParentName:ParentIndex:FeatureName:index`
- Example: `feature:Pact of the Chain:0:Eldritch Invocations:0`

**Critical Code:** `src/routes/(creation)/class/+page.svelte` line 290
```typescript
const getProvenanceEntry = (
  featureName: string, 
  idx?: number, 
  parentFeatureName?: string, 
  parentIndex?: number  // ← Critical for deep nesting!
) => {
  // Tries multiple key formats to find saved selections
}
```

### 5. Conflict Detection System

**Files:**
- `src/lib/stores/conflict_detection.ts` - Detection logic
- `src/lib/stores/conflict_store.ts` - Reactive conflict state
- `src/lib/components/ConflictWarning.svelte` - UI warnings

**Detected Conflicts:**
1. **Duplicate Skills:** Same skill granted by multiple sources
2. **Duplicate Proficiencies:** Same weapon/armor proficiency
3. **Duplicate Languages:** Same language
4. **Spell Limit Violations:** Too many spells prepared

**Visual Indicators:**
- Affected tabs show red background with ⚠️ icon
- Conflicting feature cards highlight with warning
- Expandable warning banner explains the conflict

**How Detection Works:**
1. Scan `character._provenance` for all changes
2. Group by type (skills, languages, etc.)
3. Find duplicates across different scopes
4. Map conflicts to affected tabs
5. Filter by visited tabs (avoid false warnings)

### 6. Description System

**Three Description Types:**

1. **Simple Text Block**
```typescript
{ type: 'text', text: 'You gain proficiency with shields.' }
```

2. **Computed Inline** (shows live character values)
```typescript
{
  type: 'computed-inline',
  text: 'Your AC equals 10 + your Dexterity modifier.',
  hints: [{
    afterText: 'your Dexterity modifier',
    computed: { source: 'abilityMod', ability: 'DEX' },
    hintFormat: '({value})'
  }]
}
```

3. **Feature Option** (expandable nested features)
```typescript
{
  type: 'feature-option',
  optionDescription: 'Choose a Fighting Style',
  nestedPrompts: [/* subfeatures */]
}
```

**Rendering:** `src/lib/components/FeatureDescription.svelte`

### 7. PDF Export System

**Files:**
- `src/lib/pdf/pdf-generator.ts` - Main export logic
- `src/lib/pdf/character-sheet-config.ts` - Field coordinates
- `src/lib/pdf/character-data-mapper.ts` - Data transformation
- `static/pdf-templates/dnd-character-sheet-blank.pdf` - Template

**Process:**
1. User clicks "Export PDF"
2. Character data transformed to PDF format
3. Fields filled into official D&D 5e character sheet template
4. PDF downloaded to user's device

**Field Mapping:** Each character property maps to specific coordinates on the PDF:
```typescript
{
  name: 'CharacterName',
  x: 112,
  y: 42,
  fontSize: 12,
  fontName: 'Helvetica-Bold'
}
```

---

## Key Conventions

### File Naming
- Class files: lowercase (e.g., `barbarian.ts`, `warlock.ts`)
- Component files: PascalCase (e.g., `FeatureCard.svelte`)
- Type files: PascalCase (e.g., `Features.ts`, `ClassData.ts`)

### Feature IDs
Format: `{class}_{feature_name}_{variant}`
Example: `barbarian_rage_01`, `warlock_agonizing_blast_desc_chain`

### Provenance Scope IDs
- Class: `class:ClassName`
- Species: `species:SpeciesName` or `{species_id}.{trait_id}`
- Feature: `feature:FeatureName:index` or `feature:ParentName:ParentIndex:FeatureName:index`
- Background: `background:BackgroundName`

### Effect Targets
Standard targets: `skills`, `proficiencies`, `languages`, `features`, `hp`, `ac`, `speed`, `spells`, `attacks`, `inventory`

---

## Common Patterns

### Adding a New Class Feature

1. Open the class file (e.g., `src/lib/data/classes/fighter.ts`)
2. Add a `FeaturePrompt` object
3. Define effects that modify the character
4. If interactive, add `featureOptions`
5. Test by creating a character with that class

### Adding Computed Descriptions

Use `computed-inline` type with hints:
```typescript
{
  type: 'computed-inline',
  text: 'Your bonus equals your proficiency bonus.',
  hints: [{
    afterText: 'proficiency bonus',
    computed: { source: 'proficiencyBonus' },
    hintFormat: '(+{value})'
  }]
}
```

### Handling Deeply Nested Features

Pass `parentIndex` through all levels:
```typescript
getProvenanceEntry(feature.name, idx, parentFeatureName, parentIndex)
```

---

## Known Issues & Workarounds

### Warlock Invocation Persistence
- **Issue:** Invocations weren't persisting across tab changes
- **Root Cause:** Missing `parentIndex` in provenance key lookup
- **Fix:** Added `parentIndex` parameter to `getProvenanceEntry()` function
- **Status:** Fixed (2025-01-15)

### Tab Character Issues
- **Issue:** Some files use actual tab characters for indentation
- **Impact:** Makes `multi_edit` operations fail due to whitespace mismatches
- **Workaround:** Use `sed` commands for precise edits in affected files

---

## Future Considerations

- **Multiclassing:** Would require handling multiple class provenance scopes
- **Leveling Up:** Need to track level-gated features
- **Custom Content:** User-defined features/classes
- **Mobile Optimization:** Responsive design improvements
- **Offline Support:** PWA with local storage

---

## Development Notes

### Testing Changes
1. Always test character creation flow end-to-end
2. Check provenance by inspecting `character._provenance` in browser console
3. Verify PDF export includes all features correctly
4. Test conflict detection with overlapping selections

### Debugging Provenance Issues
```javascript
// In browser console:
$character._provenance  // View all tracked changes
```

### Common Git Workflow
1. Make changes in Clacky environment
2. Commit changes locally
3. Copy files to local PC
4. Push from local PC
5. Fetch in Clacky environment
6. Verify with `git diff HEAD origin/main --stat`
7. Reset hard to sync

---

**For more details on specific features, see the dated documentation in `/docs/`.**
