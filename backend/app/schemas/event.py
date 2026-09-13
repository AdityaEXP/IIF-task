from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: Optional[str] = ""
    category: str = Field(..., min_length=2, max_length=50)
    location: str = Field(..., min_length=2, max_length=150)
    event_date: date
    event_time: str = Field(..., min_length=1, max_length=20)
    capacity: Optional[int] = None


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[date] = None
    event_time: Optional[str] = None
    capacity: Optional[int] = None


class EventOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    location: Optional[str]
    event_date: date
    event_time: Optional[str]
    capacity: Optional[int]
    created_by: Optional[int]
    registered_count: int = 0


class ParticipantOut(BaseModel):
    id: int
    username: str
    email: str
    registered_at: str
