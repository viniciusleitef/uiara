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
def segmented_extract_features(filepath):
    caracteristics_number = 18
    y, sr = librosa.load(filepath, sr=None)
    starts = []
    length = tamanho_em_segundos(filepath)

    # se arquivo for maior que segment_duration, ele será fatiado
    if length > segment_duration:
      samples_per_segment = int(segment_duration * sr)
      start_sample = 0
      end_sample = samples_per_segment
      segment_features = []

      while end_sample <= len(y):
        segment = y[start_sample:end_sample]
        mfccs = librosa.feature.mfcc(y=segment, sr=sr, n_mfcc=caracteristics_number)
        mfccs_mean = np.mean(mfccs.T, axis=0)
        segment_features.append(mfccs_mean)
        start_sample = end_sample
        end_sample = start_sample + samples_per_segment
      return segment_features, length

    # se arquivo for menor que segment_duration, extração será feita como no método original
    else:
      mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=caracteristics_number)
      mfccs_mean = np.mean(mfccs.T, axis=0)
      return mfccs_mean, length

def analyzingAudio(filePath):
   # Carregar o modelo treinado
    model_path = '/content/drive/MyDrive/DetectAI/Modelos/v5.0.h5'
    model = load_model(model_path)

    # Extrair características MFCC do arquivo de áudio
    features, length = segmented_extract_features(filePath)

    if length>segment_duration:
        predictions = []

        for f in features:
            # Reformular as características para corresponder ao formato de entrada esperado pelo modelo
            X = f.reshape(1, f.shape[0], 1)
            prediction = model.predict(X)                                             # Fazer a previsão com o modelo carregado
            predicted_class = 0 if prediction <= 0.5 else 1                           # Decodificar a classe prevista
            if predicted_class == 1:
                predicted_class = 'Fake'
        predicted_class = 'Real'

    else:
          X = features.reshape(1, features.shape[0], 1)
          prediction = model.predict(X)                                               # Fazer a previsão com o modelo carregado
          predicted_class = "Real" if prediction <= 0.5 else "Fake"                   # Decodificar a classe prevista

    # Imprimir o resultado
    print(f"Predicao: {prediction}, Classe predita: {predicted_class}")
    return prediction[0][0], predicted_class