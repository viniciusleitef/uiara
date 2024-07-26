from pydantic import BaseModel
from typing import Optional, Dict

class TrainedModelsSchema(BaseModel):
    model_name: str
    version: str
    description: Optional[str] = None
    file_path: Optional[str] = None
    accuracy: Optional[float] = None
    loss: Optional[float] = None

    class Config:
        orm_mode = True