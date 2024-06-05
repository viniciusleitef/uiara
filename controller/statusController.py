from models.models import Status
from sqlalchemy.orm import Session

def create_status(db:Session):
    new_status = Status(
        description = "Em análise"
    )

    db.add(new_status)
    db.commit()

    return new_status.id