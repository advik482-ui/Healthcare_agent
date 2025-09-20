import { User, HealthScenario } from '@/types/ecosystem';

export const mockUsers: User[] = [
  {
    user_id: 1,
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    email: "sarah.johnson@email.com",
    height_cm: 165,
    weight_kg: 68,
    bmi: 25.0,
    blood_group: "A+",
    activity_level: "moderate",
    gym_member: true,
    smoker: false,
    alcohol: false,
    medications: true,
    ever_hospitalized: false,
    ever_concussion: false,
    allergies: "pollen, shellfish",
    medical_conditions: "Type 2 Diabetes",
    avg_sleep_hours: 7.5,
    avg_blood_pressure: "125/80",
    avg_heart_rate: 72,
    avg_water_intake: 2.5,
    cholesterol_level: 190.0,
    blood_sugar_level: 140.0,
    steps_per_day: 8500,
    last_checkup: "2024-01-15",
    emergency_contact: "Mike Johnson: +1234567890",
    yesterday_summary: "Good day with regular exercise and medication adherence",
    last_month_summary: "Stable blood sugar levels, consistent exercise routine",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    user_id: 2,
    name: "Robert Chen",
    age: 58,
    gender: "Male",
    email: "robert.chen@email.com",
    height_cm: 175,
    weight_kg: 82,
    bmi: 26.8,
    blood_group: "O-",
    activity_level: "low",
    gym_member: false,
    smoker: true,
    alcohol: true,
    medications: true,
    ever_hospitalized: true,
    ever_concussion: false,
    allergies: "penicillin",
    medical_conditions: "Hypertension, High Cholesterol",
    avg_sleep_hours: 6.0,
    avg_blood_pressure: "145/90",
    avg_heart_rate: 78,
    avg_water_intake: 1.8,
    cholesterol_level: 240.0,
    blood_sugar_level: 95.0,
    steps_per_day: 4200,
    last_checkup: "2024-01-10",
    emergency_contact: "Linda Chen: +1234567891",
    yesterday_summary: "Elevated blood pressure, missed evening medication",
    last_month_summary: "Struggling with medication adherence, needs lifestyle changes",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    user_id: 3,
    name: "Emma Rodriguez",
    age: 28,
    gender: "Female",
    email: "emma.rodriguez@email.com",
    height_cm: 160,
    weight_kg: 55,
    bmi: 21.5,
    blood_group: "B+",
    activity_level: "high",
    gym_member: true,
    smoker: false,
    alcohol: false,
    medications: false,
    ever_hospitalized: false,
    ever_concussion: true,
    allergies: "none",
    medical_conditions: "none",
    avg_sleep_hours: 8.0,
    avg_blood_pressure: "110/70",
    avg_heart_rate: 65,
    avg_water_intake: 3.0,
    cholesterol_level: 160.0,
    blood_sugar_level: 85.0,
    steps_per_day: 12000,
    last_checkup: "2024-01-20",
    emergency_contact: "Carlos Rodriguez: +1234567892",
    yesterday_summary: "Great workout session, optimal health metrics",
    last_month_summary: "Excellent health, consistent training routine",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    user_id: 4,
    name: "William Thompson",
    age: 72,
    gender: "Male",
    email: "william.thompson@email.com",
    height_cm: 170,
    weight_kg: 75,
    bmi: 26.0,
    blood_group: "AB+",
    activity_level: "low",
    gym_member: false,
    smoker: false,
    alcohol: false,
    medications: true,
    ever_hospitalized: true,
    ever_concussion: false,
    allergies: "aspirin, latex",
    medical_conditions: "Atrial Fibrillation, Arthritis",
    avg_sleep_hours: 6.5,
    avg_blood_pressure: "130/85",
    avg_heart_rate: 85,
    avg_water_intake: 2.0,
    cholesterol_level: 200.0,
    blood_sugar_level: 100.0,
    steps_per_day: 3500,
    last_checkup: "2024-01-05",
    emergency_contact: "Margaret Thompson: +1234567893",
    yesterday_summary: "Joint pain in the morning, took prescribed medication",
    last_month_summary: "Managing chronic conditions well, regular doctor visits",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    user_id: 5,
    name: "Maria Garcia",
    age: 45,
    gender: "Female",
    email: "maria.garcia@email.com",
    height_cm: 162,
    weight_kg: 70,
    bmi: 26.7,
    blood_group: "O+",
    activity_level: "moderate",
    gym_member: false,
    smoker: false,
    alcohol: true,
    medications: true,
    ever_hospitalized: false,
    ever_concussion: false,
    allergies: "dust mites",
    medical_conditions: "Migraine, Anxiety",
    avg_sleep_hours: 6.5,
    avg_blood_pressure: "128/82",
    avg_heart_rate: 75,
    avg_water_intake: 2.2,
    cholesterol_level: 185.0,
    blood_sugar_level: 92.0,
    steps_per_day: 6800,
    last_checkup: "2024-01-12",
    emergency_contact: "Jose Garcia: +1234567894",
    yesterday_summary: "Mild headache in the evening, took prescribed medication",
    last_month_summary: "Managing stress levels, regular medication adherence",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    user_id: 6,
    name: "David Kim",
    age: 31,
    gender: "Male",
    email: "david.kim@email.com",
    height_cm: 178,
    weight_kg: 73,
    bmi: 23.0,
    blood_group: "A-",
    activity_level: "high",
    gym_member: true,
    smoker: false,
    alcohol: false,
    medications: false,
    ever_hospitalized: false,
    ever_concussion: false,
    allergies: "none",
    medical_conditions: "none",
    avg_sleep_hours: 7.8,
    avg_blood_pressure: "115/75",
    avg_heart_rate: 62,
    avg_water_intake: 3.2,
    cholesterol_level: 155.0,
    blood_sugar_level: 82.0,
    steps_per_day: 14500,
    last_checkup: "2024-01-18",
    emergency_contact: "Sarah Kim: +1234567895",
    yesterday_summary: "Intense workout session, excellent recovery metrics",
    last_month_summary: "Peak physical condition, consistent training schedule",
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const healthScenarios: HealthScenario[] = [
  {
    id: "diabetes_spike",
    name: "Blood Sugar Spike",
    description: "Simulate a diabetic patient experiencing high blood sugar levels",
    category: "crisis",
    data_changes: {
      symptoms: [
        { symptom: "excessive thirst", severity: "moderate", duration: "2 hours" },
        { symptom: "frequent urination", severity: "mild", duration: "3 hours" },
        { symptom: "fatigue", severity: "moderate", duration: "4 hours" }
      ],
      metrics: [
        { blood_pressure: "140/90", heart_rate: 85, mood: "concerned" }
      ],
      profile_updates: { blood_sugar_level: 280 }
    },
    expected_ai_response: "I notice your blood sugar is significantly elevated. Let's address this immediately."
  },
  {
    id: "medication_missed",
    name: "Missed Medication",
    description: "Patient forgot to take their morning medication",
    category: "medication",
    data_changes: {
      symptoms: [
        { symptom: "anxiety", severity: "mild", duration: "1 hour" }
      ],
      metrics: [
        { mood: "anxious", notes: "Forgot morning medication" }
      ]
    },
    expected_ai_response: "I see you missed your morning medication. Here's what we should do..."
  },
  {
    id: "heart_palpitations",
    name: "Heart Palpitations",
    description: "Patient experiencing irregular heartbeat",
    category: "crisis",
    data_changes: {
      symptoms: [
        { symptom: "heart palpitations", severity: "moderate", duration: "30 minutes" },
        { symptom: "chest discomfort", severity: "mild", duration: "45 minutes" }
      ],
      metrics: [
        { heart_rate: 110, blood_pressure: "150/95", mood: "worried" }
      ]
    },
    expected_ai_response: "I'm concerned about your heart palpitations. Let's assess this carefully."
  },
  {
    id: "exercise_routine",
    name: "New Exercise Routine",
    description: "Patient starting a new fitness program",
    category: "lifestyle",
    data_changes: {
      symptoms: [
        { symptom: "muscle soreness", severity: "mild", duration: "2 days" }
      ],
      metrics: [
        { steps: 15000, heart_rate: 68, mood: "energetic", sleep_hours: 8.5 }
      ],
      profile_updates: { activity_level: "high" }
    },
    expected_ai_response: "Great job starting your new exercise routine! Let's monitor your progress."
  },
  {
    id: "flu_symptoms",
    name: "Flu-like Symptoms",
    description: "Patient showing signs of viral infection",
    category: "crisis",
    data_changes: {
      symptoms: [
        { symptom: "fever", severity: "moderate", duration: "6 hours" },
        { symptom: "body aches", severity: "moderate", duration: "8 hours" },
        { symptom: "headache", severity: "mild", duration: "4 hours" },
        { symptom: "fatigue", severity: "severe", duration: "12 hours" }
      ],
      metrics: [
        { heart_rate: 88, sleep_hours: 10, mood: "unwell", steps: 2000 }
      ]
    },
    expected_ai_response: "You're showing flu-like symptoms. Let's focus on recovery and monitoring."
  },
  {
    id: "chronic_pain_flare",
    name: "Chronic Pain Flare-up",
    description: "Arthritis patient experiencing increased joint pain",
    category: "chronic",
    data_changes: {
      symptoms: [
        { symptom: "joint pain", severity: "severe", duration: "ongoing" },
        { symptom: "stiffness", severity: "moderate", duration: "morning" }
      ],
      metrics: [
        { mood: "frustrated", sleep_hours: 5.5, steps: 1500 }
      ]
    },
    expected_ai_response: "I understand you're experiencing a pain flare-up. Let's work on management strategies."
  },
  {
    id: "stress_episode",
    name: "High Stress Period",
    description: "Patient dealing with work-related stress",
    category: "lifestyle",
    data_changes: {
      symptoms: [
        { symptom: "anxiety", severity: "moderate", duration: "ongoing" },
        { symptom: "tension headache", severity: "mild", duration: "3 hours" }
      ],
      metrics: [
        { heart_rate: 82, blood_pressure: "135/88", sleep_hours: 5, mood: "stressed" }
      ]
    },
    expected_ai_response: "I can see you're under significant stress. Let's discuss coping strategies."
  },
  {
    id: "recovery_progress",
    name: "Post-Surgery Recovery",
    description: "Patient recovering from minor surgery",
    category: "chronic",
    data_changes: {
      symptoms: [
        { symptom: "incision pain", severity: "mild", duration: "ongoing" },
        { symptom: "fatigue", severity: "moderate", duration: "daily" }
      ],
      metrics: [
        { steps: 3000, sleep_hours: 9, mood: "hopeful" }
      ]
    },
    expected_ai_response: "Your recovery is progressing well. Let's continue monitoring your healing."
  },
  {
    id: "mental_health_crisis",
    name: "Mental Health Crisis",
    description: "Patient experiencing severe anxiety and panic symptoms",
    category: "emergency",
    data_changes: {
      symptoms: [
        { symptom: "panic attack", severity: "severe", duration: "20 minutes" },
        { symptom: "rapid heartbeat", severity: "moderate", duration: "1 hour" },
        { symptom: "shortness of breath", severity: "moderate", duration: "30 minutes" }
      ],
      metrics: [
        { heart_rate: 120, blood_pressure: "160/100", mood: "panicked", sleep_hours: 3 }
      ]
    },
    expected_ai_response: "I'm very concerned about your panic symptoms. Let's get you immediate support."
  },
  {
    id: "medication_interaction",
    name: "Drug Interaction Alert",
    description: "Potential dangerous interaction between medications",
    category: "medication",
    data_changes: {
      symptoms: [
        { symptom: "dizziness", severity: "moderate", duration: "2 hours" },
        { symptom: "nausea", severity: "mild", duration: "1 hour" }
      ],
      metrics: [
        { blood_pressure: "90/60", heart_rate: 55, mood: "concerned" }
      ]
    },
    expected_ai_response: "I've detected a potential medication interaction. This requires immediate attention."
  },
  {
    id: "wellness_achievement",
    name: "Health Goal Achievement",
    description: "Patient reaches significant health milestone",
    category: "lifestyle",
    data_changes: {
      symptoms: [],
      metrics: [
        { steps: 20000, heart_rate: 65, mood: "accomplished", sleep_hours: 8 }
      ],
      profile_updates: { weight_kg: 68, bmi: 24.2 }
    },
    expected_ai_response: "Congratulations on reaching your health goal! Your progress is remarkable."
  }
];

export const personalizationFactors = [
  {
    factor: "Medical History",
    weight: 0.9,
    description: "Chronic conditions and past medical events",
    data_source: "User profile, medical conditions"
  },
  {
    factor: "Current Medications",
    weight: 0.85,
    description: "Active prescriptions and dosages",
    data_source: "Medication schedule and history"
  },
  {
    factor: "Recent Symptoms",
    weight: 0.8,
    description: "Symptoms logged in the past 7 days",
    data_source: "Symptom tracker logs"
  },
  {
    factor: "Vital Signs Trends",
    weight: 0.75,
    description: "Blood pressure, heart rate patterns",
    data_source: "Daily health metrics"
  },
  {
    factor: "Lifestyle Factors",
    weight: 0.7,
    description: "Exercise, sleep, diet patterns",
    data_source: "Activity tracking and user input"
  },
  {
    factor: "Age & Demographics",
    weight: 0.6,
    description: "Age-appropriate health considerations",
    data_source: "User profile demographics"
  },
  {
    factor: "Adherence Patterns",
    weight: 0.65,
    description: "Medication and appointment compliance",
    data_source: "Medication logs and reminders"
  },
  {
    factor: "Emergency Contacts",
    weight: 0.4,
    description: "Support system and emergency planning",
    data_source: "Emergency contact information"
  },
  {
    factor: "Social Support System",
    weight: 0.5,
    description: "Family support and social connections",
    data_source: "Emergency contacts and social history"
  },
  {
    factor: "Health Literacy Level",
    weight: 0.55,
    description: "Understanding of health concepts and terminology",
    data_source: "User interactions and question patterns"
  },
  {
    factor: "Technology Comfort",
    weight: 0.45,
    description: "Comfort level with digital health tools",
    data_source: "App usage patterns and preferences"
  }
];