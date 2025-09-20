from typing import Optional, Dict, Any, List
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


async def get_user_profile(conn: aiosqlite.Connection, user_id: int) -> Optional[Dict[str, Any]]:
	"""Get comprehensive user profile by user_id"""
	cursor = await conn.execute(
		"""
		SELECT * FROM Users WHERE user_id = ?
		""",
		(user_id,),
	)
	row = await cursor.fetchone()
	return dict(row) if row else None


async def get_all_users(conn: aiosqlite.Connection) -> List[Dict[str, Any]]:
	"""Get all users for UI dropdown"""
	cursor = await conn.execute(
		"""
		SELECT user_id, name, age, gender, email FROM Users ORDER BY name
		"""
	)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]


async def update_user_profile(
	conn: aiosqlite.Connection,
	user_id: int,
	**kwargs
) -> Optional[Dict[str, Any]]:
	"""Update user profile with any provided fields"""
	# Build dynamic update query
	update_fields = []
	values = []
	
	for field, value in kwargs.items():
		if value is not None:
			update_fields.append(f"{field} = ?")
			values.append(value)
	
	if not update_fields:
		return None
	
	values.append(user_id)
	query = f"""
		UPDATE Users 
		SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = ?
		RETURNING *
	"""
	
	cursor = await conn.execute(query, values)
	row = await cursor.fetchone()
	return dict(row) if row else None
