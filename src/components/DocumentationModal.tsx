import React, { useState } from 'react';
import { 
  X, 
  BookMarked, 
  Database, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Code, 
  Layers, 
  ExternalLink,
  CheckCircle2,
  Users
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeDocSection, setActiveDocSection] = useState<'overview' | 'scenarios' | 'schema' | 'fastapi' | 'fetch'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">CampusOS — Project Technical Documentation</h2>
              <p className="text-xs text-slate-400">CPCCU AI-Powered Web App Hackathon 2026 Judge Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: '1. Executive Overview & Modules' },
            { id: 'scenarios', label: '2. Real-World Usability Scenarios' },
            { id: 'schema', label: '3. PostgreSQL Schema (8 Tables)' },
            { id: 'fastapi', label: '4. Python FastAPI API Endpoints' },
            { id: 'fetch', label: '5. JavaScript fetch() Integration' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveDocSection(sec.id as any)}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeDocSection === sec.id
                  ? 'border-blue-600 text-blue-600 bg-white font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          
          {/* SECTION 1: OVERVIEW */}
          {activeDocSection === 'overview' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                <h3 className="font-bold text-sm text-blue-900">What is CampusOS?</h3>
                <p className="text-slate-700">
                  CampusOS is a unified digital campus hub purpose-built for <strong>City University (CU)</strong>. It eliminates the deep fragmentation where critical daily information was scattered across 10+ Facebook groups, frantic Messenger threads, unindexed Google Forms, and physical notice boards.
                </p>
              </div>

              <h4 className="font-bold text-sm text-slate-900 pt-2">The 4 Core Built Modules (All Implemented):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <strong className="text-blue-700 block">1. Club & Event Engine</strong>
                  <p className="text-slate-600 text-[11px]">
                    Unified event feed across CPCCU, Robotics, Debate, and Sports clubs. Includes student registration, live capacity counters, and a cryptographic <strong>QR Code attendance pass</strong> with door scanner validation.
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <strong className="text-blue-700 block">2. Resource Hub</strong>
                  <p className="text-slate-600 text-[11px]">
                    Searchable academic archive for past semester question papers, lecture notes, and lab manuals organized by Course Code, Department, and Semester.
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <strong className="text-blue-700 block">3. Smart Helpdesk & Shuttle Hub</strong>
                  <p className="text-slate-600 text-[11px]">
                    All City University shuttle routes (Mirpur, Uttara, Dhanmondi) with next departure times, route stops, driver contacts, and a grounded AI Helpdesk bot answering university queries.
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <strong className="text-blue-700 block">4. Lost & Found / Complaint Desk</strong>
                  <p className="text-slate-600 text-[11px]">
                    Report lost ID cards, calculators, and laptops. Browse found items. File official student grievance complaints with transparent progress tracking IDs.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Hackathon Evaluation Credentials:</h4>
                <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <strong>Student Demo:</strong><br />
                    email: rafid.cse@cityuniversity.edu.bd<br />
                    password: password123
                  </div>
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <strong>Teacher Demo:</strong><br />
                    email: selim.reza@cityuniversity.edu.bd<br />
                    password: password123
                  </div>
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <strong>Admin Demo:</strong><br />
                    email: admin@cityuniversity.edu.bd<br />
                    password: adminpass
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: REAL-WORLD USABILITY SCENARIOS */}
          {activeDocSection === 'scenarios' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Concrete Real-World Usability Scenarios for City University Students
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
                  <span className="font-bold text-blue-900 block">
                    Scenario A: The 11:30 PM Pre-Exam Panic
                  </span>
                  <p className="text-slate-600">
                    <strong>Previous Friction:</strong> The night before the Algorithms Midterm, a 3rd-year student messages multiple group chats asking: <em>"Does anyone have Fall 2024 question paper or Prof. Selim's DP lecture notes?"</em> Messages get buried under stickers, chatter, or silence.
                  </p>
                  <p className="text-blue-800 font-medium">
                    <strong>CampusOS Solution:</strong> The student opens the <em>Resource Hub</em>, filters by <code>CSE-3101</code>, and instantly downloads the verified past question paper and PDF solution in 2 clicks.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                  <span className="font-bold text-emerald-900 block">
                    Scenario B: The 7:15 AM Shuttle Commute
                  </span>
                  <p className="text-slate-600">
                    <strong>Previous Friction:</strong> A student at Mirpur-10 isn't sure whether the morning bus departs at 07:15 AM or 07:30 AM because the schedule was shared months ago in a 500-person Messenger thread. Missing the bus means missing the 08:30 AM lab class.
                  </p>
                  <p className="text-emerald-800 font-medium">
                    <strong>CampusOS Solution:</strong> The student checks the <em>CampusOS Dashboard</em>: the Next Campus Shuttle widget clearly displays the live departure time, intermediate stops (Mirpur-14, ECB Chattar), and driver phone number.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
                  <span className="font-bold text-purple-900 block">
                    Scenario C: CPCCU Hackathon Check-In at the Door
                  </span>
                  <p className="text-slate-600">
                    <strong>Previous Friction:</strong> Event registration used ad-hoc Google Forms. At the door, organizers manually cross-checked names against messy spreadsheets, causing long queues and proxy attendees.
                  </p>
                  <p className="text-purple-800 font-medium">
                    <strong>CampusOS Solution:</strong> Students RSVP directly in the Club Engine, generating a unique cryptographic QR Pass. Organizers scan it at the door using the Attendance & QR Scanner for instant 1-second admission.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: POSTGRESQL SCHEMA */}
          {activeDocSection === 'schema' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Relational PostgreSQL Database Architecture (8 Core Tables)
              </h3>
              <p className="text-slate-600 text-xs">
                Located in <code>/backend/database.sql</code>, fully normalized to 3NF with foreign keys and B-tree indexes:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <strong className="text-blue-700">1. users</strong>
                  <p className="text-[11px] text-slate-500">id, email, password_hash, full_name, role (student/teacher/admin), phone</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <strong className="text-blue-700">2. students</strong>
                  <p className="text-[11px] text-slate-500">id, user_id (FK), student_id (Roll), department, semester, batch, cgpa</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <strong className="text-blue-700">3. teachers</strong>
                  <p className="text-[11px] text-slate-500">id, user_id (FK), teacher_id, department, designation, office_room, specialization</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <strong className="text-blue-700">4. courses</strong>
                  <p className="text-[11px] text-slate-500">id, course_code, title, credit_hours, department, semester, teacher_id (FK)</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <strong className="text-blue-700">5. attendance</strong>
                  <p className="text-[11px] text-slate-500">id, course_id (FK), student_id (FK), date, status, verification_method (qr_scan)</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <strong className="text-blue-700">6. assignments</strong>
                  <p className="text-[11px] text-slate-500">id, course_id (FK), title, description, due_date, max_marks, submissions (FK)</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <strong className="text-blue-700">7. results</strong>
                  <p className="text-[11px] text-slate-500">id, student_id (FK), course_id (FK), midterm, final, assignment, total, grade, grade_point</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <strong className="text-blue-700">8. notices</strong>
                  <p className="text-[11px] text-slate-500">id, title, content, category, priority, author_id (FK), is_pinned, published_at</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: FASTAPI ENDPOINTS */}
          {activeDocSection === 'fastapi' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Python + FastAPI REST Endpoints (Implementation in /backend/main.py)
              </h3>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-900 text-slate-200 rounded-xl space-y-1">
                  <span className="text-emerald-400 font-bold">POST</span> /api/auth/login <span className="text-slate-400">— Authenticate & return JWT Bearer token</span><br />
                  <span className="text-emerald-400 font-bold">POST</span> /api/auth/register <span className="text-slate-400">— Register student or teacher user</span><br />
                  <span className="text-blue-400 font-bold">GET</span> /api/auth/me <span className="text-slate-400">— Validate active token & profile</span><br />
                  <span className="text-blue-400 font-bold">GET</span> /api/dashboard/stats <span className="text-slate-400">— Overview KPIs, unread notices, attendance %</span><br />
                  <span className="text-blue-400 font-bold">GET</span> /api/students <span className="text-slate-400">— List / filter students by department & semester</span><br />
                  <span className="text-blue-400 font-bold">GET</span> /api/teachers <span className="text-slate-400">— Faculty directory & designations</span><br />
                  <span className="text-blue-400 font-bold">GET</span> /api/courses <span className="text-slate-400">— Course catalog & weekly schedules</span><br />
                  <span className="text-emerald-400 font-bold">POST</span> /api/attendance <span className="text-slate-400">— Mark attendance (via QR scan payload or ledger)</span><br />
                  <span className="text-blue-400 font-bold">GET</span> /api/assignments <span className="text-slate-400">— List course deliverables & deadlines</span><br />
                  <span className="text-emerald-400 font-bold">POST</span> /api/assignments/:id/submit <span className="text-slate-400">— Submit lab solution</span><br />
                  <span className="text-blue-400 font-bold">GET</span> /api/results <span className="text-slate-400">— Student academic transcript & GPA records</span><br />
                  <span className="text-blue-400 font-bold">GET</span> /api/notices <span className="text-slate-400">— Official campus announcements</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: FETCH CODE */}
          {activeDocSection === 'fetch' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Connecting HTML/JavaScript Login Form to FastAPI with fetch()
              </h3>

              <div className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
                <pre>{`// JavaScript form submit handler connecting to FastAPI:
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    // Store JWT token
    localStorage.setItem('campusos_auth_token', data.access_token);
    localStorage.setItem('campusos_current_user', JSON.stringify(data.user));

    // Redirect to Dashboard
    window.location.href = '/dashboard';
  } catch (err) {
    alert(err.message);
  }
});`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>CampusOS • City University Hackathon 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
