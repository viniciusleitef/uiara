from pydantic import BaseModel
from datetime import date

class ProcessSchema(BaseModel):
    num_process: str
    responsible: str
    created_at: date

    class Config:
        orm_mode = True