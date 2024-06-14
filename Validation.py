from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from controller.audioController import get_audio_by_url_bd, get_audio_by_id_db
from controller.processController import get_process_by_numprocess_db
import os

class Validation():
    
    def has_url(url:str, db:Session):
        audio = get_audio_by_url_bd(url, db)
        if audio:
            raise HTTPException(status_code=400, detail="Url already exists")

    def has_audiofile(audio_id:int, db:Session):
        audio = get_audio_by_id_db(audio_id, db)
        if not audio:
            raise HTTPException(status_code=400, detail="Audio does not exist")
        
    def is_wave(file:UploadFile):
        if not file.filename.endswith(('.wav')):
            raise HTTPException(status_code=400, detail="Invalid file type")
        
    def has_process(numprocess:str, db):
        process = get_process_by_numprocess_db(numprocess, db)
        if not process:
            raise HTTPException(status_code=400, detail="Process does not exist")