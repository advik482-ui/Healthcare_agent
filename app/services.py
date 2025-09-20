from typing import Dict, Any, Optional, List

from db import get_db_connection
from repositories import users as users_repo
from repositories import daily_metrics as metrics_repo
from repositories import medications as meds_repo
from repositories import disorders as disorders_repo
from repositories import reports as reports_repo
from repositories import symptoms as symptoms_repo


# Users
async def add_user(name: str, age: Optional[int] = None, gender: Optional[str] = None) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await users_repo.create_user(conn, name=name, age=age, gender=gender)
		await conn.commit()
		return result


# Daily Metrics

async def add_user_tokens(
    user_id: int,
    access_token: str,
    refresh_token: Optional[str] = None,
    expiry: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Wrapper function to save user OAuth tokens in the database.
    """
    async for conn in get_db_connection():
        result = await metrics_repo.save_user_tokens(
            conn,
            user_id=user_id,
            access_token=access_token,
            refresh_token=refresh_token,
            expiry=expiry
        )
        await conn.commit()
        return result
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


# Symptoms
async def add_symptom_log(
	user_id: int,
	symptom: str,
	severity: Optional[str] = None,
	duration: Optional[str] = None,
	notes: Optional[str] = None,
) -> Dict[str, Any]:
	async for conn in get_db_connection():
		result = await symptoms_repo.add_symptom_log(
			conn, user_id=user_id, symptom=symptom, severity=severity, duration=duration, notes=notes
		)
		await conn.commit()
		return result


async def get_user_symptoms(user_id: int, limit: Optional[int] = None) -> List[Dict[str, Any]]:
	async for conn in get_db_connection():
		return await symptoms_repo.get_user_symptoms(conn, user_id=user_id, limit=limit)


async def get_recent_symptoms(user_id: int, days: int = 7) -> List[Dict[str, Any]]:
	async for conn in get_db_connection():
		return await symptoms_repo.get_recent_symptoms(conn, user_id=user_id, days=days)


# User Profile Functions
async def get_user_profile(user_id: int) -> Optional[Dict[str, Any]]:
	async for conn in get_db_connection():
		return await users_repo.get_user_profile(conn, user_id=user_id)


async def get_all_users() -> List[Dict[str, Any]]:
	async for conn in get_db_connection():
		return await users_repo.get_all_users(conn)


async def update_user_profile(user_id: int, **kwargs) -> Optional[Dict[str, Any]]:
	async for conn in get_db_connection():
		result = await users_repo.update_user_profile(conn, user_id=user_id, **kwargs)
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


# COMPREHENSIVE USER DATA FETCHER
async def get_comprehensive_user_data(user_id: int) -> str:
	"""
	ONE BIG FUNCTION: Fetches ALL user data from ALL tables and formats it as a comprehensive string.
	This is designed to be appended to the master/system prompt for the AI.
	"""
	async for conn in get_db_connection():
		# Get user profile
		user_profile = await users_repo.get_user_profile(conn, user_id)
		if not user_profile:
			return f"User with ID {user_id} not found."
		
		# Get all related data
		recent_symptoms = await symptoms_repo.get_recent_symptoms(conn, user_id, days=30)
		user_disorders = await disorders_repo.get_user_disorders_by_date(conn, user_id, "2024-01-01")  # Get all disorders
		user_medications = await meds_repo.get_user_medication_schedule_by_date(conn, user_id, "2024-01-01")  # Get all medications
		recent_metrics = await metrics_repo.get_user_metrics_by_date(conn, user_id, "2024-01-01")  # Get all metrics
		recent_reports = await reports_repo.get_user_reports_by_date(conn, user_id, "2024-01-01")  # Get all reports
		
		# Format comprehensive user data string
		user_data = f"""
=== COMPREHENSIVE USER HEALTH PROFILE ===
User ID: {user_id}

--- BASIC INFORMATION ---
Name: {user_profile.get('name', 'N/A')}
Age: {user_profile.get('age', 'N/A')}
Gender: {user_profile.get('gender', 'N/A')}
Email: {user_profile.get('email', 'N/A')}
Created: {user_profile.get('created_at', 'N/A')}

--- PHYSICAL METRICS ---
Height: {user_profile.get('height_cm', 'N/A')} cm
Weight: {user_profile.get('weight_kg', 'N/A')} kg
BMI: {user_profile.get('bmi', 'N/A')}
Blood Group: {user_profile.get('blood_group', 'N/A')}
Activity Level: {user_profile.get('activity_level', 'N/A')}

--- HEALTH INDICATORS ---
Gym Member: {user_profile.get('gym_member', 'N/A')}
Smoker: {user_profile.get('smoker', 'N/A')}
Alcohol Consumer: {user_profile.get('alcohol', 'N/A')}
On Medications: {user_profile.get('medications', 'N/A')}
Ever Hospitalized: {user_profile.get('ever_hospitalized', 'N/A')}
Ever Had Concussion: {user_profile.get('ever_concussion', 'N/A')}

--- MEDICAL CONDITIONS & ALLERGIES ---
Medical Conditions: {user_profile.get('medical_conditions', 'N/A')}
Allergies: {user_profile.get('allergies', 'N/A')}

--- AVERAGE HEALTH METRICS ---
Average Sleep Hours: {user_profile.get('avg_sleep_hours', 'N/A')}
Average Blood Pressure: {user_profile.get('avg_blood_pressure', 'N/A')}
Average Heart Rate: {user_profile.get('avg_heart_rate', 'N/A')} BPM
Average Water Intake: {user_profile.get('avg_water_intake', 'N/A')} liters
Average Steps Per Day: {user_profile.get('steps_per_day', 'N/A')}

--- LAB VALUES ---
Cholesterol Level: {user_profile.get('cholesterol_level', 'N/A')} mg/dL
Blood Sugar Level: {user_profile.get('blood_sugar_level', 'N/A')} mg/dL

--- RECENT SYMPTOMS (Last 30 days) ---
"""
		
		if recent_symptoms:
			for symptom in recent_symptoms[:10]:  # Limit to 10 most recent
				user_data += f"• {symptom.get('symptom', 'N/A')} (Severity: {symptom.get('severity', 'N/A')}, Duration: {symptom.get('duration', 'N/A')}) - {symptom.get('log_date', 'N/A')}\n"
		else:
			user_data += "No recent symptoms recorded.\n"
		
		user_data += f"""
--- DIAGNOSED DISORDERS ---
"""
		if user_disorders:
			for disorder in user_disorders:
				user_data += f"• {disorder.get('disorder_name', 'N/A')} (Diagnosed: {disorder.get('diagnosed_date', 'N/A')}, Resolved: {disorder.get('resolved_date', 'Ongoing')})\n"
		else:
			user_data += "No diagnosed disorders recorded.\n"
		
		user_data += f"""
--- CURRENT MEDICATIONS ---
"""
		if user_medications:
			for med in user_medications[:5]:  # Limit to 5 most recent
				user_data += f"• {med.get('medication_name', 'N/A')} ({med.get('dosage', 'N/A')}) - {med.get('frequency', 'N/A')}\n"
		else:
			user_data += "No current medications recorded.\n"
		
		user_data += f"""
--- RECENT HEALTH REPORTS ---
"""
		if recent_reports:
			for report in recent_reports[:3]:  # Limit to 3 most recent
				user_data += f"• {report.get('report_type', 'N/A')} Report ({report.get('report_date', 'N/A')}): {report.get('content', 'N/A')[:100]}...\n"
		else:
			user_data += "No health reports available.\n"
		
		user_data += f"""
--- EMERGENCY CONTACT ---
{user_profile.get('emergency_contact', 'N/A')}

--- RECENT SUMMARIES ---
Yesterday's Summary: {user_profile.get('yesterday_summary', 'N/A')}
Last Month's Summary: {user_profile.get('last_month_summary', 'N/A')}

--- LAST CHECKUP ---
{user_profile.get('last_checkup', 'N/A')}

=== END OF USER HEALTH PROFILE ===
"""
		
		return user_data
