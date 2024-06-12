from models.models import Process
from sqlalchemy.orm import Session
from schemas.Process import ProcessSchema

def get_all_process_db(db: Session):
    return db.query(Process).all()

def get_process_by_numprocess_db(num_process: str, db:Session):
    return db.query(Process).filter(Process.num_process == num_process).first()

def create_process(process:ProcessSchema, status_id, db:Session):
    new_process = Process(
        status_id = status_id,
        num_process = process.num_process,
        responsible = process.responsible,
        date_of_creation = process.date_of_creation
    )

    db.add(new_process)
    db.commit()
    
    return new_process.id