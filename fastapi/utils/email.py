import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')
EMAIL_SERV = os.getenv('EMAIL_SERV')
EMAIL_PORT = os.getenv('EMAIL_PORT', 587)
EMAIL_FROM = os.getenv('EMAIL_FROM')

def smtp_setup(
        to_email: str, 
        subject: str, 
        body: str
    ) -> None:

    msg = MIMEMultipart()
    msg['From'] = EMAIL_FROM
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(
        MIMEText(body, 'plain')
    )

    server = smtplib.SMTP(EMAIL_SERV, EMAIL_PORT)
    server.starttls()
    server.login(EMAIL_USER, EMAIL_PASS)
    text = msg.as_string()
    server.sendmail(EMAIL_FROM, to_email, text)
    server.quit()

    return

def send_forgot_password_code_email(to_email: str, code: str):
    print("ENVIANDO FORGOT CODE")

    smtp_setup(
        to_email=to_email, 
        subject='Código para redefinir a senha', 
        body=f'Use o código {code} para redefinir sua senha.'
    )

    return

def send_verify_account_email(to_email: str, code: str):
    print("ENVIANDO VERIFY ACCOUNT CODE")

    smtp_setup(
        to_email=to_email,
        subject='Valide sua conta!',
        body=f'Use o código {code} para validar sua conta.'
    )

    return