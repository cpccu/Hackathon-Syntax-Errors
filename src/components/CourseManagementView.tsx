import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Plus, 
  CheckCircle, 
  X,
  Layers
} from 'lucide-react';
import { CourseRecord, UserRole } from '../types';

interface CourseManagementProps {
  courses: CourseRecord[];
  onAddCourse: (course: Omit<CourseRecord, 'id' | 'enrolledStudentsCount'>) => void;
  currentUserRole?: UserRole;
}

export const CourseManagementView: React.FC<CourseManagementProps> = ({
  courses,
  onAddCourse,
  currentUserRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<CourseRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [courseCode, setCourseCode] = useState('');
  const [title, setTitle] = useState('');
  const [creditHours, setCreditHours] = useState(3.0);
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(5);
  const [teacherName, setTeacherName] = useState('Prof. Farhana Ahmed');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('Sun & Tue: 10:00 AM - 11:30 AM');
  const [room, setRoom] = useState('Lab 401');

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || c.department === departmentFilter;
    const matchesSem = semesterFilter === 'All' || c.semester.toString() === semesterFilter;
    return matchesSearch && matchesDept && matchesSem;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCourse({
      courseCode,
      title,
      creditHours: Number(creditHours),
      department,
      semester: Number(semester),
      teacherId: 1,
      teacherName,
      description,
      schedule,
      room,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Academic Course Catalog</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            City University syllabus, credit units, weekly schedule & instructor assignments
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course Offering</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code (e.g. CSE-3101), title, or teacher..."
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
          </select>
        </div>

        <div>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="All">All Semesters</option>
            <option value="3">3rd Semester</option>
            <option value="5">5th Semester</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {course.courseCode}
                  </span>
                  <span className="ml-2 text-[11px] font-bold text-slate-500">
                    {course.creditHours} Credits • {course.semester}th Sem
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {course.enrolledStudentsCount} Students
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 pt-1">
                {course.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3 space-y-1.5 text-[11px] text-slate-600 border border-slate-100">
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{course.teacherName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{course.schedule}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{course.room}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Enrolled & Active</span>
              </span>
              <button
                onClick={() => setSelectedCourse(course)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                View Syllabus & Materials →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="font-mono text-xs font-bold text-blue-400">
                {selectedCourse.courseCode}
              </span>
              <h3 className="font-bold text-lg text-white mt-1">
                {selectedCourse.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedCourse.department} • {selectedCourse.creditHours} Credit Units
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Course Description & Outcomes</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Instructor</span>
                  <strong className="text-slate-800">{selectedCourse.teacherName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Classroom / Lab</span>
                  <strong className="text-slate-800">{selectedCourse.room}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Weekly Routine</span>
                  <strong className="text-slate-800">{selectedCourse.schedule}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Enrolled Students</span>
                  <strong className="text-blue-700">{selectedCourse.enrolledStudentsCount} Students</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold"
                >
                  Close Course Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Add New Course Offering</h3>
                <p className="text-xs text-slate-400">PostgreSQL `courses` table insertion</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CSE-3107"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credit Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={creditHours}
                    onChange={(e) => setCreditHours(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Operating Systems & Architecture"
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
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Teacher</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Classroom / Room</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Bldg 2, Lab 401"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Schedule / Routine</label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Sun & Tue: 10:00 AM - 11:30 AM"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief syllabus outline..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
