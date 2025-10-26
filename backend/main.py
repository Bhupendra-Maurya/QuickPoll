from fastapi import FastAPI
from database import Base, engine
import routes 

app = FastAPI(title="FastAPI")

# Create all tables
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(routes.router, prefix="/api/v1", tags=["Polls"])

@app.get("/")
def root():
    return {"message": "Welcome to QuickPoll API 🚀"}