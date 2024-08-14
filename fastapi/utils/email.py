import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

def send_verification_email(to_email: str, code: str):
    print("ENVIANDO VERIFICATION CODE")
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = to_email
    msg['Subject'] = 'Código de verificação uIAra'

    body = f'Olá, seu código de verificação é {code}. Você tentou fazer login no email {to_email}. Use o código {code} para confirmar o login.'
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL_USER, EMAIL_PASS)
    text = msg.as_string()
    server.sendmail(EMAIL_USER, to_email, text)
    server.quit()

def send_forgot_password_code_email(to_email: str, code: str):
    print("ENVIANDO FORGOT CODE")
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = to_email
    msg['Subject'] = 'Código para redefinir a senha'

    body = f'Use o código {code} para redefinir sua senha.'
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL_USER, EMAIL_PASS)
    text = msg.as_string()
    server.sendmail(EMAIL_USER, to_email, text)
    server.quit()