from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from schemas.TrainedModels import TrainedModelsSchema
from database import get_db
from Validation import Validation

import controller.trainedModelsController as trainedModelsController

router = APIRouter()

@router.put("/model_versions/{model_id}")
async def update_model_status(model_id: int, db: Session = Depends(get_db)):
    return trainedModelsController.update_model_version_db(model_id, db)

@router.post("/model_versions/")
async def create_model_version(
    version: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    print("testando")
    model_version = TrainedModelsSchema(
        version=version,
        description=description
    )
    Validation.is_h5(file)
    return await trainedModelsController.create_model_version_db(model_version, file, db)

@router.get("/model_versions/")
async def get_all_models(db: Session = Depends(get_db)):
    return trainedModelsController.get_all_models(db)

@router.delete("/model_versions/{model_id}")
async def delete_model_version(model_id: int, db: Session = Depends(get_db)):
    return trainedModelsController.delete_model_version_db(model_id, db)