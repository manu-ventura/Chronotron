import './style.css'
import { Game } from './game/Game.js'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './game/constants.js';

let game;
let canvas;

function setup() {
  // Create canvas
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('app');
  
  // Initialize game
  game = new Game();
  game.start();
}

function draw() {
  // Intentionally left empty. All updates and rendering are handled by the custom GameLoop.
}

function windowResized() {
  // Handle window resize if needed
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Clean up when page is unloaded
window.addEventListener('beforeunload', () => {
  if (game) game.destroy();
});
