from database import Base
from sqlalchemy import String, Integer, Boolean, Float, Date, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy import String, Integer, Boolean, Float, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from datetime import datetime


class Status(Base):
    __tablename__ = "status"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    description: Mapped[str] = mapped_column(String, nullable=False)

    process = relationship("Process", back_populates="status", uselist=False)

class Audio(Base):
    __tablename__ = 'audio'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    process_id: Mapped[int] = mapped_column(Integer, ForeignKey("process.id"), nullable=False)
    trained_model_id: Mapped[int] = mapped_column(Integer, ForeignKey("trained_models.id"), nullable=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    classification: Mapped[bool] = mapped_column(Boolean, nullable=True)
    accuracy: Mapped[float] = mapped_column(Float, nullable=True)
    audio_duration: Mapped[float] = mapped_column(Float, nullable=False, unique=False)
    sample_rate: Mapped[float] = mapped_column(Float, nullable=False, unique=False)
    snr: Mapped[float] = mapped_column(Float, nullable=False, unique= False)
    specialist_analysis = mapped_column(String, nullable=True, unique=False)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    process = relationship("Process", back_populates="audio")
    trained_model = relationship("TrainedModels", back_populates="audio")

class Process(Base):
    __tablename__ = 'process'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    status_id: Mapped[int] = mapped_column(Integer, ForeignKey("status.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    num_process: Mapped[str] = mapped_column(String, nullable=False, unique=False)
    responsible: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    
    status = relationship("Status", back_populates="process")
    audio = relationship("Audio", back_populates="process")
    user = relationship("User", back_populates="processes")

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, nullable=False, unique=False)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False, unique=False)
    created_at: Mapped[str] = mapped_column(Date)
    updated_at: Mapped[str] = mapped_column(Date)
    verification_code = mapped_column(String(30), nullable=True)
    verification_expires_at = mapped_column(DateTime(timezone=True), nullable=True)
    is_verified = mapped_column(Boolean, default=False)
    last_login = mapped_column(DateTime, nullable=True)

    processes = relationship("Process", back_populates="user")

class TrainedModels(Base):
    __tablename__ = 'trained_models'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    model_name: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[str] = mapped_column(String(30), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    file_path: Mapped[str] = mapped_column(String(255))
    accuracy: Mapped[float] = mapped_column(Float, nullable=True)
    loss: Mapped[float] = mapped_column(Float, nullable=True)
    status: Mapped[bool] = mapped_column(Boolean, default=False, server_default='0')
    created_at: Mapped[str] = mapped_column(Date)
    updated_at: Mapped[str] = mapped_column(Date)

    audio = relationship("Audio", back_populates="trained_model")

    __table_args__ = (UniqueConstraint('model_name', 'version', name='uix_model_version'),)