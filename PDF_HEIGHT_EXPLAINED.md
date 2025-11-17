# PDF Preview Height - Why `min-height: 2070px` Doesn't Work 📏

## The Problem You Found

You discovered that `min-height: 2070px` shows both pages perfectly at default zoom. But you're right to question this - it's **arbitrary and won't work consistently** across different computers!

## Why 2070px is Arbitrary

### PDF Dimensions
- **US Letter PDF page**: 612 × 792 **points** (not pixels!)
- **1 point** = 1/72 of an inch
- **Physical size**: 8.5" × 11"

### But Pixels Vary By Screen!

The same PDF renders at different pixel heights depending on:

#### 1. **Screen DPI (Dots Per Inch)**
```
Standard Monitor (96 DPI):
  792 points × (96 DPI / 72 points/inch) = 1056 pixels per page

High-DPI Monitor (144 DPI):
  792 points × (144 DPI / 72 points/inch) = 1584 pixels per page

4K Monitor (192 DPI):
  792 points × (192 DPI / 72 points/inch) = 2112 pixels per page
```

**Your 2070px** likely comes from a 96 DPI monitor showing 2 pages:
- Page 1: ~1035px
- Page 2: ~1035px
- **Total**: ~2070px

#### 2. **Browser Zoom Level**
- User at 110% zoom: PDF renders taller
- User at 90% zoom: PDF renders shorter
- Browser remembers per-site zoom preferences!

#### 3. **Browser PDF Viewer's Default Zoom**
- Chrome might default to "Fit to width"
- Firefox might default to "Automatic"
- Safari has its own rules
- **Each calculates differently!**

#### 4. **Window Width**
If the browser is fitting to width:
- Wider window → Taller PDF (scaled up)
- Narrower window → Shorter PDF (scaled down)

### The Result

**On your monitor**: 2070px shows both pages ✅  
**On user's laptop**: Pages cut off at 1800px ❌  
**On user's 4K monitor**: Huge empty space below at 3000px ❌  
**On user's zoomed browser**: Completely wrong ❌

## The Solution: Viewport Units

Instead of fixed pixels, use **viewport-relative units** that adapt to any screen.

### What We Changed

#### Before (Your Version)
```css
.pdf-preview-container {
    height: calc(100vh - 12rem);
    min-height: 2070px;  /* ← Forces at least 2070px */
    max-width: 800px;
}
```

**Problem**: `min-height: 2070px` overrides the viewport calculation on smaller screens, forcing 2070px even when the viewport is only 900px tall!

#### After (Responsive Version)
```css
.pdf-preview-container {
    /* Use viewport height - works on any monitor */
    height: calc(100vh - 8rem);  /* ← Take up most of viewport */
    min-height: 600px;           /* ← Reasonable minimum */
    max-width: 800px;
}
```

### How This Works

**`100vh`** = 100% of the **viewport height** (browser window height)

**`calc(100vh - 8rem)`** = Full viewport height minus header/padding:
- 100vh = Full browser window height
- -8rem = Subtract space for header, margins (~128px)

**Result**: The PDF viewer takes up almost the entire screen, regardless of:
- Monitor size
- Screen resolution
- Browser zoom
- Window size

### Examples Across Devices

#### Laptop (1366×768 screen)
- Viewport: 768px tall
- Header/padding: 128px
- **PDF viewer**: 640px (768 - 128)
- Shows ~1 page, user scrolls for page 2 ✅

#### Desktop (1920×1080 screen)
- Viewport: 1080px tall
- Header/padding: 128px
- **PDF viewer**: 952px (1080 - 128)
- Shows ~1.5-2 pages ✅

#### 4K Monitor (3840×2160 screen)
- Viewport: 2160px tall
- Header/padding: 128px
- **PDF viewer**: 2032px (2160 - 128)
- Shows 2+ pages comfortably ✅

#### Mobile (375×667 screen)
- Viewport: 667px tall
- Header/padding: 112px
- **PDF viewer**: 555px (667 - 112)
- `min-height: 500px` kicks in
- Shows ~0.5 page, user scrolls ✅

## Why Not Calculate Exact Page Count?

You might think: "Can't we calculate the exact height for 2 pages?"

### Attempt 1: Fixed Calculation
```css
/* DON'T DO THIS */
.pdf-preview-container {
    height: calc(612px * 1.33 * 2);  /* Assuming 96 DPI */
    /* = 1628px for 2 pages */
}
```

**Problems**:
- ❌ Wrong on high-DPI screens
- ❌ Wrong when browser is zoomed
- ❌ Wrong when PDF viewer uses different zoom
- ❌ Doesn't account for different page counts

### Attempt 2: JavaScript Calculation
```javascript
// DON'T DO THIS
const dpi = window.devicePixelRatio * 96;
const pageHeightPx = (792 / 72) * dpi;
const totalHeight = pageHeightPx * pageCount;
```

**Problems**:
- ❌ `devicePixelRatio` doesn't account for browser zoom
- ❌ Browser PDF viewer might ignore our calculation
- ❌ Adds complexity for minimal benefit
- ❌ User can still zoom PDF viewer independently

### The Reality

**You can't control how the browser renders PDF pages!**

The browser's PDF viewer is a separate embedded application. It:
- Has its own zoom controls
- Makes its own scaling decisions
- Doesn't expose its internal calculations
- Can be zoomed by the user at any time

## The Right Approach: Let Users Scroll

### Benefits of Viewport-Based Height

✅ **Works on any monitor**: Adapts to screen size  
✅ **Works at any zoom**: Scales with browser zoom  
✅ **Works with any page count**: 2 pages, 5 pages, 10 pages - user scrolls  
✅ **Simple**: No complex calculations  
✅ **Predictable**: Takes up consistent screen space  
✅ **Accessible**: Users control their own zoom

### The Scrollbar is Your Friend

Users **expect** to scroll for multi-page documents. That's normal behavior:
- Google Docs: Scroll through pages
- PDF readers: Scroll through pages
- Web articles: Scroll through content

**Trying to show all pages without scrolling** is actually:
- ❌ Unusual UX
- ❌ Doesn't work with variable page counts
- ❌ Wastes space on large monitors
- ❌ Breaks on small monitors

## What About Variable Page Counts?

You mentioned: "eventually, we will have 2 pages + some number of spell desc pages"

### With Fixed Height (Your Approach)
```css
min-height: 2070px;  /* Shows 2 pages */
```

**When you add spell pages**:
- 2 pages: Perfect ✅
- 3 pages: Last page cut off ❌
- 5 pages: Need to change to `min-height: 5175px` ❌
- Different characters have different counts: Need dynamic calculation ❌

### With Viewport Height (Our Approach)
```css
height: calc(100vh - 8rem);
min-height: 600px;
```

**When you add spell pages**:
- 2 pages: Shows what fits, scroll for rest ✅
- 3 pages: Shows what fits, scroll for rest ✅
- 5 pages: Shows what fits, scroll for rest ✅
- 100 pages: Shows what fits, scroll for rest ✅

**No code changes needed!**

## Advanced: If You Really Want Fixed Height

If you absolutely must calculate height dynamically, here's the approach:

### Option 1: Svelte Reactive Calculation
```svelte
<script lang="ts">
    // Assuming standard 96 DPI and 'Fit to Width' zoom
    $: pageCount = 2 + spellPages.length;
    $: estimatedHeight = Math.ceil(1035 * pageCount); // ~1035px per page
</script>

<div class="pdf-preview-container" style="min-height: {estimatedHeight}px">
    <iframe src={pdfUrl} ... />
</div>
```

**Pros**:
- ✅ Adapts to page count

**Cons**:
- ⚠️ Still assumes 96 DPI
- ⚠️ Still assumes default zoom
- ⚠️ Breaks on different monitors
- ⚠️ More complex code

### Option 2: Measure After Load
```svelte
<script lang="ts">
    let iframeElement: HTMLIFrameElement;
    let containerHeight = 'calc(100vh - 8rem)';

    function adjustHeight() {
        try {
            // Try to measure PDF content (usually blocked by CORS)
            const pdfDoc = iframeElement.contentDocument;
            const scrollHeight = pdfDoc?.body.scrollHeight;
            if (scrollHeight) {
                containerHeight = `${scrollHeight}px`;
            }
        } catch (e) {
            // Blocked by browser security - fall back to viewport height
            console.log('Cannot measure PDF height, using viewport height');
        }
    }
</script>

<iframe bind:this={iframeElement} on:load={adjustHeight} ... />
```

**Pros**:
- ✅ Would be accurate if it worked

**Cons**:
- ❌ **Blocked by browser security!** Can't access iframe content
- ❌ PDFs are cross-origin, CORS prevents measurement
- ❌ Fallback is same as viewport approach anyway

## Recommendation: Keep It Simple

**Use viewport-based height** (what we just implemented):

```css
.pdf-preview-container {
    height: calc(100vh - 8rem);
    min-height: 600px;
}
```

**Why this is best**:
1. ✅ Works on any monitor/resolution
2. ✅ Works with any page count
3. ✅ Adapts to browser zoom
4. ✅ Simple, maintainable code
5. ✅ Standard UX (users expect to scroll)
6. ✅ No arbitrary magic numbers

**The scrollbar gives users control** - they can navigate pages at their own pace, which is exactly what PDF viewers are designed for!

## Testing Across Devices

To verify this works everywhere:

### Desktop
1. Open on 1920×1080 monitor → Should show 1-2 pages ✅
2. Resize browser window → Height adapts ✅
3. Zoom browser (Ctrl/Cmd +) → PDF scales, container adapts ✅

### Laptop
1. Open on 1366×768 screen → Should show ~1 page ✅
2. Still scrollable to see all pages ✅

### Mobile
1. Open on phone → Shows reasonable amount ✅
2. `min-height: 500px` prevents too small ✅

### 4K Monitor
1. Open on 3840×2160 screen → Shows 2+ pages comfortably ✅
2. No wasted space ✅

## Summary

| Approach | Works on all monitors? | Works with any page count? | Simple? |
|----------|----------------------|---------------------------|---------|
| `min-height: 2070px` | ❌ No | ❌ No | ✅ Yes |
| `height: calc(100vh - 8rem)` | ✅ Yes | ✅ Yes | ✅ Yes |

**Your instinct was 100% correct** - fixed pixel heights don't work across different environments. Viewport-based heights are the professional, responsive solution! 🎯
