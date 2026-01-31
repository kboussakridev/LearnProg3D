import * as THREE from 'three';

export class WorldDecor {
    static createPalmTree(scene, x, y) {
        const group = new THREE.Group();

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.1, 0.2, 2, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1;
        trunk.rotation.z = (Math.random() - 0.5) * 0.2; // Slight tilt
        group.add(trunk);

        // Leaves
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide });
        for (let i = 0; i < 5; i++) {
            const leafGeo = new THREE.SphereGeometry(0.8, 8, 8);
            leafGeo.scale(1, 0.1, 0.5);
            const leaf = new THREE.Mesh(leafGeo, leavesMat);
            leaf.position.y = 2;
            leaf.rotation.y = (i / 5) * Math.PI * 2;
            leaf.rotation.z = 0.5;
            group.add(leaf);
        }

        group.position.set(x, 0, y);
        scene.add(group);
        return group;
    }

    static createSandMound(scene, x, y) {
        const geo = new THREE.SphereGeometry(2, 16, 16);
        geo.scale(1, 0.2, 1);
        const mat = new THREE.MeshStandardMaterial({ color: 0xEDC9AF });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, -0.1, y);
        scene.add(mesh);
        return mesh;
    }

    static createCactus(scene, x, y) {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });

        const main = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), mat);
        main.position.y = 0.5;
        group.add(main);

        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8), mat);
        arm.position.set(0.15, 0.6, 0);
        arm.rotation.z = Math.PI / 3;
        group.add(arm);

        group.position.set(x, 0, y);
        scene.add(group);
        return group;
    }

    static createSnowPine(scene, x, y) {
        const group = new THREE.Group();

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5), new THREE.MeshStandardMaterial({ color: 0x3d2b1f }));
        trunk.position.y = 0.25;
        group.add(trunk);

        const leavesMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa }); // Snowy blue/white
        for (let i = 0; i < 3; i++) {
            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5 - i * 0.1, 0.8), leavesMat);
            cone.position.y = 0.7 + i * 0.4;
            group.add(cone);
        }

        group.position.set(x, 0, y);
        scene.add(group);
        return group;
    }

    static createDecorCrocodile(scene, x, y, rotation, range) {
        // We can't import Crocodile here easily (circular), 
        // but we can just create a simplified visual copy or use the class if we pass it.
        // Let's create a simpler, purely visual one to avoid logic overhead.
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x1a331a });

        const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 1), mat);
        body.position.y = 0.1;
        group.add(body);

        const snout = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.5), mat);
        snout.position.set(0, 0.1, -0.7);
        group.add(snout);

        group.position.set(x, -0.3, y); // Half submerged
        group.rotation.y = rotation;
        scene.add(group);

        return {
            mesh: group,
            basePos: { x, y },
            range,
            update: (time) => {
                const offset = Math.sin(time * 0.3) * range;
                group.position.x = x + Math.sin(rotation) * offset;
                group.position.z = y + Math.cos(rotation) * offset;
                // Periodic snap visual
                group.position.y = -0.3 + Math.sin(time * 2) * 0.05;
            }
        };
    }
}
