from flask import Flask, request, jsonify
import numpy as np
import librosa
import pickle
import base64
import json

app = Flask(__name__)


# Загрузка модели и scaler из JSON файла
def load_model():
    with open('model.json') as f:
        data = json.load(f)
    model_bytes = base64.b64decode(data['model'])
    scaler_bytes = base64.b64decode(data['scaler'])
    model = pickle.loads(model_bytes)
    scaler = pickle.loads(scaler_bytes)
    return model, scaler


model, scaler = load_model()


def extract_features(audio_path):
    y, sr = librosa.load(audio_path, sr=None)
    # Вычисляем MFCC или другие признаки
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    return mfccs_mean


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    # Сохраняем временно файл
    filename = 'temp_audio.wav'
    file.save(filename)

    # Извлекаем признаки
    features = extract_features(filename)

    # Масштабируем признаки
    features_scaled = scaler.transform([features])

    # Предсказываем
    prediction = model.predict(features_scaled)[0]

    # Удаляем временный файл (по желанию)

    return jsonify({'result': prediction})


if __name__ == '__main__':
    app.run()