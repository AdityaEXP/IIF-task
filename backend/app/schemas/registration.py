from pydantic import BaseModel


class RegistrationCreate(BaseModel):
    event_id: int


class RegistrationOut(BaseModel):
    id: int
    event_id: int
    title: str
    event_date: str
    event_time: str
    location: str
    registered_at: str
