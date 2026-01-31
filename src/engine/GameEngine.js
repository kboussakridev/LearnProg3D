import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EventBus } from './EventBus.js';
import { UIManager } from '../ui/UIManager.js';
import { LandingPage } from '../ui/LandingPage.js';
import { CookieManager } from '../ui/CookieManager.js';
import { LevelLoader } from './LevelLoader.js';
import { Interpreter } from './Interpreter.js';
import { CollisionSystem } from './CollisionSystem.js';
import { WorldDecor } from '../entities/WorldDecor.js';
import { TutorialManager } from '../ui/TutorialManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { SaveSystem } from './SaveSystem.js';
import { AuthManager } from './AuthManager.js';
import { CloudSaveSystem } from './CloudSaveSystem.js';
import { AudioManager } from './AudioManager.js';
import { LevelEditor } from './LevelEditor.js';
import { Banana } from '../entities/Banana.js';
import { Turtle } from '../entities/Turtle.js';
import { Crocodile } from '../entities/Crocodile.js';
import { Snake } from '../entities/Snake.js';
import { Switch } from '../entities/Switch.js';
import { Gate } from '../entities/Gate.js';
import { Teleporter } from '../entities/Teleporter.js';
import { MovingPlatform } from '../entities/MovingPlatform.js';
import { PushableBlock } from '../entities/PushableBlock.js';

export class GameEngine {
    constructor() {
        this.eventBus = new EventBus();

        // One-time setup (MUST BE FIRST for scene initialization)
        this.initEngine();

        this.loader = new LevelLoader(this);
        this.interpreter = new Interpreter(this);
        this.collisionSystem = new CollisionSystem(this);
        this.saveSystem = new SaveSystem();
        this.auth = new AuthManager(this);
        this.cloudSave = new CloudSaveSystem(this, this.auth);
        this.audio = new AudioManager();
        this.editor = new LevelEditor(this);
        this.particles = null;
        this.decorEntities = [];
        this.landingPage = new LandingPage(this);
        this.cookieManager = new CookieManager(this);

        // Resume AudioContext on first click
        window.addEventListener('click', () => {
            if (this.audio) this.audio.ctx.resume();
        }, { once: true });

        // Listeners
        window.addEventListener('resize', () => this.onWindowResize());

        // UI
        this.ui = new UIManager(this);

        // Initialize Auth
        this.auth.init();

        // Start Loop
        this.startLoop();

        // Boot first level
        // Boot logic moved to onAuthChanged
        // this.loadLevel(1);

        this.eventBus.on('EDITOR_PLACE', (data) => this.onEditorPlace(data));
        this.eventBus.on('EDITOR_REMOVE', (data) => this.onEditorRemove(data));

        window.addEventListener('contextmenu', (e) => {
            if (this.editor.active) e.preventDefault();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'p') this.ui.togglePhotoMode();
            if (e.key.toLowerCase() === 'm') this.audio.toggle();
        });
    }

    onAuthChanged(isAuthenticated) {
        if (isAuthenticated) {
            this.landingPage.hide();
            document.body.classList.add('game-active');
            this.cloudSave.syncWithCloud();
            // Load progress or level 1
            if (!this.currentLevel) this.loadLevel(1);
        } else {
            document.body.classList.remove('game-active');
            this.landingPage.show();
        }
        if (this.ui.updateAuthStatus) this.ui.updateAuthStatus(isAuthenticated);
    }

    completeLevel(stars, count) {
        this.saveSystem.setStars(this.currentLevelId, stars);
        this.saveSystem.unlockLevel(this.currentLevelId + 1);
        if (this.auth.isAuthenticated) {
            this.cloudSave.saveLevel(this.currentLevelId, stars, true);
            this.cloudSave.saveLevel(this.currentLevelId + 1, 0, true);
        }
        this.eventBus.emit('LEVEL_WIN', { stars: stars, count: count });
    }

    onEditorPlace({ type, x, y }) {
        if (!this.currentLevel) return;

        // Remove existing at this pos (optional)
        this.currentLevel.entities = this.currentLevel.entities.filter(e =>
            !(e.gridPos.x === x && e.gridPos.y === y)
        );

        // Factory for creation
        const scene = this.scene;
        let entity = null;

        switch (type) {
            case 'Banana': entity = new Banana(scene, x, y); break;
            case 'Turtle': entity = new Turtle(scene, x, y, 0); break;
            case 'Crocodile': entity = new Crocodile(scene, x, y, 0, 2); break;
            case 'Snake': entity = new Snake(scene, x, y, 0, 2); break;
            case 'Switch': entity = new Switch(scene, x, y, 1, 5); break; // Default gateId 1, duration 5
            case 'Gate': entity = new Gate(scene, x, y, 1); break; // Default gateId 1
            case 'Teleporter': entity = new Teleporter(scene, x, y, 1, 0x9b59b6); break; // Default pairId 1, purple
            case 'MovingPlatform': entity = new MovingPlatform(scene, [{ x, y }, { x: x + 2, y }], 2); break; // Default path
            case 'PushableBlock': entity = new PushableBlock(scene, x, y); break;
        }

        if (entity) {
            this.currentLevel.entities.push(entity);
        }
    }

    onEditorRemove({ x, y }) {
        if (!this.currentLevel) return;

        const toRemove = this.currentLevel.entities.filter(e =>
            e.gridPos.x === x && e.gridPos.y === y && e.constructor.name !== 'Monkey'
        );

        toRemove.forEach(e => {
            this.scene.remove(e.mesh);
        });

        this.currentLevel.entities = this.currentLevel.entities.filter(e =>
            !(e.gridPos.x === x && e.gridPos.y === y && e.constructor.name !== 'Monkey')
        );
    }

    initEngine() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa2d2ff);
        this.scene.fog = new THREE.Fog(0xa2d2ff, 20, 100);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(5, 8, 8);
        this.camera.lookAt(5, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        // Force canvas style
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '0';

        document.body.appendChild(this.renderer.domElement);

        // Lights
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.position.set(10, 20, 10);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.scene.add(this.sunLight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.maxPolarAngle = Math.PI / 2.1;
        this.controls.target.set(5, 0, 5);

        this.particles = new ParticleSystem(this.scene);
    }

    updateEnvironment(biome) {
        const configs = {
            'jungle': { bg: 0xa2d2ff, fog: 0xa2d2ff, sun: 0xffffff, sunIntensity: 1.0, ambient: 0.6 },
            'desert': { bg: 0xffcc80, fog: 0xffcc80, sun: 0xffaa00, sunIntensity: 1.2, ambient: 0.4 },
            'ice': { bg: 0xe0f7fa, fog: 0xe0f7fa, sun: 0xffffff, sunIntensity: 0.8, ambient: 0.7 },
            'volcano': { bg: 0x4a0e0e, fog: 0x4a0e0e, sun: 0xff4500, sunIntensity: 1.5, ambient: 0.3 },
            'sky': { bg: 0x87ceeb, fog: 0x87ceeb, sun: 0xffffff, sunIntensity: 1.2, ambient: 0.8 },
            'digital': { bg: 0x001219, fog: 0x001219, sun: 0x00f5ff, sunIntensity: 2.0, ambient: 0.2 },
            'space': { bg: 0x010b13, fog: 0x010b13, sun: 0xffffff, sunIntensity: 0.5, ambient: 0.1 },
            'night': { bg: 0x1a1a2e, fog: 0x1a1a2e, sun: 0x4a4a8a, sunIntensity: 0.3, ambient: 0.2 }
        };

        const config = configs[biome] || configs['jungle'];

        this.scene.background.set(config.bg);
        this.scene.fog.color.set(config.fog);
        this.sunLight.color.set(config.sun);
        this.sunLight.intensity = config.sunIntensity;
        this.ambientLight.intensity = config.ambient;
    }

    createEnvironment() {
        const waterGeo = new THREE.PlaneGeometry(1000, 1000);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x0077be,
            transparent: true,
            opacity: 0.8,
            roughness: 0
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.y = -0.5;
        this.scene.add(water);
        this.water = water;

        // Background Islands & Decor Crocs
        this.decorEntities = []; // Clear current level decor
        const islands = [
            { x: -15, z: -15 }, { x: 25, z: -10 }, { x: 10, z: 30 }
        ];

        islands.forEach(pos => {
            WorldDecor.createSandMound(this.scene, pos.x, pos.z);
            WorldDecor.createPalmTree(this.scene, pos.x, pos.z);

            // Add a crocodile swimming near each island
            const croc = WorldDecor.createDecorCrocodile(
                this.scene,
                pos.x + 5, pos.z,
                Math.random() * Math.PI,
                3 + Math.random() * 4
            );
            this.decorEntities.push(croc);
        });
    }

    setupLights() {
        // Clear existing lights if any (simple approach: remove all and adding back is safer than finding them)
        // But for this simple game, we can just ensure they are added once or re-added.
        // Actually, scene.clear() removes everything.

        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        const dir = new THREE.DirectionalLight(0xffffff, 1);
        dir.position.set(10, 20, 10);
        dir.castShadow = true;
        this.scene.add(dir);
    }

    async loadLevel(levelId) {
        // Clear Scene completely
        this.scene.clear();

        // Re-add lights (since clear removed them)
        this.setupLights();
        this.createEnvironment();

        // Track ID
        this.currentLevelId = levelId;

        // Load new level
        this.currentLevel = await this.loader.load(levelId);

        if (this.currentLevel) {
            this.adjustCamera(this.currentLevel);
        }

        // Stop any running code
        this.interpreter.stop();

        // Reset systems
        this.collisionSystem.reset();

        // Notify UI
        this.eventBus.emit('LEVEL_LOADED', this.currentLevel);
    }

    adjustCamera(level) {
        const cx = level.width / 2 - 0.5;
        const cz = level.height / 2 - 0.5;

        const dist = Math.max(level.width, level.height) * 1.5;

        this.camera.position.set(cx + dist * 0.8, dist * 0.8, cz + dist * 0.8);

        // The magic: Shift the target point so it centers in the space to the right of the panel.
        // 400px panel, total window.innerWidth.
        // Ratio of hidden space = 400 / window.innerWidth.
        // We want to shift the target x coordinate to compensate.
        const uiRatio = 400 / window.innerWidth;
        const shift = dist * uiRatio * 0.5;

        this.camera.lookAt(cx - shift, 0, cz);
        if (this.controls) {
            this.controls.target.set(cx - shift, 0, cz);
        }
    }

    async nextLevel() {
        // Unlock next
        const nextId = this.currentLevelId + 1;
        this.saveSystem.unlockLevel(nextId);

        await this.loadLevel(nextId);
        if (!this.currentLevel) {
            alert("Félicitations ! Vous avez fini le jeu !");
            await this.loadLevel(1);
        }
    }

    startLoop() {
        if (this.loopStarted) return;
        this.loopStarted = true;
        this.renderer.setAnimationLoop(() => {
            if (this.currentLevel) this.currentLevel.update(0.016);
            if (this.controls) this.controls.update();

            // Water animation
            if (this.water) {
                this.water.position.y = -0.5 + Math.sin(Date.now() * 0.002) * 0.1;
            }

            // Decor animation
            const time = Date.now() * 0.002;
            this.decorEntities.forEach(e => e.update(time));

            // Particles
            if (this.particles) this.particles.update(0.016);

            this.renderer.render(this.scene, this.camera);
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.currentLevel) this.adjustCamera(this.currentLevel);
    }
}
