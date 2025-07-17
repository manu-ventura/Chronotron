export class InputSystem {
  constructor() {
    this.keys = {};
    this.actions = [];
    this.isRecording = false;
    this.currentFrame = 0;
    
    // Bind event listeners
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(event) {
    this.keys[event.code] = true;
    
    if (this.isRecording) {
      this.recordAction('keydown', event.code, this.currentFrame);
    }
  }

  handleKeyUp(event) {
    this.keys[event.code] = false;
    
    if (this.isRecording) {
      this.recordAction('keyup', event.code, this.currentFrame);
    }
  }

  recordAction(type, key, frame) {
    this.actions.push({
      frame: frame,
      type: type,
      key: key,
      timestamp: performance.now()
    });
  }

  startRecording() {
    this.isRecording = true;
    this.actions = [];
    this.currentFrame = 0;
  }

  stopRecording() {
    this.isRecording = false;
    return [...this.actions]; // Return a copy of the actions
  }

  update(frameCount) {
    this.currentFrame = frameCount;
  }

  isKeyPressed(keyCode) {
    return this.keys[keyCode] || false;
  }

  // Check for specific game actions
  isRunPressed() {
    return this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight');
  }

  isJumpPressed() {
    return this.isKeyPressed('Space') || this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp');
  }

  isGrabPressed() {
    return this.isKeyPressed('KeyE') || this.isKeyPressed('KeyF');
  }

  isTimeJumpPressed() {
    return this.isKeyPressed('KeyR');
  }

  // Get current input state for this frame
  getCurrentInputState() {
    return {
      frame: this.currentFrame,
      run: this.isRunPressed(),
      jump: this.isJumpPressed(),
      grab: this.isGrabPressed(),
      timeJump: this.isTimeJumpPressed()
    };
  }

  // Replay actions for Echo
  replayActions(actions, currentFrame) {
    const currentActions = actions.filter(action => action.frame === currentFrame);
    return currentActions;
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}