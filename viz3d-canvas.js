/**
 * Lightweight 3D Visualization Engine using Canvas 2D
 * Uses simple perspective projection instead of Three.js
 */

class Viz3D {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas ${canvasId} not found`);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Camera settings
        this.camera = {
            x: options.cameraX || 5,
            y: options.cameraY || 5,
            z: options.cameraZ || 5,
            fov: options.fov || 500,
            yaw: options.yaw || -Math.PI / 4,
            pitch: options.pitch || -Math.PI / 6
        };

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

        this.isDragging = false;
        this.lastMouse = { x: 0, y: 0 };

        this.setupControls();
        this.render();
    }

    setupControls() {
        // Mouse drag to rotate
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouse = { x: e.clientX, y: e.clientY };
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const dx = e.clientX - this.lastMouse.x;
                const dy = e.clientY - this.lastMouse.y;

                this.camera.yaw += dx * 0.01;
                this.camera.pitch += dy * 0.01;

                // Clamp pitch
                this.camera.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.pitch));

                this.lastMouse = { x: e.clientX, y: e.clientY };
                this.render();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Mouse wheel for zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.fov += e.deltaY * 0.5;
            this.camera.fov = Math.max(100, Math.min(1000, this.camera.fov));
            this.render();
        });
    }

    project3D(x, y, z) {
        // Rotate based on camera yaw and pitch
        const cosYaw = Math.cos(this.camera.yaw);
        const sinYaw = Math.sin(this.camera.yaw);
        const cosPitch = Math.cos(this.camera.pitch);
        const sinPitch = Math.sin(this.camera.pitch);

        // Translate to camera
        let dx = x - this.camera.x;
        let dy = y - this.camera.y;
        let dz = z - this.camera.z;

        // Rotate yaw (around Y axis)
        let x1 = dx * cosYaw - dz * sinYaw;
        let z1 = dx * sinYaw + dz * cosYaw;

        // Rotate pitch (around X axis)
        let y2 = dy * cosPitch - z1 * sinPitch;
        let z2 = dy * sinPitch + z1 * cosPitch;

        // Perspective projection
        const distance = Math.max(z2, 0.1); // Prevent division by zero
        const scale = this.camera.fov / distance;

        const sx = this.width / 2 + x1 * scale;
        const sy = this.height / 2 - y2 * scale;

        return [sx, sy, z2]; // Return z for depth sorting
    }

    clear() {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    render() {
        this.clear();
        if (this.options.showAxes) this.drawAxes();
        if (this.options.showGrid) this.drawGrid();
    }

    drawAxes() {
        const origin = [0, 0, 0];
        const axisLen = Math.max(
            this.bounds.xMax - this.bounds.xMin,
            this.bounds.yMax - this.bounds.yMin,
            this.bounds.zMax - this.bounds.zMin
        );

        // X axis (red)
        this.drawLine3D(origin, [axisLen, 0, 0], '#ef4444', 2);
        const [sx, sy] = this.project3D(axisLen * 1.1, 0, 0);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.font = 'bold 16px sans-serif';
        this.ctx.fillText('X', sx, sy);

        // Y axis (green)
        this.drawLine3D(origin, [0, axisLen, 0], '#10b981', 2);
        const [sy_x, sy_y] = this.project3D(0, axisLen * 1.1, 0);
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillText('Y', sy_x, sy_y);

        // Z axis (blue)
        this.drawLine3D(origin, [0, 0, axisLen], '#3b82f6', 2);
        const [sz_x, sz_y] = this.project3D(0, 0, axisLen * 1.1);
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.fillText('Z', sz_x, sz_y);
    }

    drawGrid() {
        this.ctx.strokeStyle = this.options.gridColor;
        this.ctx.lineWidth = 1;

        // XY plane grid
        for (let x = Math.ceil(this.bounds.xMin); x <= this.bounds.xMax; x++) {
            this.drawLine3D([x, this.bounds.yMin, 0], [x, this.bounds.yMax, 0], this.options.gridColor, 0.5);
        }
        for (let y = Math.ceil(this.bounds.yMin); y <= this.bounds.yMax; y++) {
            this.drawLine3D([this.bounds.xMin, y, 0], [this.bounds.xMax, y, 0], this.options.gridColor, 0.5);
        }
    }

    drawLine3D(from, to, color, lineWidth = 2, dashed = false) {
        const [sx1, sy1, z1] = this.project3D(from[0], from[1], from[2]);
        const [sx2, sy2, z2] = this.project3D(to[0], to[1], to[2]);

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

    drawVector3D(from, to, color, label = '', lineWidth = 2) {
        const [x1, y1, z1] = from;
        const [x2, y2, z2] = to;

        this.drawLine3D(from, to, color, lineWidth);

        // Draw arrowhead
        const [sx1, sy1] = this.project3D(x1, y1, z1);
        const [sx2, sy2] = this.project3D(x2, y2, z2);

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

        // Label
        if (label) {
            this.ctx.fillStyle = color;
            this.ctx.font = 'bold 16px sans-serif';
            this.ctx.fillText(label, sx2 + 10, sy2 - 10);
        }
    }

    drawPoint3D(x, y, z, color, radius = 5) {
        const [sx, sy] = this.project3D(x, y, z);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawPlane(point, normal, size = 3, color = null) {
        // Draw a plane defined by a point and normal vector
        color = color || this.colors.subspace;

        // Create two perpendicular vectors in the plane
        let v1, v2;
        const [nx, ny, nz] = normal;

        // Find perpendicular vector 1
        if (Math.abs(nx) < 0.9) {
            v1 = LinAlg.cross(normal, [1, 0, 0]);
        } else {
            v1 = LinAlg.cross(normal, [0, 1, 0]);
        }
        v1 = LinAlg.normalize(v1);

        // Find perpendicular vector 2
        v2 = LinAlg.cross(normal, v1);
        v2 = LinAlg.normalize(v2);

        // Create corners of plane
        const corners = [
            LinAlg.add(LinAlg.add(point, LinAlg.scale(v1, -size)), LinAlg.scale(v2, -size)),
            LinAlg.add(LinAlg.add(point, LinAlg.scale(v1, size)), LinAlg.scale(v2, -size)),
            LinAlg.add(LinAlg.add(point, LinAlg.scale(v1, size)), LinAlg.scale(v2, size)),
            LinAlg.add(LinAlg.add(point, LinAlg.scale(v1, -size)), LinAlg.scale(v2, size))
        ];

        // Project corners and draw filled polygon
        const projected = corners.map(c => this.project3D(c[0], c[1], c[2]));

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(projected[0][0], projected[0][1]);
        for (let i = 1; i < projected.length; i++) {
            this.ctx.lineTo(projected[i][0], projected[i][1]);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Draw border
        this.ctx.strokeStyle = this.colors.subspaceBorder;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawLine3DInfinite(point, direction, color = null) {
        // Draw an infinite line through a point in a direction
        color = color || this.colors.subspaceBorder;
        const scale = 10;

        const p1 = LinAlg.add(point, LinAlg.scale(direction, -scale));
        const p2 = LinAlg.add(point, LinAlg.scale(direction, scale));

        this.drawLine3D(p1, p2, color, 2, true);
    }

    drawScatter3D(points, color = '#0072B2', radius = 4) {
        // Sort by depth for proper rendering
        const projected = points.map(p => ({
            original: p,
            projected: this.project3D(p[0], p[1], p[2])
        }));

        projected.sort((a, b) => b.projected[2] - a.projected[2]); // Far to near

        projected.forEach(({ projected: [sx, sy] }) => {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    drawText3D(text, x, y, z, color = '#1e293b', fontSize = 14) {
        const [sx, sy] = this.project3D(x, y, z);
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px sans-serif`;
        this.ctx.fillText(text, sx, sy);
    }

    setCameraPosition(x, y, z) {
        this.camera.x = x;
        this.camera.y = y;
        this.camera.z = z;
        this.render();
    }

    setCameraRotation(yaw, pitch) {
        this.camera.yaw = yaw;
        this.camera.pitch = pitch;
        this.render();
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

        const xRange = xMax - xMin;
        const yRange = yMax - yMin;
        const zRange = zMax - zMin;
        const maxRange = Math.max(xRange, yRange, zRange);

        this.bounds = {
            xMin: xMin - padding,
            xMax: xMax + padding,
            yMin: yMin - padding,
            yMax: yMax + padding,
            zMin: zMin - padding,
            zMax: zMax + padding
        };

        // Position camera
        const centerX = (xMin + xMax) / 2;
        const centerY = (yMin + yMax) / 2;
        const centerZ = (zMin + zMax) / 2;

        this.camera.x = centerX;
        this.camera.y = centerY;
        this.camera.z = centerZ + maxRange * 2;

        this.render();
    }

    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Viz3D;
}
