# Quick Start Guide

## ⚡ Get Started in 3 Minutes

### Step 1: Start the Web Server

Open your terminal and navigate to the project directory:

```bash
cd /home/user/OLS_vector_visualisation
```

Then start a web server using **one of these options**:

#### Option A: Python 3 (Recommended)
```bash
python3 -m http.server 8000
```

#### Option B: Python 2
```bash
python -m SimpleHTTPServer 8000
```

#### Option C: Node.js
```bash
npx http-server -p 8000
```

#### Option D: PHP
```bash
php -S localhost:8000
```

You should see output like:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### Step 2: Open in Browser

Open your web browser and go to:

```
http://localhost:8000
```

**You should see:** The OLS Geometric Visualization homepage with a purple gradient background, module navigation buttons, and Module 0 displayed.

### Step 3: Test the Application

#### Test Module 0 (Foundations)
1. You'll see two vector input fields (u and v)
2. Try changing the values:
   - u: [3, 2]
   - v: [1, 4]
3. Watch the output panel update with:
   - Norms: ∥u∥ and ∥v∥
   - Dot product: ⟨u, v⟩
   - Angle θ between vectors
   - Orthogonality check

**Expected Result:** The canvas shows two colored arrows (vectors) emanating from the origin, and the computed properties update instantly.

#### Test Module 5 (OLS Regression)
1. Click "Module 5: OLS (Obs-Space)" in the navigation
2. Click "Use Example Data" button
3. Click "Update Data" button

**Expected Result:**
- Left panel: Shows vectors y, ŷ, and e in observation space
- Right panel: Scatter plot with fitted regression line
- Output shows: β̂, R², RSS/ESS/TSS, and orthogonality check

### Step 4: Run the Test Suite

Open a new browser tab and go to:

```
http://localhost:8000/test.html
```

The test suite will automatically run and you should see:

- ✅ Green checkmarks for passed tests
- Test summary showing:
  - Total: 40+ tests
  - Passed: 40+ (100%)
  - Failed: 0

**If any tests fail**, check the browser console (F12) for detailed error messages.

## 🎮 Interactive Features to Try

### Module 1: Linear Combinations
1. Navigate to Module 1
2. Adjust the α slider (controls coefficient of u)
3. Adjust the β slider (controls coefficient of v)
4. Watch the resulting vector w = αu + βv update in real-time

### Module 3: Matrix Transformations
1. Navigate to Module 3
2. Click "Rotation" preset button
3. See the original unit vectors on the left
4. See the rotated vectors on the right
5. Try other presets: Shear, Scale, Reflection

### Module 8: Diagnostics (Interactive!)
1. Navigate to Module 8
2. Click "Reset" to load default data
3. **Click on the left plot to add new data points**
4. **Drag existing points to move them**
5. Watch leverage and Cook's distance update on the right

## 🔍 What You Should See

### Overall Layout
- **Header**: Title and subtitle in blue
- **Navigation**: 10 module buttons (0-9) in a horizontal row
- **Main Content**: Current module with theory section and interactive section
- **Footer**: References and export controls

### Visualizations
- **2D Plots**: Canvas with axes, grid, colored vectors/points
- **3D Plots**: Perspective view, drag to rotate, scroll to zoom
- **Live Updates**: All plots update immediately when you change inputs

### Colors (Color-blind Safe)
- **Orange**: Vector u
- **Sky Blue**: Vector v
- **Green**: Resultant vector w
- **Yellow**: Data vector y
- **Dark Blue**: Fitted values ŷ
- **Red-Orange**: Residuals e
- **Purple**: Subspaces and spans

## 📊 Example Workflows

### Workflow 1: Understanding Vector Orthogonality
1. Module 0
2. Set u = [1, 0]
3. Set v = [0, 1]
4. Observe: Orthogonal = YES, θ = 90°, ⟨u,v⟩ = 0

### Workflow 2: Simple Linear Regression
1. Module 5
2. Enter data:
   ```
   1 1 2
   1 2 3
   1 3 3.5
   1 4 5
   1 5 5.5
   ```
3. X columns: 0 1 (intercept and x)
4. Y column: 2
5. Click "Update Data"
6. See: β̂ ≈ [1.3, 0.85], R² ≈ 0.98

### Workflow 3: Comparing Nested Models
1. Module 5: Load data
2. Module 7: Click "Sync from Module 5"
3. Reduced model: 0 (intercept only)
4. Full model: 0 1 (intercept + x)
5. See F-statistic and p-value for test of β₁ = 0

### Workflow 4: Ridge Regression
1. Module 5: Load data
2. Module 9: Click "Sync from Module 5"
3. Select "Ridge Regression" from dropdown
4. Increase λ slider from 0 to 5
5. Watch β̂_ridge shrink toward origin

## 🐛 Troubleshooting

### Problem: Blank page
**Check:**
1. Are you using http://localhost:8000 (not file://)?
2. Is the web server running? (Check terminal)
3. Try refreshing the page (Ctrl+R or Cmd+R)

### Problem: Visualizations not showing
**Check:**
1. Open browser console (F12)
2. Look for JavaScript errors
3. Verify all .js files loaded (check Network tab)

### Problem: "Cannot read property"
**Solution:**
1. Refresh the page
2. Try a different browser
3. Clear browser cache

### Problem: Server port already in use
**Solution:**
```bash
# Use a different port
python3 -m http.server 8001

# Then open http://localhost:8001
```

## ⌨️ Keyboard Shortcuts

Once the app is running:

- **Arrow Left/Right**: Navigate between modules
- **0-9**: Jump to specific module
- **Ctrl+E**: Export current visualization as PNG
- **Ctrl+H**: Show help dialog

## 📱 Mobile/Tablet

The app is responsive and works on mobile devices, but desktop is recommended for:
- Better precision when entering values
- Larger visualizations
- Easier drag interactions in 3D plots

## 🔧 Browser Requirements

**Minimum:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**Required Features:**
- JavaScript ES6+ (arrow functions, classes, etc.)
- Canvas API
- FileReader API (for CSV upload)

## 🎯 Learning Path

1. **Start**: Module 0 (5 minutes)
2. **Build intuition**: Modules 1-4 (15 minutes)
3. **Core content**: Module 5 (10 minutes)
4. **Dual perspective**: Module 6 (5 minutes)
5. **Statistical inference**: Module 7 (10 minutes)
6. **Diagnostics**: Module 8 (5 minutes)
7. **Extensions**: Module 9 (5 minutes)

**Total time for full tour:** ~55 minutes

## 📈 Success Indicators

You'll know it's working correctly when:

1. ✅ **Module 0**: Vectors appear on canvas, angles compute correctly
2. ✅ **Module 2**: Rank deficiency detected for [[1,2],[2,4]]
3. ✅ **Module 5**: R² between 0 and 1, TSS = ESS + RSS
4. ✅ **Module 5**: e ⊥ 𝒞(X) shows YES
5. ✅ **Test Suite**: All tests pass (green checkmarks)

## 🆘 Still Having Issues?

1. **Check server.log** (in project directory):
   ```bash
   cat server.log
   ```

2. **Check browser console** (F12, Console tab):
   - Look for red error messages
   - Note which file/line number

3. **Verify file integrity**:
   ```bash
   ls -lh *.js *.html *.css
   ```
   All files should have non-zero size.

4. **Try the test suite** (http://localhost:8000/test.html):
   - If tests fail, shows which component is broken
   - Check console for detailed error messages

## ✨ Next Steps

Once you have it running:

1. Read the full **README.md** for detailed feature explanations
2. Experiment with **your own data** in Module 5
3. Try the **interactive Module 8** for intuition about leverage
4. Explore **Module 9** for regularization concepts
5. **Export** visualizations for presentations (Ctrl+E)

## 📚 Resources

- **Full Documentation**: `README.md`
- **Test Suite**: `http://localhost:8000/test.html`
- **Example Data**: Click "Use Example Data" buttons throughout

---

**Happy Exploring! 🎉**

If this quick start helped you get running, you're ready to build geometric intuition about OLS regression!
