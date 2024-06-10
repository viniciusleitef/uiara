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
    dir_path = filePath
        # Adicione mais caminhos de arquivos conforme necessário
    prediction_list = []
    predicted_class_list = []

    # Carregar o modelo treinado
    model_path = 'trained_model/audio_classification_model.h5'
    model = load_model(model_path)


    for file_name in os.listdir(dir_path):
            if file_name.endswith('.wav'):
                filepath = os.path.join(dir_path, file_name)
            
                # Extrair características MFCC do arquivo de áudio
                features = extract_features(filepath)
                    
                # Reformular as características para corresponder ao formato de entrada esperado pelo modelo
                X = features.reshape(1, features.shape[0], 1)
                    
                # Fazer a previsão com o modelo carregado
                prediction = model.predict(X)
                    
                # Decodificar a classe prevista
                predicted_class = "Real" if prediction <= 0.5 else "Fake"

                # Adicionar os resultados às listas
                prediction_list.append(prediction)
                predicted_class_list.append(predicted_class)
                    
                # Imprimir o resultado
                print(f"Arquivo: {filepath}, Predicao: {prediction}, Classe predita: {predicted_class}")
    return prediction_list, predicted_class_list


