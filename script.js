const batteryItems = [
  ...document.querySelectorAll(".battery-item-big"),
  ...document.querySelectorAll(".battery-item-small"),
];

async function FillBattery() {
  for (const item of batteryItems) {
    item.style.background = "white";
  }

  for (let index = 0; index < batteryItems.length; index++) {
    const element = batteryItems[index];
    for (procent = 0; procent <= 100; procent += 10) {
      element.style.background = `linear-gradient(90deg, green ${procent}%, white 0%)`;
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  requestAnimationFrame(FillBattery);
}

FillBattery();
