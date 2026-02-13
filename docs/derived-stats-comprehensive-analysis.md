# Comprehensive Derived Stats Analysis (D&D 5e 2014, Level 3)

## Purpose
This document catalogs ALL sources of HP, Speed, and AC modifiers available at level 3 in D&D 5e (2014 rules), not just the ones mentioned by the user.

---

## 1. Hit Points - Complete Analysis

### Base Formula (Level 3)
```
HP = Hit Die Max (level 1) + Hit Die Average (level 2) + Hit Die Average (level 3) + (CON mod × 3)
```

### All Known HP Modifiers at Level 3

#### Species (Racial) Modifiers
1. **Hill Dwarf - Dwarven Toughness**
   - ✅ Implemented in project
   - Effect: +1 HP per level → **+3 HP at level 3**
   - Feature name: "Dwarven Toughness"

#### Class/Subclass Modifiers
- ❌ **NONE at level 3**
- Note: Some subclasses grant temp HP (like Fiend Warlock), but not max HP increases

#### Feat Modifiers (if using feats)
- **Tough Feat**: +2 HP per level → **+6 HP at level 3**
  - ⚠️ Not implemented in project yet
  - ⚠️ Check if project even supports feats at level 3

#### Spells & Magic Items
- **Aid spell** (Level 2 Cleric/Paladin): Temporary +5 max HP for 8 hours
  - ❌ Not relevant for character sheet calculation (temporary effect)
- **Magic items**: Not relevant at level 3 character creation

### Summary: HP Modifiers Needed
At level 3, only TWO permanent modifiers exist:
1. ✅ Hill Dwarf Dwarven Toughness (+3 HP)
2. ⚠️ Tough feat (+6 HP) - need to check if feats are supported

---

## 2. Speed - Complete Analysis

### Base Speed by Species

#### 30 ft (Standard)
- Human (all variants)
- Dragonborn  
- Half-Elf
- Half-Orc
- Tiefling
- High Elf
- Dark Elf (Drow)

#### 35 ft (Wood Elf Special)
- ✅ Wood Elf - "Fleet of Foot" feature
- Only species with non-standard base speed in core rules

#### 25 ft (Small Races)
- All Dwarves (Hill, Mountain)
- All Gnomes (Rock, Forest)
- All Halflings (Lightfoot, Stout)

### All Known Speed Modifiers at Level 3

#### Class Features
1. **Monk - Unarmored Movement** (Level 3)
   - ✅ Found in project: `src/lib/data/classes/monk.ts` line 120-136
   - Effect: +10 ft when not wearing armor or wielding shield
   - Feature name: "Unarmored Movement"
   - Condition: Must not be wearing armor AND not wielding shield

2. **Barbarian - Fast Movement** (Level 5+)
   - ❌ NOT available at level 3
   - Available at level 5: +10 ft when not wearing heavy armor

#### Spells (Temporary)
- **Longstrider** (Level 1): +10 ft for 1 hour
  - ❌ Not relevant (temporary buff, not character sheet stat)
- **Haste** (Level 3): Doubles speed
  - ❌ Not relevant (temporary combat buff)
- **Expeditious Retreat** (Level 1): Bonus action Dash
  - ❌ Not a speed increase, just movement action

#### Magic Items
- Boots of Speed, etc.
  - ❌ Not relevant at level 3 character creation

#### Other Modifiers
- **Encumbrance**: Can reduce speed
  - ❌ Not tracking encumbrance in character builder
- **Exhaustion**: Can reduce speed
  - ❌ Not relevant for character sheet creation

### Summary: Speed Modifiers Needed
At level 3, only ONE class modifier exists:
1. ✅ Monk Unarmored Movement (+10 ft, conditional on no armor/shield)
2. ✅ Wood Elf base 35 ft (already in species data)

**Note**: Need to detect if character is wearing armor for Monk speed calculation!

---

## 3. Armor Class - Complete Analysis

### Standard AC Calculations

#### No Armor
```
AC = 10 + DEX modifier
```

#### Light Armor
- AC = Armor Base + DEX modifier (unlimited)
- Padded (11), Leather (11), Studded Leather (12)

#### Medium Armor  
- AC = Armor Base + DEX modifier (max +2)
- Hide (12), Chain Shirt (13), Scale Mail (14), Breastplate (14), Half Plate (15)

#### Heavy Armor
- AC = Armor Base only (no DEX)
- Ring Mail (14), Chain Mail (16), Splint (17), Plate (18)

#### Shield
- +2 AC (stacks with armor or Unarmored Defense)

### All Known AC Formulas at Level 3

#### Class/Subclass Special AC Formulas

1. **Barbarian - Unarmored Defense** (Level 1)
   - ✅ Found in project
   - Formula: `10 + DEX mod + CON mod`
   - Condition: Not wearing armor
   - Allows shield: YES

2. **Monk - Unarmored Defense** (Level 1)
   - ✅ Found in project  
   - Formula: `10 + DEX mod + WIS mod`
   - Condition: Not wearing armor AND not using shield
   - Allows shield: NO

3. **Draconic Bloodline Sorcerer - Draconic Resilience** (Level 1)
   - ✅ Found in project: `src/lib/data/classes/sorcerer.ts` line 283-310
   - Formula: `13 + DEX mod`
   - Condition: Not wearing armor
   - Allows shield: YES
   - Feature name: "Draconic Resilience"

4. **Bladesinging Wizard - Bladesong** (UA/SCAG, Level 3)
   - ⚠️ Need to check if implemented in project
   - Formula: `AC + INT mod` (while Bladesong active)
   - Condition: Not wearing medium/heavy armor or using shield
   - This is an ACTIVE ability, not passive AC

#### Spells Providing AC (Active/Temporary)

1. **Mage Armor** (Level 1 spell)
   - ✅ Found in project: `src/lib/data/spells.ts`
   - Formula: `13 + DEX mod`
   - Duration: 8 hours
   - Condition: Not wearing armor
   - ⚠️ Decision needed: Should we calculate this for characters who can cast it?

2. **Shield of Faith** (Level 1 Cleric/Paladin)
   - Formula: `AC + 2`
   - Duration: 10 minutes (Concentration)
   - ❌ Not relevant (active combat buff)

3. **Barkskin** (Level 2 Druid/Ranger)
   - Formula: `AC = minimum 16` (regardless of other factors)
   - Duration: 1 hour (Concentration)
   - ❌ Not relevant (active combat buff)

4. **Shield** (Reaction spell)
   - Formula: `AC + 5` until start of next turn
   - ❌ Not relevant (instant reaction)

#### Warlock Invocations

1. **Armor of Shadows** (Level 2+ Warlock)
   - ✅ Found in project: `src/lib/data/classes/warlock.ts`
   - Effect: Cast Mage Armor on self at will (13 + DEX)
   - Available at level 2+
   - ⚠️ This is essentially permanent Mage Armor - should calculate as `13 + DEX`

#### Fighting Styles

1. **Defense Fighting Style** (Fighter, Paladin, Ranger)
   - Effect: +1 AC when wearing armor
   - Condition: Must be wearing armor
   - ⚠️ Need to check if in project

#### Feats (if using)

1. **Moderately Armored** - Allows medium armor + shields
   - ❌ Doesn't change AC calculation, just proficiencies

2. **Heavily Armored** - Allows heavy armor
   - ❌ Doesn't change AC calculation, just proficiencies

3. **Dual Wielder** - +1 AC when dual wielding
   - ⚠️ Conditional bonus, need to check if implemented

### Summary: AC Calculations Needed

#### Base/Equipment AC
1. ✅ No armor: 10 + DEX
2. ✅ Light armor: Base + DEX (unlimited)
3. ✅ Medium armor: Base + DEX (max +2)
4. ✅ Heavy armor: Base only
5. ✅ Shield: +2 bonus

#### Special AC Formulas (Choose Best)
1. ✅ Barbarian Unarmored Defense: 10 + DEX + CON (shields OK)
2. ✅ Monk Unarmored Defense: 10 + DEX + WIS (no shields)
3. ✅ Draconic Sorcerer: 13 + DEX (shields OK)
4. ⚠️ Warlock Armor of Shadows: 13 + DEX (if has invocation)
5. ⚠️ Mage Armor spell: 13 + DEX (if spell is active)

#### Conditional Bonuses
1. ⚠️ Defense Fighting Style: +1 if wearing armor
2. ⚠️ Dual Wielder feat: +1 if dual wielding

---

## Implementation Decisions Needed

### 1. Mage Armor & Armor of Shadows
**Question**: Should we auto-calculate AC assuming these are active?

**Arguments FOR:**
- Armor of Shadows is at-will (effectively permanent)
- Mage Armor lasts 8 hours (covers a full adventuring day)
- Both are common strategies for unarmored casters

**Arguments AGAINST:**
- They're not truly passive features
- Mage Armor requires a spell slot (except Warlock)
- Character might choose NOT to use them

**Recommendation**: 
- ✅ YES for Armor of Shadows (it's at-will, always active)
- ❌ NO for regular Mage Armor spell (it's a limited resource)
- Could add a toggle/note in the future

### 2. Feats at Level 3
**Question**: Does the project support feats?

**Need to check**:
- Search for "feat" or "Tough" in codebase
- Variant Human gets a feat at level 1
- Standard rules allow feat at level 4 (not level 3)
- But some campaigns allow starting feat

**Recommendation**: 
- ⚠️ Search codebase first
- If not implemented, document for future

### 3. Fighting Styles
**Question**: Is Defense fighting style tracked?

**Need to check**:
- Search for "Defense" fighting style in Fighter/Paladin/Ranger
- It's a core level 1/2 feature for martial classes

**Recommendation**:
- ⚠️ Must check if already in class features
- If yes, add +1 to AC when wearing armor

### 4. Monk Speed Detection
**Question**: How do we know if Monk is wearing armor?

**Solution needed**:
- Check inventory for armor items
- List all armor types (light, medium, heavy)
- Boolean check: `isWearingArmor(character.inventory)`

**Same issue for**:
- Monk Unarmored Defense (AC)
- Barbarian Unarmored Defense (AC)
- Draconic Sorcerer Resilience (AC)

### 5. Shield Detection
**Question**: Is character using a shield?

**Solution needed**:
- Check inventory for "shield"
- Boolean check: `hasShield(character.inventory)`

**Affects**:
- Monk Unarmored Defense (disallowed with shield)
- Monk Unarmored Movement (disallowed with shield)
- All AC calculations (+2 if shield present and allowed)

---

## Armor Detection Implementation

### Armor Database (Needed for Detection)
```typescript
const ARMOR_ITEMS = {
  // Light Armor
  'padded armor': { type: 'light', baseAC: 11, maxDex: null },
  'padded': { type: 'light', baseAC: 11, maxDex: null },
  'leather armor': { type: 'light', baseAC: 11, maxDex: null },
  'leather': { type: 'light', baseAC: 11, maxDex: null },
  'studded leather armor': { type: 'light', baseAC: 12, maxDex: null },
  'studded leather': { type: 'light', baseAC: 12, maxDex: null },
  
  // Medium Armor
  'hide armor': { type: 'medium', baseAC: 12, maxDex: 2 },
  'hide': { type: 'medium', baseAC: 12, maxDex: 2 },
  'chain shirt': { type: 'medium', baseAC: 13, maxDex: 2 },
  'scale mail': { type: 'medium', baseAC: 14, maxDex: 2 },
  'breastplate': { type: 'medium', baseAC: 14, maxDex: 2 },
  'half plate': { type: 'medium', baseAC: 15, maxDex: 2 },
  
  // Heavy Armor
  'ring mail': { type: 'heavy', baseAC: 14, maxDex: 0 },
  'chain mail': { type: 'heavy', baseAC: 16, maxDex: 0 },
  'splint armor': { type: 'heavy', baseAC: 17, maxDex: 0 },
  'splint': { type: 'heavy', baseAC: 17, maxDex: 0 },
  'plate armor': { type: 'heavy', baseAC: 18, maxDex: 0 },
  'plate': { type: 'heavy', baseAC: 18, maxDex: 0 }
};
```

### Helper Functions Needed
```typescript
function findArmorInInventory(inventory: string[]): ArmorData | null {
  // Search inventory for armor items
  // Return first match with type and AC data
}

function isWearingArmor(inventory: string[]): boolean {
  return findArmorInInventory(inventory) !== null;
}

function hasShield(inventory: string[]): boolean {
  return inventory?.some(item => 
    item.toLowerCase().includes('shield')
  ) || false;
}
```

---

## Missing From Current Design

After comprehensive analysis, the original design document missed:

### Speed
- ✅ Correctly identified Monk Unarmored Movement
- ✅ Correctly identified Wood Elf 35 ft
- ❌ Did not mention need to check for shield (Monk condition)

### HP
- ✅ Correctly identified Hill Dwarf
- ❌ Did not check if Tough feat is supported

### AC
- ✅ Correctly identified Barbarian Unarmored Defense
- ✅ Correctly identified Monk Unarmored Defense  
- ✅ Correctly identified Draconic Sorcerer
- ✅ Mentioned Mage Armor spell
- ❌ Did not mention Warlock Armor of Shadows invocation (permanent Mage Armor)
- ❌ Did not mention Defense Fighting Style (+1 AC with armor)
- ❌ Did not mention need for shield detection

---

## Next Steps

1. ✅ Search codebase for:
   - "Tough" feat
   - "Defense" fighting style
   - "Armor of Shadows" invocation
   - "Dual Wielder" feat

2. ✅ Implement armor/shield detection helpers

3. ✅ Update design document with findings

4. ✅ Implement HP/Speed/AC calculators in `character-data-mapper.ts`

5. ✅ Test with various character combinations
