const batteryItemOne = document.querySelector(".number-1");
const batteryItemTwo = document.querySelector(".number-2");
const batteryItemThree = document.querySelector(".number-3");
const batteryItemFour = document.querySelector(".number-4");
const delayInMilliseconds = 1000;
const list = [
  batteryItemOne,
  batteryItemTwo,
  batteryItemThree,
  batteryItemFour,
];

const delayA = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

function Main(delay) {
  setInterval(async () => {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      element.style.background = "white";
    }
    let delayres = await delayA(1000);
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      changeBackground(element);
      let delayres = await delayA(1000);
    }
  }, delay);
}
function changeBackground(element) {
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      return;
    } else {
      width++;
      element.style.background =
        "linear-gradient(90deg, green " + width + "%,white 100%)";
    }
  }
}
Main(10000);
