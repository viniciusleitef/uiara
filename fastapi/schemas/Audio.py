from pydantic import BaseModel

class AudioSchema(BaseModel):
    title: str

    class Config:
        orm_mode = True