const canvas = document.querySelector(".canvas");
const rectButton = document.querySelector(".rect-box");
const textButton = document.querySelector(".text-box");
const layer = document.querySelector(".layers .bottom");
const zPlus = document.querySelector(".zIndex .increase");
const zMinus = document.querySelector(".zIndex .decrease");
const widthField = document.querySelector(".dimensions .width input");
const heightField = document.querySelector(".dimensions .height input");
const xPositionField = document.querySelector(".position .x input");
const yPositionField = document.querySelector(".position .y input");
const opacityField = document.querySelector(".appearance .opacity input");
const cornerField = document.querySelector(".appearance .corner input");
const fillInput = document.querySelector(".fill input");
const textAreaField = document.querySelector(".textContent textarea");

const fields = [
  widthField,
  heightField,
  xPositionField,
  yPositionField,
  opacityField,
  cornerField,
  fillInput,
  textAreaField,
];

const data = {
  elements: [],
  selected: null,
};

function saveLocalStorage() {
  localStorage.setItem("canvasData", JSON.stringify(data));
}

function getLocalStorage() {
  const canvasData = JSON.parse(localStorage.getItem("canvasData"));

  if (!canvasData) return;

  canvas.innerHTML = "";
  layer.innerHTML = "";

  data.elements = canvasData.elements || [];
  data.selected = canvasData.selected || null;

  data.elements.forEach((elem) => {
    createElem(elem);
  });

  syncLayerElement();
  updateLayer();
}

let idCounter = 1;

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

function elementSelector() {
  canvas.querySelectorAll(".element").forEach((elem) => {
    elem.classList.toggle("selected", elem.id === data.selected);
  });
}

function layerSelector() {
  layer.querySelectorAll(".layerItem").forEach((elem) => {
    elem.classList.toggle("selected", elem.id === data.selected);
  });
}

function updateLayer() {
  layer.innerHTML = "";

  const saved = [...data.elements].sort((a, b) => {
    return b.zIndex - a.zIndex;
  });

  saved.forEach((elem) => {
    const div = document.createElement("div");
    div.style.backgroundColor = "#c2c6cc";
    div.innerText = elem.type;
    div.id = elem.id;
    div.classList.add("layerItem");
    layer.appendChild(div);

    String(elem.id) === data.selected ? div.classList.add("selected") : "";
  });
}

function syncLayerElement() {
  elementSelector();
  layerSelector();
  disableInputs();
  toggleTextArea();
}

function deleteElement() {
  if (!data.selected) return;

  for (i = 0; i < data.elements.length; i++) {
    if (data.elements[i].id == data.selected) {
      data.elements.splice(i, 1);
      break;
    }
  }

  canvas.innerHTML = "";
  layer.innerHTML = "";

  data.elements.forEach((elem) => createElem(elem));

  data.selected = null;

  updateLayer();
  syncLayerElement();

  saveLocalStorage();
}

function zIncrease() {
  if (!data.selected) return;

  const currentElem = data.elements.find((elem) => {
    return String(elem.id) === data.selected;
  });

  const nextElem = data.elements.find((elem) => {
    return elem.zIndex === currentElem.zIndex + 1;
  });

  if (!nextElem) return;

  [currentElem.zIndex, nextElem.zIndex] = [nextElem.zIndex, currentElem.zIndex];

  canvas.innerHTML = "";
  layer.innerHTML = "";

  data.elements.forEach((elem) => createElem(elem));

  updateLayer();
  syncLayerElement();
  saveLocalStorage();
}

function getSelectedElem() {
  if (!data.selected) return;

  return data.elements.find((elem) => String(elem.id) === data.selected);
}

function zDecrease() {
  if (!data.selected) return;

  const currentElem = data.elements.find((elem) => {
    return String(elem.id) === data.selected;
  });

  const lastElem = data.elements.find((elem) => {
    return elem.zIndex === currentElem.zIndex - 1;
  });

  if (!lastElem) return;

  [currentElem.zIndex, lastElem.zIndex] = [lastElem.zIndex, currentElem.zIndex];

  canvas.innerHTML = "";
  layer.innerHTML = "";

  data.elements.forEach((elem) => createElem(elem));
  updateLayer();

  syncLayerElement();
  saveLocalStorage();
}

function disableInputs() {
  if (data.selected) {
    fields.forEach((inp) => {
      inp.removeAttribute("disabled");
    });
  } else {
    fields.forEach((inp) => {
      inp.setAttribute("disabled", "true");
    });
  }
}

function toggleTextArea() {
  const selectedElem = getSelectedElem();

  if (selectedElem && selectedElem.type === "text") {
    textAreaField.removeAttribute("disabled");
  } else {
    textAreaField.setAttribute("disabled", true);
  }
}

function updateTextContent() {
  if (!data.selected) return;

  const selectedElement = getSelectedElem();

  if (selectedElement && selectedElement.type === "text") {
    selectedElement.content = textAreaField.value;
  }

  canvas.innerHTML = "";
  data.elements.forEach(createElem);
}

function createElem(elem) {
  const div = document.createElement("div");
  div.classList.add("element", "rect");
  div.id = elem.id;
  div.style.width = elem.type === "rect" ? elem.width + "px" : "fit-content";
  div.style.height = elem.type === "rect" ? elem.height + "px" : "fit-content";
  div.style.left = elem.x + "px";
  div.style.top = elem.y + "px";
  div.style.zIndex = elem.zIndex;
  div.style.backgroundColor = elem.styles.bg;
  elem.corner ? (div.style.borderRadius = elem.corner + "px") : "";
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
  const id = idCounter++;
  let rect = {
    type: "rect",
    id,
    width,
    height,
    y: increaseElemTop(height),
    x: increaseElemLeft(width),
    styles: {
      bg: "red",
      borderRadius: 30,
    },
    zIndex: id,
    corner: 0,
  };
  data.elements.push(rect);
  data.selected = String(id);
  createElem(rect);
  updateLayer();
  syncLayerElement();
  saveLocalStorage();
});

textButton.addEventListener("click", () => {
  const width = 250;
  const height = 250;
  const id = idCounter++;
  let text = {
    type: "text",
    id,
    width,
    height,
    y: increaseElemTop(height),
    x: increaseElemLeft(width),
    styles: {
      bg: "transparent",
      borderRadius: 30,
    },
    zIndex: id,
    content: "some text",
  };
  data.elements.push(text);
  data.selected = String(id);
  createElem(text);
  updateLayer();
  syncLayerElement();
  saveLocalStorage();
});

canvas.addEventListener("click", (e) => {
  const elementId = e.target.id;
  if (!elementId) data.selected = null;
  else data.selected = elementId;
  syncLayerElement();
  saveLocalStorage();
});

layer.addEventListener("click", (elem) => {
  const itemId = elem.target.id;
  if (!itemId) data.selected = null;
  else data.selected = itemId;
  syncLayerElement();
  saveLocalStorage();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Delete") {
    deleteElement();
  }
});

zPlus.addEventListener("click", () => {
  if (!data.selected) return;

  zIncrease();
});

zMinus.addEventListener("click", () => {
  if (!data.selected) return;

  zDecrease();
});

textAreaField.addEventListener("input", () => {
  updateTextContent();
  saveLocalStorage();
});

disableInputs();
toggleTextArea();
getLocalStorage();
