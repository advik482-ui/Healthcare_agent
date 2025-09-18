from typing import Optional, Dict, Any, List
import aiosqlite


async def create_medication(conn: aiosqlite.Connection, name: str, dosage: Optional[str], description: Optional[str]) -> Dict[str, Any]:
	cursor = await conn.execute(
		"""
		INSERT INTO Medications (name, dosage, description)
		VALUES (?, ?, ?)
		RETURNING medication_id, name, dosage, description
		""",
		(name, dosage, description),
	)
	row = await cursor.fetchone()
	return dict(row)


async def create_user_medication(
	conn: aiosqlite.Connection,
	user_id: int,
	medication_id: int,
	start_date: str,
	end_date: Optional[str],
	frequency: Optional[str],
) -> Dict[str, Any]:
	cursor = await conn.execute(
		"""
		INSERT INTO UserMedications (user_id, medication_id, start_date, end_date, frequency)
		VALUES (?, ?, ?, ?, ?)
		RETURNING user_med_id, user_id, medication_id, start_date, end_date, frequency
		""",
		(user_id, medication_id, start_date, end_date, frequency),
	)
	row = await cursor.fetchone()
	return dict(row)


async def create_medication_schedule(
	conn: aiosqlite.Connection,
	user_med_id: int,
	date: str,
	time: str,
	status: Optional[str] = None,
) -> Dict[str, Any]:
	cursor = await conn.execute(
		"""
		INSERT INTO MedicationSchedule (user_med_id, date, time, status)
		VALUES (?, ?, ?, COALESCE(?, 'pending'))
		RETURNING schedule_id, user_med_id, date, time, status
		""",
		(user_med_id, date, time, status),
	)
	row = await cursor.fetchone()
	return dict(row)


async def get_user_medication_schedule_by_date(conn: aiosqlite.Connection, user_id: int, date: str) -> List[Dict[str, Any]]:
	cursor = await conn.execute(
		"""
		SELECT 
			ms.schedule_id, ms.user_med_id, ms.date, ms.time, ms.status,
			m.name as medication_name, m.dosage, m.description,
			um.frequency
		FROM MedicationSchedule ms
		JOIN UserMedications um ON ms.user_med_id = um.user_med_id
		JOIN Medications m ON um.medication_id = m.medication_id
		WHERE um.user_id = ? AND ms.date = ?
		ORDER BY ms.time
		""",
		(user_id, date),
	)
	rows = await cursor.fetchall()
	return [dict(row) for row in rows]
