/**
 * Module-specific logic for OLS Visualization App
 * Contains computation and visualization logic for each module
 */

const Modules = {
    // Shared state
    state: {
        module5Data: null,  // Store data from Module 5 for reuse
        currentModule: 0
    },

    /**
     * Module 0: Foundations & Notation
     */
    module0: {
        init: function() {
            const canvasId = 'canvas-0';
            const is3D = document.querySelector('input[name="dim-0"]:checked').value === '3';

            // Dimension toggle handler
            document.querySelectorAll('input[name="dim-0"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    const is3D = radio.value === '3';
                    document.getElementById('u-z-0').style.display = is3D ? 'inline-block' : 'none';
                    document.getElementById('v-z-0').style.display = is3D ? 'inline-block' : 'none';
                    this.update();
                });
            });

            // Input change handlers
            ['u-x-0', 'u-y-0', 'u-z-0', 'v-x-0', 'v-y-0', 'v-z-0'].forEach(id => {
                const elem = document.getElementById(id);
                if (elem) {
                    elem.addEventListener('input', () => this.update());
                }
            });

            // Toggle handlers
            document.getElementById('show-orthogonal-0')?.addEventListener('change', () => this.update());

            this.update();
        },

        update: function() {
            const is3D = document.querySelector('input[name="dim-0"]:checked').value === '3';

            // Get vectors
            const u = [
                parseFloat(document.getElementById('u-x-0').value) || 0,
                parseFloat(document.getElementById('u-y-0').value) || 0,
                is3D ? (parseFloat(document.getElementById('u-z-0').value) || 0) : 0
            ];
            const v = [
                parseFloat(document.getElementById('v-x-0').value) || 0,
                parseFloat(document.getElementById('v-y-0').value) || 0,
                is3D ? (parseFloat(document.getElementById('v-z-0').value) || 0) : 0
            ];

            // Compute properties
            const normU = LinAlg.norm(u);
            const normV = LinAlg.norm(v);
            const dotUV = LinAlg.dot(u, v);
            const cosTheta = normU > 0 && normV > 0 ? dotUV / (normU * normV) : 0;
            const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180 / Math.PI;
            const isOrthogonal = Math.abs(dotUV) < 1e-6;

            // Update output
            document.getElementById('norm-u-0').textContent = normU.toFixed(3);
            document.getElementById('norm-v-0').textContent = normV.toFixed(3);
            document.getElementById('dot-uv-0').textContent = dotUV.toFixed(3);
            document.getElementById('cos-theta-0').textContent = cosTheta.toFixed(3);
            document.getElementById('theta-0').textContent = theta.toFixed(1);
            document.getElementById('ortho-check-0').innerHTML =
                `Orthogonal: <span style="color:${isOrthogonal ? '#10b981' : '#ef4444'}">${isOrthogonal ? 'YES' : 'NO'}</span>`;

            // Visualize
            if (is3D) {
                this.visualize3D(u, v, isOrthogonal);
            } else {
                this.visualize2D(u, v, isOrthogonal);
            }
        },

        visualize2D: function(u, v, isOrthogonal) {
            try {
                const viz = new Viz2D('canvas-0');
                if (!viz || !viz.colors) {
                    console.error('Failed to create 2D visualization');
                    return;
                }
                viz.drawVector([0, 0], u.slice(0, 2), viz.colors.u, 'u', 3);
                viz.drawVector([0, 0], v.slice(0, 2), viz.colors.v, 'v', 3);

                // Draw orthogonality symbol if orthogonal
                if (isOrthogonal && document.getElementById('show-orthogonal-0').checked) {
                    viz.drawOrthogonalSymbol([0, 0], u.slice(0, 2), v.slice(0, 2));
                }
            } catch (error) {
                console.error('Error in visualize2D:', error);
            }
        },

        visualize3D: function(u, v, isOrthogonal) {
            try {
                const viz = new Viz3D('canvas-0');
                if (!viz || !viz.colors || !viz.engine) {
                    console.error('Failed to create 3D visualization');
                    return;
                }
                viz.drawVector3D([0, 0, 0], u, viz.colors.u, 'u', 3);
                viz.drawVector3D([0, 0, 0], v, viz.colors.v, 'v', 3);
            } catch (error) {
                console.error('Error in visualize3D:', error);
            }
        }
    },

    /**
     * Module 1: Vector Operations & Linear Combinations
     */
    module1: {
        init: function() {
            // Dimension toggle
            document.querySelectorAll('input[name="dim-1"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    const is3D = radio.value === '3';
                    document.getElementById('u-z-1').style.display = is3D ? 'inline-block' : 'none';
                    document.getElementById('v-z-1').style.display = is3D ? 'inline-block' : 'none';
                    this.update();
                });
            });

            // Input handlers
            ['u-x-1', 'u-y-1', 'u-z-1', 'v-x-1', 'v-y-1', 'v-z-1'].forEach(id => {
                document.getElementById(id)?.addEventListener('input', () => this.update());
            });

            // Slider sync
            const alphaSlider = document.getElementById('alpha-1');
            const alphaNum = document.getElementById('alpha-num-1');
            alphaSlider.addEventListener('input', () => {
                alphaNum.value = alphaSlider.value;
                this.update();
            });
            alphaNum.addEventListener('input', () => {
                alphaSlider.value = alphaNum.value;
                this.update();
            });

            const betaSlider = document.getElementById('beta-1');
            const betaNum = document.getElementById('beta-num-1');
            betaSlider.addEventListener('input', () => {
                betaNum.value = betaSlider.value;
                this.update();
            });
            betaNum.addEventListener('input', () => {
                betaSlider.value = betaNum.value;
                this.update();
            });

            // Toggle handlers
            document.getElementById('show-span-1')?.addEventListener('change', () => this.update());
            document.getElementById('show-grid-1')?.addEventListener('change', () => this.update());

            this.update();
        },

        update: function() {
            const is3D = document.querySelector('input[name="dim-1"]:checked').value === '3';

            const u = [
                parseFloat(document.getElementById('u-x-1').value) || 0,
                parseFloat(document.getElementById('u-y-1').value) || 0,
                is3D ? (parseFloat(document.getElementById('u-z-1').value) || 0) : 0
            ];
            const v = [
                parseFloat(document.getElementById('v-x-1').value) || 0,
                parseFloat(document.getElementById('v-y-1').value) || 0,
                is3D ? (parseFloat(document.getElementById('v-z-1').value) || 0) : 0
            ];

            const alpha = parseFloat(document.getElementById('alpha-num-1').value) || 0;
            const beta = parseFloat(document.getElementById('beta-num-1').value) || 0;

            // Compute linear combination
            const w = LinAlg.add(LinAlg.scale(u, alpha), LinAlg.scale(v, beta));
            const normW = LinAlg.norm(w);

            // Update output
            document.getElementById('w-result-1').textContent = LinAlg.formatVector(w);
            document.getElementById('norm-w-1').textContent = normW.toFixed(3);

            // Visualize
            if (is3D) {
                this.visualize3D(u, v, w, alpha, beta);
            } else {
                this.visualize2D(u, v, w, alpha, beta);
            }
        },

        visualize2D: function(u, v, w, alpha, beta) {
            const showSpan = document.getElementById('show-span-1').checked;
            const showGrid = document.getElementById('show-grid-1').checked;

            const viz = new Viz2D('canvas-1', { showGrid: showGrid });

            // Draw span if enabled (as parallelogram region)
            if (showSpan) {
                viz.drawSubspace1D(LinAlg.normalize(u.slice(0, 2)));
                viz.drawSubspace1D(LinAlg.normalize(v.slice(0, 2)));
            }

            // Draw component vectors (alpha*u and beta*v)
            const alphaU = LinAlg.scale(u, alpha);
            const betaV = LinAlg.scale(v, beta);

            viz.drawVector([0, 0], alphaU.slice(0, 2), viz.colors.u, `${alpha.toFixed(1)}u`, 2);
            viz.drawVector([0, 0], betaV.slice(0, 2), viz.colors.v, `${beta.toFixed(1)}v`, 2);

            // Draw resultant
            viz.drawVector([0, 0], w.slice(0, 2), viz.colors.w, 'w', 3);

            // Draw parallelogram construction
            viz.drawLine(alphaU[0], alphaU[1], w[0], w[1], viz.colors.v, 1, true);
            viz.drawLine(betaV[0], betaV[1], w[0], w[1], viz.colors.u, 1, true);
        },

        visualize3D: function(u, v, w, alpha, beta) {
            const viz = new Viz3D('canvas-1');

            const alphaU = LinAlg.scale(u, alpha);
            const betaV = LinAlg.scale(v, beta);

            viz.drawVector3D([0, 0, 0], alphaU, viz.colors.u, `${alpha.toFixed(1)}u`, 2);
            viz.drawVector3D([0, 0, 0], betaV, viz.colors.v, `${beta.toFixed(1)}v`, 2);
            viz.drawVector3D([0, 0, 0], w, viz.colors.w, 'w', 3);
        }
    },

    /**
     * Module 2: Linear Independence, Basis, Rank
     */
    module2: {
        init: function() {
            document.getElementById('parse-matrix-2')?.addEventListener('click', () => this.update());

            // Also update on Enter key
            document.getElementById('matrix-input-2')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.update();
                }
            });

            this.update();
        },

        update: function() {
            const matrixStr = document.getElementById('matrix-input-2').value;

            try {
                const A = LinAlg.parseMatrix(matrixStr);

                if (A.length === 0 || A[0].length === 0) {
                    throw new Error('Empty matrix');
                }

                const m = A.length;
                const n = A[0].length;
                const rank = LinAlg.rank(A);
                const condNum = LinAlg.conditionNumber(A);
                const nullDim = n - rank;

                // Update output
                document.getElementById('matrix-display-2').textContent = `${m}×${n} matrix`;
                document.getElementById('shape-2').textContent = `${m} × ${n}`;
                document.getElementById('rank-2').textContent = rank;
                document.getElementById('cond-2').textContent = condNum.toFixed(2);
                document.getElementById('col-dim-2').textContent = rank;
                document.getElementById('null-dim-2').textContent = nullDim;

                // Warning for rank deficiency
                const warning = document.getElementById('rank-warning-2');
                if (rank < Math.min(m, n)) {
                    warning.textContent = `⚠ Rank deficient! Expected rank ${Math.min(m, n)}, got ${rank}`;
                    warning.style.display = 'block';
                } else if (condNum > 100) {
                    warning.textContent = `⚠ Ill-conditioned! Condition number = ${condNum.toFixed(2)}`;
                    warning.style.display = 'block';
                } else {
                    warning.textContent = '';
                    warning.style.display = 'none';
                }

                // Visualize column space
                this.visualize(A, rank);

            } catch (e) {
                console.error('Error parsing matrix:', e);
                document.getElementById('rank-warning-2').textContent = `❌ Error: ${e.message}`;
                document.getElementById('rank-warning-2').style.display = 'block';
            }
        },

        visualize: function(A, rank) {
            const m = A.length;
            const n = A[0].length;

            if (m === 2 || m === 3) {
                // Visualize column vectors
                if (m === 2) {
                    const viz = new Viz2D('canvas-2a');
                    for (let j = 0; j < n; j++) {
                        const col = A.map(row => row[j]);
                        const color = j === 0 ? viz.colors.u : (j === 1 ? viz.colors.v : viz.colors.w);
                        viz.drawVector([0, 0], col, color, `c${j + 1}`, 2);
                    }

                    // Draw column space (span)
                    if (rank === 1) {
                        const col = A.map(row => row[0]);
                        viz.drawSubspace1D(col);
                    } else if (rank === 2) {
                        // Full 2D space - just note it
                        viz.drawText('Full 2D space', 3, 3, viz.colors.subspaceBorder, 16);
                    }
                } else if (m === 3) {
                    const viz = new Viz3D('canvas-2a');
                    for (let j = 0; j < n; j++) {
                        const col = A.map(row => row[j]);
                        const color = j === 0 ? viz.colors.u : (j === 1 ? viz.colors.v : viz.colors.w);
                        viz.drawVector3D([0, 0, 0], col, color, `c${j + 1}`, 2);
                    }

                    // Draw subspace
                    if (rank === 1) {
                        const col = A.map(row => row[0]);
                        viz.drawLine3DInfinite([0, 0, 0], col);
                    } else if (rank === 2) {
                        // Compute normal to plane
                        const col1 = A.map(row => row[0]);
                        const col2 = A.map(row => row[1]);
                        const normal = LinAlg.cross(col1, col2);
                        viz.drawPlane([0, 0, 0], normal, 3);
                    }
                }
            }
        }
    },

    /**
     * Module 3: Matrices as Linear Maps
     */
    module3: {
        init: function() {
            // Matrix input handlers
            ['a11-3', 'a12-3', 'a21-3', 'a22-3'].forEach(id => {
                document.getElementById(id)?.addEventListener('input', () => this.update());
            });

            // Preset buttons
            document.getElementById('preset-rotation-3')?.addEventListener('click', () => {
                const angle = Math.PI / 4;
                document.getElementById('a11-3').value = Math.cos(angle).toFixed(2);
                document.getElementById('a12-3').value = (-Math.sin(angle)).toFixed(2);
                document.getElementById('a21-3').value = Math.sin(angle).toFixed(2);
                document.getElementById('a22-3').value = Math.cos(angle).toFixed(2);
                this.update();
            });

            document.getElementById('preset-shear-3')?.addEventListener('click', () => {
                document.getElementById('a11-3').value = 1;
                document.getElementById('a12-3').value = 0.5;
                document.getElementById('a21-3').value = 0;
                document.getElementById('a22-3').value = 1;
                this.update();
            });

            document.getElementById('preset-scale-3')?.addEventListener('click', () => {
                document.getElementById('a11-3').value = 2;
                document.getElementById('a12-3').value = 0;
                document.getElementById('a21-3').value = 0;
                document.getElementById('a22-3').value = 0.5;
                this.update();
            });

            document.getElementById('preset-reflect-3')?.addEventListener('click', () => {
                document.getElementById('a11-3').value = 1;
                document.getElementById('a12-3').value = 0;
                document.getElementById('a21-3').value = 0;
                document.getElementById('a22-3').value = -1;
                this.update();
            });

            // Toggle handlers
            document.getElementById('show-grid-3')?.addEventListener('change', () => this.update());
            document.getElementById('show-eigen-3')?.addEventListener('change', () => this.update());

            this.update();
        },

        update: function() {
            const A = [
                [parseFloat(document.getElementById('a11-3').value) || 0,
                 parseFloat(document.getElementById('a12-3').value) || 0],
                [parseFloat(document.getElementById('a21-3').value) || 0,
                 parseFloat(document.getElementById('a22-3').value) || 0]
            ];

            const det = LinAlg.determinant(A);
            const eigen = LinAlg.eigen2x2(A);

            // Update output
            document.getElementById('det-3').textContent = det.toFixed(3);

            if (eigen) {
                document.getElementById('eigenvalues-3').textContent =
                    eigen.values.map(v => v.toFixed(3)).join(', ');
                document.getElementById('eigenvectors-3').textContent =
                    eigen.vectors.map(v => LinAlg.formatVector(v, 2)).join('; ');
            } else {
                document.getElementById('eigenvalues-3').textContent = 'Complex';
                document.getElementById('eigenvectors-3').textContent = 'Complex';
            }

            this.visualize(A, eigen);
        },

        visualize: function(A, eigen) {
            const showGrid = document.getElementById('show-grid-3').checked;
            const showEigen = document.getElementById('show-eigen-3').checked;

            // Original space
            const viz1 = new Viz2D('canvas-3a', { showGrid: showGrid });

            // Draw unit vectors
            viz1.drawVector([0, 0], [1, 0], viz1.colors.u, 'e₁', 2);
            viz1.drawVector([0, 0], [0, 1], viz1.colors.v, 'e₂', 2);

            // Draw eigenvectors if available and enabled
            if (eigen && showEigen) {
                eigen.vectors.forEach((v, i) => {
                    viz1.drawVector([0, 0], v, '#9333ea', `v₁${i + 1}`, 1.5);
                });
            }

            // Transformed space
            const viz2 = new Viz2D('canvas-3b', { showGrid: showGrid });

            // Transform unit vectors
            const e1_transformed = LinAlg.matvec(A, [1, 0]);
            const e2_transformed = LinAlg.matvec(A, [0, 1]);

            viz2.drawVector([0, 0], e1_transformed, viz2.colors.u, "Ae₁", 2);
            viz2.drawVector([0, 0], e2_transformed, viz2.colors.v, "Ae₂", 2);

            // Transform eigenvectors if available and enabled
            if (eigen && showEigen) {
                eigen.vectors.forEach((v, i) => {
                    const transformed = LinAlg.matvec(A, v);
                    viz2.drawVector([0, 0], transformed, '#9333ea', `Av${i + 1}`, 1.5);
                });
            }
        }
    },

    /**
     * Module 4: Projections & Decompositions
     */
    module4: {
        init: function() {
            // Dimension toggle
            document.querySelectorAll('input[name="dim-4"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    const is3D = radio.value === '3';
                    document.getElementById('v-z-4').style.display = is3D ? 'inline-block' : 'none';
                    document.getElementById('u1-z-4').style.display = is3D ? 'inline-block' : 'none';
                    document.getElementById('u2-group-4').style.display = is3D ? 'flex' : 'none';
                    this.update();
                });
            });

            // Input handlers
            ['v-x-4', 'v-y-4', 'v-z-4', 'u1-x-4', 'u1-y-4', 'u1-z-4', 'u2-x-4', 'u2-y-4', 'u2-z-4'].forEach(id => {
                document.getElementById(id)?.addEventListener('input', () => this.update());
            });

            document.getElementById('show-components-4')?.addEventListener('change', () => this.update());

            this.update();
        },

        update: function() {
            const is3D = document.querySelector('input[name="dim-4"]:checked').value === '3';

            const v = [
                parseFloat(document.getElementById('v-x-4').value) || 0,
                parseFloat(document.getElementById('v-y-4').value) || 0,
                is3D ? (parseFloat(document.getElementById('v-z-4').value) || 0) : 0
            ];

            const u1 = [
                parseFloat(document.getElementById('u1-x-4').value) || 0,
                parseFloat(document.getElementById('u1-y-4').value) || 0,
                is3D ? (parseFloat(document.getElementById('u1-z-4').value) || 0) : 0
            ];

            let U;
            if (is3D) {
                const u2 = [
                    parseFloat(document.getElementById('u2-x-4').value) || 0,
                    parseFloat(document.getElementById('u2-y-4').value) || 0,
                    parseFloat(document.getElementById('u2-z-4').value) || 0
                ];
                U = [u1, u2].map(col => col);
            } else {
                U = [u1.slice(0, 2)];
            }

            // Build matrix form
            const dim = is3D ? 3 : 2;
            const Umat = [];
            for (let i = 0; i < dim; i++) {
                Umat[i] = [];
                for (let j = 0; j < U.length; j++) {
                    Umat[i][j] = U[j][i];
                }
            }

            // Compute projection
            const vSlice = v.slice(0, dim);
            const vParallel = LinAlg.project(vSlice, Umat);
            const vPerp = LinAlg.subtract(vSlice, vParallel);

            const normVParallel = LinAlg.norm(vParallel);
            const normVPerp = LinAlg.norm(vPerp);
            const normV = LinAlg.norm(vSlice);
            const sumSq = normVParallel * normVParallel + normVPerp * normVPerp;
            const dotProjPerp = LinAlg.dot(vParallel, vPerp);

            // Update output
            document.getElementById('proj-v-4').textContent = LinAlg.formatVector(vParallel);
            document.getElementById('perp-v-4').textContent = LinAlg.formatVector(vPerp);
            document.getElementById('sum-sq-4').textContent = sumSq.toFixed(6);
            document.getElementById('norm-v-sq-4').textContent = (normV * normV).toFixed(6);
            document.getElementById('dot-proj-perp-4').textContent = dotProjPerp.toFixed(6);

            // Visualize
            if (is3D) {
                this.visualize3D(v, U, vParallel, vPerp);
            } else {
                this.visualize2D(v.slice(0, 2), U, vParallel, vPerp);
            }
        },

        visualize2D: function(v, U, vParallel, vPerp) {
            const viz = new Viz2D('canvas-4');

            // Draw subspace
            viz.drawSubspace1D(LinAlg.normalize(U[0]));

            // Draw basis vectors
            viz.drawVector([0, 0], U[0], viz.colors.u, 'u', 2);

            // Draw v, vParallel, vPerp
            viz.drawVector([0, 0], v, viz.colors.y, 'v', 3);
            viz.drawVector([0, 0], vParallel, viz.colors.yhat, 'v∥', 3);
            viz.drawVector(vParallel, v, viz.colors.e, 'v⊥', 2);

            // Draw orthogonality symbol
            if (document.getElementById('show-components-4').checked) {
                viz.drawOrthogonalSymbol(vParallel, vPerp, U[0], 0.3);
            }
        },

        visualize3D: function(v, U, vParallel, vPerp) {
            const viz = new Viz3D('canvas-4');

            // Draw subspace (plane through origin)
            if (U.length === 2) {
                const normal = LinAlg.cross(U[0], U[1]);
                viz.drawPlane([0, 0, 0], normal, 3);
            } else {
                viz.drawLine3DInfinite([0, 0, 0], U[0]);
            }

            // Draw basis vectors
            viz.drawVector3D([0, 0, 0], U[0], viz.colors.u, 'u₁', 2);
            if (U.length === 2) {
                viz.drawVector3D([0, 0, 0], U[1], viz.colors.v, 'u₂', 2);
            }

            // Draw v, vParallel, vPerp
            viz.drawVector3D([0, 0, 0], v, viz.colors.y, 'v', 3);
            viz.drawVector3D([0, 0, 0], vParallel, viz.colors.yhat, 'v∥', 3);
            viz.drawVector3D(vParallel, v, viz.colors.e, 'v⊥', 2);
        }
    },

    /**
     * Module 5: OLS in Observation-Space
     */
    module5: {
        init: function() {
            document.getElementById('load-csv-5')?.addEventListener('click', () => {
                document.getElementById('file-input-5').click();
            });

            document.getElementById('file-input-5')?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('data-input-5').value = event.target.result;
                        this.update();
                    };
                    reader.readAsText(file);
                }
            });

            document.getElementById('use-example-5')?.addEventListener('click', () => {
                document.getElementById('data-input-5').value = `1 1 2
1 2 3
1 3 3.5
1 4 5
1 5 5.5`;
                document.getElementById('x-cols-5').value = '0 1';
                document.getElementById('y-col-5').value = '2';
                this.update();
            });

            document.getElementById('parse-data-5')?.addEventListener('click', () => this.update());

            ['x-cols-5', 'y-col-5'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', () => this.update());
            });

            this.update();
        },

        update: function() {
            try {
                const dataStr = document.getElementById('data-input-5').value;
                const data = LinAlg.parseMatrix(dataStr);

                if (data.length === 0) throw new Error('No data');

                const xColsStr = document.getElementById('x-cols-5').value.trim();
                const yCol = parseInt(document.getElementById('y-col-5').value);

                const xCols = xColsStr.split(/\s+/).map(Number);

                // Extract X and y
                const X = data.map(row => xCols.map(col => row[col]));
                const y = data.map(row => row[yCol]);

                const n = X.length;
                const p = X[0].length;

                // Fit OLS
                const beta = LinAlg.ols(X, y);
                const yhat = LinAlg.fitted(X, beta);
                const e = LinAlg.residuals(y, yhat);

                // Statistics
                const ybar = LinAlg.mean(y);
                const tss = LinAlg.sumOfSquares(y.map(yi => yi - ybar));
                const ess = LinAlg.sumOfSquares(yhat.map((yh, i) => yh - ybar));
                const rss = LinAlg.sumOfSquares(e);
                const r2 = LinAlg.rSquared(y, yhat);
                const adjR2 = LinAlg.adjRSquared(y, yhat, p);
                const normE = LinAlg.norm(e);

                // Check orthogonality
                const XTe = LinAlg.matvec(LinAlg.transpose(X), e);
                const maxXTe = Math.max(...XTe.map(Math.abs));
                const isOrthogonal = maxXTe < 1e-6;

                // Update output
                document.getElementById('n-5').textContent = n;
                document.getElementById('p-5').textContent = p;
                document.getElementById('beta-hat-5').textContent = LinAlg.formatVector(beta);
                document.getElementById('tss-5').textContent = tss.toFixed(4);
                document.getElementById('ess-5').textContent = ess.toFixed(4);
                document.getElementById('rss-5').textContent = rss.toFixed(4);
                document.getElementById('r2-5').textContent = r2.toFixed(4);
                document.getElementById('adj-r2-5').textContent = adjR2.toFixed(4);
                document.getElementById('norm-e-5').textContent = normE.toFixed(4);
                document.getElementById('ortho-check-5').innerHTML =
                    `<span style="color:${isOrthogonal ? '#10b981' : '#ef4444'}">${isOrthogonal ? 'YES (max|X\'e| ≈ 0)' : `NO (max|X'e| = ${maxXTe.toFixed(6)})`}</span>`;

                // Store for other modules
                Modules.state.module5Data = { X, y, beta, yhat, e, n, p };

                this.visualize(X, y, beta, yhat, e);

            } catch (err) {
                console.error('Error:', err);
                alert('Error processing data: ' + err.message);
            }
        },

        visualize: function(X, y, beta, yhat, e) {
            const n = X.length;
            const p = X[0].length;

            // Observation space (if n <= 3)
            if (n === 2 || n === 3) {
                if (n === 2) {
                    const viz = new Viz2D('canvas-5a');
                    viz.drawVector([0, 0], y, viz.colors.y, 'y', 3);
                    viz.drawVector([0, 0], yhat, viz.colors.yhat, 'ŷ', 3);
                    viz.drawVector(yhat, y, viz.colors.e, 'e', 2);

                    // Draw column space (line or plane)
                    if (p === 1) {
                        const col = X.map(row => row[0]);
                        viz.drawSubspace1D(col);
                    }
                } else if (n === 3) {
                    const viz = new Viz3D('canvas-5a');
                    viz.drawVector3D([0, 0, 0], y, viz.colors.y, 'y', 3);
                    viz.drawVector3D([0, 0, 0], yhat, viz.colors.yhat, 'ŷ', 3);
                    viz.drawVector3D(yhat, y, viz.colors.e, 'e', 2);

                    // Draw column space
                    if (p === 1) {
                        const col = X.map(row => row[0]);
                        viz.drawLine3DInfinite([0, 0, 0], col);
                    } else if (p === 2) {
                        const col1 = X.map(row => row[0]);
                        const col2 = X.map(row => row[1]);
                        const normal = LinAlg.cross(col1, col2);
                        viz.drawPlane([0, 0, 0], normal, 3);
                    }
                }
            }

            // Data space scatter (if p == 2)
            if (p === 2) {
                const viz = new Viz2D('canvas-5b');
                const points = X.map((row, i) => [row[1], y[i]]);  // Use x (not intercept) and y
                viz.autoViewport(points, 0.2);
                viz.drawScatter(points, viz.colors.y, 5);

                // Draw fitted line
                viz.drawRegressionLine(X, y, beta, viz.colors.yhat);
            }
        }
    },

    /**
     * Module 6: OLS in Parameter-Space
     */
    module6: {
        init: function() {
            document.getElementById('sync-data-6')?.addEventListener('click', () => {
                if (Modules.state.module5Data) {
                    this.update();
                } else {
                    alert('Please run Module 5 first to generate data');
                }
            });

            document.getElementById('contour-levels-6')?.addEventListener('input', (e) => {
                document.getElementById('contour-levels-display-6').textContent = e.target.value;
                this.update();
            });

            ['show-confidence-6', 'show-normal-eq-6'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', () => this.update());
            });
        },

        update: function() {
            const data = Modules.state.module5Data;
            if (!data) {
                document.getElementById('data-info-6').textContent = 'No data loaded. Run Module 5 first.';
                return;
            }

            const { X, y, beta, n, p } = data;

            if (p > 3) {
                document.getElementById('data-info-6').textContent = 'Cannot visualize parameter space for p > 3';
                return;
            }

            document.getElementById('data-info-6').textContent = `Data loaded: n=${n}, p=${p}`;

            // Compute X'X and its properties
            const XT = LinAlg.transpose(X);
            const XTX = LinAlg.multiply(XT, X);

            // Eigenvalues of X'X
            let eigenvalues = 'N/A';
            if (p === 2) {
                const eigen = LinAlg.eigen2x2(XTX);
                if (eigen) {
                    eigenvalues = eigen.values.map(v => v.toFixed(3)).join(', ');
                }
            }

            const condXTX = LinAlg.conditionNumber(XTX);

            // Update output
            document.getElementById('beta-hat-6').textContent = LinAlg.formatVector(beta);
            document.getElementById('xtx-eigen-6').textContent = eigenvalues;
            document.getElementById('cond-xtx-6').textContent = condXTX.toFixed(2);

            const warning = document.getElementById('collinearity-warning-6');
            if (condXTX > 100) {
                warning.textContent = `⚠ High collinearity detected! κ(X'X) = ${condXTX.toFixed(2)}`;
                warning.style.display = 'block';
            } else {
                warning.style.display = 'none';
            }

            if (p === 2) {
                this.visualize2D(X, y, beta);
            }
        },

        visualize2D: function(X, y, beta) {
            // Loss function S(β) = ||y - Xβ||²
            const lossFn = (b0, b1) => {
                const beta_test = [b0, b1];
                const yhat = LinAlg.fitted(X, beta_test);
                const e = LinAlg.subtract(y, yhat);
                return LinAlg.sumOfSquares(e);
            };

            // Set up viewport around beta-hat
            const range = 2;
            const viz = new Viz2D('canvas-6', {
                xMin: beta[0] - range,
                xMax: beta[0] + range,
                yMin: beta[1] - range,
                yMax: beta[1] + range
            });

            // Draw contours
            const nLevels = parseInt(document.getElementById('contour-levels-6').value) || 10;
            viz.drawContours(lossFn, null);

            // Mark beta-hat
            viz.drawPoint(beta[0], beta[1], '#ef4444', 8);
            viz.drawText('β̂', beta[0], beta[1], '#ef4444', 16, 'left');

            // Draw confidence ellipse if enabled
            if (document.getElementById('show-confidence-6').checked) {
                const sigma = LinAlg.sigma(y, LinAlg.fitted(X, beta), X[0].length);
                const XT = LinAlg.transpose(X);
                const XTX = LinAlg.multiply(XT, X);
                const XTXinv = LinAlg.inverse(XTX);
                if (XTXinv) {
                    const covMatrix = XTXinv.map(row => row.map(val => val * sigma * sigma));
                    viz.drawConfidenceEllipse(beta, covMatrix, 1.96, '#2563eb');
                }
            }
        }
    },

    /**
     * Module 7: Inference (t-tests and F-tests)
     */
    module7: {
        init: function() {
            document.getElementById('sync-data-7')?.addEventListener('click', () => {
                if (Modules.state.module5Data) {
                    this.update();
                } else {
                    alert('Please run Module 5 first');
                }
            });

            ['x0-cols-7', 'x1-cols-7'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', () => this.update());
            });

            document.getElementById('test-hypothesis-7')?.addEventListener('click', () => {
                this.testHypothesis();
            });
        },

        update: function() {
            const data = Modules.state.module5Data;
            if (!data) return;

            const { X: X_full, y, n } = data;

            try {
                // Parse column specifications
                const x0Cols = document.getElementById('x0-cols-7').value.trim().split(/\s+/).map(Number);
                const x1Cols = document.getElementById('x1-cols-7').value.trim().split(/\s+/).map(Number);

                // Build X0 and X1
                const X0 = X_full.map(row => x0Cols.map(col => row[col]));
                const X1 = X_full.map(row => x1Cols.map(col => row[col]));

                const p0 = X0[0].length;
                const p1 = X1[0].length;

                // Fit both models
                const beta0 = LinAlg.ols(X0, y);
                const yhat0 = LinAlg.fitted(X0, beta0);
                const e0 = LinAlg.residuals(y, yhat0);
                const rss0 = LinAlg.sumOfSquares(e0);

                const beta1 = LinAlg.ols(X1, y);
                const yhat1 = LinAlg.fitted(X1, beta1);
                const e1 = LinAlg.residuals(y, yhat1);
                const rss1 = LinAlg.sumOfSquares(e1);

                // F-statistic
                const fStat = LinAlg.fStatistic(rss0, rss1, p0, p1, n);

                // p-value (approximate using F-distribution)
                const dfNum = p1 - p0;
                const dfDenom = n - p1;
                const pValue = 1 - this.fCDF(fStat, dfNum, dfDenom);

                // Update output
                document.getElementById('rss0-7').textContent = rss0.toFixed(4);
                document.getElementById('df0-7').textContent = p0;
                document.getElementById('rss1-7').textContent = rss1.toFixed(4);
                document.getElementById('df1-7').textContent = p1;
                document.getElementById('f-stat-7').textContent = fStat.toFixed(4);
                document.getElementById('p-value-7').textContent = pValue.toFixed(6);

                // t-tests for individual coefficients in full model
                const sigma1 = LinAlg.sigma(y, yhat1, p1);
                const se1 = LinAlg.standardErrors(X1, sigma1);
                const tStats = LinAlg.tStats(beta1, se1);
                const tPValues = LinAlg.tPValues(tStats, n - p1);

                const tTestsHTML = beta1.map((b, i) => `
                    <p>β${i}: coef=${b.toFixed(4)}, SE=${se1[i].toFixed(4)}, t=${tStats[i].toFixed(3)}, p=${tPValues[i].toFixed(4)}</p>
                `).join('');
                document.getElementById('t-tests-7').innerHTML = tTestsHTML;

                this.visualize(X0, X1, y, yhat0, yhat1, beta1);

            } catch (err) {
                console.error('Error:', err);
                alert('Error: ' + err.message);
            }
        },

        fCDF: function(x, d1, d2) {
            // Approximation for F-distribution CDF
            // Using incomplete beta function approximation
            const t = d1 * x / (d1 * x + d2);
            return this.betaCDF(t, d1 / 2, d2 / 2);
        },

        betaCDF: function(x, a, b) {
            // Very rough approximation of incomplete beta function
            if (x <= 0) return 0;
            if (x >= 1) return 1;
            // Use normal approximation for large a, b
            const mean = a / (a + b);
            const variance = a * b / ((a + b) * (a + b) * (a + b + 1));
            const z = (x - mean) / Math.sqrt(variance);
            return LinAlg.normalCDF(z);
        },

        testHypothesis: function() {
            // General linear hypothesis test Rβ = r
            // This is more advanced - simplified implementation
            alert('General hypothesis test not fully implemented in this demo');
        },

        visualize: function(X0, X1, y, yhat0, yhat1, beta1) {
            const n = y.length;

            // Observation space
            if (n === 2 || n === 3) {
                if (n === 2) {
                    const viz = new Viz2D('canvas-7a');
                    viz.drawVector([0, 0], y, viz.colors.y, 'y', 3);
                    viz.drawVector([0, 0], yhat0, '#f59e0b', 'ŷ₀', 2);
                    viz.drawVector([0, 0], yhat1, viz.colors.yhat, 'ŷ₁', 3);
                } else if (n === 3) {
                    const viz = new Viz3D('canvas-7a');
                    viz.drawVector3D([0, 0, 0], y, viz.colors.y, 'y', 3);
                    viz.drawVector3D([0, 0, 0], yhat0, '#f59e0b', 'ŷ₀', 2);
                    viz.drawVector3D([0, 0, 0], yhat1, viz.colors.yhat, 'ŷ₁', 3);
                }
            }

            // Parameter space (if p = 2)
            if (beta1.length === 2) {
                const viz = new Viz2D('canvas-7b');
                viz.drawPoint(beta1[0], beta1[1], viz.colors.yhat, 8);
                viz.drawText('β̂', beta1[0], beta1[1], viz.colors.yhat, 16);
            }
        }
    },

    /**
     * Module 8: Diagnostics & Conditioning
     */
    module8: {
        points: [],
        draggingIndex: -1,

        init: function() {
            document.getElementById('sync-data-8')?.addEventListener('click', () => {
                if (Modules.state.module5Data) {
                    const { X, y } = Modules.state.module5Data;
                    // Convert to points (assuming simple linear regression)
                    if (X[0].length === 2) {
                        this.points = X.map((row, i) => [row[1], y[i]]);
                        this.update();
                    }
                } else {
                    alert('Please run Module 5 first');
                }
            });

            document.getElementById('reset-data-8')?.addEventListener('click', () => {
                this.points = [[1, 2], [2, 3], [3, 3.5], [4, 5], [5, 5.5]];
                this.update();
            });

            ['show-leverage-8', 'show-cooks-8'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', () => this.update());
            });

            // Interactive canvas
            const canvas = document.getElementById('canvas-8a');
            canvas.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect();
                const sx = e.clientX - rect.left;
                const sy = e.clientY - rect.top;

                // Create temporary viz to get world coordinates
                const viz = new Viz2D('canvas-8a');
                const [x, y] = viz.toWorld(sx, sy);

                this.points.push([x, y]);
                this.update();
            });

            // Initialize with default points
            this.points = [[1, 2], [2, 3], [3, 3.5], [4, 5], [5, 5.5]];
            this.update();
        },

        update: function() {
            if (this.points.length < 2) return;

            // Build X and y for simple linear regression
            const y = this.points.map(p => p[1]);
            const X = this.points.map(p => [1, p[0]]);

            const n = X.length;
            const p = 2;

            // Fit OLS
            const beta = LinAlg.ols(X, y);
            const yhat = LinAlg.fitted(X, beta);
            const e = LinAlg.residuals(y, yhat);
            const sigma_est = LinAlg.sigma(y, yhat, p);

            // Diagnostics
            const h = LinAlg.leverage(X);
            const cooks = LinAlg.cooksDistance(e, h, p, sigma_est);

            // Find max values
            const maxLev = Math.max(...h);
            const maxLevIdx = h.indexOf(maxLev);
            const maxCooks = Math.max(...cooks);
            const maxCooksIdx = cooks.indexOf(maxCooks);

            // Update output
            document.getElementById('max-lev-8').textContent = maxLev.toFixed(4);
            document.getElementById('max-lev-idx-8').textContent = maxLevIdx + 1;
            document.getElementById('max-cooks-8').textContent = maxCooks.toFixed(4);
            document.getElementById('max-cooks-idx-8').textContent = maxCooksIdx + 1;

            const warning = document.getElementById('diagnostics-warning-8');
            if (maxCooks > 0.5) {
                warning.textContent = `⚠ Point ${maxCooksIdx + 1} has high influence (Cook's D = ${maxCooks.toFixed(4)})`;
                warning.style.display = 'block';
            } else if (maxLev > 2 * p / n) {
                warning.textContent = `⚠ Point ${maxLevIdx + 1} has high leverage (h = ${maxLev.toFixed(4)})`;
                warning.style.display = 'block';
            } else {
                warning.style.display = 'none';
            }

            this.visualize(X, y, beta, yhat, e, h, cooks);
        },

        visualize: function(X, y, beta, yhat, e, h, cooks) {
            // Data and fitted line
            const viz1 = new Viz2D('canvas-8a');
            viz1.autoViewport(this.points, 0.2);
            this.points.forEach(p => viz1.drawPoint(p[0], p[1], viz1.colors.y, 5));
            viz1.drawRegressionLine(X, y, beta, viz1.colors.yhat);

            // Diagnostics plot: leverage vs residuals
            const viz2 = new Viz2D('canvas-8b', {
                xMin: 0,
                xMax: Math.max(...h) * 1.2,
                yMin: Math.min(...e) * 1.2,
                yMax: Math.max(...e) * 1.2
            });

            h.forEach((hi, i) => {
                const radius = 3 + cooks[i] * 20;  // Size by Cook's distance
                viz2.drawPoint(hi, e[i], viz2.colors.y, radius);
            });

            viz2.drawText('Leverage', viz2.options.xMax * 0.5, viz2.options.yMin * 0.9, '#64748b', 14, 'center');
            viz2.drawText('Residual', viz2.options.xMin * 0.1, viz2.options.yMax * 0.9, '#64748b', 14, 'left');
        }
    },

    /**
     * Module 9: Extensions
     */
    module9: {
        init: function() {
            document.getElementById('extension-type-9')?.addEventListener('change', () => {
                const type = document.getElementById('extension-type-9').value;
                this.switchExtension(type);
            });

            document.getElementById('sync-data-9')?.addEventListener('click', () => {
                if (Modules.state.module5Data) {
                    this.update();
                } else {
                    alert('Please run Module 5 first');
                }
            });

            ['lambda-ridge-9', 'lambda-lasso-9'].forEach(id => {
                document.getElementById(id)?.addEventListener('input', (e) => {
                    const displayId = id === 'lambda-ridge-9' ? 'lambda-display-9' : 'lambda-lasso-display-9';
                    document.getElementById(displayId).textContent = e.target.value;
                    this.update();
                });
            });

            document.getElementById('weights-9')?.addEventListener('input', () => this.update());

            this.switchExtension('ridge');
        },

        switchExtension: function(type) {
            // Hide all controls
            document.getElementById('ridge-controls-9').style.display = 'none';
            document.getElementById('lasso-controls-9').style.display = 'none';
            document.getElementById('wls-controls-9').style.display = 'none';

            // Hide all outputs
            document.getElementById('ridge-output-9').style.display = 'none';
            document.getElementById('lasso-output-9').style.display = 'none';
            document.getElementById('wls-output-9').style.display = 'none';

            // Show relevant controls and outputs
            if (type === 'ridge') {
                document.getElementById('ridge-controls-9').style.display = 'block';
                document.getElementById('ridge-output-9').style.display = 'block';
                document.getElementById('extension-title-9').textContent = 'Ridge Regression: Contours + L2 Penalty Ball';
            } else if (type === 'lasso') {
                document.getElementById('lasso-controls-9').style.display = 'block';
                document.getElementById('lasso-output-9').style.display = 'block';
                document.getElementById('extension-title-9').textContent = 'Lasso: Contours + L1 Penalty Diamond';
            } else if (type === 'pca') {
                document.getElementById('extension-title-9').textContent = 'PCA vs OLS Subspaces';
            } else if (type === 'wls') {
                document.getElementById('wls-controls-9').style.display = 'block';
                document.getElementById('wls-output-9').style.display = 'block';
                document.getElementById('extension-title-9').textContent = 'Weighted Least Squares';
            }

            this.update();
        },

        update: function() {
            const data = Modules.state.module5Data;
            if (!data) return;

            const type = document.getElementById('extension-type-9').value;
            const { X, y, beta: olsBeta } = data;

            document.getElementById('ols-beta-9').textContent = LinAlg.formatVector(olsBeta);

            if (type === 'ridge') {
                this.updateRidge(X, y, olsBeta);
            } else if (type === 'lasso') {
                this.updateLasso(X, y, olsBeta);
            } else if (type === 'wls') {
                this.updateWLS(X, y, olsBeta);
            }
        },

        updateRidge: function(X, y, olsBeta) {
            const lambda = parseFloat(document.getElementById('lambda-ridge-9').value) || 0;

            // Ridge regression: β_ridge = (X'X + λI)^(-1) X'y
            const XT = LinAlg.transpose(X);
            const XTX = LinAlg.multiply(XT, X);
            const p = XTX.length;

            // Add λI
            const XTX_ridge = XTX.map((row, i) => row.map((val, j) => val + (i === j ? lambda : 0)));

            const XTy = LinAlg.matvec(XT, y);
            const XTX_ridge_inv = LinAlg.inverse(XTX_ridge);

            if (XTX_ridge_inv) {
                const ridgeBeta = LinAlg.matvec(XTX_ridge_inv, XTy);
                document.getElementById('ridge-beta-9').textContent = LinAlg.formatVector(ridgeBeta);

                // Visualize if p = 2
                if (p === 2) {
                    this.visualizeRidge(X, y, olsBeta, ridgeBeta, lambda);
                }
            }
        },

        visualizeRidge: function(X, y, olsBeta, ridgeBeta, lambda) {
            const lossFn = (b0, b1) => {
                const beta_test = [b0, b1];
                const yhat = LinAlg.fitted(X, beta_test);
                const e = LinAlg.subtract(y, yhat);
                return LinAlg.sumOfSquares(e);
            };

            const range = 3;
            const viz = new Viz2D('canvas-9', {
                xMin: olsBeta[0] - range,
                xMax: olsBeta[0] + range,
                yMin: olsBeta[1] - range,
                yMax: olsBeta[1] + range
            });

            // Draw contours
            viz.drawContours(lossFn, null);

            // Draw L2 penalty ball centered at origin
            const penaltyRadius = Math.sqrt(lambda);
            viz.drawEllipse(0, 0, penaltyRadius, penaltyRadius, 0, '#ef4444', false, 3);

            // Mark OLS and ridge solutions
            viz.drawPoint(olsBeta[0], olsBeta[1], viz.colors.yhat, 8);
            viz.drawText('OLS', olsBeta[0], olsBeta[1], viz.colors.yhat, 14);

            viz.drawPoint(ridgeBeta[0], ridgeBeta[1], '#ef4444', 8);
            viz.drawText('Ridge', ridgeBeta[0], ridgeBeta[1], '#ef4444', 14);
        },

        updateLasso: function(X, y, olsBeta) {
            // Lasso is complex to solve analytically - just show qualitative visualization
            const lambda = parseFloat(document.getElementById('lambda-lasso-9').value) || 0;

            document.getElementById('lasso-beta-9').textContent = 'Qualitative visualization only';

            // Qualitative visualization
            if (olsBeta.length === 2) {
                this.visualizeLasso(X, y, olsBeta, lambda);
            }
        },

        visualizeLasso: function(X, y, olsBeta, lambda) {
            const lossFn = (b0, b1) => {
                const beta_test = [b0, b1];
                const yhat = LinAlg.fitted(X, beta_test);
                const e = LinAlg.subtract(y, yhat);
                return LinAlg.sumOfSquares(e);
            };

            const range = 3;
            const viz = new Viz2D('canvas-9', {
                xMin: olsBeta[0] - range,
                xMax: olsBeta[0] + range,
                yMin: olsBeta[1] - range,
                yMax: olsBeta[1] + range
            });

            // Draw contours
            viz.drawContours(lossFn, null);

            // Draw L1 diamond constraint |β0| + |β1| <= t
            const t = 2;
            const diamond = [[t, 0], [0, t], [-t, 0], [0, -t], [t, 0]];
            for (let i = 0; i < diamond.length - 1; i++) {
                viz.drawLine(diamond[i][0], diamond[i][1], diamond[i + 1][0], diamond[i + 1][1], '#ef4444', 3);
            }

            // Mark OLS
            viz.drawPoint(olsBeta[0], olsBeta[1], viz.colors.yhat, 8);
            viz.drawText('OLS', olsBeta[0], olsBeta[1], viz.colors.yhat, 14);
        },

        updateWLS: function(X, y, olsBeta) {
            const weightsStr = document.getElementById('weights-9').value.trim();
            if (!weightsStr) {
                document.getElementById('wls-beta-9').textContent = 'Enter weights';
                return;
            }

            const weights = weightsStr.split(/\s+/).map(Number);
            if (weights.length !== y.length) {
                alert('Number of weights must match number of observations');
                return;
            }

            // WLS: minimize (y - Xβ)'W(y - Xβ) where W = diag(weights)
            // Solution: β_wls = (X'WX)^(-1) X'Wy

            const W = LinAlg.zeros(weights.length, weights.length);
            weights.forEach((w, i) => W[i][i] = w);

            const XT = LinAlg.transpose(X);
            const WX = LinAlg.multiply(W, X);
            const XTWX = LinAlg.multiply(XT, WX);
            const Wy = LinAlg.matvec(W, y);
            const XTWy = LinAlg.matvec(XT, Wy);

            const XTWX_inv = LinAlg.inverse(XTWX);
            if (XTWX_inv) {
                const wlsBeta = LinAlg.matvec(XTWX_inv, XTWy);
                document.getElementById('wls-beta-9').textContent = LinAlg.formatVector(wlsBeta);
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modules;
}
