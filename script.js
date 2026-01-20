const canvas = document.querySelector(".canvas");
const rectButton = document.querySelector(".rect-box");
const textButton = document.querySelector(".text-box");

const data = {
  elements: [],
};

let id = 1;

let elementTop = 0;
let elementLeft = 0;

function increaseElemTop(top) {
  if (elementTop + top + 10 < canvas.clientHeight) return (elementTop += 10);
  return elementTop;
}

function increaseElemLeft(left) {
  if (elementLeft + left + 10 < canvas.clientWidth) return (elementLeft += 10);
  return elementLeft;
}

function createElem(elem) {
  const div = document.createElement("div");
  div.classList.add("element", "rect");
  div.style.width = elem.width + "px";
  div.style.height = elem.height + "px";
  div.style.left = elem.x + "px";
  div.style.top = elem.y + "px";
  div.style.backgroundColor = elem.styles.bg;

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
  console.log(data.elements);
  createElem(rect);
  console.log(canvasData);
});
