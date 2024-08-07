import os
import numpy as np
import librosa
import wave
from tensorflow.keras.models import load_model

# Função que calcula tamanho do arquivo
def tamanho_em_segundos(caminho_arquivo):
    try:
        arquivo_wav = wave.open(caminho_arquivo, 'rb')
        num_frames = arquivo_wav.getnframes()                                   # obtém o número de frames (amostras)
        taxa_amostragem = arquivo_wav.getframerate()                            # obtém a taxa de amostragem (frames por segundo)
        tamanho_segundos = num_frames / taxa_amostragem
        arquivo_wav.close()
        return tamanho_segundos

    except Exception as e:
        print(f"Erro ao abrir o arquivo WAV: {e}")
        return None

# Função para extrair características MFCC de um arquivo de áudio
def extract_features(filepath):
    caracteristics_number = 18
    y, sr = librosa.load(filepath, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=caracteristics_number)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    return mfccs_mean

async def analyzingAudio(filePath):
   # Carregar o modelo treinado
    model_path = 'trained_model/audio_classification_model_5.0.h5'
    model = load_model(model_path)

    # Extrair características MFCC do arquivo de áudio
    features = extract_features(filePath)
    X = features.reshape(1, features.shape[0], 1)
    prediction = model.predict(X)                                               # Fazer a previsão com o modelo carregado
    predicted_class = "Real" if prediction <= 0.5 else "Fake"                   # Decodificar a classe prevista

    # Imprimir o resultado
    print(f"Predicao: {prediction}, Classe predita: {predicted_class}")
    return prediction[0][0], predicted_class