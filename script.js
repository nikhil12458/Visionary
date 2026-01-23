const canvas = document.querySelector(".canvas");
const rectButton = document.querySelector(".rect-box");
const textButton = document.querySelector(".text-box");
const circleButton = document.querySelector(".rect-circle");
const layer = document.querySelector(".layers .bottom");
const zPlus = document.querySelector(".zIndex .increase");
const zMinus = document.querySelector(".zIndex .decrease");
const widthField = document.querySelector(".dimensions .width input");
const heightField = document.querySelector(".dimensions .height input");
const xPositionField = document.querySelector(".position .x input");
const yPositionField = document.querySelector(".position .y input");
const opacityField = document.querySelector(".appearance .opacity input");
const cornerField = document.querySelector(".appearance .corner input");
const rotateField = document.querySelector(".fill .content .rotate input");
const fillInput = document.querySelector(".fill .content .color input");
const textAreaField = document.querySelector(".textContent textarea");
const jsonButton = document.querySelector(".exportButtons .content .json");
const htmlButton = document.querySelector(".exportButtons .content .html");
const resetButton = document.querySelector(".resetButton");

resetButton.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

const fields = [
  widthField,
  heightField,
  xPositionField,
  yPositionField,
  opacityField,
  cornerField,
  fillInput,
  textAreaField,
  rotateField,
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
  syncOpacity();
  syncWidth();
  syncHeight();
  syncX();
  syncY();
  syncCorner();
  syncFill();
  syncRotate();
  syncCirc();
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

function syncCirc() {
  if (!data.selected) return;
  const selectedElement = getSelectedElem();

  if (selectedElement.type === "circ") {
    cornerField.setAttribute("disabled", true);
  }
}

function updateOpacity() {
  if (!data.selected) return;

  const selectedElement = getSelectedElem();

  selectedElement.opacity = opacityField.value;

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function syncOpacity() {
  const selectedElement = getSelectedElem();

  if (!selectedElement) return (opacityField.value = 0);

  opacityField.value = selectedElement.opacity;
}

function updateRotate() {
  const selectedElement = getSelectedElem();

  selectedElement.rotate = rotateField.value;

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function syncRotate() {
  const selectedElement = getSelectedElem();

  if (!selectedElement) return (rotateField.value = 0);

  rotateField.value = selectedElement.rotate;
}

function updateWidth() {
  if (!data.selected) return;

  const selectedElement = getSelectedElem();

  selectedElement.width = Number(widthField.value);

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function syncWidth() {
  const selectedElement = getSelectedElem();

  if (!selectedElement) return (widthField.value = 0);

  widthField.value = selectedElement.width;
}

function updateHeight() {
  const selectedElement = getSelectedElem();

  selectedElement.height = Number(heightField.value);

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function syncHeight() {
  const selectedElement = getSelectedElem();

  if (!selectedElement) return (heightField.value = 0);

  heightField.value = selectedElement.height;
}

function updateX() {
  const selectedElement = getSelectedElem();

  selectedElement.x = xPositionField.value;

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function syncX() {
  const selectedElement = getSelectedElem();
  if (!selectedElement) return (xPositionField.value = 0);

  xPositionField.value = Number(selectedElement.x).toFixed(2);
}

function updateY() {
  const selectedElement = getSelectedElem();
  selectedElement.y = yPositionField.value;

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function syncY() {
  const selectedElement = getSelectedElem();
  if (!selectedElement) return (yPositionField.value = 0);
  yPositionField.value = Number(selectedElement.y).toFixed(2);
}

function updateCorner() {
  const selectedElement = getSelectedElem();
  if (!selectedElement.type === "rect") return;
  selectedElement.corner = cornerField.value;

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function syncCorner() {
  const selectedElement = getSelectedElem();

  if (!selectedElement || selectedElement.type === "circ")
    return (cornerField.value = 0);

  cornerField.value = selectedElement.corner;
}

function updateFill() {
  const selectedElement = getSelectedElem();

  selectedElement.type === "text"
    ? (selectedElement.styles.color = fillInput.value)
    : (selectedElement.styles.bg = fillInput.value);

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function syncFill() {
  const selectedElement = getSelectedElem();

  if (!selectedElement) return (fillInput.value = "#ffffff");

  fillInput.value =
    selectedElement.type === "text"
      ? selectedElement.styles.color
      : selectedElement.styles.bg;
}

function toggleTextArea() {
  const selectedElem = getSelectedElem();

  if (selectedElem && selectedElem.type === "text") {
    textAreaField.removeAttribute("disabled");
    textAreaField.value = selectedElem.content || "";
  } else {
    textAreaField.setAttribute("disabled", true);
    textAreaField.value = "";
  }
}

function updateTextContent() {
  if (!data.selected) return;

  const selectedElement = getSelectedElem();

  if (selectedElement && selectedElement.type === "text") {
    selectedElement.content = textAreaField.value;
  }

  canvas.innerHTML = "";
  data.elements.forEach((elem) => createElem(elem));
}

function addResizeHandles(div, elem) {
  const hadles = ["tl", "tr", "bl", "br"];

  hadles.forEach((posi) => {
    const handle = document.createElement("div");

    /* 
    source of inspiration for resize code : https://youtu.be/4qyuNBlc8ho?si=TnNzaOhLEaAgyarF
     */

    handle.classList.add("resize", posi);

    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();

      prevX = e.clientX;
      prevY = e.clientY;

      function mouseMove(e) {
        if (handle.classList.contains("tr")) {
          if (
            elem.width + (e.clientX - prevX) <= canvas.clientWidth &&
            elem.width + (e.clientX - prevX) >= 40
          ) {
            elem.width -= prevX - e.clientX;
          }
          if (elem.height - (e.clientY - prevY) >= 40) {
            elem.height += prevY - e.clientY;
            elem.y -= prevY - e.clientY;
          }

          prevX = e.clientX;
          prevY = e.clientY;

          div.style.width = elem.width >= 40 ? elem.width + "px" : "40px";
          div.style.height = elem.height >= 40 ? elem.height + "px" : "40px";
          div.style.top = elem.y + "px";

          syncLayerElement();
        } else if (handle.classList.contains("br")) {
          if (
            elem.width + (e.clientX - prevX) <= canvas.clientWidth &&
            elem.width + (e.clientX - prevX) >= 40
          ) {
            elem.width -= prevX - e.clientX;
          }
          if (elem.height + (e.clientY - prevY) >= 40) {
            elem.height -= prevY - e.clientY;
          }

          prevX = e.clientX;
          prevY = e.clientY;

          div.style.width = elem.width >= 40 ? elem.width + "px" : "40px";
          div.style.height = elem.height >= 40 ? elem.height + "px" : "40px";

          syncLayerElement();
        } else if (handle.classList.contains("tl")) {
          if (
            elem.x + (prevX - e.clientX) >= 0 &&
            elem.width + (prevX - e.clientX) >= 40
          ) {
            elem.width += prevX - e.clientX;
            elem.x -= prevX - e.clientX;
          }
          if (
            elem.y + (prevY - e.clientY) >= 0 &&
            elem.height + (prevY - e.clientY) >= 40
          ) {
            elem.height += prevY - e.clientY;
            elem.y -= prevY - e.clientY;
          }

          prevX = e.clientX;
          prevY = e.clientY;

          div.style.width = elem.width >= 40 ? elem.width + "px" : "40px";
          div.style.height = elem.height >= 40 ? elem.height + "px" : "40px";
          div.style.top = elem.y + "px";
          div.style.left = elem.x + "px";

          syncLayerElement();
        } else {
          if (
            elem.x + (prevX - e.clientX) >= 0 &&
            elem.width + (prevX - e.clientX) >= 40
          ) {
            elem.width += prevX - e.clientX;
            elem.x -= prevX - e.clientX;
          }
          elem.height -= prevY - e.clientY;

          prevX = e.clientX;
          prevY = e.clientY;

          div.style.width = elem.width >= 40 ? elem.width + "px" : "40px";
          div.style.height = elem.height >= 40 ? elem.height + "px" : "40px";
          div.style.top = elem.y + "px";
          div.style.left = elem.x + "px";

          syncLayerElement();
        }
      }

      function mouseUp() {
        canvas.removeEventListener("mousemove", mouseMove);
        canvas.removeEventListener("mouseup", mouseUp);
        saveLocalStorage();
      }

      canvas.addEventListener("mousemove", mouseMove);
      canvas.addEventListener("mouseup", mouseUp);
    });

    div.appendChild(handle);
  });
}

function createElem(elem) {
  const div = document.createElement("div");
  div.classList.add("element", "rect");
  div.id = elem.id;
  div.style.width = elem.width + "px";
  div.style.height = elem.height + "px";
  div.style.left = elem.x + "px";
  div.style.top = elem.y + "px";
  div.style.zIndex = elem.zIndex;
  div.style.backgroundColor = elem.styles.bg;
  elem.corner
    ? elem.type === "rect"
      ? (div.style.borderRadius = elem.corner + "px")
      : elem.type === "circ"
        ? (div.style.borderRadius = elem.corner)
        : ""
    : "";
  div.style.opacity = elem.opacity / 100;
  div.style.transform = `rotate(${elem.rotate}deg)`;
  elem.styles.color ? (div.style.color = elem.styles.color) : "";
  elem.content
    ? (div.innerText = elem.content)
      ? (div.style.padding = "1rem")
      : null
    : null;

  /* 
    source of inspiration for drag code : https://youtu.be/NyZSIhzz5Do?si=vC2HqYOZHGMwuI6H
     */

  div.addEventListener("mousedown", (e) => {
    if (String(elem.id) !== data.selected) return;
    if (e.target.classList.contains("resize")) return;

    let prevX = e.clientX;
    let prevY = e.clientY;

    function mouseMove(e) {
      let newX = prevX - e.clientX;
      let newY = prevY - e.clientY;

      prevX = e.clientX;
      prevY = e.clientY;

      if (
        elem.x - newX >= 0 &&
        elem.x - newX + elem.width <= canvas.clientWidth
      ) {
        elem.x -= newX;
      }
      if (
        elem.y - newY >= 0 &&
        elem.y - newY + elem.height <= canvas.clientHeight
      ) {
        elem.y -= newY;
      }

      div.style.left = elem.x + "px";
      div.style.top = elem.y + "px";

      syncLayerElement();
    }

    function mouseUp() {
      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("mouseup", mouseUp);
      saveLocalStorage();
    }

    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseup", mouseUp);
  });

  addResizeHandles(div, elem);

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
      bg: "#ff0000",
      borderRadius: 30,
    },
    zIndex: id,
    corner: 0,
    opacity: 100,
    rotate: 0,
  };
  data.elements.push(rect);
  data.selected = String(id);
  createElem(rect);
  updateLayer();
  syncLayerElement();
  saveLocalStorage();
});

circleButton.addEventListener("click", () => {
  const width = 250;
  const height = 250;
  const id = idCounter++;
  let circ = {
    type: "circ",
    id,
    width,
    height,
    y: increaseElemTop(height),
    x: increaseElemLeft(width),
    styles: {
      bg: "#ff0000",
    },
    zIndex: id,
    corner: "50%",
    opacity: 100,
    rotate: 0,
  };
  data.elements.push(circ);
  data.selected = String(id);
  createElem(circ);
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
      color: "#000000",
      borderRadius: 30,
    },
    zIndex: id,
    corner: 0,
    content: "some text",
    opacity: 100,
    rotate: 0,
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

widthField.addEventListener("input", () => {
  updateWidth();
  saveLocalStorage();
});

heightField.addEventListener("input", () => {
  updateHeight();
  saveLocalStorage();
});

xPositionField.addEventListener("input", () => {
  updateX();
  saveLocalStorage();
});

yPositionField.addEventListener("input", () => {
  updateY();
  saveLocalStorage();
});

opacityField.addEventListener("input", () => {
  updateOpacity();
  saveLocalStorage();
});

rotateField.addEventListener("input", () => {
  updateRotate();
  saveLocalStorage();
});

cornerField.addEventListener("input", () => {
  updateCorner();
  saveLocalStorage();
});

fillInput.addEventListener("input", () => {
  updateFill();
  saveLocalStorage();
});

textAreaField.addEventListener("input", () => {
  updateTextContent();
  saveLocalStorage();
});

textAreaField.addEventListener("blur", () => {
  textAreaField.value = "";
});

document.addEventListener("keydown", (e) => {
  const selectedElement = getSelectedElem();

  if (selectedElement) {
    if (e.key === "ArrowUp") {
      if (selectedElement.y - 5 >= 0) {
        selectedElement.y -= 5;
      }

      canvas.innerHTML = "";

      data.elements.forEach((elem) => createElem(elem));
      saveLocalStorage();
      syncLayerElement();
    } else if (e.key === "ArrowDown") {
      if (
        selectedElement.y + selectedElement.height + 5 <=
        canvas.clientHeight
      ) {
        selectedElement.y += 5;
      }

      canvas.innerHTML = "";
      data.elements.forEach((elem) => createElem(elem));
      saveLocalStorage();
      syncLayerElement();
    } else if (e.key === "ArrowRight") {
      if (selectedElement.x + selectedElement.width + 5 <= canvas.clientWidth) {
        selectedElement.x += 5;
      }

      canvas.innerHTML = "";
      data.elements.forEach((elem) => createElem(elem));
      saveLocalStorage();
      syncLayerElement();
    } else if (e.key === "ArrowLeft") {
      if (selectedElement.x - 5 >= 0) {
        selectedElement.x -= 5;
      }

      canvas.innerHTML = "";
      data.elements.forEach((elem) => createElem(elem));
      saveLocalStorage();
      syncLayerElement();
    }
  }
});

/*
 download functionality inspiration from : https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
 */

jsonButton.addEventListener("click", () => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(data.elements));

  const anchor = document.createElement("a");
  anchor.setAttribute("href", dataStr);
  anchor.setAttribute("download", "canvasData.json");
  anchor.click();
  anchor.remove();
});

htmlButton.addEventListener("click", () => {
  const htmlContent = canvas.innerHTML;
  const canvasElement = `
  <html>
  <head>
  <title>canvas</title>
  <style>
  .canvas{
  position: relative;
  height: 100vh;
  }
  .element{
  position: absolute;
}
  </style>
  </head>
  <body>
  <div class="canvas" style="position: relative; width:${canvas.clientWidth}px; height:${canvas.clientHeight}px; border: 1px solid #000000;">${htmlContent}</div>
  </body>
  </html>
  `;
  const dataStr =
    "data:text/html;charset=utf-8," + encodeURIComponent(canvasElement);

  const anchor = document.createElement("a");
  anchor.setAttribute("href", dataStr);
  anchor.setAttribute("download", "canvas.html");
  anchor.click();
  anchor.remove();
});

disableInputs();
toggleTextArea();
getLocalStorage();
