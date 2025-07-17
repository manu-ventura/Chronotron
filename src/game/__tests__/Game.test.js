import { GameLoop } from '../GameLoop.js';
import { InputSystem } from '../InputSystem.js';
import { Player } from '../Player.js';
import { Echo } from '../Echo.js';
import { Level } from '../Level.js';
describe('GameLoop', () => {
  let gameLoop;

  beforeEach(() => {
    gameLoop = new GameLoop();
  });

  test('should initialize with correct properties', () => {
    expect(gameLoop.isRunning).toBe(false);
    expect(gameLoop.fps).toBe(60);
    expect(gameLoop.frameTime).toBe(1000/60);
  });

  test('should start and stop correctly', () => {
    gameLoop.start();
    expect(gameLoop.isRunning).toBe(true);
    
    gameLoop.stop();
    expect(gameLoop.isRunning).toBe(false);
  });

  test('should track frame count', () => {
    gameLoop.start();
    // Wait a bit for frames to accumulate
    setTimeout(() => {
      expect(gameLoop.getFrameCount()).toBeGreaterThan(0);
      gameLoop.stop();
    },100);
  });
});

describe('InputSystem', () => {
  let inputSystem;

  beforeEach(() => {
    inputSystem = new InputSystem();
  });

  afterEach(() => {
    inputSystem.destroy();
  });

  test('should record actions correctly', () => {
    inputSystem.startRecording();
    inputSystem.update(1);
    
    // Simulate key press
    const keyDownEvent = new KeyboardEvent('keydown', { code: 'KeyD'});
    document.dispatchEvent(keyDownEvent);
    
    expect(inputSystem.actions.length).toBeGreaterThan(0);
    expect(inputSystem.actions[0].key).toBe('KeyD');
  });

  test('should detect movement keys', () => {
    // Simulate key press
    const keyDownEvent = new KeyboardEvent('keydown', { code: 'KeyD'});
    document.dispatchEvent(keyDownEvent);
    
    expect(inputSystem.isRunPressed()).toBe(true);
  });

  test('should detect jump keys', () => {
    const keyDownEvent = new KeyboardEvent('keydown', {code: 'Space'});
    document.dispatchEvent(keyDownEvent);
    
    expect(inputSystem.isJumpPressed()).toBe(true);
  });
});

describe('Player', () => {
  let player;
  let platforms;

  beforeEach(() => {
    player = new Player(100, 10);
    platforms = 
      [{ x: 0, y: 200, width: 100, height: 20 }];
  });

  test('should move horizontally', () => {
    const initialX = player.x;
    const inputState = { run: true, jump: false, grab: false, timeJump: false };
    
    player.update(inputState, platforms);
    
    expect(player.x).toBeGreaterThan(initialX);
  });

  test('should jump when on ground', () => {
    player.y = 150; // Place player above ground
    player.isOnGround = true; // Set player on ground
    const inputState = { run: false, jump: true, grab: false, timeJump: false };
    
    player.update(inputState, platforms);
    
    expect(player.velocityY).toBeLessThan(0); // Should have upward velocity
  });

  test('should collide with platforms', () => {
    player.x = 10;
    player.y = 150;
    player.velocityY = 5; // Apply downward velocity
    const inputState = { run: false, jump: false, grab: false, timeJump: false };
    const testPlatforms = [{ x: 0, y: 200, width: 100, height: 20 }];
    for (let i = 0; i < 20; i++) {
      player.update(inputState, testPlatforms);
    }
    expect(player.y).toBeCloseTo(200 - player.height, 1);
  });
});

describe('Echo', () => {
  let echo;
  let actions;
  let platforms;

  beforeEach(() => {
    actions = 
      [{ frame:0, type:'keydown', key:'KeyD' },
       { frame:1, type:'keydown', key:'Space' }];
    echo = new Echo(actions, 0,0);
    platforms = 
      [{ x: 0, y: 200, width: 100, height: 20 }];
  });

  test('should replay actions correctly', () => {
    echo.update(platforms);
    
    // Should have applied the run action
    expect(echo.currentInput.run).toBe(true);
  });

  test('should have temporal decay', () => {
    const oldEcho = new Echo(actions, 0, 5); // Age 5
    expect(oldEcho.alpha).toBeLessThan(1);
  });

  test('should finish when actions are complete', () => {
    // Update for more frames than actions
    for (let i = 0; i < 10; i++) {
      echo.update(platforms);
    }
    
    expect(echo.isFinished()).toBe(true);
  });
});

describe('Level', () => {
  let level;

  beforeEach(() => {
    level = new Level();
  });

  test('should load test level with platforms', () => {
    const platforms = level.getPlatforms();
    expect(platforms.length).toBeGreaterThan(0);
  });

  test('should have interactive objects', () => {
    const objects = level.getInteractiveObjects();
    expect(objects.length).toBeGreaterThan(0);
  });

  test('should reset to initial state', () => {
    const door = level.getDoor();
    const initialState = door.isOpen;
    
    // Toggle door
    level.toggleDoor();
    expect(door.isOpen).toBe(!initialState);
    
    // Reset
    level.reset();
    const resetDoor = level.getDoor();
    expect(resetDoor.isOpen).toBe(initialState);
  });
});

describe('Game', () => {
  test('should trigger paradox when player and echo overlap', () => {
    const { Game } = require('../Game.js');
    const { Level } = require('../Level.js');
    const { Player } = require('../Player.js');
    const { Echo } = require('../Echo.js');
    const game = new Game();
    game.player.x = 100;
    game.player.y = 100;
    const echo = new Echo([], 0, 0, 3);
    echo.x = 100;
    echo.y = 100;
    game.echoes = [echo];
    let paradoxTriggered = false;
    game.triggerParadoxCascade = () => { paradoxTriggered = true; };
    game.checkParadox();
    expect(paradoxTriggered).toBe(true);
  });
});