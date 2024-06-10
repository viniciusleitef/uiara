from fastapi import FastAPI, Form
from database import SessionLocal, Base, engine
from fastapi import UploadFile
from controller.audioController import create_audio_db, get_audios_by_process_id_bd, update_audio_db
from controller.processController import create_process, get_process_by_numprocess_db
from controller.statusController import create_status_db, update_status_db
from models import models
from schemas.Audio import AudioSchema
from schemas.Process import ProcessSchema
from schemas.Status import StatusSchema
from trained_model.executaModelo import analyzingAudio
from Validation import Validation

Base.metadata.create_all(bind=engine) 
db = SessionLocal()

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello world!"}

@app.post("/upload-audio/")
async def create_audio(file: UploadFile ,title: str = Form(...), url: str = Form(...), num_process: str = Form(...), responsible: str = Form(...), date_of_creation: str = Form(...)):
    Validation.is_wave(file)

    # Criando objeto AudioSchema e ProcessSchema
    audio_data = AudioSchema(
        title=title,
        url=url
    )

    process_data = ProcessSchema(
        num_process = num_process,
        responsible = responsible,
        date_of_creation = date_of_creation
    )

    # Verificando se a URL já existe no banco de dados
    Validation.has_url(url, db)
    
    # Pegando o processo pelo num_process
    # Caso não exista, cria o status e o processo
    # Caso exista, cria apenas o áudio

    process = get_process_by_numprocess_db(process_data.num_process, db)


    if process == None:
        status_id = create_status_db(db)
        process_id = create_process(process_data, status_id, db)
        await create_audio_db(file, audio_data, process_id, db)

    else:
        # Verificando se o arquivo já existe no diretorio - verificação feita nesse else pois caso seja o cadastro do primeiro processo não conseguiriamos pegar o "process.id"
        Validation.has_audiofile(file.filename, process.id)
        await create_audio_db(file, audio_data, process.id, db)
    
    # Pegando o processo novamente para usar process.id no filePath
    process = get_process_by_numprocess_db(process_data.num_process, db)
    filePath = f"audios/Process_{process.id}"

    # Execudando o modelo e passando o resuldado para listas de acuracia e clase predita
    prediction_list, predicted_class_list = await analyzingAudio(filePath)
    
    # Convertendo classe predita para o formato esperado pelo banco de dados
    for i, predicted_class in enumerate(predicted_class_list):
        if predicted_class.lower() == "fake":
            predicted_class_list[i] = False
        else:
            predicted_class_list[i] = True
    
    # Pegando todos os áudios quem tenham o process.id iguais
    list_of_audios = get_audios_by_process_id_bd(process.id, db)

    # Para cada tabela audio em "list_of_audios"(todas tem o mesmo process_id) atualiza acuracia e classe predita
    for i in range(len(list_of_audios)):
        accuracy_value = prediction_list[i][0][0].item() # Pegando apenas a accuracy do array Numpy
        update_audio_db(list_of_audios[i].id, predicted_class_list[i], accuracy_value, db)
        

    return {"response":"success"}

