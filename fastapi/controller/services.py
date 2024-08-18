# Arquivo criado para evitar erro circular entre os controllers

from models.models import Process, Audio, User
from sqlalchemy.orm import Session
from datetime import datetime


# Áudios

def get_audio_by_url_db(url:str, db:Session):
    return db.query(Audio).filter(Audio.url == url).first()

def get_audio_by_id_db(audio_id:int, db:Session):
    return db.query(Audio).filter(Audio.id == audio_id).first()

def get_audios_by_process_id_db(process_id:int, db:Session):
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
            "sample_rate": audio.sample_rate,
            "snr": audio.snr
        })
    return audioList

# Process

def get_process_by_numprocess_db(num_process: str, db:Session, user_id: str):
    return db.query(Process).filter(Process.num_process == num_process).filter(Process.user_id == user_id).first()

def get_process_by_process_id(process_id, db):
    return db.query(Process).filter(Process.id == process_id).first()

def verify_status(audioList):   
    for audio in audioList:
        if audio['classification']  == False:
            return 2                        # Falso
        if audio['classification']  == None:
            return 1                        # Em análise
    return 3  

def update_process_date_db(process_id:int, db:Session):
    process = db.query(Process).filter(Process.id == process_id).first()
    if process:
        process.updated_at = datetime.now()
        db.commit()
        db.refresh(process)
    
def update_process_status(process:Process, db:Session):
    audioList = get_audios_by_process_id_db(process.id, db)
    process_status = verify_status(audioList)
    update_process_status_db(process_status, process, db)
    return {"message":"Process updated"}

def update_process_status_db(process_status:int , process:Process, db:Session):
    process.status_id = process_status
    db.commit()
    db.refresh(process)
    return 

def update_all_processes_status_db(db:Session, user_id: str):
    data = db.query(Process).filter(Process.user_id == user_id).all()
    for process in data:
        update_process_status(process, db)
    return {"message":"Processes updated"}

# User

def get_user_by_email_db(email, db:Session):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id_db(user_id, db:Session):
    return db.query(User).filter(User.id == user_id).first()