from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from controller.audioController import get_audio_by_url_bd
import os

class Validation():
    
    def has_url(url:str, db:Session):
        audio = get_audio_by_url_bd(url, db)
        if audio:
            raise HTTPException(status_code=400, detail="Url already exists")

    def has_audiofile(filename:str, process_id:int):
        # Se existir um arquivo com o nome = "filename" no diretorio, return true
        directory = f"audios/Process_{process_id}"
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            raise HTTPException(status_code=400, detail="File already exists")
        
    
    def is_wave(file:UploadFile):
        if not file.filename.endswith(('.wav')):
            raise HTTPException(status_code=400, detail="Invalid file type")