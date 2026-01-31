import * as THREE from 'three';

export class Gate {
    constructor(scene, x, y, gateId) {
        this.scene = scene;
        this.gridPos = { x, y };
        this.gateId = gateId;
        this.isOpen = false;

        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8 });

        // Posts
        const postGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
        const p1 = new THREE.Mesh(postGeo, mat);
        p1.position.set(-0.4, 0.5, 0);
        const p2 = new THREE.Mesh(postGeo, mat);
        p2.position.set(0.4, 0.5, 0);
        group.add(p1, p2);

        // Bar
        const barGeo = new THREE.BoxGeometry(0.8, 0.6, 0.1);
        this.bar = new THREE.Mesh(barGeo, mat);
        this.bar.position.set(0, 0.5, 0);
        group.add(this.bar);

        group.position.set(x, 0, y);
        this.mesh = group;
        this.scene.add(this.mesh);
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        // Animation
        this.bar.position.y = 1.5; // Lift up
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.bar.position.y = 0.5;
    }

    update(dt) { }
}
