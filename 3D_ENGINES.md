# 3D Visualization Engines Guide

The OLS Geometric Visualization app now supports **three different 3D rendering engines**, each with its own strengths. You can easily switch between them to find your favorite!

## 🎨 Available Engines

### 1. Three.js (Professional) ⭐ **DEFAULT**

**Best for:** Professional presentations, production use, smooth animations

**Pros:**
- ✅ Professional-quality 3D graphics
- ✅ Smooth interactive orbit controls (drag to rotate, scroll to zoom)
- ✅ Excellent lighting and materials (Phong shading)
- ✅ Crisp rendering with anti-aliasing
- ✅ Dampened rotation (feels natural)
- ✅ Well-established library (industry standard)
- ✅ Great performance even with complex scenes

**Cons:**
- ❌ Requires external library (~600KB from CDN)
- ❌ Slight learning curve if you want to customize

**What You'll See:**
- Vectors render as arrow helpers with proper arrowheads
- Planes are semi-transparent with Phong shading
- Labels appear as textured sprites
- Grid helper shows XY plane
- Axes in red (X), green (Y), blue (Z)
- Smooth drag-to-rotate with inertia
- Mouse wheel zooms smoothly

**Perfect when:**
- Creating presentations or demos
- Want the most polished look
- Need smooth interactions
- Don't mind external dependencies

---

### 2. Plotly.js (Scientific) 📊

**Best for:** Scientific papers, data analysis, technical reports, publications

**Pros:**
- ✅ Designed for scientific visualization
- ✅ Built-in interactive controls and toolbar
- ✅ Hover tooltips show exact coordinates
- ✅ Publication-quality output
- ✅ Download plot directly from toolbar
- ✅ Trace-based system (easy to add/remove elements)
- ✅ Great for showing many data points

**Cons:**
- ❌ Requires external library (~3MB from CDN, but cached)
- ❌ Can be slower for very complex scenes
- ❌ Arrows use cones (different visual style)

**What You'll See:**
- Vectors use cone shapes for arrowheads
- Clean, minimal aesthetic
- Hover shows coordinates in tooltips
- Toolbar with zoom, pan, reset, download options
- Axes with labels and gridlines
- Scatter points with hover info
- Publication-ready appearance

**Perfect when:**
- Creating figures for papers/reports
- Need exact data readouts on hover
- Want built-in export tools
- Prioritize data over aesthetics

---

### 3. Canvas (Lightweight) 🪶

**Best for:** Offline use, minimal dependencies, learning, embedded systems

**Pros:**
- ✅ **Zero external dependencies** - completely self-contained
- ✅ Lightweight (~12KB)
- ✅ Fast startup and rendering
- ✅ Works offline and in restricted environments
- ✅ Simple perspective projection (educational)
- ✅ Low memory footprint
- ✅ No network requests needed

**Cons:**
- ❌ More basic rendering (no lighting/shading)
- ❌ Manual rotation controls (drag/wheel)
- ❌ Simpler appearance
- ❌ Less smooth interactions

**What You'll See:**
- Vectors as 2D-projected lines with triangular arrowheads
- Flat-shaded planes
- Canvas-based text labels
- Grid lines on XY plane
- Simple colored axes
- Manual camera rotation

**Perfect when:**
- Working offline
- Minimal dependencies are important
- Learning how 3D projection works
- Need lightweight solution
- Deploying in restricted environments

---

## 🔄 How to Switch Engines

### Method 1: UI Selector (Easiest)

1. Look at the **header** of the application (top of page)
2. You'll see: **"3D Engine: [Dropdown] ← Choose your 3D visualization engine"**
3. Click the dropdown
4. Select your preferred engine:
   - **Three.js (Professional)** - Default
   - **Plotly.js (Scientific)**
   - **Canvas (Lightweight)**
5. Alert will confirm the change
6. Navigate to a module with 3D content to see it in action

**Your choice is automatically saved!** The app remembers your preference even after you close the browser.

### Method 2: Console Command

Open browser console (F12) and type:

```javascript
switch3DEngine('threejs');   // Switch to Three.js
// or
switch3DEngine('plotly');    // Switch to Plotly.js
// or
switch3DEngine('canvas');    // Switch to Canvas
```

### Method 3: Set Default Programmatically

Before the app loads, you can set:

```javascript
window.VIZ3D_ENGINE = 'plotly';  // Set default engine
```

---

## 🧪 Testing Each Engine

### Quick Test - Module 0 in 3D Mode

1. **Open the app**: http://localhost:8000
2. **Navigate to Module 0** (should be default)
3. **Switch to 3D mode**: Click the "3D" radio button
4. **You should see**: Two vectors (u and v) in 3D space

Now **switch engines** and observe the differences:

#### With Three.js:
- Smooth, professional arrows
- Drag to rotate smoothly
- Scroll wheel to zoom
- Ambient + directional lighting
- Anti-aliased edges

#### With Plotly.js:
- Cone-shaped arrowheads
- Interactive toolbar at top right
- Hover over vectors to see coordinates
- Can download plot from toolbar
- Grid and axes with tick marks

#### With Canvas:
- Simple line vectors with triangle arrowheads
- Drag to rotate (less smooth)
- Scroll to zoom
- Flat colors
- Lightweight feel

### Advanced Test - Module 4 with Projections

1. **Navigate to Module 4**
2. **Switch to 3D mode**
3. **Enter a 3D vector** (e.g., v = [4, 3, 2])
4. **Add second basis vector** (will show in 3D)
5. **Watch the projection visualization**

With **Three.js**: Smoothly rotating plane, beautiful shading
With **Plotly.js**: Interactive plane you can hover over
With **Canvas**: Simple plane visualization

---

## 📊 Feature Comparison

| Feature | Three.js | Plotly.js | Canvas |
|---------|----------|-----------|--------|
| **Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Interactivity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Load Time** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Dependencies** | CDN (600KB) | CDN (3MB) | None (0KB) |
| **Lighting** | Yes | No | No |
| **Tooltips** | No | Yes | No |
| **Toolbar** | No | Yes | No |
| **Offline** | No* | No* | Yes |
| **Smoothness** | Excellent | Good | Fair |
| **Best Use** | Production | Science | Learning |

*Can work offline if libraries are cached

---

## 🎯 Recommendations by Use Case

### For Teaching/Presentations → **Three.js**
- Professional appearance impresses students
- Smooth interactions keep attention
- Easy to demonstrate concepts

### For Research/Papers → **Plotly.js**
- Publication-quality figures
- Hover data helps with analysis
- Export directly from toolbar

### For Offline/Embedded → **Canvas**
- No internet required
- Minimal resources
- Self-contained

### For Learning 3D Graphics → **Canvas**
- See how projection works
- Simple codebase to understand
- No "magic" - all explicit

### For Web Apps/Dashboards → **Three.js**
- Best UX for end users
- Most polished appearance
- Industry standard

---

## 🔧 Technical Details

### Architecture

All three engines implement the **same API**:

```javascript
const viz = new Viz3D('canvas-id');

// Common methods (work with any engine)
viz.drawVector3D(from, to, color, label);
viz.drawPoint3D(x, y, z, color, radius);
viz.drawLine3D(from, to, color, width, dashed);
viz.drawPlane(point, normal, size, color);
viz.drawScatter3D(points, color, radius);
viz.clear();
viz.render();
```

This means you can **switch engines without changing any module code**!

### Library Loading

Libraries are loaded from CDN:
- **Three.js**: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- **OrbitControls**: `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`
- **Plotly.js**: `https://cdn.plot.ly/plotly-2.27.0.min.js`

If a library fails to load, the app **automatically falls back to Canvas**.

### File Structure

```
viz3d.js             # Factory - creates appropriate engine
├── viz3d-threejs.js  # Three.js implementation
├── viz3d-plotly.js   # Plotly.js implementation
└── viz3d-canvas.js   # Canvas implementation
```

---

## 🐛 Troubleshooting

### Engine not loading

**Check console** (F12 → Console tab) for errors like:
- "Three.js not loaded, falling back to canvas"
- "Plotly.js not loaded, falling back to canvas"

**Solution**: Check your internet connection (libraries load from CDN)

### Visualization looks wrong

1. **Clear cache**: Ctrl+Shift+R (hard refresh)
2. **Check engine**: Make sure correct engine is selected
3. **Navigate away and back**: Sometimes helps refresh

### Performance issues

- **With Plotly.js**: Try Three.js instead (faster)
- **With Three.js**: Try Canvas instead (lighter)
- **With Canvas**: Should already be fast!

### Can't switch engines

1. **Check console** for JavaScript errors
2. **Verify localStorage** works (some browsers block it)
3. **Try direct console command**: `switch3DEngine('threejs')`

---

## 💡 Tips & Tricks

### Tip 1: Compare Side-by-Side

1. Open app in two browser windows
2. Set different engines in each
3. Navigate to same module
4. Compare the rendering

### Tip 2: Cache Libraries Offline

Download Three.js and Plotly.js locally to work offline:

```html
<!-- Instead of CDN links, use local files -->
<script src="lib/three.min.js"></script>
<script src="lib/plotly.min.js"></script>
```

### Tip 3: Keyboard Shortcuts

After selecting engine, use:
- **Module 0** then **3D mode**: Quickest way to test
- **Ctrl+H**: Show help (includes engine info)

### Tip 4: Performance Profiling

In Chrome DevTools (F12):
1. Go to Performance tab
2. Record a session
3. Rotate 3D view
4. See which engine uses less CPU/memory

---

## 📚 Learn More

### Three.js Resources
- Official site: https://threejs.org/
- Examples: https://threejs.org/examples/
- Docs: https://threejs.org/docs/

### Plotly.js Resources
- Official site: https://plotly.com/javascript/
- 3D docs: https://plotly.com/javascript/3d-charts/
- Examples: https://plotly.com/javascript/3d-scatter-plots/

### Canvas 2D API
- MDN Docs: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- 3D projection math: https://en.wikipedia.org/wiki/3D_projection

---

## 🎉 Summary

**You now have THREE professional 3D visualization options!**

- **Three.js**: Best overall, most polished
- **Plotly.js**: Best for science, has hover data
- **Canvas**: Best for offline, lightweight

**Try them all and pick your favorite!**

The dropdown is in the header at the top of the page. Your choice persists across sessions.

Happy visualizing! 🚀📊

---

*Last updated: 2025-11-05*
