from dotenv import load_dotenv
from os import getenv
from fastapi import FastAPI
from database import Base, engine
import routes 
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="FastAPI")

allowed_origin  = getenv("VITE_FRONTEND_URL")


app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=allowed_origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(routes.router, prefix="/api/polls", tags=["Polls"])

@app.get("/")
def root():
    return {"message": "Welcome to QuickPoll API 🚀"}