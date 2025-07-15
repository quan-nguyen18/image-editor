const upload = document.getElementById('upload');
const originalCanvas = document.getElementById('originalCanvas');
const editedCanvas = document.getElementById('editedCanvas');
const oCtx = originalCanvas.getContext('2d');
const eCtx = editedCanvas.getContext('2d');

let img = new Image();

upload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = event => {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

img.onload = () => {
  originalCanvas.width = img.width;
  originalCanvas.height = img.height;
  editedCanvas.width = img.width;
  editedCanvas.height = img.height;
  oCtx.drawImage(img, 0, 0);
  eCtx.drawImage(img, 0, 0);
};

function applyFilter(type) {
  let imageData = oCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
  let data = imageData.data;

  switch (type) {
    case 'rotate':
      eCtx.clearRect(0, 0, editedCanvas.width, editedCanvas.height);
      eCtx.save();
      eCtx.translate(editedCanvas.width / 2, editedCanvas.height / 2);
      eCtx.rotate(Math.PI / 2);
      eCtx.drawImage(originalCanvas, -originalCanvas.height / 2, -originalCanvas.width / 2);
      eCtx.restore();
      return;
    case 'brighten':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(data[i] + 30, 255);
        data[i + 1] = Math.min(data[i + 1] + 30, 255);
        data[i + 2] = Math.min(data[i + 2] + 30, 255);
      }
      break;
    case 'darken':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(data[i] - 30, 0);
        data[i + 1] = Math.max(data[i + 1] - 30, 0);
        data[i + 2] = Math.max(data[i + 2] - 30, 0);
      }
      break;
    case 'sobelX':
    case 'sobelY':
      applySobel(type);
      return;
  }

  eCtx.putImageData(imageData, 0, 0);
}

function applySobel(direction) {
  const width = originalCanvas.width;
  const height = originalCanvas.height;
  const gray = oCtx.getImageData(0, 0, width, height);
  const grayData = gray.data;

  const getGray = (x, y) => {
    const i = (y * width + x) * 4;
    return 0.3 * grayData[i] + 0.59 * grayData[i + 1] + 0.11 * grayData[i + 2];
  };

  const kernel = direction === 'sobelX'
    ? [ [-1, 0, 1], [-2, 0, 2], [-1, 0, 1] ]
    : [ [-1, -2, -1], [0, 0, 0], [1, 2, 1] ];

  const output = eCtx.createImageData(width, height);
  const outData = output.data;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          sum += kernel[ky + 1][kx + 1] * getGray(x + kx, y + ky);
        }
      }
      const index = (y * width + x) * 4;
      sum = Math.min(255, Math.max(0, Math.abs(sum)));
      outData[index] = outData[index + 1] = outData[index + 2] = sum;
      outData[index + 3] = 255;
    }
  }

  eCtx.putImageData(output, 0, 0);
}
