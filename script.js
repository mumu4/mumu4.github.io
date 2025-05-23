document.getElementById('sendBtn').addEventListener('click', () => {
    const input = document.getElementById('audioFile');
    const resultPara = document.getElementById('result'); // элемент для отображения результата

    if (input.files.length === 0) {
        alert('Пожалуйста, выберите аудиофайл.');
        return;
    }

    const file = input.files[0];

    // Создаем FormData и добавляем файл
    const formData = new FormData();
    formData.append('audio', file);

    // Отправляем POST-запрос на сервер
    fetch('https://breezy-comics-deny.loca.lt/process_audio', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.prediction) {
            resultPara.textContent = 'Предсказание: ' + data.prediction;
        } else if (data.error) {
            resultPara.textContent = 'Ошибка: ' + data.error;
        } else {
            resultPara.textContent = 'Неизвестная ошибка.';
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        resultPara.textContent = 'Произошла ошибка при отправке запроса.';
    });
});