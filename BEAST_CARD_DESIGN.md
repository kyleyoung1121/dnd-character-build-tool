# Beast Card Design Documentation

## Current Design (v2 - Compact & Selectable)

### Layout Improvements

#### 1. Header Section
- **Left Side**: Beast name and type/size metadata
- **Right Side**: Challenge Rating (CR) and Speed
  - Eliminates the separate highlighted CR box
  - Utilizes previously empty space
  - Makes CR immediately visible without scrolling

#### 2. Basic Stats
- **Armor Class**: First line
- **Hit Points**: Second line (with formula)
- Stacked vertically for better readability
- No longer side-by-side to reduce visual clutter

#### 3. Ability Scores
- **Compact Format**: Score and modifier on same line
  - Example: `12 (+1)` instead of stacked format
- Reduces card height significantly
- All 6 abilities still clearly visible in grid format

#### 4. Section Headers
- **Distinctive Styling**: 
  - Color: Gold (#d4af37)
  - Text Transform: UPPERCASE
  - Letter Spacing: 0.5px
  - Bold with 2px bottom border
- **Purpose**: Clearly distinguish main sections (Proficiencies, Abilities, Actions) from subsection labels (Skills, Senses, etc.)
- **Result**: Easier scanning without taking up more vertical space

#### 5. Selection System
- **Button**: Centered "Select" button at bottom of each card
- **States**:
  - Unselected: White background, brown border
  - Selected: Blue background, white text with checkmark (✓ Selected)
  - Hover: Subtle color changes for feedback
- **Card Border**: Selected cards get blue border and enhanced shadow
- **Maximum**: 3 beasts can be selected
- **Feedback**: Alert when trying to exceed limit

### Visual Design

```
┌─────────────────────────────────────────────────────┐
│ Wolf                              CR: 0.25          │
│ Medium beast                      Speed: 40 ft.     │
├─────────────────────────────────────────────────────┤
│ Armor Class: 13                                     │
│ Hit Points: 11 (2d8 + 2)                           │
├─────────────────────────────────────────────────────┤
│  STR      DEX      CON      INT      WIS      CHA   │
│ 12(+1)   15(+2)   12(+1)   3(-4)   12(+1)   6(-2)  │
├─────────────────────────────────────────────────────┤
│ PROFICIENCIES                                       │
│ Skills: Perception +3, Stealth +4                   │
│ Senses: Passive Perception 13                       │
├─────────────────────────────────────────────────────┤
│ ABILITIES                                           │
│ Keen Hearing and Smell. The wolf has advantage...  │
│ Pack Tactics. The wolf has advantage on attack...  │
├─────────────────────────────────────────────────────┤
│ ACTIONS                                             │
│ Bite. Melee Weapon Attack: +4 to hit, reach 5 ft...│
├─────────────────────────────────────────────────────┤
│                    [ Select ]                       │
└─────────────────────────────────────────────────────┘
```

## Key Features

### Height Optimization
- ✅ Inline ability scores (score + modifier on same line)
- ✅ CR moved to header (no separate box)
- ✅ Speed moved to header
- ✅ AC and HP stacked vertically
- ✅ Compact padding and margins throughout
- ✅ Reduced font sizes (0.85-0.95rem)

**Result**: Cards are ~30-40% shorter than original design

### Scannability
- ✅ Gold uppercase headers for major sections
- ✅ Brown colored subsection labels
- ✅ Clear visual hierarchy
- ✅ Consistent spacing between sections
- ✅ Key info (name, CR, speed) in header

### Selection System
- ✅ Visual feedback (button states, card borders)
- ✅ Selection limit enforcement (max 3)
- ✅ Selection counter in info section
- ✅ Easy deselection (click again to toggle)

## Color Palette

- **Primary Border**: #8b4513 (Saddle Brown)
- **Accent/Headers**: #d4af37 (Goldenrod)
- **Background**: #faf8f5 (Off-white/Parchment)
- **Text**: #5c2e0e (Dark Brown)
- **Selection**: #3b82f6 (Blue)
- **Subsections**: #666 (Gray)

## Technical Implementation

### Component Props
```typescript
export let beast: Beast;                    // Beast data
export let isSelected: boolean = false;     // Selection state
export let onSelect: ((beast: Beast) => void) | undefined; // Callback
```

### Selection Logic (Parent Component)
```javascript
let selectedBeasts = [];
const MAX_SELECTIONS = 3;

function handleBeastSelect(beast) {
	const index = selectedBeasts.findIndex(b => b.name === beast.name);
	if (index >= 0) {
		selectedBeasts = selectedBeasts.filter(b => b.name !== beast.name);
	} else if (selectedBeasts.length < MAX_SELECTIONS) {
		selectedBeasts = [...selectedBeasts, beast];
	} else {
		alert(`You can only select up to ${MAX_SELECTIONS} beasts.`);
	}
}
```

## Future Enhancements

### Not Yet Implemented
- [ ] Persist selections to character store
- [ ] Filter beasts by source (Druid, Ranger, Wizard, Warlock)
- [ ] Filter by Challenge Rating restrictions
- [ ] Filter by size restrictions (Beast Master)
- [ ] Filter by flying/swimming restrictions (Druid)
- [ ] Export selected beasts with character sheet
- [ ] Search/filter functionality
- [ ] Sort options (name, CR, type)

### Potential Improvements
- [ ] Collapse/expand cards to show only header
- [ ] Side-by-side comparison view
- [ ] Quick stats preview on hover
- [ ] Favorite/bookmark system beyond 3 selections
- [ ] Custom notes field per beast

## Design Decisions

### Why HP Below AC?
- Natural reading flow (top to bottom)
- Matches traditional D&D stat block layout
- HP formula can be long, doesn't fit well side-by-side

### Why Gold Headers?
- Stands out from brown subsection labels
- Creates clear visual hierarchy
- Doesn't require more vertical space
- Matches D&D aesthetic (gold accent color)

### Why Uppercase Headers?
- Industry standard for major sections
- Clear visual distinction
- Doesn't increase height (same font size)

### Why Bottom Button vs Checkbox?
- More prominent and clickable
- Clear call-to-action
- Shows selection state with color change
- Better mobile experience

### Why 3 Beast Limit?
- Prevents overwhelming character sheet
- Typical use cases:
  - Druid: 2-3 common wild shape forms
  - Ranger: 1 beast companion
  - Wizard: 1 familiar
  - Warlock: 1 special familiar
- Can be adjusted if needed

## Responsive Considerations
- Max width: 600px for optimal readability
- Flexible grid for ability scores
- Button scales appropriately on mobile
- Touch-friendly selection targets

## Accessibility
- ✅ Semantic HTML structure
- ✅ Clear visual feedback for selection
- ✅ Sufficient color contrast
- ✅ Focus states on button
- ✅ Keyboard navigation support

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox for layout
- No experimental features used
