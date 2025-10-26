from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import  get_db
import models, schemas

router = APIRouter()

# ---------------- POST: Create Poll ----------------
@router.post("/", response_model=schemas.PollOut)
def create_poll(poll: schemas.PollCreate, db: Session = Depends(get_db)):
    # Create Poll
    db_poll = models.Poll(question=poll.question)
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)
    
    # Create Options
    for option in poll.options:
        db_option = models.Option(text=option.text, poll_id=db_poll.id)
        db.add(db_option)
    db.commit()
    db.refresh(db_poll)

    return db_poll

# ---------------- GET: List Polls ----------------
@router.get("/", response_model=list[schemas.PollOut])
def get_polls(db: Session = Depends(get_db)):
    polls = db.query(models.Poll).all()
    return polls
