from fastapi import HTTPException
from models.models import Process
from sqlalchemy.orm import Session
from schemas.Process import ProcessSchema
from controller.audioController import get_audios_by_process_id_bd, delete_audios_bd
import shutil
import os

def get_process_by_process_id(process_id, db):
    return db.query(Process).filter(Process.id == process_id).first()

def get_all_process_db(db: Session):
    update_all_processes_status(db)
    return db.query(Process).all()

def get_all_processes_with_audios_db(db: Session):
    update_all_processes_status(db)
    processes = get_all_process_db(db)
    response = []
    for process in processes:
        process_dict = process.__dict__
        audios = get_audios_by_process_id_bd(process.id, db)
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

def get_process_by_numprocess_db(num_process: str, db:Session):
    return db.query(Process).filter(Process.num_process == num_process).first()

def update_process_status_db(process_status:int , process:Process, db:Session):
    process.status_id = process_status
    db.commit()
    db.refresh(process)
    return 

def update_process_status(process:Process, db:Session):
    audioList = get_audios_by_process_id_bd(process.id, db)
    process_status = verify_status(audioList)
    update_process_status_db(process_status, process, db)
    return {"message":"Process updated"}

def update_all_processes_status(db:Session):
    data = db.query(Process).all()
    for process in data:
        update_process_status(process, db)
    return {"message":"Processes updated"}

def create_process(process:ProcessSchema, status_id:int, db:Session):
    new_process = Process(
        status_id = status_id,
        num_process = process.num_process,
        responsible = process.responsible,
        date_of_creation = process.date_of_creation
    )

    db.add(new_process)
    db.commit()
    
    return new_process.id

async def delete_process_by_numprocess(num_process:str, base_filepath:str, db:Session):
    # Pegando process para pegar o id
    process = get_process_by_numprocess_db(num_process, db)

    await delete_process_dir(process.id, base_filepath)
    delete_audios_bd(process.id, db)
    delete_process_bd(process.id, db)
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

def delete_process_bd(process_id, db):
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