from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from controller.trainedModelsController import create_model_version_db
from schemas.TrainedModels import TrainedModelsSchema
from database import get_db

router = APIRouter()

@router.post("/model_versions/")
async def create_model_version(model_version: TrainedModelsSchema, db: Session = Depends(get_db)):
    return await create_model_version_db(model_version, db)