from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
	name: str
	age: Optional[int] = None
	gender: Optional[str] = None


class DailyMetricCreate(BaseModel):
	user_id: int
	date: str
	steps: Optional[int] = None
	heart_rate: Optional[int] = None
	sleep_hours: Optional[float] = None
	blood_pressure: Optional[str] = None
	mood: Optional[str] = None
	notes: Optional[str] = None


class MedicationCreate(BaseModel):
	name: str
	dosage: Optional[str] = None
	description: Optional[str] = None


class UserMedicationCreate(BaseModel):
	user_id: int
	medication_id: int
	start_date: str
	end_date: Optional[str] = None
	frequency: Optional[str] = None


class MedicationScheduleCreate(BaseModel):
	user_med_id: int
	date: str
	time: str
	status: Optional[str] = None


class DisorderCreate(BaseModel):
	name: str
	description: Optional[str] = None


class UserDisorderCreate(BaseModel):
	user_id: int
	disorder_id: int
	diagnosed_date: str
	resolved_date: Optional[str] = None


class ReportCreate(BaseModel):
	user_id: int
	report_date: str
	report_type: Optional[str] = None
	content: Optional[str] = None
