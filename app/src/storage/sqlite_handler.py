import asyncio
import aiosqlite
from pathlib import Path
from typing import Optional, Dict, Any, List

# Use the main database path
DB_PATH = Path("data/db.sqlite3")

async def get_db_connection():
    """Establishes an async connection to the main SQLite database."""
    conn = await aiosqlite.connect(DB_PATH.as_posix())
    await conn.execute("PRAGMA foreign_keys = ON;")
    conn.row_factory = aiosqlite.Row
    return conn

async def add_symptom_log(user_id: int, symptom: str, severity: Optional[str] = None, duration: Optional[str] = None, notes: Optional[str] = None):
    """
    Logs a new symptom for a specific user in the Symptoms table.
    Now uses the main database with comprehensive symptom tracking.
    """
    conn = await get_db_connection()
    try:
        cursor = await conn.execute(
            """
            INSERT INTO Symptoms (user_id, symptom, severity, duration, notes)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, symptom, severity, duration, notes)
        )
        await conn.commit()
        print(f"Logged symptom '{symptom}' for user_id '{user_id}'.")
    finally:
        await conn.close()

async def get_user_profile(user_id: int) -> Optional[Dict[str, Any]]:
    """
    Retrieves the full health profile for a given user_id from the main database.
    Returns a dictionary or None if the user is not found.
    """
    conn = await get_db_connection()
    try:
        cursor = await conn.execute("SELECT * FROM Users WHERE user_id = ?", (user_id,))
        row = await cursor.fetchone()
        return dict(row) if row else None
    finally:
        await conn.close()

async def get_all_users() -> List[Dict[str, Any]]:
    """
    Retrieves all users from the main database for populating the UI dropdown.
    """
    conn = await get_db_connection()
    try:
        cursor = await conn.execute("SELECT user_id, name, age, gender, email FROM Users ORDER BY name")
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        await conn.close()

async def get_comprehensive_user_data(user_id: int) -> str:
    """
    ONE BIG FUNCTION: Fetches ALL user data from ALL tables and formats it as a comprehensive string.
    This is designed to be appended to the master/system prompt for the AI.
    """
    conn = await get_db_connection()
    try:
        # Get user profile
        cursor = await conn.execute("SELECT * FROM Users WHERE user_id = ?", (user_id,))
        user_profile_row = await cursor.fetchone()
        if not user_profile_row:
            return f"User with ID {user_id} not found."
        
        user_profile = dict(user_profile_row)
        
        # Get recent symptoms (last 30 days)
        cursor = await conn.execute(
            """
            SELECT symptom_id, user_id, symptom, severity, duration, notes, log_date
            FROM Symptoms
            WHERE user_id = ? AND log_date >= datetime('now', '-30 days')
            ORDER BY log_date DESC
            LIMIT 10
            """,
            (user_id,)
        )
        recent_symptoms = [dict(row) for row in await cursor.fetchall()]
        
        # Get user disorders
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
        user_disorders = [dict(row) for row in await cursor.fetchall()]
        
        # Get current medications
        cursor = await conn.execute(
            """
            SELECT 
                ms.schedule_id, ms.user_med_id, ms.date, ms.time, ms.status,
                m.name as medication_name, m.dosage, m.description,
                um.frequency
            FROM MedicationSchedule ms
            JOIN UserMedications um ON ms.user_med_id = um.user_med_id
            JOIN Medications m ON um.medication_id = m.medication_id
            WHERE um.user_id = ? AND ms.date >= date('now', '-30 days')
            ORDER BY ms.date DESC, ms.time DESC
            LIMIT 5
            """,
            (user_id,)
        )
        user_medications = [dict(row) for row in await cursor.fetchall()]
        
        # Get recent health reports
        cursor = await conn.execute(
            """
            SELECT report_id, user_id, report_date, report_type, content
            FROM Reports
            WHERE user_id = ? AND report_date >= date('now', '-30 days')
            ORDER BY report_id DESC
            LIMIT 3
            """,
            (user_id,)
        )
        recent_reports = [dict(row) for row in await cursor.fetchall()]
        
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
            for symptom in recent_symptoms:
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
            for med in user_medications:
                user_data += f"• {med.get('medication_name', 'N/A')} ({med.get('dosage', 'N/A')}) - {med.get('frequency', 'N/A')}\n"
        else:
            user_data += "No current medications recorded.\n"
        
        user_data += f"""
--- RECENT HEALTH REPORTS ---
"""
        if recent_reports:
            for report in recent_reports:
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
    finally:
        await conn.close()

# Synchronous wrapper functions for backward compatibility with Flask app
def add_symptom_log_sync(user_id, symptom, severity=None, duration=None, notes=None):
    """Synchronous wrapper for add_symptom_log"""
    return asyncio.run(add_symptom_log(user_id, symptom, severity, duration, notes))

def get_user_profile_sync(user_id):
    """Synchronous wrapper for get_user_profile"""
    return asyncio.run(get_user_profile(user_id))

def get_all_users_sync():
    """Synchronous wrapper for get_all_users"""
    return asyncio.run(get_all_users())

def get_comprehensive_user_data_sync(user_id):
    """Synchronous wrapper for get_comprehensive_user_data"""
    return asyncio.run(get_comprehensive_user_data(user_id))