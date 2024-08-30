import random
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

JWT_ALGORITHM = 'HS256' 
JWT_EXPIRATION_HOURS = 24  
VERIFICATION_CODE_EXPIRATION_MINUTES = 15

SECRET_KEY = os.getenv('SECRET_KEY')

def generate_verification_code() -> str:
    """
    Generate a secure random verification code.
    """
    code = "{:06}".format(random.randint(0, 999999))
    return code

def generate_expiration_time():
    verification_expire_time = datetime.now(timezone.utc) + timedelta(minutes=VERIFICATION_CODE_EXPIRATION_MINUTES)
    return verification_expire_time

def create_jwt_token(email: str, username, user_id) -> str:
    """
    Create a JWT token with a specific expiration time, including the username.
    """
    payload = {
        "email": email,
        "username": username,
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)   
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token

def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify the JWT token and return the payload if valid.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    payload = verify_jwt_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload
