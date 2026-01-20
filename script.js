const canvas = document.querySelector(".canvas");
const rectButton = document.querySelector(".rect-box");
const textButton = document.querySelector(".text-box");

const data = {
  elements: [],
};

let id = 1;

let elementTop = 0;
let elementLeft = 0;

function randomNum(min, max) {
  return min + Math.random() * (max - min);
}

function increaseElemTop(elementHeight) {
  const maxTop = canvas.clientHeight - elementHeight - 10;

  if (maxTop <= 0) return 0;

  elementTop = randomNum(0, maxTop);
  return elementTop;
}

function increaseElemLeft(elementWidth) {
  const maxLeft = canvas.clientWidth - elementWidth - 10;

  if (maxLeft <= 0) return 0;

  elementLeft = randomNum(0, maxLeft);
  return elementLeft;
}

function createElem(elem) {
  const div = document.createElement("div");
  div.classList.add("element", "rect", "selected");
  div.style.width = elem.width + "px";
  div.style.height = elem.height + "px";
  div.style.left = elem.x + "px";
  div.style.top = elem.y + "px";
  div.style.backgroundColor = elem.styles.bg;
  elem.content
    ? (div.innerText = elem.content)
      ? (div.style.padding = "1rem")
      : null
    : null;

  canvas.appendChild(div);
}

rectButton.addEventListener("click", () => {
  const width = 250;
  const height = 250;
  let rect = {
    id: id++,
    type: "rect",
    width,
    height,
    y: increaseElemTop(height),
    x: increaseElemLeft(width),
    styles: {
      bg: "red",
      borderRadius: 30,
    },
  };
  data.elements.push(rect);
  createElem(rect);
});

textButton.addEventListener("click", () => {
  const width = 250;
  const height = 250;
  let text = {
    id: id++,
    type: "text",
    width,
    height,
    y: increaseElemTop(height),
    x: increaseElemLeft(width),
    styles: {
      bg: "transparent",
      borderRadius: 30,
    },
    content: "some text",
  };
  data.elements.push(text);
  createElem(text);
});
