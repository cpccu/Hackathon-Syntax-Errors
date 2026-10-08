import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date, 
    Numeric, Text, ForeignKey, UniqueConstraint, func
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), default="student", nullable=False)  # student, teacher, admin
    avatar_url = Column(Text, nullable=True)
    phone = Column(String(30), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher_profile = relationship("Teacher", back_populates="user", uselist=False, cascade="all, delete-orphan")
    authored_notices = relationship("Notice", back_populates="author")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    student_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "CU-2023-CSE-042"
    department = Column(String(100), index=True, nullable=False)
    semester = Column(Integer, default=1, nullable=False)
    batch = Column(String(50), nullable=False)
    cgpa = Column(Numeric(3, 2), default=0.00)
    enrollment_status = Column(String(50), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="student_profile")
    attendances = relationship("Attendance", back_populates="student")
    submissions = relationship("AssignmentSubmission", back_populates="student")
    results = relationship("Result", back_populates="student")


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    teacher_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "CU-FAC-019"
    department = Column(String(100), index=True, nullable=False)
    designation = Column(String(100), nullable=False)
    office_room = Column(String(50), nullable=True)
    specialization = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="teacher_profile")
    assigned_courses = relationship("Course", back_populates="teacher")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(30), unique=True, index=True, nullable=False)  # e.g., "CSE-3101"
    title = Column(String(200), nullable=False)
    credit_hours = Column(Numeric(2, 1), default=3.0, nullable=False)
    department = Column(String(100), index=True, nullable=False)
    semester = Column(Integer, nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    teacher = relationship("Teacher", back_populates="assigned_courses")
    attendances = relationship("Attendance", back_populates="course")
    assignments = relationship("Assignment", back_populates="course")
    results = relationship("Result", back_populates="course")


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (UniqueConstraint("course_id", "student_id", "date", name="uq_attendance_course_student_date"),)

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, default=datetime.date.today, nullable=False)
    status = Column(String(20), nullable=False)  # present, absent, late, excused
    verification_method = Column(String(30), default="manual")  # manual, qr_scan
    remarks = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="attendances")
    student = relationship("Student", back_populates="attendances")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=False)
    max_marks = Column(Integer, default=100, nullable=False)
    created_by_teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="assignments")
    submissions = relationship("AssignmentSubmission", back_populates="assignment")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"
    __table_args__ = (UniqueConstraint("assignment_id", "student_id", name="uq_submission_assignment_student"),)

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(30), default="submitted")  # submitted, late, graded
    marks_obtained = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="submissions")


class Result(Base):
    __tablename__ = "results"
    __table_args__ = (UniqueConstraint("student_id", "course_id", "semester", "academic_year", name="uq_result_entry"),)

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    semester = Column(Integer, nullable=False)
    academic_year = Column(String(20), nullable=False)  # e.g., "2025-2026"
    midterm_marks = Column(Numeric(5, 2), default=0)
    final_marks = Column(Numeric(5, 2), default=0)
    assignment_marks = Column(Numeric(5, 2), default=0)
    attendance_marks = Column(Numeric(5, 2), default=0)
    total_marks = Column(Numeric(5, 2), nullable=False)
    grade = Column(String(5), nullable=False)  # "A+", "A", "B", "C", "F"
    grade_point = Column(Numeric(3, 2), nullable=False)  # 4.00, 3.75, 3.00
    published_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="results")
    course = relationship("Course", back_populates="results")


class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # academic, exam, bus, clubs, urgent, general
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    target_audience = Column(String(50), default="all")  # all, students, teachers, department
    department = Column(String(100), nullable=True)
    is_pinned = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True), server_default=func.now())

    author = relationship("User", back_populates="authored_notices")
