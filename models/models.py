from database import Base
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

class Audio(Base):
    __tablename__ = 'audio'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    filename: Mapped[str] = mapped_column(String(55), nullable=False, unique=False)
    date_time: Mapped[str] = mapped_column(String(55), nullable=False)
    process_number: Mapped[str] = mapped_column(String(55), nullable=False, unique=True)
    politician: Mapped[str] = mapped_column(String(55), nullable=False)