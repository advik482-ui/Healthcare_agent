from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import requests
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse, HTMLResponse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from pydantic import BaseModel
from typing import List, Optional
from db import ensure_database_initialized, get_db_connection
from services import (
	add_user_tokens, 
	create_notification, 
	get_user_notifications, 
	mark_notification_read, 
	mark_all_notifications_read,
	get_unread_notification_count,
	delete_notification,
	create_alert,
	get_user_alerts,
	get_upcoming_alerts,
	update_alert,
	deactivate_alert,
	delete_alert,
	get_active_alert_count,
	# User profile functions
	get_user_profile,
	update_user_profile,
	# Symptoms functions
	add_symptom_log,
	get_user_symptoms,
	get_recent_symptoms,
	# Disorders functions
	add_disorder,
	add_user_disorder,
	# Medications functions
	add_medication,
	add_user_medication,
	add_medication_schedule,
	# Daily metrics functions
	add_daily_metric,
	# Reports functions
	add_report,
	get_user_data_by_date,
	get_comprehensive_user_data,
	# Personalized notification functions
	generate_personalized_notification,
	generate_daily_personalized_notification,
	generate_multiple_personalized_notifications
)

# ---------- CONFIG ----------
CLIENT_SECRETS_FILE = "client.json"
SCOPES = [
    # Activity & Location
    "https://www.googleapis.com/auth/fitness.activity.read",      # Steps, activity segments, calories burned
    "https://www.googleapis.com/auth/fitness.location.read",      # Distance, location-based activities

    # Heart / Cardiovascular
    "https://www.googleapis.com/auth/fitness.heart_rate.read",    # Heart rate data
    "https://www.googleapis.com/auth/fitness.blood_pressure.read", # Blood pressure
    "https://www.googleapis.com/auth/fitness.oxygen_saturation.read", # Blood oxygen (SpO2)
    
    # Blood / Lab Data
    "https://www.googleapis.com/auth/fitness.blood_glucose.read", # Blood glucose
    "https://www.googleapis.com/auth/fitness.blood_pressure.read",# Blood pressure (again, if needed)
    
    # Realtime / Activity Tracking (optional)
    "https://www.googleapis.com/auth/fitness.activity.write",    # If you also want to write activity data
    "https://www.googleapis.com/auth/fitness.location.write",
	
    "https://www.googleapis.com/auth/fitness.activity.write",   # write activity data
    "https://www.googleapis.com/auth/fitness.location.write",   # write distance/location data
    "https://www.googleapis.com/auth/fitness.body.write",       # write weight, BMI, body fat, height
    "https://www.googleapis.com/auth/fitness.nutrition.write",  # write food/water logs
    "https://www.googleapis.com/auth/fitness.sleep.write"       # write sleep data
]

REDIRECT_URI = "https://grgwkl96-8000.inc1.devtunnels.ms/callback"

app = FastAPI(title="Global Health API", version="0.1.0")


@app.on_event("startup")
async def on_startup() -> None:
	await ensure_database_initialized()


class UserCreate(BaseModel):
	name: str
	age: Optional[int] = None
	gender: Optional[str] = None


class UserOut(BaseModel):
	user_id: int
	name: str
	age: Optional[int] = None
	gender: Optional[str] = None
	created_at: str


class NotificationCreate(BaseModel):
	title: str
	message: str
	notification_type: Optional[str] = None


class NotificationOut(BaseModel):
	notification_id: int
	user_id: int
	title: str
	message: str
	notification_type: Optional[str] = None
	is_read: bool
	created_at: str


class AlertCreate(BaseModel):
	alert_type: str
	title: str
	message: str
	alert_time: str


class AlertOut(BaseModel):
	alert_id: int
	user_id: int
	alert_type: str
	title: str
	message: str
	alert_time: str
	is_active: bool
	created_at: str


class UserProfileUpdate(BaseModel):
	name: Optional[str] = None
	age: Optional[int] = None
	gender: Optional[str] = None
	email: Optional[str] = None
	height_cm: Optional[float] = None
	weight_kg: Optional[float] = None
	bmi: Optional[float] = None
	blood_group: Optional[str] = None
	activity_level: Optional[str] = None
	gym_member: Optional[bool] = None
	smoker: Optional[bool] = None
	alcohol: Optional[bool] = None
	medications: Optional[bool] = None
	ever_hospitalized: Optional[bool] = None
	ever_concussion: Optional[bool] = None
	allergies: Optional[str] = None
	medical_conditions: Optional[str] = None
	avg_sleep_hours: Optional[float] = None
	avg_blood_pressure: Optional[str] = None
	avg_heart_rate: Optional[int] = None
	avg_water_intake: Optional[float] = None
	cholesterol_level: Optional[float] = None
	blood_sugar_level: Optional[float] = None
	steps_per_day: Optional[int] = None
	last_checkup: Optional[str] = None
	emergency_contact: Optional[str] = None


class SymptomCreate(BaseModel):
	symptom: str
	severity: Optional[str] = None
	duration: Optional[str] = None
	notes: Optional[str] = None


class SymptomOut(BaseModel):
	symptom_id: int
	user_id: int
	symptom: str
	severity: Optional[str] = None
	duration: Optional[str] = None
	notes: Optional[str] = None
	log_date: str


class DisorderCreate(BaseModel):
	name: str
	description: Optional[str] = None


class UserDisorderCreate(BaseModel):
	disorder_id: int
	diagnosed_date: str
	resolved_date: Optional[str] = None


class MedicationCreate(BaseModel):
	name: str
	dosage: Optional[str] = None
	description: Optional[str] = None


class UserMedicationCreate(BaseModel):
	medication_id: int
	start_date: str
	end_date: Optional[str] = None
	frequency: Optional[str] = None


class MedicationScheduleCreate(BaseModel):
	user_med_id: int
	date: str
	time: str
	status: Optional[str] = None


class DailyMetricCreate(BaseModel):
	date: str
	steps: Optional[int] = None
	heart_rate: Optional[int] = None
	sleep_hours: Optional[float] = None
	blood_pressure: Optional[str] = None
	mood: Optional[str] = None
	notes: Optional[str] = None


class ReportCreate(BaseModel):
	report_date: str
	report_type: Optional[str] = None
	content: Optional[str] = None


class PersonalizedNotificationRequest(BaseModel):
	notification_type: str = "general"  # medication, wellness, symptom_followup, checkup, general
	custom_context: Optional[str] = None


class MultipleNotificationsRequest(BaseModel):
	notification_types: Optional[List[str]] = None  # If None, uses default types


@app.get("/health")
async def health() -> dict:
	return {"status": "ok"}

from starlette.middleware.sessions import SessionMiddleware
app.add_middleware(SessionMiddleware, secret_key="super-secret-key")

@app.get("/")
def index():
    return {"message": "Welcome!", "link": "/authorize"}
@app.get("/authorize")
async def authorize(request: Request):
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri = "https://grgwkl96-8000.inc1.devtunnels.ms/callback"
    )
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true"
    )
    request.session["state"] = state
    return RedirectResponse(authorization_url)


@app.get("/callback")
async def callback(request: Request):
    state = request.session.get("state")

    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )
    flow.fetch_token(authorization_response=str(request.url))

    credentials = flow.credentials

    # Save credentials in session
    request.session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes
    }

    # Save tokens in DB for user_id = 1 (replace with actual logged-in user)
    saved = await add_user_tokens(
        user_id=1,  # TODO: dynamically get logged-in user_id
        access_token=credentials.token,
        refresh_token=credentials.refresh_token,
        expiry=credentials.expiry.isoformat() if credentials.expiry else None
    )

    return HTMLResponse(
        f"Access Token: {credentials.token}<br>"
        f"Refresh Token: {credentials.refresh_token}<br>"
        f"Saved in DB: {saved}"
    )

@app.get("/revoke")
async def revoke(request: Request):
    if "credentials" not in request.session:
        return HTMLResponse("You need to <a href='/authorize'>authorize</a> first.")

    credentials = Credentials(**request.session["credentials"])
    revoke = requests.post(
        'https://oauth2.googleapis.com/revoke',
        params={'token': credentials.token},
        headers={'content-type': 'application/x-www-form-urlencoded'}
    )

    if revoke.status_code == 200:
        return "Access revoked."
    else:
        raise HTTPException(status_code=400, detail="Failed to revoke token")

@app.post("/users", response_model=UserOut, status_code=201)
async def create_user(payload: UserCreate):
	async for conn in get_db_connection():
		cursor = await conn.execute(
			"""
			INSERT INTO Users (name, age, gender)
			VALUES (?, ?, ?)
			RETURNING user_id, name, age, gender, created_at
			""",
			(payload.name, payload.age, payload.gender),
		)
		row = await cursor.fetchone()
		await conn.commit()
		return dict(row)


@app.get("/users", response_model=List[UserOut])
async def list_users():
	async for conn in get_db_connection():
		cursor = await conn.execute(
			"SELECT user_id, name, age, gender, created_at FROM Users ORDER BY user_id DESC"
		)
		rows = await cursor.fetchall()
		return [dict(r) for r in rows]


@app.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: int):
	async for conn in get_db_connection():
		cursor = await conn.execute(
			"SELECT user_id, name, age, gender, created_at FROM Users WHERE user_id = ?",
			(user_id,),
		)
		row = await cursor.fetchone()
		if row is None:
			raise HTTPException(status_code=404, detail="User not found")
		return dict(row)


@app.get("/users/{user_id}/profile")
async def get_user_profile_endpoint(user_id: int):
	"""Get comprehensive user profile with all health data"""
	profile = await get_user_profile(user_id)
	if not profile:
		raise HTTPException(status_code=404, detail="User not found")
	return profile


@app.put("/users/{user_id}/profile")
async def update_user_profile_endpoint(user_id: int, payload: UserProfileUpdate):
	"""Update user profile with comprehensive health data"""
	# Convert payload to dict, excluding None values
	update_data = {k: v for k, v in payload.dict().items() if v is not None}
	
	if not update_data:
		raise HTTPException(status_code=400, detail="No data provided for update")
	
	result = await update_user_profile(user_id, **update_data)
	if not result:
		raise HTTPException(status_code=404, detail="User not found")
	return result


@app.get("/users/{user_id}/comprehensive")
async def get_comprehensive_user_data_endpoint(user_id: int):
	"""Get comprehensive user data formatted for AI/analytics"""
	data = await get_comprehensive_user_data(user_id)
	return {"user_id": user_id, "comprehensive_data": data}


# ===========================
# NOTIFICATION ENDPOINTS
# ===========================

@app.post("/notifications/{user_id}", response_model=NotificationOut, status_code=201)
async def create_user_notification(user_id: int, payload: NotificationCreate):
	"""Create a notification for a specific user"""
	result = await create_notification(
		user_id=user_id,
		title=payload.title,
		message=payload.message,
		notification_type=payload.notification_type
	)
	return result


@app.get("/notifications/{user_id}", response_model=List[NotificationOut])
async def get_user_notifications_endpoint(
	user_id: int, 
	unread_only: bool = False, 
	limit: Optional[int] = None
):
	"""Get notifications for a specific user"""
	notifications = await get_user_notifications(
		user_id=user_id, 
		unread_only=unread_only, 
		limit=limit
	)
	return notifications


@app.put("/notifications/{user_id}/mark-read/{notification_id}")
async def mark_notification_read_endpoint(user_id: int, notification_id: int):
	"""Mark a specific notification as read for a user"""
	success = await mark_notification_read(notification_id=notification_id, user_id=user_id)
	if not success:
		raise HTTPException(status_code=404, detail="Notification not found")
	return {"message": "Notification marked as read"}


@app.put("/notifications/{user_id}/mark-all-read")
async def mark_all_notifications_read_endpoint(user_id: int):
	"""Mark all notifications as read for a user"""
	count = await mark_all_notifications_read(user_id=user_id)
	return {"message": f"Marked {count} notifications as read"}


@app.get("/notifications/{user_id}/unread-count")
async def get_unread_notification_count_endpoint(user_id: int):
	"""Get count of unread notifications for a user"""
	count = await get_unread_notification_count(user_id=user_id)
	return {"unread_count": count}


@app.delete("/notifications/{user_id}/{notification_id}")
async def delete_notification_endpoint(user_id: int, notification_id: int):
	"""Delete a specific notification for a user"""
	success = await delete_notification(notification_id=notification_id, user_id=user_id)
	if not success:
		raise HTTPException(status_code=404, detail="Notification not found")
	return {"message": "Notification deleted"}


# ===========================
# ALERT ENDPOINTS
# ===========================

@app.post("/alerts/{user_id}", response_model=AlertOut, status_code=201)
async def create_user_alert(user_id: int, payload: AlertCreate):
	"""Create an alert for a specific user"""
	result = await create_alert(
		user_id=user_id,
		alert_type=payload.alert_type,
		title=payload.title,
		message=payload.message,
		alert_time=payload.alert_time
	)
	return result


@app.get("/alerts/{user_id}", response_model=List[AlertOut])
async def get_user_alerts_endpoint(
	user_id: int, 
	active_only: bool = True, 
	limit: Optional[int] = None
):
	"""Get alerts for a specific user"""
	alerts = await get_user_alerts(
		user_id=user_id, 
		active_only=active_only, 
		limit=limit
	)
	return alerts


@app.get("/alerts/{user_id}/upcoming")
async def get_upcoming_alerts_endpoint(user_id: int, hours_ahead: int = 24):
	"""Get upcoming alerts for a user within specified hours"""
	alerts = await get_upcoming_alerts(user_id=user_id, hours_ahead=hours_ahead)
	return alerts


@app.put("/alerts/{user_id}/{alert_id}")
async def update_user_alert(user_id: int, alert_id: int, payload: dict):
	"""Update an alert for a user"""
	result = await update_alert(alert_id=alert_id, user_id=user_id, **payload)
	if not result:
		raise HTTPException(status_code=404, detail="Alert not found")
	return result


@app.put("/alerts/{user_id}/{alert_id}/deactivate")
async def deactivate_user_alert(user_id: int, alert_id: int):
	"""Deactivate an alert for a user"""
	success = await deactivate_alert(alert_id=alert_id, user_id=user_id)
	if not success:
		raise HTTPException(status_code=404, detail="Alert not found")
	return {"message": "Alert deactivated"}


@app.delete("/alerts/{user_id}/{alert_id}")
async def delete_user_alert(user_id: int, alert_id: int):
	"""Delete an alert for a user"""
	success = await delete_alert(alert_id=alert_id, user_id=user_id)
	if not success:
		raise HTTPException(status_code=404, detail="Alert not found")
	return {"message": "Alert deleted"}


@app.get("/alerts/{user_id}/active-count")
async def get_active_alert_count_endpoint(user_id: int):
	"""Get count of active alerts for a user"""
	count = await get_active_alert_count(user_id=user_id)
	return {"active_count": count}


# ===========================
# SYMPTOMS ENDPOINTS
# ===========================

@app.post("/symptoms/{user_id}", response_model=SymptomOut, status_code=201)
async def add_user_symptom(user_id: int, payload: SymptomCreate):
	"""Add a new symptom for a specific user"""
	result = await add_symptom_log(
		user_id=user_id,
		symptom=payload.symptom,
		severity=payload.severity,
		duration=payload.duration,
		notes=payload.notes
	)
	return result


@app.get("/symptoms/{user_id}", response_model=List[SymptomOut])
async def get_user_symptoms_endpoint(
	user_id: int, 
	limit: Optional[int] = None
):
	"""Get symptoms for a specific user"""
	symptoms = await get_user_symptoms(user_id=user_id, limit=limit)
	return symptoms


@app.get("/symptoms/{user_id}/recent")
async def get_recent_symptoms_endpoint(
	user_id: int, 
	days: int = 7
):
	"""Get recent symptoms for a user within specified days"""
	symptoms = await get_recent_symptoms(user_id=user_id, days=days)
	return symptoms


# ===========================
# DISORDERS ENDPOINTS
# ===========================

@app.post("/disorders", status_code=201)
async def create_disorder_endpoint(payload: DisorderCreate):
	"""Create a new disorder"""
	result = await add_disorder(
		name=payload.name,
		description=payload.description
	)
	return result


@app.post("/disorders/{user_id}/assign", status_code=201)
async def assign_disorder_to_user(user_id: int, payload: UserDisorderCreate):
	"""Assign a disorder to a specific user"""
	result = await add_user_disorder(
		user_id=user_id,
		disorder_id=payload.disorder_id,
		diagnosed_date=payload.diagnosed_date,
		resolved_date=payload.resolved_date
	)
	return result


@app.get("/disorders")
async def get_all_disorders():
	"""Get all available disorders"""
	async for conn in get_db_connection():
		cursor = await conn.execute("SELECT * FROM Disorders ORDER BY name")
		rows = await cursor.fetchall()
		return [dict(row) for row in rows]


@app.get("/disorders/{user_id}")
async def get_user_disorders(user_id: int):
	"""Get disorders assigned to a specific user"""
	async for conn in get_db_connection():
		cursor = await conn.execute(
			"""
			SELECT 
				ud.user_disorder_id, ud.user_id, ud.disorder_id, ud.diagnosed_date, ud.resolved_date,
				d.name as disorder_name, d.description
			FROM UserDisorders ud
			JOIN Disorders d ON ud.disorder_id = d.disorder_id
			WHERE ud.user_id = ?
			ORDER BY ud.diagnosed_date DESC
			""",
			(user_id,)
		)
		rows = await cursor.fetchall()
		return [dict(row) for row in rows]


# ===========================
# MEDICATIONS ENDPOINTS
# ===========================

@app.post("/medications", status_code=201)
async def create_medication_endpoint(payload: MedicationCreate):
	"""Create a new medication"""
	result = await add_medication(
		name=payload.name,
		dosage=payload.dosage,
		description=payload.description
	)
	return result


@app.get("/medications")
async def get_all_medications():
	"""Get all available medications"""
	async for conn in get_db_connection():
		cursor = await conn.execute("SELECT * FROM Medications ORDER BY name")
		rows = await cursor.fetchall()
		return [dict(row) for row in rows]


@app.post("/medications/{user_id}/assign", status_code=201)
async def assign_medication_to_user(user_id: int, payload: UserMedicationCreate):
	"""Assign a medication to a specific user"""
	result = await add_user_medication(
		user_id=user_id,
		medication_id=payload.medication_id,
		start_date=payload.start_date,
		end_date=payload.end_date,
		frequency=payload.frequency
	)
	return result


@app.get("/medications/{user_id}")
async def get_user_medications(user_id: int):
	"""Get medications assigned to a specific user"""
	async for conn in get_db_connection():
		cursor = await conn.execute(
			"""
			SELECT 
				um.user_med_id, um.user_id, um.medication_id, um.start_date, um.end_date, um.frequency,
				m.name as medication_name, m.dosage, m.description
			FROM UserMedications um
			JOIN Medications m ON um.medication_id = m.medication_id
			WHERE um.user_id = ?
			ORDER BY um.start_date DESC
			""",
			(user_id,)
		)
		rows = await cursor.fetchall()
		return [dict(row) for row in rows]


@app.post("/medications/schedule", status_code=201)
async def create_medication_schedule_endpoint(payload: MedicationScheduleCreate):
	"""Create a medication schedule entry"""
	result = await add_medication_schedule(
		user_med_id=payload.user_med_id,
		date=payload.date,
		time=payload.time,
		status=payload.status
	)
	return result


@app.get("/medications/{user_id}/schedule")
async def get_user_medication_schedule(user_id: int, date: Optional[str] = None):
	"""Get medication schedule for a user"""
	async for conn in get_db_connection():
		query = """
			SELECT 
				ms.schedule_id, ms.user_med_id, ms.date, ms.time, ms.status,
				m.name as medication_name, m.dosage, m.description,
				um.frequency
			FROM MedicationSchedule ms
			JOIN UserMedications um ON ms.user_med_id = um.user_med_id
			JOIN Medications m ON um.medication_id = m.medication_id
			WHERE um.user_id = ?
		"""
		params = [user_id]
		
		if date:
			query += " AND ms.date = ?"
			params.append(date)
		
		query += " ORDER BY ms.date DESC, ms.time DESC"
		
		cursor = await conn.execute(query, params)
		rows = await cursor.fetchall()
		return [dict(row) for row in rows]


# ===========================
# DAILY METRICS ENDPOINTS
# ===========================

@app.post("/metrics/{user_id}", status_code=201)
async def add_user_daily_metric(user_id: int, payload: DailyMetricCreate):
	"""Add daily health metrics for a specific user"""
	result = await add_daily_metric(
		user_id=user_id,
		date=payload.date,
		steps=payload.steps,
		heart_rate=payload.heart_rate,
		sleep_hours=payload.sleep_hours,
		blood_pressure=payload.blood_pressure,
		mood=payload.mood,
		notes=payload.notes
	)
	return result


@app.get("/metrics/{user_id}")
async def get_user_metrics(
	user_id: int, 
	date: Optional[str] = None,
	limit: Optional[int] = None
):
	"""Get daily metrics for a specific user"""
	async for conn in get_db_connection():
		query = """
			SELECT metric_id, user_id, date, steps, heart_rate, sleep_hours, 
				   blood_pressure, mood, notes
			FROM DailyMetrics
			WHERE user_id = ?
		"""
		params = [user_id]
		
		if date:
			query += " AND date = ?"
			params.append(date)
		
		query += " ORDER BY date DESC"
		
		if limit:
			query += f" LIMIT {limit}"
		
		cursor = await conn.execute(query, params)
		rows = await cursor.fetchall()
		return [dict(row) for row in rows]


# ===========================
# REPORTS ENDPOINTS
# ===========================

@app.post("/reports/{user_id}", status_code=201)
async def create_user_report(user_id: int, payload: ReportCreate):
	"""Create a health report for a specific user"""
	result = await add_report(
		user_id=user_id,
		report_date=payload.report_date,
		report_type=payload.report_type,
		content=payload.content
	)
	return result


@app.get("/reports/{user_id}")
async def get_user_reports(
	user_id: int,
	report_type: Optional[str] = None,
	limit: Optional[int] = None
):
	"""Get reports for a specific user"""
	async for conn in get_db_connection():
		query = """
			SELECT report_id, user_id, report_date, report_type, content
			FROM Reports
			WHERE user_id = ?
		"""
		params = [user_id]
		
		if report_type:
			query += " AND report_type = ?"
			params.append(report_type)
		
		query += " ORDER BY report_date DESC"
		
		if limit:
			query += f" LIMIT {limit}"
		
		cursor = await conn.execute(query, params)
		rows = await cursor.fetchall()
		return [dict(row) for row in rows]


@app.get("/reports/{user_id}/summary")
async def get_user_data_summary(user_id: int, date: str):
	"""Get comprehensive data summary for a user on a specific date"""
	data = await get_user_data_by_date(user_id=user_id, date=date)
	return data


# ===========================
# PERSONALIZED NOTIFICATION ENDPOINTS
# ===========================

@app.post("/notifications/{user_id}/personalized", response_model=NotificationOut, status_code=201)
async def create_personalized_notification(user_id: int, payload: PersonalizedNotificationRequest):
	"""
	Generate and create a hyper-personalized notification for a user using AI.
	Uses comprehensive user data to create engaging, personalized notifications.
	"""
	result = await generate_personalized_notification(
		user_id=user_id,
		notification_type=payload.notification_type,
		custom_context=payload.custom_context
	)
	return result


@app.post("/notifications/{user_id}/daily-personalized", response_model=NotificationOut, status_code=201)
async def create_daily_personalized_notification(user_id: int):
	"""
	Generate a daily personalized notification based on user's current health status.
	Automatically determines the best notification type based on user data.
	"""
	result = await generate_daily_personalized_notification(user_id=user_id)
	return result


@app.post("/notifications/{user_id}/multiple-personalized", response_model=List[NotificationOut], status_code=201)
async def create_multiple_personalized_notifications(user_id: int, payload: MultipleNotificationsRequest):
	"""
	Generate multiple personalized notifications for a user.
	Creates different types of personalized notifications based on user's health data.
	"""
	results = await generate_multiple_personalized_notifications(
		user_id=user_id,
		notification_types=payload.notification_types
	)
	return results


@app.get("/notifications/{user_id}/generate-preview")
async def preview_personalized_notification(
	user_id: int, 
	notification_type: str = "general",
	custom_context: Optional[str] = None
):
	"""
	Preview a personalized notification without saving it to the database.
	Useful for testing and previewing AI-generated notifications.
	"""
	import asyncio
	from src.chatbot.personalized_notification_generator import generate_personalized_notification as generate_ai_notification
	
	# Run the AI notification generation in a thread pool
	loop = asyncio.get_event_loop()
	notification_data = await loop.run_in_executor(
		None, 
		generate_ai_notification, 
		user_id, 
		notification_type, 
		custom_context
	)
	
	return {
		"user_id": user_id,
		"preview": notification_data,
		"note": "This is a preview. Use POST /notifications/{user_id}/personalized to save it."
	}
