from fastapi import FastAPI, Form
from database import SessionLocal, Base, engine
from fastapi import UploadFile
from controller.audioController import create_audio_db, get_audio_db
from models import models
from schemas.Audio import AudioSchema

Base.metadata.create_all(bind=engine) 
db = SessionLocal()

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello world!"}

@app.get("/audio")
async def get_audio():
    return get_audio_db(db)

@app.post("/upload-audio/")
async def create_audio(file: UploadFile ,filename: str = Form(...), date_time: str = Form(...), process_number: str = Form(...), politician: str = Form(...),):
    audio_data = AudioSchema(
        filename=filename,
        date_time=date_time,
        process_number=process_number,
        politician=politician,
    )
    return await create_audio_db(file, audio_data, db)
 