from pydantic import BaseModel

class ProcessSchema(BaseModel):
    responsible: str
    date_of_creation: str

    class Config:
        orm_mode = True