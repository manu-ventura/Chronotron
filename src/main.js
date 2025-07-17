import './style.css'
import { Game } from './game/Game.js'

let game;
let canvas;

function setup() {
  // Create canvas
  canvas = createCanvas(800, 600);
  canvas.parent('app');
  
  // Initialize game
  game = new Game();
  game.start();
}

function draw() {
  // The game loop is handled by the GameLoop class
  // This function is called by p5.js but we dont need it for our custom game loop
}

function windowResized() {
  // Handle window resize if needed
  resizeCanvas(800, 600);
}

// Clean up when page is unloaded
window.addEventListener('beforeunload', () => {
  if (game) game.destroy();
});
