from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from controller.audioController import get_audios_by_process_id_bd, get_audioFile
from controller.processController import get_process_by_numprocess_db
from Validation import Validation

router = APIRouter()

@router.get("/audios/{num_process}")
def get_audios_by_process_id(num_process: str, db: Session = Depends(get_db)):
    process = get_process_by_numprocess_db(num_process, db)
    Validation.has_process(num_process, db)
    return get_audios_by_process_id_bd(process.id, db)

@router.get("/audioFile/{audio_id}")
async def get_audioFile_by_url(audio_id: int, db: Session = Depends(get_db)):
    Validation.has_audiofile(audio_id, db)
    return await get_audioFile(audio_id, db)