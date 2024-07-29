from pydantic import BaseModel

class ProcessSchema(BaseModel):
    title: str
    num_process: str
    responsible: str

    class Config:
        orm_mode = True