from fastapi import UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from models.models import Audio
from pydub import AudioSegment
from datetime import datetime
from typing import List
import noisereduce as nr
import numpy as np
import aiofiles
import librosa
import io
import os
import controller.processController as processController

from controller.services import get_process_by_numprocess_db, get_audio_by_url_db, get_audio_by_id_db, update_process_status, update_process_date_db, get_process_by_process_id
from controller.trainedModelsController import get_active_model

from trained_model.executaModelo import analyzingAudio

from config import BASE_FILE_PATH

def get_audios_db(db: Session):
    audios = db.query(Audio).all()
    return {"audios": audios}

def get_audios_by_process_id_db(process_id:int, db:Session):
    audios = db.query(Audio).filter(Audio.process_id == process_id).all()
    audioList = []

    # Retornando audios sem "url"
    for audio in audios:
        audioList.append({
            "id": audio.id,
            "process_id": audio.process_id,
            "trained_model_id": audio.trained_model_id,
            "title": audio.title,
            "classification": audio.classification,
            "accuracy": audio.accuracy,
            "audio_duration": audio.audio_duration,
            "sample_rate": audio.sample_rate,
            "snr": audio.snr,
            "specialist_analysis": audio.specialist_analysis,
            "created_at": audio.created_at,
            "updated_at": audio.updated_at,
        })
    return audioList

async def get_audioFile(audio_id: int, db: Session):
    audio = get_audio_by_id_db(audio_id, db)
    filePath = audio.url

    # Verifica se o arquivo existe
    if not os.path.exists(filePath):
        raise HTTPException(status_code=404, detail="Arquivo de áudio não encontrado")

    # Função geradora para fazer o streaming do arquivo
    def iterfile():
        with open(filePath, mode="rb") as file_like:
            yield from file_like

    file_size = os.path.getsize(filePath)
    headers = {
        "Content-Disposition": f"inline; filename={os.path.basename(filePath)}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(file_size),
        "Cache-Control": "no-cache"
    }

    # Retorna o StreamingResponse com os cabeçalhos necessários
    return StreamingResponse(iterfile(), media_type="audio/wav", headers=headers)

async def create_audio_db(num_process:str, db: Session, files: List[UploadFile], user_id):

    ai_model = get_active_model(db)
    process = get_process_by_numprocess_db(num_process, db, user_id)
    errors = []
    audiosRegistered = []

    for i, file in enumerate(files):
        fileLocation = f"{BASE_FILE_PATH}/Process_{process.id}/{file.filename}"
        audio = get_audio_by_url_db(fileLocation, db)

        if audio and audio.url == fileLocation:
            errors.append({
                "file": file.filename,
                "error": "Áudio ja esta cadastrado nesse processo",
                "status_code": 409
            })
            continue    
        
        file = await detect_audio_format(file)
        await create_audio_file(file, fileLocation)
        audio_duration = await get_audio_duration(file)
        sample_rate = await get_sample_rate(file)
        snr = await calculate_snr(fileLocation)

        new_audio = Audio(
            process_id=process.id,
            trained_model_id = ai_model.id,
            title=file.filename,
            url=fileLocation,
            audio_duration=audio_duration,
            sample_rate=sample_rate,
            snr = snr,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        db.add(new_audio)
        db.commit()
        db.refresh(new_audio)

        prediction, predicted_class = await analyzingAudio(fileLocation, ai_model.file_path)
        update_audio_db(fileLocation, prediction, predicted_class, db)
        update_process_status(process, db)

        audiosRegistered.append({
            "id": new_audio.id,
            "process_id": new_audio.process_id,
            "trained_model_id": new_audio.trained_model_id,
            "title": new_audio.title,
            "classification": new_audio.classification,
            "accuracy": new_audio.accuracy,
            "audio_duration": new_audio.audio_duration,
            "sample_rate": new_audio.sample_rate,
            "snr": new_audio.snr,
            "created_at": new_audio.created_at,
            "updated_at": new_audio.updated_at
            })

    if not audiosRegistered:
        await processController.delete_process_by_numprocess(num_process, BASE_FILE_PATH, db, user_id)
    
    return {
        "audiosRegisteres": audiosRegistered,
        "errors": errors
    }
    
def update_audio_db(audioFilePath:str, prediction:float, predicted_class:bool, db:Session):
    predicted_class = convert_to_bool(predicted_class)
    prediction = convert_acuracy(prediction)
    updated_audio = get_audio_by_url_db(audioFilePath, db)
    if updated_audio:
        updated_audio.classification = predicted_class
        updated_audio.accuracy = prediction
        db.commit()
        db.refresh(updated_audio)
        return updated_audio
    return None

def update_audio_title_db(audio_id, new_title, db):
    audio = get_audio_by_id_db(audio_id, db)
    if audio:
        audio.title = new_title
        db.commit()
        db.refresh(audio)
        update_process_date_db(audio.process_id, db)
        return {"message": f"Audio ID: {audio_id} teve o title trocado para: {new_title}"}
    raise HTTPException(status_code=404, detail=f"Audio ID {audio_id} não encontrado")

def update_specialist_analysis_db(audio_id:int, analysis:str, db:Session):
    audio = db.query(Audio).filter(Audio.id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Áudio não encontrado")
    
    audio.specialist_analysis = analysis
    db.commit()
    db.refresh(audio)

    return {"message": "Análise de especialista atualizada com sucesso", "audio": audio}

def convert_to_bool(predicted_class:bool):
    if predicted_class.lower() == 'fake':
        return False
    return True
def convert_acuracy(acuracy:float):
    if acuracy > 0.5:
        return round(acuracy * 100, 2)
    if acuracy < 0.5:
        return round((1 - acuracy) * 100, 2)
    return 50.00

# Cria um arquivo de audio no diretorio "Process_x" de acordo com process_id
async def create_audio_file(file:UploadFile, file_location:str):
    try:
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        return file_location    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
async def get_audio_duration(audio_file: UploadFile):
    try:
        # Resetting the file pointer to the beginning
        audio_file.file.seek(0)
        
        audio_buffer = io.BytesIO(audio_file.file.read())
        print("Audio buffer size:", len(audio_buffer.getvalue()))  # Debugging
        
        # Ensure that the file pointer is reset after reading
        audio_buffer.seek(0)
        
        # Attempt to read the audio file
        audio = AudioSegment.from_file(audio_buffer, format="wav")
        print("Audio segment created")  # Debugging
        
        duration_in_seconds = len(audio) / 1000.0
        
        # Log the success
        print("Successfully decoded audio, duration:", duration_in_seconds)
        
    except Exception as e:
        print(f"Error processing audio file: {str(e)}")  # Debugging
        raise HTTPException(status_code=400, detail=f"Invalid audio file: {str(e)}")
    
    return duration_in_seconds

async def get_sample_rate(file: UploadFile):
    # Converta o UploadFile para bytes e carregue o arquivo de áudio
    audio = AudioSegment.from_file(file.file, format="wav")
    # Pegue a taxa de amostragem
    sample_rate = audio.frame_rate
    return sample_rate

async def calculate_snr(file_path: str):
    # Função para calcular a potência do sinal
    def signal_power(signal):
        return np.mean(signal ** 2)

    # Função para calcular o SNR
    def calculate_snr(signal, noise):
        pow_signal = signal_power(signal)
        pow_noise = signal_power(noise)
        return 10 * np.log10(pow_signal / pow_noise)

    # Carregar o áudio
    signal, sr = librosa.load(file_path, sr=None)

    # Estimar o ruído usando noisereduce
    noise_estimation = nr.reduce_noise(y=signal, sr=sr)

    # Calcular a SNR
    snr = calculate_snr(signal, noise_estimation)
    snr_rounded = round(snr, 2)
    return snr_rounded

def delete_audio(audio_id, db):
    audio = db.query(Audio).filter(Audio.id == audio_id).first()
    if audio:
        delete_audio_db(audio, db)
        delete_audio_file(audio)

        #Atualizando processo referente ao audio
        update_process_date_db(audio.process_id, db)
        process = get_process_by_process_id(audio.process_id, db)
        update_process_status(process, db)
        
        return {'message': f'Áudio ID {audio.id} deletado com sucesso'}
    raise HTTPException(status_code=404, detail=f"Arquivo {audio_id} não existe ou já foi deletado")

def delete_audio_db(audio, db):
    db.delete(audio)
    db.commit()

def delete_audio_file(audio):   
    file_path = audio.url
    try:
        if os.path.exists(file_path):
            os.remove(file_path)  
            print(f"Arquivo '{file_path}' excluído com sucesso!")
        else:
            print(f"Arquivo '{file_path}' não encontrado.")
    except Exception as e:
        print(f"Ocorreu um erro ao excluir o arquivo: {e}")
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro ao excluir o arquivo: {str(e)}")
    
    
def delete_audios_db(process_id:int, db:Session):
    try:
        audios = db.query(Audio).filter(Audio.process_id == process_id).all()
        for audio in audios:
            db.delete(audio)
        db.commit()
        print(f"Áudios do processo '{process_id}' excluídos com sucesso!")
    except Exception as e:
        print(f"Ocorreu um erro ao excluir os áudios: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while deleting the audios: {str(e)}")
    
#Funções para detecção e conversão de arquivos de áudio
#Detecção to tipo de arquivo
async def detect_audio_format(upload_file: UploadFile):
    SUPPORTED_FORMATS = ['wav','mp3','ogg']
    file_extension = upload_file.filename.split('.')[-1].lower()

    if file_extension not in SUPPORTED_FORMATS:
        raise HTTPException(status_code=400, detail=f"Formato de arquivo '{file_extension}' não é suportado.")

    try:
        if file_extension == 'wav':
            return upload_file
        elif file_extension == 'mp3':
            return await convert_mp3_to_wav(upload_file)
        elif file_extension == 'ogg':
            return await convert_ogg_to_wav(upload_file)
    except:
        raise HTTPException(status_code=415, detail="Não foi possível proecessar o arquivo de áudio. O formato pode estar corrompido ou não é suportado.")
    
#Conversão modularizada de .mp3 para .wav
async def convert_mp3_to_wav(upload_file: UploadFile):
    try:
        upload_file.file.seek(0)

        audio_bytes = await upload_file.read()
        audio_stream = io.BytesIO(audio_bytes)

        audio = AudioSegment.from_file(audio_stream, format="mp3")
        
        output_io = io.BytesIO()
        audio.export(output_io, format="wav")
        output_io.seek(0)

        converted_file = UploadFile(
            filename=upload_file.filename.replace(".mp3", ".wav"),
            file=output_io
        )
        return converted_file
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na conversão de MP3 para WAV: {str(e)}")
    

#Conversão modularizada de .ogg para .wav
async def convert_ogg_to_wav(upload_file: UploadFile):
    try:
        upload_file.file.seek(0)

        audio_bytes = await upload_file.read()
        audio_stream = io.BytesIO(audio_bytes)

        audio = AudioSegment.from_file(audio_stream, format="ogg")

        output_io = io.BytesIO()
        audio.export(output_io, format="wav")
        output_io.seek(0)

        converted_file = UploadFile(
            filename=upload_file.filename.replace(".mp3", ".wav"),
            file=output_io
        )
        return converted_file
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na conversão de OGG para WAV: {str(e)}")