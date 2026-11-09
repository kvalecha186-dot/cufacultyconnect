import { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Users,
  BarChart3,
  Video,
  CalendarPlus,
  MessageSquareText,
  UsersRound,
  Clock,
  CheckCircle2,
  ChevronRight,
  Mail,
  Phone,
  BookOpen,
  Award,
  TrendingUp,
  Star,
  LogOut,
  Bell,
  Search,
  Zap,
  ArrowUpRight,
  GraduationCap,
  Building2,
  Hash,
  Layers,
  Activity,
  Target,
  MessageCircle,
  Crown,
  ExternalLink,
  Radio,
} from 'lucide-react';
import { getLiveSessions, subscribeStore, getCompletedSessions, submitRating } from '../data/sessionStore';

/* ─── Types ─── */
type Tab = 'profile' | 'sessions' | 'faculty' | 'analytics';

interface StudentDashboardProps {
  onBack: () => void;
  studentName?: string;
  studentDept?: string;
}

/* ─── Mock Data ─── */
const studentData = {
  name: 'Aryan Sharma',
  uid: '22BCS14521',
  email: 'aryan.sharma@cuchd.in',
  phone: '+91 98765 43210',
  department: 'Computer Science & Engineering',
  semester: '6th Semester',
  section: 'CSE-26',
  cgpa: '8.72',
  mentor: 'Dr. Rajesh Kumar',
  avatar: '',
  joinDate: 'August 2022',
};

const upcomingSessions = [
  { id: 1, faculty: 'Dr. Rajesh Kumar', subject: 'Data Structures & Algorithms', date: 'May 30, 2026', time: '10:00 AM – 10:07 AM', type: 'Mentorship' },
  { id: 2, faculty: 'Prof. Anita Mehra', subject: 'Object Oriented Programming', date: 'May 30, 2026', time: '2:30 PM – 2:37 PM', type: 'Academic' },
  { id: 3, faculty: 'Dr. Sunil Verma', subject: 'Advanced Calculus', date: 'May 31, 2026', time: '11:00 AM – 11:07 AM', type: 'Doubt Session' },
  { id: 4, faculty: 'Prof. Meena Kapoor', subject: 'Web Development', date: 'June 1, 2026', time: '3:00 PM – 3:07 PM', type: 'Project Review' },
  { id: 5, faculty: 'Dr. Vikram Joshi', subject: 'Database Management Systems', date: 'June 2, 2026', time: '9:30 AM – 9:37 AM', type: 'Academic' },
  { id: 6, faculty: 'Prof. Ritu Sharma', subject: 'Computer Networks', date: 'June 3, 2026', time: '1:00 PM – 1:07 PM', type: 'Mentorship' },
];

const hodData = {
  name: 'Dr. Amrit Pal Singh',
  title: 'Head of Department',
  foundation: 'First Year Engineering Foundation',
  specialization: 'Artificial Intelligence & Machine Learning',
  experience: '18+ Years',
  email: 'amritpal.singh@cuchd.in',
};

const teacherCards = [
  { name: 'Dr. Rajesh Kumar', subject: 'Data Structures & Algorithms', online: true },
  { name: 'Prof. Anita Mehra', subject: 'Object Oriented Programming', online: true },
  { name: 'Dr. Sunil Verma', subject: 'Advanced Calculus', online: false },
  { name: 'Prof. Meena Kapoor', subject: 'Web Development', online: true },
  { name: 'Dr. Vikram Joshi', subject: 'Database Management Systems', online: false },
  { name: 'Prof. Ritu Sharma', subject: 'Computer Networks', online: true },
  { name: 'Dr. Priya Singh', subject: 'Operating Systems', online: false },
  { name: 'Prof. Arun Malhotra', subject: 'Discrete Mathematics', online: true },
  { name: 'Dr. Neha Gupta', subject: 'Software Engineering', online: false },
];

/* ═══════════════════════════════════════════ */
/*           STUDENT DASHBOARD                */
/* ═══════════════════════════════════════════ */

export function StudentDashboard({ onBack }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [tabKey, setTabKey] = useState(0);

  const switchTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setTabKey((k) => k + 1);
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'faculty', label: 'Faculty & HOD', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ═══════ TOP BAR ═══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-white/80 backdrop-blur-2xl border-b border-black/[0.04] shadow-[0_1px_20px_rgba(0,0,0,0.04)]">
        <div className="h-full flex items-center justify-between px-5 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <div className="w-9 h-9 bg-gradient-to-br from-[#E31837] to-[#C41230] rounded-xl flex items-center justify-center shadow-md shadow-red-600/15">
              <span className="text-white font-extrabold text-xs">CU</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[14px] text-gray-900 tracking-tight leading-tight">Faculty Connect</div>
              <div className="text-[9px] text-gray-400 font-semibold tracking-[0.14em] uppercase">Student Portal</div>
            </div>
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 w-[260px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search faculty, sessions..." className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder:text-gray-300 font-medium" />
            </div>
            <button className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-[18px] h-[18px] text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E31837] rounded-full" />
            </button>

            {/* User Profile Chip */}
            <div className="flex items-center gap-2.5 pl-3 pr-1 py-1 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="hidden sm:block text-right">
                <div className="text-[12px] font-bold text-gray-800 leading-tight">{studentData.name}</div>
                <div className="text-[10px] text-gray-400 font-medium">Computer Science</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-[#E31837] to-[#ff6b7a] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-[11px]">AS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-[68px] flex min-h-screen">

        {/* ═══════ SIDEBAR ═══════ */}
        <aside className="fixed left-0 top-[68px] bottom-0 w-[72px] lg:w-[240px] bg-white border-r border-black/[0.04] z-40 flex flex-col">
          <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active
                      ? 'bg-red-50 text-[#E31837]'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-[#E31837]' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`} />
                  <span className={`hidden lg:block text-[13px] font-semibold ${active ? 'text-[#E31837]' : ''} transition-colors`}>
                    {tab.label}
                  </span>
                  {active && <div className="hidden lg:block ml-auto w-1.5 h-1.5 bg-[#E31837] rounded-full" />}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-2 lg:p-3 border-t border-gray-100">
            <button
              onClick={onBack}
              className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-[#E31837] transition-all duration-300"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              <span className="hidden lg:block text-[13px] font-semibold">Back to Home</span>
            </button>
          </div>
        </aside>

        {/* ═══════ MAIN CONTENT ═══════ */}
        <main className="flex-1 ml-[72px] lg:ml-[240px] p-5 lg:p-8">
          <div key={tabKey} className="animate-fadeSlideIn">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'sessions' && <SessionsTab />}
            {activeTab === 'faculty' && <FacultyTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*              PROFILE TAB                   */
/* ═══════════════════════════════════════════ */

function ProfileTab() {
  return (
    <div className="space-y-7">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#E31837]/[0.06] via-[#E31837]/[0.03] to-transparent rounded-3xl p-8 lg:p-10 overflow-hidden border border-red-100/40">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#E31837]/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#E31837]/[0.03] rounded-full blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Circular Avatar */}
          <div className="w-[92px] h-[92px] bg-gradient-to-br from-[#E31837] to-[#ff6b7a] rounded-full flex items-center justify-center shadow-lg shadow-red-600/15 shrink-0 ring-4 ring-white">
            <span className="text-white font-bold text-2xl">AS</span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-[28px] lg:text-[34px] font-extrabold text-gray-900 tracking-tight">
              {studentData.name}
            </h1>
            <p className="text-[13px] text-gray-400 font-medium mt-0.5">{studentData.email}</p>

            {/* Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 text-[#E31837] rounded-full text-[11px] font-bold tracking-wide">
                <Building2 className="w-3 h-3" />
                {studentData.department}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold tracking-wide">
                <Layers className="w-3 h-3" />
                {studentData.semester}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold tracking-wide">
                <Award className="w-3 h-3" />
                CGPA: {studentData.cgpa}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-6">
            {[
              { val: '28', label: 'Sessions', icon: Video },
              { val: '96%', label: 'Attendance', icon: Target },
              { val: '4.8', label: 'Rating', icon: Star },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-[22px] font-extrabold text-gray-900">{s.val}</div>
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Hash, label: 'University ID (UID)', value: studentData.uid },
          { icon: GraduationCap, label: 'Section', value: studentData.section },
          { icon: Phone, label: 'Phone', value: studentData.phone },
          { icon: User, label: 'Assigned Mentor', value: studentData.mentor },
          { icon: Calendar, label: 'Joined', value: studentData.joinDate },
          { icon: Mail, label: 'Email', value: studentData.email },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-black/[0.04] hover:shadow-md hover:shadow-black/[0.03] transition-all duration-300">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{item.label}</div>
                <div className="text-[14px] font-bold text-gray-800 mt-0.5">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions — Connect with Teachers */}
      <div>
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-5 tracking-tight">Connect with Teachers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Instant Connect — RED PRIMARY */}
          <button className="group relative bg-gradient-to-br from-[#E31837] to-[#C41230] rounded-[20px] p-6 text-left cursor-pointer transition-all duration-500 hover:-translate-y-[5px] shadow-[0_10px_20px_rgba(227,24,55,0.2)] hover:shadow-[0_16px_32px_rgba(227,24,55,0.3)] overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/[0.06] rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/[0.04] rounded-full" />
            <div className="relative">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-[15px] font-bold text-white">Instant 1-on-1 Connect</h4>
              <p className="text-[11px] text-white/60 font-medium mt-1.5 leading-relaxed">Book an emergency 5–7 min slot with available faculty</p>
              <div className="mt-4 flex items-center gap-1 text-white/80 text-[11px] font-bold">
                <span>Connect Now</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </button>

          {/* Card 2: Schedule Mentorship */}
          <button className="group bg-white rounded-[20px] p-6 text-left cursor-pointer border border-black/[0.04] transition-all duration-500 hover:-translate-y-[5px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <CalendarPlus className="w-5 h-5 text-blue-500" />
            </div>
            <h4 className="text-[15px] font-bold text-gray-900">Schedule Mentorship</h4>
            <p className="text-[11px] text-gray-400 font-medium mt-1.5 leading-relaxed">Reserve a future slot with your mentor or advisor</p>
            <div className="mt-4 flex items-center gap-1 text-blue-500 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Book Slot</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </button>

          {/* Card 3: Academic Query */}
          <button className="group bg-white rounded-[20px] p-6 text-left cursor-pointer border border-black/[0.04] transition-all duration-500 hover:-translate-y-[5px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <MessageSquareText className="w-5 h-5 text-amber-500" />
            </div>
            <h4 className="text-[15px] font-bold text-gray-900">Drop an Academic Query</h4>
            <p className="text-[11px] text-gray-400 font-medium mt-1.5 leading-relaxed">Send an offline query to HOD or subject expert</p>
            <div className="mt-4 flex items-center gap-1 text-amber-500 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Send Query</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </button>

          {/* Card 4: Group Doubts Hub */}
          <button className="group bg-white rounded-[20px] p-6 text-left cursor-pointer border border-black/[0.04] transition-all duration-500 hover:-translate-y-[5px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <UsersRound className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="text-[15px] font-bold text-gray-900">Group Doubts Hub</h4>
            <p className="text-[11px] text-gray-400 font-medium mt-1.5 leading-relaxed">Join live group mentorship rooms for doubt clearing</p>
            <div className="mt-4 flex items-center gap-1 text-emerald-500 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Join Room</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*              SESSIONS TAB                  */
/* ═══════════════════════════════════════════ */

/* ─── Star Rating Modal ─── */
function RatingModal({ sessionId, studentName, onDone }: { sessionId: number; studentName: string; onDone: () => void }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    submitRating(sessionId, selected);
    setSubmitted(true);
    setTimeout(onDone, 1200);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center">
        {submitted ? (
          <div className="py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-[17px] font-extrabold text-gray-900">Thanks for your feedback!</h3>
            <p className="text-[12px] text-gray-400 mt-1">Your rating has been submitted.</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-[17px] font-extrabold text-gray-900 mb-1">Rate Your Session</h3>
            <p className="text-[12px] text-gray-400 mb-5">How was your meeting with <span className="text-gray-700 font-bold">{studentName}</span>?</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setSelected(star)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= (hovered || selected) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={onDone} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-[13px] font-bold hover:bg-gray-50 transition-colors">
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className={`flex-1 py-2.5 rounded-xl text-white text-[13px] font-extrabold transition-all ${
                  selected ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-400/30' : 'bg-gray-200 cursor-not-allowed'
                }`}
              >
                Submit Rating
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SessionsTab() {
  const [liveSessions, setLiveSessions] = useState(getLiveSessions());
  const [completedList, setCompletedList] = useState(getCompletedSessions());
  const [ratingTarget, setRatingTarget] = useState<{ sessionId: number; studentName: string } | null>(null);

  useEffect(() => {
    const sync = () => {
      setLiveSessions([...getLiveSessions()]);
      setCompletedList([...getCompletedSessions()]);
    };
    sync();
    return subscribeStore(sync);
  }, []);

  return (
    <div className="space-y-7">
      {/* Rating Modal */}
      {ratingTarget && (
        <RatingModal
          sessionId={ratingTarget.sessionId}
          studentName={ratingTarget.studentName}
          onDone={() => setRatingTarget(null)}
        />
      )}

      <div>
        <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Sessions</h2>
        <p className="text-[14px] text-gray-400 font-medium mt-1">Your scheduled and live mentorship sessions</p>
      </div>

      {/* ── LIVE SESSION BANNER ── */}
      {liveSessions.length > 0 && liveSessions.map(live => (
        <div key={live.sessionId} className="relative overflow-hidden rounded-2xl p-5 border-2 border-[#E31837]/30 shadow-[0_0_0_4px_rgba(227,24,55,0.06)]" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)' }}>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E31837]/[0.04] rounded-full pointer-events-none" />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E31837] to-[#ff4d5e] flex items-center justify-center shadow-md shadow-red-500/20">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E31837] rounded-full border-2 border-white">
                  <span className="absolute inset-0 rounded-full bg-[#E31837] animate-ping opacity-75" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E31837] text-white rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />Live Now
                  </span>
                </div>
                <h4 className="text-[15px] font-extrabold text-gray-900">Dr. Rajesh Kumar is ready for your session</h4>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{live.subject} · {live.time}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(live.meetLink, '_blank')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E31837] to-[#ff4d5e] text-white text-[13px] font-extrabold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 hover:-translate-y-0.5 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />Join Meeting
            </button>
          </div>
        </div>
      ))}

      {/* ── UPCOMING SESSIONS ── */}
      <div className="space-y-3">
        {upcomingSessions.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-black/[0.04] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-400 group hover:-translate-y-[2px]">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-[#E31837] font-extrabold text-[14px]">{idx + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h4 className="text-[15px] font-bold text-gray-900">{s.subject}</h4>
                <span className="px-2 py-0.5 bg-gray-50 rounded text-[10px] text-gray-500 font-bold uppercase tracking-wider">{s.type}</span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-[13px] text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><User className="w-3 h-3" />{s.faculty}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{s.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{s.time}</span>
              </div>
            </div>
            <button className="shrink-0 px-5 py-2.5 bg-[#E31837] text-white text-[12px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20">
              Join
            </button>
          </div>
        ))}
      </div>

      {/* ── COMPLETED SESSIONS WITH RATINGS ── */}
      {completedList.length > 0 && (
        <div>
          <h3 className="text-[16px] font-extrabold text-gray-900 mb-3 tracking-tight">Completed Sessions</h3>
          <div className="space-y-3">
            {completedList.map(cs => (
              <div key={cs.sessionId} className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-black/[0.04]">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[14px] font-bold text-gray-900">Dr. Rajesh Kumar</h4>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-wider">Completed</span>
                  </div>
                  <p className="text-[12px] text-gray-400 font-medium mt-0.5">{cs.subject} · {cs.time}</p>
                </div>
                <div className="shrink-0">
                  {cs.rating !== null ? (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-3 h-3 ${star <= cs.rating! ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-amber-600">{cs.rating}/5</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRatingTarget({ sessionId: cs.sessionId, studentName: 'Dr. Rajesh Kumar' })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 text-[11px] font-extrabold rounded-xl border border-amber-200 transition-all"
                    >
                      <Star className="w-3 h-3" />Rate Session
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*             FACULTY & HOD TAB              */
/* ═══════════════════════════════════════════ */

function FacultyTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Faculty & HOD</h2>
        <p className="text-[14px] text-gray-400 font-medium mt-1">Your department hierarchy and assigned faculty</p>
      </div>

      {/* ─── HOD Block ─── */}
      <div className="relative bg-gradient-to-br from-[#E31837]/[0.05] via-[#E31837]/[0.02] to-transparent rounded-3xl p-7 lg:p-9 border border-red-100/40 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#E31837]/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-3 right-4">
          <span className="px-3 py-1 bg-[#E31837]/10 text-[#E31837] rounded-full text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-1.5">
            <Crown className="w-3 h-3" />
            Head of Department
          </span>
        </div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-[72px] h-[72px] bg-gradient-to-br from-[#E31837] to-[#ff6b7a] rounded-full flex items-center justify-center shadow-lg shadow-red-600/15 shrink-0 ring-4 ring-white">
            <span className="text-white font-bold text-xl">AP</span>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-[22px] font-extrabold text-gray-900 tracking-tight">{hodData.name}</h3>
            <p className="text-[13px] text-gray-500 font-medium mt-0.5">{hodData.title} — {hodData.foundation}</p>
            <p className="text-[12px] text-gray-400 font-medium mt-1">Specialization: {hodData.specialization}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <span className="px-3 py-1.5 bg-white rounded-full text-[11px] text-gray-600 font-semibold border border-gray-100">{hodData.experience} Experience</span>
              <span className="px-3 py-1.5 bg-white rounded-full text-[11px] text-gray-500 font-medium border border-gray-100 flex items-center gap-1.5">
                <Mail className="w-3 h-3" />{hodData.email}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button className="px-4 py-2 bg-[#E31837] text-white rounded-xl text-[11px] font-bold hover:shadow-md hover:shadow-red-600/20 transition-all">Schedule Meeting</button>
              <button className="px-4 py-2 bg-white text-gray-600 rounded-xl text-[11px] font-bold border border-gray-200 hover:bg-gray-50 transition-all">Send Query</button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Faculty Grid — 9 Teachers ─── */}
      <div>
        <h3 className="text-[16px] font-extrabold text-gray-900 mb-4 tracking-tight">Department Faculty</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherCards.map((f, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-5 border border-black/[0.04] transition-all duration-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.04]"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-[11px]">
                    {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[14px] font-bold text-gray-800 truncate">{f.name}</h4>
                    {f.online && <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />}
                  </div>
                  <p className="text-[12px] text-gray-400 font-medium mt-0.5 truncate">{f.subject}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <button className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                      f.online
                        ? 'bg-[#E31837] text-white hover:shadow-md hover:shadow-red-600/20'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}>
                      {f.online ? 'Connect' : 'Offline'}
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold hover:bg-gray-100 transition-colors">
                      Schedule
                    </button>
                    <button className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                      <MessageCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*            ANALYTICS TAB                   */
/* ═══════════════════════════════════════════ */

function AnalyticsTab() {
  const stats = [
    { label: 'Total Sessions', value: '28', change: '+4 this month', icon: Video, tint: 'bg-red-50 text-[#E31837]' },
    { label: 'Attendance', value: '96%', change: '+2% vs last sem', icon: Target, tint: 'bg-blue-50 text-blue-500' },
    { label: 'Resolution Rate', value: '98%', change: 'All-time', icon: CheckCircle2, tint: 'bg-emerald-50 text-emerald-500' },
    { label: 'Avg Rating Given', value: '4.8', change: 'Out of 5.0', icon: Star, tint: 'bg-amber-50 text-amber-500' },
  ];

  const monthlyData = [
    { month: 'Jan', sessions: 3 },
    { month: 'Feb', sessions: 5 },
    { month: 'Mar', sessions: 4 },
    { month: 'Apr', sessions: 7 },
    { month: 'May', sessions: 9 },
  ];
  const maxSessions = Math.max(...monthlyData.map((d) => d.sessions));

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Analytics & History</h2>
        <p className="text-[14px] text-gray-400 font-medium mt-1">Your mentorship performance overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-black/[0.04] hover:shadow-md transition-all duration-300 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.tint} mb-3 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-[24px] font-extrabold text-gray-900">{s.value}</div>
              <div className="text-[12px] text-gray-400 font-semibold mt-0.5">{s.label}</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-500 font-bold">{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-7 border border-black/[0.04]">
        <h3 className="text-[16px] font-bold text-gray-800 mb-6">Monthly Session Trend</h3>
        <div className="flex items-end gap-4 h-[160px]">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500">{d.sessions}</span>
              <div
                className="w-full bg-gradient-to-t from-[#E31837] to-[#ff6b7a] rounded-xl transition-all duration-700 hover:opacity-80"
                style={{ height: `${(d.sessions / maxSessions) * 120}px` }}
              />
              <span className="text-[11px] font-semibold text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Breakdown */}
      <div className="bg-white rounded-2xl p-7 border border-black/[0.04]">
        <h3 className="text-[16px] font-bold text-gray-800 mb-5">Interaction Breakdown</h3>
        <div className="space-y-5">
          {[
            { label: 'Academic Guidance', pct: 45, color: 'from-[#E31837] to-[#ff4d5e]' },
            { label: 'Career & Placement', pct: 25, color: 'from-blue-500 to-blue-400' },
            { label: 'Project Reviews', pct: 18, color: 'from-emerald-500 to-emerald-400' },
            { label: 'Personal Mentorship', pct: 12, color: 'from-amber-500 to-amber-400' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-gray-600">{item.label}</span>
                <span className="text-[13px] font-bold text-gray-800">{item.pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
