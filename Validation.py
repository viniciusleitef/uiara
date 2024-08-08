from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from controller.services import get_process_by_numprocess_db, get_audio_by_url_db, get_audio_by_id_db, get_user_by_email_db, get_user_by_id_db

class Validation():
    
    def has_url(url:str, db:Session):
        audio = get_audio_by_url_db(url, db)
        if audio:
            raise HTTPException(status_code=400, detail="Url already exists")

    def has_audiofile(audio_id:int, db:Session):
        audio = get_audio_by_id_db(audio_id, db)
        if not audio:
            raise HTTPException(status_code=400, detail="Audio does not exist")
        
    def is_wave(file:UploadFile):
        if not file.filename.endswith(('.wav')):
            raise HTTPException(status_code=400, detail="Invalid file type")
        
    def is_h5(file:UploadFile):
        if not file.filename.endswith(('.h5')):
            raise HTTPException(status_code=400, detail="Invalid file type")
        
    def has_process(numprocess:str, db):
        process = get_process_by_numprocess_db(numprocess, db)
        if not process:
            raise HTTPException(status_code=400, detail="Process does not exist")
        
    def has_email(email:str, db:Session):
        user = get_user_by_email_db(email, db)
        if user:
            raise HTTPException(status_code=400, detail="Email already exists")
        
    def has_user(user_id: str, db:Session):
        user = get_user_by_id_db(user_id, db)
        if not user:
            raise HTTPException(status_code=400, detail="User does not exists")