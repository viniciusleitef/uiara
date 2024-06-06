from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from models.models import Audio
from schemas.Audio import AudioSchema
from schemas.Process import ProcessSchema
import aiofiles

async def get_audio_db(db: Session):
    audios = db.query(Audio).all()
    return {"audios": audios}

async def create_audio_db(file: UploadFile, audio:AudioSchema, process_id:int, db: Session):
    if not file.filename.endswith(('.mp3', '.wav', '.ogg')):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    file_location = f"audios/{file.filename}"
    try:
        new_audio = Audio(
            process_id=process_id,
            title=audio.title,
            url=audio.url
            )
    
        db.add(new_audio)
        db.commit()

        #Chamar função para tratamento de audio
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        return {"filename": file.filename, "audio": new_audio}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
def update_audio_db(audio_id, classification:bool, accuracy:float, db:Session):
    updated_audio = db.query(Audio).filter(Audio.id == audio_id).first()
    if updated_audio:
        updated_audio.classification = classification
        updated_audio.accuracy = accuracy
        db.commit()
        db.refresh(updated_audio)
        return updated_audio
    return None
    