// Strict mode
'use strict';

/**
 * Represents the implementation of an abstract scene implementation.
 */
export default class Scene {
  /** @type {string} */
  #name;
  /** @type {Canvas} */
  #canvas;
  /** @type {boolean} */
  #isInitialized = false;
  /** @type {boolean} */
  #isDisposed = false;

  /**
   * Represents the scene constructor.
   */
  constructor(name, canvas) {
    // Validate the abstract constructor.
    if (this.constructor == Scene) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    // Get the dependencies.
    this.#name = name;
    this.#canvas = canvas;
  }

  /**
   * Initializes the scene asynchronous.
   * This method should only be called once during application startup.
   * Prevents reinitialization if already active.
   */
  async initAsync() {
    this.#isInitialized = true;
    this.#isDisposed = false;
  }

  /**
   * Disposes of the scene.
   * Cleans up any resources or event listeners used by the scene to free memory.
   * Override in subclasses to implement specific disposal logic.
   */
  dispose() {
    this.#isInitialized = false;
    this.#isDisposed = true;
  }

  /**
   * Updates the scene logic for the current frame.
   * Called once per frame.
   *
   * @param {number} deltaTime - The time elapsed (in seconds) since the last frame,
   *                             used to make animations and logic frame-rate independent.
   */
  update(deltaTime) {
    if (!this.#isInitialized || this.#isDisposed) {
      return;
    }
  }

  /**
   * Indicates whether the scene has been initialized.
   *
   * @returns {boolean} - `true` if the scene is initialized, otherwise `false`.
   */
  get isInitialized() {
    return this.#isInitialized;
  }

  /**
   * Indicates whether the scene has been disposed.
   *
   * @returns {boolean} - `true` if the scene is disposed, otherwise `false`.
   */
  get isDisposed() {
    return this.#isDisposed;
  }

  /**
   * Returns the canvas associated with the scene.
   *
   * @returns {Canvas} - The canvas instance used by this scene.
   */
  get canvas() {
    return this.#canvas;
  }

  /**
   * Returns the name of the scene.
   *
   * @returns {string} - The unique name assigned to this scene.
   */
  get name() {
    return this.#name;
  }
}
