from database import Base
from sqlalchemy import String, Integer, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

class Status(Base):
    __tablename__ = "status"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    description: Mapped[str] = mapped_column(String, nullable=False)

    process = relationship("Process", back_populates="status", uselist=False)

class Audio(Base):
    __tablename__ = 'audio'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    process_id: Mapped[int] = mapped_column(Integer, ForeignKey("process.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    classification: Mapped[bool] = mapped_column(Boolean, nullable=True)
    accuracy: Mapped[float] = mapped_column(Float, nullable=True)

    process = relationship("Process", back_populates="audio")

class Process(Base):
    __tablename__ = 'process'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    status_id: Mapped[int] = mapped_column(Integer, ForeignKey("status.id"), nullable=False)
    num_process: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    responsible: Mapped[str] = mapped_column(String, nullable=False)
    date_of_creation: Mapped[str] = mapped_column(String)

    status = relationship("Status", back_populates="process")
    audio = relationship("Audio", back_populates="process")
