export class Interpreter {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.isRunning = false;
        this.variables = {};
        this.functions = {};
    }

    async run(program) {
        if (this.isRunning) return;
        this.isRunning = true;
        this.commandCount = 0;
        console.log("Interpreter: STARTING PROGRAM", program);

        const monkey = this.game.currentLevel?.monkey;
        if (monkey) {
            monkey.isMoving = false;
            monkey.updateVisualsImmediate(); // Snap to grid
            monkey.isDancing = false;
            monkey.isSad = false;
        }

        try {
            await this.executeBlockList(program);
            this.game.eventBus.emit('PROGRAM_FINISHED', { count: this.commandCount });
        } catch (e) {
            console.error(e);
            this.game.eventBus.emit('PROGRAM_ERROR', e);
        }

        this.isRunning = false;
    }

    async executeBlockList(blocks) {
        for (const block of blocks) {
            if (!this.isRunning) break;

            this.commandCount++;

            // Emit start event for highlighting
            this.game.eventBus.emit('BLOCK_STARTED', block.id);

            await this.executeCommand(block);

            // Emit end event
            this.game.eventBus.emit('BLOCK_FINISHED', block.id);
        }
    }

    async executeCommand(cmd) {
        if (!this.isRunning) return;
        const monkey = this.game.currentLevel.monkey;

        switch (cmd.type) {
            case 'MOVE':
                {
                    const next = monkey.getNextPosition();
                    console.log(`Interpreter: Checking move to (${next.x}, ${next.y})`);
                    if (this.game.currentLevel.isValidMove(next.x, next.y, monkey)) {
                        await monkey.moveForward();
                        this.game.collisionSystem.checkInteractions(monkey);
                    } else {
                        console.log("Interpreter: Path BLOCKED!");
                        await monkey.shake();
                    }
                }
                break;
            case 'TURN_LEFT':
                await monkey.turnLeft();
                break;
            case 'TURN_RIGHT':
                await monkey.turnRight();
                break;
            case 'REPEAT':
                for (let i = 0; i < cmd.times; i++) {
                    if (!this.isRunning) break;
                    await this.executeBlockList(cmd.children);
                }
                break;
            case 'WHILE_CLEAR':
                // "While no obstacle ahead"
                while (this.isRunning) {
                    const next = monkey.getNextPosition();
                    if (!this.game.currentLevel.isValidMove(next.x, next.y, monkey)) break;

                    await this.executeBlockList(cmd.children);
                    await new Promise(r => setTimeout(r, 100));
                }
                break;
            case 'IF_OBSTACLE':
                {
                    const next = monkey.getNextPosition();
                    if (!this.game.currentLevel.isValidMove(next.x, next.y, monkey)) {
                        await this.executeBlockList(cmd.children);
                    }
                }
                break;
            case 'IF_NOT_OBSTACLE':
                {
                    const next = monkey.getNextPosition();
                    if (this.game.currentLevel.isValidMove(next.x, next.y, monkey)) {
                        await this.executeBlockList(cmd.children);
                    }
                }
                break;
            case 'INC_VAR':
                this.variables[cmd.varName || 'a'] = (this.variables[cmd.varName || 'a'] || 0) + 1;
                console.log(`Variable ${cmd.varName || 'a'} is now ${this.variables[cmd.varName || 'a']}`);
                break;
            case 'DEC_VAR':
                this.variables[cmd.varName || 'a'] = (this.variables[cmd.varName || 'a'] || 0) - 1;
                break;
            case 'JUMP':
                {
                    const next1 = monkey.getNextPosition(1); // First tile
                    const next2 = monkey.getNextPosition(2); // Final tile

                    // Check both tiles are valid
                    const tile1Valid = this.game.currentLevel.isValidMove(next1.x, next1.y, monkey);
                    const tile2Valid = this.game.currentLevel.isValidMove(next2.x, next2.y, monkey);

                    if (tile1Valid && tile2Valid) {
                        await monkey.jump();
                        this.game.collisionSystem.checkInteractions(monkey);
                    } else {
                        console.log("Jump Blocked!");
                        await monkey.shake();
                    }
                }
                break;
            case 'DEFINE_FUNC':
                this.functions[cmd.name] = cmd.children;
                break;
            case 'CALL_FUNC':
                if (this.functions[cmd.name]) {
                    await this.executeBlockList(this.functions[cmd.name]);
                }
                break;
        }

        // Global delay for pacing
        await new Promise(r => setTimeout(r, 300));

        // Advance world (moving platforms etc)
        this.game.currentLevel.entities.forEach(e => {
            if (e.moveNext) e.moveNext();
        });
    }

    stop() {
        this.isRunning = false;
    }
}
