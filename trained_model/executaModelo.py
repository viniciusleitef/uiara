import os
import numpy as np
import librosa
from tensorflow.keras.models import load_model

# Função para extrair características MFCC de um arquivo de áudio
def extract_features(filepath):
    y, sr = librosa.load(filepath, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    return mfccs_mean

async def analyzingAudio(filePath):
   # Carregar o modelo treinado
    model_path = 'trained_model/audio_classification_model.h5'
    model = load_model(model_path)

    # Extrair características MFCC do arquivo de áudio
    features = extract_features(filePath)
    
    # Reformular as características para corresponder ao formato de entrada esperado pelo modelo
    X = features.reshape(1, features.shape[0], 1)
    
    # Fazer a previsão com o modelo carregado
    prediction = model.predict(X)
    
    # Decodificar a classe prevista
    predicted_class = "Real" if prediction <= 0.5 else "Fake"
    
    # Imprimir o resultado
    print(f"Arquivo: {filePath}, Predicao: {prediction}, Classe predita: {predicted_class}")
    return prediction[0][0], predicted_class