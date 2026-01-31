import * as THREE from 'three';

export class Grid {
    constructor(scene) {
        this.scene = scene;
        this.createGrid();
    }

    createGrid() {
        const size = 10;
        const divisions = 10;

        // Grid Helper
        const gridHelper = new THREE.GridHelper(size, divisions, 0x00ffff, 0x444444);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);

        // Ground Plane
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.8,
            metalness: 0.2
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.01;
        this.scene.add(plane);

        // Goal Tile (simple marker)
        this.goalPos = { x: 2, y: -2 }; // Example target
        this.createGoalMarker();
    }

    createGoalMarker() {
        const geo = new THREE.BoxGeometry(0.8, 0.1, 0.8);
        const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });
        this.goalMesh = new THREE.Mesh(geo, mat);
        this.goalMesh.position.set(this.goalPos.x, 0.05, this.goalPos.y);
        this.scene.add(this.goalMesh);
    }

    update() {
        // Anim grid if needed
    }
}
