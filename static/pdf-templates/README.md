# PDF Templates Directory

## Purpose
This directory contains blank PDF templates used for generating character sheets.

## Adding Your Character Sheet Template

1. **Create or obtain a blank D&D 5e character sheet PDF**
   - You can create one in any design tool (Figma, Illustrator, InDesign, etc.)
   - Or use an existing blank sheet
   - Ensure it's US Letter size (8.5" × 11")

2. **Name the file:** `dnd-character-sheet-blank.pdf`

3. **Place it in this directory:** `/static/pdf-templates/`

4. **The system will automatically use it** to generate filled character sheets

## Adjusting Field Positions

The positions where data is placed on the PDF are configured in:
```
/src/lib/pdf/character-sheet-config.ts
```

### Coordinate System
- **Origin**: Bottom-left corner of the page
- **Units**: Points (1 point = 1/72 inch)
- **Page Size**: 612 points wide × 792 points tall
- **X-axis**: Left to right (0 = left edge, 612 = right edge)
- **Y-axis**: Bottom to top (0 = bottom edge, 792 = top edge)

### How to Find Coordinates

1. **Using Adobe Acrobat** (recommended):
   - Open your PDF in Adobe Acrobat
   - Go to Tools → Measure
   - Hover over positions to see coordinates

2. **Using Preview (Mac)**:
   - Open PDF in Preview
   - Tools → Show Inspector → More Info
   - Shows page dimensions and cursor position

3. **Trial and Error**:
   - Generate a test PDF
   - If text is too far right, decrease X
   - If text is too low, increase Y
   - Adjust incrementally (try changes of 10-20 points)

### Quick Adjustment Guide

To move a field:
- **Right**: Increase `x` value
- **Left**: Decrease `x` value  
- **Up**: Increase `y` value
- **Down**: Decrease `y` value

Example:
```typescript
characterName: {
    x: 100,  // ← Increase to move right
    y: 720,  // ← Increase to move up
    fontSize: 14,
    maxWidth: 400
}
```

## Template Requirements

Your blank PDF should have:
- Clear labeled areas for each field
- Sufficient space for text
- Print-friendly design
- Two pages (Page 1: Stats, Page 2: Details)

## File Permissions

Make sure the PDF file has read permissions:
```bash
chmod 644 static/pdf-templates/dnd-character-sheet-blank.pdf
```
