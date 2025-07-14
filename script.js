let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let originalImage = null;

document.getElementById("file-input").addEventListener("change", (e) => {
  let file = e.target.files[0];
  let img = new Image();
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
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    let avg = (data[i] + data[i+1] + data[i+2]) / 3;
    data[i] = data[i+1] = data[i+2] = avg;
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
