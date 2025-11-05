/**
 * 3D Visualization Factory
 * Creates the appropriate 3D engine based on global settings
 */

// Global setting for 3D engine (can be changed via UI)
window.VIZ3D_ENGINE = window.VIZ3D_ENGINE || 'threejs'; // Options: 'canvas', 'threejs', 'plotly'

class Viz3D {
    constructor(canvasId, options = {}) {
        // Get the engine preference from global setting or options
        const engineType = options.engine || window.VIZ3D_ENGINE || 'threejs';

        // Create the appropriate engine
        switch (engineType) {
            case 'threejs':
                if (typeof THREE === 'undefined') {
                    console.warn('Three.js not loaded, falling back to canvas');
                    this.engine = new Viz3DCanvas(canvasId, options);
                } else {
                    this.engine = new Viz3DThreeJS(canvasId, options);
                }
                break;

            case 'plotly':
                if (typeof Plotly === 'undefined') {
                    console.warn('Plotly.js not loaded, falling back to canvas');
                    this.engine = new Viz3DCanvas(canvasId, options);
                } else {
                    this.engine = new Viz3DPlotly(canvasId, options);
                }
                break;

            case 'canvas':
            default:
                this.engine = new Viz3DCanvas(canvasId, options);
                break;
        }

        this.engineType = engineType;
    }

    // Delegate all methods to the active engine
    clear() { return this.engine.clear(); }
    render() { return this.engine.render(); }
    drawVector3D(...args) { return this.engine.drawVector3D(...args); }
    drawPoint3D(...args) { return this.engine.drawPoint3D(...args); }
    drawLine3D(...args) { return this.engine.drawLine3D(...args); }
    drawPlane(...args) { return this.engine.drawPlane(...args); }
    drawLine3DInfinite(...args) { return this.engine.drawLine3DInfinite(...args); }
    drawScatter3D(...args) { return this.engine.drawScatter3D(...args); }
    drawText3D(...args) { return this.engine.drawText3D(...args); }
    setCameraPosition(...args) { return this.engine.setCameraPosition(...args); }
    setCameraRotation(...args) { return this.engine.setCameraRotation(...args); }
    autoViewport(...args) { return this.engine.autoViewport(...args); }
    toDataURL() { return this.engine.toDataURL(); }

    // Get the color palette
    get colors() { return this.engine.colors; }

    // Dispose/cleanup
    dispose() {
        if (this.engine.dispose) {
            return this.engine.dispose();
        }
    }

    // Get engine info
    getEngineType() {
        return this.engineType;
    }
}

/**
 * Function to switch 3D engines globally
 */
function switch3DEngine(engineType) {
    window.VIZ3D_ENGINE = engineType;
    console.log(`3D engine switched to: ${engineType}`);
    console.log('Please refresh visualizations or navigate to a different module to see changes.');

    // Store preference in localStorage
    try {
        localStorage.setItem('viz3d_engine', engineType);
    } catch (e) {
        console.warn('Could not save engine preference to localStorage');
    }

    // Trigger event for UI updates
    window.dispatchEvent(new CustomEvent('viz3d-engine-changed', { detail: { engine: engineType } }));
}

/**
 * Load saved engine preference
 */
function loadEnginePreference() {
    try {
        const saved = localStorage.getItem('viz3d_engine');
        if (saved) {
            window.VIZ3D_ENGINE = saved;
        }
    } catch (e) {
        console.warn('Could not load engine preference from localStorage');
    }
}

// Load preference on script load
loadEnginePreference();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Viz3D;
}
