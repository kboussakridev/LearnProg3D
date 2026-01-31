import './style.css';
import { GameEngine } from './engine/GameEngine.js'; // Updated path

document.addEventListener('DOMContentLoaded', () => {
    // Clean body just in case
    // document.body.innerHTML = '<div id="app"></div>'; // Don't wipe scripts

    // Start Game
    const game = new GameEngine();
});
