from fastapi import FastAPI, Form
from database import SessionLocal, Base, engine
from fastapi import UploadFile
from controller.audioController import create_audio_db, get_audio_db, update_audio_db
from controller.processController import create_process, get_process_by_numprocess_db, get_all_process_db
from controller.statusController import create_status_db, get_all_status_db, update_status_db
from models import models
from schemas.Audio import AudioSchema
from schemas.Process import ProcessSchema
from schemas.Status import StatusSchema

Base.metadata.create_all(bind=engine) 
db = SessionLocal()

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello world!"}

@app.post("/upload-audio/")
async def create_audio(file: UploadFile ,title: str = Form(...), url: str = Form(...), num_process: str = Form(...), responsible: str = Form(...), date_of_creation: str = Form(...)):
    audio_data = AudioSchema(
        title=title,
        url=url
    )

    process_data = ProcessSchema(
        num_process = num_process,
        responsible = responsible,
        date_of_creation = date_of_creation
    )
    process = get_process_by_numprocess_db(process_data.num_process, db)

    if process == None:
        status_id = create_status_db(db)
        process_id = create_process(process_data, status_id, db)

        return await create_audio_db(file, audio_data, process_id, db)
    else:
        return await create_audio_db(file, audio_data, process.id, db)

    

 