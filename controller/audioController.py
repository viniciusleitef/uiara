from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from models.models import Audio
from schemas.Audio import AudioSchema
import aiofiles

async def get_audio_db(db: Session):
    audios = db.query(Audio).all()
    return {"audios": audios}

async def create_audio_db(file: UploadFile, audio:AudioSchema, db: Session):
    if not file.filename.endswith(('.mp3', '.wav', '.ogg')):
        raise HTTPException(status_code=400, detail="Invalid file type")
    if db.query(Audio).filter(Audio.process_number == audio.process_number).first():
        raise HTTPException(status_code=400, detail="Process number already exists")
    
    file_location = f"audios/{file.filename}"
    try:

        new_audio = Audio(
            filename=audio.filename,
            date_time=audio.date_time,
            process_number=audio.process_number,
            politician=audio.politician
            )
        db.add(new_audio)
        db.commit()

        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        return {"filename": file.filename, "audio": new_audio}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    