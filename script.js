<input type="file" id="audioFile" accept="audio/*">
<button id="predictBtn">Предсказать</button>
<div id="result"></div>

<script>
document.getElementById('predictBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('audioFile');
    const resultDiv = document.getElementById('result');

    if (fileInput.files.length === 0) {
        resultDiv.innerText = 'Пожалуйста, выберите аудиофайл.';
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    resultDiv.innerText = 'Обработка...';

    fetch('https://x6ktkg-46-146-234-187.ru.tuna.am/predict', { // замените URL, если нужно
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            resultDiv.innerText = 'Ошибка: ' + data.error;
        } else {
            resultDiv.innerText = 'Предсказание: ' + data.prediction;
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        resultDiv.innerText = 'Произошла ошибка при отправке запроса.';
    });
});
</script>