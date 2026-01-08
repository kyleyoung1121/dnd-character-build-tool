# PDF Display Limitations - Browser Behavior 📄

## Current Situation

You're seeing two scroll boxes, each starting at page 1/2 and 2/2 respectively, but both allow scrolling through the entire PDF. This is unfortunately a **browser limitation** when displaying PDFs directly.

## Why This Happens

### Browser PDF Viewers
When you embed a PDF in a web page using `<iframe>`, `<object>`, or `<embed>`, modern browsers use their built-in PDF viewer. This viewer:

1. **Shows the full PDF** - Even with `#page=N` in the URL, it just *starts* at that page
2. **Allows scrolling** - The viewer has its own scrollbars and navigation
3. **Has controls** - Zoom, download, print buttons (browser-dependent)
4. **Can't be fully restricted** - These are security/UX features browsers enforce

### URL Fragments Don't "Lock" Pages
The `#page=2` fragment tells the browser "start viewing at page 2", but it doesn't prevent the user from scrolling to see other pages.

## Possible Solutions

### Option 1: Accept Browser Behavior (Current)
**Pros:**
- No additional dependencies
- Works in all browsers
- Native PDF rendering (fast, accurate)
- Users can navigate if they want

**Cons:**
- Users can scroll to see both pages in either viewer
- Not the "two separate sheets" experience you envisioned

### Option 2: Render PDF to Canvas/Images ⭐ Recommended
Convert each PDF page to an image or canvas element for display.

**Pros:**
- Perfect control - show exactly one page per wrapper
- No scrolling, no browser controls
- True "paper on desk" appearance
- Can't navigate away from assigned page

**Cons:**
- Requires pdf.js library (~500KB)
- More complex code
- Slightly slower initial render
- Lower quality on zoom

**Implementation:** I can add this if you'd like!

### Option 3: Single PDF Viewer
Show one iframe with the full PDF and normal scrolling.

**Pros:**
- Simple, clean
- Natural PDF viewing experience
- No confusion about which viewer to use

**Cons:**
- Not the "two sheets laid out" visual you wanted
- Traditional PDF viewer look

### Option 4: Generate Separate PDFs
Create two separate PDF files (one for each page) and display them.

**Pros:**
- Each iframe truly has only one page
- No scrolling possible

**Cons:**
- More complex PDF generation
- Two separate downloads needed
- Unusual UX

## Recommendation: pdf.js Canvas Rendering

I recommend implementing **Option 2** using pdf.js to render each page as a canvas element. This gives you complete control and the exact "paper on desk" look you want.

### What This Would Look Like

```svelte
<script>
  import { PDFDocument } from 'pdf-lib';
  
  let canvasRefs = [];
  
  async function renderPages() {
    // Fetch and load PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Render page 1 to canvas
    const page1Canvas = canvasRefs[0];
    await renderPageToCanvas(pdfDoc, 0, page1Canvas);
    
    // Render page 2 to canvas
    const page2Canvas = canvasRefs[1];
    await renderPageToCanvas(pdfDoc, 1, page2Canvas);
  }
</script>

<canvas bind:this={canvasRefs[0]} class="pdf-page" />
<canvas bind:this={canvasRefs[1]} class="pdf-page" />
```

### Benefits
- ✅ Each canvas shows exactly one page
- ✅ No scrolling possible
- ✅ No browser controls
- ✅ Perfect "paper on desk" appearance
- ✅ Still allows download of full PDF

### Trade-offs
- ⚠️ Adds pdf.js dependency (already have pdf-lib, would need pdf.js too)
- ⚠️ Slightly more complex code
- ⚠️ Renders as images, not native PDF (can't select text in preview)

## Quick Workaround: Style Improvements

If you want to keep the current iframe approach but improve it, I can:

1. **Hide scrollbars** with CSS (may not work in all browsers)
2. **Add overlay instructions** like "Page 1" / "Page 2" labels
3. **Style the wrappers** to look more like paper
4. **Adjust aspect ratio** to show more of the page at once

## Your Choice

What would you prefer?

**A) Implement pdf.js canvas rendering** (best control, true "two sheets")
**B) Keep current approach** with styling improvements
**C) Switch to single scrollable PDF viewer** (simpler)
**D) Something else?

Let me know and I'll implement it!

## Technical Notes

### Why scrolling="no" Doesn't Work
The `scrolling="no"` attribute on iframes only prevents the *iframe container* from scrolling, not the PDF viewer *inside* the iframe. The PDF viewer is a separate application with its own controls.

### Browser Differences
- **Chrome/Edge**: Shows minimal controls, allows scrolling
- **Firefox**: Similar to Chrome, slightly different controls  
- **Safari**: More prominent controls, may show thumbnails
- **Mobile**: Often opens PDFs in native viewers

### Security Sandbox
Browsers intentionally prevent websites from having too much control over PDF viewers for security reasons. This is why we can't just "lock" a page programmatically.

---

**Current Status**: Working, but with browser-imposed limitations on page locking.

**Next Step**: Decide on approach and I'll implement it!
