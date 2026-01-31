export class Toolbox {
    constructor(elementId, editor) {
        this.container = document.getElementById(elementId);
        this.editor = editor;

        this.createBtn('MOVE', '⬆️ Move', '#2980b9');
        this.createBtn('JUMP', '🦘 Jump', '#8e44ad');
        this.createBtn('TURN_LEFT', '⬅️ Left', '#27ae60');
        this.createBtn('TURN_RIGHT', '➡️ Right', '#27ae60');
        this.createBtn('REPEAT', '🔁 Repeat', '#e67e22');
        this.createBtn('WHILE_BANANA', '🍌 While Banana', '#e67e22');
        this.createBtn('WHILE_CLEAR', '✅ While Clear', '#e67e22');
        this.createBtn('IF_OBSTACLE', '🚧 If Wall', '#e74c3c');
        this.createBtn('IF_NOT_OBSTACLE', '🔓 If Clear', '#2ecc71');
        this.createBtn('INC_VAR', '➕ Counter +1', '#34495e');
        this.createBtn('DEC_VAR', '➖ Counter -1', '#34495e');

        const hint = document.createElement('div');
        hint.innerHTML = "<small>💡 Clique sur un bloc 'Répéter' pour ajouter des commandes dedans !</small>";
        hint.style.color = "#ccc";
        hint.style.marginTop = "20px";
        hint.style.padding = "10px";
        hint.style.fontSize = "0.8rem";
        this.container.appendChild(hint);
    }

    createBtn(type, label, color) {
        const btn = document.createElement('div');
        btn.innerText = label;
        btn.style.cssText = `
            padding: 10px;
            margin: 5px;
            background: ${color};
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-family: sans-serif;
            text-align: center;
        `;
        btn.onclick = () => this.editor.addBlock(type);
        this.container.appendChild(btn);
    }
}
