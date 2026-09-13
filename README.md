# Campus Event Management Platform

A website where students can browse events happening in college, register for
them, and keep track of what they signed up for. Event organizers get a
dashboard to add/edit/delete events and see who registered.

## Tech Stack

- Backend: FastAPI + PostgreSQL (raw SQL using asyncpg, JWT based auth)
- Frontend: React (Vite) with plain CSS, no UI library

## Folder Structure

```
backend/
  app/
    core/            -> env config
    database/        -> db connection + table creation queries
    routes/
      auth/           -> auth_route.py + auth_service.py
      events/         -> event_route.py + event_service.py
      registrations/  -> registration_route.py + registration_service.py
    schemas/          -> pydantic request/response models
    main.py
frontend/
  src/
    components/       -> reusable UI pieces (Navbar, EventCard, modals, etc.)
    pages/            -> Home, Events, Schedule, Login, Signup, Dashboard, AdminDashboard
    context/          -> AuthContext (login/signup/logout state)
    api.js            -> fetch wrapper
```

## Running the backend

1. Create a PostgreSQL database, e.g. `campus_events`.
2. `cd backend`
3. `python -m venv venv` then activate it
4. `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and fill in your DB_URL and SECRET_KEY
6. `uvicorn app.main:app --reload`

The API runs on `http://localhost:8000`. Tables are created automatically on
startup, no manual migration needed.

## Running the frontend

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env` (default API URL already points to localhost:8000)
4. `npm run dev`

The site runs on `http://localhost:5173`.

## Becoming an organizer/admin

While signing up, click "Are you an event organizer?" and enter the
organizer code set in `backend/.env` as `ADMIN_CODE`. Accounts created with
the correct code get admin access and can manage events from `/admin`.

## Notes

- A user can only register once per event (checked in the backend and also
  enforced with a unique constraint in the database).
- Event capacity is optional; if set, registration closes automatically once
  the event is full.
