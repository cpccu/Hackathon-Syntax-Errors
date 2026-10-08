import React from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  Bus, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  QrCode,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { 
  User, 
  CourseRecord, 
  NoticeRecord, 
  CampusEvent, 
  ShuttleBusRoute, 
  AssignmentRecord 
} from '../types';

interface DashboardViewProps {
  currentUser: User | null;
  courses: CourseRecord[];
  notices: NoticeRecord[];
  events: CampusEvent[];
  busRoutes: ShuttleBusRoute[];
  assignments: AssignmentRecord[];
  onNavigateTab: (tab: string) => void;
  onOpenQrPass: (eventTitle: string, code: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  courses,
  notices,
  events,
  busRoutes,
  assignments,
  onNavigateTab,
  onOpenQrPass,
}) => {
  const nextBus = busRoutes[0];
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'pending').length;
  const urgentNotice = notices.find((n) => n.priority === 'urgent');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30">
              City University Hub
            </span>
            <span className="text-xs text-slate-300">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.fullName || 'City University Student'}!
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your single source of truth for City University campus life. Track shuttle departures, upcoming club events, course assignments, and past papers in one unified place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('campus-hub')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Campus Hub (Events & Bus)</span>
            </button>

            <button
              onClick={() => onNavigateTab('attendance')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Scan Attendance QR</span>
            </button>

            <button
              onClick={() => onNavigateTab('courses')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Browse Course Archive</span>
            </button>
          </div>
        </div>

        {/* Ambient background graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
          <Building2 className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Urgent Notice Alert (If any) */}
      {urgentNotice && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start space-x-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Urgent University Notice: {urgentNotice.title}
              </h4>
              <span className="text-[10px] text-amber-700">{urgentNotice.publishedAt}</span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {urgentNotice.content}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('notices')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 underline shrink-0"
          >
            All Notices →
          </button>
        </div>
      )}

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: CGPA */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Cumulative GPA</span>
            <div className="text-xl font-black text-slate-800 flex items-center space-x-1">
              <span>{currentUser?.cgpa ? currentUser.cgpa.toFixed(2) : '3.85'}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">/ 4.00</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Attendance % */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Overall Attendance</span>
            <div className="text-xl font-black text-slate-800 flex items-center space-x-1">
              <span>94.2%</span>
              <span className="text-[10px] text-emerald-600 font-bold">Good</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Courses */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Registered Courses</span>
            <div className="text-xl font-black text-slate-800">
              {courses.length} <span className="text-xs font-normal text-slate-400">Courses</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Pending Tasks */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Pending Tasks</span>
            <div className="text-xl font-black text-slate-800">
              {pendingAssignmentsCount}{' '}
              <span className="text-xs font-normal text-amber-600">due soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Daily Timetable + Next Shuttle Bus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Classes & Course Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Today's Class Schedule</h3>
            </div>
            <button
              onClick={() => onNavigateTab('courses')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Full Routine →
            </button>
          </div>

          <div className="space-y-3">
            {courses.slice(0, 3).map((course, idx) => (
              <div
                key={course.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-blue-200 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                      {course.courseCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {course.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.schedule}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.room}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigateTab('attendance')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition"
                  >
                    Check In
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Shuttle Bus Quick Finder */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bus className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Next Campus Shuttle</h3>
            </div>
            <button
              onClick={() => onNavigateTab('campus-hub')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              All Routes →
            </button>
          </div>

          {nextBus ? (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-xl p-4 border border-emerald-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">{nextBus.routeName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                  On Time
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-slate-600">
                  <strong className="text-slate-800">From:</strong> {nextBus.startingPoint}
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong className="text-slate-800">To:</strong> {nextBus.destination}
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Next departures:</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    {nextBus.scheduleTimes.slice(0, 3).join(' • ')}
                  </span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Driver: {nextBus.driverContact.split(' ')[0]}</span>
                <span className="text-emerald-700 font-semibold">{nextBus.driverContact.split(' ')[1]}</span>
              </div>
            </div>
          ) : null}

          {/* Quick Hub Shortcut */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Lost something on campus?</span>
              <button
                onClick={() => onNavigateTab('campus-hub')}
                className="text-blue-600 hover:underline"
              >
                Lost & Found →
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Browse newly found ID cards, calculators, and laptops.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Club Events & Hackathon Highlights */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Campus Events & Club Engine (Module 1)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Unified feed across 10+ City University clubs — replacing cluttered Facebook groups
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('campus-hub')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Browse All Events →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between bg-white"
            >
              <div>
                <div className="h-32 w-full relative">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-semibold backdrop-blur-xs">
                    {event.clubName}
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                    {event.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                    <span className="font-medium text-blue-600">{event.date}</span>
                    <span>•</span>
                    <span>{event.time.split('-')[0]}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                {event.isRegistered ? (
                  <button
                    onClick={() => onOpenQrPass(event.title, event.ticketCode || 'CPCCU-TKT-DEMO')}
                    className="w-full py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR Pass</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigateTab('campus-hub')}
                    className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1 transition"
                  >
                    <span>RSVP Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
