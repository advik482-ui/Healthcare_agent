from typing import Optional, Dict, Any, List
import aiosqlite


async def create_notification(
	conn: aiosqlite.Connection,
	user_id: int,
	title: str,
	message: str,
	notification_type: Optional[str] = None,
) -> Dict[str, Any]:
	"""Create a notification for a specific user"""
	cursor = await conn.execute(
		"""
		INSERT INTO Notifications (user_id, title, message, notification_type)
		VALUES (?, ?, ?, ?)
		RETURNING notification_id, user_id, title, message, notification_type, is_read, created_at
		""",
		(user_id, title, message, notification_type),
	)
	row = await cursor.fetchone()
	return dict(row)


async def get_user_notifications(
	conn: aiosqlite.Connection,
	user_id: int,
	unread_only: bool = False,
	limit: Optional[int] = None,
) -> List[Dict[str, Any]]:
	"""Get notifications for a specific user"""
	query = """
		SELECT notification_id, user_id, title, message, notification_type, is_read, created_at
		FROM Notifications
		WHERE user_id = ?
	"""
	
	params = [user_id]
	
	if unread_only:
		query += " AND is_read = FALSE"
	
	query += " ORDER BY created_at DESC"
	
	if limit:
		query += f" LIMIT {limit}"
	
	cursor = await conn.execute(query, params)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]


async def mark_notification_read(
	conn: aiosqlite.Connection,
	notification_id: int,
	user_id: int,
) -> bool:
	"""Mark a specific notification as read for a user"""
	cursor = await conn.execute(
		"""
		UPDATE Notifications 
		SET is_read = TRUE 
		WHERE notification_id = ? AND user_id = ?
		""",
		(notification_id, user_id),
	)
	return cursor.rowcount > 0


async def mark_all_notifications_read(
	conn: aiosqlite.Connection,
	user_id: int,
) -> int:
	"""Mark all notifications as read for a user"""
	cursor = await conn.execute(
		"""
		UPDATE Notifications 
		SET is_read = TRUE 
		WHERE user_id = ? AND is_read = FALSE
		""",
		(user_id,),
	)
	return cursor.rowcount


async def get_unread_notification_count(
	conn: aiosqlite.Connection,
	user_id: int,
) -> int:
	"""Get count of unread notifications for a user"""
	cursor = await conn.execute(
		"""
		SELECT COUNT(*) as count
		FROM Notifications
		WHERE user_id = ? AND is_read = FALSE
		""",
		(user_id,),
	)
	row = await cursor.fetchone()
	return row['count'] if row else 0


async def delete_notification(
	conn: aiosqlite.Connection,
	notification_id: int,
	user_id: int,
) -> bool:
	"""Delete a specific notification for a user"""
	cursor = await conn.execute(
		"""
		DELETE FROM Notifications 
		WHERE notification_id = ? AND user_id = ?
		""",
		(notification_id, user_id),
	)
	return cursor.rowcount > 0
