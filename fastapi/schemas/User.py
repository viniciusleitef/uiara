from pydantic import BaseModel

class UserSchema(BaseModel):
    username: str
    email: str
    password: str
    login_verification_code: str

    class Config:
        orm_mode = True