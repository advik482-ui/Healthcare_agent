-- ===========================
-- 1. Users
-- ===========================
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    email TEXT UNIQUE NOT NULL,              -- for login
    pass TEXT NOT NULL,                  -- store hashed password
    height_cm REAL,                          -- user's height in centimeters
    weight_kg REAL,                          -- user's weight in kilograms
    bmi REAL,                                -- Body Mass Index
    blood_group TEXT,                        -- A+, O-, etc.
    activity_level TEXT,                     -- sedentary, moderate, active
    gym_member BOOLEAN DEFAULT FALSE,        -- whether user goes to gym
    smoker BOOLEAN DEFAULT FALSE,            
    alcohol BOOLEAN DEFAULT FALSE,
    medications BOOLEAN DEFAULT FALSE,       -- whether user is on medications
    ever_hospitalized BOOLEAN DEFAULT FALSE,
    ever_concussion BOOLEAN DEFAULT FALSE,
    allergies TEXT,                          -- comma-separated or JSON
    medical_conditions TEXT,                 -- comma-separated or JSON
    avg_sleep_hours REAL,                     -- average sleep per day
    avg_blood_pressure TEXT,                 -- e.g., "120/80" 
    avg_heart_rate INTEGER,                  -- average BPM
    avg_water_intake REAL,                   -- average daily water intake (liters)
    cholesterol_level REAL,                  -- in mg/dL
    blood_sugar_level REAL,                  -- in mg/dL
    steps_per_day INTEGER,                    -- average daily steps
    last_checkup DATETIME,                   
    emergency_contact TEXT,                  -- JSON or "Name:Phone"
    yesterday_summary TEXT,                  -- summary of yesterday's stats
    last_month_summary TEXT,                 -- summary of last month's stats
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS UserTokens (
    token_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    scopes TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP

    --FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ===========================
-- 2. Daily Metrics (per day snapshot)
-- ===========================
CREATE TABLE IF NOT EXISTS DailyMetrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    steps INTEGER,
    heart_rate INTEGER,
    sleep_hours REAL,
    blood_pressure TEXT,
    mood TEXT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    UNIQUE(user_id, date) -- only one entry per day per user
);

-- ===========================
-- 4. Medications + UserMedications + Schedule
-- ===========================
CREATE TABLE IF NOT EXISTS Medications (
    medication_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dosage TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS UserMedications (
    user_med_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    medication_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    frequency TEXT,     -- e.g., "daily", "weekly"
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (medication_id) REFERENCES Medications(medication_id)
);

CREATE TABLE IF NOT EXISTS MedicationSchedule (
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_med_id INTEGER NOT NULL,
    date DATE NOT NULL,     -- calendar day
    time TIME NOT NULL,     -- exact time slot
    status TEXT DEFAULT 'pending', -- pending, taken, missed
    FOREIGN KEY (user_med_id) REFERENCES UserMedications(user_med_id)
);

-- ===========================
-- 5. Disorders + UserDisorders
-- ===========================
CREATE TABLE IF NOT EXISTS Disorders (
    disorder_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS UserDisorders (
    user_disorder_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    disorder_id INTEGER NOT NULL,
    diagnosed_date DATE NOT NULL,
    resolved_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (disorder_id) REFERENCES Disorders(disorder_id)
);

-- ===========================
-- 6. Symptoms
-- ===========================
CREATE TABLE IF NOT EXISTS Symptoms (
    symptom_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    symptom TEXT NOT NULL,
    severity TEXT,              -- mild, moderate, severe
    duration TEXT,              -- how long the symptom has been present
    notes TEXT,                 -- additional notes about the symptom
    log_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- ===========================
-- 7. Reports
-- ===========================
CREATE TABLE IF NOT EXISTS Reports (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    report_date DATE NOT NULL,  -- daily or weekly anchor
    report_type TEXT,           -- daily, weekly, monthly
    content TEXT,               -- JSON or text
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
