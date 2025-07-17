export class Level {
  constructor() {
    this.platforms = [];
    this.interactiveObjects = [];
    this.temporalConveyors = [];
    this.initialState = null;
    this.currentState = null;
    this.echoLimit = 3;
    
    this.loadTestLevel();
  }

  loadTestLevel() {
    // Create a simple test level with platforms and interactive objects
    this.platforms = [
      // Ground
      { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
      // Platforms
      { x: 100, y: 450, width: 100, height: 20, type: 'platform' },
      { x: 300, y: 350, width: 100, height: 20, type: 'platform' },
      { x: 500, y: 250, width: 100, height: 20, type: 'platform' },
      { x: 700, y: 150, width: 100, height: 20, type: 'platform' },
      // Wall
      { x: 750, y: 150, width: 20, height: 400, type: 'wall' }
    ];
    // Interactive objects
    this.interactiveObjects =
      [
        { x: 750,
          y: 100,
          width: 30,
          height:30,
          type:'switch',
          isPressed: false,
          color: '#ff0000',
          onPress: () => this.toggleDoor()
        }
      ];

    // Temporal Conveyor for bootstrap paradox
    this.temporalConveyors =
      [
        { x: 20,
          y: 400,
          width: 60,
          height:20,
          type: 'conveyor',
          color: '#000000',
          isActive: false,
          targetTimeline: -1, // Send to previous timeline
          onActivate: (object) => this.sendToPast(object)
        }
      ];

    // Door that opens when switch is pressed
    this.door = {
      x:750,
      y: 200,
      width: 30,
      height: 100,
      type: 'door',
      isOpen: false,
      color: '#8b4513'
    };

    // Causal Hotspot area (example: center of the map)
    this.causalHotspot = { x: 350, y: 300, width: 100, height: 100 };
    this.echoLimit = 3; // Can be changed per level
    this.saveInitialState();
  }

  saveInitialState() {
    this.initialState = {
      platforms: JSON.parse(JSON.stringify(this.platforms)),
      interactiveObjects: JSON.parse(JSON.stringify(this.interactiveObjects)),
      temporalConveyors: JSON.parse(JSON.stringify(this.temporalConveyors)),
      door: JSON.parse(JSON.stringify(this.door))
    };
  }

  reset() {
    // Reset level to initial state
    this.platforms = JSON.parse(JSON.stringify(this.initialState.platforms));
    this.interactiveObjects = JSON.parse(JSON.stringify(this.initialState.interactiveObjects));
    this.temporalConveyors = JSON.parse(JSON.stringify(this.initialState.temporalConveyors));
    this.door = JSON.parse(JSON.stringify(this.initialState.door));
  }

  toggleDoor() {
    this.door.isOpen = !this.door.isOpen;
    // Change door color to indicate state
    this.door.color = this.door.isOpen ? '#90ee90' : '#8b4513';
  }

  sendToPast(object) {
    // This would be implemented in the main game loop
    // to handle temporal paradox mechanics
    console.log('Object sent to past timeline:', object);
  }

  checkPlayerCollisions(player) {
    // Check collision with platforms
    for (const platform of this.platforms) {
      if (this.checkCollision(player, platform)) {
        return { type: 'platform', object: platform };
      }
    }

    // Check collision with interactive objects
    for (const obj of this.interactiveObjects) {
      if (this.checkCollision(player, obj)) {
        return { type: 'interactive', object: obj };
      }
    }

    // Check collision with temporal conveyors
    for (const conveyor of this.temporalConveyors) {
      if (this.checkCollision(player, conveyor)) {
        return { type: 'conveyor', object: conveyor };
      }
    }

    // Check collision with door
    if (this.checkCollision(player, this.door)) {
      return { type: 'door', object: this.door };
    }

    return null;
  }

  checkCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  handleInteraction(player) {
    // Handle player interactions with objects
    for (const obj of this.interactiveObjects) {
      if (this.checkCollision(player, obj) && player.isGrabbing) {
        if (obj.onPress) {
          obj.onPress();
        }
      }
    }
  }

  render(p5) {
    // Render platforms
    p5.push();
    p5.fill('#666666');
    p5.stroke(0);
    p5.strokeWeight(1);
    for (const platform of this.platforms) {
      p5.rect(platform.x, platform.y, platform.width, platform.height);
    }
    p5.pop();

    // Render interactive objects
    for (const obj of this.interactiveObjects) {
      p5.push();
      p5.fill(obj.color);
      p5.stroke(0);
      p5.strokeWeight(2);
      p5.rect(obj.x, obj.y, obj.width, obj.height);
      
      // Draw switch indicator
      if (obj.type === 'switch') {
        p5.fill(255);
        p5.noStroke();
        p5.ellipse(obj.x + 15, obj.y + 15, 10, 10);
      }
      p5.pop();
    }

    // Render temporal conveyors
    for (const conveyor of this.temporalConveyors) {
      p5.push();
      p5.fill(conveyor.color);
      p5.stroke(0);
      p5.strokeWeight(2);
      p5.rect(conveyor.x, conveyor.y, conveyor.width, conveyor.height);
      
      // Draw conveyor arrows
      p5.fill(0);
      p5.noStroke();
      for (let i = 0; i < 3; i++) {
        p5.triangle(
          conveyor.x + 10 + i * 15, conveyor.y + 5,
          conveyor.x + 5 + i * 15, conveyor.y + 15,
          conveyor.x + 15 + i * 15, conveyor.y + 15
        );
      }
      p5.pop();
    }

    // Render door
    if (!this.door.isOpen) {
      p5.push();
      p5.fill(this.door.color);
      p5.stroke(0);
      p5.strokeWeight(2);
      p5.rect(this.door.x, this.door.y, this.door.width, this.door.height);
      p5.pop();
    }

    // Render grid background for test chamber aesthetic
    this.renderGrid(p5);

    // Render causal hotspot
    if (this.causalHotspot) {
      p5.push();
      p5.noStroke();
      p5.fill(255, 230, 128, 100);
      p5.rect(this.causalHotspot.x, this.causalHotspot.y, this.causalHotspot.width, this.causalHotspot.height);
      p5.pop();
    }
  }

  renderGrid(p5) {
    p5.push();
    p5.stroke(105);
    p5.strokeWeight(1);
    
    // Draw vertical lines
    for (let x = 0; x <= 800; x += 50) {
      p5.line(x, 0, x, 600);
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= 600; y += 50) {
      p5.line(0, y, 800, y);
    }
    p5.pop();
  }

  getPlatforms() {
    return this.platforms;
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }

  getTemporalConveyors() {
    return this.temporalConveyors;
  }

  getDoor() {
    return this.door;
  }

  getEchoLimit() {
    return this.echoLimit;
  }

  getCausalHotspot() {
    return this.causalHotspot;
  }
}