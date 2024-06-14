from models.models import Status
from sqlalchemy.orm import Session
from schemas.Status import StatusSchema

def get_all_status_db(db: Session):
    return db.query(Status).all()

def create_status_db(db:Session):
    status_analise = Status(
        description = "Em análise"
    )

    status_false = Status(
        description = "Falso"
    )

    status_true = Status(
        description = "Verdadeiro"
    )

    db.add(status_analise)
    db.add(status_false)
    db.add(status_true)
    
    db.commit()

    return {"message": "status cadastrados"}

def update_status_db(status_id: int, status: str, db: Session):
    updated_status = db.query(Status).filter(Status.id == status_id).first()
    if updated_status:
        updated_status.description = status
        db.commit()
        db.refresh(updated_status)
        return updated_status
    return None