from pydantic import BaseModel
from typing import Optional, Dict

class TrainedModelsSchema(BaseModel):
    version: str
    description: Optional[str] = None

    class Config:
        orm_mode = True
