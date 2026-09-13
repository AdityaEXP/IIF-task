import asyncio
import asyncpg

from app.core.config import DB_URL
from app.database.sql import ALL_QUERY


class Postgres:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.pool = None

    async def connect(self):
        for attempt in range(5):
            try:
                self.pool = await asyncpg.create_pool(
                    dsn=self.database_url,
                    min_size=1,
                    max_size=10,
                )
                print("Database connected")
                return
            except Exception as e:
                print(f"Database connection failed ({e}), retrying in 2s...")
                await asyncio.sleep(2)

        raise Exception("Could not connect to the database")

    async def disconnect(self):
        if self.pool:
            await self.pool.close()

    async def init_db(self):
        async with self.pool.acquire() as connection:
            for query in ALL_QUERY:
                await connection.execute(query)


database = Postgres(DB_URL)
