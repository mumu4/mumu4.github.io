const SERVER_URL = 'https://afraid-kids-speak.loca.lt/predict';

async function sendAudioToServer(file) {
    const formData = new FormData();
    formData.append('audio', file, 'recording.wav');  // Явное указание имени файла
    
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'  // Важно для некоторых прокси
            },
            credentials: 'omit'  // Не отправлять куки
        });
        
        if (response.status === 511) {
            throw new Error('Требуется авторизация в сети. Проверьте подключение к интернету');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
}

// Обработчик кнопки "Определить"
predictBtn.addEventListener('click', async () => {
    if (!audioFileInput.files.length) {
        showResult('Пожалуйста, выберите аудиофайл', 'error');
        return;
    }

    showResult('Анализируем аудио...', 'processing');
    
    try {
        const result = await sendAudioToServer(audioFileInput.files[0]);
        displayResults(result);
    } catch (error) {
        showResult(`Ошибка: ${error.message}`, 'error');
    }
});