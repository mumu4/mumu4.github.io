const serverUrl = 'https://pink-results-shake.loca.lt'; // замените на ваш реальный URL

document.getElementById('predictBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('audioFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Пожалуйста, выберите файл');
        return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    fetch(`${serverUrl}/process_audio`, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = data.message || JSON.stringify(data);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке запроса.');
    });
});