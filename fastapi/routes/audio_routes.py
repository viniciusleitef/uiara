from fastapi import APIRouter, Depends, File, UploadFile, Form
from schemas.Audio import AudioSchema
from sqlalchemy.orm import Session
from database import get_db
from typing import Any, Dict, List
from controller.audioController import get_audios_by_process_id_db, get_audioFile, create_audio_db, delete_audio, update_audio_title_db
from controller.processController import get_process_by_numprocess_db
from Validation import Validation
from utils.auth import get_current_user

router = APIRouter()

@router.get("/audios/{num_process}")
def get_audios_by_process_id(num_process: str, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    process = get_process_by_numprocess_db(num_process, db)
    Validation.has_process(num_process, db)
    return get_audios_by_process_id_db(process.id, db)

@router.get("/audioFile/{audio_id}")
async def get_audioFile_by_url(audio_id: int, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    Validation.has_audiofile(audio_id, db)
    return await get_audioFile(audio_id, db)

@router.post("/upload-audios")
async def upload_audios( num_process: str = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    Validation.has_process(num_process, db)
    
    return await create_audio_db(num_process, db, files)

@router.put("/update-audio/{audio_id}")
def update_audio_title(audio_id: int, new_title: str, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    return update_audio_title_db(audio_id, new_title, db)

@router.delete("/delete-audio/{audio_id}")
async def delete_audio_by_id(audio_id: int, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    return delete_audio(audio_id, db)