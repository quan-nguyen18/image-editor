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

function rotateImage() {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.height;
  tempCanvas.height = canvas.width;

  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate(Math.PI / 2);
  tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.drawImage(tempCanvas, 0, 0);
  original = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function resetImage() {
  if (original) ctx.putImageData(original, 0, 0);
}
