from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from datetime import datetime
import os
from models.models import TrainedModels
from schemas.TrainedModels import TrainedModelsSchema

from config import BASE_TRAINED_MODELS_PATH

def get_active_model(db: Session):
    return db.query(TrainedModels).filter(TrainedModels.status == True).first()

def get_active_models_filepath(db: Session):
    model = get_active_model(db)
    if model is None:
        raise HTTPException(status_code=404, detail="No active AI_model found")

    return model

def get_model_by_id(model_id: int, db: Session):
    return db.query(TrainedModels).filter(TrainedModels.id == model_id).first()

async def create_model_version_db(model_version: TrainedModelsSchema, file: UploadFile,db: Session):
    db_model_version = db.query(TrainedModels).filter(
        TrainedModels.model_name == file.filename,
        TrainedModels.version == model_version.version
    ).first()
    
    if db_model_version is not None:
        raise HTTPException(status_code=400, detail="Model version already exists")
    
    filename = file.filename
    update_model_status(db)
    file_path = create_model_version_dir(file, BASE_TRAINED_MODELS_PATH)
    create_model_version(model_version, filename, file_path, db)

    return {'message': 'Model version created successfully'}

def create_model_version(model_version: TrainedModelsSchema, filename:str, file_path:str, db: Session):
    new_model_version = TrainedModels(
        model_name=filename,
        version=model_version.version,
        description=model_version.description,
        file_path= file_path,
        accuracy= None,
        loss=None,
        status = True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    db.add(new_model_version)
    db.commit()
    db.refresh(new_model_version)
    
    return new_model_version.id

def create_model_version_dir(file: UploadFile, base_file_path: str):
    model_version_dir = os.path.join(base_file_path, "Models")
    
    # Cria o diretório se ele não existir
    try:
        os.makedirs(model_version_dir, exist_ok=True)
        print(f"Directory '{model_version_dir}' created successfully!")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while creating the directory")

    
    file_path = os.path.join(model_version_dir, file.filename)

    # Salva o arquivo no diretório criado
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())
        print(f"File '{file.filename}' saved successfully in '{file_path}'!")
        return file_path
    except Exception as e:
            raise HTTPException(status_code=500, detail="An error occurred while saving the file")


def update_model_version_db(model_version_id: int, db:Session):
    model_version = db.query(TrainedModels).filter(TrainedModels.id == model_version_id).first()
    if model_version is None:
        raise HTTPException(status_code=404, detail="Model version not found")
    
    model_version.status = not model_version.status
    model_version.updated_at = datetime.now()

    db.commit()
    db.refresh(model_version)

    return {'message': 'Model version status updated successfully'}

def update_model_status(db: Session):
    models_to_update = db.query(TrainedModels).filter(TrainedModels.status == True).all()
    if models_to_update:
        for model in models_to_update:
            model.status = False
            model.updated_at = datetime.now()

            db.commit()
            db.refresh(model)