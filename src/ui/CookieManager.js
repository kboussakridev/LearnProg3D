export class CookieManager {
    constructor(game) {
        this.game = game;
        this.storageKey = 'learnprog_cookie_consent';
        this.modal = null;
        this.badge = null;
        this.init();
    }

    init() {
        const consent = localStorage.getItem(this.storageKey);
        if (!consent) {
            setTimeout(() => this.showModal(), 1000);
        } else {
            this.showBadge();
        }
    }

    showModal(isEditing = false) {
        if (this.modal) return;
        if (this.badge) this.badge.remove();

        this.modal = document.createElement('div');
        this.modal.className = 'cookie-modal';
        this.modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            background: rgba(30, 30, 40, 0.98);
            backdrop-filter: blur(15px);
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
            color: white;
            z-index: 10001;
            pointer-events: auto;
            font-family: 'Inter', sans-serif;
            text-align: center;
        `;

        this.modal.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 20px;">🍪</div>
            <h2 style="font-size: 1.8rem; margin-bottom: 15px; font-weight: 800;">Expérience Personnalisée</h2>
            <p style="color: #bbb; line-height: 1.6; margin-bottom: 30px;">
                Nous utilisons des cookies pour améliorer votre apprentissage et sauvegarder votre progression dans LearnProg 3D.
            </p>
            
            <div id="cookie-options" style="display: none; text-align: left; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" checked disabled style="margin-right: 15px;">
                    <span>Essentiels (Système & Auth)</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="cookie-analytics" checked style="margin-right: 15px;">
                    <span>Analyse & Statistiques</span>
                </label>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button id="cookie-accept" style="padding: 15px; border-radius: 12px; background: #3a7bd5; color: white; border: none; font-weight: bold; cursor: pointer; transition: 0.2s;">TOUT ACCEPTER</button>
                <div style="display: flex; gap: 10px;">
                    <button id="cookie-refuse" style="flex: 1; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.05); color: #ccc; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">REFUSER</button>
                    <button id="cookie-personalize" style="flex: 1; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.05); color: #ccc; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">PERSONNALISER</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        // Buttons
        this.modal.querySelector('#cookie-accept').onclick = () => this.handleAction('all');
        this.modal.querySelector('#cookie-refuse').onclick = () => this.handleAction('essential');
        this.modal.querySelector('#cookie-personalize').onclick = () => {
            const options = this.modal.querySelector('#cookie-options');
            options.style.display = options.style.display === 'none' ? 'block' : 'none';
        };
    }

    handleAction(type) {
        const choice = type === 'all' ? { essential: true, analytics: true } : { essential: true, analytics: false };
        localStorage.setItem(this.storageKey, JSON.stringify(choice));

        // Minimize animation
        this.modal.classList.add('minimizing');
        setTimeout(() => {
            this.modal.remove();
            this.modal = null;
            this.showBadge();
        }, 600);
    }

    showBadge() {
        if (this.badge) return;

        this.badge = document.createElement('div');
        this.badge.className = 'cookie-badge';
        this.badge.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #3a7bd5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(58, 123, 213, 0.4);
            z-index: 10000;
            pointer-events: auto;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-size: 1.5rem;
        `;
        this.badge.innerHTML = '🍪';
        this.badge.title = 'Paramètres des cookies';

        this.badge.onmouseenter = () => this.badge.style.transform = 'scale(1.1)';
        this.badge.onmouseleave = () => this.badge.style.transform = 'scale(1)';
        this.badge.onclick = () => this.showModal(true);

        document.body.appendChild(this.badge);
    }
}
