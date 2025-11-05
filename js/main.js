// Strict mode
'use script';

// Dependencies
import * as bootstrap from './libs/bootstrap/bootstrap.bundle.min.js';
import Canvas from './canvas.js';

// Starting point of the application
async function init() {
  // Gets the canvas element.
  const canvasElement = document.getElementById('canvas');
  const loadingOverlay = document.getElementById('loading-overlay');

  // Instantiate the canvas.
  const canvas = new Canvas(canvasElement, loadingOverlay);

  // Initialize the canvas.
  await canvas.initAsync();
}

// When the DOM content is loaded call the init method.
window.addEventListener('DOMContentLoaded', init);

// Subscribe to modals.
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const bsCollapse = document.getElementById('navigationMenu');
    bsCollapse.classList.toggle('show');
  });
});
