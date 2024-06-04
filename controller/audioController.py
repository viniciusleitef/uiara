from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from models.models import Audio
import aiofiles

async def get_audio_db(db: Session):
    audios = db.query(Audio).all()
    return {"audios": audios}

async def create_audio_db(file: UploadFile, db: Session):
    if not file.filename.endswith(('.mp3', '.wav', '.ogg')):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    file_location = f"audios/{file.filename}"
    try:

        audio = Audio(
            filename=file.filename,
            date_time=file.date_time,
            process_number=file.process_number,
            politician=file.politician
            )
        db.add(audio)
        db.commit()

        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        return {"filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
