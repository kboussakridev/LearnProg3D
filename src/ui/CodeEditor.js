export class CodeEditor {
    constructor(elementId, game) {
        this.container = document.getElementById(elementId);
        this.game = game;
        this.blocks = [];
        this.currentContainer = null; // Track where new blocks go
        this.render();

        // Listen for level load to clear editor
        this.game.eventBus.on('LEVEL_LOADED', () => this.clear());

        // Highlighting
        this.game.eventBus.on('BLOCK_STARTED', (id) => this.highlightBlock(id, true));
        this.game.eventBus.on('BLOCK_FINISHED', (id) => this.highlightBlock(id, false));
    }

    addBlock(type) {
        // Basic adding to root for now
        // TODO: Handle nested adding if a "REPEAT" block is selected?
        // For simplicity: Add to end.

        let block = {
            id: Date.now() + Math.random(),
            type: type
        };

        if (type === 'REPEAT' || type === 'WHILE_BANANA' || type.startsWith('IF')) {
            block.children = [];
            if (type === 'REPEAT') block.times = 3;
        }

        // If the *last* block is a container, should we add inside?
        // Let's implement a rudimentary "Context":
        // If user clicks "End Block", pop context.
        // If user clicks Container, push context.
        // THIS IS HARD for a simple text list.

        // "Scratch-lite" Approach:
        // We add to the main list.
        // Containers have a special UI.
        // We need a way to add *inside*.
        // Let's keep it extremely simple: 1 level of depth for Repeats.

        if (this.currentContainer) {
            this.currentContainer.children.push(block);
        } else {
            this.blocks.push(block);
        }

        this.render();
    }

    setContainer(block) {
        if (this.currentContainer === block) {
            this.currentContainer = null; // Toggle off
        } else {
            this.currentContainer = block;
        }
        this.render();
    }

    // Add inside a specific parent (hacky for demo)
    addBlockToParent(parent, type) {
        parent.children.push({
            id: Date.now() + Math.random(),
            type: type
        });
        this.render();
    }

    clear() {
        this.blocks = [];
        this.currentContainer = null;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.renderBlockList(this.blocks, this.container);
    }

    renderBlockList(list, parentEl) {
        list.forEach((block, index) => {
            const el = document.createElement('div');
            el.className = 'code-block';
            el.dataset.id = block.id;
            el.style.padding = "10px";
            el.style.margin = "5px";
            el.style.backgroundColor = this.getColor(block.type);
            el.style.borderRadius = "5px";
            el.style.color = "white";
            el.style.fontFamily = "monospace";
            el.style.cursor = "pointer";
            el.style.border = this.currentContainer === block ? "3px solid white" : "none";

            const labelSpan = document.createElement('span');
            labelSpan.innerText = this.getLabel(block.type);
            el.appendChild(labelSpan);

            // Delete button
            const delBtn = document.createElement('span');
            delBtn.innerText = " ❌";
            delBtn.style.float = "right";
            delBtn.onclick = (e) => {
                e.stopPropagation();
                list.splice(index, 1);
                if (this.currentContainer === block) this.currentContainer = null;
                this.render();
            };
            el.appendChild(delBtn);

            el.onclick = (e) => {
                e.stopPropagation();
                if (block.children) {
                    this.setContainer(block);
                }
            };

            // Drag & Drop
            el.draggable = true;
            el.ondragstart = (e) => {
                e.stopPropagation();
                e.dataTransfer.setData('blockId', block.id);
                el.style.opacity = "0.5";
            };
            el.ondragend = () => {
                el.style.opacity = "1";
            };
            el.ondragover = (e) => {
                e.preventDefault();
                el.style.borderTop = "2px solid white";
            };
            el.ondragleave = () => {
                el.style.borderTop = "none";
            };
            el.ondrop = (e) => {
                e.preventDefault();
                e.stopPropagation();
                el.style.borderTop = "none";
                const draggedId = parseFloat(e.dataTransfer.getData('blockId'));
                this.moveBlock(draggedId, list, index);
            };

            parentEl.appendChild(el);

            if (block.children) {
                const childContainer = document.createElement('div');
                childContainer.style.marginLeft = "20px";
                childContainer.style.marginTop = "5px";
                childContainer.style.borderLeft = "2px dashed rgba(255,255,255,0.5)";
                childContainer.style.minHeight = "10px";
                childContainer.style.background = "rgba(0,0,0,0.1)";

                this.renderBlockList(block.children, childContainer);
                el.appendChild(childContainer);

                // Times input for REPEAT
                if (block.type === 'REPEAT') {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.value = block.times || 3;
                    input.style.width = "40px";
                    input.style.marginLeft = "10px";
                    input.onclick = (e) => e.stopPropagation();
                    input.oninput = (e) => { block.times = parseInt(e.target.value) || 1; };
                    labelSpan.after(input);
                }
            }
        });
    }

    getLabel(type) {
        const labels = {
            'MOVE': '⬆️ Move',
            'TURN_LEFT': '⬅️ Turn Left',
            'TURN_RIGHT': '➡️ Turn Right',
            'REPEAT': '🔁 Repeat',
            'WHILE_BANANA': '♾️ While Bananas',
            'IF_TURTLE': '🐢 If Turtle',
            'JUMP': '🦘 Jump'
        };
        return labels[type] || type;
    }

    getColor(type) {
        if (type === 'MOVE') return '#2980b9'; // Blue
        if (type.startsWith('TURN')) return '#27ae60'; // Green
        if (type === 'REPEAT' || type === 'WHILE_BANANA') return '#e67e22'; // Orange
        if (type.startsWith('IF')) return '#8e44ad'; // Purple
        return '#7f8c8d';
    }

    moveBlock(id, targetList, targetIndex) {
        // 1. Find and remove the block from wherever it is
        let draggedBlock = null;
        const findAndRemove = (list) => {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    draggedBlock = list.splice(i, 1)[0];
                    return true;
                }
                if (list[i].children && findAndRemove(list[i].children)) return true;
            }
            return false;
        };

        findAndRemove(this.blocks);

        // 2. Insert into target list
        if (draggedBlock) {
            targetList.splice(targetIndex, 0, draggedBlock);
            this.render();
        }
    }

    highlightBlock(id, active) {
        const el = this.container.querySelector(`[data-id="${id}"]`);
        if (el) {
            if (active) {
                el.style.boxShadow = "0 0 15px #f1c40f";
                el.style.transform = "scale(1.05)";
                el.style.transition = "all 0.1s";
            } else {
                el.style.boxShadow = "none";
                el.style.transform = "scale(1.0)";
            }
        }
    }

    getProgram() {
        return this.blocks;
    }
}
