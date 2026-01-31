import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.weatherType = 'none';
        this.weatherTimer = 0;
    }

    setWeather(type) {
        // Clear old weather if needed (optional)
        this.weatherType = type;
    }

    createConfetti(x, y, z) {
        const count = 50;
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

        for (let i = 0; i < count; i++) {
            const geo = new THREE.PlaneGeometry(0.1, 0.1);
            const mat = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                side: THREE.DoubleSide
            });
            const p = new THREE.Mesh(geo, mat);

            p.position.set(x, y, z);
            p.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.3 + 0.1,
                (Math.random() - 0.5) * 0.2
            );
            p.rotationSpeed = new THREE.Vector3(Math.random(), Math.random(), Math.random());
            p.life = 1.0;

            this.scene.add(p);
            this.particles.push(p);
        }
    }

    createSplash(x, y, z) {
        const count = 20;
        for (let i = 0; i < count; i++) {
            const geo = new THREE.SphereGeometry(0.05, 4, 4);
            const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
            const p = new THREE.Mesh(geo, mat);

            p.position.set(x, y, z);
            p.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.4,
                (Math.random() - 0.5) * 0.2
            );
            p.life = 1.0;

            this.scene.add(p);
            this.particles.push(p);
        }
    }

    createSparks(x, y, z) {
        const count = 15;
        for (let i = 0; i < count; i++) {
            const geo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
            const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const p = new THREE.Mesh(geo, mat);

            p.position.set(x, y, z);
            p.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3
            );
            p.life = 1.0;

            this.scene.add(p);
            this.particles.push(p);
        }
    }

    spawnWeatherParticle() {
        if (this.weatherType === 'none') return;

        const range = 50;
        const x = (Math.random() - 0.5) * range + 10;
        const z = (Math.random() - 0.5) * range + 10;
        const y = 30;

        let p;
        if (this.weatherType === 'rain') {
            const geo = new THREE.CylinderGeometry(0.02, 0.02, 0.5);
            const mat = new THREE.MeshBasicMaterial({ color: 0xaaccff, transparent: true, opacity: 0.4 });
            p = new THREE.Mesh(geo, mat);
            p.velocity = new THREE.Vector3(0, -0.8, 0);
        } else if (this.weatherType === 'sand') {
            const geo = new THREE.SphereGeometry(0.05, 4, 4);
            const mat = new THREE.MeshBasicMaterial({ color: 0xedc9af, transparent: true, opacity: 0.6 });
            p = new THREE.Mesh(geo, mat);
            p.velocity = new THREE.Vector3(-0.5, -0.1, (Math.random() - 0.5) * 0.5);
        }

        if (p) {
            p.position.set(x, y, z);
            p.life = 4.0;
            p.isWeather = true;
            this.scene.add(p);
            this.particles.push(p);
        }
    }

    update(dt) {
        // Spawn constant weather
        if (this.weatherType !== 'none') {
            this.weatherTimer += dt;
            if (this.weatherTimer > (this.weatherType === 'rain' ? 0.02 : 0.05)) {
                this.spawnWeatherParticle();
                this.weatherTimer = 0;
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;

            if (p.life <= 0 || p.position.y < -5) {
                this.scene.remove(p);
                this.particles.splice(i, 1);
                continue;
            }

            p.position.add(p.velocity);

            if (!p.isWeather) {
                p.velocity.y -= 0.01; // Gravity (fake)
            }

            if (p.rotationSpeed) {
                p.rotation.x += p.rotationSpeed.x;
                p.rotation.y += p.rotationSpeed.y;
            }

            if (p.material.opacity !== undefined && !p.isWeather) {
                p.material.opacity = p.life;
            }
        }
    }
}
