import aiosqlite
from pathlib import Path
from typing import AsyncIterator

DB_PATH = Path("data/db.sqlite3")
SCHEMA_PATH = Path(__file__).parent / "schema.sql"


async def ensure_database_initialized() -> None:
	DB_PATH.parent.mkdir(parents=True, exist_ok=True)
	async with aiosqlite.connect(DB_PATH.as_posix()) as db:
		await db.execute("PRAGMA foreign_keys = ON;")
		schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
		await db.executescript(schema_sql)
		await db.commit()


async def get_db_connection() -> AsyncIterator[aiosqlite.Connection]:
	conn = await aiosqlite.connect(DB_PATH.as_posix())
	await conn.execute("PRAGMA foreign_keys = ON;")
	conn.row_factory = aiosqlite.Row
	try:
		yield conn
	finally:
		await conn.close()
