/**
 * Main Application Controller
 * Handles module navigation, initialization, and global state
 */

const App = {
    currentModule: 0,
    modules: null,

    /**
     * Initialize the application
     */
    init: function() {
        console.log('Initializing OLS Visualization App...');

        // Set up module navigation
        this.setupNavigation();

        // Initialize all modules
        this.initializeModules();

        // Set up export functionality
        this.setupExport();

        // Show initial module
        this.showModule(0);

        console.log('App initialized successfully!');
    },

    /**
     * Set up module navigation
     */
    setupNavigation: function() {
        const navButtons = document.querySelectorAll('.nav-btn');

        navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.showModule(index);
            });
        });
    },

    /**
     * Show a specific module
     */
    showModule: function(moduleIndex) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected module
        const moduleElement = document.getElementById(`module-${moduleIndex}`);
        if (moduleElement) {
            moduleElement.classList.add('active');
        }

        // Activate corresponding nav button
        const navButtons = document.querySelectorAll('.nav-btn');
        if (navButtons[moduleIndex]) {
            navButtons[moduleIndex].classList.add('active');
        }

        this.currentModule = moduleIndex;
        Modules.state.currentModule = moduleIndex;

        // Trigger module update to refresh visualizations
        this.refreshCurrentModule();
    },

    /**
     * Initialize all modules
     */
    initializeModules: function() {
        try {
            Modules.module0.init();
            console.log('Module 0 initialized');
        } catch (e) {
            console.error('Error initializing Module 0:', e);
        }

        try {
            Modules.module1.init();
            console.log('Module 1 initialized');
        } catch (e) {
            console.error('Error initializing Module 1:', e);
        }

        try {
            Modules.module2.init();
            console.log('Module 2 initialized');
        } catch (e) {
            console.error('Error initializing Module 2:', e);
        }

        try {
            Modules.module3.init();
            console.log('Module 3 initialized');
        } catch (e) {
            console.error('Error initializing Module 3:', e);
        }

        try {
            Modules.module4.init();
            console.log('Module 4 initialized');
        } catch (e) {
            console.error('Error initializing Module 4:', e);
        }

        try {
            Modules.module5.init();
            console.log('Module 5 initialized');
        } catch (e) {
            console.error('Error initializing Module 5:', e);
        }

        try {
            Modules.module6.init();
            console.log('Module 6 initialized');
        } catch (e) {
            console.error('Error initializing Module 6:', e);
        }

        try {
            Modules.module7.init();
            console.log('Module 7 initialized');
        } catch (e) {
            console.error('Error initializing Module 7:', e);
        }

        try {
            Modules.module8.init();
            console.log('Module 8 initialized');
        } catch (e) {
            console.error('Error initializing Module 8:', e);
        }

        try {
            Modules.module9.init();
            console.log('Module 9 initialized');
        } catch (e) {
            console.error('Error initializing Module 9:', e);
        }
    },

    /**
     * Refresh current module's visualizations
     */
    refreshCurrentModule: function() {
        try {
            const moduleKey = `module${this.currentModule}`;
            if (Modules[moduleKey] && Modules[moduleKey].update) {
                Modules[moduleKey].update();
            }
        } catch (e) {
            console.error(`Error refreshing module ${this.currentModule}:`, e);
        }
    },

    /**
     * Set up export functionality
     */
    setupExport: function() {
        // Export as PNG
        document.getElementById('export-png')?.addEventListener('click', () => {
            this.exportAsPNG();
        });

        // Export config as JSON
        document.getElementById('export-json')?.addEventListener('click', () => {
            this.exportConfig();
        });

        // Import config from JSON
        document.getElementById('import-json')?.addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const config = JSON.parse(event.target.result);
                        this.importConfig(config);
                    } catch (err) {
                        alert('Error loading configuration: ' + err.message);
                    }
                };
                reader.readAsText(file);
            }
        });
    },

    /**
     * Export current module visualization as PNG
     */
    exportAsPNG: function() {
        // Find the active canvas in current module
        const moduleElement = document.getElementById(`module-${this.currentModule}`);
        const canvases = moduleElement.querySelectorAll('canvas');

        if (canvases.length === 0) {
            alert('No canvas found in current module');
            return;
        }

        // Export first canvas (or create a combined export for multiple canvases)
        const canvas = canvases[0];
        const dataURL = canvas.toDataURL('image/png');

        // Create download link
        const link = document.createElement('a');
        link.download = `ols-viz-module-${this.currentModule}-${Date.now()}.png`;
        link.href = dataURL;
        link.click();

        console.log('PNG exported successfully');
    },

    /**
     * Export current configuration as JSON
     */
    exportConfig: function() {
        const config = {
            module: this.currentModule,
            timestamp: new Date().toISOString(),
            data: {}
        };

        // Export module 5 data if available
        if (Modules.state.module5Data) {
            config.data.module5 = {
                dataInput: document.getElementById('data-input-5')?.value,
                xCols: document.getElementById('x-cols-5')?.value,
                yCol: document.getElementById('y-col-5')?.value
            };
        }

        // Export module-specific settings
        config.settings = this.exportModuleSettings();

        const json = JSON.stringify(config, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `ols-viz-config-${Date.now()}.json`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
        console.log('Configuration exported successfully');
    },

    /**
     * Export module-specific settings
     */
    exportModuleSettings: function() {
        const settings = {};

        // Module 0
        settings.module0 = {
            dimension: document.querySelector('input[name="dim-0"]:checked')?.value,
            u: [
                document.getElementById('u-x-0')?.value,
                document.getElementById('u-y-0')?.value,
                document.getElementById('u-z-0')?.value
            ],
            v: [
                document.getElementById('v-x-0')?.value,
                document.getElementById('v-y-0')?.value,
                document.getElementById('v-z-0')?.value
            ]
        };

        // Module 1
        settings.module1 = {
            dimension: document.querySelector('input[name="dim-1"]:checked')?.value,
            alpha: document.getElementById('alpha-num-1')?.value,
            beta: document.getElementById('beta-num-1')?.value
        };

        // Add more as needed...

        return settings;
    },

    /**
     * Import configuration from JSON
     */
    importConfig: function(config) {
        console.log('Importing configuration:', config);

        // Navigate to the saved module
        if (config.module !== undefined) {
            this.showModule(config.module);
        }

        // Restore module 5 data if available
        if (config.data && config.data.module5) {
            const m5data = config.data.module5;
            if (m5data.dataInput) {
                document.getElementById('data-input-5').value = m5data.dataInput;
            }
            if (m5data.xCols) {
                document.getElementById('x-cols-5').value = m5data.xCols;
            }
            if (m5data.yCol) {
                document.getElementById('y-col-5').value = m5data.yCol;
            }
            Modules.module5.update();
        }

        // Restore settings if available
        if (config.settings) {
            this.importModuleSettings(config.settings);
        }

        alert('Configuration imported successfully!');
    },

    /**
     * Import module-specific settings
     */
    importModuleSettings: function(settings) {
        // Module 0
        if (settings.module0) {
            const m0 = settings.module0;
            if (m0.u) {
                document.getElementById('u-x-0').value = m0.u[0] || 0;
                document.getElementById('u-y-0').value = m0.u[1] || 0;
                document.getElementById('u-z-0').value = m0.u[2] || 0;
            }
            if (m0.v) {
                document.getElementById('v-x-0').value = m0.v[0] || 0;
                document.getElementById('v-y-0').value = m0.v[1] || 0;
                document.getElementById('v-z-0').value = m0.v[2] || 0;
            }
        }

        // Trigger updates for visible modules
        this.refreshCurrentModule();
    },

    /**
     * Keyboard shortcuts
     */
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Arrow keys for module navigation
            if (e.key === 'ArrowRight') {
                const next = (this.currentModule + 1) % 10;
                this.showModule(next);
            } else if (e.key === 'ArrowLeft') {
                const prev = (this.currentModule - 1 + 10) % 10;
                this.showModule(prev);
            }

            // Number keys for direct module access
            if (e.key >= '0' && e.key <= '9') {
                const moduleNum = parseInt(e.key);
                this.showModule(moduleNum);
            }

            // 'e' for export
            if (e.key === 'e' && e.ctrlKey) {
                e.preventDefault();
                this.exportAsPNG();
            }

            // 'h' for help
            if (e.key === 'h' && e.ctrlKey) {
                e.preventDefault();
                this.showHelp();
            }
        });
    },

    /**
     * Show help modal
     */
    showHelp: function() {
        alert(`OLS Geometric Visualization - Help

Keyboard Shortcuts:
• Arrow Left/Right: Navigate between modules
• 0-9: Jump to specific module
• Ctrl+E: Export current visualization as PNG
• Ctrl+H: Show this help

Mouse Controls:
• 3D views: Click and drag to rotate, scroll to zoom
• 2D views: Hover for tooltips

Module Navigation:
• Module 0: Vector basics (dot product, norms, orthogonality)
• Module 1: Linear combinations and spans
• Module 2: Linear independence, rank, basis
• Module 3: Matrix transformations and eigenvectors
• Module 4: Projections and decompositions
• Module 5: OLS in observation space
• Module 6: OLS in parameter space
• Module 7: Statistical inference (t-tests, F-tests)
• Module 8: Diagnostics and influence
• Module 9: Extensions (Ridge, Lasso, WLS)

For more information, see the README.md file.`);
    },

    /**
     * Error handler
     */
    handleError: function(error, context) {
        console.error(`Error in ${context}:`, error);
        // Could show user-friendly error message here
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
        App.setupKeyboardShortcuts();
    });
} else {
    // DOM already loaded
    App.init();
    App.setupKeyboardShortcuts();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
