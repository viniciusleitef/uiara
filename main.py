from fastapi import FastAPI, Form
from database import SessionLocal, Base, engine
from fastapi import UploadFile
from controller.audioController import create_audio_db, get_audio_db
from controller.processController import create_process
from controller.statusController import create_status
from models import models
from schemas.Audio import AudioSchema
from schemas.Process import ProcessSchema

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
async def create_audio(file: UploadFile ,title: str = Form(...), url: str = Form(...), classification: bool = Form(...), accuracy: float = Form(...), responsible: str = Form(...), date_of_creation: str = Form(...)):
    audio_data = AudioSchema(
        title=title,
        url=url,
        classification=classification,
        accuracy=accuracy
    )

    process_data = ProcessSchema(
        responsible = responsible,
        date_of_creation = date_of_creation
    )

    status_id = create_status(db)
    process_id = create_process(process_data, status_id, db)

    return await create_audio_db(file, audio_data, process_data, process_id, db)


 