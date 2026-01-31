import * as THREE from 'three';

export class Monkey {
    constructor(scene, startPos) {
        this.scene = scene;
        this.gridPos = { x: startPos[0], y: startPos[1] };
        this.direction = 1; // 0: -Z (North), 1: +X (East), 2: +Z (South), 3: -X (West). Default East

        this.targetPos = new THREE.Vector3(this.gridPos.x, 0, this.gridPos.y);
        this.targetRot = -Math.PI / 2; // East
        this.isMoving = false;
        this.isJumping = false;
        this.isDancing = false;
        this.isSad = false;
        this.startJumpDist = null;

        this.mesh = this.createMesh();
        this.scene.add(this.mesh);
        this.updateVisualsImmediate();
    }

    createMesh() {
        const group = new THREE.Group();

        const brown = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 });
        const skin = new THREE.MeshStandardMaterial({ color: 0xFFE4C4, roughness: 0.8 });

        // Body (Capsule shape)
        const bodyGeo = new THREE.CapsuleGeometry(0.25, 0.35, 4, 8);
        const body = new THREE.Mesh(bodyGeo, brown);
        body.position.y = 0.45;
        group.add(body);

        // Head
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.85, 0);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), brown);
        headGroup.add(head);

        // Face / Snout
        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), skin);
        snout.scale.set(1, 0.8, 1);
        snout.position.set(0, -0.05, -0.18);
        headGroup.add(snout);

        // Ears
        const earGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const lEar = new THREE.Mesh(earGeo, skin);
        lEar.position.set(0.22, 0, 0);
        const rEar = new THREE.Mesh(earGeo, skin);
        rEar.position.set(-0.22, 0, 0);
        headGroup.add(lEar, rEar);

        group.add(headGroup);

        // Tail
        const tailPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.3, 0.2),
            new THREE.Vector3(0, 0.5, 0.5),
            new THREE.Vector3(0.1, 0.7, 0.4)
        ]);
        const tailGeo = new THREE.TubeGeometry(tailPath, 8, 0.04, 8, false);
        const tail = new THREE.Mesh(tailGeo, brown);
        group.add(tail);

        // Limbs
        const limbGeo = new THREE.CapsuleGeometry(0.06, 0.25, 4, 8);

        this.leftArm = new THREE.Mesh(limbGeo, brown);
        this.leftArm.position.set(0.3, 0.6, 0);
        this.leftArm.rotation.z = -0.5;
        group.add(this.leftArm);

        this.rightArm = new THREE.Mesh(limbGeo, brown);
        this.rightArm.position.set(-0.3, 0.6, 0);
        this.rightArm.rotation.z = 0.5;
        group.add(this.rightArm);

        const leftLeg = new THREE.Mesh(limbGeo, brown);
        leftLeg.position.set(0.15, 0.2, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(limbGeo, brown);
        rightLeg.position.set(-0.15, 0.2, 0);
        group.add(rightLeg);

        return group;
    }

    updateVisualsImmediate() {
        this.mesh.position.set(this.gridPos.x, 0, this.gridPos.y);
        // Our direction 0 is North (-Z). 1 is East (+X).
        // 0 -> 0 rad
        // 1 -> -PI/2
        this.mesh.rotation.y = this.direction * (-Math.PI / 2);

        this.targetPos.copy(this.mesh.position);
        this.targetRot = this.mesh.rotation.y;
    }

    getNextPosition(dist = 1) {
        const pos = { ...this.gridPos };
        switch (this.direction) {
            case 0: pos.y -= dist; break; // North
            case 1: pos.x += dist; break; // East
            case 2: pos.y += dist; break; // South
            case 3: pos.x -= dist; break; // West
        }
        return pos;
    }

    moveForward() {
        return new Promise(resolve => {
            if (this.isMoving) { resolve(); return; }

            const next = this.getNextPosition();

            // Validate Move
            // Access Level via Scene? No, Scene is dumb.
            // Monkey needs ref to Level or we pass it in update.
            // Or simpler: Monkey keeps ref to Game or Level.
            // Current design: Monkey has `scene`.
            // We can hack it via `scene.userData` or just pass it in constructor if we change it.
            // OR: We change the logic so GameEngine checks validity.

            // Let's assume we can access Global or pass it.
            // Wait, Monkey is created in LevelLoader.
            // Let's rely on the Interpreter to check? No, physical move should be valid.

            // Hacky fix: Try to find level from scene or globals.
            // Better: Interpreter checks before calling monkey.moveForward() ? 
            // The Interpreter has access to everything.

            // **Reverting to Interpreter Check approach** is cleaner for this architecture.
            // But Monkey.moveForward needs to handle "Blocked" animation if called.

            // Let's simply allow the move here, but the Interpreter will guard it.
            // Or better: Pass a callback "canMove(x,y)".

            this.gridPos = next;

            this.targetPos.set(this.gridPos.x, 0, this.gridPos.y);
            this.isMoving = true;
            this.moveResolver = resolve;
        });
    }

    turnLeft() {
        return new Promise(resolve => {
            this.direction = (this.direction + 3) % 4;
            this.targetRot += Math.PI / 2;
            this.isMoving = true;
            this.moveResolver = resolve;
        });
    }

    turnRight() {
        return new Promise(resolve => {
            this.direction = (this.direction + 1) % 4;
            this.targetRot -= Math.PI / 2;
            this.isMoving = true;
            this.moveResolver = resolve;
        });
    }

    jump() {
        return new Promise(resolve => {
            if (this.isMoving) { resolve(); return; }

            const next = this.getNextPosition(2); // Jump 2 tiles
            this.gridPos = next;
            this.targetPos.set(this.gridPos.x, 0, this.gridPos.y);

            this.isMoving = true;
            this.isJumping = true;

            // Store starting distance for arc calculation (approx 2 units)
            this.startJumpDist = 2.0;

            this.moveResolver = resolve;
            this.game?.audio?.playSound('jump');
        });
    }

    update(dt) {
        // Idle / Victory / Sad Animations
        const time = Date.now() * 0.005;

        if (this.isDancing) {
            // Victory Jump & Wave
            this.mesh.position.y = Math.abs(Math.sin(time * 2)) * 0.5;
            if (this.leftArm) this.leftArm.rotation.x = Math.sin(time * 10) * 1.5;
            if (this.rightArm) this.rightArm.rotation.x = Math.cos(time * 10) * 1.5;
        } else if (this.isSad) {
            // Slump down
            this.mesh.position.y = -0.1;
            if (this.leftArm) this.leftArm.rotation.z = -1.2;
            if (this.rightArm) this.rightArm.rotation.z = 1.2;
        } else {
            // Normal Idle
            if (this.leftArm) this.leftArm.rotation.x = Math.sin(time) * 0.3;
            if (this.rightArm) this.rightArm.rotation.x = Math.sin(time + Math.PI) * 0.3;
        }

        if (!this.isMoving) return;

        // Calculate horizontal distance (XZ only, ignore Y for jump arc)
        const dx = this.mesh.position.x - this.targetPos.x;
        const dz = this.mesh.position.z - this.targetPos.z;
        const posDistXZ = Math.sqrt(dx * dx + dz * dz);

        const rotDist = Math.abs(this.mesh.rotation.y - this.targetRot);

        const speed = 10.0 * dt;
        const rotSpeed = 10.0 * dt;

        // Snap and finish if close enough (use horizontal distance only)
        if (posDistXZ < 0.05 && rotDist < 0.05) {
            this.mesh.position.copy(this.targetPos);
            this.mesh.rotation.y = this.targetRot;
            this.isMoving = false;
            this.isJumping = false;
            this.startJumpDist = null;
            if (this.moveResolver) {
                const res = this.moveResolver;
                this.moveResolver = null;
                res();
            }
        } else {
            // Horizontal Lerp (only X and Z)
            const targetX = this.mesh.position.x + (this.targetPos.x - this.mesh.position.x) * speed;
            const targetZ = this.mesh.position.z + (this.targetPos.z - this.mesh.position.z) * speed;
            this.mesh.position.x = targetX;
            this.mesh.position.z = targetZ;

            // Rotation Lerp
            this.mesh.rotation.y += (this.targetRot - this.mesh.rotation.y) * rotSpeed;

            // Vertical Arc for Jump
            if (this.isJumping && this.startJumpDist) {
                const t = Math.max(0, Math.min(1, 1.0 - (posDistXZ / this.startJumpDist)));
                const jumpHeight = 1.2;
                this.mesh.position.y = Math.sin(t * Math.PI) * jumpHeight;
            } else {
                this.mesh.position.y = 0;
            }
        }
    }

    victory() {
        this.isDancing = true;
    }

    fail() {
        this.isSad = true;
    }

    addHat(type) {
        if (this.hat) this.mesh.remove(this.hat);
        const mat = new THREE.MeshStandardMaterial({ color: type === 'tophat' ? 0x111111 : 0x2980b9 });
        const geo = type === 'tophat' ? new THREE.CylinderGeometry(0.15, 0.15, 0.2, 12) : new THREE.BoxGeometry(0.3, 0.05, 0.3);
        this.hat = new THREE.Mesh(geo, mat);
        this.hat.position.y = 1.1;
        this.mesh.add(this.hat);
    }

    shake() {
        return new Promise(resolve => {
            const startX = this.mesh.position.x;
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed < 300) {
                    this.mesh.position.x = startX + Math.sin(elapsed * 0.05) * 0.1;
                    requestAnimationFrame(animate);
                } else {
                    this.mesh.position.x = startX;
                    resolve();
                }
            };
            animate();
        });
    }
}
