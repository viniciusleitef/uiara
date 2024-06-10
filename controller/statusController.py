from models.models import Status
from sqlalchemy.orm import Session
from schemas.Status import StatusSchema

def get_all_status_db(db: Session):
    return db.query(Status).all()

def create_status_db(db:Session):
    new_status = Status(
        description = "Em análise"
    )

    db.add(new_status)
    db.commit()

    return new_status.id

def update_status_db(status_id: int, status: str, db: Session):
    updated_status = db.query(Status).filter(Status.id == status_id).first()
    if updated_status:
        updated_status.description = status
        db.commit()
        db.refresh(updated_status)
        return updated_status
    return None