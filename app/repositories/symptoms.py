from typing import Optional, Dict, Any, List
import aiosqlite


async def add_symptom_log(
	conn: aiosqlite.Connection,
	user_id: int,
	symptom: str,
	severity: Optional[str] = None,
	duration: Optional[str] = None,
	notes: Optional[str] = None,
) -> Dict[str, Any]:
	"""Log a new symptom for a user"""
	cursor = await conn.execute(
		"""
		INSERT INTO Symptoms (user_id, symptom, severity, duration, notes)
		VALUES (?, ?, ?, ?, ?)
		RETURNING symptom_id, user_id, symptom, severity, duration, notes, log_date
		""",
		(user_id, symptom, severity, duration, notes),
	)
	row = await cursor.fetchone()
	return dict(row)


async def get_user_symptoms(
	conn: aiosqlite.Connection,
	user_id: int,
	limit: Optional[int] = None,
) -> List[Dict[str, Any]]:
	"""Get symptoms for a user, optionally limited by count"""
	query = """
		SELECT symptom_id, user_id, symptom, severity, duration, notes, log_date
		FROM Symptoms
		WHERE user_id = ?
		ORDER BY log_date DESC
	"""
	
	if limit:
		query += f" LIMIT {limit}"
	
	cursor = await conn.execute(query, (user_id,))
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]


async def get_recent_symptoms(
	conn: aiosqlite.Connection,
	user_id: int,
	days: int = 7,
) -> List[Dict[str, Any]]:
	"""Get symptoms from the last N days"""
	cursor = await conn.execute(
		"""
		SELECT symptom_id, user_id, symptom, severity, duration, notes, log_date
		FROM Symptoms
		WHERE user_id = ? AND log_date >= datetime('now', '-{} days')
		ORDER BY log_date DESC
		""".format(days),
		(user_id,),
	)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]
