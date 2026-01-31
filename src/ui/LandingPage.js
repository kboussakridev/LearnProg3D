export class LandingPage {
    constructor(game) {
        this.game = game;
        this.container = null;
    }

    show() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'landing-page';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0f0c29;
            background: linear-gradient(to bottom, #24243e, #302b63, #0f0c29);
            color: white;
            z-index: 9999;
            overflow-y: auto;
            font-family: 'Outfit', 'Inter', sans-serif;
            scroll-behavior: smooth;
        `;

        this.container.innerHTML = `
            <!-- Navigation -->
            <nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 50px; position: sticky; top: 0; background: rgba(15, 12, 41, 0.8); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.1); z-index: 100;">
                <div style="font-size: 1.5rem; font-weight: 800; background: linear-gradient(45deg, #00d2ff, #3a7bd5); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🛸 LearnProg 3D</div>
                <button id="nav-login-btn" style="padding: 10px 25px; border-radius: 50px; background: white; color: #0f0c29; border: none; font-weight: bold; cursor: pointer; transition: transform 0.2s;">Se Connecter</button>
            </nav>

            <!-- Hero Section -->
            <section style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center; padding: 0 20px;">
                <h1 style="font-size: 4rem; margin-bottom: 20px; font-weight: 900; line-height: 1.1;">Apprends à Coder en<br><span style="color: #00d2ff;">Dimension 3D</span></h1>
                <p style="font-size: 1.2rem; color: #ccc; max-width: 600px; margin-bottom: 40px;">Maîtrise la logique de programmation à travers 45 niveaux épiques. Pas besoin de syntaxe complexe, utilise des blocs pour diriger ton héros !</p>
                <button id="hero-start-btn" style="padding: 18px 45px; font-size: 1.2rem; border-radius: 50px; background: linear-gradient(45deg, #00d2ff, #3a7bd5); color: white; border: none; font-weight: bold; cursor: pointer; box-shadow: 0 10px 30px rgba(0, 210, 255, 0.3); transition: transform 0.2s;">COMMENCER L'AVENTURE</button>
                
                <div style="margin-top: 60px; width: 80%; max-width: 900px; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);">
                    <img src="/img/fonction.png" alt="LearnProg Code Editor" style="width: 100%; display: block;">
                </div>
            </section>

            <!-- Features Section -->
            <section style="padding: 100px 50px; background: rgba(0,0,0,0.2);">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <h2 style="font-size: 2.5rem; text-align: center; margin-bottom: 80px;">Pourquoi LearnProg 3D ?</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
                        <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: 3rem; margin-bottom: 20px;">🧠</div>
                            <h3 style="margin-bottom: 15px;">Logique Pure</h3>
                            <p style="color: #bbb;">Concentrez-vous sur l'algorithmique sans vous soucier des erreurs de point-virgule.</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: 3rem; margin-bottom: 20px;">🎮</div>
                            <h3 style="margin-bottom: 15px;">Progression Gamifiée</h3>
                            <p style="color: #bbb;">45 niveaux, 5 biomes uniques et des centaines d'étoiles à collectionner.</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: 3rem; margin-bottom: 20px;">☁️</div>
                            <h3 style="margin-bottom: 15px;">Sauvegarde Cloud</h3>
                            <p style="color: #bbb;">Reprenez votre partie n'importe où grâce à l'authentification sécurisée.</p>
                        </div>
                    </div>
                </div>
            </section>

             <!-- Biomes Preview -->
            <section style="padding: 100px 50px;">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 80px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 350px;">
                        <h2 style="font-size: 2.5rem; margin-bottom: 30px;">Explorez 5 Mondes Uniques</h2>
                        <p style="color: #bbb; font-size: 1.1rem; line-height: 1.6;">Du calme de la Jungle luxuriante aux tempêtes de sable du Désert, en passant par les néons de la Cité Digitale et le vide spatial.</p>
                        <ul style="margin-top: 30px; list-style: none; padding: 0;">
                            <li style="margin-bottom: 15px; display: flex; align-items: center;"><span style="color: #00d2ff; margin-right: 15px;">✓</span> Jungle Mystique</li>
                            <li style="margin-bottom: 15px; display: flex; align-items: center;"><span style="color: #00d2ff; margin-right: 15px;">✓</span> Désert Brûlant</li>
                            <li style="margin-bottom: 15px; display: flex; align-items: center;"><span style="color: #00d2ff; margin-right: 15px;">✓</span> Glace Éternelle</li>
                            <li style="margin-bottom: 15px; display: flex; align-items: center;"><span style="color: #00d2ff; margin-right: 15px;">✓</span> Cité Digitale</li>
                            <li style="margin-bottom: 15px; display: flex; align-items: center;"><span style="color: #00d2ff; margin-right: 15px;">✓</span> Vide Cosmique</li>
                        </ul>
                    </div>
                    <div style="flex: 1; min-width: 350px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                        <img src="/img/desert.png" alt="Biomes" style="width: 100%; display: block;">
                    </div>
                </div>
            </section>

            <!-- Level Selection Preview -->
            <section style="padding: 100px 50px; background: rgba(0,0,0,0.2);">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 30px;">45 Niveaux de Difficulté Croissante</h2>
                    <p style="color: #bbb; font-size: 1.1rem; line-height: 1.6; max-width: 800px; margin: 0 auto 50px;">Débloque progressivement de nouveaux défis. Chaque niveau est une énigme unique qui te fait maîtriser un concept de programmation différent.</p>
                    <div style="width: 90%; max-width: 1000px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);">
                        <img src="/img/niveaux.png" alt="Choix des Niveaux" style="width: 100%; display: block;">
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer style="padding: 50px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); color: #777;">
                <p>&copy; 2026 LearnProg 3D. Tous droits réservés.</p>
            </footer>
        `;

        document.body.appendChild(this.container);

        // Events
        this.container.querySelector('#nav-login-btn').onclick = () => this.game.auth.login();
        this.container.querySelector('#hero-start-btn').onclick = () => this.game.auth.login();
    }

    hide() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}
