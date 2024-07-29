from schemas.User import UserSchema
from sqlalchemy.orm import Session
from models.models import User
from datetime import datetime

def get_users_db(db:Session):
    return db.query(User).all()

def get_user_db(user_id, db:Session):
    return db.query(User).filter(User.id == user_id).first()

def create_user_db(user:UserSchema, db:Session):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user is not None:
        raise Exception("User already exists")

    new_user = User(
        name = user.name,
        email = user.email,
        hashed_password = user.password, # ADD ALGORITMO DE CRIPTOGRAFIA
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