# Debugging 3D Engines - Getting All Three to Work

## 🔍 The Problem

You're seeing the **same visualization** no matter which engine you select. Let's figure out why!

## ✅ Quick Diagnostic Test

### Step 1: Open the Test Page

```bash
# Make sure server is running
cd /home/user/OLS_vector_visualisation
python3 -m http.server 8000
```

Then open: **http://localhost:8000/test-3d-engines.html**

### Step 2: Check Library Status

At the top of the test page, you'll see:

```
Library Status:
Three.js: [✓ Loaded] or [✗ Not Loaded]
Plotly.js: [✓ Loaded] or [✗ Not Loaded]
```

### Step 3: Click Each Test Button

- Click "**Test Three.js**" - Should show two vectors
- Click "**Test Plotly.js**" - Should show two vectors (different style)
- Click "**Test Canvas**" - Should show two vectors (simpler style)

### Step 4: Open Browser Console

Press **F12** → Click **Console** tab

You should see messages like:
```
Three.js version: 128
Plotly.js loaded
Creating Canvas visualization...
Creating Three.js visualization for threejs-canvas
Creating Plotly.js visualization for plotly-canvas
```

---

## 🐛 Possible Issues & Fixes

### Issue 1: Libraries Not Loading (Most Likely!)

**Symptoms:**
- Test page shows "✗ Not Loaded"
- Console shows: "Three.js not loaded, falling back to canvas"
- All three engines look the same

**Cause:**  Internet connection issue or CDN blocked

**Fix Option A - Check Internet:**
```bash
# Test if CDN is reachable
curl -I https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
```

Should return `200 OK`. If not, internet/firewall issue.

**Fix Option B - Use Local Files:**

1. Download libraries:
```bash
cd /home/user/OLS_vector_visualisation
mkdir lib

# Download Three.js
curl -o lib/three.min.js https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

# Download OrbitControls
curl -o lib/OrbitControls.js https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js

# Download Plotly
curl -o lib/plotly.min.js https://cdn.plot.ly/plotly-2.27.0.min.js
```

2. Edit `index.html` - change lines 580-584 from:
```html
<script src="https://cdnjs.cloudflare.com/.../three.min.js"></script>
<script src="https://cdn.jsdelivr.net/.../OrbitControls.js"></script>
<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
```

To:
```html
<script src="lib/three.min.js"></script>
<script src="lib/OrbitControls.js"></script>
<script src="lib/plotly.min.js"></script>
```

3. Refresh the page

---

### Issue 2: Wrong Engine Is Selected

**Symptoms:**
- Dropdown says "Three.js" but you're getting Canvas
- Console shows: "Creating Canvas visualization"

**Debug:**
1. Open console (F12)
2. Type: `window.VIZ3D_ENGINE`
3. Should show: `"threejs"`, `"plotly"`, or `"canvas"`

**Fix:**
```javascript
// In console, type:
switch3DEngine('threejs');
// Then refresh or toggle 2D/3D
```

---

### Issue 3: Module Not Refreshing After Switch

**Symptoms:**
- Libraries are loaded
- Console shows correct engine
- But visual doesn't change

**Fix:**
After selecting a different engine:
1. Navigate to **Module 0**
2. Click **"3D"** radio button
3. Change one of the vector values slightly
4. Should now see new engine!

Or:
1. Select engine from dropdown
2. Wait for alert
3. Press **arrow key left then right** to navigate away and back

---

### Issue 4: Canvas Element Conflicts

**Symptoms:**
- Plotly.js tries to replace canvas with div
- Errors in console about canvas

**This is expected!** Plotly.js replaces the canvas element with a div. This is normal.

---

## 🔬 Detailed Debugging Steps

### Step 1: Verify Libraries

Open main app: **http://localhost:8000**

Press **F12** → **Console**

Type:
```javascript
typeof THREE     // Should show "object" or "function"
typeof Plotly    // Should show "object"
```

If either shows `"undefined"`, libraries didn't load!

### Step 2: Force Engine Creation

In console:
```javascript
// Force create a Three.js viz
const viz = new Viz3DThreeJS('canvas-0');
viz.drawVector3D([0,0,0], [2,1,1], 0xE69F00, 'test');
```

Watch console for errors.

### Step 3: Check Global Setting

```javascript
window.VIZ3D_ENGINE  // Should show: "threejs", "plotly", or "canvas"
localStorage.getItem('viz3d_engine')  // Saved preference
```

### Step 4: Manual Switch Test

```javascript
// Switch and check
switch3DEngine('plotly');
window.VIZ3D_ENGINE  // Should now be "plotly"

// Refresh current module
App.refreshCurrentModule();
```

---

## 📊 Visual Differences - What to Expect

If engines are working correctly, here's what you should see:

### Three.js
```
✨ Smooth, professional appearance
✨ Proper 3D arrow helpers
✨ Lighting and shadows
✨ Smooth drag-to-rotate with inertia
✨ Axes are rendered as 3D objects
```

### Plotly.js
```
📊 Cone-shaped arrowheads
📊 Interactive toolbar at top-right
📊 Hover shows (x, y, z) coordinates
📊 Clean, minimal aesthetic
📊 Grid with tick marks
```

### Canvas
```
🪶 Simple line vectors with triangular tips
🪶 Flat colors, no lighting
🪶 More basic appearance
🪶 Manual camera controls
🪶 2D-projected rendering
```

---

## 🎯 Specific Test

Try this in **Module 0**:

1. Select **Three.js**
2. Click **3D** radio button
3. Set u = [3, 0, 0] and v = [0, 3, 0]
4. **Expected**: Two smooth arrows, one red (along X), one green (along Y), with nice lighting

5. Select **Plotly.js**
6. Toggle 3D off then on (to force refresh)
7. **Expected**: Two cone-shaped arrows, interactive toolbar appears, hover shows coordinates

8. Select **Canvas**
9. Toggle 3D off then on
10. **Expected**: Two simple line arrows with triangle tips, flat colors

---

## 🚨 If Nothing Works

### Nuclear Option: Hard Reset

```bash
# Clear everything and start fresh
cd /home/user/OLS_vector_visualisation
rm -rf lib  # Remove any local libs if you tried that

# Fresh pull
git pull

# Clear browser cache
# In browser: Ctrl+Shift+Delete → Clear cache
# Or try different browser

# Restart server
pkill -f "python3 -m http.server"
python3 -m http.server 8000

# Open in private/incognito window
# This ensures no cached files interfere
```

---

## 📞 Report Back

After trying the diagnostic test page, tell me:

1. **Library Status**: Are Three.js and Plotly.js showing "✓ Loaded"?

2. **Test Results**: Do the three test buttons show different visuals?

3. **Console Messages**: What does the console say when you click each test?

4. **Main App**: Does the main app dropdown work after testing?

With this info, I can help pinpoint the exact issue!

---

## 💡 Quick Check Commands

```javascript
// Paste in console (F12) for instant diagnosis:

console.log('=== 3D Engine Diagnostic ===');
console.log('Three.js loaded:', typeof THREE !== 'undefined');
console.log('Plotly loaded:', typeof Plotly !== 'undefined');
console.log('Current engine:', window.VIZ3D_ENGINE);
console.log('Saved preference:', localStorage.getItem('viz3d_engine'));

// Try creating each engine
try {
    const viz1 = new Viz3DCanvas('canvas-0');
    console.log('✓ Canvas engine works');
} catch(e) {
    console.error('✗ Canvas failed:', e.message);
}

if (typeof THREE !== 'undefined') {
    try {
        const viz2 = new Viz3DThreeJS('canvas-0');
        console.log('✓ Three.js engine works');
    } catch(e) {
        console.error('✗ Three.js failed:', e.message);
    }
}

if (typeof Plotly !== 'undefined') {
    try {
        const viz3 = new Viz3DPlotly('canvas-0');
        console.log('✓ Plotly engine works');
    } catch(e) {
        console.error('✗ Plotly failed:', e.message);
    }
}
```

Copy the output and share it with me!

---

**Let's get all three engines working for you! 🚀**
