// URL вашего локального сервера Flask (замените при необходимости)
const SERVER_URL = 'https://x6ktkg-46-146-234-187.ru.tuna.am/predict';

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('audioFile');
  const submitBtn = document.getElementById('submitBtn');
  const resultDiv = document.getElementById('result');

  submitBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Пожалуйста, выберите аудиофайл.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    fetch(SERVER_URL, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.prediction) {
          resultDiv.innerHTML = `Предсказание: <strong>${data.prediction}</strong>`;
        } else if (data.error) {
          resultDiv.innerHTML = `Ошибка: ${data.error}`;
        }
      })
      .catch(error => {
        resultDiv.innerHTML = `Ошибка при отправке запроса: ${error}`;
      });
  });
});