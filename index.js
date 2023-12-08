const canvas = new fabric.Canvas('canvas');

function setCanvasSize(width, height) {
  canvas.setWidth(width);
  canvas.setHeight(height);
}

document.getElementById('canvasSize').addEventListener('change', function (e) {
  const selectedSize = e.target.value.split('x');
  const width = parseInt(selectedSize[0]);
  const height = parseInt(selectedSize[1]);

  setCanvasSize(width, height);
});

let layerIndex = 0; // Variável para controlar as camadas das imagens

document.getElementById('imageLoader').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imgObj = new Image();
    imgObj.src = event.target.result;

    imgObj.onload = function () {
      const fabricImage = new fabric.Image(imgObj);
      fabricImage.scale(0.5);
      fabricImage.set({
        layer: layerIndex++ // Define a camada da imagem
      });
      canvas.add(fabricImage);
    };
  };

  reader.readAsDataURL(file);
});

canvas.on('mouse:dblclick', function (event) {
  const activeObject = event.target;
  if (activeObject && activeObject.type === 'image') {
    activeObject.moveTo(++layerIndex); // Move a imagem para a camada mais alta
    canvas.renderAll();
  }
});

// Evento para remover imagem ao pressionar a tecla "Delete"
document.addEventListener('keydown', function (event) {
  const key = event.key || event.keyCode;
  if (key === 'Delete' || key === 46) {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  }
});

document.getElementById('downloadBtn').addEventListener('click', function () {
  const selectedSize = document.getElementById('canvasSize').value.split('x');
  const width = parseInt(selectedSize[0]);
  const height = parseInt(selectedSize[1]);

  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.backgroundColor = 'white';

  const link = document.createElement('a');
  link.href = canvas.toDataURL({
    format: 'png',
    multiplier: 1
  });
  link.download = 'imagem_canvas.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  canvas.backgroundColor = '';
  canvas.setWidth(originalWidth);
  canvas.setHeight(originalHeight);
});