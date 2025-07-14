const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const download = document.getElementById('download');

upload.addEventListener('change', e => {
  const file = e.target.files[0];
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = URL.createObjectURL(file);
});

function compressImage() {
  const dataURL = canvas.toDataURL('image/jpeg', 0.4); // 40% quality
  download.href = dataURL;
  download.style.display = 'inline-block';
  download.textContent = 'Tải ảnh nén';
}
