/**
 * 2D Visualization Engine using Canvas
 * Handles vectors, arrows, grids, subspaces, contours, scatter plots
 */

class Viz2D {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas ${canvasId} not found`);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Default options
        this.options = {
            xMin: options.xMin || -5,
            xMax: options.xMax || 5,
            yMin: options.yMin || -5,
            yMax: options.yMax || 5,
            backgroundColor: options.backgroundColor || '#ffffff',
            axisColor: options.axisColor || '#94a3b8',
            gridColor: options.gridColor || '#e2e8f0',
            showGrid: options.showGrid !== undefined ? options.showGrid : true,
            showAxes: options.showAxes !== undefined ? options.showAxes : true,
            ...options
        };

        this.colors = {
            u: '#E69F00',
            v: '#56B4E9',
            w: '#009E73',
            y: '#F0E442',
            yhat: '#0072B2',
            e: '#D55E00',
            subspace: 'rgba(204, 121, 167, 0.3)',
            subspaceBorder: '#CC79A7'
        };

        this.init();
    }

    init() {
        this.clear();
        if (this.options.showGrid) this.drawGrid();
        if (this.options.showAxes) this.drawAxes();
    }

    clear() {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Coordinate transformation
    toScreen(x, y) {
        const sx = (x - this.options.xMin) / (this.options.xMax - this.options.xMin) * this.width;
        const sy = (1 - (y - this.options.yMin) / (this.options.yMax - this.options.yMin)) * this.height;
        return [sx, sy];
    }

    toWorld(sx, sy) {
        const x = sx / this.width * (this.options.xMax - this.options.xMin) + this.options.xMin;
        const y = (1 - sy / this.height) * (this.options.yMax - this.options.yMin) + this.options.yMin;
        return [x, y];
    }

    drawGrid() {
        this.ctx.strokeStyle = this.options.gridColor;
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = Math.ceil(this.options.xMin); x <= this.options.xMax; x++) {
            const [sx, sy1] = this.toScreen(x, this.options.yMin);
            const [_, sy2] = this.toScreen(x, this.options.yMax);
            this.ctx.beginPath();
            this.ctx.moveTo(sx, sy1);
            this.ctx.lineTo(sx, sy2);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = Math.ceil(this.options.yMin); y <= this.options.yMax; y++) {
            const [sx1, sy] = this.toScreen(this.options.xMin, y);
            const [sx2, _] = this.toScreen(this.options.xMax, y);
            this.ctx.beginPath();
            this.ctx.moveTo(sx1, sy);
            this.ctx.lineTo(sx2, sy);
            this.ctx.stroke();
        }
    }

    drawAxes() {
        this.ctx.strokeStyle = this.options.axisColor;
        this.ctx.lineWidth = 2;

        // X-axis
        const [sx1, sy1] = this.toScreen(this.options.xMin, 0);
        const [sx2, sy2] = this.toScreen(this.options.xMax, 0);
        this.ctx.beginPath();
        this.ctx.moveTo(sx1, sy1);
        this.ctx.lineTo(sx2, sy2);
        this.ctx.stroke();

        // Y-axis
        const [sx3, sy3] = this.toScreen(0, this.options.yMin);
        const [sx4, sy4] = this.toScreen(0, this.options.yMax);
        this.ctx.beginPath();
        this.ctx.moveTo(sx3, sy3);
        this.ctx.lineTo(sx4, sy4);
        this.ctx.stroke();

        // Labels
        this.ctx.fillStyle = this.options.axisColor;
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('x', sx2 - 20, sy2 + 20);
        this.ctx.textAlign = 'left';
        this.ctx.fillText('y', sx4 + 10, sy4 + 5);
    }

    drawVector(from, to, color, label = '', lineWidth = 2) {
        const [x1, y1] = from;
        const [x2, y2] = to;
        const [sx1, sy1] = this.toScreen(x1, y1);
        const [sx2, sy2] = this.toScreen(x2, y2);

        // Draw line
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(sx1, sy1);
        this.ctx.lineTo(sx2, sy2);
        this.ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(sy2 - sy1, sx2 - sx1);
        const headLen = 10;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(sx2, sy2);
        this.ctx.lineTo(
            sx2 - headLen * Math.cos(angle - Math.PI / 6),
            sy2 - headLen * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.lineTo(
            sx2 - headLen * Math.cos(angle + Math.PI / 6),
            sy2 - headLen * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.closePath();
        this.ctx.fill();

        // Draw label
        if (label) {
            this.ctx.fillStyle = color;
            this.ctx.font = 'bold 16px sans-serif';
            this.ctx.fillText(label, sx2 + 10, sy2 - 10);
        }
    }

    drawPoint(x, y, color, radius = 5) {
        const [sx, sy] = this.toScreen(x, y);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawLine(x1, y1, x2, y2, color, lineWidth = 2, dashed = false) {
        const [sx1, sy1] = this.toScreen(x1, y1);
        const [sx2, sy2] = this.toScreen(x2, y2);

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        if (dashed) {
            this.ctx.setLineDash([5, 5]);
        } else {
            this.ctx.setLineDash([]);
        }

        this.ctx.beginPath();
        this.ctx.moveTo(sx1, sy1);
        this.ctx.lineTo(sx2, sy2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawSubspace1D(direction, color = null) {
        // Draw a line through origin in given direction
        color = color || this.colors.subspace;
        const [dx, dy] = direction;
        const scale = 100; // Long enough to span viewport

        const x1 = -scale * dx;
        const y1 = -scale * dy;
        const x2 = scale * dx;
        const y2 = scale * dy;

        this.drawLine(x1, y1, x2, y2, this.colors.subspaceBorder, 3, true);
    }

    drawSubspace2D(basis1, basis2, color = null) {
        // For 2D subspace in 3D, we'd need 3D rendering
        // For now, fill the entire plane if in 2D space
        color = color || this.colors.subspace;

        // Draw the parallelogram spanned by basis vectors scaled to viewport
        const scale = 10;
        const corners = [
            [0, 0],
            [scale * basis1[0], scale * basis1[1]],
            [scale * (basis1[0] + basis2[0]), scale * (basis1[1] + basis2[1])],
            [scale * basis2[0], scale * basis2[1]]
        ];

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        const [sx0, sy0] = this.toScreen(corners[0][0], corners[0][1]);
        this.ctx.moveTo(sx0, sy0);
        for (let i = 1; i < corners.length; i++) {
            const [sx, sy] = this.toScreen(corners[i][0], corners[i][1]);
            this.ctx.lineTo(sx, sy);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawScatter(points, color = '#0072B2', radius = 4) {
        points.forEach(([x, y]) => {
            this.drawPoint(x, y, color, radius);
        });
    }

    drawFunction(fn, color = '#0072B2', lineWidth = 2) {
        // Draw a function y = fn(x)
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();

        let first = true;
        for (let x = this.options.xMin; x <= this.options.xMax; x += 0.1) {
            const y = fn(x);
            if (y >= this.options.yMin && y <= this.options.yMax) {
                const [sx, sy] = this.toScreen(x, y);
                if (first) {
                    this.ctx.moveTo(sx, sy);
                    first = false;
                } else {
                    this.ctx.lineTo(sx, sy);
                }
            }
        }
        this.ctx.stroke();
    }

    drawContours(fn, levels, colors = null) {
        // Draw contour lines for a 2D function z = fn(x, y)
        const resolution = 50;
        const dx = (this.options.xMax - this.options.xMin) / resolution;
        const dy = (this.options.yMax - this.options.yMin) / resolution;

        // Compute grid values
        const grid = [];
        for (let i = 0; i <= resolution; i++) {
            grid[i] = [];
            const y = this.options.yMin + i * dy;
            for (let j = 0; j <= resolution; j++) {
                const x = this.options.xMin + j * dx;
                grid[i][j] = fn(x, y);
            }
        }

        // Find min and max for level generation
        let minVal = Infinity, maxVal = -Infinity;
        for (let i = 0; i <= resolution; i++) {
            for (let j = 0; j <= resolution; j++) {
                minVal = Math.min(minVal, grid[i][j]);
                maxVal = Math.max(maxVal, grid[i][j]);
            }
        }

        // Generate levels if not provided
        if (!levels) {
            levels = [];
            for (let i = 0; i <= 10; i++) {
                levels.push(minVal + (maxVal - minVal) * i / 10);
            }
        }

        // Draw contours using marching squares (simplified)
        levels.forEach((level, idx) => {
            const color = colors ? colors[idx % colors.length] : `hsl(${idx * 30}, 70%, 50%)`;
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1.5;

            for (let i = 0; i < resolution; i++) {
                for (let j = 0; j < resolution; j++) {
                    const x = this.options.xMin + j * dx;
                    const y = this.options.yMin + i * dy;

                    // Check if contour passes through this cell
                    const v00 = grid[i][j];
                    const v10 = grid[i][j + 1];
                    const v01 = grid[i + 1][j];
                    const v11 = grid[i + 1][j + 1];

                    // Simple check: draw if level is between min and max of cell
                    const cellMin = Math.min(v00, v10, v01, v11);
                    const cellMax = Math.max(v00, v10, v01, v11);

                    if (level >= cellMin && level <= cellMax) {
                        // Draw a segment (simplified - just draw cell outline)
                        const [sx, sy] = this.toScreen(x, y);
                        const [sx2, sy2] = this.toScreen(x + dx, y + dy);
                        this.ctx.strokeRect(sx, sy2, sx2 - sx, sy - sy2);
                    }
                }
            }
        });
    }

    drawEllipse(cx, cy, rx, ry, rotation = 0, color = '#0072B2', fill = false, lineWidth = 2) {
        const [scx, scy] = this.toScreen(cx, cy);

        // Scale radii to screen coordinates (approximate)
        const scale_x = this.width / (this.options.xMax - this.options.xMin);
        const scale_y = this.height / (this.options.yMax - this.options.yMin);
        const srx = rx * scale_x;
        const sry = ry * scale_y;

        this.ctx.save();
        this.ctx.translate(scx, scy);
        this.ctx.rotate(rotation);

        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, srx, sry, 0, 0, 2 * Math.PI);

        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawConfidenceEllipse(center, covMatrix, scale = 1.96, color = '#0072B2') {
        // Draw confidence ellipse from covariance matrix
        // scale = 1.96 for 95% confidence

        // Eigendecomposition for ellipse parameters
        const [[a, b], [c, d]] = covMatrix;
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;

        if (discriminant < 0) return; // Complex eigenvalues

        const sqrtDisc = Math.sqrt(discriminant);
        const lambda1 = (trace + sqrtDisc) / 2;
        const lambda2 = (trace - sqrtDisc) / 2;

        // Eigenvector for largest eigenvalue
        let angle = 0;
        if (Math.abs(b) > 1e-10) {
            angle = Math.atan2(lambda1 - a, b);
        } else if (Math.abs(c) > 1e-10) {
            angle = Math.atan2(c, lambda1 - d);
        }

        const rx = scale * Math.sqrt(lambda1);
        const ry = scale * Math.sqrt(lambda2);

        this.drawEllipse(center[0], center[1], rx, ry, angle, color, false, 2);
    }

    drawRegressionLine(X, y, beta, color = '#0072B2') {
        // For simple linear regression, draw the fitted line
        if (X[0].length === 2) {
            // y = β0 + β1*x
            const fn = (x) => beta[0] + beta[1] * x;
            this.drawFunction(fn, color, 3);
        }
    }

    drawText(text, x, y, color = '#1e293b', fontSize = 14, align = 'left') {
        const [sx, sy] = this.toScreen(x, y);
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px sans-serif`;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, sx, sy);
    }

    // Interactive features
    addClickListener(callback) {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;
            const [x, y] = this.toWorld(sx, sy);
            callback(x, y);
        });
    }

    addHoverListener(callback) {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;
            const [x, y] = this.toWorld(sx, sy);
            callback(x, y);
        });
    }

    setViewport(xMin, xMax, yMin, yMax) {
        this.options.xMin = xMin;
        this.options.xMax = xMax;
        this.options.yMin = yMin;
        this.options.yMax = yMax;
        this.init();
    }

    // Auto-adjust viewport to fit data
    autoViewport(points, padding = 0.1) {
        if (points.length === 0) return;

        let xMin = Infinity, xMax = -Infinity;
        let yMin = Infinity, yMax = -Infinity;

        points.forEach(([x, y]) => {
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
            yMin = Math.min(yMin, y);
            yMax = Math.max(yMax, y);
        });

        const xRange = xMax - xMin;
        const yRange = yMax - yMin;

        this.setViewport(
            xMin - padding * xRange,
            xMax + padding * xRange,
            yMin - padding * yRange,
            yMax + padding * yRange
        );
    }

    // Export canvas as image
    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }

    // Draw orthogonality indicator (right angle symbol)
    drawOrthogonalSymbol(point, dir1, dir2, size = 0.3, color = '#64748b') {
        const [px, py] = point;
        const [d1x, d1y] = LinAlg.normalize(dir1);
        const [d2x, d2y] = LinAlg.normalize(dir2);

        const corner = [px + d1x * size, py + d1y * size];
        const p1 = [corner[0] + d2x * size, corner[1] + d2y * size];
        const p2 = corner;
        const p3 = [px + d2x * size, py + d2y * size];

        this.drawLine(p1[0], p1[1], p2[0], p2[1], color, 1.5);
        this.drawLine(p2[0], p2[1], p3[0], p3[1], color, 1.5);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Viz2D;
}
