const batteryItems = document.querySelectorAll(".battery-fill");
const animationDelay = 1000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAnimation() {
  while (true) {
    for (const item of batteryItems) {
      item.style.background = "white";
    }
    await delay(animationDelay);

    for (const item of batteryItems) {
      changeBackground(item);
      await delay(animationDelay);
    }
  }
}

function changeBackground(element) {
  let width = 0;

  function animate() {
    width++;
    if (width <= 100) {
      element.style.background = `linear-gradient(90deg, green ${width}%, white 100%)`;
      requestAnimationFrame(animate);
    }
  }

  animate();
}

runAnimation();
