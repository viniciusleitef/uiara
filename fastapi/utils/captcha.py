import requests
from fastapi import HTTPException
import os
from dotenv import load_dotenv

load_dotenv()

RECAPTCHA_SECRET_KEY = os.getenv('CHAVE_SECRETA_CAPTCHA') 

def verify_captcha_google(captcha):
    verification_url = 'https://www.google.com/recaptcha/api/siteverify'
    
    response = requests.post(
        verification_url,
        data={
            'secret': RECAPTCHA_SECRET_KEY,
            'response': captcha
        }
    )
    
    result = response.json()
    if not result.get('success'):
        print("INVALIDEZ no captcha", result)
        raise HTTPException(status_code=400, detail="Verificação do reCAPTCHA falhou. Tente novamente.")
    print("Sucesso no captcha")
    return {"message": "reCAPTCHA verified successfully"}
