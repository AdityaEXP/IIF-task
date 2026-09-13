from app.database.db import database


async def list_events(search: str | None, category: str | None):
    query = """
        SELECT e.*, COUNT(r.id) AS registered_count
        FROM events e
        LEFT JOIN registrations r ON r.event_id = e.id
        WHERE 1 = 1
    """
    params = []

    if search:
        params.append(f"%{search.lower()}%")
        query += f" AND (LOWER(e.title) LIKE ${len(params)} OR LOWER(e.description) LIKE ${len(params)})"

    if category:
        params.append(category)
        query += f" AND e.category = ${len(params)}"

    query += " GROUP BY e.id ORDER BY e.event_date ASC"

    async with database.pool.acquire() as connection:
        rows = await connection.fetch(query, *params)
        return rows


async def get_event_by_id(event_id: int):
    async with database.pool.acquire() as connection:
        return await connection.fetchrow(
            """
            SELECT e.*, COUNT(r.id) AS registered_count
            FROM events e
            LEFT JOIN registrations r ON r.event_id = e.id
            WHERE e.id = $1
            GROUP BY e.id
            """,
            event_id,
        )


async def create_event(data, created_by: int):
    async with database.pool.acquire() as connection:
        row = await connection.fetchrow(
            """
            INSERT INTO events (title, description, category, location, event_date, event_time, capacity, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *, 0 AS registered_count
            """,
            data.title, data.description, data.category, data.location,
            data.event_date, data.event_time, data.capacity, created_by,
        )
        return row


async def update_event(event_id: int, data):
    fields = data.dict(exclude_unset=True)
    if not fields:
        return await get_event_by_id(event_id)

    set_parts = []
    params = []
    for key, value in fields.items():
        params.append(value)
        set_parts.append(f"{key} = ${len(params)}")

    params.append(event_id)
    query = f"UPDATE events SET {', '.join(set_parts)} WHERE id = ${len(params)}"

    async with database.pool.acquire() as connection:
        await connection.execute(query, *params)

    return await get_event_by_id(event_id)


async def delete_event(event_id: int):
    async with database.pool.acquire() as connection:
        result = await connection.execute("DELETE FROM events WHERE id = $1", event_id)
        return result != "DELETE 0"


async def get_participants(event_id: int):
    async with database.pool.acquire() as connection:
        return await connection.fetch(
            """
            SELECT u.id, u.username, u.email, r.registered_at
            FROM registrations r
            JOIN users u ON u.id = r.user_id
            WHERE r.event_id = $1
            ORDER BY r.registered_at ASC
            """,
            event_id,
        )
