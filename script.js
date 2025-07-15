const upload = document.getElementById('upload');
const uploadAgain = document.getElementById('uploadAgain');
const hero = document.querySelector('.hero');
const editor = document.getElementById('editor');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let originalImage = null;
let rotation = 0;
let brightness = 0;

// Chọn ảnh ban đầu
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;
      rotation = 0;
      brightness = 0;
      renderImage();
      hero.style.display = 'none';
      editor.style.display = 'flex';
    };
    img.src = reader.result;
  };
  if (file) reader.readAsDataURL(file);
});

// Đổi ảnh trực tiếp trong giao diện chỉnh sửa
uploadAgain.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;
      rotation = 0;
      brightness = 0;
      renderImage();
    };
    img.src = reader.result;
  };
  if (file) reader.readAsDataURL(file);
});

// Áp dụng thao tác chỉnh sửa
function applyEdit(type) {
  if (!originalImage) return;

  if (type === 'rotate') {
    rotation = (rotation + 90) % 360;
    renderImage();
  } else if (type === 'brighten') {
    brightness += 10;
    renderImage();
  } else if (type === 'darken') {
    brightness -= 10;
    renderImage();
  } else if (type === 'reset') {
    rotation = 0;
    brightness = 0;
    renderImage();
  } else if (type === 'sobelX' || type === 'sobelY') {
    applySobel(type);
  }
}

// Vẽ ảnh lên canvas (có xoay, scale, độ sáng)
function renderImage() {
  const radians = rotation * Math.PI / 180;
  const w = originalImage.width;
  const h = originalImage.height;

  const canvasMaxW = 600;
  const canvasMaxH = 500;

  const rotatedW = (rotation % 180 === 0) ? w : h;
  const rotatedH = (rotation % 180 === 0) ? h : w;

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

// Bộ lọc Sobel X và Y
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
  const kernelX = [
    -1, 0, 1,
    -2, 0, 2,
    -1, 0, 1
  ];
  const kernelY = [
    -1, -2, -1,
     0,  0,  0,
     1,  2,  1
  ];

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
    output.data[i * 4] = val;
    output.data[i * 4 + 1] = val;
    output.data[i * 4 + 2] = val;
    output.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(output, 0, 0);
}

// Quay lại trang chọn ảnh
function resetEditor() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('upload').value = '';
  hero.style.display = 'flex';
  editor.style.display = 'none';
}
