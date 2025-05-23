document.addEventListener('DOMContentLoaded', () => {
    const audioFileInput = document.getElementById('audioFile');
    const predictBtn = document.getElementById('predictBtn');
    const resultDiv = document.getElementById('result');
    
    // URL вашего сервера через localtunnel/ngrok (замените на ваш)
    const SERVER_URL = 'https://late-monkeys-cut.loca.lt/predict';
    
    predictBtn.addEventListener('click', async () => {
        if (!audioFileInput.files.length) {
            showResult('Пожалуйста, выберите аудиофайл', 'error');
            return;
        }
        
        const audioFile = audioFileInput.files[0];
        
        try {
            showResult('Анализируем аудио...', 'processing');
            
            // Создаем FormData и добавляем файл
            const formData = new FormData();
            formData.append('audio', audioFile);
            
            // Отправляем на сервер
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Форматируем результат
            let resultHTML = `
                <div class="result-box">
                    <h2>Результат:</h2>
                    <p class="prediction">Это <strong>${data.prediction === 'human' ? 'человек' : 'робот'}</strong></p>
                    <p class="confidence">Уверенность: ${(data.confidence * 100).toFixed(2)}%</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.confidence * 100}%"></div>
                    </div>
                    <details>
                        <summary>Подробности</summary>
                        <p>Вероятность человека: ${(data.probabilities.human * 100).toFixed(2)}%</p>
                        <p>Вероятность робота: ${(data.probabilities.robot * 100).toFixed(2)}%</p>
                    </details>
                </div>
            `;
            
            showResult(resultHTML, 'success');
            
        } catch (error) {
            console.error('Ошибка:', error);
            showResult(`Произошла ошибка: ${error.message}`, 'error');
        }
    });
    
    function showResult(message, type) {
        resultDiv.innerHTML = typeof message === 'string' ? message : message;
        resultDiv.className = type;
        
        // Автоматически скрыть сообщение об ошибке через 5 сек
        if (type === 'error') {
            setTimeout(() => {
                if (resultDiv.className === 'error') {
                    resultDiv.textContent = '';
                    resultDiv.className = '';
                }
            }, 5000);
        }
    }
});