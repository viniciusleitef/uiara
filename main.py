from fastapi import FastAPI
from database import SessionLocal, Base, engine
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
async def create_audio(audio: AudioSchema):
    return await create_audio_db(audio, db)
