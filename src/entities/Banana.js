import * as THREE from 'three';

export class Banana {
    constructor(scene, x, y) {
        this.scene = scene;
        this.gridPos = { x, y };
        this.active = true;

        const group = new THREE.Group();

        // Curved Banana Shape
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -0.3, 0),
            new THREE.Vector3(0.1, -0.1, 0),
            new THREE.Vector3(0.2, 0.1, 0),
            new THREE.Vector3(0.1, 0.3, 0)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 10, 0.08, 8, false);
        const yellow = new THREE.MeshStandardMaterial({ color: 0xFFFF00, roughness: 0.3 });
        const tube = new THREE.Mesh(tubeGeo, yellow);
        group.add(tube);

        // Brown Tips
        const tipGeo = new THREE.SphereGeometry(0.085, 8, 8);
        const brown = new THREE.MeshStandardMaterial({ color: 0x4B2C20 });
        const tipTop = new THREE.Mesh(tipGeo, brown);
        tipTop.position.set(0.1, 0.3, 0);
        tipTop.scale.set(1, 0.5, 1);
        group.add(tipTop);

        const tipBottom = new THREE.Mesh(tipGeo, brown);
        tipBottom.position.set(0, -0.3, 0);
        tipBottom.scale.set(1, 0.5, 1);
        group.add(tipBottom);

        this.mesh = group;
        this.mesh.position.set(x, 0.5, y);
        this.scene.add(this.mesh);
    }

    update(dt) {
        if (this.active) {
            this.mesh.rotation.y += 2 * dt;
        }
    }
}
