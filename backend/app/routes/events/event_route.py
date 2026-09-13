from typing import Optional
from fastapi import APIRouter, HTTPException, Depends

from app.schemas.event import EventCreate, EventUpdate, EventOut, ParticipantOut
from app.routes.auth.auth_service import get_current_user, require_admin
from app.routes.events.event_service import (
    list_events,
    get_event_by_id,
    create_event,
    update_event,
    delete_event,
    get_participants,
)

router = APIRouter(prefix="/events", tags=["events"])


def _row_to_event(row) -> EventOut:
    return EventOut(**dict(row))


@router.get("", response_model=list[EventOut])
async def get_events(search: Optional[str] = None, category: Optional[str] = None):
    rows = await list_events(search, category)
    return [_row_to_event(r) for r in rows]


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int):
    row = await get_event_by_id(event_id)
    if not row:
        raise HTTPException(status_code=404, detail="Event not found")
    return _row_to_event(row)


@router.post("", response_model=EventOut)
async def add_event(data: EventCreate, current_user=Depends(require_admin)):
    row = await create_event(data, current_user["id"])
    return _row_to_event(row)


@router.put("/{event_id}", response_model=EventOut)
async def edit_event(event_id: int, data: EventUpdate, current_user=Depends(require_admin)):
    existing = await get_event_by_id(event_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")

    row = await update_event(event_id, data)
    return _row_to_event(row)


@router.delete("/{event_id}")
async def remove_event(event_id: int, current_user=Depends(require_admin)):
    deleted = await delete_event(event_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}


@router.get("/{event_id}/participants", response_model=list[ParticipantOut])
async def event_participants(event_id: int, current_user=Depends(require_admin)):
    rows = await get_participants(event_id)
    return [
        ParticipantOut(
            id=r["id"],
            username=r["username"],
            email=r["email"],
            registered_at=str(r["registered_at"]),
        )
        for r in rows
    ]
