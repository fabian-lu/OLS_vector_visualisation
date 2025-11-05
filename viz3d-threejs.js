/**
 * Three.js 3D Visualization Engine
 * Professional 3D visualization using Three.js library
 */

class Viz3DThreeJS {
    constructor(canvasId, options = {}) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas ${canvasId} not found`);
            return;
        }

        this.width = this.canvas.width;
        this.height = this.canvas.height;

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
            backgroundColor: options.backgroundColor || 0xffffff,
            axisColor: options.axisColor || '#94a3b8',
            gridColor: options.gridColor || '#e2e8f0',
            showGrid: options.showGrid !== undefined ? options.showGrid : true,
            showAxes: options.showAxes !== undefined ? options.showAxes : true,
            ...options
        };

        this.colors = {
            u: 0xE69F00,
            v: 0x56B4E9,
            w: 0x009E73,
            y: 0xF0E442,
            yhat: 0x0072B2,
            e: 0xD55E00,
            subspace: 0xCC79A7,
            subspaceBorder: 0xCC79A7
        };

        this.objects = []; // Track objects for cleanup
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);

        // Create camera
        const aspect = this.width / this.height;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 20;

        // Add axes and grid
        if (this.options.showAxes) this.addAxes();
        if (this.options.showGrid) this.addGrid();

        // Start animation loop
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    addAxes() {
        const axisLength = Math.max(
            this.bounds.xMax - this.bounds.xMin,
            this.bounds.yMax - this.bounds.yMin,
            this.bounds.zMax - this.bounds.zMin
        );

        // X axis (red)
        const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(axisLength, 0, 0)
        ]);
        const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
        const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
        this.scene.add(xAxis);

        // Add X label
        const xLabel = this.createTextSprite('X', 0xef4444);
        xLabel.position.set(axisLength * 1.1, 0, 0);
        this.scene.add(xLabel);

        // Y axis (green)
        const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, axisLength, 0)
        ]);
        const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
        const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
        this.scene.add(yAxis);

        // Add Y label
        const yLabel = this.createTextSprite('Y', 0x10b981);
        yLabel.position.set(0, axisLength * 1.1, 0);
        this.scene.add(yLabel);

        // Z axis (blue)
        const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, axisLength)
        ]);
        const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
        const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
        this.scene.add(zAxis);

        // Add Z label
        const zLabel = this.createTextSprite('Z', 0x3b82f6);
        zLabel.position.set(0, 0, axisLength * 1.1);
        this.scene.add(zLabel);
    }

    addGrid() {
        const gridSize = Math.max(
            this.bounds.xMax - this.bounds.xMin,
            this.bounds.zMax - this.bounds.zMin
        );
        const divisions = 10;

        const gridHelper = new THREE.GridHelper(gridSize, divisions, 0xe2e8f0, 0xe2e8f0);
        this.scene.add(gridHelper);
    }

    createTextSprite(text, color = 0x000000) {
        // Create canvas for text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;

        context.fillStyle = '#' + color.toString(16).padStart(6, '0');
        context.font = 'Bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 64, 32);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.5, 0.25, 1);

        return sprite;
    }

    clear() {
        // Remove all tracked objects
        this.objects.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
        this.objects = [];
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    drawVector3D(from, to, color, label = '', lineWidth = 2) {
        const [x1, y1, z1] = from;
        const [x2, y2, z2] = to;

        // Convert color string to hex if needed
        const colorHex = typeof color === 'string' ? parseInt(color.replace('#', '0x')) : color;

        // Create arrow
        const direction = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1);
        const length = direction.length();
        direction.normalize();

        const origin = new THREE.Vector3(x1, y1, z1);
        const arrowHelper = new THREE.ArrowHelper(
            direction,
            origin,
            length,
            colorHex,
            length * 0.2, // headLength
            length * 0.1  // headWidth
        );

        this.scene.add(arrowHelper);
        this.objects.push(arrowHelper);

        // Add label if provided
        if (label) {
            const labelSprite = this.createTextSprite(label, colorHex);
            labelSprite.position.set(x2 + 0.3, y2 + 0.3, z2);
            this.scene.add(labelSprite);
            this.objects.push(labelSprite);
        }
    }

    drawPoint3D(x, y, z, color, radius = 0.1) {
        const colorHex = typeof color === 'string' ? parseInt(color.replace('#', '0x')) : color;

        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: colorHex });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, z);

        this.scene.add(sphere);
        this.objects.push(sphere);
    }

    drawLine3D(from, to, color, lineWidth = 2, dashed = false) {
        const [x1, y1, z1] = from;
        const [x2, y2, z2] = to;
        const colorHex = typeof color === 'string' ? parseInt(color.replace('#', '0x')) : color;

        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x1, y1, z1),
            new THREE.Vector3(x2, y2, z2)
        ]);

        let material;
        if (dashed) {
            material = new THREE.LineDashedMaterial({
                color: colorHex,
                linewidth: lineWidth,
                dashSize: 0.3,
                gapSize: 0.1
            });
        } else {
            material = new THREE.LineBasicMaterial({
                color: colorHex,
                linewidth: lineWidth
            });
        }

        const line = new THREE.Line(geometry, material);
        if (dashed) line.computeLineDistances();

        this.scene.add(line);
        this.objects.push(line);
    }

    drawPlane(point, normal, size = 3, color = null) {
        const colorHex = color ?
            (typeof color === 'string' ? parseInt(color.replace('#', '0x')) : color) :
            this.colors.subspace;

        // Normalize the normal vector
        const normalVec = new THREE.Vector3(normal[0], normal[1], normal[2]).normalize();

        // Create plane geometry
        const geometry = new THREE.PlaneGeometry(size * 2, size * 2);
        const material = new THREE.MeshPhongMaterial({
            color: colorHex,
            opacity: 0.3,
            transparent: true,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(geometry, material);

        // Position and orient the plane
        plane.position.set(point[0], point[1], point[2]);

        // Orient plane to be perpendicular to normal
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVec);
        plane.setRotationFromQuaternion(quaternion);

        this.scene.add(plane);
        this.objects.push(plane);

        // Add border
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: this.colors.subspaceBorder });
        const border = new THREE.LineSegments(edges, edgeMaterial);
        border.position.copy(plane.position);
        border.setRotationFromQuaternion(quaternion);

        this.scene.add(border);
        this.objects.push(border);
    }

    drawLine3DInfinite(point, direction, color = null) {
        const colorHex = color ?
            (typeof color === 'string' ? parseInt(color.replace('#', '0x')) : color) :
            this.colors.subspaceBorder;

        const scale = 10;
        const dir = LinAlg.normalize(direction);
        const p1 = LinAlg.add(point, LinAlg.scale(dir, -scale));
        const p2 = LinAlg.add(point, LinAlg.scale(dir, scale));

        this.drawLine3D(p1, p2, colorHex, 2, true);
    }

    drawScatter3D(points, color = 0x0072B2, radius = 0.08) {
        const colorHex = typeof color === 'string' ? parseInt(color.replace('#', '0x')) : color;

        // Use instanced mesh for better performance
        const geometry = new THREE.SphereGeometry(radius, 12, 12);
        const material = new THREE.MeshPhongMaterial({ color: colorHex });

        points.forEach(([x, y, z]) => {
            const sphere = new THREE.Mesh(geometry.clone(), material);
            sphere.position.set(x, y, z);
            this.scene.add(sphere);
            this.objects.push(sphere);
        });
    }

    drawText3D(text, x, y, z, color = 0x1e293b, fontSize = 14) {
        const colorHex = typeof color === 'string' ? parseInt(color.replace('#', '0x')) : color;
        const sprite = this.createTextSprite(text, colorHex);
        sprite.position.set(x, y, z);
        this.scene.add(sprite);
        this.objects.push(sprite);
    }

    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }

    setCameraRotation(yaw, pitch) {
        // Orbit controls handle rotation
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

        const centerX = (xMin + xMax) / 2;
        const centerY = (yMin + yMax) / 2;
        const centerZ = (zMin + zMax) / 2;

        const maxRange = Math.max(xMax - xMin, yMax - yMin, zMax - zMin);

        this.camera.position.set(
            centerX + maxRange * padding,
            centerY + maxRange * padding,
            centerZ + maxRange * padding
        );
        this.camera.lookAt(centerX, centerY, centerZ);
        this.controls.target.set(centerX, centerY, centerZ);
    }

    toDataURL() {
        return this.renderer.domElement.toDataURL('image/png');
    }

    dispose() {
        this.clear();
        this.controls.dispose();
        this.renderer.dispose();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Viz3DThreeJS;
}
