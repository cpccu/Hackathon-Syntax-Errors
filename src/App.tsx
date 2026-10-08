/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { StudentManagementView } from './components/StudentManagementView';
import { TeacherManagementView } from './components/TeacherManagementView';
import { CourseManagementView } from './components/CourseManagementView';
import { AttendanceView } from './components/AttendanceView';
import { AssignmentsView } from './components/AssignmentsView';
import { ResultsView } from './components/ResultsView';
import { NoticesView } from './components/NoticesView';
import { CampusHubView } from './components/CampusHubView';
import { DocumentationModal } from './components/DocumentationModal';
import { QrPassModal } from './components/QrPassModal';

import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_RESULTS,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_RESOURCES,
  INITIAL_BUS_ROUTES,
  INITIAL_LOST_FOUND,
  INITIAL_COMPLAINTS,
} from './mockData';

import { 
  User, 
  UserRole, 
  StudentRecord, 
  TeacherRecord, 
  CourseRecord, 
  AttendanceRecord, 
  AssignmentRecord, 
  NoticeRecord, 
  CampusEvent, 
  AcademicResource, 
  LostFoundItem, 
  ComplaintTicket 
} from './types';

export default function App() {
  // Authentication & Current User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campusos_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Default logged in as Student demo for instant accessibility
    return {
      id: 2725105101119,
      email: 'abir.cse@cityuniversity.edu.bd',
      fullName: 'Md Arifuzzaman Abir',
      role: 'student',
      studentId: 'CU-2023-CSE-042',
      department: 'Computer Science & Engineering',
      semester: 4,
      batch: 'Batch 66',
      cgpa: 3.41,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<{ isOpen: boolean; title: string; code: string }>({
    isOpen: false,
    title: '',
    code: '',
  });

  // Application Data States
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<TeacherRecord[]>(INITIAL_TEACHERS);
  const [courses, setCourses] = useState<CourseRecord[]>(INITIAL_COURSES);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>(INITIAL_ASSIGNMENTS);
  const [results] = useState(INITIAL_RESULTS);
  const [notices, setNotices] = useState<NoticeRecord[]>(INITIAL_NOTICES);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [resources, setResources] = useState<AcademicResource[]>(INITIAL_RESOURCES);
  const [busRoutes] = useState(INITIAL_BUS_ROUTES);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(INITIAL_COMPLAINTS);

  // Quick Switch Roles
  const handleQuickSwitchRole = (role: UserRole) => {
    if (role === 'teacher') {
      const teacherUser: User = {
        id: 201,
        email: 'selim.reza@cityuniversity.edu.bd',
        fullName: 'Dr. Selim Reza',
        role: 'teacher',
        department: 'Computer Science & Engineering',
        designation: 'Associate Professor & Dept Head',
        officeRoom: 'Bldg 2, Room 402',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      };
      setCurrentUser(teacherUser);
      localStorage.setItem('campusos_current_user', JSON.stringify(teacherUser));
    } else if (role === 'admin') {
      const adminUser: User = {
        id: 999,
        email: 'admin@cityuniversity.edu.bd',
        fullName: 'City University Administration',
        role: 'admin',
        department: 'Academic Affairs & Campus Administration',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };
      setCurrentUser(adminUser);
      localStorage.setItem('campusos_current_user', JSON.stringify(adminUser));
    } else {
      const studentUser: User = {
        id: 2725105101119,
        email: 'abir.cse@cityuniversity.edu.bd',
        fullName: 'Md Arifuzzaman Abir',
        role: 'student',
        studentId: 'CU-2023-CSE-042',
        department: 'Computer Science & Engineering',
        semester: 4,
        batch: 'Batch 66',
        cgpa: 3.41,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };
      setCurrentUser(studentUser);
      localStorage.setItem('campusos_current_user', JSON.stringify(studentUser));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campusos_current_user');
    localStorage.removeItem('campusos_auth_token');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  // Add Handlers
  const handleAddStudent = (newStudent: Omit<StudentRecord, 'id' | 'userId'>) => {
    const student: StudentRecord = {
      ...newStudent,
      id: students.length + 1,
      userId: 100 + students.length + 1,
    };
    setStudents([student, ...students]);
  };

  const handleAddTeacher = (newTeacher: Omit<TeacherRecord, 'id' | 'userId'>) => {
    const teacher: TeacherRecord = {
      ...newTeacher,
      id: teachers.length + 1,
      userId: 200 + teachers.length + 1,
    };
    setTeachers([teacher, ...teachers]);
  };

  const handleAddCourse = (newCourse: Omit<CourseRecord, 'id' | 'enrolledStudentsCount'>) => {
    const course: CourseRecord = {
      ...newCourse,
      id: courses.length + 1,
      enrolledStudentsCount: 1,
    };
    setCourses([...courses, course]);
  };

  const handleMarkAttendance = (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: attendanceRecords.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAttendanceRecords([newRecord, ...attendanceRecords]);
  };

  const handleSubmitAssignment = (assignmentId: number, content: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'submitted',
              submittedDate: new Date().toISOString(),
            }
          : a
      )
    );
  };

  const handleAddNotice = (notice: Omit<NoticeRecord, 'id' | 'publishedAt'>) => {
    const newNotice: NoticeRecord = {
      ...notice,
      id: notices.length + 1,
      publishedAt: 'Just now',
    };
    setNotices([newNotice, ...notices]);
  };

  const handleRegisterEvent = (eventId: number) => {
    const generatedTicketCode = `CPCCU-TKT-${eventId}-${Math.floor(1000 + Math.random() * 9000)}`;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            isRegistered: true,
            registeredCount: ev.registeredCount + 1,
            ticketCode: generatedTicketCode,
          };
        }
        return ev;
      })
    );
    const targetEvent = events.find((ev) => ev.id === eventId);
    if (targetEvent) {
      setQrModalData({
        isOpen: true,
        title: targetEvent.title,
        code: generatedTicketCode,
      });
    }
  };

  const handleAddResource = (resource: Omit<AcademicResource, 'id' | 'downloadsCount'>) => {
    const newRes: AcademicResource = {
      ...resource,
      id: resources.length + 1,
      downloadsCount: 0,
    };
    setResources([newRes, ...resources]);
  };

  const handleAddLostFound = (item: Omit<LostFoundItem, 'id' | 'status'>) => {
    const newItem: LostFoundItem = {
      ...item,
      id: lostFoundItems.length + 1,
      status: 'open',
    };
    setLostFoundItems([newItem, ...lostFoundItems]);
  };

  const handleAddComplaint = (ticket: Omit<ComplaintTicket, 'id' | 'submittedAt' | 'status'>) => {
    const newTicket: ComplaintTicket = {
      ...ticket,
      id: `CU-CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      submittedAt: 'Just now',
      status: 'received',
      feedbackNotes: 'Ticket received by Registrar Administrative Desk. Queue position #1.',
    };
    setComplaints([newTicket, ...complaints]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenDocs={() => setIsDocsOpen(true)}
        onQuickSwitchRole={handleQuickSwitchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            courses={courses}
            notices={notices}
            events={events}
            busRoutes={busRoutes}
            assignments={assignments}
            onNavigateTab={setActiveTab}
            onOpenQrPass={(title, code) =>
              setQrModalData({ isOpen: true, title, code })
            }
          />
        )}

        {activeTab === 'campus-hub' && (
          <CampusHubView
            currentUser={currentUser}
            events={events}
            resources={resources}
            busRoutes={busRoutes}
            lostFoundItems={lostFoundItems}
            complaints={complaints}
            onRegisterEvent={handleRegisterEvent}
            onOpenQrPass={(title, code) =>
              setQrModalData({ isOpen: true, title, code })
            }
            onAddResource={handleAddResource}
            onAddLostFound={handleAddLostFound}
            onAddComplaint={handleAddComplaint}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            currentUser={currentUser}
            courses={courses}
            attendanceRecords={attendanceRecords}
            onMarkAttendance={handleMarkAttendance}
          />
        )}

        {activeTab === 'courses' && (
          <CourseManagementView
            courses={courses}
            onAddCourse={handleAddCourse}
            currentUserRole={currentUser?.role}
          />
        )}

        {activeTab === 'students' && (
          <StudentManagementView
            students={students}
            onAddStudent={handleAddStudent}
            currentUserRole={currentUser?.role}
          />
        )}

        {activeTab === 'teachers' && (
          <TeacherManagementView
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            currentUserRole={currentUser?.role}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView
            assignments={assignments}
            onSubmitAssignment={handleSubmitAssignment}
            currentUserRole={currentUser?.role}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            results={results}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'notices' && (
          <NoticesView
            notices={notices}
            onAddNotice={handleAddNotice}
            currentUserRole={currentUser?.role}
          />
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <QrPassModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData({ isOpen: false, title: '', code: '' })}
        eventTitle={qrModalData.title}
        ticketCode={qrModalData.code}
        studentName={currentUser?.fullName || 'Rafid Ahmed'}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">CampusOS — City University</span>
            <span>•</span>
            <span>CPCCU Hackathon 2026 Official Submission</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDocsOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Technical Docs & Schema
            </button>
            <span>•</span>
            <span>All 4 Core Modules Functional</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
