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

function applySobelX() {
  if (!original) return;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const dst = new Uint8ClampedArray(src.length);

  const kernel = [
    -1, 0, 1,
    -2, 0, 2,
    -1, 0, 1
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = ((y + ky) * width + (x + kx)) * 4;
          const gray = (src[px] + src[px + 1] + src[px + 2]) / 3;
          const weight = kernel[(ky + 1) * 3 + (kx + 1)];
          gx += gray * weight;
        }
      }
      const out = Math.min(255, Math.max(0, Math.abs(gx)));
      const dstIndex = (y * width + x) * 4;
      dst[dstIndex] = dst[dstIndex + 1] = dst[dstIndex + 2] = out;
      dst[dstIndex + 3] = 255;
    }
  }

  const output = new ImageData(dst, width, height);
  ctx.putImageData(output, 0, 0);
}

function resetImage() {
  if (original) ctx.putImageData(original, 0, 0);
}
