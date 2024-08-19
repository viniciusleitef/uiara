from fastapi import HTTPException
from models.models import Process
from sqlalchemy.orm import Session
from schemas.Process import ProcessSchema
from datetime import datetime
from sqlalchemy import desc
from controller.audioController import get_audios_by_process_id_db, delete_audios_db
from controller.services import get_process_by_numprocess_db, update_all_processes_status_db
from controller.statusController import get_all_status_db
import shutil
import os

# Status - 1 = Em análise / 2 = Falso / 3 = Verdadeiro

from config import BASE_FILE_PATH, STATUS_ID

def get_all_process_db(db: Session, user_id: str):
    update_all_processes_status_db(db, user_id)
    return db.query(Process).order_by(desc(Process.id)).filter(Process.user_id == user_id).all()

def get_all_processes_with_audios_db(db: Session, user_id: str):
    update_all_processes_status_db(db, user_id)
    processes = get_all_process_db(db, user_id)
    response = []
    for process in processes:
        process_dict = process.__dict__
        audios = get_audios_by_process_id_db(process.id, db)
        process_dict['audios'] = audios  # Já são dicionários
        response.append(process_dict)
    return response

def verify_status(audioList):   
    for audio in audioList:
        if audio['classification']  == False:
            return 2                        # Falso
        if audio['classification']  == None:
            return 1                        # Em análise
    return 3                                # Verdadeiro

async def create_process_db(process, db, user_id):
    db_process = db.query(Process).filter(Process.num_process == process.num_process).filter(Process.user_id == user_id)
    if db_process.first() is not None:
        print("exists alreay")
        raise HTTPException(status_code=400, detail="Processo already exists")
    
    # Verificar se todos os audios foram validos
    print("TESTE")

    new_process = create_process(process, STATUS_ID, db, user_id)
    print("TESTE1.5")
    create_process_dir(new_process.id, BASE_FILE_PATH)
    print("TESTE2")

    return new_process

def create_process(process:ProcessSchema, status_id:int, db:Session, user_id:str):
    if not get_all_status_db(db):
        print("eita")
        raise HTTPException(status_code=400, detail="Tabela status precisa ser criada")
    
    new_process = Process(
        status_id = status_id,
        num_process = process.num_process,
        title = process.title,
        user_id = user_id,
        responsible = process.responsible,
        created_at = datetime.now(),
        updated_at = datetime.now()
    )

    db.add(new_process)
    db.commit()
    
    return new_process

def create_process_dir(process_id:int, BaseFilePath:str):
    pasta_process = f"{BaseFilePath}/Process_{process_id}"
    try:
        os.makedirs(pasta_process, exist_ok=True)
        print(f"Pasta '{pasta_process}' criada com sucesso!")
    except Exception as e:
        print(f"Ocorreu um erro ao criar a pasta: {e}")

async def delete_process_by_numprocess(num_process:str, base_filepath:str, db:Session, user_id: str):
    # Pegando process para pegar o id
    process = get_process_by_numprocess_db(num_process, db, user_id)
    print("CHEGUEI AQUI")

    await delete_process_dir(process.id, base_filepath)
    delete_audios_db(process.id, db)
    delete_process_db(process.id, db)
    return f"Process {num_process} and associated audios deleted successfully"

async def delete_process_dir(process_id:int, base_filepath:str):
    target_folder =  f"{base_filepath}/Process_{process_id}"
    try:
        if os.path.exists(target_folder):
            shutil.rmtree(target_folder)  # Exclui a pasta e todo o seu conteúdo
            print(f"Pasta '{target_folder}' excluída com sucesso!")
        else:
            print(f"Pasta '{target_folder}' não encontrada.")
    except Exception as e:
        print(f"Ocorreu um erro ao excluir a pasta: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while deleting the directory: {str(e)}")

def delete_process_db(process_id, db):
    try:
        process = db.query(Process).filter(Process.id == process_id).first()
        if process:
            db.delete(process)
            db.commit()
            print(f"Processo '{process_id}' excluído com sucesso!")
        else:
            print(f"Processo '{process_id}' não encontrado.")
    except Exception as e:
        print(f"Ocorreu um erro ao excluir o processo: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while deleting the process: {str(e)}")
    
def update_process_title_db(num_process:str, new_title:str, db:Session, user_id: str):
    process = get_process_by_numprocess_db(num_process, db, user_id)
    if process:
        process.title = new_title
        process.updated_at = datetime.now()
        db.commit()
        db.refresh(process)
        return f"Título do processo '{num_process}' atualizado com sucesso!"
    else:
        return f"Processo '{num_process}' não encontrado."