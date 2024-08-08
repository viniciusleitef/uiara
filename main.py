import uvicorn 
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from controller.statusController import create_status_db

from routes.process_routes import router as process_routes
from routes.audio_routes import router as audio_routes
# from routes.trained_models_routes import router as trained_models_routes
from routes.user_routes import router as users_routes

# Base.metadata.create_all(bind=engine) 
app = FastAPI()

origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(process_routes)
app.include_router(audio_routes)
# app.include_router(trained_models_routes)
app.include_router(users_routes)

@app.post("/createStatus")
def create_status(db: Session = Depends(get_db)):
    return create_status_db(db)

@app.get("/")
async def root():
    return {"message": "Hello world!"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        #host="192.168.0.117", 
        port=8302, 
        #ssl_keyfile="/usr/local/share/ca-certificates/private.key", 
        #ssl_certfile="/usr/local/share/ca-certificates/certificate.crt"
    )
