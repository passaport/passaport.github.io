// Strict mode
'use strict';

// Dependencies
import Scene from './scenes/scene.js';
import Scene3D from './scenes/3D/scene3D.js';

// Represents the application canvas.
export default class Canvas {
  /** @type {HTMLCanvasElement} */
  #canvasElement;
  /** @type {Scene} */
  #scene;
  /** @type {boolean} */
  #isInitialized = false;
  /** @type {boolean} */
  #isDisposed = false;
  /** @type {number} */
  #currentFrame = 0;
  /** @type {number} */
  #updateAnimationFrameIdentification;

  /**
   * Class constructor.
   */
  constructor(canvasElement) {
    // Get the dependencies.
    this.#canvasElement = canvasElement;
  }

  /**
   * Initializes the canvas asynchronous.
   * This method should only be called once during application startup.
   * Prevents reinitialization if already active.
   */
  async initAsync() {
    // Validate the canvas.
    if (this.#isInitialized || this.#isDisposed) {
      // Log the message.
      console.error('Canvas has already been initialized or is already disposed. Init must be called only once.');

      // Do nothing.
      return;
    }

    // Create the scene.
    this.#scene = new Scene3D(this);

    // Initialize the scene.
    await this.#scene.initAsync();

    // Mark the instance state.
    this.#isInitialized = true;

    // Executes the first update loop.
    this.#update(1);

    // Log the message.
    console.log('The canvas has been initialized successfully.');
  }

  /**
   * Disposes of the canvas.
   * Cleans up any resources or event listeners used by the canvas to free memory.
   * Override in subclasses to implement specific disposal logic.
   */
  dispose() {
    // Dispose resources.
    this.#scene.dispose();
    this.#scene = null;
    cancelAnimationFrame(this.#updateAnimationFrameIdentification);
    this.#updateAnimationFrameIdentification = null;

    // Mark the instance state.
    this.#isInitialized = false;
    this.#isDisposed = true;

    // Log the message.
    console.log('The canvas has been disposed successfully.');
  }

  /**
   * Executes the canvas update loop.
   * Called once per frame.
   *
   * @param {number} deltaTime - The time elapsed (in seconds) since the last frame,
   *                             used to make animations and logic frame-rate independent.
   */
  #update(currentFrame) {
    // Validate the canvas.
    if (!this.#isInitialized || this.#isDisposed) {
      // Log the message.
      console.error('Canvas update stopped. The canvas is not initialized or is disposed.');

      // Do nothing.
      return;
    }

    // Convert current frame to seconds.
    currentFrame *= 0.001;

    // Calculate the delta.
    const deltaTime = currentFrame - this.#currentFrame;
    this.#currentFrame = currentFrame;

    // Update the scene logic.
    this.#scene.update(deltaTime);

    // Request the animation frame loop.
    this.#updateAnimationFrameIdentification = requestAnimationFrame(this.#update.bind(this));
  }

  /**
   * Returns the canvas element.
   *
   * @returns {HTMLCanvasElement} - The canvas element.
   */
  get canvasElement() {
    return this.#canvasElement;
  }
}
