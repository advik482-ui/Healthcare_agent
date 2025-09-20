# Global Health API Documentation

## Overview
This API provides comprehensive health data management with user-specific access control. All endpoints require user authentication and filter data by user ID to ensure privacy.

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints require user authentication. User ID is passed as a path parameter.

---

## 📋 **USER MANAGEMENT ENDPOINTS**

### Create User
```http
POST /users
```
**Description:** Create a new user with basic information.

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 35,
  "gender": "Male"
}
```

**Response (201):**
```json
{
  "user_id": 1,
  "name": "John Doe",
  "age": 35,
  "gender": "Male",
  "created_at": "2024-01-15T10:30:00"
}
```

### Get All Users
```http
GET /users
```
**Description:** Get list of all users (basic info only).

**Response (200):**
```json
[
  {
    "user_id": 1,
    "name": "John Doe",
    "age": 35,
    "gender": "Male",
    "created_at": "2024-01-15T10:30:00"
  }
]
```

### Get User (Basic)
```http
GET /users/{user_id}
```
**Description:** Get basic user information.

**Response (200):**
```json
{
  "user_id": 1,
  "name": "John Doe",
  "age": 35,
  "gender": "Male",
  "created_at": "2024-01-15T10:30:00"
}
```

### Get User Profile (Comprehensive)
```http
GET /users/{user_id}/profile
```
**Description:** Get comprehensive user profile with all health data.

**Response (200):**
```json
{
  "user_id": 1,
  "name": "John Doe",
  "age": 35,
  "gender": "Male",
  "email": "john@example.com",
  "height_cm": 180.0,
  "weight_kg": 75.0,
  "bmi": 23.1,
  "blood_group": "O+",
  "activity_level": "moderate",
  "gym_member": true,
  "smoker": false,
  "alcohol": false,
  "medications": true,
  "ever_hospitalized": false,
  "ever_concussion": false,
  "allergies": "pollen, peanuts",
  "medical_conditions": "hypertension",
  "avg_sleep_hours": 7.5,
  "avg_blood_pressure": "120/80",
  "avg_heart_rate": 72,
  "avg_water_intake": 2.5,
  "cholesterol_level": 180.0,
  "blood_sugar_level": 95.0,
  "steps_per_day": 8500,
  "last_checkup": "2024-01-01",
  "emergency_contact": "Jane Doe: +1234567890",
  "yesterday_summary": "Good day with regular exercise",
  "last_month_summary": "Stable health metrics",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Update User Profile
```http
PUT /users/{user_id}/profile
```
**Description:** Update comprehensive user profile data.

**Request Body:**
```json
{
  "height_cm": 180.0,
  "weight_kg": 75.0,
  "blood_group": "O+",
  "allergies": "pollen, peanuts",
  "medical_conditions": "hypertension"
}
```

**Response (200):** Returns updated user profile (same format as GET profile)

### Get Comprehensive User Data (AI Format)
```http
GET /users/{user_id}/comprehensive
```
**Description:** Get user data formatted for AI/analytics consumption.

**Response (200):**
```json
{
  "user_id": 1,
  "comprehensive_data": "=== COMPREHENSIVE USER HEALTH PROFILE ===\nUser ID: 1\n\n--- BASIC INFORMATION ---\nName: John Doe\nAge: 35\nGender: Male\n..."
}
```

---

## 🩺 **SYMPTOMS ENDPOINTS**

### Add Symptom
```http
POST /symptoms/{user_id}
```
**Description:** Add a new symptom for a specific user.

**Request Body:**
```json
{
  "symptom": "headache",
  "severity": "moderate",
  "duration": "2 hours",
  "notes": "worse in the morning"
}
```

**Response (201):**
```json
{
  "symptom_id": 1,
  "user_id": 1,
  "symptom": "headache",
  "severity": "moderate",
  "duration": "2 hours",
  "notes": "worse in the morning",
  "log_date": "2024-01-15T10:30:00"
}
```

### Get User Symptoms
```http
GET /symptoms/{user_id}?limit=10
```
**Description:** Get all symptoms for a user.

**Query Parameters:**
- `limit` (optional): Maximum number of symptoms to return

**Response (200):**
```json
[
  {
    "symptom_id": 1,
    "user_id": 1,
    "symptom": "headache",
    "severity": "moderate",
    "duration": "2 hours",
    "notes": "worse in the morning",
    "log_date": "2024-01-15T10:30:00"
  }
]
```

### Get Recent Symptoms
```http
GET /symptoms/{user_id}/recent?days=7
```
**Description:** Get recent symptoms within specified days.

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 7)

**Response (200):** Same format as GET symptoms

---

## 🏥 **DISORDERS ENDPOINTS**

### Create Disorder
```http
POST /disorders
```
**Description:** Create a new disorder in the system.

**Request Body:**
```json
{
  "name": "Type 2 Diabetes",
  "description": "Chronic condition affecting blood sugar levels"
}
```

**Response (201):**
```json
{
  "disorder_id": 1,
  "name": "Type 2 Diabetes",
  "description": "Chronic condition affecting blood sugar levels"
}
```

### Get All Disorders
```http
GET /disorders
```
**Description:** Get all available disorders in the system.

**Response (200):**
```json
[
  {
    "disorder_id": 1,
    "name": "Type 2 Diabetes",
    "description": "Chronic condition affecting blood sugar levels"
  }
]
```

### Assign Disorder to User
```http
POST /disorders/{user_id}/assign
```
**Description:** Assign a disorder to a specific user.

**Request Body:**
```json
{
  "disorder_id": 1,
  "diagnosed_date": "2024-01-01",
  "resolved_date": null
}
```

**Response (201):**
```json
{
  "user_disorder_id": 1,
  "user_id": 1,
  "disorder_id": 1,
  "diagnosed_date": "2024-01-01",
  "resolved_date": null
}
```

### Get User Disorders
```http
GET /disorders/{user_id}
```
**Description:** Get disorders assigned to a specific user.

**Response (200):**
```json
[
  {
    "user_disorder_id": 1,
    "user_id": 1,
    "disorder_id": 1,
    "diagnosed_date": "2024-01-01",
    "resolved_date": null,
    "disorder_name": "Type 2 Diabetes",
    "description": "Chronic condition affecting blood sugar levels"
  }
]
```

---

## 💊 **MEDICATIONS ENDPOINTS**

### Create Medication
```http
POST /medications
```
**Description:** Create a new medication in the system.

**Request Body:**
```json
{
  "name": "Metformin",
  "dosage": "500mg",
  "description": "Diabetes medication"
}
```

**Response (201):**
```json
{
  "medication_id": 1,
  "name": "Metformin",
  "dosage": "500mg",
  "description": "Diabetes medication"
}
```

### Get All Medications
```http
GET /medications
```
**Description:** Get all available medications in the system.

**Response (200):**
```json
[
  {
    "medication_id": 1,
    "name": "Metformin",
    "dosage": "500mg",
    "description": "Diabetes medication"
  }
]
```

### Assign Medication to User
```http
POST /medications/{user_id}/assign
```
**Description:** Assign a medication to a specific user.

**Request Body:**
```json
{
  "medication_id": 1,
  "start_date": "2024-01-01",
  "end_date": null,
  "frequency": "daily"
}
```

**Response (201):**
```json
{
  "user_med_id": 1,
  "user_id": 1,
  "medication_id": 1,
  "start_date": "2024-01-01",
  "end_date": null,
  "frequency": "daily"
}
```

### Get User Medications
```http
GET /medications/{user_id}
```
**Description:** Get medications assigned to a specific user.

**Response (200):**
```json
[
  {
    "user_med_id": 1,
    "user_id": 1,
    "medication_id": 1,
    "start_date": "2024-01-01",
    "end_date": null,
    "frequency": "daily",
    "medication_name": "Metformin",
    "dosage": "500mg",
    "description": "Diabetes medication"
  }
]
```

### Create Medication Schedule
```http
POST /medications/schedule
```
**Description:** Create a medication schedule entry.

**Request Body:**
```json
{
  "user_med_id": 1,
  "date": "2024-01-15",
  "time": "08:00:00",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "schedule_id": 1,
  "user_med_id": 1,
  "date": "2024-01-15",
  "time": "08:00:00",
  "status": "pending"
}
```

### Get User Medication Schedule
```http
GET /medications/{user_id}/schedule?date=2024-01-15
```
**Description:** Get medication schedule for a user.

**Query Parameters:**
- `date` (optional): Filter by specific date

**Response (200):**
```json
[
  {
    "schedule_id": 1,
    "user_med_id": 1,
    "date": "2024-01-15",
    "time": "08:00:00",
    "status": "pending",
    "medication_name": "Metformin",
    "dosage": "500mg",
    "description": "Diabetes medication",
    "frequency": "daily"
  }
]
```

---

## 📊 **DAILY METRICS ENDPOINTS**

### Add Daily Metrics
```http
POST /metrics/{user_id}
```
**Description:** Add daily health metrics for a specific user.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "steps": 8500,
  "heart_rate": 72,
  "sleep_hours": 7.5,
  "blood_pressure": "120/80",
  "mood": "good",
  "notes": "Feeling energetic today"
}
```

**Response (201):**
```json
{
  "metric_id": 1,
  "user_id": 1,
  "date": "2024-01-15",
  "steps": 8500,
  "heart_rate": 72,
  "sleep_hours": 7.5,
  "blood_pressure": "120/80",
  "mood": "good",
  "notes": "Feeling energetic today"
}
```

### Get User Metrics
```http
GET /metrics/{user_id}?date=2024-01-15&limit=10
```
**Description:** Get daily metrics for a user.

**Query Parameters:**
- `date` (optional): Filter by specific date
- `limit` (optional): Maximum number of records to return

**Response (200):**
```json
[
  {
    "metric_id": 1,
    "user_id": 1,
    "date": "2024-01-15",
    "steps": 8500,
    "heart_rate": 72,
    "sleep_hours": 7.5,
    "blood_pressure": "120/80",
    "mood": "good",
    "notes": "Feeling energetic today"
  }
]
```

---

## 📋 **REPORTS ENDPOINTS**

### Create Report
```http
POST /reports/{user_id}
```
**Description:** Create a health report for a specific user.

**Request Body:**
```json
{
  "report_date": "2024-01-15",
  "report_type": "daily",
  "content": "User had a good day with regular exercise and proper medication adherence."
}
```

**Response (201):**
```json
{
  "report_id": 1,
  "user_id": 1,
  "report_date": "2024-01-15",
  "report_type": "daily",
  "content": "User had a good day with regular exercise and proper medication adherence."
}
```

### Get User Reports
```http
GET /reports/{user_id}?report_type=daily&limit=10
```
**Description:** Get reports for a specific user.

**Query Parameters:**
- `report_type` (optional): Filter by report type
- `limit` (optional): Maximum number of reports to return

**Response (200):**
```json
[
  {
    "report_id": 1,
    "user_id": 1,
    "report_date": "2024-01-15",
    "report_type": "daily",
    "content": "User had a good day with regular exercise and proper medication adherence."
  }
]
```

### Get User Data Summary
```http
GET /reports/{user_id}/summary?date=2024-01-15
```
**Description:** Get comprehensive data summary for a user on a specific date.

**Query Parameters:**
- `date` (required): Date to get summary for

**Response (200):**
```json
{
  "user_id": 1,
  "date": "2024-01-15",
  "daily_metrics": [...],
  "medication_schedule": [...],
  "disorders": [...],
  "reports": [...]
}
```

---

## 🔔 **NOTIFICATIONS ENDPOINTS**

### Create Notification
```http
POST /notifications/{user_id}
```
**Description:** Create a notification for a specific user.

**Request Body:**
```json
{
  "title": "Medication Reminder",
  "message": "Time to take your Metformin",
  "notification_type": "medication"
}
```

**Response (201):**
```json
{
  "notification_id": 1,
  "user_id": 1,
  "title": "Medication Reminder",
  "message": "Time to take your Metformin",
  "notification_type": "medication",
  "is_read": false,
  "created_at": "2024-01-15T10:30:00"
}
```

### Get User Notifications
```http
GET /notifications/{user_id}?unread_only=true&limit=10
```
**Description:** Get notifications for a specific user.

**Query Parameters:**
- `unread_only` (optional): Filter to unread notifications only
- `limit` (optional): Maximum number of notifications to return

**Response (200):**
```json
[
  {
    "notification_id": 1,
    "user_id": 1,
    "title": "Medication Reminder",
    "message": "Time to take your Metformin",
    "notification_type": "medication",
    "is_read": false,
    "created_at": "2024-01-15T10:30:00"
  }
]
```

### Mark Notification as Read
```http
PUT /notifications/{user_id}/mark-read/{notification_id}
```
**Description:** Mark a specific notification as read.

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

### Mark All Notifications as Read
```http
PUT /notifications/{user_id}/mark-all-read
```
**Description:** Mark all notifications as read for a user.

**Response (200):**
```json
{
  "message": "Marked 5 notifications as read"
}
```

### Get Unread Count
```http
GET /notifications/{user_id}/unread-count
```
**Description:** Get count of unread notifications for a user.

**Response (200):**
```json
{
  "unread_count": 3
}
```

### Delete Notification
```http
DELETE /notifications/{user_id}/{notification_id}
```
**Description:** Delete a specific notification.

**Response (200):**
```json
{
  "message": "Notification deleted"
}
```

---

## ⚠️ **ALERTS ENDPOINTS**

### Create Alert
```http
POST /alerts/{user_id}
```
**Description:** Create an alert for a specific user.

**Request Body:**
```json
{
  "alert_type": "medication",
  "title": "Take Metformin",
  "message": "Time to take your 500mg Metformin",
  "alert_time": "2024-01-15T08:00:00"
}
```

**Response (201):**
```json
{
  "alert_id": 1,
  "user_id": 1,
  "alert_type": "medication",
  "title": "Take Metformin",
  "message": "Time to take your 500mg Metformin",
  "alert_time": "2024-01-15T08:00:00",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00"
}
```

### Get User Alerts
```http
GET /alerts/{user_id}?active_only=true&limit=10
```
**Description:** Get alerts for a specific user.

**Query Parameters:**
- `active_only` (optional): Filter to active alerts only (default: true)
- `limit` (optional): Maximum number of alerts to return

**Response (200):**
```json
[
  {
    "alert_id": 1,
    "user_id": 1,
    "alert_type": "medication",
    "title": "Take Metformin",
    "message": "Time to take your 500mg Metformin",
    "alert_time": "2024-01-15T08:00:00",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00"
  }
]
```

### Get Upcoming Alerts
```http
GET /alerts/{user_id}/upcoming?hours_ahead=24
```
**Description:** Get upcoming alerts for a user within specified hours.

**Query Parameters:**
- `hours_ahead` (optional): Hours to look ahead (default: 24)

**Response (200):** Same format as GET alerts

### Update Alert
```http
PUT /alerts/{user_id}/{alert_id}
```
**Description:** Update an alert for a user.

**Request Body:**
```json
{
  "title": "Updated Alert Title",
  "message": "Updated message",
  "alert_time": "2024-01-15T09:00:00"
}
```

**Response (200):** Returns updated alert (same format as GET alerts)

### Deactivate Alert
```http
PUT /alerts/{user_id}/{alert_id}/deactivate
```
**Description:** Deactivate an alert for a user.

**Response (200):**
```json
{
  "message": "Alert deactivated"
}
```

### Delete Alert
```http
DELETE /alerts/{user_id}/{alert_id}
```
**Description:** Delete an alert for a user.

**Response (200):**
```json
{
  "message": "Alert deleted"
}
```

### Get Active Alert Count
```http
GET /alerts/{user_id}/active-count
```
**Description:** Get count of active alerts for a user.

**Response (200):**
```json
{
  "active_count": 2
}
```

---

## 🔧 **UTILITY ENDPOINTS**

### Health Check
```http
GET /health
```
**Description:** Check if the API is running.

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## 📝 **ERROR RESPONSES**

### 400 Bad Request
```json
{
  "detail": "No data provided for update"
}
```

### 404 Not Found
```json
{
  "detail": "User not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## 🔐 **SECURITY NOTES**

1. **User Isolation**: All endpoints filter data by user ID to ensure privacy
2. **Authentication Required**: All endpoints require valid user authentication
3. **Data Validation**: All input data is validated using Pydantic models
4. **Foreign Key Constraints**: Database enforces referential integrity

---

## 📚 **DATA TYPES**

### Notification Types
- `medication` - Medication-related notifications
- `checkup` - Checkup reminders
- `general` - General health notifications
- `alert` - System alerts

### Alert Types
- `medication` - Medication reminders
- `checkup` - Checkup reminders
- `symptom` - Symptom-related alerts
- `general` - General health alerts

### Report Types
- `daily` - Daily health reports
- `weekly` - Weekly health reports
- `monthly` - Monthly health reports
- `custom` - Custom health reports

---

## 🚀 **GETTING STARTED**

1. **Start the server**: `uvicorn main:app --reload`
2. **Create a user**: `POST /users`
3. **Add health data**: Use the various POST endpoints
4. **Retrieve data**: Use the GET endpoints with user ID
5. **Update data**: Use the PUT endpoints
6. **Delete data**: Use the DELETE endpoints

The API provides comprehensive health data management with full CRUD operations for all health-related entities.
