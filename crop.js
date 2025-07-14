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

function cropImage() {
  const cropW = canvas.width * 0.8;
  const cropH = canvas.height * 0.8;
  const cropX = (canvas.width - cropW) / 2;
  const cropY = (canvas.height - cropH) / 2;

  const cropped = ctx.getImageData(cropX, cropY, cropW, cropH);
  canvas.width = cropW;
  canvas.height = cropH;
  ctx.putImageData(cropped, 0, 0);
}

function resetImage() {
  if (original) ctx.putImageData(original, 0, 0);
}
