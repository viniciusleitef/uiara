from pydantic import BaseModel

class UserSchema(BaseModel):
    username: str
    email: str
    password: str
    verification_code: str

    class Config:
        orm_mode = True