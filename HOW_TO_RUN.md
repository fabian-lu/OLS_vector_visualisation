# How to Run - OLS Geometric Visualization

## 🚀 Three Simple Steps

### Step 1: Open Terminal

Open your terminal/command prompt and navigate to the project:

```bash
cd /home/user/OLS_vector_visualisation
```

### Step 2: Start Web Server

Choose **ONE** of these commands based on what you have installed:

#### Python 3 (Most Common) ⭐
```bash
python3 -m http.server 8000
```

#### Python 2
```bash
python -m SimpleHTTPServer 8000
```

#### Node.js
```bash
npx http-server -p 8000
```

#### PHP
```bash
php -S localhost:8000
```

**You should see:**
```
Serving HTTP on 0.0.0.0 port 8000 ...
```

✅ **Leave this terminal window open!** The server needs to keep running.

### Step 3: Open in Browser

Open your web browser and go to:

```
http://localhost:8000
```

**Or specifically:**
```
http://localhost:8000/index.html
```

---

## ✅ What You Should See

### 1. Homepage
- **Purple gradient background**
- **White header** with title "Geometric Linear Algebra for OLS"
- **Module navigation** with 10 buttons (Module 0 through Module 9)
- **Module 0** showing by default with:
  - Theory section (blue border, light background)
  - Input controls for vectors u and v
  - A canvas showing vectors
  - Output panel with computed properties

### 2. Test the Basics

#### Module 0 Test:
1. You should see two input fields for vector u (default: [3, 2])
2. Change u to: [4, 0]
3. **Expected:** You should immediately see:
   - ∥u∥ = 4.000
   - The vector arrow update on the canvas

#### Module 5 Test (Main Feature):
1. Click "**Module 5: OLS (Obs-Space)**" button
2. Click "**Use Example Data**" button
3. Click "**Update Data**" button
4. **Expected:** You should see:
   - Left canvas: Vectors in observation space
   - Right canvas: Scatter plot with blue fitted line
   - Output showing: β̂ = [approximately 1.3, 0.85]
   - R² ≈ 0.98
   - "Orthogonal: YES" in green

---

## 🧪 Run the Tests

In a **new browser tab**, go to:

```
http://localhost:8000/test.html
```

**Expected:**
- Tests automatically run
- You should see **40+ green checkmarks** (✓)
- Summary shows: **"Passed: 40+ (100%)"**

If you see any **red X marks (✗)**, check the browser console (press F12).

---

## 📱 Access from Other Devices

### On Same Network

1. **Find your IP address:**

   **Linux/Mac:**
   ```bash
   ip addr show | grep "inet " | grep -v 127.0.0.1
   ```

   **Windows:**
   ```bash
   ipconfig
   ```

2. **Look for something like:** `192.168.1.100`

3. **On another device (phone, tablet), open:**
   ```
   http://192.168.1.100:8000
   ```
   (Replace with your actual IP)

---

## 🛑 Stop the Server

When you're done, go back to the terminal and press:

```
Ctrl + C
```

This stops the web server.

---

## 🐛 Troubleshooting

### Problem: "Address already in use"

**Solution:** The port is busy. Use a different port:

```bash
python3 -m http.server 8001
```

Then open: `http://localhost:8001`

---

### Problem: "Command not found: python3"

**Try these alternatives:**

1. Try `python` instead:
   ```bash
   python -m http.server 8000
   ```

2. Check Python version:
   ```bash
   python --version
   # or
   python3 --version
   ```

3. If no Python, try Node.js:
   ```bash
   npx http-server -p 8000
   ```

---

### Problem: "Blank page" or "Not loading"

**Check these:**

1. ✅ Is the server running? (Check terminal - should show "Serving HTTP...")

2. ✅ Are you using `http://localhost:8000` (not `file:///...`)?

3. ✅ Try refreshing the page (Ctrl+R or Cmd+R)

4. ✅ Check browser console:
   - Press F12
   - Click "Console" tab
   - Look for red error messages

5. ✅ Verify files exist:
   ```bash
   ls -lh index.html
   ```
   Should show a file size (e.g., 33K)

---

### Problem: "Visualizations not showing"

**Check:**

1. Open browser console (F12)
2. Look for JavaScript errors
3. Try a different browser (Chrome, Firefox, Safari, Edge)
4. Make sure JavaScript is enabled

---

### Problem: "Server crashes" or "Stops responding"

**Solution:**

1. Stop server (Ctrl+C)
2. Start again:
   ```bash
   python3 -m http.server 8000
   ```

---

## 🎯 Quick Feature Tour

Once running, try this **5-minute tour**:

### Minute 1: Module 0
- Change vector values
- Switch to 3D (click 3D radio button)
- See properties update

### Minute 2: Module 1
- Adjust α and β sliders
- Watch w = αu + βv update in real-time

### Minute 3: Module 5
- Click "Use Example Data"
- Click "Update Data"
- See regression results

### Minute 4: Module 6
- Click "Sync from Module 5"
- See loss contours in parameter space

### Minute 5: Module 8
- Click "Reset"
- **Click on left plot** to add a point
- See diagnostics update

---

## 💡 Pro Tips

### Keyboard Shortcuts
- **Arrow Left/Right**: Navigate modules
- **0-9**: Jump to specific module
- **Ctrl+E**: Export visualization as PNG
- **Ctrl+H**: Show help

### Best Experience
- **Desktop browser** recommended
- **1920×1080** or higher resolution
- **Chrome 90+** or **Firefox 88+**

### For Teaching
1. Start with Module 0 (basics)
2. Progress through Modules 1-4 (build intuition)
3. Deep dive into Module 5 (core OLS)
4. Show Module 6 (dual perspective)
5. Demonstrate Module 8 (interactive diagnostics)

---

## 📚 More Information

- **Quick Start Guide**: `QUICKSTART.md`
- **Full Documentation**: `README.md`
- **Project Summary**: `SUMMARY.md`
- **Test Suite**: `test.html`

---

## ✅ Success Checklist

You know it's working when:

- [x] Server starts without errors
- [x] Browser shows app (purple background, module buttons)
- [x] Module 0 shows vectors on canvas
- [x] Changing inputs updates visualizations
- [x] Module 5 shows scatter plot with fitted line
- [x] Test suite shows all tests passing
- [x] Can navigate between modules
- [x] Can export PNG (Ctrl+E)

---

## 🎉 You're All Set!

If you can see the app and Module 0 is working, **you're ready to explore OLS geometry!**

Start with Module 0, work your way through to Module 9, and enjoy building geometric intuition about linear regression.

**Happy Learning! 📊**

---

*For detailed usage instructions, see README.md*
*For troubleshooting, see QUICKSTART.md*
*For project overview, see SUMMARY.md*
