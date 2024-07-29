from pydantic import BaseModel

class UserSchema(BaseModel):
    username: str
    email: str
    passwords: str

    class Config:
        orm_mode = True