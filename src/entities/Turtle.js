import * as THREE from 'three';

export class Turtle {
    constructor(scene, x, y, rotation = 0) {
        this.scene = scene;
        this.gridPos = { x, y };

        const group = new THREE.Group();

        // Shell
        const shellGeo = new THREE.SphereGeometry(0.4, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const mat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const shell = new THREE.Mesh(shellGeo, mat);
        shell.rotation.x = 0;
        shell.position.y = 0;
        group.add(shell);

        group.position.set(x, 0, y);
        group.rotation.y = rotation * (Math.PI / 180);

        this.mesh = group;
        this.scene.add(this.mesh);
    }

    update(dt) {
        // Idle animation?
    }
}
