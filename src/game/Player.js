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
    this.gravity = 0.6
    this.isOnGround = false;
    this.isGrabbing = false;
    this.grabbedObject = null;
    this.isShieldActive = false;
    this.shieldTimer = 0;
    this.isPingActive = false;
    this.pingTimer = 0;
    
    // Visual properties
    this.color = '#00ff00'; // Bright green for player
    this.alpha = 1;
  }

  update(inputState, platforms) {
    // Handle horizontal movement
    if (inputState.run) {
      this.velocityX = inputState.run ? this.speed : 0;
    } else {
      this.velocityX = 0;
    }

    // Handle jumping
    if (inputState.jump && this.isOnGround) {
      this.velocityY = this.jumpPower;
      this.isOnGround = false;
    }

    // Handle grabbing
    if (inputState.grab) {
      this.isGrabbing = true;
    } else {
      this.isGrabbing = false;
      this.grabbedObject = null;
    }

    // Handle Temporal Shield (activate with Q, lasts 3 seconds)
    if (inputState.shield && !this.isShieldActive) {
      this.isShieldActive = true;
      this.shieldTimer = 180; // 3 seconds at 60 FPS
    }
    if (this.isShieldActive) {
      this.shieldTimer--;
      if (this.shieldTimer <= 0) this.isShieldActive = false;
    }

    // Handle Causal Ping (activate with F, lasts 1 second)
    if (inputState.ping && !this.isPingActive) {
      this.isPingActive = true;
      this.pingTimer = 60;
    }
    if (this.isPingActive) {
      this.pingTimer--;
      if (this.pingTimer <= 0) this.isPingActive = false;
    }

    // Apply gravity
    this.velocityY += this.gravity;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check collision with platforms
    this.checkPlatformCollisions(platforms);

    // Keep player in bounds
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
          this.velocityX =0
        } else {
          // Vertical collision
          if (this.y < platform.y) {
            this.y = platform.y - this.height;
            this.velocityY = 0;
          } else {
            this.y = platform.y + platform.height;
            this.velocityY = 0;
            this.isOnGround = true;
          }
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
    // Keep player within canvas bounds
    if (this.x < 0) {
      this.x = 0;
      this.velocityX = 0;
    }
    if (this.x + this.width > 800) { // Assuming 800 canvas width
      this.x = 800 - this.width;
      this.velocityX = 0;
    }
    if (this.y + this.height > 600) { // Assuming 600 canvas height
      this.y = 600 - this.height;
      this.velocityY = 0;
      this.isOnGround = true;
    }
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
    p5.ellipse(this.x + 8, this.y + 8, 4, 4);
    p5.ellipse(this.x + 24, this.y + 8, 4, 4);
    p5.rect(this.x + 12, this.y + 20, 8, 2);
    // Temporal Shield visual
    if (this.isShieldActive) {
      p5.push();
      p5.noFill();
      p5.stroke(0, 200, 255);
      p5.strokeWeight(4);
      p5.rect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
      p5.pop();
    }
    // Causal Ping visual
    if (this.isPingActive) {
      p5.push();
      p5.noFill();
      p5.stroke(255, 215, 0);
      p5.strokeWeight(3);
      p5.ellipse(this.x + this.width / 2, this.y + this.height / 2, 64, 64);
      p5.pop();
    }
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