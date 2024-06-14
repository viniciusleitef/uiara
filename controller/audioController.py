from fastapi import UploadFile, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from models.models import Audio
from schemas.Audio import AudioSchema
from schemas.Process import ProcessSchema
import aiofiles
import os

def get_audios_db(db: Session):
    audios = db.query(Audio).all()
    return {"audios": audios}

def get_audio_by_id_db(audio_id:int, db:Session):
    return db.query(Audio).filter(Audio.id == audio_id).first()

def get_audios_by_process_id_bd(process_id:int, db:Session):
    return db.query(Audio).filter(Audio.process_id == process_id).all()


def get_audio_by_url_bd(url:str, db:Session):
    return db.query(Audio).filter(Audio.url == url).first()

async def get_audioFile(audio_id: int, db:Session):
    audio = get_audio_by_id_db(audio_id, db)
    filePath = audio.url
    return FileResponse(path=filePath, media_type='audio/wav', filename=os.path.basename(filePath))

async def create_audio_db(file: UploadFile, audio:AudioSchema, process_id:int, filePath:str, audioFilePath:str, db: Session):
 
    create_process_dir(process_id, filePath)
    await create_audio_file(file, process_id, filePath)

    # Cria um novo registro no banco de dados com os dados do arquivo de áudio
    new_audio = Audio(
        process_id=process_id,
        title=audio.title,
        url=audioFilePath
        )
    
    db.add(new_audio)
    db.commit()
    
    return new_audio
    
def update_audio_db(audioFilePath:str, prediction:float, predicted_class:bool, db:Session):
    predicted_class = convert_to_bool(predicted_class)
    prediction = float(prediction)
    print(prediction, predicted_class)
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