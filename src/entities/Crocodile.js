import * as THREE from 'three';

export class Crocodile {
    constructor(scene, x, y, rotation = 0, patrolOffset = 0) {
        this.scene = scene;
        this.gridPos = { x, y };
        this.basePos = { x, y };
        this.patrolOffset = patrolOffset; // 0 = static, >0 = moves back and forth

        const group = new THREE.Group();
        // ... rest of constructor content matches previous ...
        const mat = new THREE.MeshStandardMaterial({ color: 0x244d24 }); // Darker jungle green

        // Lower Body & Jaw
        const bodyGeo = new THREE.BoxGeometry(0.8, 0.2, 1.2);
        const body = new THREE.Mesh(bodyGeo, mat);
        body.position.y = 0.1;
        group.add(body);

        const lowerSnoutGeo = new THREE.BoxGeometry(0.5, 0.1, 0.7);
        const lowerSnout = new THREE.Mesh(lowerSnoutGeo, mat);
        lowerSnout.position.set(0, 0.1, -0.9);
        group.add(lowerSnout);

        // Upper Jaw (Pivot at the back of snout)
        this.upperJaw = new THREE.Group();
        this.upperJaw.position.set(0, 0.2, -0.6); // Junction point
        group.add(this.upperJaw);

        const upperSnoutGeo = new THREE.BoxGeometry(0.5, 0.15, 0.7);
        const upperSnout = new THREE.Mesh(upperSnoutGeo, mat);
        upperSnout.position.z = -0.35; // Offset from pivot
        this.upperJaw.add(upperSnout);

        // Eyes (on upper jaw)
        const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow eyes
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.15, 0.1, -0.1);
        const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        eyeR.position.set(0.15, 0.1, -0.1);
        this.upperJaw.add(eyeL, eyeR);

        // Teeth
        const toothGeo = new THREE.BoxGeometry(0.05, 0.1, 0.05);
        const toothMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let i = 0; i < 3; i++) {
            const t = new THREE.Mesh(toothGeo, toothMat);
            t.position.set(-0.2 + i * 0.2, -0.1, -0.65);
            this.upperJaw.add(t);
        }

        group.position.set(x, 0, y);
        group.rotation.y = rotation * (Math.PI / 180);

        this.mesh = group;
        this.scene.add(this.mesh);

        this.snapTimer = 0;
        this.isSnapping = false;
    }

    update(dt, monkey) {
        const time = Date.now() * 0.002;

        // Patrol Movement
        if (this.patrolOffset > 0) {
            // Move back and forth along its initial rotation axis
            // Simple sin based movement
            const orbit = Math.sin(time * 0.5) * this.patrolOffset;

            // Calculate movement vector based on base rotation
            // Original rotation 0 (North) meant -Z.
            const angle = this.mesh.rotation.y;
            this.mesh.position.x = this.basePos.x + Math.sin(angle) * orbit;
            this.mesh.position.z = this.basePos.y + Math.cos(angle) * orbit;

            // Update grid position for collisions (rounded)
            this.gridPos.x = Math.round(this.mesh.position.x);
            this.gridPos.y = Math.round(this.mesh.position.z);
        } else {
            this.mesh.position.y = Math.sin(time) * 0.05;
        }

        // Random snap
        if (Math.random() < 0.005 && !this.isSnapping) {
            this.isSnapping = true;
            this.snapTimer = 0;
        }
        // ... rest of update logic (hostility, etc) ...

        // Hostility: look at monkey if close
        if (monkey) {
            const dx = monkey.gridPos.x - this.gridPos.x;
            const dy = monkey.gridPos.y - this.gridPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 3) {
                // Determine target angle (atan2 uses X, Y but Three.js uses X, Z for floor)
                // In our grid: X is x, Y is z.
                const angle = Math.atan2(dx, dy);

                // Smooth rotation towards monkey
                let diff = angle - this.mesh.rotation.y;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff -= Math.PI * 2;
                this.mesh.rotation.y += diff * dt * 3.0;

                // Aggressive snapping if very close
                if (dist < 1.1 && !this.isSnapping) {
                    this.isSnapping = true;
                    this.snapTimer = 0;
                }
            }
        }

        if (this.isSnapping) {
            this.snapTimer += dt * 10;
            this.upperJaw.rotation.x = -Math.sin(this.snapTimer) * 0.8;
            if (this.snapTimer > Math.PI) {
                this.isSnapping = false;
                this.upperJaw.rotation.x = 0;
            }
        }
    }
}
