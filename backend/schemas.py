from pydantic import BaseModel
from typing import List, Optional

# ------------------ Option Schemas ------------------
class OptionBase(BaseModel):
    text: str

class OptionCreate(OptionBase):
    pass

class OptionOut(OptionBase):
    id: int
    votes: int

    # class Config:
        # orm_mode = True
    model_config = {"from_attributes": True}

# ------------------ Poll Schemas ------------------
class PollBase(BaseModel):
    question: str

class PollCreate(PollBase):
    options: List[OptionCreate]  # nested options

class PollOut(PollBase):
    id: int
    likes: int
    options: List[OptionOut] = []  # nested output

    # class Config:
    #     orm_mode = True
    model_config = {"from_attributes": True}