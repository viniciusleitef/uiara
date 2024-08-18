from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from controller.pdfController import generate_pdf_file
from database import get_db
from utils.auth import get_current_user

router = APIRouter()

@router.get("/generate-pdf/{num_process}")
def generate_pdf(num_process: str, db: Session = Depends(get_db), current_user: Dict[str, Any] = Depends(get_current_user)):
    return generate_pdf_file(num_process, db, current_user.get('user_id'))