from pydantic import BaseModel

class AudioSchema(BaseModel):
    filename: str
    date_time: str
    process_number: str
    politician: str

    class Config:
        orm_mode = True