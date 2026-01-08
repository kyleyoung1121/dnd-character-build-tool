# AI Development Instructions

This file contains project-specific conventions and instructions for AI assistants working on this codebase.

---

## Documentation Conventions

### Living Documentation
- **Primary Document:** `/docs/ARCHITECTURE.md`
- **Rule:** ALWAYS update the living architecture document instead of creating new markdown files
- **Process:**
  1. Make your code changes
  2. Update `/docs/ARCHITECTURE.md` if architectural changes were made
  3. Add entry with today's date in relevant section
  4. Never create standalone summary/guide markdown files

### Archive Policy
- Historical documentation lives in `/docs/archive/`
- Format: `YYYY-MM-DD-description.md`
- Archive files are for reference only - they may be outdated
- When context about past decisions is needed, check archive with awareness of dates

### When to Create New Docs
Only create new dated documentation in these cases:
- **Major Feature Implementation:** New system that changes architecture significantly
- **Migration Guides:** When updating dependencies or patterns project-wide
- **Incident Reports:** Critical bugs or data loss events
- Always date these files: `docs/YYYY-MM-DD-topic.md`

---

## Project-Specific Conventions

### Provenance Tracking
This project uses a sophisticated provenance system to track character changes. Key rules:

1. **Always include parentIndex for nested features**
   - Warlock invocations require: `feature:ParentName:ParentIndex:FeatureName:index`
   - Never use partial keys like `feature:ParentName:FeatureName:index` for deeply nested features

2. **Scope ID Format:**
   - Class: `class:ClassName`
   - Feature: `feature:FeatureName:index` (simple)
   - Nested Feature: `feature:ParentName:ParentIndex:FeatureName:index` (4+ levels deep)
   - Species traits: `{species_id}.{trait_id}`
   - Background: `background:BackgroundName`

3. **When debugging persistence issues:**
   - First check provenance key format in save vs restore
   - Use browser console: `$character._provenance`
   - Verify `getProvenanceEntry()` tries all expected key formats

### File Handling Quirks

1. **Tab Characters:**
   - Some files (e.g., `src/routes/(creation)/class/+page.svelte`) use actual tab characters
   - `multi_edit` may fail due to whitespace mismatches
   - Use `sed` commands for surgical edits in these files
   - Check with `cat -A filename` to see actual characters

2. **Class Data Files:**
   - Always use lowercase: `barbarian.ts`, `warlock.ts`
   - Feature IDs: `{class}_{feature_name}_{variant}`
   - Keep consistent indentation (tabs in most class files)

### Git Workflow (Non-Standard)

This project uses a custom workflow due to environment constraints:

1. Make changes in Clacky environment
2. **Commit locally in Clacky BEFORE copying files**
3. Run `git status` to see all modified files
4. Copy each file to user's local PC
5. User pushes from local PC
6. Fetch origin in Clacky
7. **Compare before reset:** `git diff HEAD origin/main --stat`
8. Only reset hard when diff looks correct

**Important:** The user may make direct edits in the Clacky environment without prompting you. Always commit working changes before comparing with origin.

### Testing Requirements

Before marking any character creation feature as complete:

1. **End-to-End Test:**
   - Create a character using the modified feature
   - Navigate to other tabs and back
   - Verify selections persist
   - Check conflict detection works correctly

2. **PDF Export Test:**
   - Export character to PDF
   - Verify all features appear correctly
   - Check text formatting and overflow

3. **Console Check:**
   - Open browser console
   - Check for TypeScript errors
   - Verify `_provenance` structure looks correct

### Conflict Detection

When modifying the character store or feature system:

1. Always consider conflict implications
2. Test with overlapping selections (e.g., same skill from class + species)
3. Verify tab highlighting updates correctly
4. Check that both user-changeable and automatic grants are handled

---

## Code Style

### TypeScript
- Use explicit types, avoid `any` when possible
- Prefer interfaces for data structures
- Use `Partial<Character>` for provenance entries

### Svelte
- Use Svelte 5 syntax (`$state`, `$derived`, `$effect`)
- Keep components focused and reusable
- Use stores for global state only

### CSS
- Tailwind utility classes preferred
- Custom CSS only when necessary
- Keep responsive design in mind (mobile/desktop)

---

## Common Tasks

### Adding a New Class Feature
1. Open class file in `src/lib/data/classes/`
2. Add `FeaturePrompt` with proper effects
3. Test character creation flow
4. Update `/docs/ARCHITECTURE.md` if pattern is new
5. Export to PDF to verify display

### Fixing Provenance Issues
1. Identify the scope ID format being saved
2. Check restoration logic in component's `onMount`
3. Verify `getProvenanceEntry()` tries the correct key format
4. Add debug logging to trace key lookups
5. Test persistence by navigating away and back

### Adding Computed Descriptions
1. Use `computed-inline` type
2. Define hints with `afterText` matching the description text
3. Specify source: `abilityMod`, `proficiencyBonus`, etc.
4. Test that values update reactively

---

## Integration Notes

### PDF Generation
- Template: `static/pdf-templates/dnd-character-sheet-blank.pdf`
- Coordinates defined in `character-sheet-config.ts`
- Multi-line text requires careful y-coordinate calculation
- Test PDF export after any character store changes

### Conflict System
- Reactive via Svelte stores
- Automatically updates on character changes
- Tabs highlight when conflicts detected
- Feature cards show warning/lock icons

---

## Resources

- **D&D 5e SRD:** https://dnd.wizards.com/resources/systems-reference-document
- **Open5e:** https://open5e.com/ (searchable rules)
- **Project Repo:** https://github.com/kyleyoung1121/dnd-character-build-tool

---

## Questions or Issues?

If you encounter something not covered here:
1. Check `/docs/ARCHITECTURE.md` for current system design
2. Look in `/docs/archive/` for historical context (mind the dates!)
3. Search codebase for similar patterns
4. When in doubt, ask the user for clarification

---

**Remember:** This is a multi-month project with evolving architecture. Documentation is key to maintaining consistency. When making significant changes, update the living docs!
