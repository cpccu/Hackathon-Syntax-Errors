from typing import List, Optional
from datetime import datetime, date
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import engine, get_db, Base
from .models import (
    User, Student, Teacher, Course, Attendance, 
    Assignment, AssignmentSubmission, Result, Notice
)
from .schemas import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    StudentCreate, StudentResponse,
    TeacherCreate, TeacherResponse,
    CourseCreate, CourseResponse,
    AttendanceCreate, AttendanceResponse,
    AssignmentCreate, AssignmentResponse, SubmissionCreate, SubmissionResponse,
    ResultCreate, ResultResponse,
    NoticeCreate, NoticeResponse
)
from .auth import (
    get_password_hash, verify_password, create_access_token, get_current_user
)

# Auto-create tables in database if not created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusOS - City University API",
    version="1.0.0",
    description="Unified backend REST API for City University student management and CampusOS hub."
)

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# 1. AUTHENTICATION MODULE
# ============================================================================
@app.post("/api/auth/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        phone=user_in.phone,
        avatar_url=user_in.avatar_url
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.post("/api/auth/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ============================================================================
# 2. DASHBOARD OVERVIEW MODULE
# ============================================================================
@app.get("/api/dashboard/stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    total_students = db.query(Student).count()
    total_teachers = db.query(Teacher).count()
    total_courses = db.query(Course).count()
    recent_notices = db.query(Notice).order_by(Notice.published_at.desc()).limit(5).all()
    
    user_attendance_pct = 94.2
    if current_user.role == "student":
        student_obj = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student_obj:
            total_att = db.query(Attendance).filter(Attendance.student_id == student_obj.id).count()
            present_att = db.query(Attendance).filter(
                Attendance.student_id == student_obj.id, 
                Attendance.status == "present"
            ).count()
            if total_att > 0:
                user_attendance_pct = round((present_att / total_att) * 100, 1)

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_courses": total_courses,
        "attendance_percentage": user_attendance_pct,
        "recent_notices": recent_notices,
        "server_time": datetime.utcnow().isoformat(),
    }


# ============================================================================
# 3. STUDENT MANAGEMENT MODULE
# ============================================================================
@app.get("/api/students", response_model=List[StudentResponse])
def list_students(
    department: Optional[str] = None,
    semester: Optional[int] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    query = db.query(Student)
    if department:
        query = query.filter(Student.department == department)
    if semester:
        query = query.filter(Student.semester == semester)
    return query.all()


@app.post("/api/students", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    student_in: StudentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Only teachers or admins can register students")
    
    student = Student(**student_in.dict())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


# ============================================================================
# 4. TEACHER MANAGEMENT MODULE
# ============================================================================
@app.get("/api/teachers", response_model=List[TeacherResponse])
def list_teachers(
    department: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    query = db.query(Teacher)
    if department:
        query = query.filter(Teacher.department == department)
    return query.all()


@app.post("/api/teachers", response_model=TeacherResponse, status_code=status.HTTP_201_CREATED)
def create_teacher(
    teacher_in: TeacherCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can add teachers")
    
    teacher = Teacher(**teacher_in.dict())
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


# ============================================================================
# 5. COURSE MANAGEMENT MODULE
# ============================================================================
@app.get("/api/courses", response_model=List[CourseResponse])
def list_courses(
    department: Optional[str] = None,
    semester: Optional[int] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    query = db.query(Course)
    if department:
        query = query.filter(Course.department == department)
    if semester:
        query = query.filter(Course.semester == semester)
    return query.all()


@app.post("/api/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: CourseCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    course = Course(**course_in.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


# ============================================================================
# 6. ATTENDANCE MODULE
# ============================================================================
@app.get("/api/attendance", response_model=List[AttendanceResponse])
def get_attendance(
    course_id: Optional[int] = None,
    student_id: Optional[int] = None,
    date_val: Optional[date] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    query = db.query(Attendance)
    if course_id:
        query = query.filter(Attendance.course_id == course_id)
    if student_id:
        query = query.filter(Attendance.student_id == student_id)
    if date_val:
        query = query.filter(Attendance.date == date_val)
    return query.all()


@app.post("/api/attendance", response_model=AttendanceResponse)
def mark_attendance(
    att_in: AttendanceCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = att_in.date or date.today()
    existing = db.query(Attendance).filter(
        Attendance.course_id == att_in.course_id,
        Attendance.student_id == att_in.student_id,
        Attendance.date == today
    ).first()

    if existing:
        existing.status = att_in.status
        existing.verification_method = att_in.verification_method or "manual"
        existing.remarks = att_in.remarks
        db.commit()
        db.refresh(existing)
        return existing

    record = Attendance(
        course_id=att_in.course_id,
        student_id=att_in.student_id,
        date=today,
        status=att_in.status,
        verification_method=att_in.verification_method or "manual",
        remarks=att_in.remarks
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ============================================================================
# 7. ASSIGNMENTS MODULE
# ============================================================================
@app.get("/api/assignments", response_model=List[AssignmentResponse])
def list_assignments(
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    query = db.query(Assignment)
    if course_id:
        query = query.filter(Assignment.course_id == course_id)
    return query.order_by(Assignment.due_date.asc()).all()


@app.post("/api/assignments", response_model=AssignmentResponse)
def create_assignment(
    assign_in: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Only teachers can post assignments")
    
    assignment = Assignment(**assign_in.dict())
    if current_user.role == "teacher" and current_user.teacher_profile:
        assignment.created_by_teacher_id = current_user.teacher_profile.id

    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@app.post("/api/assignments/{assignment_id}/submit", response_model=SubmissionResponse)
def submit_assignment(
    assignment_id: int,
    submission_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.student_profile:
        raise HTTPException(status_code=400, detail="Only students can submit assignments")
    
    student_id = current_user.student_profile.id
    existing = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.assignment_id == assignment_id,
        AssignmentSubmission.student_id == student_id
    ).first()

    if existing:
        existing.content = submission_in.content
        existing.file_url = submission_in.file_url
        existing.submitted_at = datetime.utcnow()
        existing.status = "submitted"
        db.commit()
        db.refresh(existing)
        return existing

    sub = AssignmentSubmission(
        assignment_id=assignment_id,
        student_id=student_id,
        content=submission_in.content,
        file_url=submission_in.file_url,
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


# ============================================================================
# 8. RESULTS MODULE
# ============================================================================
@app.get("/api/results", response_model=List[ResultResponse])
def get_results(
    student_id: Optional[int] = None,
    course_id: Optional[int] = None,
    semester: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Result)
    if current_user.role == "student" and current_user.student_profile:
        query = query.filter(Result.student_id == current_user.student_profile.id)
    elif student_id:
        query = query.filter(Result.student_id == student_id)
        
    if course_id:
        query = query.filter(Result.course_id == course_id)
    if semester:
        query = query.filter(Result.semester == semester)
    return query.all()


@app.post("/api/results", response_model=ResultResponse)
def publish_result(
    result_in: ResultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    res = Result(**result_in.dict())
    db.add(res)
    db.commit()
    db.refresh(res)
    return res


# ============================================================================
# 9. NOTICES & NOTIFICATIONS MODULE
# ============================================================================
@app.get("/api/notices", response_model=List[NoticeResponse])
def list_notices(
    category: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Notice)
    if category:
        query = query.filter(Notice.category == category)
    if priority:
        query = query.filter(Notice.priority == priority)
    return query.order_by(Notice.is_pinned.desc(), Notice.published_at.desc()).all()


@app.post("/api/notices", response_model=NoticeResponse)
def create_notice(
    notice_in: NoticeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notice = Notice(**notice_in.dict(), author_id=current_user.id)
    db.add(notice)
    db.commit()
    db.refresh(notice)
    return notice


@app.get("/")
def root():
    return {
        "system": "CampusOS - City University",
        "status": "Online",
        "docs_url": "/docs",
        "version": "1.0.0"
    }
