const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let originalImage = null;

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };
  img.src = URL.createObjectURL(file);
});

function resetImage() {
  if (originalImage) {
    ctx.putImageData(originalImage, 0, 0);
  }
}

function applyGrayscale() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = avg;
  }
  ctx.putImageData(imgData, 0, 0);
}

function applySobelX() {
  alert("Sobel X not implemented yet.");
}

function applySobelY() {
  alert("Sobel Y not implemented yet.");
}

function rotateImage() {
  alert("Rotate not implemented yet.");
}

function cropImage() {
  alert("Crop not implemented yet.");
}
