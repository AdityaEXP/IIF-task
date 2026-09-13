from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import database
from app.core.config import FRONTEND_ORIGIN
from app.routes.auth.auth_route import router as auth_router
from app.routes.events.event_route import router as event_router
from app.routes.registrations.registration_route import router as registration_router

app = FastAPI(title="Campus Event Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(event_router)
app.include_router(registration_router)


@app.get("/")
async def root():
    return {"message": "Campus Event Management API is running"}


@app.on_event("startup")
async def startup():
    await database.connect()
    await database.init_db()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
