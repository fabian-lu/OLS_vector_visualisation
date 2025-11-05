# Geometric Linear Algebra for OLS - Interactive Visualization

## 🎯 Overview

An interactive, single-page web application that visually demonstrates the geometric foundations of Ordinary Least Squares (OLS) regression from both **observation-space** and **parameter-space** perspectives. Designed for Master's students in Statistics and Data Science to build geometric intuition about linear regression.

### Key Features

- ✅ **Dual Perspectives**: Observation-space (data space) and parameter-space (coefficient space) visualizations
- ✅ **Interactive & Reactive**: Hot-reload - all visualizations update instantly when you change inputs
- ✅ **2D & 3D Visualizations**: Canvas-based rendering with interactive controls
- ✅ **Complete Coverage**: 10 progressive modules from vector basics to advanced inference
- ✅ **Numerically Stable**: Uses QR decomposition and SVD for robust computations
- ✅ **No Dependencies**: Pure JavaScript implementation with custom linear algebra library
- ✅ **Export Capability**: Save visualizations as PNG and configurations as JSON

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (see options below)

### Running the Application

#### Option 1: Python Simple HTTP Server (Recommended)

```bash
# Navigate to the project directory
cd /home/user/OLS_vector_visualisation

# Python 3
python3 -m http.server 8000

# Python 2 (if Python 3 not available)
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: **http://localhost:8000**

#### Option 2: Node.js HTTP Server

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Run server
http-server -p 8000
```

Then open: **http://localhost:8000**

#### Option 3: PHP Built-in Server

```bash
php -S localhost:8000
```

#### Option 4: VS Code Live Server

If you're using Visual Studio Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Why Do I Need a Web Server?

Modern browsers block certain features when opening HTML files directly (file:// protocol) due to security restrictions (CORS policy). A local web server is required for the application to work properly.

## 📚 Module Overview

The application consists of 10 progressive modules:

### Module 0: Foundations & Notation
- **Concepts**: Vector spaces, inner products, norms, orthogonality
- **Interactive**: Enter 2D/3D vectors and see properties like dot products, angles, and orthogonality checks
- **Visualization**: Vector arrows with real-time property calculations

### Module 1: Vector Operations & Linear Combinations
- **Concepts**: Addition, scalar multiplication, linear combinations, span
- **Interactive**: Adjust scalars α and β to create linear combinations w = αu + βv
- **Visualization**: Component vectors and resultant with parallelogram construction

### Module 2: Linear Independence, Basis, Rank
- **Concepts**: Linear independence, rank, column/null spaces
- **Interactive**: Enter matrices and see rank, condition number, and subspace dimensions
- **Visualization**: Column space visualization with rank deficiency detection

### Module 3: Matrices as Linear Maps
- **Concepts**: Linear transformations, determinants, eigenvalues/eigenvectors
- **Interactive**: Define 2×2 transformation matrix or use presets (rotation, shear, scale, reflection)
- **Visualization**: Side-by-side original and transformed spaces with eigenvector highlighting

### Module 4: Projections & Decompositions
- **Concepts**: Orthogonal projection, QR decomposition, component decomposition
- **Interactive**: Project vector v onto subspace spanned by basis vectors
- **Visualization**: Shows v, v_∥ (parallel component), and v_⊥ (perpendicular component)

### Module 5: OLS in Observation-Space ⭐
- **Concepts**: ŷ = P_X y where P_X is projection matrix; e ⊥ 𝒞(X); TSS = ESS + RSS
- **Interactive**: Upload CSV or enter data; specify X columns and y column
- **Visualization**:
  - Left: Observation space showing y, ŷ, e, and column space
  - Right: Data space scatter plot with fitted line/plane
- **Outputs**: β̂, R², adjusted R², RSS/ESS/TSS, orthogonality check

### Module 6: OLS in Parameter-Space ⭐
- **Concepts**: Loss contours S(β), normal equations, confidence ellipses, collinearity
- **Interactive**: Sync data from Module 5, adjust contour levels
- **Visualization**: Elliptical contours of loss function with β̂ marked, confidence regions
- **Outputs**: Eigenvalues of X'X, condition number κ(X'X), collinearity warnings

### Module 7: Inference - t-tests and F-tests ⭐
- **Concepts**:
  - Observation-space: Nested subspaces 𝒞(X₀) ⊂ 𝒞(X₁), projection length comparison
  - Parameter-space: Restrictions Rβ = r, constraint hyperplanes
- **Interactive**: Specify reduced and full models, test hypotheses
- **Visualization**:
  - Left: Nested projections in observation space
  - Right: Constraint hyperplanes in parameter space
- **Outputs**: F-statistic, p-values, t-tests for individual coefficients

### Module 8: Diagnostics & Conditioning
- **Concepts**: Hat matrix H, leverage, Cook's distance, influence
- **Interactive**: Click to add/remove points, drag to move them
- **Visualization**:
  - Left: Data with fitted line (interactive)
  - Right: Leverage vs. residual plot with Cook's distance as point size
- **Outputs**: Maximum leverage, maximum Cook's D, warnings for influential points

### Module 9: Extensions
- **Ridge Regression**: Contours + L2 penalty ball, shrinkage effect
- **Lasso (Qualitative)**: Contours + L1 penalty diamond, sparsity-inducing
- **PCA vs OLS**: Different subspace projections
- **Weighted Least Squares**: Custom weights per observation

## 🏗️ Architecture

### File Structure

```
OLS_vector_visualisation/
├── index.html          # Main HTML structure with all modules
├── styles.css          # Complete styling (responsive, accessible)
├── linalg.js          # Linear algebra library (matrix ops, QR, SVD, OLS)
├── viz2d.js           # 2D Canvas visualization engine
├── viz3d.js           # 3D Canvas visualization engine (perspective projection)
├── modules.js         # Module-specific logic and computations
├── app.js             # Main application controller
└── README.md          # This file
```

### Technology Stack

- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **2D Graphics**: Canvas 2D API
- **3D Graphics**: Canvas 2D with perspective projection (no external 3D library)
- **Linear Algebra**: Custom implementation (QR, SVD, eigenvalues, projections)
- **State Management**: Lightweight reactive pattern
- **No External Dependencies**: Everything is self-contained

### Key Design Decisions

1. **No External Libraries**: Ensures the app runs anywhere without dependency management
2. **Numerically Stable**: Uses QR decomposition for regression instead of normal equations when appropriate
3. **Progressive Enhancement**: Modules build on each other, introducing concepts incrementally
4. **Hot Reload**: All visualizations update immediately on input change
5. **Responsive Design**: Works on desktop, tablet, and mobile devices

## 💡 Usage Guide

### Basic Workflow

1. **Start with Module 0**: Understand vector basics
2. **Progress sequentially** through Modules 1-4 to build intuition
3. **Module 5**: Enter or upload your data
   - Format: Space-separated columns, newline-separated rows
   - Example:
     ```
     1 1 2
     1 2 3
     1 3 3.5
     1 4 5
     1 5 5.5
     ```
   - First column is intercept (all 1s), second is x, third is y
4. **Module 6**: Sync data from Module 5 to see parameter-space view
5. **Module 7**: Specify nested models for F-tests
6. **Module 8**: Interactively explore diagnostics
7. **Module 9**: Experiment with regularization

### Data Input

#### Manual Entry
- Enter data in text area (space-separated columns, newline-separated rows)
- Specify which columns to use for X and which for y

#### CSV Upload
- Click "Upload CSV" button
- CSV should be comma or space-separated
- No header row expected (pure numeric data)

#### Example Data
- Click "Use Example Data" button to load a simple linear regression dataset

### Keyboard Shortcuts

- **Arrow Left/Right**: Navigate between modules
- **0-9**: Jump directly to a specific module
- **Ctrl+E**: Export current visualization as PNG
- **Ctrl+H**: Show help dialog

### Mouse Controls

- **2D Visualizations**: Hover for tooltips (where implemented)
- **3D Visualizations**:
  - Click and drag to rotate
  - Mouse wheel to zoom
  - Drag horizontally/vertically to change viewing angle

## 🧪 Testing

### Manual Testing Checklist

Run through each module and verify:

#### Module 0
- [ ] Change vector components and see updated norms, dot products, angles
- [ ] Switch between 2D and 3D
- [ ] Verify orthogonality check (try u=[1,0], v=[0,1])

#### Module 1
- [ ] Adjust α and β sliders and see w update
- [ ] Verify w = αu + βv numerically
- [ ] Check span visualization

#### Module 2
- [ ] Enter singular matrix (e.g., [[1,2],[2,4]]) and verify rank = 1
- [ ] Enter full-rank matrix and verify rank = 2
- [ ] Check condition number warnings

#### Module 3
- [ ] Try preset transformations
- [ ] Verify determinant (rotation should have det ≈ 1)
- [ ] Check eigenvectors for symmetric matrices

#### Module 4
- [ ] Project vector onto line (2D) and verify orthogonality
- [ ] Switch to 3D and project onto plane
- [ ] Verify ∥v_∥∥² + ∥v_⊥∥² = ∥v∥²

#### Module 5 ⭐
- [ ] Load example data
- [ ] Verify R² ∈ [0, 1]
- [ ] Check TSS = ESS + RSS (within numerical tolerance)
- [ ] Verify e ⊥ 𝒞(X) (X'e ≈ 0)
- [ ] See fitted line in scatter plot

#### Module 6
- [ ] Sync from Module 5
- [ ] See elliptical contours
- [ ] Verify β̂ is at minimum
- [ ] Check confidence ellipse

#### Module 7
- [ ] Specify reduced model (e.g., intercept only) and full model
- [ ] Verify RSS₀ ≥ RSS₁
- [ ] Check F-statistic is positive
- [ ] Verify p-value ∈ [0, 1]

#### Module 8
- [ ] Click to add points
- [ ] Drag points and see leverage update
- [ ] Add outlier and verify high Cook's D warning

#### Module 9
- [ ] Ridge: increase λ and see shrinkage toward origin
- [ ] Lasso: visualize diamond constraint
- [ ] WLS: enter weights and see different β̂

### Automated Testing

Run the test suite:

```bash
# Open test.html in browser
# Or run via Node.js if tests are set up for Node
```

See `test.html` for unit tests of linear algebra functions.

## 🔧 Troubleshooting

### Problem: "Blank page or no visualizations"
**Solution**: Make sure you're running via a web server (not file://)

### Problem: "Matrix is singular" warning
**Explanation**: Your design matrix X'X is not invertible (collinear columns)
**Solution**: Remove collinear columns or use regularization (Module 9)

### Problem: "Cannot read property of undefined"
**Solution**: Check console for errors; may need to refresh page

### Problem: "Numbers seem off / incorrect results"
**Solution**: Check that your data format is correct (space-separated, numeric)

### Problem: "3D visualization not rotating"
**Solution**: Click and drag on canvas; ensure JavaScript is enabled

### Problem: "Slow performance with large datasets"
**Limitation**: App is optimized for n ≤ 3000, p ≤ 20
**Solution**: Subsample your data or use a statistical package for large-scale analysis

## 📖 Mathematical Background

### Observation-Space Perspective

In observation space (ℝⁿ), OLS fits **ŷ = P_X y** where:
- P_X = X(X'X)⁻¹X' is the orthogonal projection matrix
- P_X is idempotent: P² = P
- P_X is symmetric: P' = P
- The residual **e = y - ŷ** is orthogonal to the column space 𝒞(X)

**Geometric interpretation**: OLS finds the point in 𝒞(X) closest to y.

### Parameter-Space Perspective

In parameter space (ℝᵖ), OLS minimizes **S(β) = ∥y - Xβ∥²**, which has:
- Elliptical contours determined by X'X
- Unique minimum at β̂ = (X'X)⁻¹X'y (if X'X is invertible)
- Confidence regions are ellipses determined by (X'X)⁻¹

**Geometric interpretation**: OLS finds the point in parameter space that minimizes the squared distance to y in observation space.

### References

This application is inspired by:
- **Eggers, A.** *OLS as Projection* - Observation-space geometric intuition
- **Ravishanker, N., Chi, Y., & Dey, D. K.** *A First Course in Linear Model Theory* - Comprehensive geometric treatment

## 🎨 Customization

### Changing Colors

Edit `styles.css` or the `colors` objects in `viz2d.js` and `viz3d.js`:

```javascript
this.colors = {
    u: '#E69F00',      // Orange
    v: '#56B4E9',      // Sky blue
    w: '#009E73',      // Green
    y: '#F0E442',      // Yellow
    yhat: '#0072B2',   // Blue
    e: '#D55E00',      // Vermillion
    // ... etc
};
```

These colors are from a **color-blind safe palette**.

### Adding New Modules

1. Add HTML structure in `index.html`
2. Add module logic in `modules.js`
3. Initialize in `app.js`
4. Update navigation

### Extending Linear Algebra

Add new functions to `linalg.js`:

```javascript
LinAlg.myNewFunction = function(A, B) {
    // Your implementation
    return result;
};
```

## 📊 Example Use Cases

### 1. Teaching Linear Regression
Navigate through modules sequentially to build student intuition from vectors → projections → OLS.

### 2. Visualizing Collinearity
Module 6: Enter data with near-collinear columns and observe elongated ellipses and high condition number.

### 3. Exploring Influential Points
Module 8: Interactively add outliers and high-leverage points, see their impact on Cook's distance.

### 4. Understanding Ridge Regression
Module 9: Increase ridge penalty λ and watch coefficients shrink toward origin.

### 5. Comparing Nested Models
Module 7: Test whether additional predictors significantly reduce RSS via F-test.

## 🔒 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires:
- ES6 JavaScript support
- Canvas API
- FileReader API (for CSV upload)

## 📝 License

This is an educational project. Feel free to use, modify, and distribute for educational purposes.

## 🤝 Contributing

Contributions welcome! Potential improvements:
- More example datasets
- Additional hypothesis test types
- Animated transitions between states
- WebGL-based 3D rendering for better performance
- Touch gestures for mobile
- Accessibility improvements (keyboard navigation)

## 📞 Support

For issues, questions, or suggestions:
1. Check this README thoroughly
2. Review console for error messages
3. Verify your data format
4. Try the example data first

## 🎓 Learning Path

**Beginners**: Start at Module 0, progress sequentially through Module 4 before attempting regression modules.

**Intermediate**: Jump to Module 5 if you understand projections, focus on dual perspectives in Modules 5-6.

**Advanced**: Explore Modules 7-9 for inference and extensions; try custom datasets.

## ✨ Acknowledgments

Inspired by the need for geometric intuition in linear regression, this tool aims to bridge the gap between analytical formulas and visual understanding.

---

**Built with ❤️ for statistics education**

Last updated: 2025-11-05
