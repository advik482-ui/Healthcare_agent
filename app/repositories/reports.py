from typing import Optional, Dict, Any, List
import aiosqlite


async def create_report(
	conn: aiosqlite.Connection,
	user_id: int,
	report_date: str,
	report_type: Optional[str] = None,
	content: Optional[str] = None,
) -> Dict[str, Any]:
	cursor = await conn.execute(
		"""
		INSERT INTO Reports (user_id, report_date, report_type, content)
		VALUES (?, ?, ?, ?)
		RETURNING report_id, user_id, report_date, report_type, content
		""",
		(user_id, report_date, report_type, content),
	)
	row = await cursor.fetchone()
	return dict(row)


async def get_user_reports_by_date(conn: aiosqlite.Connection, user_id: int, date: str) -> List[Dict[str, Any]]:
	cursor = await conn.execute(
		"""
		SELECT report_id, user_id, report_date, report_type, content
		FROM Reports
		WHERE user_id = ? AND report_date = ?
		ORDER BY report_id DESC
		""",
		(user_id, date),
	)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]
