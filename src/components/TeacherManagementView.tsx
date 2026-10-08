import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Briefcase, 
  Plus, 
  X,
  Award
} from 'lucide-react';
import { TeacherRecord, UserRole } from '../types';

interface TeacherManagementProps {
  teachers: TeacherRecord[];
  onAddTeacher: (teacher: Omit<TeacherRecord, 'id' | 'userId'>) => void;
  currentUserRole?: UserRole;
}

export const TeacherManagementView: React.FC<TeacherManagementProps> = ({
  teachers,
  onAddTeacher,
  currentUserRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [officeRoom, setOfficeRoom] = useState('Bldg 2, Room 410');
  const [specialization, setSpecialization] = useState('Machine Learning & Network Security');
  const [phone, setPhone] = useState('+880 1711-888999');

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || t.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTeacher({
      fullName,
      teacherId,
      email,
      department,
      designation,
      officeRoom,
      specialization,
      phone,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">Faculty Directory & Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            City University professors, lecturers, and academic mentors with office hours & research areas
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by faculty name, designation, or specialization..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
          />
        </div>

        <div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Electrical & Electronic Engineering">EEE</option>
            <option value="Business Administration">BBA</option>
          </select>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            onClick={() => setSelectedTeacher(teacher)}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-purple-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start space-x-3.5">
              <img
                src={teacher.avatarUrl}
                alt={teacher.fullName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {teacher.fullName}
                </h4>
                <p className="text-[11px] font-semibold text-purple-700">
                  {teacher.designation}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {teacher.department}
                </p>
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  {teacher.teacherId}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{teacher.officeRoom}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-medium text-slate-700">{teacher.specialization}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center space-x-1 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[170px]">{teacher.email}</span>
              </div>
              <span className="text-purple-600 font-bold hover:underline">Profile →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-6 text-white relative">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3.5">
                <img
                  src={selectedTeacher.avatarUrl}
                  alt={selectedTeacher.fullName}
                  className="w-16 h-16 rounded-full border-2 border-white object-cover"
                />
                <div>
                  <h3 className="font-bold text-base">{selectedTeacher.fullName}</h3>
                  <p className="text-xs text-purple-200">{selectedTeacher.designation}</p>
                  <p className="text-xs text-purple-100">{selectedTeacher.department}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 space-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Office Location</span>
                  <strong className="text-slate-800 text-xs">{selectedTeacher.officeRoom}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Academic Specialization</span>
                  <strong className="text-purple-900 text-xs">{selectedTeacher.specialization}</strong>
                </div>
              </div>

              <div className="space-y-2.5 text-slate-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{selectedTeacher.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedTeacher.phone}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Register Faculty Member</h3>
                <p className="text-xs text-slate-400">PostgreSQL `teachers` table insertion</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Prof. / Dr. / Engr."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teacher ID</label>
                  <input
                    type="text"
                    required
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="CU-FAC-060"
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
                  placeholder="name.dept@cityuniversity.edu.bd"
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
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Office Room</label>
                  <input
                    type="text"
                    value={officeRoom}
                    onChange={(e) => setOfficeRoom(e.target.value)}
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                >
                  Save Faculty Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
