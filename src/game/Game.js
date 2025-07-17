import { GameLoop } from './GameLoop.js';
import { InputSystem } from './InputSystem.js';
import { Player } from './Player.js';
import { Echo } from './Echo.js';
import { Level } from './Level.js';

export class Game {
  constructor() {
    this.gameLoop = new GameLoop();
    this.inputSystem = new InputSystem();
    this.level = new Level();
    this.player = new Player(100, 100);
    this.echoes = [];
    this.echoLimit = 3; // Configurable echo limit
    this.isRecording = false;
    this.recordedActions = [];
    this.gameState = 'playing'; // playing, paused, gameOver
    this.currentTimeline = 0;
    this.isPaused = false;
    this.sounds = {
      // Placeholder for Howler.js integration
      timeJump: null,
      puzzleSolved: null,
      paradox: null,
      ambient: null
    };
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.setupGameLoop();
    this.setupEventListeners();
  }

  setupGameLoop() {
    this.gameLoop.addUpdateCallback((deltaTime, frameCount) => {
      this.update(deltaTime, frameCount);
    });
    this.gameLoop.addRenderCallback(() => {
      this.render();
    });
  }

  setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.togglePause();
      }
    });
    window.addEventListener('blur', () => {
      if (this.gameState === 'playing') {
        this.pause();
      }
    });
  }

  start() {
    this.gameLoop.start();
    // Play ambient sound if implemented
  }

  stop() {
    this.gameLoop.stop();
    // Stop ambient sound if implemented
  }

  pause() {
    this.isPaused = true;
    this.gameState = 'paused';
  }

  resume() {
    this.isPaused = false;
    this.gameState = 'playing';
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  update(deltaTime, frameCount) {
    if (this.gameState !== 'playing' || this.isPaused) return;
    this.updateFps();
    this.inputSystem.update(frameCount);
    const inputState = this.inputSystem.getCurrentInputState();
    if (inputState.timeJump && this.canTimeJump()) {
      this.performTimeJump();
      return;
    }
    if (!this.isRecording && this.echoes.length === 0) {
      this.startRecording();
    }
    this.player.update(inputState, this.level.getPlatforms());
    this.level.handleInteraction(this.player);
    this.updateEchoes();
    this.checkParadox();
    this.checkWinCondition();
    this.cleanupEchoes();
  }

  updateFps() {
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }

  startRecording() {
    this.isRecording = true;
    this.inputSystem.startRecording();
  }

  stopRecording() {
    this.isRecording = false;
    this.recordedActions = this.inputSystem.stopRecording();
  }

  canTimeJump() {
    return this.echoes.length < this.echoLimit && this.recordedActions.length > 0;
  }

  performTimeJump() {
    this.stopRecording();
    const echoAge = this.echoes.length;
    const newEcho = new Echo([...this.recordedActions], this.gameLoop.getFrameCount(), echoAge);
    this.echoes.push(newEcho);
    this.level.reset();
    this.player = new Player(100, 100);
    this.startRecording();
    this.currentTimeline++;
    // Play time jump sound if implemented
  }

  updateEchoes() {
    for (let i = this.echoes.length - 1; i >= 0; i--) {
      const echo = this.echoes[i];
      echo.update(this.level.getPlatforms());
    }
  }

  cleanupEchoes() {
    this.echoes = this.echoes.filter(echo => !echo.isFinished());
  }

  checkParadox() {
    for (const echo of this.echoes) {
      if (this.player.checkCollision(echo)) {
        this.triggerParadoxCascade();
        return;
      }
      const playerCollision = this.level.checkPlayerCollisions(this.player);
      if (playerCollision && playerCollision.type === 'platform') {
        for (const platform of this.level.getPlatforms()) {
          if (echo.checkCollision(platform) && this.player.checkCollision(platform)) {
            if (Math.abs(echo.x - this.player.x) < 50) {
              this.triggerParadoxCascade();
              return;
            }
          }
        }
      }
    }
  }

  triggerParadoxCascade() {
    this.echoes = [];
    this.level.reset();
    this.player = new Player(100, 100);
    this.recordedActions = [];
    this.startRecording();
    // Visual glitch effect (placeholder)
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 500);
    // Play paradox sound if implemented
  }

  checkWinCondition() {
    const door = this.level.getDoor();
    if (door && door.isOpen && this.player.checkCollision(door)) {
      this.gameState = 'gameOver';
      // Play puzzle solved sound if implemented
      this.showWinScreen();
    }
  }

  showWinScreen() {
    const winScreen = document.createElement('div');
    winScreen.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      font-family: Arial, sans-serif;
      z-index: 1000;`;
    winScreen.innerHTML = `
      <h1>Puzzle Solved!</h1>
      <p>Timeline: ${this.currentTimeline}</p>
      <p>Echoes Used: ${this.echoes.length}</p>
      <button onclick="location.reload()">Play Again</button>
    `;
    document.body.appendChild(winScreen);
  }

  render() {
    try {
      window.background(240);
      this.level.render(window);
      for (const echo of this.echoes) {
        echo.render(window);
      }
      this.player.render(window);
      this.renderUI();
    } catch (error) {
      // fallback: do nothing
    }
  }

  renderUI() {
    window.push();
    window.fill(0);
    window.noStroke();
    window.textSize(16);
    window.text(`Echoes: ${this.echoes.length}/${this.echoLimit}`, 10, 30);
    window.text(`Timeline: ${this.currentTimeline}`, 10, 50);
    window.text(`FPS: ${this.fps}`, 10, 70);
    if (this.isRecording) {
      window.text('Recording...', 10, 90);
    }
    if (this.isPaused) {
      window.textSize(24);
      window.textAlign(window.CENTER, window.CENTER);
      window.text('PAUSED', 400, 300);
      window.textAlign(window.LEFT, window.TOP);
    }
    window.textSize(12);
    window.text('WASD/Arrows: Move, Space: Jump, E: Grab, R: Time-Jump, ESC: Pause', 10, 580);
    window.pop();
  }

  destroy() {
    this.gameLoop.stop();
    this.inputSystem.destroy();
    // Stop all sounds if implemented
  }
}