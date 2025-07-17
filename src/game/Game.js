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
    this.echoLimit = this.level.getEchoLimit();
    this.isRecording = false;
    this.recordedActions = [];
    this.gameState = 'playing'; // playing, paused, gameOver
    this.currentTimeline = 0;
    this.sounds = {
      timeJump: null,
      puzzleSolved: null,
      ambient: null
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
    this.player.update(inputState, this.level.getPlatforms());
    this.level.handleInteraction(this.player);
    const conveyor = this.level.getTemporalConveyors().find(c => this.player.checkCollision(c));
    if (conveyor && this.player.isGrabbing && this.player.grabbedObject) {
      conveyor.onActivate(this.player.grabbedObject);
      this.player.grabbedObject = null;
    }
    if (this.level.causalHotspot && this.checkHotspot(this.player, this.level.causalHotspot)) {
      this.triggerCausalHotspot();
    }
    this.updateEchoes();
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
    const newEcho = new Echo([...this.recordedActions], this.gameLoop.getFrameCount(), echoAge, this.echoLimit);
    this.echoes.push(newEcho);
    this.level.reset();
    this.player = new Player(100, 100);
    this.startRecording();
    this.playSound('timeJump');
    console.log('Time-Jump performed! Echoes:', this.echoes.length);
  }

  updateEchoes() {
    for (let i = this.echoes.length - 1; i >= 0; i--) {
      const echo = this.echoes[i];
      echo.update(this.level.getPlatforms());
      if (echo.isFinished()) {
        this.echoes.splice(i, 1);
      }
    }
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
    const door = this.level.getDoor();
    if (door.isOpen && this.player.checkCollision(door)) {
      this.gameState = 'gameOver';
      this.playSound('puzzleSolved');
      console.log('Puzzle solved!');
    }
  }

  playSound(soundName) {
    console.log('Playing sound:', soundName);
  }

  render() {
    window.background(240);
    this.level.render(window);
    for (const echo of this.echoes) {
      echo.render(window);
    }
    this.player.render(window);
    this.renderUI();
  }

  renderUI() {
    window.push();
    window.fill(0);
    window.noStroke();
    window.textSize(16);
    window.text(`Echoes: ${this.echoes.length}/${this.echoLimit}`, 10, 30);
    window.text(`Timeline: ${this.currentTimeline}`, 10, 50);
    if (this.isRecording) {
      window.text('Recording...', 10, 70);
    }
    window.textSize(12);
    window.text('WASD/Arrows: Move, Space: Jump, E: Grab, R: Time-Jump, Q: Shield, F: Ping', 10, 580);
    window.pop();
  }

  destroy() {
    this.gameLoop.stop();
    this.inputSystem.destroy();
  }

  checkHotspot(entity, hotspot) {
    return (
      entity.x < hotspot.x + hotspot.width &&
      entity.x + entity.width > hotspot.x &&
      entity.y < hotspot.y + hotspot.height &&
      entity.y + entity.height > hotspot.y
    );
  }

  triggerCausalHotspot() {
    this.level.door.isOpen = true;
    this.echoes.forEach(echo => {
      // Could trigger echo-specific effects here
    });
    document.body.style.background = '#ffe680';
    setTimeout(() => {
      document.body.style.background = '';
    }, 200);
  }
}