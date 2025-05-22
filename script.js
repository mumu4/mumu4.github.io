let model = null;
let scaler = null;

// Функция для загрузки модели и scaler
async function loadModelAndScaler() {
  const response = await fetch('model.json');
  const data = await response.json();

  // Декодируем base64 в байты
  const modelBytes = atob(data.model);
  const scalerBytes = atob(data.scaler);

  // Преобразуем байты в ArrayBuffer
  const modelBuffer = new ArrayBuffer(modelBytes.length);
  const scalerBuffer = new ArrayBuffer(scalerBytes.length);

  // Заполняем буферы
  const modelView = new Uint8Array(modelBuffer);
  for (let i = 0; i < modelBytes.length; i++) {
    modelView[i] = modelBytes.charCodeAt(i);
  }

  const scalerView = new Uint8Array(scalerBuffer);
  for (let i = 0; i < scalerBytes.length; i++) {
    scalerView[i] = scalerBytes.charCodeAt(i);
  }

  // Восстановить объекты из байтов с помощью pickle или другого метода —
  // В браузере это сложно, поэтому лучше подготовить модель как TensorFlow.js модель или использовать API.
}

document.getElementById('predictBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('audioFile');
  const resultDiv = document.getElementById('result');

  if (!fileInput.files[0]) {
    alert('Пожалуйста, выберите аудиофайл');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  fetch('https://mumu4.github.io', {
    // замените на ваш URL сервера при деплое
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      resultDiv.innerHTML = 'Результат: ' + data.result; // например "человек" или "робот"
    })
    .catch(error => {
      console.error('Ошибка:', error);
      resultDiv.innerHTML = 'Ошибка при предсказании.';
    });
});
