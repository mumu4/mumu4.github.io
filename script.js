// Предположим, у вас есть элемент <input type="file" id="audioInput">
const inputElement = document.getElementById('audioInput');

inputElement.addEventListener('change', () => {
  const file = inputElement.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('audio', file);

  // Замените YOUR_PUBLIC_IP_OR_DNS:PORT на ваш публичный IP или DNS + порт
  const url = 'https://93gvmm-46-146-234-187.ru.tuna.am/predict';

  fetch(url, {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    alert('Результат: ' + data.prediction);
  })
  .catch(error => {
    console.error('Ошибка:', error);
    alert('Ошибка при отправке запроса');
  });
});