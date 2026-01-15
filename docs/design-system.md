# Design System Documentation

## Overview

This design system establishes consistent visual patterns across the D&D Character Builder application. It provides a cohesive color palette, typography scale, spacing system, and other design tokens that ensure visual harmony and accessibility.

## Philosophy

Our design system prioritizes:
- **Consistency**: Reusable tokens across all components
- **Accessibility**: High contrast ratios (WCAG AA minimum)
- **Clarity**: Clear visual hierarchy through size, weight, and color
- **Harmony**: Colors that work well together aesthetically

---

## Color Palette

### Color Theory & Rationale

Our palette uses a **split-complementary** color scheme based on navy blue as the primary color:
- **Primary (Navy/Blue)**: Conveys trust, professionalism, and stability
- **Success (Green)**: Natural indicator for positive actions and completion
- **Warning (Red)**: Draws attention to incomplete items or destructive actions
- **Neutrals (Grays)**: Provides visual rest and structure

The palette includes **5 core color families** with multiple shades, plus accent colors for special use cases.

### Primary Colors - Navy/Blue

Used for headers, primary actions, selected states, and navigation.

```css
--color-primary-dark: #2c3e50     /* Dark navy - popup headers */
--color-primary: #34495e          /* Navy - secondary headers */
--color-primary-light: #4a5f7f    /* Lighter navy - hover states */
--color-primary-blue: #3b82f6     /* Bright blue - selected items */
--color-primary-blue-light: #60a5fa /* Light blue - hover */
```

**Usage examples:**
- Enhanced popup headers: `--color-primary-dark` to `--color-primary` gradient
- Active tab indicators: `--color-primary-blue`
- Selected feature cards: `--color-primary-blue` border

### Success Colors - Green

Used for confirm buttons, completed states, and positive feedback.

```css
--color-success-dark: #229954     /* Dark green - hover */
--color-success: #27ae60          /* Medium green - primary */
--color-success-light: #2ecc71    /* Light green - gradients */
--color-success-bright: #10b981   /* Bright emerald - accents */
```

**Usage examples:**
- Confirm buttons: `--color-success` to `--color-success-light` gradient
- Completed feature cards: `--color-primary-blue` border (blue indicates "done")
- Success notifications: `--color-success-bright`

### Warning Colors - Red

Used for incomplete states, validation errors, and destructive actions.

```css
--color-warning: #dc2626          /* Red - incomplete, alerts */
--color-warning-light: #ef4444    /* Light red - hover */
--color-warning-bg: #fef2f2       /* Very light red - backgrounds */
```

**Usage examples:**
- Incomplete feature cards: `--color-warning` border
- Clear/delete buttons: `--color-warning` with red X icon
- Conflict indicators: `--color-warning-bg` background

### Neutral Colors - Grays

Provides structure, backgrounds, text, and borders throughout the interface.

```css
--color-neutral-50: #f8f9fa       /* Lightest gray - backgrounds */
--color-neutral-100: #f1f3f4      /* Very light gray - subtle backgrounds */
--color-neutral-200: #e9ecef      /* Light gray - borders, dividers */
--color-neutral-300: #ced4da      /* Medium-light gray - placeholder borders */
--color-neutral-400: #868e96      /* Medium gray - placeholder text */
--color-neutral-500: #6c757d      /* Gray - secondary text, cancel buttons */
--color-neutral-600: #545b62      /* Dark gray - button hover */
--color-neutral-700: #495057      /* Darker gray - body text */
--color-neutral-800: #343a40      /* Very dark gray - headings */
--color-neutral-900: #212529      /* Almost black - emphasis */
```

**Usage examples:**
- Main backgrounds: `--color-neutral-50` or white
- Body text: `--color-neutral-700`
- Headings: `--color-neutral-800`
- Cancel buttons: `--color-neutral-500`
- Borders: `--color-neutral-200`

### Accent Colors

Special colors for specific contexts and visual interest.

```css
--color-accent-gold: #d4af37      /* Gold - special items */
--color-accent-brown: #5c2e0e     /* Brown - beast cards */
--color-accent-orange: #f59e0b    /* Orange - warnings */
--color-accent-purple: #9333ea    /* Purple - special spell sources */
```

### Semantic Color Shortcuts

Pre-mapped colors for common use cases:

```css
--color-background: #ffffff
--color-background-alt: #f8f9fa
--color-text-primary: #212529
--color-text-secondary: #495057
--color-text-muted: #6c757d
--color-border: #e9ecef
--color-border-dark: #ced4da
```

---

## Typography

### Font Families

```css
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
--font-family-mono: 'Courier New', Courier, monospace
```

We use the **system font stack** for optimal performance and native feel on each platform.

### Font Size Scale

Based on a **1.25 modular scale** for harmonious size relationships:

| Token | Size | Usage |
|-------|------|-------|
| `--font-size-xs` | 0.8rem (12.8px) | Tiny text, code snippets |
| `--font-size-sm` | 0.875rem (14px) | Small text, captions, helper text |
| `--font-size-base` | 1rem (16px) | Body text, buttons, most UI |
| `--font-size-md` | 1.125rem (18px) | Slightly larger body text |
| `--font-size-lg` | 1.25rem (20px) | Subheadings, card titles |
| `--font-size-xl` | 1.5rem (24px) | Section headings, popup titles |
| `--font-size-2xl` | 2rem (32px) | Page titles, hero text |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-normal` | 400 | Regular text |
| `--font-weight-medium` | 500 | Slightly emphasized text |
| `--font-weight-semibold` | 600 | Subheadings, important UI text |
| `--font-weight-bold` | 700 | Headings, very important text |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-tight` | 1.25 | Headings, compact text |
| `--line-height-normal` | 1.5 | Body text, most UI |
| `--line-height-relaxed` | 1.6 | Long-form content, descriptions |

**Typography Examples:**

```css
/* Page heading */
h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

/* Card title */
.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

/* Body text */
p {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
}
```

---

## Spacing Scale

Based on a **4px base unit** for consistent rhythm and alignment:

| Token | Size | Usage |
|-------|------|-------|
| `--spacing-1` | 0.25rem (4px) | Tiny gaps, tight spacing |
| `--spacing-2` | 0.5rem (8px) | Small gaps, compact padding |
| `--spacing-3` | 0.75rem (12px) | Medium-small gaps |
| `--spacing-4` | 1rem (16px) | Default spacing unit |
| `--spacing-5` | 1.25rem (20px) | Comfortable padding |
| `--spacing-6` | 1.5rem (24px) | Larger padding, section gaps |
| `--spacing-8` | 2rem (32px) | Large gaps between sections |
| `--spacing-10` | 2.5rem (40px) | Extra large spacing |
| `--spacing-12` | 3rem (48px) | Hero spacing |
| `--spacing-16` | 4rem (64px) | Major section dividers |

**Example Usage:**

```css
.card {
  padding: var(--spacing-4) var(--spacing-6);
  margin-bottom: var(--spacing-6);
  gap: var(--spacing-3);
}

.button {
  padding: var(--spacing-3) var(--spacing-6);
}
```

---

## Border Radius

| Token | Size | Usage |
|-------|------|-------|
| `--radius-sm` | 4px | Buttons, inputs, small tags |
| `--radius-md` | 6px | Cards, most containers |
| `--radius-lg` | 8px | Popups, modals, major containers |
| `--radius-xl` | 12px | Featured cards, special containers |
| `--radius-pill` | 50px | Pill-shaped elements (ability score pills, badges) |
| `--radius-circle` | 50% | Circular elements (avatars, icon buttons) |

---

## Shadows & Elevation

Shadows create visual hierarchy and depth. Lighter shadows for subtle elevation, stronger for emphasis.

### Standard Shadows

| Token | Shadow | Usage |
|-------|--------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0, 0, 0, 0.05)` | Minimal elevation |
| `--shadow-sm` | `0 2px 4px rgba(0, 0, 0, 0.1)` | Slight elevation |
| `--shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.1)` | Cards, dropdowns |
| `--shadow-lg` | `0 4px 12px rgba(0, 0, 0, 0.15)` | Raised cards, tooltips |
| `--shadow-xl` | `0 8px 20px rgba(0, 0, 0, 0.15)` | Floating elements |
| `--shadow-2xl` | `0 10px 30px rgba(0, 0, 0, 0.3)` | Modals, overlays |

### Colored Shadows

Used for interactive states and visual feedback:

```css
--shadow-primary: 0 0 0 3px var(--color-focus-ring)  /* Focus indicator */
--shadow-success: 0 4px 12px rgba(39, 174, 96, 0.2) /* Success feedback */
--shadow-warning: 0 4px 12px rgba(220, 38, 38, 0.2) /* Warning feedback */
```

---

## Transitions

| Token | Duration | Usage |
|-------|----------|-------|
| `--transition-fast` | 0.15s ease | Quick feedback (hover states) |
| `--transition-base` | 0.2s ease | Standard transitions |
| `--transition-slow` | 0.3s ease | Smooth, noticeable transitions |

---

## Component Patterns

### Buttons

**Primary Button (Success/Confirm):**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--color-success), var(--color-success-light));
  color: white;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-base);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-success-dark), var(--color-success));
  transform: translateY(-1px);
}
```

**Secondary Button (Cancel/Neutral):**
```css
.btn-secondary {
  background: var(--color-neutral-500);
  color: white;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: background var(--transition-base);
}

.btn-secondary:hover {
  background: var(--color-neutral-600);
}
```

### Cards

**Feature Card:**
```css
.feature-card {
  background: var(--color-background-alt);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  margin: var(--spacing-3) 0;
  transition: border-color var(--transition-base);
}

.feature-card.incomplete {
  border-color: var(--color-warning);
}

.feature-card.complete {
  border-color: var(--color-primary-blue);
}
```

### Popups/Modals

**Enhanced Popup:**
```css
.popup-header {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  color: white;
  padding: var(--spacing-5) var(--spacing-6);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.popup-content {
  background: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  max-width: 50vw;
}
```

---

## Accessibility Guidelines

1. **Color Contrast**: All text maintains at least 4.5:1 contrast ratio (WCAG AA)
2. **Focus Indicators**: Use `--shadow-primary` for visible focus states
3. **Interactive States**: Provide clear hover, active, and disabled states
4. **Color Independence**: Never rely on color alone; use icons, text, or patterns

---

## Migration Strategy

### Phase 1: Set Up Infrastructure
1. ✅ Create `src/lib/styles/design-tokens.css`
2. Import in `src/app.css`
3. Test that variables are accessible

### Phase 2: Refactor by Component Type
1. **Enhanced Popup** (reference implementation)
2. **Feature Cards**
3. **Navigation & Layout**
4. **Form Elements (buttons, inputs, selects)**
5. **Page-specific components (abilities, spells, etc.)**

### Phase 3: Testing & Refinement
1. Visual QA across all pages
2. Adjust values based on user feedback
3. Document any exceptions or special cases

---

## Current State Analysis

### Colors Currently in Use

The codebase currently uses **50+ different hex codes** across components. Here are the most common ones:

**Blues:**
- `#3b82f6` (used 15+ times) - should map to `--color-primary-blue`
- `#2c3e50`, `#34495e` - should map to `--color-primary-dark` and `--color-primary`
- `#4a90e2` - close to our `--color-primary-blue`

**Greens:**
- `#27ae60`, `#2ecc71` - already in our success palette
- `#10b981` - emerald, added as `--color-success-bright`

**Reds:**
- `#dc2626`, `#ef4444` - already in our warning palette
- `#fef2f2` - light red background for conflicts

**Grays:**
- `#f8f9fa`, `#e9ecef`, `#6c757d` - very common, now standardized
- Many one-off gray values that should consolidate

### Recommendations

1. **Consolidate similar colors**: Many components use slightly different shades of the same color (e.g., 5 different blues). Use design tokens to unify these.

2. **Replace hardcoded values**: Approximately 200+ inline color values need to be replaced with CSS custom properties.

3. **Standardize typography**: Font sizes currently range from `0.8rem` to `2rem` with many arbitrary values in between. Use the scale provided.

4. **Unify spacing**: Padding and margin values are inconsistent. Adopt the 4px-based spacing scale.

5. **Border radius consistency**: Currently uses 3px, 4px, 6px, 8px, 12px, 24px, 50px, 50%. Standardize to the defined scale.

---

## Examples from Current Codebase

### Enhanced Popup (Already well-structured!)

This component demonstrates good practices and can serve as the reference:

- Navy gradient header: `#2c3e50` to `#34495e`
- Green gradient confirm button: `#27ae60` to `#2ecc71`
- Gray cancel button: `#6c757d`
- Consistent spacing: 20-24px padding
- Border radius: 6px
- Clear typography hierarchy

### Areas Needing Improvement

**Feature Cards:**
- Currently uses hardcoded `#ccc` borders, `#f9f9f9` backgrounds
- Inconsistent padding (10-12px mix)
- Mix of `bold` and numeric font weights

**Abilities Tab:**
- Pills use `50px` border radius (good, matches our `--radius-pill`)
- Gray banner needs consistent color token
- Blue modifiers should use `--color-primary-blue`

**Spells Page:**
- Uses gradients on some spell source tabs (purple, green)
- Hover effects with blue shading - should use `--color-hover-overlay` or `--color-selected-overlay`
- Multiple blue shades that should consolidate

---

## Questions for Discussion

1. **Dark Mode**: Should we plan for dark mode support? (Framework is in place but commented out)

2. **Semantic Colors**: Are the current semantic meanings clear? (blue=selected/done, red=incomplete/delete, green=confirm/success)

3. **Accent Colors**: Do we need more accent colors for different contexts, or should we simplify?

4. **Animation**: Should we add animation/easing tokens beyond the basic transitions?

---

## Conclusion

This design system provides:
- **26 core color tokens** organized into 5 families
- **7 font size tokens** on a modular scale
- **10 spacing tokens** on a 4px grid
- **6 border radius tokens** for various component types
- **9 shadow tokens** for elevation and feedback
- **Clear patterns** for buttons, cards, and popups

By adopting these tokens, we can achieve visual consistency, easier maintenance, and a more polished, professional appearance across the entire D&D Character Builder.
