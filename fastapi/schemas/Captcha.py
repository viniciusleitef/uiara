from pydantic import BaseModel

class CaptchaSchema(BaseModel):
    token: str

    class Config:
        orm_mode = True