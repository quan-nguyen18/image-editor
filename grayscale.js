const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let original = null;

upload.addEventListener('change', e => {
  const file = e.target.files[0];
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    original = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };
  img.src = URL.createObjectURL(file);
});

function applyGrayscale() {
  if (!original) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    let gray = (data[i] + data[i+1] + data[i+2]) / 3;
    data[i] = data[i+1] = data[i+2] = gray;
  }
  ctx.putImageData(imgData, 0, 0);
}

function resetImage() {
  if (original) ctx.putImageData(original, 0, 0);
}
