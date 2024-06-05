from pydantic import BaseModel

class AudioSchema(BaseModel):
    title: str
    url: str
    classification: bool
    accuracy: float

    class Config:
        orm_mode = True