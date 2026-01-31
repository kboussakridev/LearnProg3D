import { CodeEditor } from './CodeEditor.js';
import { Toolbox } from './Toolbox.js';
import { TutorialManager } from './TutorialManager.js';

export class UIManager {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.createLayout();

        this.editor = new CodeEditor('code-area', this.game);
        this.toolbox = new Toolbox('toolbox-area', this.editor);

        this.setupControls();
        this.setupEventListeners();
    }

    createLayout() {
        const overlay = document.createElement('div');
        overlay.id = 'ui-container';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            pointer-events: none;
            font-family: 'Segoe UI', sans-serif;
        `;

        // Left Panel (Tools + Code)
        const leftPanel = document.createElement('div');
        leftPanel.classList.add('left-panel');
        leftPanel.style.cssText = `
            width: 400px;
            background: rgba(30, 30, 40, 0.95);
            display: flex;
            flex-direction: column;
            pointer-events: auto;
            border-right: 2px solid #444;
            box-shadow: 2px 0 10px rgba(0,0,0,0.5);
        `;

        // Header
        const header = document.createElement('div');
        header.innerHTML = "<h1>🚀 LearnProg 3D</h1>";
        header.style.padding = "20px";
        header.style.color = "#ecf0f1";
        header.style.textAlign = "center";
        header.style.borderBottom = "1px solid #444";

        this.authContainer = document.createElement('div');
        this.authContainer.style.fontSize = "0.8rem";
        this.authContainer.style.marginTop = "10px";
        header.appendChild(this.authContainer);

        leftPanel.appendChild(header);

        // Content Area (Toolbox | Editor)
        const content = document.createElement('div');
        content.id = 'main-content';
        content.style.flex = "1";
        content.style.display = "flex";
        content.style.overflow = "hidden";

        // Toolbox Layout
        const toolboxArea = document.createElement('div');
        toolboxArea.id = 'toolbox-area';
        toolboxArea.style.width = "120px";
        toolboxArea.style.background = "rgba(0,0,0,0.2)";
        toolboxArea.style.padding = "10px";
        toolboxArea.style.overflowY = "auto";
        toolboxArea.style.borderRight = "1px solid #444";
        content.appendChild(toolboxArea);

        // Code Editor Layout
        const codeArea = document.createElement('div');
        codeArea.id = 'code-area';
        codeArea.style.flex = "1";
        codeArea.style.padding = "10px";
        codeArea.style.overflowY = "auto";
        content.appendChild(codeArea);

        leftPanel.appendChild(content);

        // Bottom Controls
        const controls = document.createElement('div');
        controls.style.padding = "10px";
        controls.style.display = "flex";
        controls.style.flexWrap = "wrap";
        controls.style.gap = "5px";
        controls.style.borderTop = "1px solid #444";
        controls.style.background = "#1a1a24";

        this.createBtn(controls, '▶RUN', () => this.run(), '#2ecc71');
        this.createBtn(controls, '🔄RESET', () => this.reset(), '#e74c3c');
        this.createBtn(controls, '📂NIVEAUX', () => this.showLevelSelector(), '#f39c12');
        this.createBtn(controls, '🛠️EDITOR', () => this.toggleEditor(), '#34495e');
        this.createBtn(controls, '💡AIDE', () => this.toggleHelp(), '#9b59b6');
        this.createBtn(controls, '🎩SHOP', () => this.showShop(), '#e67e22');

        leftPanel.appendChild(controls);

        // Help Panel
        this.helpPanel = document.createElement('div');
        this.helpPanel.style.cssText = `
            margin: 0 20px 20px 20px;
            padding: 15px;
            background: rgba(155, 89, 182, 0.2);
            border-left: 4px solid #9b59b6;
            color: #eee;
            font-size: 0.9rem;
            display: none;
            border-radius: 4px;
        `;
        leftPanel.appendChild(this.helpPanel);

        overlay.appendChild(leftPanel);
        document.body.appendChild(overlay);
    }

    showLevelSelector() {
        this.clearModals();
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(30, 30, 40, 0.95);
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0,0,0,0.8);
            border: 2px solid #f39c12;
            color: white;
            pointer-events: auto;
            z-index: 1000;
        `;

        modal.innerHTML = `<h3>Choisir un Niveau</h3><div id="level-grid" style="display: grid; grid-template-columns: repeat(9, 1fr); gap: 5px; margin-top:20px;"></div>`;
        document.body.appendChild(modal);
        this.currentModal = modal;

        const grid = modal.querySelector('#level-grid');
        for (let i = 1; i <= 45; i++) {
            const isUnlocked = this.game.saveSystem.isUnlocked(i);
            const stars = this.game.saveSystem.getStars(i);
            const btn = document.createElement('button');

            let starsStr = "";
            for (let s = 0; s < stars; s++) starsStr += "⭐";

            btn.innerHTML = `${i}<br><span style="font-size:10px">${isUnlocked ? (starsStr || "---") : "🔒"}</span>`;
            btn.style.cssText = `padding: 10px; background: ${isUnlocked ? "#34495e" : "#222"}; color: ${isUnlocked ? "white" : "#666"}; border: 1px solid #555; cursor: ${isUnlocked ? "pointer" : "default"}; border-radius: 5px;`;

            if (isUnlocked) {
                btn.onclick = () => {
                    modal.remove();
                    this.game.loadLevel(i);
                };
            }
            grid.appendChild(btn);
        }

        const close = document.createElement('button');
        close.innerText = "Fermer";
        close.style.cssText = `margin-top: 20px; background: none; border: 1px solid #888; color: #888; cursor: pointer; padding: 5px 10px;`;
        close.onclick = () => modal.remove();
        modal.appendChild(close);
    }

    createBtn(parent, text, onClick, color) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style.cssText = `
            flex: 1 1 ${text.includes('RUN') ? '100%' : '45%'}; 
            padding: 10px 5px;
            font-size: 11px;
            font-weight: bold;
            color: white;
            background: ${color};
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
        `;
        btn.onclick = onClick;
        parent.appendChild(btn);
    }

    run() {
        const program = this.editor.getProgram();
        this.game.interpreter.run(program);
    }

    reset() {
        this.clearModals();
        this.game.loadLevel(this.game.currentLevelId || 1);
    }

    setupControls() {
        // Any extra control setup
    }

    setupEventListeners() {
        this.game.eventBus.on('PROGRAM_FINISHED', () => {
            console.log("Program finished");
        });

        this.game.eventBus.on('LEVEL_WIN', (data) => {
            this.showWinModal(data.stars);
        });

        this.game.eventBus.on('GAME_OVER', (reason) => {
            this.showGameOverModal(reason);
        });

        this.game.eventBus.on('LEVEL_LOADED', () => {
            this.updateHelp(this.game.currentLevelId);
        });
    }

    toggleHelp() {
        this.clearModals();

        const modal = document.createElement('div');
        modal.className = 'modal-help';
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 700px;
            max-height: 80vh;
            background: #2c3e50;
            color: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 0 100px rgba(0,0,0,0.9);
            overflow-y: auto;
            pointer-events: auto;
            z-index: 1000;
            border: 2px solid #3498db;
            font-family: 'Segoe UI', sans-serif;
        `;

        modal.innerHTML = `
            <h1 style="text-align:center; color: #3498db; border-bottom: 2px solid #34495e; padding-bottom: 10px;">📖 MODE D'EMPLOI</h1>
            
            <section style="margin-top: 20px;">
                <h2 style="color: #f1c40f;">🎮 CONTRÔLES DE BASE</h2>
                <ul style="line-height: 1.6;">
                    <li><strong>Bouton ▶RUN</strong> : Lance l'exécution de ton programme.</li>
                    <li><strong>Bouton 🔄RESET</strong> : Réinitialise le niveau et le singe.</li>
                    <li><strong>Touche 'P'</strong> : Active le <strong>Mode Photo</strong> (caméra libre, cache l'interface).</li>
                    <li><strong>Touche 'M'</strong> : Coupe ou active le <strong>Son</strong>.</li>
                </ul>
            </section>

            <section style="margin-top: 20px;">
                <h2 style="color: #2ecc71;">🧠 BLOCS DE PROGRAMMATION</h2>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                    <p><strong>🔁 Repeat</strong> : Répète les blocs à l'intérieur un nombre de fois précis.</p>
                    <p><strong>🍌 While Banana</strong> : Répète tant qu'il reste des bananes à manger.</p>
                    <p><strong>✅ While Clear</strong> : Répète tant qu'il n'y a pas d'obstacle devant.</p>
                    <p><strong>🚧 If Wall</strong> : Exécute si un obstacle bloque la route.</p>
                    <p><strong>➕ Counter</strong> : Utilise des variables pour compter des événements.</p>
                </div>
            </section>

            <section style="margin-top: 20px;">
                <h2 style="color: #e67e22;">🛠️ ÉDITEUR DE NIVEAUX</h2>
                <p>Clique sur <strong>🛠️EDITOR</strong> pour passer en mode création :</p>
                <ul style="line-height: 1.6;">
                    <li><strong>Clic Gauche</strong> : Placer l'objet sélectionné sur la grille.</li>
                    <li><strong>Clic Droit</strong> : Supprimer un objet.</li>
                    <li><strong>Bouton EXPORTER</strong> : Récupère le code JSON de ton niveau dans la console (F12).</li>
                </ul>
            </section>

            <button id="close-help" style="display:block; margin: 30px auto 0; padding: 12px 30px; background: #3498db; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 1.1rem;">J'AI COMPRIS !</button>
        `;

        document.body.appendChild(modal);
        this.currentModal = modal;
        modal.querySelector('#close-help').onclick = () => modal.remove();
    }

    updateHelp(id) {
        // Keeping this for small in-game context tips if needed
        this.helpPanel.innerHTML = `<strong>ASTUCE :</strong><br>${TutorialManager.getTips(id)}`;
    }

    showShop() {
        this.clearModals();
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2c3e50;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0,0,0,0.8);
            color: white;
            pointer-events: auto;
        `;

        const stars = this.game.saveSystem.data.totalStars;

        modal.innerHTML = `
            <h1 style="color: #f1c40f;">MAGASIN DE CHAPEAUX</h1>
            <p style="font-size: 1.5rem;">🌟 Tes Étoiles : ${stars}</p>
            <div style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;">
                <div style="border: 2px solid #555; padding: 15px; border-radius: 10px;">
                    <p style="font-size: 2rem;">🎩</p>
                    <p>Haut-de-forme</p>
                    <button id="buy-hat-1" style="padding: 10px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        2 Etoiles
                    </button>
                </div>
                <div style="border: 2px solid #555; padding: 15px; border-radius: 10px;">
                    <p style="font-size: 2rem;">🎓</p>
                    <p>Diplôme</p>
                    <button id="buy-hat-2" style="padding: 10px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        5 Etoiles
                    </button>
                </div>
            </div>
            <button id="shop-close" style="margin-top: 30px; background: none; border: 1px solid #777; color: #777; cursor: pointer; padding: 5px 15px;">Fermer</button>
        `;

        document.body.appendChild(modal);
        this.currentModal = modal;

        modal.querySelector('#shop-close').onclick = () => modal.remove();

        modal.querySelector('#buy-hat-1').onclick = () => {
            if (stars >= 2) {
                this.game.currentLevel.monkey.addHat('tophat');
                modal.remove();
            } else alert("Pas assez d'étoiles !");
        };

        modal.querySelector('#buy-hat-2').onclick = () => {
            if (stars >= 5) {
                this.game.currentLevel.monkey.addHat('graduate');
                modal.remove();
            } else alert("Pas assez d'étoiles !");
        };
    }
    showWinModal(stars) {
        this.clearModals();

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
            animation: popIn 0.4s ease-out;
            pointer-events: auto;
        `;

        const starHTML = '⭐'.repeat(stars) + '🌑'.repeat(3 - stars);

        modal.innerHTML = `
            <h1 style="color: #27ae60; margin: 0 0 20px 0;">NIVEAU RÉUSSI !</h1>
            <div style="font-size: 3rem; letter-spacing: 10px;">${starHTML}</div>
            <p style="margin: 20px 0;">Tu as utilisé ${this.game.interpreter.commandCount} blocs.</p>
            <button id="next-level-btn" style="
                background: #27ae60; color: white; border: none; padding: 15px 30px;
                font-size: 1.2rem; border-radius: 5px; cursor: pointer; font-weight: bold;
            ">Niveau Suivant ➡</button>
        `;

        // Trigger monkey animation
        if (this.game.currentLevel && this.game.currentLevel.monkey) {
            this.game.currentLevel.monkey.victory();
        }

        document.body.appendChild(modal);
        this.currentModal = modal;

        document.getElementById('next-level-btn').onclick = () => {
            modal.remove();
            this.game.nextLevel();
        };
    }

    showGameOverModal(reason) {
        this.clearModals();

        if (this.game.currentLevel && this.game.currentLevel.monkey) {
            this.game.currentLevel.monkey.fail();
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2c3e50;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 0 50px rgba(255,0,0,0.3);
            color: white;
            pointer-events: auto;
        `;

        modal.innerHTML = `
            <h1 style="color: #e74c3c;">OUCH !</h1>
            <p style="margin: 20px 0;">${reason}</p>
            <button id="retry-btn" style="
                background: #e74c3c; color: white; border: none; padding: 15px 30px;
                font-size: 1.2rem; border-radius: 5px; cursor: pointer; font-weight: bold;
            ">Réessayer 🔄</button>
        `;

        document.body.appendChild(modal);
        this.currentModal = modal;

        document.getElementById('retry-btn').onclick = () => {
            modal.remove();
            this.game.loadLevel(this.game.currentLevelId);
        };
    }

    clearModals() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    toggleEditor() {
        this.isEditorActive = !this.isEditorActive;
        this.game.editor.setEnabled(this.isEditorActive);

        const toolbox = document.getElementById('toolbox-area');
        const codeArea = document.getElementById('code-area');

        if (this.isEditorActive) {
            toolbox.style.display = 'none';
            codeArea.style.display = 'none';
            this.showEditorPalette();
        } else {
            toolbox.style.display = 'block';
            codeArea.style.display = 'block';
            if (this.editorPalette) this.editorPalette.remove();
        }
    }

    showEditorPalette() {
        const palette = document.createElement('div');
        palette.id = 'editor-palette';
        palette.style.cssText = `
            flex: 1;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 10px;
            background: #1a1a24;
            color: white;
            overflow-y: auto;
        `;

        const types = ['Banana', 'Turtle', 'Crocodile', 'Snake', 'Switch', 'Teleporter', 'PushableBlock'];
        types.forEach(type => {
            const btn = document.createElement('div');
            btn.innerText = type;
            btn.style.cssText = `
                padding: 15px;
                background: #34495e;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                border: 2px solid transparent;
            `;
            btn.onclick = () => {
                this.game.editor.selectedType = type;
                palette.querySelectorAll('div').forEach(d => d.style.borderColor = 'transparent');
                btn.style.borderColor = '#2ecc71';
            };
            palette.appendChild(btn);
        });

        const exportBtn = document.createElement('button');
        exportBtn.innerText = "💾 EXPORTER JSON";
        exportBtn.style.cssText = "grid-column: 1 / -1; margin-top: 20px; padding: 15px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;";
        exportBtn.onclick = () => {
            const json = this.game.editor.exportLevel();
            alert("JSON copié dans la console ! (F12)");
        };
        palette.appendChild(exportBtn);

        const leftPanel = document.querySelector('.left-panel');
        const mainContent = document.getElementById('main-content');

        if (leftPanel && mainContent) {
            leftPanel.insertBefore(palette, mainContent);
        } else if (leftPanel) {
            leftPanel.appendChild(palette);
        }
        this.editorPalette = palette;
    }

    togglePhotoMode() {
        this.isPhotoMode = !this.isPhotoMode;
        const overlay = document.querySelector('div[style*="z-index: 100"]');
        if (overlay) overlay.style.display = this.isPhotoMode ? 'none' : 'block';

        if (this.game.controls) {
            this.game.controls.enabled = true; // Always allow in photo mode
            if (this.isPhotoMode) {
                console.log("PHOTO MODE: UI Hidden. Use Mouse to fly.");
            }
        }
    }

    updateAuthStatus(isAuthenticated) {
        if (!this.authContainer) return;

        if (isAuthenticated) {
            const user = this.game.auth.user;
            this.authContainer.innerHTML = `
                <span style="color: #2ecc71;">● En ligne : ${user.firstName || 'Joueur'}</span>
                <button id="auth-btn" style="margin-left:10px; background:none; border:1px solid #e74c3c; color:#e74c3c; cursor:pointer; font-size:10px; border-radius:3px;">Déconnexion</button>
            `;
            this.authContainer.querySelector('#auth-btn').onclick = () => this.game.auth.logout();
        } else {
            this.authContainer.innerHTML = `
                <span style="color: #95a5a6;">○ Mode Invité (Sauvegarde locale)</span>
                <br>
                <button id="auth-btn" style="margin-top:5px; padding: 5px 15px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">SE CONNECTER (Cloud)</button>
            `;
            this.authContainer.querySelector('#auth-btn').onclick = () => this.game.auth.login();
        }
    }
}
