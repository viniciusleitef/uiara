from fastapi import FastAPI, Form
from database import SessionLocal, Base, engine
from fastapi import UploadFile
from controller.audioController import create_audio_db, get_audios_by_process_id_bd, update_audio_db
from controller.processController import create_process, get_process_by_numprocess_db, get_all_process_db
from controller.statusController import create_status_db, update_status_db
from models import models
from schemas.Audio import AudioSchema
from schemas.Process import ProcessSchema
from schemas.Status import StatusSchema
from trained_model.executaModelo import analyzingAudio
from Validation import Validation
from datetime import date
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine) 
db = SessionLocal()

app = FastAPI()

origins = ['*', 'http://localhost:8000']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello world!"}

@app.get("/audio/{num_process}")
def get_audios_by_process_id(num_process):
    process = get_process_by_numprocess_db(num_process, db)
    Validation.has_process(num_process, db)
    return get_audios_by_process_id_bd(process.id, db)


@app.get("/processo/{num_process}")
def get_process_by_numprocess(num_process):
    return get_process_by_numprocess_db(num_process, db)

@app.get("/processos")
def get_all_process():
    return get_all_process_db(db)

@app.post("/processo")
async def create_audio(file: UploadFile ,title: str = Form(...), num_process: str = Form(...), responsible: str = Form(...), date_of_creation: date = Form(...)):
    Validation.is_wave(file)
    baseFilePath = "/home/chaos/Documentos/detectai/audios"

    # Criando objeto AudioSchema e ProcessSchema
    audio_data = AudioSchema(
        title=title
    )

    process_data = ProcessSchema(
        num_process = num_process,
        responsible = responsible,
        date_of_creation = date_of_creation
    )
    
    # Pegando o processo pelo num_process
    # Caso não exista, cria o status, processo e o áudio
    # Caso exista, cria apenas o áudio

    process = get_process_by_numprocess_db(process_data.num_process, db)

    if process == None:
        status_id = create_status_db(db)
        process_id = create_process(process_data, status_id, db)                #retorna id do processo criado
        audioFilePath = f"{baseFilePath}/Process_{process_id}/{file.filename}"  #url do audio
        Validation.has_url(audioFilePath, db)
        await create_audio_db(file, audio_data, process_id, baseFilePath, audioFilePath, db)

    else:
        # Verificando se o arquivo já existe no diretorio - verificação feita nesse else pois caso seja o cadastro do primeiro processo não conseguiriamos pegar o "process.id"
        audioFilePath = f"{baseFilePath}/Process_{process.id}/{file.filename}"
        Validation.has_url(audioFilePath, db)
        Validation.has_audiofile(file.filename, process.id)
        await create_audio_db(file, audio_data, process.id, baseFilePath,audioFilePath, db)
    
    # Pegando o processo novamente - Caso ele não tenha sido criado, estou garantindo agora que "process" não é none
    process = get_process_by_numprocess_db(process_data.num_process, db)

    # Execudando o modelo e passando o resuldado para listas de acuracia e clase predita
    prediction, predicted_class = await analyzingAudio(audioFilePath)
    
    # Atualizando accuracy e classification
    update_audio_db(audioFilePath, prediction, predicted_class, db)
        
    return {"response":"success"}