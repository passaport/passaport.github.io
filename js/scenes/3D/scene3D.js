// Strict mode
'use strict';

// Dependencies
import Scene from '../scene.js';
import * as ThreeJS from '../../libs/threejs/three.module.min.js';
import { FBXLoader } from '../../libs/threejs/addons/loaders/FBXLoader.js';
import { OrbitControls } from '../../libs/threejs/addons/controls/OrbitControls.js';

/**
 * Represents the implementation of a 3D scene.
 */
export default class Scene3D extends Scene {
  /** @type {ThreeJS.Scene} */
  #threeJSScene;
  /** @type {ThreeJS.PerspectiveCamera} */
  #threeJSPerspectiveCamera;
  /** @type {OrbitControls} */
  #threeJSOrbitControl;
  /** @type {ThreeJS.WebGLRenderer} */
  #threeJSWebGLRenderer;
  /** @type {Array<ThreeJS.Object3D>} */
  #spotLights = [];
  /** @type {ThreeJS.Mesh} */
  #sceneModel;
  /** @type {ThreeJS.HemisphereLight | undefined} */
  #lighting;
  /** @type {HTMLVideoElement} */
  #televisionVideo;
  /** @type {HTMLVideoElement} */
  #monitorVideo;
  /** @type {ThreeJS.Raycaster | undefined} */
  #rayCaster;
  /** @type {ThreeJS.Vector2 | undefined} */
  #rayCasterPointer;

  /**
   * Class constructor.
   *
   * @param {Canvas} - Represents the application canvas.
   */
  constructor(canvas) {
    // Call the base constructor implementation.
    super('Scene3D', canvas);
  }

  /**
   * @override
   */
  async initAsync() {
    // Validate the scene.
    if (this.isInitialized || this.isDisposed) {
      // Log the message.
      console.error(`${this.name} has already been initialized or is already disposed. Init must be called only once.`);

      // Do nothing.
      return;
    }

    // Initialize components.
    this.#initThreeJS();

    // Initialize the resources.
    await this.#initializeResources();

    // Register the scene events.
    this.#registerEvents();

    // Call the base implementation.
    await super.initAsync();

    // Log the message.
    console.log(`${this.name} canvas has been initialized successfully.`);
  }

  /**
   * @override
   */
  update(deltaTime) {
    // Call the base implementation.
    super.update();

    // Update the camera orbit control.
    this.#threeJSOrbitControl.update(deltaTime);

    // Render the scene.
    this.#threeJSWebGLRenderer.render(this.#threeJSScene, this.#threeJSPerspectiveCamera);
  }

  /**
   * Initialize the Three JS module.
   */
  #initThreeJS() {
    // Initialize the renderer.
    this.#threeJSWebGLRenderer = new ThreeJS.WebGLRenderer({
      antialias: true,
      canvas: this.canvas.canvasElement,
      alpha: true,
    });
    this.#threeJSWebGLRenderer.shadowMap.enabled = true;
    this.#threeJSWebGLRenderer.shadowMap.type = ThreeJS.PCFSoftShadowMap;

    // Initialize the camera.
    this.#threeJSPerspectiveCamera = new ThreeJS.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.#threeJSPerspectiveCamera.position.set(210, 130, 205);

    // Initialize the orbit control.
    this.#threeJSOrbitControl = new OrbitControls(this.#threeJSPerspectiveCamera, this.canvas.canvasElement);

    // Define the orbit settings.
    this.#threeJSOrbitControl.enableDamping = true;
    this.#threeJSOrbitControl.dampingFactor = 0.05;
    this.#threeJSOrbitControl.enablePan = false;
    this.#threeJSOrbitControl.enableZoom = false;
    this.#threeJSOrbitControl.enableRotate = false;
    this.#threeJSOrbitControl.autoRotate = false;
    this.#threeJSOrbitControl.maxDistance = 1;
    this.#threeJSOrbitControl.target.set(165, 125, 175);

    // Define the raycast.
    this.#rayCaster = new ThreeJS.Raycaster();

    // Define the raycast pointer.
    this.#rayCasterPointer = new ThreeJS.Vector2();

    // Initialize the scene.
    this.#threeJSScene = new ThreeJS.Scene();

    // Call the resize.
    this.#resize();
  }

  /**
   * Initialize all asynchronous resources for the scene (e.g., videos).
   * @private
   */
  async #initializeResources() {
    // Create and configure videos
    const createVideo = async path => {
      const video = document.createElement('video');
      video.src = path;
      video.volume = 0.1;
      video.loop = true;
      video.muted = true;
      await video.play().catch(() => {}); // Ignore autoplay errors
      return video;
    };

    // Initialize videos for TV and Monitor
    this.#televisionVideo = await createVideo('./assets/videos/TomAndJerry.mp4');
    this.#monitorVideo = await createVideo('./assets/videos/CSharp.mp4');
    this.#sceneModel = await this.#loadSceneAsync();
  }

  /**
   * Asynchronously loads and configures the 3D scene.
   * @private
   * */
  async #loadSceneAsync() {
    const loader = new FBXLoader();

    // Load the scene.
    const object = await new Promise((resolve, reject) => {
      loader.load(
        './../../assets/models/Scene_3D.fbx',
        object => resolve(object),
        undefined, // optional progress callback
        err => reject(err)
      );
    });

    // Configure the scene.
    this.#configureScene(object);

    // Return the scene.
    return object;
  }

  /**
   * Configures the loaded 3D scene.
   * @param {ThreeJS.Object3D} object - The loaded 3D scene object to configure.
   * @private
   */
  #configureScene(object) {
    // Scale the model.
    object.scale.set(0.01, 0.01, 0.01);

    // Add spot lights.
    this.#spotLights.push(object.getObjectByName('Spot_01'));

    // Apply videos.
    this.#applyVideo(this.#televisionVideo, object.getObjectByName('TV_00'), 'Video_Frame_00');
    this.#applyVideo(this.#monitorVideo, object.getObjectByName('PC_Screen_00'), 'Video_Frame_01');

    // Apply spot lights.
    this.#applySpotLights(false);

    // Apply lighting.
    this.#applyLighting();

    // Add the model to the scene.
    this.#threeJSScene.add(object);
  }

  /**
   * Apply a video texture to a mesh material.
   * @param {HTMLVideoElement} video - The video element to use as a texture
   * @param {ThreeJS.Mesh} object - The mesh object to apply the video on
   * @param {string} materialName - Name of the material to replace with video texture
   * @private
   */
  #applyVideo(video, object, materialName) {
    const videoTexture = new ThreeJS.VideoTexture(video);
    videoTexture.minFilter = ThreeJS.LinearFilter;
    videoTexture.magFilter = ThreeJS.LinearFilter;
    videoTexture.format = ThreeJS.RGBFormat;

    if (object && Array.isArray(object.material)) {
      const index = object.material.findIndex(mat => mat.name === materialName);
      if (index !== -1) {
        object.material[index] = new ThreeJS.MeshBasicMaterial({ map: videoTexture });
      }
    }
  }

  /**
   * Toggle spot lights on or off.
   * @param {boolean} status - True to turn on, false to turn off
   * @private
   */
  #applySpotLights(status) {
    this.#spotLights.forEach(spot => {
      spot.visible = status;
    });
  }

  /**
   * Apply lighting to the scene.
   * @private
   */
  #applyLighting() {
    // Define the ambient and direction lighting.
    this.#lighting = new ThreeJS.HemisphereLight(0xfff0e0, 0x888888, 1.8);

    // Set the position of the light in the scene.
    this.#lighting.position.set(10, 150, 10);

    // Add it to the scene.
    this.#threeJSScene.add(this.#lighting);
  }

  /**
   * Resizes the scene to match the current size of the window.
   * @private
   */
  #resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    // Update camera
    this.#threeJSPerspectiveCamera.aspect = aspect;
    this.#threeJSPerspectiveCamera.updateProjectionMatrix();

    // Update renderer
    this.#threeJSWebGLRenderer.setSize(width, height, false);

    // Use device pixel ratio but clamp to avoid extreme scaling
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.#threeJSWebGLRenderer.setPixelRatio(pixelRatio);
  }

  /**
   * Resizes the scene events
   * @private
   */
  #registerEvents() {
    window.addEventListener('resize', this.#resize.bind(this));
    window.addEventListener('pointermove', this.#onPointerMove.bind(this));
    window.addEventListener('pointerdown', this.#onPointerDown.bind(this));
  }

  /**
   * Handles pointer movement over the canvas.
   * @private
   * @param {PointerEvent} event
   */
  #onPointerMove(event) {
    const rect = this.canvas.canvasElement.getBoundingClientRect();

    // Update normalized pointer coordinates for raycasting
    this.#rayCasterPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.#rayCasterPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update cursor if hovering interactive objects
    this.#rayCaster.setFromCamera(this.#rayCasterPointer, this.#threeJSPerspectiveCamera);
    const intersects = this.#rayCaster.intersectObjects(this.#threeJSScene.children, true);
    const firstHit = intersects[0];

    if (firstHit) {
      const interactiveNames = ['SwitchLight_00', 'TV_00'];
      if (interactiveNames.includes(firstHit.object.name)) {
        this.canvas.canvasElement.style.cursor = 'pointer';
        return;
      }
    }

    // Default cursor
    this.canvas.canvasElement.style.cursor = 'default';
  }

  /**
   * Handles pointer down events on the scene.
   * @private
   * @param {PointerEvent} event
   */
  #onPointerDown(event) {
    // Only respond to left click
    if (event.button !== 0) return;

    this.#rayCaster.setFromCamera(this.#rayCasterPointer, this.#threeJSPerspectiveCamera);
    const intersects = this.#rayCaster.intersectObjects(this.#threeJSScene.children, true);
    const firstHit = intersects[0];

    if (!firstHit) return;

    const current = firstHit.object;

    switch (current.name) {
      case 'SwitchLight_00':
        this.#lighting.intensity = this.#lighting.intensity === 1.8 ? 0.4 : 1.8;
        this.#applySpotLights(this.#lighting.intensity !== 1.8);
        break;
      case 'TV_00':
        this.#televisionVideo.muted = !this.#televisionVideo.muted;
        break;
    }
  }
}
