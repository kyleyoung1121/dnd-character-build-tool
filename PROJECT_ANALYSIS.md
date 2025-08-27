# D&D Character Builder Project Analysis

## Project Overview

Successfully cloned and set up the SvelteKit-based D&D character builder project from GitHub repository: https://github.com/kyleyoung1121/dnd-character-build-tool

**Tech Stack Confirmed:**

- SvelteKit + TypeScript
- Tailwind CSS v4.0 (latest version)
- Vite 7.0.6 as build tool
- Svelte 5.0 (latest version)
- Static site generation with @sveltejs/adapter-static

## Project Structure Analysis

### Core Architecture

```
src/
├── routes/
│   ├── (creation)/               # Character creation flow with shared layout
│   │   ├── +layout.svelte       # Tab navigation layout
│   │   ├── class/+page.svelte   # Class selection with subclass features
│   │   ├── race/+page.svelte    # Race/species selection
│   │   ├── abilities/+page.svelte
│   │   ├── background/+page.svelte
│   │   ├── equipment/+page.svelte
│   │   ├── spells/+page.svelte
│   │   └── export/+page.svelte
│   ├── +layout.svelte           # Root layout
│   ├── +page.svelte            # Landing page
│   └── welcome/+page.svelte    # Welcome screen
├── lib/
│   ├── data/                   # D&D game data
│   │   ├── classes/           # Class definitions (12 classes)
│   │   ├── races/             # Race definitions with subraces
│   │   └── types/             # TypeScript interfaces
│   └── stores/                # Svelte stores for state management
└── static/                    # Icons for classes and races
```

## Tab Navigation System

**Implementation:** `src/routes/(creation)/+layout.svelte`

The tab system uses SvelteKit's routing with a shared layout for the creation flow:

```javascript
export let navItems = [
	{ name: 'Class', href: base + '/class' },
	{ name: 'Race', href: base + '/race' },
	{ name: 'Abilities', href: base + '/abilities' },
	{ name: 'Background', href: base + '/background' },
	{ name: 'Equipment', href: base + '/equipment' },
	{ name: 'Spells', href: base + '/spells' },
	{ name: 'Export', href: base + '/export' }
];
```

**Features:**

- Fixed navigation bar at top of screen
- Clean, accessible navigation with hover effects
- Consistent styling across all creation pages
- Uses SvelteKit's native routing system

## Class Selection System

**Location:** `src/routes/(creation)/class/+page.svelte`

**Key Features:**

### 1. Class Cards with Visual Icons

- 12 D&D classes supported (barbarian, bard, cleric, druid, fighter, monk, paladin, ranger, rogue, sorcerer, warlock, wizard)
- Each class has dedicated icon from `static/class_icons/`
- Rich class descriptions and mechanical details

### 2. Dynamic Feature Selection System

- **FeaturePrompt Interface:** Sophisticated system for handling class features
- **Interactive Selections:** Dropdown menus for skills, subclass options, etc.
- **Nested Features:** Subclass features appear dynamically based on selections
- **Global Conflict Resolution:** Prevents duplicate selections across features

### 3. Subclass Support

**Example - Barbarian Subclasses:**

- **Berserker Path:** Frenzy ability with exhaustion mechanics
- **Totem Warrior Path:** Spirit Seeker + Totem Spirit selection system

**Technical Implementation:**

```typescript
interface FeaturePrompt {
	name: string;
	id: string;
	description: string;
	featureOptions?: SelectOptions;
	source: string;
	effects?: FeatureEffect[];
}

interface FeatureEffect {
	target: string; // Character property to modify
	action: FeatureAction; // "add", "remove", "set", "modify"
	value: any; // Value to apply (supports {userChoice} templating)
}
```

## Species/Race Selection System

**Location:** `src/routes/(creation)/race/+page.svelte`

**Supported Races:**

- **Human:** Standard + Variant Human
- **Elf:** High Elf, Wood Elf, Dark Elf
- **Dwarf:** Hill Dwarf, Mountain Dwarf
- **Halfling:** Lightfoot, Stout
- **Gnome:** Forest Gnome, Rock Gnome
- **Dragonborn, Half-Elf, Half-Orc, Tiefling**

**Features:**

- Visual race cards with icons from `static/race_icons/`
- Subrace selection system similar to subclass mechanics
- Racial trait application through the same effect system

## Feature Card System

**Core Architecture:** `src/lib/data/types/Features.ts`

### Static vs Interactive Features

**Static Features:** Automatically applied (e.g., "Rage", "Unarmored Defense")
**Interactive Features:** Require user choices via dropdown menus

### Feature Types:

1. **Simple Selections:** Choose from predefined list (skills, languages)
2. **Complex Options:** Nested subfeatures that unlock based on choice
3. **Templated Effects:** Use `{userChoice}` placeholder for dynamic values

**Example - Barbarian Skill Selection:**

```typescript
const proficienciesPrompt: FeaturePrompt = {
	name: 'Skill Proficiencies',
	featureOptions: {
		placeholderText: 'Select 2 skills',
		options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
		numPicks: 2
	},
	effects: [
		{
			target: 'skills',
			action: 'add',
			value: '{userChoice}'
		}
	]
};
```

## Data Storage & Loading Mechanisms

### Character Store System

**Location:** `src/lib/stores/character_store.ts`

```typescript
export type Character = {
	name: string;
	race: string;
	class: string;
	background: string;
	alignment: string;
	// Ability scores
	strength: number | null;
	dexterity: number | null;
	// ... other abilities
	// Collections
	proficiencies: string[];
	languages: string[];
	skills: string[];
	features: string[];
	inventory: string[];
	attacks: Attack[];
	spells?: string[];
	// Computed stats
	hp: number | null;
	ac: number | null;
	speed: number | null;
	size: string | null;
	// Metadata for change tracking
	_provenance?: {
		[scopeId: string]: Partial<Character>;
	};
};
```

### Advanced State Management Features

1. **Provenance Tracking:** `_provenance` field tracks which component made each change
2. **Scope-based Reversions:** Can cleanly undo class/subclass changes without affecting other selections
3. **Conflict Resolution:** Global awareness prevents duplicate selections
4. **Reactive Updates:** Svelte stores automatically update UI when character changes

### Change Management System

**Location:** `src/lib/stores/character_store_helpers.ts`

- `applyChoice(scopeId, updates, modifications)`: Apply changes with tracking
- `revertChanges(character, scopeId)`: Cleanly undo specific changes
- Sophisticated conflict detection for skills, languages, proficiencies

## Key Technical Innovations

### 1. Dynamic Feature Revelation

Subclass features appear/disappear based on selections without page reload

### 2. Template System

`{userChoice}` placeholders allow flexible feature definitions

### 3. Comprehensive Conflict Resolution

System prevents selecting the same skill twice across different features

### 4. Clean State Reversions

Can change class/subclass without losing unrelated character progress

## Development Environment Setup

✅ **Successfully Configured for Clacky:**

- Modified `vite.config.ts` with `allowedHosts: ['.clackypaas.com']`
- Removed GitHub Pages base path configuration
- Created `/home/runner/.clackyai/.environments.yaml` with proper commands
- All dependencies installed and type-checking passes

## Current Status

✅ **Project is fully operational:**

- Running on http://localhost:5173/
- No compilation errors
- Type checking passes (2 minor CSS warnings only)
- All major systems functional

**Ready for analysis and enhancement of:**

- Tab navigation improvements
- Feature card enhancements
- Additional class/race options
- UI/UX refinements
- Export functionality extensions
