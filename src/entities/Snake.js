import * as THREE from 'three';

export class Snake {
    constructor(scene, x, y, rotation, range = 2) {
        this.scene = scene;
        this.gridPos = { x, y };
        this.basePos = { x, y };
        this.rotation = rotation;
        this.range = range;
        this.progress = 0;
        this.speed = 1.0;
        this.direction = 1;

        this.initMesh();
    }

    initMesh() {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x27ae60 });

        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.4), mat);
        group.add(head);

        // Body segments
        for (let i = 1; i <= 4; i++) {
            const seg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.3), mat);
            seg.position.z = i * 0.3;
            group.add(seg);
        }

        group.position.set(this.gridPos.x, 0.15, this.gridPos.y);
        group.rotation.y = this.rotation;
        this.mesh = group;
        this.scene.add(this.mesh);
    }

    update(dt, monkey) {
        // Patrol logic
        this.progress += dt * this.speed * this.direction;

        if (this.progress >= this.range) {
            this.progress = this.range;
            this.direction = -1;
            this.mesh.rotation.y = this.rotation + Math.PI;
        } else if (this.progress <= 0) {
            this.progress = 0;
            this.direction = 1;
            this.mesh.rotation.y = this.rotation;
        }

        // Update grid position for collision
        const offsetX = Math.sin(this.rotation) * this.progress;
        const offsetZ = Math.cos(this.rotation) * this.progress;

        this.gridPos.x = Math.round(this.basePos.x + offsetX);
        this.gridPos.y = Math.round(this.basePos.y + offsetZ);

        this.mesh.position.x = this.basePos.x + offsetX;
        this.mesh.position.z = this.basePos.y + offsetZ;

        // Slither animation
        this.mesh.position.y = 0.15 + Math.sin(Date.now() * 0.01) * 0.05;
    }
}
