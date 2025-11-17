# Quick Start Guide - PDF Character Sheet Export 🎲

## How to Use the PDF Export Feature

### Step 1: Create Your Character
Navigate through the character creation tabs and build your level 3 D&D character:
- **Species** - Choose your race (Human, Elf, Dwarf, etc.)
- **Class** - Pick your class and subclass
- **Abilities** - Set your ability scores
- **Background** - Select your character's background
- **Equipment** - Choose your starting gear
- **Spells** (if applicable) - Select your spells
- **Beasts/Familiars** (if applicable) - Choose companions

### Step 2: Navigate to Export Tab
Click on the **Export** tab in the navigation menu.

### Step 3: View Your Character Sheet
You'll see a beautiful preview of your character sheet rendered on the official D&D template with all your data filled in!

### Step 4: Export Your Character
Click the floating **"📥 Export Character"** button in the bottom-right corner.

### Step 5: Choose an Action
A dialog will appear with three options:
- **💾 Download PDF** - Save the PDF to your computer
- **🖨️ Print** - Send directly to your printer
- **📤 Share with E&D Team** - (Coming soon!)

## What Gets Exported?

Your character sheet includes:

### Page 1:
- Character name, class & level, background, species
- All 6 ability scores with modifiers
- Saving throw bonuses
- All skill bonuses
- Armor Class, Initiative, Speed
- Hit Points and Hit Dice
- Proficiency bonus
- Attack list with bonuses and damage
- Equipment list
- Proficiencies and languages
- Features and traits

### Page 2:
- Character appearance details (age, height, weight, etc.)
- Personality traits, ideals, bonds, and flaws
- Additional features
- Treasure and notes

## Tips & Tricks

### Updating Your Character
The PDF preview **automatically updates** whenever you make changes to your character in any of the creation tabs. Just navigate back to the Export tab to see the updated preview!

### Coordinate Adjustments
If text isn't appearing in the right place on the PDF template, you can adjust the coordinates in:
```
/src/lib/pdf/character-sheet-config.ts
```

See the README in `/static/pdf-templates/` for guidance on adjusting field positions.

### Custom PDF Templates
Want to use a different character sheet design? Just replace:
```
/static/pdf-templates/dnd-character-sheet-blank.pdf
```
with your own template, then adjust the coordinates to match.

## Troubleshooting

### "Failed to generate PDF preview"
- Make sure the blank PDF template exists at `/static/pdf-templates/dnd-character-sheet-blank.pdf`
- Check the browser console for specific error messages
- Try refreshing the page

### Text appears in wrong position
- Adjust the coordinates in `character-sheet-config.ts`
- Remember: coordinates start from bottom-left corner
- Increase X to move right, increase Y to move up

### PDF won't download
- Check if your browser is blocking downloads
- Try a different browser
- Check that you have write permissions in your downloads folder

## Browser Compatibility

The PDF feature works best in modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Some older browsers may have limited support

## Need Help?

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Review the detailed implementation docs in `PDF_FEATURE_IMPLEMENTATION.md`
3. Make sure all dependencies are installed (`npm install`)
4. Ensure the development server is running (`npm run dev`)

## What's Next?

Future features we're planning:
- Character appearance customization
- Backstory and personality trait fields
- Spell list formatting on page 2
- Multiple character sheet template options
- Cloud save and sharing
- Character portrait upload

---

**Enjoy creating your D&D characters! 🐉⚔️🎭**
