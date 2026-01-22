# Derived Stats System Design

## Overview
This document outlines the design for a unified system to calculate derived character statistics (HP, Speed, AC) with proper handling of exceptions and modifiers.

## Current State Analysis

### What We Have
1. **Export Page** (`src/routes/(creation)/export/+page.svelte`): Simple preview/download interface
2. **Character Data Mapper** (`src/lib/pdf/character-data-mapper.ts`): Currently has:
   - ✅ Ability modifiers calculation
   - ✅ Skill modifiers (with proficiency, expertise, Jack of All Trades)
   - ✅ Saving throws
   - ✅ Attack calculations
   - ⚠️ **INCOMPLETE**: HP (uses `character.hp || null`)
   - ⚠️ **INCOMPLETE**: Speed (uses `character.speed || 30`)
   - ⚠️ **INCOMPLETE**: AC (uses `character.ac || null`)

### What's Missing
The three critical stats need proper calculation with exception handling:
1. **Hit Points** - Base formula + modifiers
2. **Speed** - Base value + racial/class exceptions
3. **Armor Class** - Equipment-based OR special formulas

---

## 1. Hit Points System

### Base Formula
**At Level 3:**
```
HP = Hit Die Max + (Hit Die Average × 2) + (CON modifier × 3)
```

**Why this formula?**
- Level 1: Take maximum of hit die
- Level 2-3: Take average (rounded up) of hit die roll
- Constitution modifier applies to EVERY level

**Example (Fighter with 14 CON, d10 hit die):**
```
HP = 10 + (6 × 2) + (2 × 3) = 10 + 12 + 6 = 28 HP
```

### Hit Die Values by Class
```typescript
{
  'Barbarian': 'd12',   // avg = 7
  'Fighter': 'd10',     // avg = 6
  'Paladin': 'd10',     // avg = 6
  'Ranger': 'd10',      // avg = 6
  'Bard': 'd8',         // avg = 5
  'Cleric': 'd8',       // avg = 5
  'Druid': 'd8',        // avg = 5
  'Monk': 'd8',         // avg = 5
  'Rogue': 'd8',        // avg = 5
  'Warlock': 'd8',      // avg = 5
  'Sorcerer': 'd6',     // avg = 4
  'Wizard': 'd6'        // avg = 4
}
```

### Modifiers/Exceptions
1. **Dwarven Toughness (Hill Dwarf)**
   - Feature: "Dwarven Toughness"
   - Effect: +1 HP per level → **+3 HP at level 3**
   - Implementation: Check `character.features.includes('Dwarven Toughness')`

2. **Tough Feat** (not implemented yet, but worth noting)
   - Would add +2 HP per level

### Implementation Strategy
```typescript
function calculateHitPoints(character: Character): number {
  const classData = getClassData(character.class);
  const hitDie = classData?.hitDie; // e.g., 'd12'
  
  if (!hitDie) return 0;
  
  // Parse hit die to get max and average
  const dieMax = parseInt(hitDie.substring(1)); // d12 → 12
  const dieAverage = Math.ceil((dieMax + 1) / 2); // d12 → 7
  
  // Base HP: max at level 1, then average for levels 2-3
  const level = 3;
  let hp = dieMax + (dieAverage * (level - 1));
  
  // Add constitution modifier per level
  const conMod = getModifier(character.constitution);
  hp += conMod * level;
  
  // Apply modifiers
  if (character.features?.includes('Dwarven Toughness')) {
    hp += level; // +1 per level
  }
  
  return Math.max(1, hp); // Minimum 1 HP
}
```

---

## 2. Speed System

### Base Values by Species
```typescript
{
  // 30 ft (standard)
  'Human': 30,
  'Variant Human': 30,
  'Dragonborn': 30,
  'Half-Elf': 30,
  'Half-Orc': 30,
  'Tiefling': 30,
  'High Elf': 30,
  'Dark Elf': 30,
  
  // 35 ft (Wood Elf only)
  'Wood Elf': 35,
  
  // 25 ft (small races)
  'Hill Dwarf': 25,
  'Mountain Dwarf': 25,
  'Rock Gnome': 25,
  'Forest Gnome': 25,
  'Lightfoot Halfling': 25,
  'Stout Halfling': 25
}
```

### Class Modifiers
1. **Monk - Unarmored Movement** (Level 3+)
   - Feature: "Unarmored Movement"
   - Effect: +10 ft speed when not wearing armor
   - Condition: Must not be wearing armor
   - Implementation: Check `character.features.includes('Unarmored Movement')`

2. **Barbarian - Fast Movement** (Level 5+, not applicable at level 3)
   
3. **Other Speed Sources**
   - Some backgrounds/items might grant speed (none currently)

### Implementation Strategy
```typescript
function calculateSpeed(character: Character): number {
  // Get base speed from species
  const speciesData = getSpeciesData(character.race, character.subrace);
  let speed = parseSpeedFromSpecies(speciesData?.speed) || 30;
  
  // Apply class modifiers
  if (character.features?.includes('Unarmored Movement')) {
    // Check if wearing armor (this is complex - see below)
    const isWearingArmor = checkIfWearingArmor(character);
    if (!isWearingArmor) {
      speed += 10;
    }
  }
  
  return speed;
}

function parseSpeedFromSpecies(speedString: string | undefined): number {
  if (!speedString) return 30;
  const match = speedString.match(/(\d+)\s*ft/);
  return match ? parseInt(match[1]) : 30;
}

function checkIfWearingArmor(character: Character): boolean {
  // Check inventory for armor items
  const armorItems = [
    'Padded armor', 'Leather armor', 'Studded leather armor',
    'Hide armor', 'Chain shirt', 'Scale mail', 'Breastplate', 
    'Half plate', 'Ring mail', 'Chain mail', 'Splint armor', 
    'Plate armor'
  ];
  
  return character.inventory?.some(item => 
    armorItems.some(armor => 
      item.toLowerCase().includes(armor.toLowerCase())
    )
  ) || false;
}
```

---

## 3. Armor Class System

### Standard AC Calculation
**With Armor:**
```
AC = Base Armor AC + DEX modifier (capped by armor type)
```

**Armor Types:**
- **Light Armor**: Base AC + full DEX modifier
  - Padded (11), Leather (11), Studded Leather (12)
- **Medium Armor**: Base AC + DEX modifier (max +2)
  - Hide (12), Chain shirt (13), Scale mail (14), Breastplate (14), Half plate (15)
- **Heavy Armor**: Base AC only (no DEX)
  - Ring mail (14), Chain mail (16), Splint (17), Plate (18)
- **Shield**: +2 to AC

**Without Armor:**
```
AC = 10 + DEX modifier
```

### Special AC Formulas (Overrides)

#### 1. **Barbarian - Unarmored Defense**
- Feature: "Unarmored Defense"
- Formula: `10 + DEX modifier + CON modifier`
- Condition: Not wearing armor (shields allowed)

#### 2. **Monk - Unarmored Defense**
- Feature: "Unarmored Defense"
- Formula: `10 + DEX modifier + WIS modifier`
- Condition: Not wearing armor AND not using shield

#### 3. **Draconic Bloodline Sorcerer**
- Feature: "Draconic Resilience"
- Formula: `13 + DEX modifier`
- Condition: Not wearing armor

#### 4. **Mage Armor Spell**
- Formula: `13 + DEX modifier`
- Condition: Not wearing armor
- Note: Would need to track if this spell is active

### Priority System
When multiple AC calculations apply, use the BEST one:
1. Compare armor-based AC vs. special formulas
2. Apply shield bonus (+2) if applicable
3. Apply other AC bonuses (magic items, spells, etc.)

### Implementation Strategy
```typescript
interface ACCalculation {
  value: number;
  source: string;
  allowsShield: boolean;
}

function calculateArmorClass(character: Character): number {
  const dexMod = getModifier(character.dexterity);
  const conMod = getModifier(character.constitution);
  const wisMod = getModifier(character.wisdom);
  
  const acOptions: ACCalculation[] = [];
  
  // Check for armor in inventory
  const armor = findArmorInInventory(character.inventory);
  const hasShield = character.inventory?.some(item => 
    item.toLowerCase().includes('shield')
  ) || false;
  
  if (armor) {
    // Calculate armor-based AC
    const armorAC = calculateArmorBasedAC(armor, dexMod);
    acOptions.push({
      value: armorAC,
      source: `${armor.name} armor`,
      allowsShield: armor.type !== 'heavy' // Heavy armor doesn't benefit from shields mechanically
    });
  }
  
  // Check for special AC formulas
  const hasUnarmoredDefense = character.features?.includes('Unarmored Defense');
  
  if (hasUnarmoredDefense && !armor) {
    // Determine which Unarmored Defense
    if (character.class === 'Barbarian') {
      acOptions.push({
        value: 10 + dexMod + conMod,
        source: 'Unarmored Defense (Barbarian)',
        allowsShield: true
      });
    } else if (character.class === 'Monk') {
      acOptions.push({
        value: 10 + dexMod + wisMod,
        source: 'Unarmored Defense (Monk)',
        allowsShield: false // Monk loses Unarmored Defense with shield
      });
    }
  }
  
  // Draconic Resilience
  if (character.features?.includes('Draconic Resilience') && !armor) {
    acOptions.push({
      value: 13 + dexMod,
      source: 'Draconic Resilience',
      allowsShield: true
    });
  }
  
  // Default: no armor
  if (acOptions.length === 0) {
    acOptions.push({
      value: 10 + dexMod,
      source: 'No armor',
      allowsShield: true
    });
  }
  
  // Pick the best AC option
  const bestAC = acOptions.reduce((best, current) => 
    current.value > best.value ? current : best
  );
  
  // Apply shield bonus if allowed and present
  let finalAC = bestAC.value;
  if (hasShield && bestAC.allowsShield) {
    finalAC += 2;
  }
  
  return finalAC;
}

function findArmorInInventory(inventory: string[]): ArmorData | null {
  if (!inventory) return null;
  
  const armorDatabase = {
    'Padded armor': { name: 'Padded', type: 'light', baseAC: 11, maxDex: null },
    'Leather armor': { name: 'Leather', type: 'light', baseAC: 11, maxDex: null },
    'Studded leather armor': { name: 'Studded Leather', type: 'light', baseAC: 12, maxDex: null },
    'Hide armor': { name: 'Hide', type: 'medium', baseAC: 12, maxDex: 2 },
    'Chain shirt': { name: 'Chain Shirt', type: 'medium', baseAC: 13, maxDex: 2 },
    'Scale mail': { name: 'Scale Mail', type: 'medium', baseAC: 14, maxDex: 2 },
    'Breastplate': { name: 'Breastplate', type: 'medium', baseAC: 14, maxDex: 2 },
    'Half plate': { name: 'Half Plate', type: 'medium', baseAC: 15, maxDex: 2 },
    'Ring mail': { name: 'Ring Mail', type: 'heavy', baseAC: 14, maxDex: 0 },
    'Chain mail': { name: 'Chain Mail', type: 'heavy', baseAC: 16, maxDex: 0 },
    'Splint armor': { name: 'Splint', type: 'heavy', baseAC: 17, maxDex: 0 },
    'Plate armor': { name: 'Plate', type: 'heavy', baseAC: 18, maxDex: 0 }
  };
  
  for (const item of inventory) {
    const armorKey = Object.keys(armorDatabase).find(key =>
      item.toLowerCase().includes(key.toLowerCase())
    );
    if (armorKey) {
      return armorDatabase[armorKey];
    }
  }
  
  return null;
}

function calculateArmorBasedAC(armor: ArmorData, dexMod: number): number {
  let ac = armor.baseAC;
  
  if (armor.maxDex === null) {
    // Light armor: full DEX
    ac += dexMod;
  } else if (armor.maxDex > 0) {
    // Medium armor: DEX up to cap
    ac += Math.min(dexMod, armor.maxDex);
  }
  // Heavy armor: no DEX added
  
  return ac;
}

interface ArmorData {
  name: string;
  type: 'light' | 'medium' | 'heavy';
  baseAC: number;
  maxDex: number | null; // null = unlimited (light armor)
}
```

---

## Unified System Architecture

### Option 1: Centralized Calculator Service
**Pros:**
- Single source of truth
- Easy to test
- Reusable across the app

**Cons:**
- Need to import class/species data
- More complex file structure

```typescript
// src/lib/calculators/derived-stats.ts
export class DerivedStatsCalculator {
  static calculateHP(character: Character): number { ... }
  static calculateSpeed(character: Character): number { ... }
  static calculateAC(character: Character): number { ... }
}
```

### Option 2: Inline in Character Data Mapper
**Pros:**
- All export logic in one place
- Simpler imports
- Direct access to existing helper functions

**Cons:**
- File gets larger
- Harder to reuse elsewhere in the app

### Option 3: Reactive Store Properties
**Pros:**
- Values automatically update when character changes
- Can display in UI during creation

**Cons:**
- Requires modifying character store
- More complex state management

---

## Recommended Approach

**Use Option 1: Centralized Calculator Service**

### Why?
1. **Separation of Concerns**: Keep PDF mapping separate from stat calculation
2. **Reusability**: Can use these calculations in:
   - Export page preview
   - Character summary cards
   - Real-time stat display during creation
3. **Testability**: Easy to write unit tests
4. **Maintainability**: Clear place to add new modifiers

### Implementation Plan
1. Create `src/lib/calculators/derived-stats.ts`
2. Import class/species data lookup functions
3. Implement HP, Speed, AC calculators with all exceptions
4. Create armor database for AC calculations
5. Update character-data-mapper.ts to use calculators
6. Add unit tests

### File Structure
```
src/lib/calculators/
  ├── derived-stats.ts         # Main calculator functions
  ├── armor-data.ts            # Armor database
  └── derived-stats.test.ts    # Unit tests
```

---

## Edge Cases to Handle

### HP
- ✅ Negative CON modifier (minimum 1 HP)
- ✅ Hill Dwarf bonus
- ⚠️ Future: Tough feat

### Speed
- ✅ Small races (25 ft)
- ✅ Wood Elf (35 ft)
- ✅ Monk Unarmored Movement
- ⚠️ Need to detect armor-wearing
- ⚠️ Future: Barbarian Fast Movement (level 5+)

### AC
- ✅ No armor (10 + DEX)
- ✅ Light/Medium/Heavy armor with DEX caps
- ✅ Shield bonus
- ✅ Barbarian Unarmored Defense (CON)
- ✅ Monk Unarmored Defense (WIS, no shield)
- ✅ Draconic Sorcerer (13 + DEX)
- ⚠️ Need armor detection in inventory
- ⚠️ Multiple AC sources (pick best)
- ⚠️ Future: Magic armor, spells, other bonuses

---

## Testing Strategy

### Test Cases for HP
1. Fighter (d10) with 14 CON → 28 HP
2. Wizard (d6) with 10 CON → 16 HP
3. Barbarian (d12) with 16 CON → 37 HP
4. Hill Dwarf Fighter with 14 CON → 31 HP (28 + 3)
5. Character with negative CON → minimum 1 HP

### Test Cases for Speed
1. Human → 30 ft
2. Hill Dwarf → 25 ft
3. Wood Elf → 35 ft
4. Monk (no armor) → 40 ft (30 + 10)
5. Monk (with armor) → 30 ft (no bonus)

### Test Cases for AC
1. No armor, 14 DEX → 12 AC
2. Leather armor (11), 14 DEX → 13 AC
3. Chain mail (16), 14 DEX → 16 AC (heavy, no DEX)
4. Barbarian, no armor, 14 DEX, 16 CON → 15 AC
5. Monk, no armor, 14 DEX, 16 WIS → 15 AC
6. Leather + Shield, 14 DEX → 15 AC (11 + 2 + 2)
7. Multiple AC options → use highest

---

## Next Steps

1. ✅ Create this design document
2. ⬜ Implement armor database
3. ⬜ Implement derived-stats calculator
4. ⬜ Update character-data-mapper to use calculators
5. ⬜ Test with various character combinations
6. ⬜ Handle edge cases
7. ⬜ Document for future maintainers
