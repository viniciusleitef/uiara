from models.models import Process
from sqlalchemy.orm import Session
from schemas.Process import ProcessSchema

def create_process(process:ProcessSchema, status_id, db:Session):
    new_process = Process(
        status_id = status_id,
        responsible = process.responsible,
        date_of_creation = process.date_of_creation
    )

    db.add(new_process)
    db.commit()
    
    return new_process.id