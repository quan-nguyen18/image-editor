// script.js hoàn chỉnh
const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const hero = document.getElementById('hero');
const editor = document.getElementById('editor');
const overlay = document.getElementById('overlay');
const overlayCtx = overlay.getContext('2d');
let originalImage = new Image();
let rotation = 0;
let brightness = 0;

upload.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    originalImage.onload = () => {
      hero.style.display = 'none';
      editor.style.display = 'flex';
      renderImage();
    };
    originalImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function applyEdit(type) {
  if (!originalImage.src) return;

  if (type === 'rotate') {
    rotation = (rotation + 90) % 360;
  } else if (type === 'brighten') {
    brightness += 10;
  } else if (type === 'darken') {
    brightness -= 10;
  } else if (type === 'reset') {
    rotation = 0;
    brightness = 0;
    clearOverlay();
    document.getElementById('ocrResult').innerText = '';
  } else if (type === 'sobelX' || type === 'sobelY') {
    applySobel(type);
    return;
  }

  renderImage();
}

function renderImage() {
  const radians = rotation * Math.PI / 180;
  const w = originalImage.width;
  const h = originalImage.height;
  const rotatedW = (rotation % 180 === 0) ? w : h;
  const rotatedH = (rotation % 180 === 0) ? h : w;

  const canvasMaxW = 600;
  const canvasMaxH = 500;
  canvas.width = canvasMaxW;
  canvas.height = canvasMaxH;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `brightness(${100 + brightness}%)`;

  const scale = Math.min(canvas.width / rotatedW, canvas.height / rotatedH);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.scale(scale, scale);
  ctx.drawImage(originalImage, -w / 2, -h / 2);
  ctx.restore();
}

function applySobel(type) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const grayscale = new Uint8ClampedArray(width * height);

  for (let i = 0; i < src.length; i += 4) {
    const avg = 0.3 * src[i] + 0.59 * src[i + 1] + 0.11 * src[i + 2];
    grayscale[i / 4] = avg;
  }

  const dst = new Uint8ClampedArray(width * height);
  const kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = grayscale[(y + ky) * width + (x + kx)];
          const idx = (ky + 1) * 3 + (kx + 1);
          gx += kernelX[idx] * pixel;
          gy += kernelY[idx] * pixel;
        }
      }
      const g = type === 'sobelX' ? Math.abs(gx) : Math.abs(gy);
      dst[y * width + x] = Math.min(255, g);
    }
  }

  const output = ctx.createImageData(width, height);
  for (let i = 0; i < dst.length; i++) {
    const val = dst[i];
    output.data[i * 4 + 0] = val;
    output.data[i * 4 + 1] = val;
    output.data[i * 4 + 2] = val;
    output.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(output, 0, 0);
}

function clearOverlay() {
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
}

const uploadAgain = document.getElementById('uploadAgain');
uploadAgain.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    originalImage.onload = () => {
      rotation = 0;
      brightness = 0;
      clearOverlay();
      document.getElementById('ocrResult').innerText = '';
      renderImage();
    };
    originalImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
});
