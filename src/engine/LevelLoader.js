import * as THREE from 'three';
import { Monkey } from '../entities/Monkey.js';
import { Banana } from '../entities/Banana.js';
import { Turtle } from '../entities/Turtle.js';
import { Crocodile } from '../entities/Crocodile.js';
import { WorldDecor } from '../entities/WorldDecor.js';
import { Switch } from '../entities/Switch.js';
import { Gate } from '../entities/Gate.js';
import { Teleporter } from '../entities/Teleporter.js';
import { MovingPlatform } from '../entities/MovingPlatform.js';
import { Snake } from '../entities/Snake.js';
import { PushableBlock } from '../entities/PushableBlock.js';

// Static level imports to avoid dynamic import issues
import level1 from '../levels/level1.json';
import level2 from '../levels/level2.json';
import level3 from '../levels/level3.json';
import level4 from '../levels/level4.json';
import level5 from '../levels/level5.json';
import level6 from '../levels/level6.json';
import level7 from '../levels/level7.json';
import level8 from '../levels/level8.json';
import level9 from '../levels/level9.json';
import level10 from '../levels/level10.json';
import level11 from '../levels/level11.json';
import level12 from '../levels/level12.json';
import level13 from '../levels/level13.json';
import level14 from '../levels/level14.json';
import level15 from '../levels/level15.json';
import level16 from '../levels/level16.json';
import level17 from '../levels/level17.json';
import level18 from '../levels/level18.json';
import level19 from '../levels/level19.json';
import level20 from '../levels/level20.json';
import level21 from '../levels/level21.json';
import level22 from '../levels/level22.json';
import level23 from '../levels/level23.json';
import level24 from '../levels/level24.json';
import level25 from '../levels/level25.json';
import level26 from '../levels/level26.json';
import level27 from '../levels/level27.json';
import level28 from '../levels/level28.json';
import level29 from '../levels/level29.json';
import level30 from '../levels/level30.json';
import level31 from '../levels/level31.json';
import level32 from '../levels/level32.json';
import level33 from '../levels/level33.json';
import level34 from '../levels/level34.json';
import level35 from '../levels/level35.json';
import level36 from '../levels/level36.json';
import level37 from '../levels/level37.json';
import level38 from '../levels/level38.json';
import level39 from '../levels/level39.json';
import level40 from '../levels/level40.json';
import level41 from '../levels/level41.json';
import level42 from '../levels/level42.json';
import level43 from '../levels/level43.json';
import level44 from '../levels/level44.json';
import level45 from '../levels/level45.json';

const LEVELS = {
    1: level1, 2: level2, 3: level3, 4: level4, 5: level5,
    6: level6, 7: level7, 8: level8, 9: level9, 10: level10,
    11: level11, 12: level12, 13: level13, 14: level14, 15: level15,
    16: level16, 17: level17, 18: level18, 19: level19, 20: level20,
    21: level21, 22: level22, 23: level23, 24: level24, 25: level25,
    26: level26, 27: level27, 28: level28, 29: level29, 30: level30,
    31: level31, 32: level32, 33: level33, 34: level34, 35: level35,
    36: level36, 37: level37, 38: level38, 39: level39, 40: level40,
    41: level41, 42: level42, 43: level43, 44: level44, 45: level45
};

export class LevelLoader {
    constructor(gameEngine) {
        this.game = gameEngine;
    }

    async load(levelId) {
        try {
            console.log(`Loading level ${levelId}...`);
            const levelData = LEVELS[levelId];
            if (!levelData) {
                console.error(`Level ${levelId} not found!`);
                return null;
            }

            console.log("Level data loaded:", levelData);
            const level = new Level(this.game, levelData);
            return level;
        } catch (e) {
            console.error("Failed to load level", e);
            return null;
        }
    }

    async getLevelData(id) {
        return LEVELS[id];
    }
}
class Level {
    constructor(game, data) {
        this.game = game;
        this.scene = game.scene;
        this.data = data;
        this.entities = [];
        this.width = data.grid[0];
        this.height = data.grid[1];
        this.biome = data.biome || 'jungle';

        this.game.updateEnvironment(this.biome);

        // Auto weather based on biome
        if (this.game.particles) {
            if (this.biome === 'jungle') this.game.particles.setWeather('rain');
            else if (this.biome === 'desert') this.game.particles.setWeather('sand');
            else this.game.particles.setWeather('none');
        }

        this.createGrid();
        this.spawnEntities();
    }

    createGrid() {
        const colors = {
            'jungle': 0x2d6a4f,
            'desert': 0xd2b48c,
            'ice': 0xe0f7fa,
            'night': 0x0a0a1a
        };

        const geo = new THREE.PlaneGeometry(this.width, this.height);
        const mat = new THREE.MeshStandardMaterial({
            color: colors[this.biome] || colors['jungle'],
            roughness: 0.9,
            metalness: 0.1
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(this.width / 2 - 0.5, -0.01, this.height / 2 - 0.5);
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.gridMesh = mesh;

        // Grid Lines
        const helper = new THREE.GridHelper(Math.max(this.width, this.height), Math.max(this.width, this.height), 0xffffff, 0xffffff);
        helper.position.set(this.width / 2 - 0.5, 0.02, this.height / 2 - 0.5);
        helper.material.opacity = 0.15;
        helper.material.transparent = true;
        this.scene.add(helper);
    }

    spawnEntities() {
        // Monkey
        this.monkey = new Monkey(this.scene, this.data.monkeyStart);
        this.entities.push(this.monkey);

        // Bananas
        if (this.data.bananas) {
            this.data.bananas.forEach(b => {
                const banana = new Banana(this.scene, b.x, b.y);
                this.entities.push(banana);
            });
        }

        // Turtles
        if (this.data.turtles) {
            this.data.turtles.forEach(t => {
                const turtle = new Turtle(this.scene, t.x, t.y, t.rotation);
                this.entities.push(turtle);
            });
        }

        // Crocodiles
        if (this.data.crocodiles) {
            this.data.crocodiles.forEach(c => {
                const croc = new Crocodile(this.scene, c.x, c.y, c.rotation, c.patrol || 0);
                this.entities.push(croc);
            });
        }

        // Switches
        if (this.data.switches) {
            this.data.switches.forEach(s => {
                const sw = new Switch(this.scene, s.x, s.y, s.gateId);
                this.entities.push(sw);
            });
        }

        // Gates
        if (this.data.gates) {
            this.data.gates.forEach(g => {
                const gate = new Gate(this.scene, g.x, g.y, g.gateId);
                this.entities.push(gate);
            });
        }

        // Teleporters
        if (this.data.teleporters) {
            this.data.teleporters.forEach(t => {
                const tel = new Teleporter(this.scene, t.x, t.y, t.pairId, t.color);
                this.entities.push(tel);
            });
        }

        // Moving Platforms
        if (this.data.platforms) {
            this.data.platforms.forEach(p => {
                const plat = new MovingPlatform(this.scene, p.points, p.speed);
                this.entities.push(plat);
            });
        }

        // Snakes
        if (this.data.snakes) {
            this.data.snakes.forEach(s => {
                const snake = new Snake(this.scene, s.x, s.y, s.rotation, s.range);
                this.entities.push(snake);
            });
        }

        // Pushable Blocks
        if (this.data.pushables) {
            this.data.pushables.forEach(p => {
                const block = new PushableBlock(this.scene, p.x, p.y);
                this.entities.push(block);
            });
        }

        // Random Decor around the grid
        for (let i = 0; i < 10; i++) {
            const rx = (Math.random() - 0.5) * 40 + this.width / 2;
            const rz = (Math.random() - 0.5) * 40 + this.height / 2;

            // Only place if outside grid
            if (rx < -1 || rx > this.width || rz < -1 || rz > this.height) {
                if (this.biome === 'jungle') {
                    WorldDecor.createPalmTree(this.scene, rx, rz);
                    WorldDecor.createDecorCrocodile(this.scene, rx + 2, rz + 2, Math.random() * Math.PI * 2, 2);
                } else if (this.biome === 'volcano') {
                    WorldDecor.createSandMound(this.scene, rx, rz); // Reuse for lava hills
                } else if (this.biome === 'sky') {
                    // Sky biome decor placeholder (maybe floating rocks later)
                    WorldDecor.createPalmTree(this.scene, rx, rz); // Cloud trees?
                } else if (this.biome === 'digital') {
                    // Neon towers
                    WorldDecor.createCactus(this.scene, rx, rz); // Cactus neon? Let's use it as placeholder
                } else if (this.biome === 'space') {
                    // Space decor (floating shards)
                    WorldDecor.createSnowPine(this.scene, rx, rz); // Crystal shards?
                }
            }
        }
    }

    tryPush(fromX, fromY, toX, toY) {
        // Find if there's a pushable block at (fromX, fromY)
        const block = this.entities.find(e =>
            e.constructor.name === 'PushableBlock' &&
            e.gridPos.x === fromX && e.gridPos.y === fromY
        );

        if (!block) return true; // No block, move is clear (from block perspective)

        // Calculate where the block would go
        const dx = fromX - toX; // Inverse of monkey direction? Wait.
        // Let's use simpler relative logic
    }

    isValidMove(x, y, actor) {
        // Bounds Check
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;

        // Obstacle Check (Gates)
        const gateBlocked = this.entities.some(e =>
            e.constructor.name === 'Gate' &&
            e.gridPos.x === x && e.gridPos.y === y &&
            !e.isOpen
        );
        if (gateBlocked) return false;

        // Pushable Block Check
        const block = this.entities.find(e =>
            e.constructor.name === 'PushableBlock' &&
            e.gridPos.x === x && e.gridPos.y === y
        );

        if (block && actor && actor.constructor.name === 'Monkey') {
            // Monkey tries to push it!
            const dx = x - actor.gridPos.x;
            const dy = y - actor.gridPos.y;
            const targetX = x + dx;
            const targetY = y + dy;

            // Can the block move there?
            if (this.isValidMove(targetX, targetY, block)) {
                block.moveTo(targetX, targetY);
                return true; // Move becomes valid because block moved!
            }
            return false;
        }

        if (block) return false; // Blocks other entities or secondary push (for now)

        return true;
    }

    update(dt) {
        this.entities.forEach(e => {
            if (e.constructor.name === 'Crocodile') e.update(dt, this.monkey);
            else if (e.constructor.name === 'Snake') e.update(dt, this.monkey);
            else e.update(dt);
        });

        // Real-time danger collision check
        if (this.game.collisionSystem && this.monkey) {
            this.game.collisionSystem.checkInteractions(this.monkey);
        }

        // Global systems update
        if (this.game.collisionSystem) {
            this.game.collisionSystem.updateGates(this);
        }
    }
}
