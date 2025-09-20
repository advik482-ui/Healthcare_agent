from typing import Optional, Dict, Any, List
import aiosqlite


async def create_alert(
	conn: aiosqlite.Connection,
	user_id: int,
	alert_type: str,
	title: str,
	message: str,
	alert_time: str,
) -> Dict[str, Any]:
	"""Create an alert for a specific user"""
	cursor = await conn.execute(
		"""
		INSERT INTO Alerts (user_id, alert_type, title, message, alert_time)
		VALUES (?, ?, ?, ?, ?)
		RETURNING alert_id, user_id, alert_type, title, message, alert_time, is_active, created_at
		""",
		(user_id, alert_type, title, message, alert_time),
	)
	row = await cursor.fetchone()
	return dict(row)


async def get_user_alerts(
	conn: aiosqlite.Connection,
	user_id: int,
	active_only: bool = True,
	limit: Optional[int] = None,
) -> List[Dict[str, Any]]:
	"""Get alerts for a specific user"""
	query = """
		SELECT alert_id, user_id, alert_type, title, message, alert_time, is_active, created_at
		FROM Alerts
		WHERE user_id = ?
	"""
	
	params = [user_id]
	
	if active_only:
		query += " AND is_active = TRUE"
	
	query += " ORDER BY alert_time ASC"
	
	if limit:
		query += f" LIMIT {limit}"
	
	cursor = await conn.execute(query, params)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]


async def get_upcoming_alerts(
	conn: aiosqlite.Connection,
	user_id: int,
	hours_ahead: int = 24,
) -> List[Dict[str, Any]]:
	"""Get upcoming alerts for a user within specified hours"""
	cursor = await conn.execute(
		"""
		SELECT alert_id, user_id, alert_type, title, message, alert_time, is_active, created_at
		FROM Alerts
		WHERE user_id = ? 
		AND is_active = TRUE 
		AND alert_time BETWEEN datetime('now') AND datetime('now', '+{} hours')
		ORDER BY alert_time ASC
		""".format(hours_ahead),
		(user_id,),
	)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]


async def update_alert(
	conn: aiosqlite.Connection,
	alert_id: int,
	user_id: int,
	**kwargs
) -> Optional[Dict[str, Any]]:
	"""Update an alert for a user"""
	# Build dynamic update query
	update_fields = []
	values = []
	
	for field, value in kwargs.items():
		if value is not None:
			update_fields.append(f"{field} = ?")
			values.append(value)
	
	if not update_fields:
		return None
	
	values.extend([alert_id, user_id])
	query = f"""
		UPDATE Alerts 
		SET {', '.join(update_fields)}
		WHERE alert_id = ? AND user_id = ?
		RETURNING alert_id, user_id, alert_type, title, message, alert_time, is_active, created_at
	"""
	
	cursor = await conn.execute(query, values)
	row = await cursor.fetchone()
	return dict(row) if row else None


async def deactivate_alert(
	conn: aiosqlite.Connection,
	alert_id: int,
	user_id: int,
) -> bool:
	"""Deactivate an alert for a user"""
	cursor = await conn.execute(
		"""
		UPDATE Alerts 
		SET is_active = FALSE 
		WHERE alert_id = ? AND user_id = ?
		""",
		(alert_id, user_id),
	)
	return cursor.rowcount > 0


async def delete_alert(
	conn: aiosqlite.Connection,
	alert_id: int,
	user_id: int,
) -> bool:
	"""Delete an alert for a user"""
	cursor = await conn.execute(
		"""
		DELETE FROM Alerts 
		WHERE alert_id = ? AND user_id = ?
		""",
		(alert_id, user_id),
	)
	return cursor.rowcount > 0


async def get_active_alert_count(
	conn: aiosqlite.Connection,
	user_id: int,
) -> int:
	"""Get count of active alerts for a user"""
	cursor = await conn.execute(
		"""
		SELECT COUNT(*) as count
		FROM Alerts
		WHERE user_id = ? AND is_active = TRUE
		""",
		(user_id,),
	)
	row = await cursor.fetchone()
	return row['count'] if row else 0
