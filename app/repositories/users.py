from typing import Optional, Dict, Any
import aiosqlite


async def create_user(conn: aiosqlite.Connection, name: str, age: Optional[int], gender: Optional[str]) -> Dict[str, Any]:
	cursor = await conn.execute(
		"""
		INSERT INTO Users (name, age, gender)
		VALUES (?, ?, ?)
		RETURNING user_id, name, age, gender, created_at
		""",
		(name, age, gender),
	)
	row = await cursor.fetchone()
	return dict(row)
