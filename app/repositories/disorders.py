from typing import Optional, Dict, Any, List
import aiosqlite


async def create_disorder(conn: aiosqlite.Connection, name: str, description: Optional[str]) -> Dict[str, Any]:
	cursor = await conn.execute(
		"""
		INSERT INTO Disorders (name, description)
		VALUES (?, ?)
		RETURNING disorder_id, name, description
		""",
		(name, description),
	)
	row = await cursor.fetchone()
	return dict(row)


async def create_user_disorder(
	conn: aiosqlite.Connection,
	user_id: int,
	disorder_id: int,
	diagnosed_date: str,
	resolved_date: Optional[str] = None,
) -> Dict[str, Any]:
	cursor = await conn.execute(
		"""
		INSERT INTO UserDisorders (user_id, disorder_id, diagnosed_date, resolved_date)
		VALUES (?, ?, ?, ?)
		RETURNING user_disorder_id, user_id, disorder_id, diagnosed_date, resolved_date
		""",
		(user_id, disorder_id, diagnosed_date, resolved_date),
	)
	row = await cursor.fetchone()
	return dict(row)


async def get_user_disorders_by_date(conn: aiosqlite.Connection, user_id: int, date: str) -> List[Dict[str, Any]]:
	cursor = await conn.execute(
		"""
		SELECT 
			ud.user_disorder_id, ud.user_id, ud.disorder_id, ud.diagnosed_date, ud.resolved_date,
			d.name as disorder_name, d.description
		FROM UserDisorders ud
		JOIN Disorders d ON ud.disorder_id = d.disorder_id
		WHERE ud.user_id = ? AND (ud.diagnosed_date = ? OR ud.resolved_date = ?)
		ORDER BY ud.diagnosed_date DESC
		""",
		(user_id, date, date),
	)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]
