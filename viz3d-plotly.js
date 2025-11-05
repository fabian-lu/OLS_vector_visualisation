/**
 * Plotly.js 3D Visualization Engine
 * Scientific 3D visualization using Plotly.js library
 */

class Viz3DPlotly {
    constructor(canvasId, options = {}) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas ${canvasId} not found`);
            return;
        }

        // Replace canvas with div for Plotly
        this.container = document.createElement('div');
        this.container.id = canvasId + '-plotly';
        this.container.style.width = this.canvas.width + 'px';
        this.container.style.height = this.canvas.height + 'px';
        this.canvas.parentNode.replaceChild(this.container, this.canvas);

        this.width = parseInt(this.container.style.width);
        this.height = parseInt(this.container.style.height);

        // Scene bounds
        this.bounds = {
            xMin: options.xMin || -3,
            xMax: options.xMax || 3,
            yMin: options.yMin || -3,
            yMax: options.yMax || 3,
            zMin: options.zMin || -3,
            zMax: options.zMax || 3
        };

        this.options = {
            backgroundColor: options.backgroundColor || '#ffffff',
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

        this.traces = []; // Store all traces
        this.init();
    }

    init() {
        // Create initial layout
        this.layout = {
            scene: {
                xaxis: {
                    title: 'X',
                    showgrid: this.options.showGrid,
                    range: [this.bounds.xMin, this.bounds.xMax]
                },
                yaxis: {
                    title: 'Y',
                    showgrid: this.options.showGrid,
                    range: [this.bounds.yMin, this.bounds.yMax]
                },
                zaxis: {
                    title: 'Z',
                    showgrid: this.options.showGrid,
                    range: [this.bounds.zMin, this.bounds.zMax]
                },
                camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                },
                aspectmode: 'cube'
            },
            margin: { l: 0, r: 0, t: 0, b: 0 },
            paper_bgcolor: this.options.backgroundColor,
            plot_bgcolor: this.options.backgroundColor,
            showlegend: false
        };

        this.config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['toImage', 'sendDataToCloud']
        };

        // Initialize empty plot
        Plotly.newPlot(this.container, [], this.layout, this.config);
    }

    clear() {
        this.traces = [];
        this.render();
    }

    render() {
        Plotly.react(this.container, this.traces, this.layout, this.config);
    }

    drawVector3D(from, to, color, label = '', lineWidth = 6) {
        const [x1, y1, z1] = from;
        const [x2, y2, z2] = to;

        // Draw line for vector shaft
        const lineTrace = {
            type: 'scatter3d',
            mode: 'lines',
            x: [x1, x2],
            y: [y1, y2],
            z: [z1, z2],
            line: {
                color: color,
                width: lineWidth
            },
            hoverinfo: 'text',
            text: label || 'Vector',
            showlegend: false
        };
        this.traces.push(lineTrace);

        // Draw arrowhead using cone
        const dir = [x2 - x1, y2 - y1, z2 - z1];
        const length = Math.sqrt(dir[0]**2 + dir[1]**2 + dir[2]**2);
        const coneLength = length * 0.15;

        const coneTrace = {
            type: 'cone',
            x: [x2],
            y: [y2],
            z: [z2],
            u: [dir[0]],
            v: [dir[1]],
            w: [dir[2]],
            sizemode: 'absolute',
            sizeref: coneLength,
            colorscale: [[0, color], [1, color]],
            showscale: false,
            hoverinfo: 'skip'
        };
        this.traces.push(coneTrace);

        // Add label if provided
        if (label) {
            const textTrace = {
                type: 'scatter3d',
                mode: 'text',
                x: [x2 + 0.3],
                y: [y2 + 0.3],
                z: [z2],
                text: [label],
                textfont: {
                    size: 14,
                    color: color
                },
                hoverinfo: 'skip',
                showlegend: false
            };
            this.traces.push(textTrace);
        }
    }

    drawPoint3D(x, y, z, color, radius = 0.1) {
        const trace = {
            type: 'scatter3d',
            mode: 'markers',
            x: [x],
            y: [y],
            z: [z],
            marker: {
                size: radius * 50, // Scale for visibility
                color: color,
                line: {
                    color: 'rgba(0, 0, 0, 0.3)',
                    width: 1
                }
            },
            hoverinfo: 'text',
            text: `(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`,
            showlegend: false
        };
        this.traces.push(trace);
    }

    drawLine3D(from, to, color, lineWidth = 2, dashed = false) {
        const [x1, y1, z1] = from;
        const [x2, y2, z2] = to;

        const trace = {
            type: 'scatter3d',
            mode: 'lines',
            x: [x1, x2],
            y: [y1, y2],
            z: [z1, z2],
            line: {
                color: color,
                width: lineWidth,
                dash: dashed ? 'dash' : 'solid'
            },
            hoverinfo: 'skip',
            showlegend: false
        };
        this.traces.push(trace);
    }

    drawPlane(point, normal, size = 3, color = null) {
        const planeColor = color || this.colors.subspace;

        // Create two perpendicular vectors in the plane
        const [nx, ny, nz] = LinAlg.normalize(normal);

        let v1, v2;
        if (Math.abs(nx) < 0.9) {
            v1 = LinAlg.cross(normal, [1, 0, 0]);
        } else {
            v1 = LinAlg.cross(normal, [0, 1, 0]);
        }
        v1 = LinAlg.normalize(v1);
        v2 = LinAlg.cross(normal, v1);
        v2 = LinAlg.normalize(v2);

        // Create grid of points for the plane
        const gridSize = 20;
        const x = [], y = [], z = [];

        for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
            for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
                const t1 = (i / gridSize) * size * 2;
                const t2 = (j / gridSize) * size * 2;

                const px = point[0] + t1 * v1[0] + t2 * v2[0];
                const py = point[1] + t1 * v1[1] + t2 * v2[1];
                const pz = point[2] + t1 * v1[2] + t2 * v2[2];

                x.push(px);
                y.push(py);
                z.push(pz);
            }
        }

        const trace = {
            type: 'mesh3d',
            x: x,
            y: y,
            z: z,
            opacity: 0.3,
            color: planeColor,
            hoverinfo: 'skip',
            showlegend: false
        };
        this.traces.push(trace);
    }

    drawLine3DInfinite(point, direction, color = null) {
        const lineColor = color || this.colors.subspaceBorder;
        const scale = 10;

        const dir = LinAlg.normalize(direction);
        const p1 = LinAlg.add(point, LinAlg.scale(dir, -scale));
        const p2 = LinAlg.add(point, LinAlg.scale(dir, scale));

        this.drawLine3D(p1, p2, lineColor, 2, true);
    }

    drawScatter3D(points, color = '#0072B2', radius = 0.08) {
        const x = points.map(p => p[0]);
        const y = points.map(p => p[1]);
        const z = points.map(p => p[2]);

        const trace = {
            type: 'scatter3d',
            mode: 'markers',
            x: x,
            y: y,
            z: z,
            marker: {
                size: radius * 50,
                color: color,
                line: {
                    color: 'rgba(0, 0, 0, 0.3)',
                    width: 1
                }
            },
            hovertemplate: '(%{x:.2f}, %{y:.2f}, %{z:.2f})<extra></extra>',
            showlegend: false
        };
        this.traces.push(trace);
    }

    drawText3D(text, x, y, z, color = '#1e293b', fontSize = 14) {
        const trace = {
            type: 'scatter3d',
            mode: 'text',
            x: [x],
            y: [y],
            z: [z],
            text: [text],
            textfont: {
                size: fontSize,
                color: color
            },
            hoverinfo: 'skip',
            showlegend: false
        };
        this.traces.push(trace);
    }

    setCameraPosition(x, y, z) {
        this.layout.scene.camera.eye = { x: x / 5, y: y / 5, z: z / 5 };
        this.render();
    }

    setCameraRotation(yaw, pitch) {
        // Plotly handles rotation through interaction
        // This method kept for API compatibility
    }

    autoViewport(points, padding = 1.5) {
        if (points.length === 0) return;

        let xMin = Infinity, xMax = -Infinity;
        let yMin = Infinity, yMax = -Infinity;
        let zMin = Infinity, zMax = -Infinity;

        points.forEach(([x, y, z]) => {
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
            yMin = Math.min(yMin, y);
            yMax = Math.max(yMax, y);
            zMin = Math.min(zMin, z);
            zMax = Math.max(zMax, z);
        });

        this.layout.scene.xaxis.range = [xMin - padding, xMax + padding];
        this.layout.scene.yaxis.range = [yMin - padding, yMax + padding];
        this.layout.scene.zaxis.range = [zMin - padding, zMax + padding];

        const centerX = (xMin + xMax) / 2;
        const centerY = (yMin + yMax) / 2;
        const centerZ = (zMin + zMax) / 2;

        this.layout.scene.camera.center = { x: centerX / 5, y: centerY / 5, z: centerZ / 5 };
        this.render();
    }

    toDataURL() {
        return Plotly.toImage(this.container, {
            format: 'png',
            width: this.width,
            height: this.height
        });
    }

    dispose() {
        Plotly.purge(this.container);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Viz3DPlotly;
}
