from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from controller.pdfController import generate_pdf_file
from database import get_db

router = APIRouter()

@router.get("/generate-pdf/{num_process}")
def generate_pdf(num_process: str, db: Session = Depends(get_db)):
    return generate_pdf_file(num_process, db)