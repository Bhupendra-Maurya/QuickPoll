from fastapi import APIRouter, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from websocket_manager import manager  # ConnectionManager
from typing import List

router = APIRouter()


# ---------------- POST: Create Poll ----------------
@router.post("/", response_model=schemas.PollOut)
async def create_poll(poll: schemas.PollCreate, db: Session = Depends(get_db)):
    db_poll = models.Poll(question=poll.question)
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)

    for option in poll.options:
        db_option = models.Option(text=option.text, poll_id=db_poll.id)
        db.add(db_option)
    db.commit()
    db.refresh(db_poll)

    # Broadcast new poll
    await manager.broadcast({
        "event": "poll_created",
        "poll": schemas.PollOut.from_orm(db_poll).model_dump()
    })

    return db_poll


# ---------------- GET: List Polls ----------------
@router.get("/", response_model=List[schemas.PollOut])
async def get_polls(db: Session = Depends(get_db)):
    polls = db.query(models.Poll).all()
    return polls


# ---------------- POST: Vote for an Option ----------------
@router.post("/{poll_id}/vote/{option_id}", response_model=schemas.PollOut)
async def vote_option(poll_id: int, option_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    option = db.query(models.Option).filter(
        models.Option.id == option_id, models.Option.poll_id == poll_id
    ).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found in this poll")

    option.votes += 1
    db.commit()
    db.refresh(poll)

    # Broadcast updated poll
    await manager.broadcast({
        "event": "vote_update",
        "poll": schemas.PollOut.from_orm(poll).model_dump()
    })

    return poll


# ---------------- POST: Like a Poll ----------------
@router.post("/{poll_id}/like", response_model=schemas.PollOut)
async def like_poll(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    poll.likes += 1
    db.commit()
    db.refresh(poll)

    await manager.broadcast({
        "event": "like_update",
        "poll": schemas.PollOut.from_orm(poll).model_dump()
    })

    return poll


# ---------------- DELETE: Unlike a Poll ----------------
@router.delete("/{poll_id}/like", response_model=schemas.PollOut)
async def delete_like(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    if poll.likes > 0:
        poll.likes -= 1
        db.commit()
        db.refresh(poll)

        await manager.broadcast({
            "event": "like_update",
            "poll": schemas.PollOut.from_orm(poll).model_dump()
        })

    return poll


# ---------------- DELETE: Delete Vote ----------------
@router.delete("/{poll_id}/vote/{option_id}", response_model=schemas.PollOut)
async def delete_vote(poll_id: int, option_id: int, db: Session = Depends(get_db)):
    option = db.query(models.Option).filter(
        models.Option.id == option_id, models.Option.poll_id == poll_id
    ).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")

    if option.votes > 0:
        option.votes -= 1
        db.commit()

    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()

    await manager.broadcast({
        "event": "vote_update",
        "poll": schemas.PollOut.from_orm(poll).model_dump()
    })

    return poll



# ---------------- DELETE: Delete a Poll ----------------
@router.delete("/{poll_id}", response_model=dict)
async def delete_poll(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    db.delete(poll)
    db.commit()

    # Broadcast poll deletion
    await manager.broadcast({
        "event": "poll_deleted",
        "poll_id": poll_id
    })

    return {"detail": f"Poll {poll_id} deleted successfully"}


# ---------------- WebSocket Endpoint ----------------
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep connection alive
    except Exception:
        manager.disconnect(websocket)
    finally:
        manager.disconnect(websocket)
    return