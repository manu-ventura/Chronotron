export class GameLoop {
  constructor() {
    this.isRunning = false;
    this.lastTime = 0;
    this.frameCount = 0;
    this.fps = 60;
    this.frameTime = 1000 / this.fps;
    this.updateCallbacks = [];
    this.renderCallbacks = [];
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  loop(currentTime = performance.now()) {
    if (!this.isRunning) return;

    const deltaTimeMs = currentTime - this.lastTime;
    const deltaTime = deltaTimeMs / 1000; // in seconds

    if (deltaTimeMs >= this.frameTime) {
      this.frameCount++;
      this.lastTime = currentTime - (deltaTimeMs % this.frameTime);

      // Update game logic
      this.updateCallbacks.forEach(callback => callback(deltaTime, this.frameCount));

      // Render
      this.renderCallbacks.forEach(callback => callback());
    }

    requestAnimationFrame((time) => this.loop(time));
  }

  addUpdateCallback(callback) {
    this.updateCallbacks.push(callback);
  }

  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
  }

  removeUpdateCallback(callback) {
    const index = this.updateCallbacks.indexOf(callback);
    if (index > -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  removeRenderCallback(callback) {
    const index = this.renderCallbacks.indexOf(callback);
    if (index > -1) {
      this.renderCallbacks.splice(index, 1);
    }
  }

  getFrameCount() {
    return this.frameCount;
  }
}