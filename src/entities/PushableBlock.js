import * as THREE from 'three';

export class PushableBlock {
    constructor(scene, x, y) {
        this.scene = scene;
        this.gridPos = { x, y };
        this.targetPos = new THREE.Vector3(x, 0.4, y);
        this.isMoving = false;

        this.initMesh();
    }

    initMesh() {
        const geo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x7f8c8d,
            roughness: 0.9,
            metalness: 0.1
        });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.set(this.gridPos.x, 0.4, this.gridPos.y);
        this.scene.add(this.mesh);
    }

    moveTo(x, y) {
        this.gridPos.x = x;
        this.gridPos.y = y;
        this.targetPos.set(x, 0.4, y);
        this.isMoving = true;
    }

    update(dt) {
        if (!this.isMoving) return;

        const dist = this.mesh.position.distanceTo(this.targetPos);
        if (dist < 0.05) {
            this.mesh.position.copy(this.targetPos);
            this.isMoving = false;
        } else {
            this.mesh.position.lerp(this.targetPos, 10 * dt);
        }
    }
}
