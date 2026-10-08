import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  CheckCircle, 
  X,
  UserCheck
} from 'lucide-react';
import { StudentRecord, UserRole } from '../types';

interface StudentManagementProps {
  students: StudentRecord[];
  onAddStudent: (newStudent: Omit<StudentRecord, 'id' | 'userId'>) => void;
  currentUserRole?: UserRole;
}

export const StudentManagementView: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  currentUserRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(1);
  const [batch, setBatch] = useState('Batch 61');
  const [phone, setPhone] = useState('+880 1711-000000');
  const [cgpa, setCgpa] = useState(3.75);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    const matchesSem = semesterFilter === 'All' || s.semester.toString() === semesterFilter;
    return matchesSearch && matchesDept && matchesSem;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({
      fullName,
      studentId,
      email,
      department,
      semester: Number(semester),
      batch,
      phone,
      cgpa: Number(cgpa),
      enrollmentStatus: 'active',
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=200&q=80`,
    });
    setIsModalOpen(false);
    // Reset form
    setFullName('');
    setStudentId('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Student Management System</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of enrolled students across all City University departments & batches
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll ID (e.g. CU-2023-CSE), or email..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Electrical & Electronic Engineering">EEE</option>
            <option value="Business Administration">BBA</option>
          </select>
        </div>

        <div>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="All">All Semesters</option>
            <option value="1">1st Semester</option>
            <option value="3">3rd Semester</option>
            <option value="5">5th Semester</option>
            <option value="7">7th Semester</option>
          </select>
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => setSelectedStudent(student)}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start space-x-3">
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {student.fullName}
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>
                <p className="text-[11px] font-mono font-semibold text-blue-600">
                  {student.studentId}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {student.department}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-3 text-center text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Semester</span>
                <span className="font-bold text-slate-700">{student.semester}th</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Batch</span>
                <span className="font-bold text-slate-700">{student.batch}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CGPA</span>
                <span className="font-bold text-emerald-600">{student.cgpa.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No students match your search</p>
            <p className="text-xs text-slate-400">Try adjusting your department or semester filter.</p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white relative">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.fullName}
                  className="w-14 h-14 rounded-full border-2 border-white object-cover"
                />
                <div>
                  <h3 className="font-bold text-base">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-blue-200 font-mono">{selectedStudent.studentId}</p>
                  <p className="text-xs text-blue-100">{selectedStudent.department}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Semester</span>
                  <strong className="text-slate-800">{selectedStudent.semester}th Semester</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Academic Batch</span>
                  <strong className="text-slate-800">{selectedStudent.batch}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Cumulative GPA</span>
                  <strong className="text-emerald-700 font-bold">{selectedStudent.cgpa.toFixed(2)} / 4.00</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status</span>
                  <strong className="text-blue-700 uppercase">{selectedStudent.enrollmentStatus}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedStudent.phone}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Register Student to CampusOS</h3>
                <p className="text-xs text-slate-400">PostgreSQL `students` & `users` tables insertion</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Asif Mahmud"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Roll ID</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="CU-2024-CSE-102"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="asif.cse@cityuniversity.edu.bd"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electrical & Electronic Engineering">EEE</option>
                    <option value="Business Administration">BBA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Confirm & Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
