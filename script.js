const canvas = document.getElementById("dropArea");
const textInput = document.getElementById("textInput");
const colorInput = document.getElementById("colorInput");
const sizeInput = document.getElementById("sizeInput");

let selected = null;

// Drag start from sidebar
document.querySelectorAll(".draggable").forEach((el) => {
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("type", el.dataset.type);
  });
});

// Allow drop on canvas
canvas.addEventListener("dragover", (e) => e.preventDefault());

canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  const x = e.offsetX;
  const y = e.offsetY;

  const item = document.createElement("div");
  item.classList.add("item");
  item.style.left = x + "px";
  item.style.top = y + "px";

  if (type === "text") {
    item.textContent = "Editable Text";
  } else if (type === "button") {
    item.innerHTML = "<button>Edit Me</button>";
  } else if (type === "image") {
    item.innerHTML = `<img src="https://via.placeholder.com/100" width="100" />`;
  }

  canvas.appendChild(item);
  makeMovable(item);
  selectItem(item);

  item.addEventListener("click", () => selectItem(item));
});

function selectItem(item) {
  if (selected) selected.classList.remove("selected");
  selected = item;
  selected.classList.add("selected");

  const img = selected.querySelector("img");
  const btn = selected.querySelector("button");

  if (img) {
    textInput.value = img.src;
    colorInput.value = "#000000"; // no color for image
    sizeInput.value = parseInt(img.style.width) || 100;
  } else if (btn) {
    textInput.value = btn.textContent;
    const style = window.getComputedStyle(btn);
    colorInput.value = rgbToHex(style.backgroundColor);
    sizeInput.value = parseInt(style.fontSize) || 16;
  } else {
    textInput.value = selected.textContent;
    const style = window.getComputedStyle(selected);
    colorInput.value = rgbToHex(style.color);
    sizeInput.value = parseInt(style.fontSize) || 16;
  }
}

function makeMovable(item) {
  let offsetX, offsetY;

  item.addEventListener("mousedown", (e) => {
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    function move(e2) {
      item.style.left = e2.pageX - canvas.offsetLeft - offsetX + "px";
      item.style.top = e2.pageY - canvas.offsetTop - offsetY + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  });
}

textInput.addEventListener("input", () => {
  if (!selected) return;

  const img = selected.querySelector("img");
  const btn = selected.querySelector("button");

  if (img) {
    img.src = textInput.value;
  } else if (btn) {
    btn.textContent = textInput.value;
  } else {
    selected.textContent = textInput.value;
  }
});

colorInput.addEventListener("input", () => {
  if (!selected) return;

  const btn = selected.querySelector("button");

  if (btn) {
    btn.style.backgroundColor = colorInput.value;
    btn.style.color = "#fff";
  } else {
    selected.style.color = colorInput.value;
  }
});

sizeInput.addEventListener("input", () => {
  if (!selected) return;

  const img = selected.querySelector("img");
  const btn = selected.querySelector("button");
  const size = sizeInput.value + "px";

  if (img) {
    img.style.width = size;
    img.style.height = "auto";
  } else if (btn) {
    btn.style.fontSize = size;
  } else {
    selected.style.fontSize = size;
  }
});

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g).map(Number);
  return "#" + result.map((x) => x.toString(16).padStart(2, "0")).join("");
}
