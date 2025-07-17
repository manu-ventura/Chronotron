import { GameLoop } from './GameLoop.js';
import { InputSystem } from './InputSystem.js';
import { Player } from './Player.js';
import { Echo } from './Echo.js';
import { Level } from './Level.js';
import { Howl } from 'howler';

export class Game {
  constructor() {
    this.gameLoop = new GameLoop();
    this.inputSystem = new InputSystem();
    this.level = new Level();
    this.player = new Player(100, 100); // Example start position
    this.echoes = [];
    this.echoLimit = 3; // Configurable echo limit
    this.isRecording = false;
    this.recordedActions = [];
    this.gameState = 'playing'; // playing, paused, gameOver
    this.currentTimeline = 0;
    this.sounds = {
      timeJump: new Howl({ src: ['public/time-jump.mp3'], volume: 0.5 }),
      puzzleSolved: new Howl({ src: ['public/puzzle-solved.mp3'], volume: 0.5 }),
      ambient: null // To be implemented
    };
    this.setupGameLoop();
  }

  setupGameLoop() {
    this.gameLoop.addUpdateCallback((deltaTime, frameCount) => {
      this.update(deltaTime, frameCount);
    });
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
    if (this.gameState !== 'playing') return;
    this.inputSystem.update(frameCount);
    const inputState = this.inputSystem.getCurrentInputState();
    if (inputState.timeJump && this.canTimeJump()) {
      this.performTimeJump();
      return;
    }
    if (!this.isRecording && this.echoes.length === 0) {
      this.startRecording();
    }
    this.player.update(inputState, this.level.getPlatforms(), deltaTime);
    if (this.level.handleInteraction) {
      this.level.handleInteraction(this.player);
    }
    this.updateEchoes(deltaTime);
    this.checkParadox();
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

  canTimeJump() {
    return this.echoes.length < this.echoLimit && this.recordedActions.length > 0;
  }

  performTimeJump() {
    this.stopRecording();
    const echoAge = this.echoes.length;
    const newEcho = new Echo([...this.recordedActions], this.gameLoop.getFrameCount(), echoAge);
    this.echoes.push(newEcho);
    this.level.reset();
    this.player = new Player(100, 100); // Reset to start
    this.startRecording();
    this.playSound('timeJump');
    console.log('Time-Jump performed! Echoes:', this.echoes.length);
  }

  updateEchoes(deltaTime) {
    for (let i = this.echoes.length - 1; i >= 0; i--) {
      const echo = this.echoes[i];
      echo.update(this.level.getPlatforms(), deltaTime);
      if (echo.isFinished()) {
        this.echoes.splice(i, 1);
      }
    }
  }

  checkParadox() {
    for (const echo of this.echoes) {
      if (this.player.checkCollision && this.player.checkCollision(echo)) {
        this.triggerParadoxCascade();
        return;
      }
      if (this.level.checkPlayerCollisions) {
        const playerCollision = this.level.checkPlayerCollisions(this.player);
        if (playerCollision && playerCollision.type === 'platform') {
          for (const platform of this.level.getPlatforms()) {
            if (echo.checkCollision && echo.checkCollision(platform) && this.player.checkCollision(platform)) {
              if (Math.abs(echo.x - this.player.x) < 50) {
                this.triggerParadoxCascade();
                return;
              }
            }
          }
        }
      }
    }
  }

  triggerParadoxCascade() {
    console.log('PARADOX CASCADE TRIGGERED!');
    this.echoes = [];
    this.level.reset();
    this.player = new Player(100, 100);
    this.recordedActions = [];
    this.startRecording();
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 500);
  }

  checkWinCondition() {
    if (this.level.getDoor) {
      const door = this.level.getDoor();
      if (door && door.isOpen && this.player.checkCollision && this.player.checkCollision(door)) {
        this.gameState = 'gameOver';
        this.playSound('puzzleSolved');
        console.log('Puzzle solved!');
      }
    }
  }

  playSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].play();
    } else {
      console.log('Playing sound:', soundName);
    }
  }

  render() {
    if (typeof window.background === 'function') {
      window.background(240);
    }
    if (this.level.render) {
      this.level.render(window);
    }
    for (const echo of this.echoes) {
      if (echo.render) echo.render(window);
    }
    if (this.player.render) {
      this.player.render(window);
    }
    this.renderUI();
  }

  renderUI() {
    if (typeof window.push === 'function') window.push();
    if (typeof window.fill === 'function') window.fill(0);
    if (typeof window.noStroke === 'function') window.noStroke();
    if (typeof window.textSize === 'function') window.textSize(16);
    if (typeof window.text === 'function') {
      window.text(`Echoes: ${this.echoes.length}/${this.echoLimit}`, 10, 30);
      window.text(`Timeline: ${this.currentTimeline}`, 10, 50);
      if (this.isRecording) {
        window.text('Recording...', 10, 70);
      }
      window.text('WASD/Arrows: Move, Space: Jump, E: Grab, R: Time-Jump', 10, 580);
    }
    if (typeof window.pop === 'function') window.pop();
  }

  destroy() {
    this.gameLoop.stop();
    this.inputSystem.destroy();
  }
}