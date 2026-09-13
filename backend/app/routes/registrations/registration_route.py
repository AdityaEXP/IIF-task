from fastapi import APIRouter, HTTPException, Depends

from app.schemas.registration import RegistrationCreate, RegistrationOut
from app.routes.auth.auth_service import get_current_user
from app.routes.registrations.registration_service import (
    register_for_event,
    list_my_registrations,
    cancel_registration,
)

router = APIRouter(prefix="/registrations", tags=["registrations"])


@router.post("")
async def register(data: RegistrationCreate, current_user=Depends(get_current_user)):
    result = await register_for_event(current_user["id"], data.event_id)

    if result == "not_found":
        raise HTTPException(status_code=404, detail="Event not found")
    if result == "full":
        raise HTTPException(status_code=400, detail="This event is already full")
    if result == "already_registered":
        raise HTTPException(status_code=400, detail="You are already registered for this event")

    return {"message": "Registered successfully"}


@router.get("/me", response_model=list[RegistrationOut])
async def my_registrations(current_user=Depends(get_current_user)):
    rows = await list_my_registrations(current_user["id"])
    return [
        RegistrationOut(
            id=r["id"],
            event_id=r["event_id"],
            title=r["title"],
            event_date=str(r["event_date"]),
            event_time=r["event_time"] or "",
            location=r["location"] or "",
            registered_at=str(r["registered_at"]),
        )
        for r in rows
    ]


@router.delete("/{event_id}")
async def unregister(event_id: int, current_user=Depends(get_current_user)):
    cancelled = await cancel_registration(current_user["id"], event_id)
    if not cancelled:
        raise HTTPException(status_code=404, detail="Registration not found")
    return {"message": "Registration cancelled"}
