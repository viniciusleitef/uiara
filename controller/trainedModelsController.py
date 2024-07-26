from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import os
from models.models import TrainedModels
from schemas.TrainedModels import TrainedModelsSchema

from config import BASE_TRAINED_MODELS_PATH

async def create_model_version_db(model_version: TrainedModelsSchema, db: Session):
    db_model_version = db.query(TrainedModels).filter(
        TrainedModels.model_name == model_version.model_name,
        TrainedModels.version == model_version.version
    ).first()
    
    if db_model_version is not None:
        raise HTTPException(status_code=400, detail="Model version already exists")
    
    model_version_id = create_model_version(model_version, db)
    create_model_version_dir(model_version_id, BASE_TRAINED_MODELS_PATH)

    return {'message': 'Model version created successfully'}

def create_model_version(model_version: TrainedModelsSchema, db: Session):
    new_model_version = TrainedModels(
        model_name=model_version.model_name,
        version=model_version.version,
        description=model_version.description,
        file_path=model_version.file_path,
        accuracy=model_version.accuracy,
        loss=model_version.loss,
        parameters=model_version.parameters,
        creation_date=datetime.now()
    )

    db.add(new_model_version)
    db.commit()
    db.refresh(new_model_version)
    
    return new_model_version.id

def create_model_version_dir(model_version_id: int, base_file_path: str):
    model_version_dir = f"{base_file_path}/Model_{model_version_id}"
    try:
        os.makedirs(model_version_dir, exist_ok=True)
        print(f"Directory '{model_version_dir}' created successfully!")
    except Exception as e:
        print(f"An error occurred while creating the directory: {e}")
