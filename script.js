let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let originalImageData = null;
let currentImage = new Image();

document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    currentImage = new Image();
    currentImage.onload = function () {
      canvas.width = currentImage.width;
      canvas.height = currentImage.height;
      ctx.drawImage(currentImage, 0, 0);
      originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    currentImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});
