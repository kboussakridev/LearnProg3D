import * as THREE from 'three';

export class Switch {
    constructor(scene, x, y, gateId, duration = 0) {
        this.scene = scene;
        this.gridPos = { x, y };
        this.gateId = gateId;
        this.duration = duration; // 0 = permanent, > 0 = timed in seconds
        this.isPressed = false;
        this.timer = 0;

        const geo = new THREE.BoxGeometry(0.7, 0.1, 0.7);
        this.mat = new THREE.MeshStandardMaterial({ color: duration > 0 ? 0xffaa00 : 0xff0000 });
        this.mesh = new THREE.Mesh(geo, this.mat);

        this.mesh.position.set(x, 0.05, y);
        this.scene.add(this.mesh);
    }

    press() {
        if (this.isPressed) return;
        this.isPressed = true;
        this.mat.color.set(0x00ff00);
        this.mesh.position.y = 0.01;
        if (this.duration > 0) this.timer = this.duration;
    }

    release() {
        this.isPressed = false;
        this.mat.color.set(this.duration > 0 ? 0xffaa00 : 0xff0000);
        this.mesh.position.y = 0.05;
        // Logic to close gate will be in CollisionSystem check
    }

    update(dt) {
        if (this.isPressed && this.duration > 0) {
            this.timer -= dt;
            if (this.timer <= 0) {
                this.release();
            }
        }
    }
}
