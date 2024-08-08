from sqlalchemy import create_engine
from database import Base
from models.models import *

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/detectai"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

Base.metadata.create_all(bind=engine)

print("All tables created successfully!")