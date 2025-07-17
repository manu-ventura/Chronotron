import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { checkCollision, updatePhysics } from './physics.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32
    this.height = 32;
    this.velocityX = 0;
    this.velocityY =0;
    this.speed = 4;
    this.jumpPower = -12;
    this.gravity = 0.6;
    this.isOnGround = false;
    this.isGrabbing = false;
    this.grabbedObject = null;
    
    // Visual properties
    this.color = '#00ff00'; // Bright green for player
    this.alpha = 1;
  }

  update(inputState, platforms, deltaTime = 1) {
    // Use shared physics update with delta time
    updatePhysics(this, inputState, platforms, deltaTime);
  }

  checkCollision(other) {
    return checkCollision(this, other);
  }

  render(p5) {
    p5.push();
    p5.fill(this.color);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.rect(this.x, this.y, this.width, this.height);
    // Draw a simple face to distinguish player
    p5.fill(0);
    p5.noStroke();
    // Eyes
    p5.ellipse(this.x + 8, this.y + 10, 4, 4);
    p5.ellipse(this.x + 24, this.y + 10, 4, 4);
    // Mouth
    p5.rect(this.x + 12, this.y + 22, 8, 2);
    p5.pop();
  }

  getState() {
    return {
      x: this.x,
      y: this.y,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      isOnGround: this.isOnGround,
      isGrabbing: this.isGrabbing,
      frame: 0 // Will be set by the game loop
    };
  }

  setState(state) {
    this.x = state.x;
    this.y = state.y;
    this.velocityX = state.velocityX;
    this.velocityY = state.velocityY;
    this.isOnGround = state.isOnGround;
    this.isGrabbing = state.isGrabbing;
  }
}