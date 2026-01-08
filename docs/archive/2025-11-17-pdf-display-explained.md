# PDF Display Technology - Explained 📄

## How We're Displaying PDFs

### The Browser's Built-in PDF Viewer

When you use an `<iframe>` to show a PDF, the browser doesn't actually run our code to display it. Instead, the browser says "I'll handle this!" and uses its **built-in PDF viewer** - essentially a mini PDF reader app embedded in the page.

Think of it like this:
```
Our Website → <iframe src="character.pdf"> → Browser PDF Viewer App
```

Each browser has its own PDF viewer:
- **Chrome/Edge**: Uses Chromium's PDF viewer
- **Firefox**: Uses PDF.js (Mozilla's viewer)
- **Safari**: Uses its own PDF viewer

### That Top Bar (Toolbar)

The toolbar you see with zoom, download, print, etc. is the **browser's PDF viewer interface**, not something we added to our code. The browser automatically adds it to help users interact with PDFs.

## What We Changed

### 1. Increased Preview Height ✅
**Before**: `height: 80vh` (80% of viewport height)
**After**: `height: calc(100vh - 12rem)` (full viewport minus header/padding)

This means the preview now takes up almost the entire screen, showing much more of the page at once!

**Result**: You should see significantly more of each page without scrolling.

### 2. Attempted to Hide Toolbar ⚠️
Added URL parameters: `#toolbar=0&navpanes=0&scrollbar=1`

**What these mean**:
- `toolbar=0` - Asks browser to hide the toolbar
- `navpanes=0` - Asks browser to hide navigation panes/thumbnails  
- `scrollbar=1` - Keeps the scrollbar (so users can scroll pages)

**Reality**: This is **browser-dependent**:
- ✅ Some browsers respect these parameters
- ⚠️ Some browsers ignore them (for security/UX)
- ❌ Some browsers only partially hide elements

**Chrome/Edge**: Usually hides most controls
**Firefox**: Sometimes ignores these parameters
**Safari**: Has its own rules

### 3. Removed Off-white Background ✅
**Before**: `background: #f5f5f5` (off-white)
**After**: `background: white`

The page background is now pure white, making the preview blend seamlessly.

## URL Parameters for PDF Control

These are the parameters browsers *might* respect:

```
#toolbar=0        → Hide toolbar
#navpanes=0       → Hide navigation panel
#scrollbar=0      → Hide scrollbar (we use =1 to keep it)
#page=N           → Start at page N
#zoom=75          → Set zoom level to 75%
#view=Fit         → Fit page to window
#view=FitH        → Fit page width
#pagemode=none    → No extra panels
```

**Important**: These are **suggestions** to the browser, not commands. The browser can ignore them if it wants to (and often does for security reasons).

## Why We Can't Fully Control It

### Browser Security
Browsers intentionally limit control over PDF viewers to:
- Prevent malicious websites from hiding download options
- Ensure users can always zoom/print
- Maintain consistent UX across sites
- Protect user privacy

### The Sandbox
PDFs are displayed in a **security sandbox** - a protected environment where the website can't fully control what happens inside.

## Alternative: If You Want Total Control

If the toolbar is really problematic, we have options:

### Option 1: PDF.js Rendering (Recommended)
Use a JavaScript library to render the PDF ourselves instead of using the browser's viewer.

**Pros**:
- ✅ Total control over appearance
- ✅ No browser toolbar
- ✅ Custom zoom/controls
- ✅ Exactly the look you want

**Cons**:
- ⚠️ Adds ~500KB dependency
- ⚠️ More complex code
- ⚠️ Slightly slower initial render
- ⚠️ You have to build your own zoom/navigation

**I can implement this if you want!**

### Option 2: Convert PDF to Images
Render PDF pages as PNG/JPEG images.

**Pros**:
- ✅ No toolbar at all
- ✅ Perfect pixel control
- ✅ Looks exactly like paper

**Cons**:
- ⚠️ Can't select text
- ⚠️ Larger file sizes
- ⚠️ Quality loss on zoom
- ⚠️ Accessibility issues

### Option 3: Accept Browser Behavior (Current)
Use the browser's viewer as-is, maybe it hides toolbar, maybe not.

**Pros**:
- ✅ Simple implementation
- ✅ No dependencies
- ✅ Fast loading
- ✅ Native PDF quality

**Cons**:
- ⚠️ Toolbar may show (browser-dependent)
- ⚠️ Less control over appearance

## Current Implementation

### What We Have Now
```svelte
<iframe
    src="{pdfUrl}#toolbar=0&navpanes=0&scrollbar=1"
    class="pdf-viewer"
    title="Character sheet"
></iframe>
```

**CSS**:
```css
.pdf-preview-container {
    height: calc(100vh - 12rem);  /* Almost full screen */
    min-height: 600px;             /* Never too small */
}
```

### What Users See

**Best Case** (Chrome with toolbar hidden):
```
┌─────────────────────────────┐
│                             │
│     [PDF Content]           │
│                             │
│     Page 1                  │
│                             │
│     [visible without        │
│      scrolling]             │
│                             │
│     Page 2                  │
│                             │
│     [scroll to see more]    │
│                             │
└─────────────────────────────┘
```

**Worst Case** (Browser shows toolbar):
```
┌─────────────────────────────┐
│ [Filename] 1/2  🔍 ↻ ⬇ 🖨   │ ← Toolbar
├─────────────────────────────┤
│                             │
│     [PDF Content]           │
│                             │
│     Page 1                  │
│                             │
│     [visible without        │
│      scrolling]             │
│                             │
└─────────────────────────────┘
```

## Your Options

### Keep Current (Recommended)
- Height increased - much better viewing
- Toolbar *might* hide (browser-dependent)
- Simple, fast, works everywhere
- **Action needed**: None, it's done!

### Implement PDF.js Rendering
- Guarantee no toolbar ever
- Full control over appearance
- Custom zoom/navigation
- **Action needed**: Let me know and I'll implement it!

### Try More URL Parameters
- Experiment with different parameters
- May or may not work
- Browser-specific results
- **Action needed**: I can try more combinations

## Testing the Toolbar Hiding

To test if the `#toolbar=0` works in your browser:

1. Go to Export tab
2. Look at the PDF preview
3. Check if you see:
   - ✅ No toolbar = Working!
   - ⚠️ Minimal toolbar = Partially working
   - ❌ Full toolbar = Browser ignored it

**Different browsers will show different results!**

## My Recommendation

Given your goals:
1. ✅ **Keep the height increase** - Much better!
2. ⚠️ **Try the toolbar hiding** - Might work, might not
3. 🤔 **If toolbar bugs you** - Let me implement PDF.js rendering

The toolbar hiding is a "free bonus" - if it works in your browser, great! If not, we can do the PDF.js approach for total control.

## What Changed Summary

✅ **Preview height**: Now takes almost full screen
✅ **Background**: Changed to pure white  
⚠️ **Toolbar hiding**: Attempted with URL parameters (browser-dependent)

All changes are live and working now!

---

**Want me to implement PDF.js for guaranteed toolbar-free viewing?** Just let me know! 🎯
