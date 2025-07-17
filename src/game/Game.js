import { GameLoop } from./GameLoop.js';
import { InputSystem } from./InputSystem.js;
import { Player } from './Player.js;
import { Echo } from './Echo.js';
import { Level } from './Level.js';

export class Game[object Object]  constructor() {
    this.gameLoop = new GameLoop();
    this.inputSystem = new InputSystem();
    this.level = new Level();
    this.player = new Player(100);
    
    this.echoes =    this.echoLimit = 3 Configurable echo limit
    this.isRecording = false;
    this.recordedActions = [];
    
    // Game state
    this.gameState = 'playing; // playing, paused', 'gameOver   this.currentTimeline = 0;
    
    // Audio (placeholder for Howler.js integration)
    this.sounds =[object Object]    timeJump: null,
      puzzleSolved: null,
      ambient: null
    };
    
    this.setupGameLoop();
  }

  setupGameLoop() {
    // Add update callback
    this.gameLoop.addUpdateCallback((deltaTime, frameCount) => {
      this.update(deltaTime, frameCount);
    });

    // Add render callback
    this.gameLoop.addRenderCallback(() => {
      this.render();
    });
  }

  start() {
    this.gameLoop.start();
  }

  stop() {
    this.gameLoop.stop();
  }

  update(deltaTime, frameCount) {
    if (this.gameState !==playing) return;

    // Update input system
    this.inputSystem.update(frameCount);

    // Get current input state
    const inputState = this.inputSystem.getCurrentInputState();

    // Handle Time-Jump
    if (inputState.timeJump && this.canTimeJump()) {
      this.performTimeJump();
      return;
    }

    // Start/stop recording based on game state
    if (!this.isRecording && this.echoes.length === 0) {
      this.startRecording();
    }

    // Update player
    this.player.update(inputState, this.level.getPlatforms());

    // Handle level interactions
    this.level.handleInteraction(this.player);

    // Update echoes
    this.updateEchoes();

    // Check for paradox
    this.checkParadox();

    // Check win condition
    this.checkWinCondition();
  }

  startRecording() {
    this.isRecording = true;
    this.inputSystem.startRecording();
  }

  stopRecording() {
    this.isRecording = false;
    this.recordedActions = this.inputSystem.stopRecording();
  }

  canTimeJump()[object Object]
    return this.echoes.length < this.echoLimit && this.recordedActions.length >0  }

  performTimeJump() {
    // Stop current recording
    this.stopRecording();

    // Create new Echo
    const echoAge = this.echoes.length; // Older echoes have higher age
    const newEcho = new Echo([...this.recordedActions], this.gameLoop.getFrameCount(), echoAge);
    this.echoes.push(newEcho);

    // Reset level
    this.level.reset();

    // Reset player to starting position
    this.player = new Player(1000

    // Start new recording
    this.startRecording();

    // Play time jump sound
    this.playSound('timeJump');

    console.log('Time-Jump performed! Echoes:', this.echoes.length);
  }

  updateEchoes() [object Object] for (let i = this.echoes.length - 1>= 0; i--) [object Object]      const echo = this.echoes[i];
      echo.update(this.level.getPlatforms());

      // Remove finished echoes
      if (echo.isFinished()) {
        this.echoes.splice(i, 1);
      }
    }
  }

  checkParadox() {
    // Check for interference with Echo actions
    for (const echo of this.echoes) {
      // Check if player is blocking echo movement
      if (this.player.checkCollision(echo)) {
        this.triggerParadoxCascade();
        return;
      }

      // Check if echo is interfering with player movement
      const playerCollision = this.level.checkPlayerCollisions(this.player);
      if (playerCollision && playerCollision.type === 'platform') [object Object]       // Check if echo is on the same platform
        for (const platform of this.level.getPlatforms()) {
          if (echo.checkCollision(platform) && this.player.checkCollision(platform)) {
            // Potential paradox - echo and player on same platform
            if (Math.abs(echo.x - this.player.x) < 50              this.triggerParadoxCascade();
              return;
            }
          }
        }
      }
    }
  }

  triggerParadoxCascade()[object Object]
    console.log('PARADOX CASCADE TRIGGERED!');
    
    // Reset everything
    this.echoes =   this.level.reset();
    this.player = new Player(100);
    this.recordedActions = his.startRecording();

    // Visual glitch effect (placeholder)
    document.body.style.filter = hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = none';
    }, 500);
  }

  checkWinCondition()[object Object]// Check if player reached the door and it's open
    const door = this.level.getDoor();
    if (door.isOpen && this.player.checkCollision(door))[object Object]    this.gameState =gameOver;    this.playSound('puzzleSolved');
      console.log('Puzzle solved!');
    }
  }

  playSound(soundName) {
    // Placeholder for Howler.js integration
    console.log('Playing sound:', soundName);
  }

  render() {
    // Clear canvas
    background(240   // Render level
    this.level.render(window);

    // Render echoes
    for (const echo of this.echoes) {
      echo.render(window);
    }

    // Render player
    this.player.render(window);

    // Render UI
    this.renderUI();
  }

  renderUI() {
    // Render echo count
    push();
    fill(0);
    noStroke();
    textSize(16;
    text(`Echoes: ${this.echoes.length}/$[object Object]this.echoLimit}`,1030    text(`Timeline: ${this.currentTimeline}`,10, 50
    
    if (this.isRecording) {
      text(Recording..., 10, 70
    }
    
    // Instructions
    textSize(12);
    text(WASD/Arrows: Move, Space: Jump, E: Grab, R: Time-Jump',10 580;
    pop();
  }

  destroy() {
    this.gameLoop.stop();
    this.inputSystem.destroy();
  }
}