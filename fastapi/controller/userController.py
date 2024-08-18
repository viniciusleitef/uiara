from schemas.User import UserSchema
from schemas.Captcha import CaptchaSchema
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.models import User
from datetime import datetime, timezone
from utils.email import send_verify_account_email, send_forgot_password_code_email
from utils.auth import generate_verification_code, create_jwt_token, verify_jwt_token, generate_expiration_time
import bcrypt

def get_users_db(db:Session):
    return db.query(User).all()

def get_user_db(user_id, db:Session):
    return db.query(User).filter(User.id == user_id).first()

def create_user_db(user:UserSchema, db:Session):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user is not None:
        raise Exception("User already exists")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    new_user = User(
        username = user.username,
        email = user.email,
        hashed_password = hashed_password.decode('utf-8'), 
        created_at = datetime.now(),
        updated_at = datetime.now(),
        is_verified=False,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    verification_expiration_time = generate_expiration_time()
    verification_code = generate_verification_code()

    db_user = db.query(User).filter(User.email == user.email).first()

    db_user.verification_code = verification_code
    db_user.verification_expires_at = verification_expiration_time

    print("VERIFICATION CODE:", verification_code)
    
    db.commit()
    db.refresh(db_user)
    try:
        send_verify_account_email(db_user.email, verification_code)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Erro enviando código de verificação. Tente novamente.")

    return {'message': 'User created successfully'}

def delete_user_db(user_id:int , db:Session):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return f"User {user_id} deleted successfully"
    else:
        raise Exception(f"User {user_id} not found")
    
def update_user_db(user_id:int, new_user:UserSchema, db:Session):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        if new_user.name:
            user.name = new_user.name
        if new_user.password:
            user.hashed_password = new_user.password # ADD ALGORITMO DE CRIPTOGRAFIA
        if new_user.email:
            user.email = new_user.email # Lembrar de fazer a verificação se o nome email ja existe (fazer isso na rota) 
        user.updated_at = datetime.now()
        db.commit()
        db.refresh(user)
        return {'message': 'User updated successfully'}
    else:
        raise Exception(f"User {user_id} not found")

def login_user_db(user: UserSchema, db: Session):
    print("Iniciando login")
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        # Check if login is valid -> Error 400
        if bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):

            if db_user.is_verified:
                # Create jwt token with expiration of 24 hours
                jwt_token = create_jwt_token(db_user.email, db_user.username, db_user.id)
                return {"token": jwt_token}
            else: 
                verification_expiration_time = generate_expiration_time()
                verification_code = generate_verification_code()

                db_user.verification_code = verification_code
                db_user.verification_expires_at = verification_expiration_time

                print("VERIFICATION CODE:", verification_code)
                
                db.commit()
                db.refresh(db_user)
                try:
                    send_verify_account_email(db_user.email, verification_code)
                except Exception as e:
                    raise HTTPException(status_code=500, detail="Erro enviando código de verificação. Tente novamente.")
                raise HTTPException(
                    status_code=400, 
                    detail="Usuário ainda não foi validado.",
                    headers={"X-Error-Code": "USER_NOT_VERIFIED"}
                )
                
        raise HTTPException(status_code=400, detail="Senha inválida.")
    raise HTTPException(status_code=400, detail="Usuário não existe.")

def forgot_password_user_step_one(user_email: str, db: Session):
    print("forgot password one", user_email)

    db_user = db.query(User).filter(User.email == user_email).first()
    if db_user:
        verification_expiration_time = generate_expiration_time()
        verification_code = generate_verification_code()

        db_user.verification_code = verification_code
        db_user.verification_expires_at = verification_expiration_time

        print("VERIFICATION CODE:", verification_code)
        
        db.commit()
        db.refresh(db_user)

        try:
            send_forgot_password_code_email(user_email, verification_code)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Erro enviando código de verificação. Tente novamente.")
        return {"message": "Verification code successfully sent to user's email"}
    raise HTTPException(status_code=400, detail="Usuário não existe.")

def forgot_password_user_step_two(user_email: str, verification_code: str, db: Session):
    print("forgot password step two")

    db_user = db.query(User).filter(User.email == user_email).first()
    if db_user:
        if db_user.verification_code == verification_code:
            return {'message': 'Verification code correct'}
        raise HTTPException(status_code=500, detail="Código de verificação incorreto.")
    raise HTTPException(status_code=400, detail="Usuário não existe.")

def forgot_password_user_step_three(user_email: str, new_password: str, db: Session):
    print("forgot password step three")

    db_user = db.query(User).filter(User.email == user_email).first()
    if db_user:
        new_password_hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        new_password_hashed = new_password_hashed.decode('utf-8')     
        db_user.hashed_password = new_password_hashed

        db.commit()
        db.refresh(db_user)
        return {'message': 'Password updated successfully'}
    raise HTTPException(status_code=400, detail="Usuário não existe.")

def validate_user_db(user_email: str, verification_code: str, db: Session):
    print("validating user")
    db_user = db.query(User).filter(User.email == user_email).first()
    if db_user:
        if db_user.verification_code == verification_code:
            # Check if verification code is not expired -> Error 400
            if db_user.verification_code and db_user.verification_expires_at > datetime.now(timezone.utc):
                db_user.is_verified = True

                db.commit()
                db.refresh(db_user)

                return {'message': 'Account validated'}
            else:
                raise HTTPException(status_code=400, detail="Código de verificação expirou.")
        raise HTTPException(status_code=500, detail="Código de verificação incorreto.")
    raise HTTPException(status_code=400, detail="Usuário não existe.")
