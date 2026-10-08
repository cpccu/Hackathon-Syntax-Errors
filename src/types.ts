export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  studentId?: string;
  department?: string;
  semester?: number;
  batch?: string;
  cgpa?: number;
  designation?: string;
  officeRoom?: string;
}

export interface StudentRecord {
  id: number;
  userId: number;
  studentId: string;
  fullName: string;
  email: string;
  department: string;
  semester: number;
  batch: string;
  cgpa: number;
  phone: string;
  enrollmentStatus: 'active' | 'graduated' | 'suspended';
  avatarUrl: string;
}

export interface TeacherRecord {
  id: number;
  userId: number;
  teacherId: string;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  officeRoom: string;
  specialization: string;
  phone: string;
  avatarUrl: string;
}

export interface CourseRecord {
  id: number;
  courseCode: string;
  title: string;
  creditHours: number;
  department: string;
  semester: number;
  teacherId: number;
  teacherName: string;
  description: string;
  schedule: string;
  room: string;
  enrolledStudentsCount: number;
}

export interface AttendanceRecord {
  id: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  studentId: number;
  studentName: string;
  studentRoll: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  verificationMethod: 'qr_scan' | 'manual';
  timestamp: string;
}

export interface AssignmentRecord {
  id: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedDate?: string;
  marksObtained?: number;
  feedback?: string;
}

export interface ResultRecord {
  id: number;
  studentId: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  semester: number;
  midtermMarks: number;
  finalMarks: number;
  assignmentMarks: number;
  attendanceMarks: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
}

export interface NoticeRecord {
  id: number;
  title: string;
  content: string;
  category: 'academic' | 'exam' | 'bus' | 'clubs' | 'urgent' | 'general';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  author: string;
  department?: string;
  isPinned: boolean;
  publishedAt: string;
}

export interface CampusEvent {
  id: number;
  title: string;
  clubName: string;
  clubCategory: 'technical' | 'cultural' | 'sports' | 'debate' | 'academic';
  date: string;
  time: string;
  location: string;
  description: string;
  bannerUrl: string;
  capacity: number;
  registeredCount: number;
  isRegistered?: boolean;
  ticketCode?: string;
}

export interface AcademicResource {
  id: number;
  title: string;
  courseCode: string;
  courseName: string;
  department: string;
  semester: number;
  category: 'question_paper' | 'lecture_notes' | 'lab_manual' | 'syllabus' | 'solution';
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  downloadsCount: number;
}

export interface ShuttleBusRoute {
  id: string;
  routeName: string;
  busNumber: string;
  startingPoint: string;
  destination: string;
  stops: string[];
  scheduleTimes: string[];
  currentStatus: 'on_time' | 'delayed' | 'in_transit' | 'departed';
  driverContact: string;
}

export interface LostFoundItem {
  id: number;
  type: 'lost' | 'found';
  title: string;
  category: 'id_card' | 'electronics' | 'bag' | 'calculator' | 'keys' | 'books' | 'other';
  location: string;
  dateReported: string;
  contactName: string;
  contactPhone: string;
  description: string;
  imageUrl?: string;
  status: 'open' | 'claimed' | 'resolved';
}

export interface ComplaintTicket {
  id: string;
  title: string;
  department: string;
  category: 'infrastructure' | 'bus_service' | 'canteen' | 'library' | 'academic' | 'other';
  description: string;
  submittedAt: string;
  status: 'received' | 'in_review' | 'resolved';
  feedbackNotes?: string;
}
