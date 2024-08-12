from pydantic import BaseModel

class StatusSchema(BaseModel):
    description: str

    class Config:
        orm_mode = True