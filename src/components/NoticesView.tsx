import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Pin, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  CheckCircle, 
  X,
  Tag
} from 'lucide-react';
import { NoticeRecord, UserRole } from '../types';

interface NoticesViewProps {
  notices: NoticeRecord[];
  onAddNotice: (notice: Omit<NoticeRecord, 'id' | 'publishedAt'>) => void;
  currentUserRole?: UserRole;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  onAddNotice,
  currentUserRole,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'academic' | 'exam' | 'bus' | 'clubs' | 'urgent' | 'general'>('academic');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [author, setAuthor] = useState('Office of the Registrar');
  const [isPinned, setIsPinned] = useState(false);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'urgent', label: 'Urgent & Cancellations' },
    { id: 'academic', label: 'Academic & Classes' },
    { id: 'exam', label: 'Exams & Routines' },
    { id: 'bus', label: 'Transport & Shuttle' },
    { id: 'clubs', label: 'Clubs & Hackathons' },
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNotice({
      title,
      content,
      category,
      priority,
      author,
      isPinned,
    });
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Campus Notice & Broadcast Desk</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Single official broadcast feed eliminating fragmented WhatsApp/Messenger chat messages
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements, schedule changes, or room shifts..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const isUrgent = notice.priority === 'urgent' || notice.category === 'urgent';
          const isHigh = notice.priority === 'high';

          return (
            <div
              key={notice.id}
              className={`p-5 rounded-2xl border transition bg-white shadow-xs ${
                isUrgent
                  ? 'border-rose-300 bg-rose-50/20'
                  : isHigh
                  ? 'border-amber-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    {notice.isPinned && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        <Pin className="w-3 h-3 text-blue-600 rotate-45" />
                        <span>Pinned</span>
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-800 font-black'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {notice.priority}
                    </span>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                      #{notice.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-1">
                    {notice.content}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">
                  Issued by: {notice.author}
                </span>
                <span>{notice.publishedAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Broadcast University Announcement</h3>
                <p className="text-xs text-slate-400">PostgreSQL `notices` table insertion</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Class Postponement: CSE-3101 Midterm Review Session"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="academic">Academic / Class</option>
                    <option value="urgent">Urgent / Cancellation</option>
                    <option value="exam">Exam Schedule</option>
                    <option value="bus">Shuttle Bus</option>
                    <option value="clubs">Club / Hackathon</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Prof. Farhana Ahmed / Transport Office"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe clearly which section, room, and timings are affected..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="pinNotice" className="font-semibold text-slate-700">
                  Pin this notice to the top of all student feeds
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
