document.addEventListener('DOMContentLoaded', () => {
    const audioFileInput = document.getElementById('audioFile');
    const predictBtn = document.getElementById('predictBtn');
    const resultDiv = document.getElementById('result');
    
    // Убедитесь, что URL заканчивается на /predict и использует HTTPS
    const SERVER_URL = 'https://full-teams-behave.loca.lt/predict';
    
    predictBtn.addEventListener('click', async () => {
        if (!audioFileInput.files.length) {
            showResult('Пожалуйста, выберите аудиофайл', 'error');
            return;
        }
        
        try {
            showResult('Анализируем аудио...', 'processing');
            
            // Специальная обработка для Opera GX
            const file = audioFileInput.files[0];
            const renamedFile = new File([file], 'audio_record.wav', {
                type: file.type,
                lastModified: file.lastModified
            });
            
            const formData = new FormData();
            formData.append('audio', renamedFile);
            
            // Добавляем заголовки для CORS
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            displayResults(data);
            
        } catch (error) {
            console.error('Fetch error:', error);
            showResult(`Ошибка: ${error.message}`, 'error');
        }
    });
    
    function displayResults(data) {
        const isHuman = data.prediction === 'human';
        resultDiv.innerHTML = `
            <div class="result-card ${isHuman ? 'human' : 'robot'}">
                <h2>Результат анализа:</h2>
                <p class="verdict">${isHuman ? '👤 Человек' : '🤖 Робот'}</p>
                <div class="confidence">
                    <span>Уверенность:</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${data.confidence * 100}%"></div>
                    </div>
                    <span>${(data.confidence * 100).toFixed(1)}%</span>
                </div>
                <button id="detailsBtn">Подробнее</button>
                <div class="details" id="detailsPanel">
                    <p>Вероятность человека: ${(data.probabilities.human * 100).toFixed(1)}%</p>
                    <p>Вероятность робота: ${(data.probabilities.robot * 100).toFixed(1)}%</p>
                </div>
            </div>
        `;
        
        // Обработка кнопки подробностей
        document.getElementById('detailsBtn')?.addEventListener('click', () => {
            const panel = document.getElementById('detailsPanel');
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    function showResult(message, type) {
        resultDiv.innerHTML = message;
        resultDiv.className = `result-${type}`;
    }
});