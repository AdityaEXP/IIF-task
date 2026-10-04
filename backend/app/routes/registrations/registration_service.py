import asyncpg

from app.database.db import database


async def register_for_event(user_id: int, event_id: int):
    async with database.pool.acquire() as connection:
        async with connection.transaction():
            event = await connection.fetchrow("SELECT * FROM events WHERE id = $1 FOR UPDATE", event_id)
            if not event:
                return "not_found"

            if event["capacity"] is not None:
                count_row = await connection.fetchrow(
                    "SELECT COUNT(*) AS total FROM registrations WHERE event_id = $1", event_id
                )
                if count_row["total"] >= event["capacity"]:
                    return "full"

            try:
                await connection.execute(
                    "INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)",
                    user_id, event_id,
                )
                return "ok"
            except asyncpg.UniqueViolationError:
                return "already_registered"


async def list_my_registrations(user_id: int):
    async with database.pool.acquire() as connection:
        return await connection.fetch(
            """
            SELECT r.id, e.id AS event_id, e.title, e.event_date, e.event_time, e.location, r.registered_at
            FROM registrations r
            JOIN events e ON e.id = r.event_id
            WHERE r.user_id = $1
            ORDER BY e.event_date ASC
            """,
            user_id,
        )


async def cancel_registration(user_id: int, event_id: int):
    async with database.pool.acquire() as connection:
        result = await connection.execute(
            "DELETE FROM registrations WHERE user_id = $1 AND event_id = $2",
            user_id, event_id,
        )
        return result != "DELETE 0"
