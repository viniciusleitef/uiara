from schemas.User import UserSchema
from schemas.Captcha import CaptchaSchema
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.models import User
from datetime import datetime, timezone
from utils.email import send_verification_email
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
        updated_at = datetime.now()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

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
    
def login_user_step_one_db(user: UserSchema, db:Session):
    print("Iniciando login step one")
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
    # Check if login is valid
        if bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
            # Generate verification code
            # Set verification code
            # Set verification expire time
            # Send verification email
            # -> Salvar no banco

            verification_expiration_time = generate_expiration_time()
            verification_code = generate_verification_code()

            db_user.login_verification_code = verification_code
            db_user.login_verification_expires_at = verification_expiration_time
            
            db.commit()
            db.refresh(db_user)
            try:
                send_verification_email(user.email, verification_code)
            except Exception as e:
                raise HTTPException(status_code=500, detail="Erro enviando código de verificação. Tente novamente.")
            return {"message": "Verification code successfully sent to user's email"}
        raise HTTPException(status_code=400, detail="Senha inválida.")
    raise HTTPException(status_code=400, detail="Usuário não existe.")

def login_user_step_two_db(verification_code: str, user: UserSchema, db: Session):
    print("Iniciando login step two")
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        # Check if login is valid -> Error 400
        if bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
            # Check if verification code is valid -> Error 400
            if db_user.login_verification_code == verification_code:
                # Check if verification code is not expired -> Error 400
                if db_user.login_verification_code and db_user.login_verification_expires_at > datetime.now(timezone.utc):
                    # Create jwt token with expiration of 24 hours
                    jwt_token = create_jwt_token(user.email)
                    return {"token": jwt_token}
                else:
                    raise HTTPException(status_code=400, detail="Código de verificação expirou.")
            else:
                raise HTTPException(status_code=400, detail="Código de verificação inválido.")
        raise HTTPException(status_code=400, detail="Senha inválida.")
    raise HTTPException(status_code=400, detail="Usuário não existe.")
