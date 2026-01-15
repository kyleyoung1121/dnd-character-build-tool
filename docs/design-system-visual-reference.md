# Design System - Visual Reference Guide

This guide provides quick visual examples of the design system in action.

---

## Color Palette Swatches

### Primary Colors - Navy/Blue
```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  #2c3e50       │  │  #34495e       │  │  #4a5f7f       │
│  primary-dark  │  │  primary       │  │  primary-light │
│  ███████████   │  │  ███████████   │  │  ███████████   │
└────────────────┘  └────────────────┘  └────────────────┘

┌────────────────┐  ┌────────────────┐
│  #3b82f6       │  │  #60a5fa       │
│  primary-blue  │  │  primary-blue-light │
│  ███████████   │  │  ███████████   │
└────────────────┘  └────────────────┘
```

**Use for:** Headers, navigation, selected states, active tabs

---

### Success Colors - Green
```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  #229954       │  │  #27ae60       │  │  #2ecc71       │  │  #10b981       │
│  success-dark  │  │  success       │  │  success-light │  │  success-bright│
│  ███████████   │  │  ███████████   │  │  ███████████   │  │  ███████████   │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

**Use for:** Confirm buttons, completed states, success feedback

---

### Warning Colors - Red
```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  #dc2626       │  │  #ef4444       │  │  #fef2f2       │
│  warning       │  │  warning-light │  │  warning-bg    │
│  ███████████   │  │  ███████████   │  │  ░░░░░░░░░░░   │
└────────────────┘  └────────────────┘  └────────────────┘
```

**Use for:** Incomplete items, validation errors, delete actions

---

### Neutral Colors - Grays
```
#f8f9fa  #f1f3f4  #e9ecef  #ced4da  #868e96
  50       100      200      300      400
░░░░░░   ░░░░░░   ▒▒▒▒▒▒   ▒▒▒▒▒▒   ▓▓▓▓▓▓

#6c757d  #545b62  #495057  #343a40  #212529
  500      600      700      800      900
▓▓▓▓▓▓   ▓▓▓▓▓▓   ████████ ████████ ████████
```

**Use for:** Backgrounds, text, borders, cancel buttons

---

## Typography Scale Visualization

```
██████ 2XL (2rem / 32px)     - Page Titles
█████ XL (1.5rem / 24px)     - Section Headings, Popup Titles
████ LG (1.25rem / 20px)     - Card Titles, Subheadings
███ MD (1.125rem / 18px)     - Large Body Text
██ BASE (1rem / 16px)        - Body Text, Buttons, UI
█ SM (0.875rem / 14px)       - Captions, Small Text
▌ XS (0.8rem / 12.8px)       - Tiny Text, Code
```

---

## Spacing Scale Visualization

```
━  1  (0.25rem / 4px)   Tiny gaps
━━  2  (0.5rem / 8px)    Small gaps
━━━  3  (0.75rem / 12px)  Medium-small
━━━━  4  (1rem / 16px)     Default unit
━━━━━  5  (1.25rem / 20px)  Comfortable
━━━━━━  6  (1.5rem / 24px)   Section gaps
━━━━━━━━  8  (2rem / 32px)     Large gaps
━━━━━━━━━━  10 (2.5rem / 40px)   Extra large
━━━━━━━━━━━━  12 (3rem / 48px)     Hero spacing
━━━━━━━━━━━━━━━━  16 (4rem / 64px)       Major dividers
```

---

## Border Radius Examples

```
┌─────┐  ┌──────┐  ┌───────┐  ┌────────┐  ╭───────╮  ●
│ SM  │  │  MD  │  │  LG   │  │   XL   │  │ PILL  │  
│ 4px │  │  6px │  │  8px  │  │  12px  │  │ 50px  │  50%
└─────┘  └──────┘  └───────┘  └────────┘  ╰───────╯  
```

---

## Component Examples

### Button States

**Primary Button (Confirm):**
```
┌──────────────────────┐
│   Confirm Selection  │  ← Green gradient (#27ae60 → #2ecc71)
│   ✓                  │    White text, 600 weight
└──────────────────────┘    Hover: darker gradient, lift up 1px
```

**Secondary Button (Cancel):**
```
┌──────────────────────┐
│       Cancel         │  ← Gray (#6c757d)
└──────────────────────┘    White text, normal weight
                            Hover: darker gray (#545b62)
```

---

### Card States

**Feature Card - Default:**
```
╔══════════════════════════╗
║ Feature Name         [+] ║  ← Border: #e9ecef (neutral-200)
║ Description text...      ║    Background: #f9f9f9 (neutral-50)
╚══════════════════════════╝    Padding: 10-12px → var(--spacing-3/4)
```

**Feature Card - Incomplete:**
```
╔══════════════════════════╗
║ Feature Name         [+] ║  ← Border: #dc2626 (warning) RED
║ [Select an option ▼]     ║    Draws attention to incomplete
╚══════════════════════════╝
```

**Feature Card - Complete:**
```
╔══════════════════════════╗
║ Feature Name         [-] ║  ← Border: #3b82f6 (primary-blue) BLUE
║ Selected: Darkvision     ║    Indicates selection complete
╚══════════════════════════╝
```

---

### Enhanced Popup Structure

```
╔════════════════════════════════════════════╗
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║  Navy gradient header
║ ▓▓  Barbarian                         ✕ ▓ ║  (#2c3e50 → #34495e)
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║  White text, 1.5rem, 600 weight
╠════════════════════════════════════════════╣
║                                            ║
║  [IMAGE PLACEHOLDER AREA]                  ║  250px height
║    Professional artwork of                 ║  #f8f9fa background
║    BARBARIAN goes here                     ║  Dashed border
║                                            ║
╠════════════════════════════════════════════╣
║                                            ║
║  Flavor Text in Italics                    ║  Content sections
║  Description and culture information...    ║  24px padding
║                                            ║  24px gaps between sections
╠════════════════════════════════════════════╣
║          [ Cancel ]    [ Confirm ]         ║  Footer
╚════════════════════════════════════════════╝  Gray + Green buttons
   Shadow: 0 10px 30px rgba(0,0,0,0.3)          6px border radius
```

---

### Ability Score Tab Elements

**Recommended Scores Banner:**
```
╔════════════════════════════════════════════╗
║  Recommended for Barbarian:                ║  Gray background
║  ╭─────────────╮ ╭─────────────╮ ╭────────╮ ║  Pill-shaped badges
║  │ Strength    │ │ Constitution│ │ Dex... │ ║  50px border-radius
║  ╰─────────────╯ ╰─────────────╯ ╰────────╯ ║
╚════════════════════════════════════════════╝
```

**Score Assignment:**
```
Strength:     [15 ▼]  +2  →  17  (+3)
                ▲      ▲       ▲    ▲
                │      │       │    └─ Blue modifier text
                │      │       └────── Bold total
                │      └────────────── Bonus display
                └───────────────────── Dropdown with [X] clear button
```

---

## Elevation & Shadow Hierarchy

```
Base Layer (no shadow)
├─ Content backgrounds
└─ Body text

Elevated 1 (shadow-sm: 0 2px 4px rgba(0,0,0,0.1))
├─ Buttons
└─ Input fields

Elevated 2 (shadow-lg: 0 4px 12px rgba(0,0,0,0.15))
├─ Cards
├─ Dropdowns
└─ Info popups

Elevated 3 (shadow-2xl: 0 10px 30px rgba(0,0,0,0.3))
├─ Modals
├─ Enhanced popups
└─ Major overlays
```

---

## Interactive State Patterns

### Hover States
```
Default State  →  Hover State

Button:        →  Darker shade + slight lift (translateY(-1px))
Card:          →  Border color change or subtle shadow increase
Link:          →  Underline or color change
```

### Focus States
```
All interactive elements:
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);  // Blue focus ring
```

### Active/Selected States
```
Tab:           Blue underline or background (#3b82f6)
Option:        Blue border or background tint
Toggle:        Green when on (#27ae60)
```

### Disabled States
```
Opacity: 0.5
Cursor: not-allowed
Remove hover effects
```

---

## Color Usage by Context

### Navigation & Layout
- **Active tab:** `var(--color-primary-blue)` (#3b82f6)
- **Tab background:** `var(--color-neutral-50)` (#f8f9fa)
- **Header background:** Navy gradient or `var(--color-neutral-50)`

### Forms & Inputs
- **Input border:** `var(--color-border)` (#e9ecef)
- **Input focus:** `var(--shadow-primary)` (blue ring)
- **Placeholder text:** `var(--color-neutral-400)` (#868e96)
- **Validation error:** `var(--color-warning)` (#dc2626)

### Feedback & Status
- **Success message:** `var(--color-success-bright)` (#10b981)
- **Error message:** `var(--color-warning)` (#dc2626)
- **Info message:** `var(--color-primary-blue)` (#3b82f6)
- **Conflict indicator:** `var(--color-warning-bg)` (#fef2f2) with red border

### Special Components
- **Beast cards:** Brown accent (#5c2e0e) for borders/headers
- **Gold items:** Gold accent (#d4af37) for special highlights
- **Spell sources:** Purple (#9333ea) or green tints for specific sources

---

## Implementation Checklist

### Step 1: Import Design Tokens
```css
/* In src/app.css */
@import './lib/styles/design-tokens.css';
```

### Step 2: Replace Hardcoded Values (Example)
```css
/* Before */
.button {
  background: #27ae60;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
}

/* After */
.button {
  background: var(--color-success);
  color: white;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}
```

### Step 3: Verify Visual Consistency
- Check each page for color consistency
- Ensure spacing feels rhythmic
- Verify all interactive states work
- Test focus indicators for accessibility

---

## Quick Reference Table

| Need | Token | Value |
|------|-------|-------|
| Main background | `--color-background` | #ffffff |
| Card background | `--color-background-alt` | #f8f9fa |
| Body text | `--color-text-primary` | #212529 |
| Heading text | `--color-text-primary` | #212529 |
| Muted text | `--color-text-muted` | #6c757d |
| Border | `--color-border` | #e9ecef |
| Selected border | `--color-primary-blue` | #3b82f6 |
| Incomplete border | `--color-warning` | #dc2626 |
| Confirm button | `--color-success` | #27ae60 |
| Cancel button | `--color-neutral-500` | #6c757d |
| Default padding | `--spacing-4` | 1rem (16px) |
| Card gap | `--spacing-6` | 1.5rem (24px) |
| Button text | `--font-size-base` | 1rem (16px) |
| Card title | `--font-size-lg` | 1.25rem (20px) |
| Page heading | `--font-size-2xl` | 2rem (32px) |
| Card border-radius | `--radius-md` | 6px |
| Button border-radius | `--radius-sm` | 4px |
| Popup border-radius | `--radius-lg` | 8px |
| Card shadow | `--shadow-lg` | 0 4px 12px rgba(0,0,0,0.15) |
| Popup shadow | `--shadow-2xl` | 0 10px 30px rgba(0,0,0,0.3) |

---

## Before & After Comparison

### Feature Card - Before
```css
.feature-card {
  border: 2px solid #ccc;  /* ← Arbitrary gray */
  border-radius: 6px;
  padding: 10px 12px;  /* ← Inconsistent values */
  background: #f9f9f9;  /* ← One-off color */
  font-weight: bold;  /* ← Generic weight */
}
```

### Feature Card - After
```css
.feature-card {
  border: 2px solid var(--color-border);  /* ← Semantic token */
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);  /* ← Spacing scale */
  background: var(--color-background-alt);  /* ← Semantic token */
  font-weight: var(--font-weight-bold);  /* ← Explicit weight */
}
```

**Benefits:**
- ✅ Easy to update globally (change one token value)
- ✅ Consistent with other components
- ✅ Self-documenting code
- ✅ Smaller CSS bundle (CSS variables)

---

## Conclusion

This design system provides a complete, cohesive visual language for the D&D Character Builder. By consistently applying these tokens, we achieve:

1. **Visual Harmony** - Colors, sizes, and spacing all work together
2. **Maintainability** - Update one token to change everywhere
3. **Accessibility** - High contrast and clear focus states
4. **Developer Experience** - Semantic names make code readable
5. **Performance** - CSS custom properties are efficient

Ready to implement! 🎨✨
