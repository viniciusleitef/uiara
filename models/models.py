from database import Base
from sqlalchemy import String, Integer, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column

class Judge(Base):
    __tablename__ = 'judge'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(55), nullable=False)
    email: Mapped[str] = mapped_column(String(55), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(55), nullable=False, unique=False)

class Audio(Base):
    __tablename__ = 'audio'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    filename: Mapped[str] = mapped_column(String(55), nullable=False, unique=True)
