from pydantic import BaseModel
from datetime import date

class ProcessSchema(BaseModel):
    num_process: str
    responsible: str

    class Config:
        orm_mode = True