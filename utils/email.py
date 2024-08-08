import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

def send_verification_email(to_email: str, code: str):
    print("ENVIANDO")
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = to_email
    msg['Subject'] = 'Email Verification Code'

    body = f'Your verification code is {code}'
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL_USER, EMAIL_PASS)
    text = msg.as_string()
    server.sendmail(EMAIL_USER, to_email, text)
    server.quit()