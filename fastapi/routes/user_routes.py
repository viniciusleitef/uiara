from typing import Any, Dict
from fastapi import APIRouter, UploadFile, Depends, Form
from sqlalchemy.orm import Session
from datetime import date
from database import get_db
from schemas.User import UserSchema
from schemas.Captcha import CaptchaSchema
from Validation import Validation
from controller.userController import get_users_db, get_user_db, create_user_db, delete_user_db, update_user_db, login_user_step_one_db, login_user_step_two_db, forgot_password_user_step_one, forgot_password_user_step_two, forgot_password_user_step_three
from utils.captcha import verify_captcha_google

router = APIRouter()

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return get_users_db(db)

@router.get("/user/{user_id}")
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    Validation.has_user(user_id, db)
    return get_user_db(user_id, db)

@router.post("/user")
async def create_user(user: UserSchema, db: Session = Depends(get_db)):
    return create_user_db(user, db)

@router.put("/user/{user_id}")
async def update_user(user:UserSchema, db: Session = Depends(get_db)):
    Validation.has_email(user.email)
    return await update_user_db(user, db)

@router.delete("/user/{user_id}")
async def delete_user(user:UserSchema, db: Session = Depends(get_db)):
    return await delete_user_db(user, db)

@router.post("/login-step-one") 
async def login(user:UserSchema, db: Session = Depends(get_db)): 
    return login_user_step_one_db(user, db)

@router.post("/login-step-two")
async def login_two(user:UserSchema, db: Session = Depends(get_db)):
    return login_user_step_two_db(user.login_verification_code, user, db)

@router.post("/verify-captcha") 
async def verify_captcha(captcha:CaptchaSchema):
    return verify_captcha_google(captcha.token)

@router.post("/forgot-password-one")
async def forgot_password(user_email: str, db: Session = Depends(get_db)):
    return forgot_password_user_step_two(user_email=user_email, db=db)

@router.post("/forgot-password-two")
async def forgot_password_step_two(user_email: str, verification_code: str, db: Session = Depends(get_db)):
    return forgot_password_user_step_two(user_email=user_email, verification_code=verification_code, db=db)

@router.post("/forgot-password-three")
async def forgot_password_step_three(user_email: str, new_password: str, db: Session = Depends(get_db)):
    return forgot_password_user_step_three(user_email=user_email, new_password=new_password, db=db)