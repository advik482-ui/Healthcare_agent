export interface User {
  user_id: number;
  name: string;
  age?: number;
  gender?: string;
  email?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  blood_group?: string;
  activity_level?: string;
  gym_member?: boolean;
  smoker?: boolean;
  alcohol?: boolean;
  medications?: boolean;
  ever_hospitalized?: boolean;
  ever_concussion?: boolean;
  allergies?: string;
  medical_conditions?: string;
  avg_sleep_hours?: number;
  avg_blood_pressure?: string;
  avg_heart_rate?: number;
  avg_water_intake?: number;
  cholesterol_level?: number;
  blood_sugar_level?: number;
  steps_per_day?: number;
  last_checkup?: string;
  emergency_contact?: string;
  yesterday_summary?: string;
  last_month_summary?: string;
  created_at: string;
  updated_at?: string;
}

export interface HealthMetric {
  metric_id: number;
  user_id: number;
  date: string;
  steps?: number;
  heart_rate?: number;
  sleep_hours?: number;
  blood_pressure?: string;
  mood?: string;
  notes?: string;
}

export interface Symptom {
  symptom_id: number;
  user_id: number;
  symptom: string;
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
  notes?: string;
  log_date: string;
}

export interface Medication {
  user_med_id: number;
  user_id: number;
  medication_id: number;
  start_date: string;
  end_date?: string;
  frequency?: string;
  medication_name: string;
  dosage?: string;
  description?: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type?: string;
  is_read: boolean;
  created_at: string;
}

export interface Alert {
  alert_id: number;
  user_id: number;
  alert_type: string;
  title: string;
  message: string;
  alert_time: string;
  is_active: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
  context?: {
    data_used: string[];
    personalization_factors: string[];
    confidence: number;
  };
}

export interface HealthScenario {
  id: string;
  name: string;
  description: string;
  category: 'crisis' | 'chronic' | 'lifestyle' | 'medication' | 'emergency';
  data_changes: {
    symptoms?: Partial<Symptom>[];
    metrics?: Partial<HealthMetric>[];
    medications?: Partial<Medication>[];
    profile_updates?: Partial<User>;
  };
  expected_ai_response?: string;
}

export interface PersonalizationFactor {
  factor: string;
  weight: number;
  description: string;
  data_source: string;
}

export interface AIResponse {
  message: string;
  personalization_factors: PersonalizationFactor[];
  context_used: string[];
  confidence: number;
  response_type: 'general' | 'personalized' | 'emergency' | 'medication' | 'symptom';
}