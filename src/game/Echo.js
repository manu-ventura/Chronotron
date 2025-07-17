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
    this.velocityY =0;
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
  }

  update(platforms) {
    // Get actions for current frame
    const frameActions = this.getActionsForFrame(this.currentFrame);
    
    // Apply actions with potential inaccuracies
    this.applyActions(frameActions);
    
    // Update physics (same as player)
    this.updatePhysics(platforms);
    
    this.currentFrame++;
  }

  getActionsForFrame(frame) {
    return this.actions.filter(action => action.frame === frame);
  }

  applyActions(actions) {
    // Reset input state
    this.currentInput = {
      run: false,
      jump: false,
      grab: false,
      timeJump: false
    };

    // Apply recorded actions
    for (const action of actions) {
      if (action.type === 'keydown') {
        switch (action.key) {
          case 'KeyD':
          case 'ArrowRight':
            this.currentInput.run = true;
            break;
          case ' ':
          case 'KeyW':
          case 'ArrowUp':
            this.currentInput.jump = true;
            break;
          case 'KeyE':
          case 'KeyF':
            this.currentInput.grab = true;
            break;
          case 'KeyR':
            this.currentInput.timeJump = true;
            break;
        }
      }
    }

    // Apply input inaccuracies for older Echoes
    if (this.inputInaccuracy > 0) {
      if (Math.random() < 0.1) { // 10% chance of input error per frame
        this.currentInput.run = !this.currentInput.run;
      }
      if (Math.random() < 0.5) { // 50% chance of jump error
        this.currentInput.jump = !this.currentInput.jump;
      }
    }
  }

  updatePhysics(platforms) {
    // Handle horizontal movement
    if (this.currentInput.run) {
      this.velocityX = this.speed;
    } else {
      this.velocityX = 0;
    }

    // Handle jumping
    if (this.currentInput.jump && this.isOnGround) {
      this.velocityY = this.jumpPower;
      this.isOnGround = false;
    }

    // Handle grabbing
    this.isGrabbing = this.currentInput.grab;

    // Apply gravity
    this.velocityY += this.gravity;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check collision with platforms
    this.checkPlatformCollisions(platforms);

    // Keep Echo in bounds
    this.keepInBounds();
  }

  checkPlatformCollisions(platforms) {
    this.isOnGround = false;

    for (const platform of platforms) {
      if (this.checkCollision(platform)) {
        // Determine collision side
        const overlapX = Math.min(
          this.x + this.width - platform.x,
          platform.x + platform.width - this.x
        );
        const overlapY = Math.min(
          this.y + this.height - platform.y,
          platform.y + platform.height - this.y
        );

        if (overlapX < overlapY) {
          // Horizontal collision
          if (this.x < platform.x) {
            this.x = platform.x - this.width;
          } else {
            this.x = platform.x + platform.width;
          }
          this.velocityX =0;
        } else {
          // Vertical collision
          if (this.y < platform.y) {
            this.y = platform.y - this.height;
          } else {
            this.y = platform.y + platform.height;
          }
          this.velocityY = 0;
          this.isOnGround = true;
        }
      }
    }
  }

  checkCollision(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  keepInBounds() {
    // Keep Echo within canvas bounds
    if (this.x <0) {
      this.x = 0;
      this.velocityX =0;
    }
    if (this.x + this.width >800) {
      this.x = 800 - this.width;
      this.velocityX =0;
    }
    if (this.y + this.height >600) {
      this.y =600 - this.height;
      this.velocityY = 0;
      this.isOnGround = true;
    }
  }

  render(p5) {
    p5.push();
    p5.fill(this.color);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.drawingContext.globalAlpha = this.alpha;
    
    // Draw Echo with transparency
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Draw a ghostly face
    p5.fill(0);
    p5.noStroke();
    p5.ellipse(this.x + 8, this.y + 8);
    p5.ellipse(this.x + 24, this.y + 8);
    p5.rect(this.x + 12, this.y + 20);
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