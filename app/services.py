from typing import Dict, Any, Optional, List

from .db import get_db_connection
from .repositories import users as users_repo
from .repositories import daily_metrics as metrics_repo
from .repositories import medications as meds_repo
from .repositories import disorders as disorders_repo
from .repositories import reports as reports_repo


# Users
async def add_user(name: str, age: Optional[int] = None, gender: Optional[str] = None) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await users_repo.create_user(conn, name=name, age=age, gender=gender)
		await conn.commit()
		return result


# Daily Metrics
async def add_daily_metric(
	user_id: int,
	date: str,
	steps: Optional[int] = None,
	heart_rate: Optional[int] = None,
	sleep_hours: Optional[float] = None,
	blood_pressure: Optional[str] = None,
	mood: Optional[str] = None,
	notes: Optional[str] = None,
) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await metrics_repo.create_daily_metric(
			conn,
			user_id=user_id,
			date=date,
			steps=steps,
			heart_rate=heart_rate,
			sleep_hours=sleep_hours,
			blood_pressure=blood_pressure,
			mood=mood,
			notes=notes,
		)
		await conn.commit()
		return result


# Medications
async def add_medication(name: str, dosage: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await meds_repo.create_medication(conn, name=name, dosage=dosage, description=description)
		await conn.commit()
		return result


async def add_user_medication(
	user_id: int,
	medication_id: int,
	start_date: str,
	end_date: Optional[str] = None,
	frequency: Optional[str] = None,
) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await meds_repo.create_user_medication(
			conn,
			user_id=user_id,
			medication_id=medication_id,
			start_date=start_date,
			end_date=end_date,
			frequency=frequency,
		)
		await conn.commit()
		return result


async def add_medication_schedule(
	user_med_id: int,
	date: str,
	time: str,
	status: Optional[str] = None,
) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await meds_repo.create_medication_schedule(conn, user_med_id=user_med_id, date=date, time=time, status=status)
		await conn.commit()
		return result


# Disorders
async def add_disorder(name: str, description: Optional[str] = None) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await disorders_repo.create_disorder(conn, name=name, description=description)
		await conn.commit()
		return result


async def add_user_disorder(
	user_id: int,
	disorder_id: int,
	diagnosed_date: str,
	resolved_date: Optional[str] = None,
) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await disorders_repo.create_user_disorder(
			conn,
			user_id=user_id,
			disorder_id=disorder_id,
			diagnosed_date=diagnosed_date,
			resolved_date=resolved_date,
		)
		await conn.commit()
		return result


# Reports
async def add_report(
	user_id: int,
	report_date: str,
	report_type: Optional[str] = None,
	content: Optional[str] = None,
) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await reports_repo.create_report(
			conn,
			user_id=user_id,
			report_date=report_date,
			report_type=report_type,
			content=content,
		)
		await conn.commit()
		return result


# Search functions - get all user data for a specific date
async def get_user_data_by_date(user_id: int, date: str) -> Dict[str, Any]:
	"""
	Get all user data for a specific date across all tables.
	Returns a dictionary with all relevant data grouped by table.
	"""
	async for conn in get_db_connection():
		# Get data from all tables that have user_id + date fields
		daily_metrics = await metrics_repo.get_user_metrics_by_date(conn, user_id, date)
		medication_schedule = await meds_repo.get_user_medication_schedule_by_date(conn, user_id, date)
		disorders = await disorders_repo.get_user_disorders_by_date(conn, user_id, date)
		reports = await reports_repo.get_user_reports_by_date(conn, user_id, date)
		
		return {
			"user_id": user_id,
			"date": date,
			"daily_metrics": daily_metrics,
			"medication_schedule": medication_schedule,
			"disorders": disorders,
			"reports": reports,
		}
