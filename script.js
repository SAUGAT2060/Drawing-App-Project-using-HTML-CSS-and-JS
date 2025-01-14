const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const undoBtn = document.getElementById('undo');
const eraserBtn = document.getElementById('eraser');

const ctx = canvas.getContext('2d');

let size = 10;
let isPressed = false;
let color = colorEl.value;
let x, y;
let isEraser = false;
let history = [];

function saveState() {
  history.push(canvas.toDataURL());
}

canvas.addEventListener('mousedown', (e) => {
  isPressed = true;
  x = e.offsetX;
  y = e.offsetY;
  saveState();
});

document.addEventListener('mouseup', () => {
  isPressed = false;
  x = undefined;
  y = undefined;
});

canvas.addEventListener('mousemove', (e) => {
  if (isPressed) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;

    if (isEraser) {
      drawLine(x, y, x2, y2, '#f5f5f5');
    } else {
      drawCircle(x2, y2);
      drawLine(x, y, x2, y2, color);
    }

    x = x2;
    y = y2;
  }
});

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, strokeStyle) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = size * 2;
  ctx.stroke();
}

function updateSizeOnScreen() {
  sizeEL.innerText = size;
}

increaseBtn.addEventListener('click', () => {
  size += 5;
  if (size > 50) size = 50;
  updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
  size -= 5;
  if (size < 5) size = 5;
  updateSizeOnScreen();
});

colorEl.addEventListener('change', (e) => {
  color = e.target.value;
  isEraser = false;
});

eraserBtn.addEventListener('click', () => {
  isEraser = !isEraser;
});

clearEl.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  history = [];
});

undoBtn.addEventListener('click', () => {
  if (history.length > 0) {
    history.pop();
    const imgData = new Image();
    imgData.src = history[history.length - 1] || '';
    imgData.onload = () => ctx.drawImage(imgData, 0, 0);
  }
});

saveBtn.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'drawing.png';
  link.click();
});
