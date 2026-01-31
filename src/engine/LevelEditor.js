import * as THREE from 'three';

export class LevelEditor {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.active = false;
        this.selectedType = 'Banana';
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.history = []; // Simplified undo stack

        this.previewMesh = null;
        this.initPreview();

        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    setEnabled(enabled) {
        this.active = enabled;
        if (this.previewMesh) this.previewMesh.visible = enabled;
        console.log("Editor mode:", enabled);
    }

    initPreview() {
        const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 });
        this.previewMesh = new THREE.Mesh(geo, mat);
        this.previewMesh.visible = false;
        this.scene.add(this.previewMesh);
    }

    onMouseMove(event) {
        if (!this.active) return;

        // Hide preview if hovering UI
        if (event.target.closest('.left-panel') || event.target.closest('.tutorial-hint')) {
            this.previewMesh.visible = false;
            return;
        }
        this.previewMesh.visible = true;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.game.camera);
        const floor = this.game.currentLevel?.gridMesh; // Assuming we add this reference
        if (!floor) return;

        const intersects = this.raycaster.intersectObject(floor);
        if (intersects.length > 0) {
            const p = intersects[0].point;
            const gx = Math.round(p.x);
            const gz = Math.round(p.z);
            this.previewMesh.position.set(gx, 0.5, gz);
        }
    }

    onMouseDown(event) {
        if (!this.active) return;

        // Prevent placement if clicking on UI
        if (event.target.closest('.left-panel') || event.target.closest('.tutorial-hint')) {
            return;
        }

        const nextX = this.previewMesh.position.x;
        const nextZ = this.previewMesh.position.z;

        if (event.button === 0) { // Left Click: Place
            this.placeObject(this.selectedType, nextX, nextZ);
            this.history.push({ type: 'add', x: nextX, y: nextZ });
        } else if (event.button === 2) { // Right Click: Remove
            this.removeObject(nextX, nextZ);
            this.history.push({ type: 'remove', x: nextX, y: nextZ });
        }
    }

    removeObject(x, z) {
        console.log(`Removing object at ${x}, ${z}`);
        this.game.eventBus.emit('EDITOR_REMOVE', { x, y: z });
    }

    undo() {
        const last = this.history.pop();
        if (!last) return;

        if (last.type === 'add') {
            this.removeObject(last.x, last.y);
        } else {
            // Re-adding is harder without full state, 
            // but we can try to find what was there if we stored it properly.
            // For now, let's just support simple undo for Add.
            console.log("Undo remove not yet fully supported");
        }
    }

    placeObject(type, x, z) {
        // Logic to add to currentLevel.entities
        console.log(`Placing ${type} at ${x}, ${z}`);
        // We'll need a factory or mapping here
        this.game.eventBus.emit('EDITOR_PLACE', { type, x, y: z });
    }

    exportLevel() {
        const level = this.game.currentLevel;
        if (!level) return;

        const data = {
            biome: level.biome,
            grid: [level.width, level.height],
            monkeyStart: [level.monkey.gridPos.x, level.monkey.gridPos.y],
            bananas: [],
            turtles: [],
            crocodiles: [],
            switches: [],
            gates: [],
            teleporters: [],
            platforms: [],
            snakes: []
        };

        level.entities.forEach(e => {
            const name = e.constructor.name;
            const pos = { x: e.gridPos.x, y: e.gridPos.y };

            if (name === 'Banana') data.bananas.push(pos);
            else if (name === 'Turtle') data.turtles.push({ ...pos, rotation: e.rotation });
            else if (name === 'Crocodile') data.crocodiles.push({ ...pos, rotation: e.rotation, patrol: e.range });
            else if (name === 'Switch') data.switches.push({ ...pos, gateId: e.gateId, duration: e.duration });
            else if (name === 'Gate') data.gates.push({ ...pos, gateId: e.gateId });
            else if (name === 'Teleporter') data.teleporters.push({ ...pos, pairId: e.pairId });
            else if (name === 'Snake') data.snakes.push({ ...pos, rotation: e.rotation, range: e.range });
        });

        const json = JSON.stringify(data, null, 4);
        console.log("EXPORTED LEVEL:", json);

        // Copy to clipboard or show in modal
        return json;
    }
}
