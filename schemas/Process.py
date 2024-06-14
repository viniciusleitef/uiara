from pydantic import BaseModel
from datetime import date

class ProcessSchema(BaseModel):
    num_process: str
    responsible: str
    date_of_creation: date

    class Config:
        orm_mode = True