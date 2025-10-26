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

# ---------------- POST: Vote for an Option ----------------
@router.post("/{poll_id}/vote/{option_id}", response_model=schemas.PollOut)
def vote_option(poll_id: int, option_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    option = db.query(models.Option).filter(models.Option.id == option_id, models.Option.poll_id == poll_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found in this poll")

    option.votes += 1
    db.commit()
    db.refresh(poll)
    return poll

# ---------------- POST: Like a Poll ----------------
@router.post("/{poll_id}/like", response_model=schemas.PollOut)
def like_poll(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    poll.likes += 1
    db.commit()
    db.refresh(poll)
    return poll

# ---------------- DELETE: Unlike a Poll ----------------
@router.delete("/{poll_id}/like", response_model=schemas.PollOut)
def delete_like(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    if poll.likes > 0:
        poll.likes -= 1
        db.commit()
        db.refresh(poll)
    return poll

# ---------------- DELETE: Delete Vote ----------------
@router.delete("/{poll_id}/vote/{option_id}", response_model=schemas.PollOut)
def delete_vote(poll_id: int, option_id: int, db: Session = Depends(get_db)):
    option = db.query(models.Option).filter(
        models.Option.id == option_id, models.Option.poll_id == poll_id
    ).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")
    if option.votes > 0:
        option.votes -= 1
        db.commit()
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    return poll


