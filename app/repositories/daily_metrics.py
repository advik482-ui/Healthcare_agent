from typing import Optional, Dict, Any, List
import aiosqlite


async def create_daily_metric(
	conn: aiosqlite.Connection,
	user_id: int,
	date: str,
	steps: Optional[int] = None,
	heart_rate: Optional[int] = None,
	sleep_hours: Optional[float] = None,
	blood_pressure: Optional[str] = None,
	mood: Optional[str] = None,
	notes: Optional[str] = None,
) -> Dict[str, Any]:
	cursor = await conn.execute(
		"""
		INSERT INTO DailyMetrics (
			user_id, date, steps, heart_rate, sleep_hours, blood_pressure, mood, notes
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		RETURNING metric_id, user_id, date, steps, heart_rate, sleep_hours, blood_pressure, mood, notes
		""",
		(user_id, date, steps, heart_rate, sleep_hours, blood_pressure, mood, notes),
	)
	row = await cursor.fetchone()
	return dict(row)


async def get_user_metrics_by_date(conn: aiosqlite.Connection, user_id: int, date: str) -> List[Dict[str, Any]]:
	cursor = await conn.execute(
		"""
		SELECT metric_id, user_id, date, steps, heart_rate, sleep_hours, blood_pressure, mood, notes
		FROM DailyMetrics
		WHERE user_id = ? AND date = ?
		""",
		(user_id, date),
	)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]
async def save_user_tokens(
    conn: aiosqlite.Connection,
    user_id: int,
    access_token: str,
    refresh_token: Optional[str] = None,
    expiry: Optional[str] = None,
) -> Dict[str, Any]:
    cursor = await conn.execute(
        """
        INSERT INTO UserTokens (
            user_id, access_token, refresh_token, expires_at
        ) VALUES (?, ?, ?, ?)
        RETURNING token_id, user_id, access_token, refresh_token, expires_at, created_at
        """,
        (user_id, access_token, refresh_token, expiry),
    )
    row = await cursor.fetchone()
    await conn.commit()
    return dict(row)
