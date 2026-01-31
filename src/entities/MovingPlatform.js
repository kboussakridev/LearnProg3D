import * as THREE from 'three';

export class MovingPlatform {
    constructor(scene, points, speed = 2) {
        this.scene = scene;
        this.points = points; // Array of {x, y}
        this.currentIndex = 0;
        this.targetIndex = 1;
        this.gridPos = { x: points[0].x, y: points[0].y };
        this.speed = speed;
        this.isMoving = false;
        this.progress = 0;

        this.initMesh();
    }

    initMesh() {
        const geo = new THREE.BoxGeometry(0.9, 0.2, 0.9);
        const mat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.3, metalness: 0.8 });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.set(this.gridPos.x, 0.1, this.gridPos.y);
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }

    // Called by the engine or a logic pulse
    moveNext() {
        if (this.isMoving) return;
        this.isMoving = true;
        this.progress = 0;
        this.targetIndex = (this.currentIndex + 1) % this.points.length;
    }

    update(dt) {
        if (!this.isMoving) return;

        this.progress += dt * this.speed;
        if (this.progress >= 1) {
            this.progress = 1;
            this.isMoving = false;
            this.currentIndex = this.targetIndex;
            this.gridPos.x = this.points[this.currentIndex].x;
            this.gridPos.y = this.points[this.currentIndex].y;
        }

        const start = this.points[this.currentIndex];
        const end = this.points[this.targetIndex];

        const x = start.x + (end.x - start.x) * this.progress;
        const z = start.y + (end.y - start.y) * this.progress;

        this.mesh.position.set(x, 0.1, z);
    }
}
