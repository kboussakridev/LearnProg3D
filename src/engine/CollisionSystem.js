import * as THREE from 'three';

export class CollisionSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.collectedCount = 0;
    }

    checkInteractions(actor) {
        const level = this.game.currentLevel;
        if (!level) return;

        // Use mesh position for real-time accuracy during lerp
        const px = actor.mesh.position.x;
        const pz = actor.mesh.position.z;
        const gx = Math.round(px);
        const gz = Math.round(pz);

        // Filter objects at same grid pos. 
        // We only interact if physically close to the center of the tile.
        const distToCenter = Math.sqrt(Math.pow(px - gx, 2) + Math.pow(pz - gz, 2));
        if (distToCenter > 0.3) return;

        const collisions = level.entities.filter(e =>
            e !== actor &&
            e.gridPos.x === gx &&
            e.gridPos.y === gz
        );

        collisions.forEach(entity => {
            this.resolveCollision(actor, entity);
        });
    }

    resolveCollision(actor, entity) {
        // Monkey vs Banana
        if (actor.constructor.name === 'Monkey' && entity.constructor.name === 'Banana') {
            if (entity.active) {
                this.collectBanana(entity);
            }
        }

        // Monkey vs Crocodile or Snake (Game Over)
        if (actor.constructor.name === 'Monkey' &&
            (entity.constructor.name === 'Crocodile' || entity.constructor.name === 'Snake')) {
            this.game.audio.playSound('death');
            this.game.eventBus.emit('GAME_OVER', `Ouch! ${entity.constructor.name}!`);
        }

        // Monkey vs Switch
        if (actor.constructor.name === 'Monkey' && entity.constructor.name === 'Switch') {
            if (!entity.isPressed) {
                entity.press();
                this.game.audio.playSound('switch');
                if (this.game.particles) {
                    this.game.particles.createSparks(entity.mesh.position.x, 0.2, entity.mesh.position.z);
                }
            }
        }

        // Monkey vs Teleporter
        if (actor.constructor.name === 'Monkey' && entity.constructor.name === 'Teleporter') {
            if (entity.cooldown <= 0) {
                // Find pair
                const pair = this.game.currentLevel.entities.find(e =>
                    e.constructor.name === 'Teleporter' &&
                    e.pairId === entity.pairId &&
                    e !== entity
                );

                if (pair) {
                    entity.cooldown = 3.0;
                    pair.cooldown = 3.0;

                    actor.gridPos.x = pair.gridPos.x;
                    actor.gridPos.y = pair.gridPos.y;

                    if (actor.updateVisualsImmediate) {
                        actor.updateVisualsImmediate();
                        actor.isJumping = false;
                    }

                    this.game.audio.playSound('teleport');
                    if (this.game.particles) {
                        this.game.particles.createConfetti(pair.mesh.position.x, 1, pair.mesh.position.z);
                    }
                }
            }
        }
    }

    updateGates(level) {
        // Collect all gateIds that should be OPEN
        const openGateIds = new Set(
            level.entities
                .filter(e => e.constructor.name === 'Switch' && e.isPressed)
                .map(s => s.gateId)
        );

        // Update all gates
        level.entities.forEach(e => {
            if (e.constructor.name === 'Gate') {
                if (openGateIds.has(e.gateId)) {
                    if (!e.isOpen) e.open();
                } else {
                    if (e.isOpen) e.close();
                }
            }
        });
    }

    collectBanana(banana) {
        banana.active = false;
        banana.mesh.visible = false; // Hide it

        // Visual effect (tween up and vanish)
        // For now just hide.

        this.collectedCount++;
        this.game.audio.playSound('banana');
        console.log("Banana collected! Total:", this.collectedCount);

        // Particle effect
        if (this.game.particles) {
            this.game.particles.createSparks(banana.mesh.position.x, 0.5, banana.mesh.position.z);
        }

        // Check win condition
        this.checkWinState();
    }

    checkWinState() {
        // Count active bananas remaining
        const remaining = this.game.currentLevel.entities.filter(e =>
            e.constructor.name === 'Banana' && e.active
        ).length;

        if (remaining === 0) {
            const levelData = this.game.currentLevel.data;
            const count = this.game.interpreter.commandCount;

            let stars = 1;
            if (levelData.stars) {
                if (count <= levelData.stars["3"]) stars = 3;
                else if (count <= levelData.stars["2"]) stars = 2;
            }

            console.log(`WIN! Steps: ${count}, Stars: ${stars}`);
            this.game.completeLevel(stars, count);
            this.game.audio.playSound('victory');

            // Victory confetti
            if (this.game.particles) {
                const monkeyPos = this.game.currentLevel.monkey.mesh.position;
                this.game.particles.createConfetti(monkeyPos.x, monkeyPos.y + 1, monkeyPos.z);
            }
        }
    }

    reset() {
        this.collectedCount = 0;
    }
}
