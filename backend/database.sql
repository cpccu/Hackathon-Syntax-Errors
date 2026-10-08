-- ============================================================================
-- CampusOS - City University: PostgreSQL Database Schema
-- Tables: users, students, teachers, courses, attendance, assignments, notices, results
-- ============================================================================

-- 1. USERS TABLE (Authentication & Role Base)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_url TEXT,
    phone VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. "CU-2023-CSE-042"
    department VARCHAR(100) NOT NULL,      -- e.g. "Computer Science & Engineering"
    semester INT NOT NULL DEFAULT 1 CHECK (semester BETWEEN 1 AND 12),
    batch VARCHAR(50) NOT NULL,             -- e.g. "Batch 58"
    cgpa NUMERIC(3, 2) DEFAULT 0.00 CHECK (cgpa >= 0.00 AND cgpa <= 4.00),
    enrollment_status VARCHAR(50) DEFAULT 'active' CHECK (enrollment_status IN ('active', 'graduated', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);

-- 3. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. "CU-FAC-019"
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,     -- e.g. "Assistant Professor", "Lecturer"
    office_room VARCHAR(50),               -- e.g. "Academic Bldg 2, Room 408"
    specialization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teachers_teacher_id ON teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teachers_department ON teachers(department);

-- 4. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. "CSE-3101"
    title VARCHAR(200) NOT NULL,             -- e.g. "Algorithms & Data Structures II"
    credit_hours NUMERIC(2, 1) NOT NULL DEFAULT 3.0,
    department VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);

-- COURSE ENROLLMENTS JOIN TABLE
CREATE TABLE IF NOT EXISTS course_enrollments (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed')),
    UNIQUE(course_id, student_id)
);

-- 5. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    verification_method VARCHAR(30) DEFAULT 'manual' CHECK (verification_method IN ('manual', 'qr_scan', 'facial')),
    remarks VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_course_date ON attendance(course_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);

-- 6. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_marks INT NOT NULL DEFAULT 100,
    created_by_teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ASSIGNMENT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    file_url TEXT,
    content TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('submitted', 'late', 'graded')),
    marks_obtained INT,
    feedback TEXT,
    UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON assignment_submissions(assignment_id);

-- 7. RESULTS TABLE
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL, -- e.g. "2025-2026"
    midterm_marks NUMERIC(5, 2) DEFAULT 0,
    final_marks NUMERIC(5, 2) DEFAULT 0,
    assignment_marks NUMERIC(5, 2) DEFAULT 0,
    attendance_marks NUMERIC(5, 2) DEFAULT 0,
    total_marks NUMERIC(5, 2) GENERATED ALWAYS AS (midterm_marks + final_marks + assignment_marks + attendance_marks) STORED,
    grade VARCHAR(5) NOT NULL,          -- e.g. "A+", "A", "B", "C", "F"
    grade_point NUMERIC(3, 2) NOT NULL, -- e.g. 4.00, 3.75, 3.00
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, semester, academic_year)
);

CREATE INDEX IF NOT EXISTS idx_results_student ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_course ON results(course_id);

-- 8. NOTICES TABLE
CREATE TABLE IF NOT EXISTS notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('academic', 'exam', 'bus', 'clubs', 'urgent', 'general')),
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'teachers', 'department')),
    department VARCHAR(100),
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_priority ON notices(priority);
