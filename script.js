// Получаем элементы
const predictBtn = document.getElementById('predictBtn');
const inputFile = document.getElementById('audioFile');
const resultDiv = document.getElementById('result');

// Обработчик клика по кнопке
predictBtn.addEventListener('click', () => {
    // Проверка выбран ли файл
    if (inputFile.files.length === 0) {
        alert('Пожалуйста, выберите аудиофайл.');
        return;
    }

    const file = inputFile.files[0];

    // Создаем FormData и добавляем файл
    const formData = new FormData();
    formData.append('audio', file);

    // Визуальный отклик: показываем сообщение и отключаем кнопку
    resultDiv.textContent = 'Обработка файла, пожалуйста, подождите...';
    predictBtn.disabled = true;
    predictBtn.textContent = 'Обрабатывается...';

    // Отправляем запрос на сервер
    fetch('https://breezy-comics-deny.loca.lt/process_audio', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Восстанавливаем кнопку и выводим результат
        predictBtn.disabled = false;
        predictBtn.textContent = 'Определить';

        if (data.prediction) {
            resultDiv.innerHTML = `<strong>Предсказание:</strong> ${data.prediction}`;
        } else if (data.error) {
            resultDiv.innerHTML = `<span style="color:red;">Ошибка: ${data.error}</span>`;
        } else {
            resultDiv.textContent = 'Неизвестная ошибка.';
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        predictBtn.disabled = false;
        predictBtn.textContent = 'Определить';
        resultDiv.innerHTML = `<span style="color:red;">Произошла ошибка при отправке запроса.</span>`;
    });
});