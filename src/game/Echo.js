import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { checkCollision, updatePhysics } from './physics.js';

export class Echo {
  constructor(actions, startFrame, age = 0) {
    this.actions = actions;
    this.startFrame = startFrame;
    this.age = age; // How old this Echo is (affects visual and input accuracy)
    this.currentFrame = 0;
    
    // Visual properties with temporal decay
    this.color = '#00ff00'; // Green base color
    this.alpha = Math.max(0.2, 0.2 - (this.age / 100)); // Transparency based on age
    this.inputInaccuracy = Math.min(2, this.age); // ±1-2 pixel inaccuracies for older Echoes
    
    // Physics properties (same as player)
    this.x = 100; // Starting position
    this.y = 30;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 4;
    this.jumpPower = -12;
    this.gravity = 0.6;
    this.isOnGround = false;
    this.isGrabbing = false;
    
    // Current input state
    this.currentInput = {
      run: false,
      jump: false,
      grab: false,
      timeJump: false
    };
    this.keyStates = {};
  }

  update(platforms, deltaTime = 1) {
    // Get actions for current frame
    const frameActions = this.getActionsForFrame(this.currentFrame);
    // Update key states
    for (const action of frameActions) {
      if (action.type === 'keydown') {
        this.keyStates[action.key] = true;
      } else if (action.type === 'keyup') {
        this.keyStates[action.key] = false;
      }
    }
    // Apply key states to inputs
    this.applyKeyStates();
    // Use shared physics update with delta time
    updatePhysics(this, this.currentInput, platforms, deltaTime);
    this.currentFrame++;
  }

  getActionsForFrame(frame) {
    return this.actions.filter(action => action.frame === frame);
  }

  applyKeyStates() {
    this.currentInput = {
      run: !!(this.keyStates['KeyD'] || this.keyStates['ArrowRight']),
      jump: !!(this.keyStates['Space'] || this.keyStates['KeyW'] || this.keyStates['ArrowUp']),
      grab: !!(this.keyStates['KeyE'] || this.keyStates['KeyF']),
      timeJump: !!this.keyStates['KeyR']
    };
    // Apply input inaccuracies for older Echoes
    if (this.inputInaccuracy > 0) {
      if (Math.random() < 0.1) {
        this.currentInput.run = !this.currentInput.run;
      }
      if (Math.random() < 0.5) {
        this.currentInput.jump = !this.currentInput.jump;
      }
    }
  }

  checkCollision(other) {
    return checkCollision(this, other);
  }

  render(p5) {
    p5.push();
    p5.fill('#00ffcc'); // Cyan for echoes
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.drawingContext.globalAlpha = 0.2; // 20% transparency
    p5.rect(this.x, this.y, this.width, this.height);
    // Draw a ghostly face
    p5.fill(0);
    p5.noStroke();
    p5.ellipse(this.x + 8, this.y + 10, 4, 4);
    p5.ellipse(this.x + 24, this.y + 10, 4, 4);
    p5.rect(this.x + 12, this.y + 22, 8, 2);
    p5.drawingContext.globalAlpha = 1;
    p5.pop();
  }

  isFinished() {
    return this.currentFrame >= this.actions.length;
  }

  getAge() {
    return this.age;
  }
}