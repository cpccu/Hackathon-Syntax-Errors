from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# --- AUTH & USER SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- STUDENT SCHEMAS ---
class StudentBase(BaseModel):
    student_id: str
    department: str
    semester: int = Field(ge=1, le=12)
    batch: str
    cgpa: Optional[float] = 0.0
    enrollment_status: Optional[str] = "active"

class StudentCreate(StudentBase):
    user_id: int

class StudentResponse(StudentBase):
    id: int
    user_id: int
    user: Optional[UserResponse] = None
    class Config:
        from_attributes = True


# --- TEACHER SCHEMAS ---
class TeacherBase(BaseModel):
    teacher_id: str
    department: str
    designation: str
    office_room: Optional[str] = None
    specialization: Optional[str] = None

class TeacherCreate(TeacherBase):
    user_id: int

class TeacherResponse(TeacherBase):
    id: int
    user_id: int
    user: Optional[UserResponse] = None
    class Config:
        from_attributes = True


# --- COURSE SCHEMAS ---
class CourseBase(BaseModel):
    course_code: str
    title: str
    credit_hours: float = 3.0
    department: str
    semester: int
    teacher_id: Optional[int] = None
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    teacher: Optional[TeacherResponse] = None
    class Config:
        from_attributes = True


# --- ATTENDANCE SCHEMAS ---
class AttendanceBase(BaseModel):
    course_id: int
    student_id: int
    date: Optional[date] = None
    status: str  # present, absent, late, excused
    verification_method: Optional[str] = "manual"
    remarks: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True


# --- ASSIGNMENT SCHEMAS ---
class AssignmentBase(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    due_date: datetime
    max_marks: int = 100

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentResponse(AssignmentBase):
    id: int
    created_by_teacher_id: Optional[int] = None
    created_at: datetime
    class Config:
        from_attributes = True

class SubmissionCreate(BaseModel):
    content: Optional[str] = None
    file_url: Optional[str] = None

class SubmissionResponse(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    content: Optional[str] = None
    file_url: Optional[str] = None
    submitted_at: datetime
    status: str
    marks_obtained: Optional[int] = None
    feedback: Optional[str] = None
    class Config:
        from_attributes = True


# --- RESULT SCHEMAS ---
class ResultBase(BaseModel):
    student_id: int
    course_id: int
    semester: int
    academic_year: str
    midterm_marks: float = 0.0
    final_marks: float = 0.0
    assignment_marks: float = 0.0
    attendance_marks: float = 0.0
    grade: str
    grade_point: float

class ResultCreate(ResultBase):
    pass

class ResultResponse(ResultBase):
    id: int
    total_marks: float
    published_at: datetime
    class Config:
        from_attributes = True


# --- NOTICE SCHEMAS ---
class NoticeBase(BaseModel):
    title: str
    content: str
    category: str  # academic, exam, bus, clubs, urgent, general
    priority: str = "normal"
    target_audience: str = "all"
    department: Optional[str] = None
    is_pinned: bool = False

class NoticeCreate(NoticeBase):
    pass

class NoticeResponse(NoticeBase):
    id: int
    author_id: Optional[int] = None
    published_at: datetime
    class Config:
        from_attributes = True
