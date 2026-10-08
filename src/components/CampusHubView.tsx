import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Bus, 
  PackageSearch, 
  Plus, 
  Search, 
  Filter, 
  QrCode, 
  Download, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Send, 
  Check, 
  FileText,
  MessageSquare,
  HelpCircle,
  Tag
} from 'lucide-react';
import { 
  CampusEvent, 
  AcademicResource, 
  ShuttleBusRoute, 
  LostFoundItem, 
  ComplaintTicket, 
  User 
} from '../types';

interface CampusHubViewProps {
  currentUser: User | null;
  events: CampusEvent[];
  resources: AcademicResource[];
  busRoutes: ShuttleBusRoute[];
  lostFoundItems: LostFoundItem[];
  complaints: ComplaintTicket[];
  onRegisterEvent: (eventId: number) => void;
  onOpenQrPass: (eventTitle: string, code: string) => void;
  onAddResource: (resource: Omit<AcademicResource, 'id' | 'downloadsCount'>) => void;
  onAddLostFound: (item: Omit<LostFoundItem, 'id' | 'status'>) => void;
  onAddComplaint: (ticket: Omit<ComplaintTicket, 'id' | 'submittedAt' | 'status'>) => void;
}

export const CampusHubView: React.FC<CampusHubViewProps> = ({
  currentUser,
  events,
  resources,
  busRoutes,
  lostFoundItems,
  complaints,
  onRegisterEvent,
  onOpenQrPass,
  onAddResource,
  onAddLostFound,
  onAddComplaint,
}) => {
  const [activeModule, setActiveModule] = useState<'events' | 'resources' | 'bus_helpdesk' | 'lost_complaints'>('events');

  // Module 1: Events filters
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');

  // Module 2: Resources filters
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState('all');
  const [isUploadResourceModalOpen, setIsUploadResourceModalOpen] = useState(false);

  // Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resCourseCode, setResCourseCode] = useState('CSE-3101');
  const [resCourseName, setResCourseName] = useState('Algorithms & Complexity Analysis');
  const [resCategory, setResCategory] = useState<'question_paper' | 'lecture_notes' | 'lab_manual' | 'solution'>('question_paper');
  const [resSemester, setResSemester] = useState(5);

  // Module 4: Lost & Found state
  const [lostFoundTab, setLostFoundTab] = useState<'browse' | 'report_item' | 'complaints'>('browse');
  const [lostFoundFilter, setLostFoundFilter] = useState<'all' | 'lost' | 'found'>('all');

  // Report Item form
  const [itemType, setItemType] = useState<'lost' | 'found'>('lost');
  const [itemTitle, setItemTitle] = useState('');
  const [itemCategory, setItemCategory] = useState<'id_card' | 'electronics' | 'bag' | 'calculator' | 'keys' | 'books' | 'other'>('id_card');
  const [itemLocation, setItemLocation] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemContactPhone, setItemContactPhone] = useState('+880 1711-234567');

  // Complaint form
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintCategory, setComplaintCategory] = useState<'infrastructure' | 'bus_service' | 'canteen' | 'library' | 'academic' | 'other'>('infrastructure');
  const [complaintDesc, setComplaintDesc] = useState('');

  // AI Helpdesk Chat state
  const [helpdeskQuery, setHelpdeskQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am your City University CampusOS Helpdesk Bot. Ask me about shuttle routes, midterm exam policies, library timings, or club activities!',
      time: 'Just now',
    },
  ]);

  const handleHelpdeskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpdeskQuery.trim()) return;

    const userQ = helpdeskQuery.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userQ, time: timeNow },
    ]);
    setHelpdeskQuery('');

    // Grounded knowledge answers for City University
    setTimeout(() => {
      let botAnswer = "According to City University Academic Regulations, please visit the Department Head office in Academic Building 2 for formal documentation.";
      const lower = userQ.toLowerCase();

      if (lower.includes('bus') || lower.includes('shuttle') || lower.includes('route')) {
        botAnswer = "City University operates 3 primary shuttle routes: Mirpur-10 Express (Departs 07:15 AM, 08:30 AM), Uttara Sector 7 Connector (Departs 07:20 AM, 08:45 AM), and Dhanmondi 32 Route (Departs 07:00 AM, 08:15 AM). Drivers can be reached via the Transport Desk.";
      } else if (lower.includes('exam') || lower.includes('midterm') || lower.includes('admit')) {
        botAnswer = "Fall 2026 Midterm Exams begin October 22. Admit cards must be cleared with 0 pending dues and minimum 75% class attendance before Oct 20.";
      } else if (lower.includes('club') || lower.includes('hackathon') || lower.includes('cpccu')) {
        botAnswer = "Competitive Programming Camp CU (CPCCU) is hosting the AI Web App Hackathon 2026! You can RSVP on the Club & Event tab and download your QR entry ticket.";
      } else if (lower.includes('lost') || lower.includes('id card') || lower.includes('calculator')) {
        botAnswer = "If you lost an item, please log it under Module 4 (Lost & Found). Recently found items like student ID cards are deposited at the Canteen Cash Counter or Security Main Gate.";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botAnswer, time: timeNow },
      ]);
    }, 600);
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    onAddResource({
      title: resTitle,
      courseCode: resCourseCode,
      courseName: resCourseName,
      department: 'Computer Science & Engineering',
      semester: Number(resSemester),
      category: resCategory,
      uploadedBy: currentUser?.fullName || 'Rafid Ahmed',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '2.4 MB',
      fileType: 'PDF',
    });
    setIsUploadResourceModalOpen(false);
    setResTitle('');
  };

  const handleReportItem = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLostFound({
      type: itemType,
      title: itemTitle,
      category: itemCategory,
      location: itemLocation,
      dateReported: new Date().toISOString().split('T')[0],
      contactName: currentUser?.fullName || 'Rafid Ahmed',
      contactPhone: itemContactPhone,
      description: itemDesc,
    });
    setLostFoundTab('browse');
    setItemTitle('');
    setItemDesc('');
    setItemLocation('');
  };

  const handleFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComplaint({
      title: complaintTitle,
      department: 'Campus Administration & Estate',
      category: complaintCategory,
      description: complaintDesc,
    });
    setLostFoundTab('complaints');
    setComplaintTitle('');
    setComplaintDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Flagship Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CPCCU Hackathon Core Modules
            </span>
            <span className="text-xs text-slate-300">City University Unified Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">
            CampusOS — Single Source of Truth
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Replaces 20+ scattered Facebook groups, buried Messenger group chats, and ad-hoc Google Forms with 4 fully-built, integrated daily student modules.
          </p>
        </div>

        {/* Module Switcher Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveModule('events')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeModule === 'events'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>1. Club Events</span>
          </button>

          <button
            onClick={() => setActiveModule('resources')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeModule === 'resources'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. Resource Hub</span>
          </button>

          <button
            onClick={() => setActiveModule('bus_helpdesk')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeModule === 'bus_helpdesk'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>3. Bus & Helpdesk</span>
          </button>

          <button
            onClick={() => setActiveModule('lost_complaints')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeModule === 'lost_complaints'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <PackageSearch className="w-3.5 h-3.5" />
            <span>4. Lost & Found</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODULE 1: CLUB & EVENT ENGINE (RSVP + QR TICKET PASS + DOOR CHECK-IN)
      ========================================================================= */}
      {activeModule === 'events' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Unified Club & Campus Events Engine</span>
              </h2>
              <p className="text-xs text-slate-500">
                Browse, RSVP, and generate door check-in QR tickets across CPCCU, Robotics, Debate & Cultural clubs
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', 'technical', 'debate', 'sports', 'cultural'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEventCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg font-semibold capitalize transition ${
                    eventCategoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events
              .filter(
                (ev) => eventCategoryFilter === 'all' || ev.clubCategory === eventCategoryFilter
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full relative">
                      <img
                        src={event.bannerUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-xs text-white text-xs font-bold">
                        {event.clubName}
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                        {event.clubCategory}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-base text-slate-900 leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      {/* Attendee capacity gauge */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>Registrations: {event.registeredCount} / {event.capacity}</span>
                          <span>{Math.round((event.registeredCount / event.capacity) * 100)}% filled</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {event.isRegistered ? (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                          <span className="flex items-center space-x-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Registered: Ticket Active</span>
                          </span>
                          <span className="font-mono text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
                            {event.ticketCode}
                          </span>
                        </div>
                        <button
                          onClick={() => onOpenQrPass(event.title, event.ticketCode || 'CPCCU-TKT-DEMO')}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Show QR Code for Door Check-In</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onRegisterEvent(event.id)}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-blue-500/20"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Confirm RSVP & Generate QR Pass</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: RESOURCE HUB (SEARCH, FILTER BY DEPT/COURSE/SEM, DOWNLOAD)
      ========================================================================= */}
      {activeModule === 'resources' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Academic Resource Hub & Question Paper Archive</span>
              </h2>
              <p className="text-xs text-slate-500">
                Shared notes, past semester exam questions, and lab manuals organized by course
              </p>
            </div>

            <button
              onClick={() => setIsUploadResourceModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Contribute Resource</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Search by course code (e.g. CSE-3101), paper title, or topic..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={resourceCategoryFilter}
                onChange={(e) => setResourceCategoryFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="all">All Material Types</option>
                <option value="question_paper">Past Question Papers</option>
                <option value="lecture_notes">Lecture Notes</option>
                <option value="lab_manual">Lab Manuals</option>
                <option value="solution">Solved Solutions</option>
              </select>
            </div>
          </div>

          {/* Resources list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources
              .filter((res) => {
                const matchesSearch =
                  res.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
                  res.courseCode.toLowerCase().includes(resourceSearch.toLowerCase()) ||
                  res.courseName.toLowerCase().includes(resourceSearch.toLowerCase());
                const matchesCat =
                  resourceCategoryFilter === 'all' || res.category === resourceCategoryFilter;
                return matchesSearch && matchesCat;
              })
              .map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {res.courseCode}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {res.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {res.courseName} • Semester {res.semester}th
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div>
                      <span className="block text-[11px]">Uploaded by {res.uploadedBy}</span>
                      <span className="text-[10px] text-slate-400">{res.uploadDate} • {res.fileSize} ({res.fileType})</span>
                    </div>

                    <button
                      onClick={() => alert(`Simulated Download: ${res.title} (${res.fileSize}) downloaded!`)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ({res.downloadsCount})</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Upload modal */}
          {isUploadResourceModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base">Upload Study Resource</h3>
                    <p className="text-xs text-slate-400">Add to City University shared archive</p>
                  </div>
                  <button
                    onClick={() => setIsUploadResourceModalOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUploadResource} className="p-6 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Resource Title</label>
                    <input
                      type="text"
                      required
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                      placeholder="e.g. CSE-3101 Final Exam Question Paper (Fall 2025)"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
                      <input
                        type="text"
                        required
                        value={resCourseCode}
                        onChange={(e) => setResCourseCode(e.target.value)}
                        placeholder="CSE-3101"
                        className="w-full p-2.5 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={resCategory}
                        onChange={(e) => setResCategory(e.target.value as any)}
                        className="w-full p-2.5 border rounded-xl"
                      >
                        <option value="question_paper">Past Question Paper</option>
                        <option value="lecture_notes">Lecture Notes</option>
                        <option value="lab_manual">Lab Manual</option>
                        <option value="solution">Solution Guide</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Course Name</label>
                    <input
                      type="text"
                      required
                      value={resCourseName}
                      onChange={(e) => setResCourseName(e.target.value)}
                      placeholder="e.g. Algorithms & Complexity Analysis"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                    >
                      Publish to Campus Resource Archive
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODULE 3: SMART HELPDESK & SHUTTLE BUS HUB
      ========================================================================= */}
      {activeModule === 'bus_helpdesk' && (
        <div className="space-y-6">
          {/* Shuttle Routes Overview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Bus className="w-5 h-5 text-emerald-600" />
                  <span>City University Shuttle Bus Network</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Always-current schedules answering "When is the next bus on my route?"
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Live GPS Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {busRoutes.map((route) => (
                <div
                  key={route.id}
                  className="rounded-2xl border border-slate-200 p-5 bg-gradient-to-b from-slate-50/60 to-white flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-xs transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{route.routeName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {route.currentStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-slate-500">{route.busNumber}</p>

                    <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                      <div className="text-slate-600">
                        <strong>From:</strong> {route.startingPoint}
                      </div>
                      <div className="text-slate-600">
                        <strong>To:</strong> {route.destination}
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1">
                        Stops: {route.stops.join(' → ')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        Scheduled Departure Times:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {route.scheduleTimes.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] text-slate-500 pt-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{route.driverContact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grounded Smart AI Helpdesk */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>CU Smart AI Helpdesk (Grounded in University Knowledge)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ask questions about exam schedules, bus timings, hall fees, and campus rules
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </div>

            {/* Chat message box */}
            <div className="p-5 h-64 overflow-y-auto space-y-3 bg-slate-50/50">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 ${
                        msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <form onSubmit={handleHelpdeskSubmit} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
              <input
                type="text"
                value={helpdeskQuery}
                onChange={(e) => setHelpdeskQuery(e.target.value)}
                placeholder="Ask e.g. 'When is the next Mirpur shuttle?' or 'What are the midterm exam rules?'..."
                className="flex-1 px-4 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask Helpdesk</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 4: LOST & FOUND / COMPLAINT BOX
      ========================================================================= */}
      {activeModule === 'lost_complaints' && (
        <div className="space-y-5">
          {/* Sub Navigation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <PackageSearch className="w-5 h-5 text-blue-600" />
                <span>Lost & Found Recovery System & Student Complaint Desk</span>
              </h2>
              <p className="text-xs text-slate-500">
                Structured lost belongings registry and tracked administrative complaints
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLostFoundTab('browse')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  lostFoundTab === 'browse'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Browse Items ({lostFoundItems.length})
              </button>
              <button
                onClick={() => setLostFoundTab('report_item')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  lostFoundTab === 'report_item'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Report Lost / Found
              </button>
              <button
                onClick={() => setLostFoundTab('complaints')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  lostFoundTab === 'complaints'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                File Complaint ({complaints.length})
              </button>
            </div>
          </div>

          {/* TAB 1: BROWSE LOST/FOUND */}
          {lostFoundTab === 'browse' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {['all', 'lost', 'found'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setLostFoundFilter(t as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                      lostFoundFilter === t
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border text-slate-600'
                    }`}
                  >
                    {t} Items
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lostFoundItems
                  .filter((item) => lostFoundFilter === 'all' || item.type === lostFoundFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-blue-300 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              item.type === 'lost'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="text-[11px] text-slate-400">{item.dateReported}</span>
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                          <p><strong>Location:</strong> {item.location}</p>
                          <p><strong>Contact:</strong> {item.contactName} ({item.contactPhone})</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => alert(`Contacting ${item.contactName} at ${item.contactPhone}`)}
                          className="w-full py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs"
                        >
                          Connect with Reporter
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: REPORT ITEM */}
          {lostFoundTab === 'report_item' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl mx-auto">
              <h3 className="font-bold text-base text-slate-900 mb-1">
                Post Lost or Found Belonging
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Helps reunite lost ID cards, calculators, chargers, and bags with owners
              </p>

              <form onSubmit={handleReportItem} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Post Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setItemType('lost')}
                      className={`py-2 rounded-xl font-bold border transition ${
                        itemType === 'lost'
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      I Lost an Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemType('found')}
                      className={`py-2 rounded-xl font-bold border transition ${
                        itemType === 'found'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      I Found an Item
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    placeholder="e.g. Student ID Card (CU-2023-CSE-045)"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value as any)}
                      className="w-full p-2.5 border rounded-xl"
                    >
                      <option value="id_card">Student ID Card</option>
                      <option value="calculator">Scientific Calculator</option>
                      <option value="electronics">Electronics / Charger / Laptop</option>
                      <option value="bag">Bag / Backpack</option>
                      <option value="keys">Keys</option>
                      <option value="books">Textbooks / Notes</option>
                      <option value="other">Other Belonging</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location on Campus</label>
                    <input
                      type="text"
                      required
                      value={itemLocation}
                      onChange={(e) => setItemLocation(e.target.value)}
                      placeholder="e.g. Canteen 2nd floor, Room 401"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    required
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    placeholder="Specify color, marks, unique stickers, or where it can be claimed..."
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    value={itemContactPhone}
                    onChange={(e) => setItemContactPhone(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                  >
                    Post to Lost & Found Board
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: COMPLAINTS & GRIEVANCE */}
          {lostFoundTab === 'complaints' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-900">
                  File an Official Campus Complaint
                </h3>
                <p className="text-xs text-slate-500">
                  Direct submission to the City University Administration with transparent status tracking
                </p>

                <form onSubmit={handleFileComplaint} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Complaint Headline</label>
                    <input
                      type="text"
                      required
                      value={complaintTitle}
                      onChange={(e) => setComplaintTitle(e.target.value)}
                      placeholder="e.g. Inadequate cooling in Academic Building 2 Lab"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department / Facility</label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as any)}
                      className="w-full p-2.5 border rounded-xl"
                    >
                      <option value="infrastructure">Infrastructure & Classrooms</option>
                      <option value="bus_service">Shuttle Bus Transportation</option>
                      <option value="canteen">Canteen & Food Quality</option>
                      <option value="library">Library & Silent Areas</option>
                      <option value="academic">Academic & Examination</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description of Issue</label>
                    <textarea
                      rows={4}
                      required
                      value={complaintDesc}
                      onChange={(e) => setComplaintDesc(e.target.value)}
                      placeholder="State what occurred, exact room numbers, and how long the issue has persisted..."
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                  >
                    Submit Ticket to Registrar Office
                  </button>
                </form>
              </div>

              {/* Submitted Tickets Tracker */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Active Grievance Tickets ({complaints.length})
                </h3>

                {complaints.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {ticket.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ticket.status === 'in_review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900">{ticket.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ticket.description}</p>

                    {ticket.feedbackNotes && (
                      <div className="p-2.5 bg-blue-50 rounded-xl text-[11px] text-blue-900 border border-blue-100">
                        <strong>Official Status Note:</strong> {ticket.feedbackNotes}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 pt-1">
                      Submitted on: {ticket.submittedAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
