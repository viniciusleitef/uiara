from fastapi import APIRouter, UploadFile, Depends, Form
from sqlalchemy.orm import Session
from database import get_db
from datetime import date
from Validation import Validation
from schemas.Audio import AudioSchema
from schemas.Process import ProcessSchema
from controller.processController import get_process_by_numprocess_db, get_all_process_db, get_all_processes_with_audios_db, delete_process_by_numprocess, create_process_db

from config import BASE_FILE_PATH

router = APIRouter()

@router.get("/process/{num_process}")
def get_process_by_numprocess(num_process: str, db: Session = Depends(get_db)):
    Validation.has_process(num_process, db)
    return get_process_by_numprocess_db(num_process, db)

@router.get("/processes")
def get_all_process(db: Session = Depends(get_db)):
    return get_all_process_db(db)

@router.get("/processesWithAudios")
def get_processes_with_audios(db: Session = Depends(get_db)):
    return get_all_processes_with_audios_db(db)

@router.delete("/process/{num_process}")
async def delete_process(num_process: str, db: Session = Depends(get_db)):
    Validation.has_process(num_process, db)
    return await delete_process_by_numprocess(num_process, BASE_FILE_PATH, db)

@router.post("/process")
async def create_process(process: ProcessSchema, db: Session = Depends(get_db)):
    return await create_process_db(process ,db)