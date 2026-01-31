import * as THREE from 'three';

export class Teleporter {
    constructor(scene, x, y, pairId, color = 0x9b59b6) {
        this.scene = scene;
        this.gridPos = { x, y };
        this.pairId = pairId;
        this.active = true;
        this.cooldown = 0;

        this.initMesh(color);
    }

    initMesh(color) {
        const group = new THREE.Group();

        // Base plate
        const baseGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.1, 16);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        group.add(base);

        // Glowing ring
        const ringGeo = new THREE.TorusGeometry(0.35, 0.03, 8, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: color });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.06;
        group.add(ring);

        // Vertical beam (subtle)
        const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.y = 1;
        group.add(beam);

        group.position.set(this.gridPos.x, 0.05, this.gridPos.y);
        this.mesh = group;
        this.scene.add(this.mesh);
        this.beam = beam;
    }

    update(dt) {
        if (this.cooldown > 0) {
            this.cooldown -= dt;
            this.beam.visible = false;
        } else {
            this.beam.visible = true;
            this.beam.rotation.y += dt * 2;
        }
    }
}
