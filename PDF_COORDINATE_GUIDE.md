# PDF Coordinate System Guide 📐

## Understanding PDF Coordinates

### Coordinate System Basics

PDF coordinates use a **Cartesian coordinate system** with the origin at the **bottom-left corner** of the page:

```
(0, 792) ────────────────────── (612, 792)  ← Top of page
    │                                │
    │                                │
    │        PDF Content             │
    │                                │
    │                                │
(0, 0) ──────────────────────── (612, 0)    ← Bottom of page
 ↑                                   ↑
Left edge                        Right edge
```

### Page Dimensions
- **Width**: 612 points (8.5 inches)
- **Height**: 792 points (11 inches)
- **Units**: Points (1 point = 1/72 inch)

### Movement Rules
To move a field:
- **Right**: Increase `x` value
- **Left**: Decrease `x` value
- **Up**: Increase `y` value
- **Down**: Decrease `y` value

## Field Configuration Structure

### Simple Field Example
```typescript
characterName: {
    x: 100,          // 100 points from left edge
    y: 720,          // 720 points from bottom (72 from top)
    fontSize: 14,    // 14 point font
    maxWidth: 400    // Maximum 400 points wide
} as FieldConfig
```

### Text Area Example
```typescript
featuresAndTraits: {
    x: 580,          // Starting X position
    y: 100,          // Starting Y position (bottom of text area)
    width: 200,      // 200 points wide
    height: 380,     // 380 points tall
    fontSize: 8,     // 8 point font
    lineHeight: 10   // 10 points between lines
} as TextAreaConfig
```

## Common Adjustments

### Moving Character Name Down 20 Points
```typescript
// Before
characterName: { x: 100, y: 720, fontSize: 14, maxWidth: 400 }

// After (moved down)
characterName: { x: 100, y: 700, fontSize: 14, maxWidth: 400 }
```

### Moving Ability Scores to the Right
```typescript
// Before
strength: {
    score: { x: 60, y: 600, fontSize: 12, align: 'center' },
    modifier: { x: 60, y: 625, fontSize: 16, align: 'center' }
}

// After (moved 20 points right)
strength: {
    score: { x: 80, y: 600, fontSize: 12, align: 'center' },
    modifier: { x: 80, y: 625, fontSize: 16, align: 'center' }
}
```

### Adjusting Font Size
```typescript
// Before (too small)
characterName: { x: 100, y: 720, fontSize: 10, maxWidth: 400 }

// After (larger, more readable)
characterName: { x: 100, y: 720, fontSize: 16, maxWidth: 400 }
```

## Field Alignment

### Left Alignment (Default)
```typescript
{ x: 100, y: 500, fontSize: 10, align: 'left' }
// Text starts at x=100
```

### Center Alignment
```typescript
{ x: 300, y: 500, fontSize: 10, align: 'center' }
// Text is centered around x=300
```

### Right Alignment
```typescript
{ x: 500, y: 500, fontSize: 10, align: 'right' }
// Text ends at x=500
```

## Coordinate Calculation Tips

### Convert Inches to Points
```
Points = Inches × 72
```

Examples:
- 1 inch = 72 points
- 0.5 inches = 36 points
- 2 inches = 144 points

### Calculate from Top Edge
Since coordinates are from bottom, to position something from the top:
```
Y = 792 - distance_from_top_in_points
```

Example: 1 inch from top
```
Y = 792 - 72 = 720 points
```

### Calculate from Right Edge
To position something from the right edge:
```
X = 612 - distance_from_right_in_points
```

Example: 1 inch from right
```
X = 612 - 72 = 540 points
```

## Finding the Right Coordinates

### Method 1: Using Adobe Acrobat (Best)
1. Open the blank PDF in Adobe Acrobat
2. Tools → Measure
3. Hover over desired position
4. Note the coordinates shown

### Method 2: Trial and Error
1. Make an educated guess
2. Generate the PDF
3. Check if text appears in the right place
4. Adjust by increments of 10-20 points
5. Repeat until perfect

### Method 3: Grid Overlay
Create a test version that draws a grid:
```typescript
// Add grid lines every 50 points (for debugging)
for (let x = 0; x <= 612; x += 50) {
    page.drawLine({ start: { x, y: 0 }, end: { x, y: 792 }, thickness: 0.5 });
}
for (let y = 0; y <= 792; y += 50) {
    page.drawLine({ start: { x: 0, y }, end: { x: 612, y }, thickness: 0.5 });
}
```

## Common Coordinate Ranges

### Page 1 Sections

**Header Area** (Top 100 points)
- Character Name: y = 700-720
- Class/Background/Species: y = 665-690

**Left Column** (Ability Scores & Skills)
- X range: 50-150
- Y range: 0-650

**Middle Column** (Combat Stats)
- X range: 250-450
- Y range: 300-650

**Right Column** (Features & Proficiencies)
- X range: 550-600
- Y range: 100-700

### Page 2 Sections

**Character Details** (Top section)
- Y range: 650-720

**Backstory** (Middle section)
- Y range: 400-650

**Additional Features** (Lower section)
- Y range: 50-400

## Text Area Behavior

Text areas have special behavior:
- Text starts at `y + height` (top of box)
- Flows downward
- Wraps at `width`
- Stops at `y` (bottom of box)

Example:
```typescript
{
    x: 100,     // Left edge
    y: 200,     // Bottom edge of text area
    width: 400, // Text wraps at 400 points wide
    height: 300 // Text area is 300 points tall
}
// Text will appear from y=500 (top) down to y=200 (bottom)
```

## Quick Reference Card

| Action | Adjustment |
|--------|------------|
| Move right | `x += n` |
| Move left | `x -= n` |
| Move up | `y += n` |
| Move down | `y -= n` |
| Make bigger | `fontSize += n` |
| Make smaller | `fontSize -= n` |
| Wider text area | `width += n` |
| Taller text area | `height += n` |

## Debugging Tips

### Text Not Appearing?
- Check if coordinates are within page bounds (0-612 for x, 0-792 for y)
- Verify fontSize is reasonable (6-20 typically)
- Ensure text color is not white on white background
- Check if text is being clipped by maxWidth

### Text in Wrong Position?
- Remember: origin is bottom-left, not top-left
- Double-check if you need to subtract from 792 for top-relative positioning
- Verify alignment setting ('left', 'center', 'right')

### Text Overlapping?
- Increase/decrease Y values to separate vertically
- Adjust lineHeight in text areas for more spacing
- Check adjacent field positions

### Text Too Small/Large?
- Adjust fontSize property
- Consider the target audience (10-12pt is typical for body text)
- Headers should be 14-18pt

## Best Practices

1. **Use Consistent Spacing**: Keep consistent gaps between fields (e.g., 15-20 points)
2. **Test with Real Data**: Use actual character names and values to test
3. **Consider Long Text**: Test with long character names, equipment lists, etc.
4. **Align Related Fields**: Keep fields in visual columns aligned
5. **Leave Margins**: Keep text at least 30-50 points from page edges
6. **Document Changes**: Comment your coordinate adjustments in the code

## Example: Repositioning the Header

Original position:
```typescript
characterName: { x: 100, y: 720, fontSize: 14, maxWidth: 400 },
classAndLevel: { x: 100, y: 690, fontSize: 10, maxWidth: 150 }
```

Moved down 30 points with larger spacing:
```typescript
characterName: { x: 100, y: 690, fontSize: 14, maxWidth: 400 },
classAndLevel: { x: 100, y: 650, fontSize: 10, maxWidth: 150 }
```

Centered horizontally on page:
```typescript
characterName: { x: 306, y: 690, fontSize: 14, align: 'center' }, // 612/2 = 306
classAndLevel: { x: 306, y: 650, fontSize: 10, align: 'center' }
```

---

**Remember**: The coordinate system is your friend! Take time to understand it, and adjustments will become intuitive. 🎯
