import axios from 'axios';

// Base URL for the live backend API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Types
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

export interface Symptom {
  symptom_id: number;
  user_id: number;
  symptom: string;
  severity?: string;
  duration?: string;
  notes?: string;
  log_date: string;
}

export interface DailyMetric {
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

export interface Report {
  report_id: number;
  user_id: number;
  report_date: string;
  report_type?: string;
  content?: string;
}

// API Functions
export const userAPI = {
  getProfile: (userId: number) => api.get<User>(`/users/${userId}/profile`),
  updateProfile: (userId: number, data: Partial<User>) => 
    api.put<User>(`/users/${userId}/profile`, data),
  getComprehensive: (userId: number) => 
    api.get<{user_id: number; comprehensive_data: string}>(`/users/${userId}/comprehensive`),
};

export const notificationAPI = {
  getAll: (userId: number, unreadOnly?: boolean, limit?: number) => 
    api.get<Notification[]>(`/notifications/${userId}`, { 
      params: { unread_only: unreadOnly, limit } 
    }),
  markAsRead: (userId: number, notificationId: number) => 
    api.put(`/notifications/${userId}/mark-read/${notificationId}`),
  markAllAsRead: (userId: number) => 
    api.put(`/notifications/${userId}/mark-all-read`),
  getUnreadCount: (userId: number) => 
    api.get<{unread_count: number}>(`/notifications/${userId}/unread-count`),
  delete: (userId: number, notificationId: number) => 
    api.delete(`/notifications/${userId}/${notificationId}`),
  createPersonalized: (userId: number, type: string, context?: string) =>
    api.post<Notification>(`/notifications/${userId}/personalized`, {
      notification_type: type,
      custom_context: context,
    }),
};

export const alertAPI = {
  getAll: (userId: number, activeOnly?: boolean, limit?: number) => 
    api.get<Alert[]>(`/alerts/${userId}`, { 
      params: { active_only: activeOnly, limit } 
    }),
  getUpcoming: (userId: number, hoursAhead?: number) => 
    api.get<Alert[]>(`/alerts/${userId}/upcoming`, { 
      params: { hours_ahead: hoursAhead } 
    }),
  create: (userId: number, data: Omit<Alert, 'alert_id' | 'user_id' | 'is_active' | 'created_at'>) => 
    api.post<Alert>(`/alerts/${userId}`, data),
  update: (userId: number, alertId: number, data: Partial<Alert>) => 
    api.put<Alert>(`/alerts/${userId}/${alertId}`, data),
  deactivate: (userId: number, alertId: number) => 
    api.put(`/alerts/${userId}/${alertId}/deactivate`),
  delete: (userId: number, alertId: number) => 
    api.delete(`/alerts/${userId}/${alertId}`),
  getActiveCount: (userId: number) => 
    api.get<{active_count: number}>(`/alerts/${userId}/active-count`),
};

export const symptomAPI = {
  getAll: (userId: number, limit?: number) => 
    api.get<Symptom[]>(`/symptoms/${userId}`, { params: { limit } }),
  getRecent: (userId: number, days?: number) => 
    api.get<Symptom[]>(`/symptoms/${userId}/recent`, { params: { days } }),
  create: (userId: number, data: Omit<Symptom, 'symptom_id' | 'user_id' | 'log_date'>) => 
    api.post<Symptom>(`/symptoms/${userId}`, data),
};

export const metricsAPI = {
  getAll: (userId: number, date?: string, limit?: number) => 
    api.get<DailyMetric[]>(`/metrics/${userId}`, { 
      params: { date, limit } 
    }),
  create: (userId: number, data: Omit<DailyMetric, 'metric_id' | 'user_id'>) => 
    api.post<DailyMetric>(`/metrics/${userId}`, data),
};

export const medicationAPI = {
  getAll: (userId: number) => 
    api.get<Medication[]>(`/medications/${userId}`),
  getSchedule: (userId: number, date?: string) => 
    api.get<any[]>(`/medications/${userId}/schedule`, { params: { date } }),
};

export const reportAPI = {
  getAll: (userId: number, reportType?: string, limit?: number) => 
    api.get<Report[]>(`/reports/${userId}`, { 
      params: { report_type: reportType, limit } 
    }),
  getSummary: (userId: number, date: string) => 
    api.get(`/reports/${userId}/summary`, { params: { date } }),
  create: (userId: number, data: Omit<Report, 'report_id' | 'user_id'>) => 
    api.post<Report>(`/reports/${userId}`, data),
};