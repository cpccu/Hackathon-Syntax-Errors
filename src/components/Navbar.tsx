import React from 'react';
import { 
  Building2, 
  Calendar, 
  BookOpen, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  FileText, 
  Award, 
  Bell, 
  Sparkles, 
  BookMarked,
  LogOut,
  User as UserIcon,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenDocs: () => void;
  onQuickSwitchRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenDocs,
  onQuickSwitchRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'campus-hub', label: 'Campus Hub (4 Modules)', icon: Sparkles, badge: 'Hackathon' },
    { id: 'attendance', label: 'Attendance & QR', icon: CheckCircle2 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'teachers', label: 'Faculty', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'notices', label: 'Notices', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Quick Switcher */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            CPCCU Hackathon 2026
          </span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            City University — CampusOS Single Source of Truth
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <span className="text-slate-400 text-[11px] hidden md:inline">1-Click Demo Login:</span>
          <button
            onClick={() => onQuickSwitchRole('student')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              currentUser?.role === 'student' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            🎓 Student
          </button>
          <button
            onClick={() => onQuickSwitchRole('teacher')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              currentUser?.role === 'teacher' 
                ? 'bg-purple-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            👨‍🏫 Faculty
          </button>
          <button
            onClick={() => onQuickSwitchRole('admin')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              currentUser?.role === 'admin' 
                ? 'bg-amber-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            🏛️ Admin
          </button>
          <button
            onClick={onOpenDocs}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition ml-1"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Docs & API</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">CampusOS</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    CU Hub
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">City University Portal</p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User profile / Auth buttons */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role} • {currentUser.studentId || currentUser.department || 'CU Member'}
                  </span>
                </div>

                <div className="relative group">
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.fullName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/40 border border-white shadow-xs"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>

                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <UserIcon className="w-4 h-4" />
                <span>Log In / Sign Up</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          <div className="grid grid-cols-2 gap-1 pb-2 border-b border-slate-100 mb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                onOpenDocs();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold"
            >
              <BookMarked className="w-4 h-4" />
              <span>API Architecture & Docs</span>
            </button>

            {!currentUser && (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
