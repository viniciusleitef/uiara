from fastapi import UploadFile, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from models.models import Audio
from schemas.Audio import AudioSchema
from pydub import AudioSegment
from io import BytesIO
import numpy as np
import io
import os
import aiofiles

def get_audios_db(db: Session):
    audios = db.query(Audio).all()
    return {"audios": audios}

def get_audio_by_id_db(audio_id:int, db:Session):
    return db.query(Audio).filter(Audio.id == audio_id).first()

def get_audios_by_process_id_bd(process_id:int, db:Session):
    audios = db.query(Audio).filter(Audio.process_id == process_id).all()
    audioList = []

    # Retornando audios sem "url"
    for audio in audios:
        audioList.append({
            "id": audio.id,
            "title": audio.title,
            "classification": audio.classification,
            "accuracy": audio.accuracy,
            "audio_duration": audio.audio_duration,
            "sample_rate": audio.sample_rate
        })
    return audioList


def get_audio_by_url_bd(url:str, db:Session):
    return db.query(Audio).filter(Audio.url == url).first()

async def get_audioFile(audio_id: int, db:Session):
    audio = get_audio_by_id_db(audio_id, db)
    filePath = audio.url
    return FileResponse(path=filePath, media_type='audio/wav', filename=os.path.basename(filePath))

async def create_audio_db(file: UploadFile, audio:AudioSchema, process_id:int, filePath:str, audioFilePath:str, db: Session):
 
    create_process_dir(process_id, filePath)
    await create_audio_file(file, process_id, filePath)
    audio_duration = await get_audio_duration(file)
    sample_rate = await get_sample_rate(file)

    new_audio = Audio(
        process_id=process_id,
        title=audio.title,
        url=audioFilePath,
        audio_duration=audio_duration,
        sample_rate=sample_rate
        )
    
    db.add(new_audio)
    db.commit()
    
    return new_audio
    
def update_audio_db(audioFilePath:str, prediction:float, predicted_class:bool, db:Session):
    predicted_class = convert_to_bool(predicted_class)
    prediction = convert_acuracy(prediction)
    updated_audio = get_audio_by_url_bd(audioFilePath, db)
    if updated_audio:
        updated_audio.classification = predicted_class
        updated_audio.accuracy = prediction
        db.commit()
        db.refresh(updated_audio)
        return updated_audio
    return None

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

#MOVER create_process_dir() PARA processController.py
# Cria um diretorio "Process_x" na pasta "audios" de acordo com o process_id
def create_process_dir(process_id:int, filePath:str):
    pasta_process = f"{filePath}/Process_{process_id}"
    try:
        os.makedirs(pasta_process, exist_ok=True)
        print(f"Pasta '{pasta_process}' criada com sucesso!")
    except Exception as e:
        print(f"Ocorreu um erro ao criar a pasta: {e}")

# Cria um arquivo de audio no diretorio "Process_x" de acordo com process_id
async def create_audio_file(file:UploadFile, process_id:int, filePath:str):
    file_location = f"{filePath}/Process_{process_id}/{file.filename}"
    try:
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
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

async def get_sample_rate(file: UploadFile) -> int:
    # Converta o UploadFile para bytes e carregue o arquivo de áudio
    audio = AudioSegment.from_file(file.file, format="wav")
    # Pegue a taxa de amostragem
    sample_rate = audio.frame_rate
    return sample_rate

def delete_audios_bd(process_id:int, db:Session):
    try:
        audios = db.query(Audio).filter(Audio.process_id == process_id).all()
        for audio in audios:
            db.delete(audio)
        db.commit()
        print(f"Áudios do processo '{process_id}' excluídos com sucesso!")
    except Exception as e:
        print(f"Ocorreu um erro ao excluir os áudios: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while deleting the audios: {str(e)}")