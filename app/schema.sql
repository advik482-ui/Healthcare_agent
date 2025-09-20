-- ===========================
-- 1. Users
-- ===========================
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS UserTokens (
    token_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    scopes TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
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
