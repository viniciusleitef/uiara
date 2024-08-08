from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from controller.trainedModelsController import create_model_version_db
from schemas.TrainedModels import TrainedModelsSchema
from database import get_db
from Validation import Validation

router = APIRouter()

@router.post("/model_versions/")
async def create_model_version(
    version: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    model_version = TrainedModelsSchema(
        version=version,
        description=description
    )
    Validation.is_h5(file)
    return await create_model_version_db(model_version, file, db)