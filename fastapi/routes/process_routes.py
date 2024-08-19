from typing import Any, Dict
from fastapi import APIRouter, UploadFile, Depends, Form
from sqlalchemy.orm import Session
from database import get_db
from datetime import date
from Validation import Validation
from schemas.Audio import AudioSchema
from schemas.Process import ProcessSchema
from controller.processController import get_process_by_numprocess_db, get_all_process_db, get_all_processes_with_audios_db, delete_process_by_numprocess, create_process_db, update_process_title_db
from utils.auth import get_current_user

from config import BASE_FILE_PATH

router = APIRouter()

@router.get("/process/{num_process}")
def get_process_by_numprocess(num_process: str, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    Validation.has_process(num_process, db, current_user.get("user_id"))
    return get_process_by_numprocess_db(num_process, db)

@router.get("/processes")
def get_all_process(db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    return get_all_process_db(db, current_user.get("user_id"))

@router.get("/processesWithAudios")
def get_processes_with_audios(db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    return get_all_processes_with_audios_db(db, current_user.get("user_id"))

@router.delete("/process/{num_process}")
async def delete_process(num_process: str, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    Validation.has_process(num_process, db, current_user.get("user_id"))
    return await delete_process_by_numprocess(num_process, BASE_FILE_PATH, db, current_user.get("user_id"))

@router.post("/process")
async def create_process(process: ProcessSchema, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    return await create_process_db(process, db, current_user.get("user_id"))

@router.put("/process/{num_process}")
async def update_process_title(num_process: str, new_title: str, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    Validation.has_process(num_process, db, current_user.get("user_id"))
    return update_process_title_db(num_process, new_title, db, current_user.get("user_id"))