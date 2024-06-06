from pydantic import BaseModel

class AudioSchema(BaseModel):
    title: str
    url: str

    class Config:
        orm_mode = True