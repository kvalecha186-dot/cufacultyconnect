import { useState, useEffect } from 'react';
import {
  User, Calendar, MessageSquare, BarChart3, LogOut, Bell, Search,
  BookOpen, Mail, Phone, Hash, Award, Star, Clock, CheckCircle2,
  AlertCircle, TrendingUp, Video, Target, Crown, Zap, ArrowUpRight,
  Play, Building2, Home, Briefcase, GraduationCap, Heart, Wifi,
  WifiOff, ChevronRight, FileText, Users, Download, Flag,
  Timer, Circle, CheckCheck, Layers, Sparkles, X, Link, ExternalLink,
} from 'lucide-react';
import { markSessionComplete, subscribeStore, getCompletedSessions, shareMeetLink, getLiveSessionById } from '../data/sessionStore';

type Tab = 'profile' | 'meetings' | 'queries' | 'analytics';

interface FacultyDashboardProps {
  onBack: () => void;
}

/* ─── Mock Data ─── */
const facultyData = {
  name: 'Dr. Rajesh Kumar',
  empId: 'CU-FAC-08421',
  email: 'rajesh.kumar@cuchd.in',
  phone: '+91 98100 45200',
  designation: 'Associate Professor',
  department: 'Computer Science & Engineering',
  experience: '12 Years',
  courses: ['Data Structures & Algorithms', 'Machine Learning', 'Python Programming'],
};

const hodInfo = {
  name: 'Dr. Amrit Pal Singh',
  title: 'Head of Department',
  foundation: 'First Year Engineering Foundation',
  email: 'amritpal.singh@cuchd.in',
  phone: '+91 98765 00100',
};

const todaysSessions = [
  {
    id: 1, initials: 'KV', name: 'Khushi Valecha', uid: '25AML10304',
    program: 'B.E. CSE (AI & ML)', year: '1st Year',
    time: '10:00 AM', timeRaw: 10 * 60,
    concern: 'Hostel & Academics', concernIcon: Home,
    mode: 'Online' as const, confidence: 'Low' as const,
    status: 'upcoming' as const, duration: '7 min',
    avatarGrad: 'from-[#E31837] to-[#9b0000]',
  },
  {
    id: 2, initials: 'AS', name: 'Aryan Sharma', uid: '25BCS14521',
    program: 'B.E. CSE', year: '1st Year',
    time: '10:30 AM', timeRaw: 10 * 60 + 30,
    concern: 'Placement Guidance', concernIcon: Briefcase,
    mode: 'Online' as const, confidence: 'Medium' as const,
    status: 'upcoming' as const, duration: '7 min',
    avatarGrad: 'from-[#3b82f6] to-[#1d4ed8]',
  },
  {
    id: 3, initials: 'PM', name: 'Priya Mehta', uid: '25BCS11034',
    program: 'B.E. CSE', year: '1st Year',
    time: '11:00 AM', timeRaw: 11 * 60,
    concern: 'Academic Planning', concernIcon: GraduationCap,
    mode: 'Offline' as const, confidence: 'High' as const,
    status: 'in-progress' as const, duration: '7 min',
    avatarGrad: 'from-[#8b5cf6] to-[#6d28d9]',
  },
  {
    id: 4, initials: 'RS', name: 'Rohit Singh', uid: '25BCS12890',
    program: 'B.E. CSE', year: '1st Year',
    time: '11:30 AM', timeRaw: 11 * 60 + 30,
    concern: 'Career Counseling', concernIcon: Target,
    mode: 'Online' as const, confidence: 'Medium' as const,
    status: 'completed' as const, duration: '7 min',
    avatarGrad: 'from-[#22c55e] to-[#15803d]',
  },
  {
    id: 5, initials: 'NK', name: 'Neha Kaur', uid: '25AML15678',
    program: 'B.E. CSE (AI & ML)', year: '1st Year',
    time: '2:00 PM', timeRaw: 14 * 60,
    concern: 'Parent Discussion', concernIcon: Heart,
    mode: 'Offline' as const, confidence: 'Low' as const,
    status: 'upcoming' as const, duration: '7 min',
    avatarGrad: 'from-[#f59e0b] to-[#b45309]',
  },
];

const studentQueries = [
  { id: 1, student: 'Aryan Sharma', uid: '22BCS14521', subject: 'DSA Assignment #4 — Graph Traversal', message: 'Sir, I\'m confused about the difference between BFS and DFS time complexity in adjacency list vs matrix representation.', time: '2 hours ago', status: 'pending' as const },
  { id: 2, student: 'Kavya Nair', uid: '22BCS13402', subject: 'ML Project — Dataset Selection', message: 'Ma\'am, can you suggest a suitable dataset for our sentiment analysis project? We need at least 10k samples.', time: '5 hours ago', status: 'pending' as const },
  { id: 3, student: 'Rohit Singh', uid: '22BCS12890', subject: 'Python Lab — File Handling', message: 'Sir, my CSV parser is throwing encoding errors on Windows. Could you check my code during next session?', time: '1 day ago', status: 'resolved' as const },
  { id: 4, student: 'Simran Kaur', uid: '22BCS16201', subject: 'ML Mid-Sem Doubt', message: 'Could you clarify the difference between L1 and L2 regularization for the upcoming exam?', time: '1 day ago', status: 'resolved' as const },
  { id: 5, student: 'Amit Verma', uid: '22BCS10055', subject: 'DSA — Heap Implementation', message: 'I\'m getting wrong output for heapify-down operation. Can we discuss in the next slot?', time: '2 days ago', status: 'pending' as const },
];

/* ═══════════════════════════════════════════ */
/*           FACULTY DASHBOARD                */
/* ═══════════════════════════════════════════ */

export function FacultyDashboard({ onBack }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [tabKey, setTabKey] = useState(0);

  const switchTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setTabKey((k) => k + 1);
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile & Admin', icon: User },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'queries', label: 'Student Queries', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ═══════ TOP BAR ═══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-white/80 backdrop-blur-2xl border-b border-black/[0.04] shadow-[0_1px_20px_rgba(0,0,0,0.04)]">
        <div className="h-full flex items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <div className="w-9 h-9 bg-gradient-to-br from-[#E31837] to-[#C41230] rounded-xl flex items-center justify-center shadow-md shadow-red-600/15">
              <span className="text-white font-extrabold text-xs">CU</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[14px] text-gray-900 tracking-tight leading-tight">Faculty Connect</div>
              <div className="text-[9px] text-gray-400 font-semibold tracking-[0.14em] uppercase">Faculty Portal</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 w-[260px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search students, queries..." className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder:text-gray-300 font-medium" />
            </div>
            <button className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-[18px] h-[18px] text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E31837] rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 pr-1 py-1 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="hidden sm:block text-right">
                <div className="text-[12px] font-bold text-gray-800 leading-tight">{facultyData.name}</div>
                <div className="text-[10px] text-gray-400 font-medium">{facultyData.designation}</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-[11px]">RK</span>
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
                    active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`} />
                  <span className={`hidden lg:block text-[13px] font-semibold ${active ? 'text-emerald-700' : ''} transition-colors`}>
                    {tab.label}
                  </span>
                  {active && <div className="hidden lg:block ml-auto w-1.5 h-1.5 bg-emerald-600 rounded-full" />}
                </button>
              );
            })}
          </nav>
          <div className="p-2 lg:p-3 border-t border-gray-100">
            <button onClick={onBack} className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-[#E31837] transition-all duration-300">
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              <span className="hidden lg:block text-[13px] font-semibold">Back to Home</span>
            </button>
          </div>
        </aside>

        {/* ═══════ MAIN ═══════ */}
        <main className="flex-1 ml-[72px] lg:ml-[240px] p-5 lg:p-8">
          <div key={tabKey} className="animate-fadeSlideIn">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'meetings' && <MeetingsTab />}
            {activeTab === 'queries' && <QueriesTab />}
            {activeTab === 'analytics' && <FacultyAnalyticsTab />}
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
/*        TAB 1: PROFILE & ADMIN              */
/* ═══════════════════════════════════════════ */

function ProfileTab() {
  return (
    <div className="space-y-7">
      {/* Faculty Hero */}
      <div className="relative bg-gradient-to-br from-emerald-600/[0.06] via-emerald-500/[0.03] to-transparent rounded-3xl p-8 lg:p-10 overflow-hidden border border-emerald-100/40">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/[0.04] rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-[92px] h-[92px] bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/15 shrink-0 ring-4 ring-white">
            <span className="text-white font-bold text-2xl">RK</span>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-[28px] lg:text-[34px] font-extrabold text-gray-900 tracking-tight">{facultyData.name}</h1>
            <p className="text-[13px] text-gray-400 font-medium mt-0.5">{facultyData.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold">
                <Award className="w-3 h-3" />{facultyData.designation}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold">
                <Building2 className="w-3 h-3" />{facultyData.department}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[11px] font-bold">
                <Clock className="w-3 h-3" />{facultyData.experience}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details + HOD block side by side */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — Personal Details */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight">Faculty Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Hash, label: 'Employee ID', value: facultyData.empId },
              { icon: BookOpen, label: 'Designation', value: facultyData.designation },
              { icon: Phone, label: 'Phone', value: facultyData.phone },
              { icon: Mail, label: 'Email', value: facultyData.email },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-black/[0.04] hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300">
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

          {/* Assigned Courses */}
          <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight pt-2">Assigned Courses</h3>
          <div className="flex flex-wrap gap-3">
            {facultyData.courses.map((c, i) => (
              <div key={i} className="px-5 py-3 bg-white rounded-2xl border border-black/[0.04] text-[13px] font-semibold text-gray-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Right — My HOD Block */}
        <div className="relative bg-gradient-to-br from-[#E31837]/[0.05] via-[#E31837]/[0.02] to-transparent rounded-3xl p-6 border border-red-100/40 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#E31837]/[0.04] rounded-full blur-2xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E31837]/10 text-[#E31837] rounded-full text-[9px] font-bold uppercase tracking-[0.1em] mb-4">
              <Crown className="w-3 h-3" />My HOD
            </span>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E31837] to-[#ff6b7a] rounded-full flex items-center justify-center ring-3 ring-white shadow-lg shadow-red-600/10">
                <span className="text-white font-bold text-lg">AP</span>
              </div>
              <div>
                <h4 className="text-[16px] font-extrabold text-gray-900">{hodInfo.name}</h4>
                <p className="text-[11px] text-gray-500 font-medium">{hodInfo.title}</p>
              </div>
            </div>
            <p className="text-[12px] text-gray-400 font-medium leading-relaxed mb-3">{hodInfo.foundation}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                <Mail className="w-3 h-3 text-[#E31837]" />{hodInfo.email}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                <Phone className="w-3 h-3 text-[#E31837]" />{hodInfo.phone}
              </div>
            </div>
            <button className="mt-4 w-full py-2.5 bg-[#E31837] text-white text-[11px] font-bold rounded-xl hover:shadow-lg hover:shadow-red-600/20 transition-all">
              Contact HOD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*        TAB 2: TODAY'S SESSIONS             */
/* ═══════════════════════════════════════════ */

/* helpers */
const CONFIDENCE_CFG = {
  Low:    { color: '#ef4444', bg: 'bg-red-50',    text: 'text-red-600',    bar: 'w-1/3',  label: 'Low Confidence'    },
  Medium: { color: '#f59e0b', bg: 'bg-amber-50',  text: 'text-amber-600', bar: 'w-2/3',  label: 'Mid Confidence'    },
  High:   { color: '#22c55e', bg: 'bg-emerald-50',text: 'text-emerald-600',bar: 'w-full', label: 'High Confidence'   },
} as const;

const STATUS_CFG = {
  'upcoming':    { color: '#3b82f6', bg: 'bg-blue-50',    text: 'text-blue-600',    dot: 'bg-blue-400',     label: 'Upcoming'     },
  'in-progress': { color: '#E31837', bg: 'bg-red-50',     text: 'text-[#E31837]',  dot: 'bg-[#E31837]',    label: 'In Progress'  },
  'completed':   { color: '#22c55e', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400',  label: 'Completed'    },
} as const;

/* countdown hook */
function useCountdown(targetTimeRaw: number) {
  const getNow = () => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
  const [diff, setDiff] = useState(targetTimeRaw - getNow());
  useEffect(() => {
    const id = setInterval(() => setDiff(targetTimeRaw - getNow()), 30000);
    return () => clearInterval(id);
  }, [targetTimeRaw]);
  if (diff <= 0) return null;
  const h = Math.floor(diff / 60), m = diff % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/* next upcoming session = first with status 'upcoming' */
const nextSession = todaysSessions.find(s => s.status === 'upcoming');

function CountdownChip({ timeRaw }: { timeRaw: number }) {
  const t = useCountdown(timeRaw);
  if (!t) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E31837]/10 text-[#E31837] text-[9px] font-extrabold uppercase tracking-wider">
      <Timer className="w-2.5 h-2.5 animate-pulse" />in {t}
    </span>
  );
}

/* ─── Meet Link Modal ─── */
function MeetLinkModal({ session, onShare, onCancel }: {
  session: typeof todaysSessions[0];
  onShare: (link: string) => void;
  onCancel: () => void;
}) {
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const isValid = link.trim().startsWith('http');

  const handleShare = () => {
    if (!isValid) { setError('Please paste a valid Google Meet or Zoom link.'); return; }
    onShare(link.trim());
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 pt-[80px]" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 relative overflow-y-auto max-h-[calc(100vh-100px)]">
        <button onClick={onCancel} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E31837] to-[#ff4d5e] flex items-center justify-center shadow-md shadow-red-500/20">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-[17px] font-extrabold text-gray-900">Share Meet Link</h3>
            <p className="text-[11px] text-gray-400 font-medium">Session with <span className="text-gray-700 font-bold">{session.name}</span> · {session.time}</p>
          </div>
        </div>

        {/* Steps hint */}
        <div className="flex items-start gap-3 p-3.5 bg-blue-50 rounded-2xl border border-blue-100 mb-5">
          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">1</div>
          <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
            Create a Google Meet / Zoom call, copy the invite link, and paste it below. The student will instantly see a <span className="font-bold">Join Meeting</span> button on their dashboard.
          </p>
        </div>

        {/* Input */}
        <div className="relative mb-2">
          <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="url"
            value={link}
            onChange={e => { setLink(e.target.value); setError(''); }}
            placeholder="https://meet.google.com/abc-defg-hij"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-800 placeholder:text-gray-300 font-medium focus:outline-none focus:border-[#E31837]/50 focus:bg-white transition-all"
          />
        </div>
        {error && <p className="text-[11px] text-red-500 font-semibold mb-3">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-bold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={!link.trim()}
            className={`flex-1 py-3 rounded-xl text-white text-[13px] font-extrabold flex items-center justify-center gap-2 transition-all ${
              link.trim() ? 'bg-gradient-to-r from-[#E31837] to-[#ff4d5e] shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30' : 'bg-gray-200 cursor-not-allowed'
            }`}
          >
            <ExternalLink className="w-4 h-4" />Share with Student
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mark Complete Confirm Modal ─── */
function MarkCompleteModal({ session, onConfirm, onCancel }: {
  session: typeof todaysSessions[0];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 relative">
        <button onClick={onCancel} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
          <CheckCheck className="w-7 h-7 text-emerald-500" />
        </div>
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-1">Mark as Completed?</h3>
        <p className="text-[13px] text-gray-400 font-medium mb-1">Session with <span className="text-gray-700 font-bold">{session.name}</span></p>
        <p className="text-[12px] text-gray-400 font-medium mb-5">The student will be prompted to rate this session.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-bold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] font-extrabold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function MeetingsTab() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // local session statuses (mirrors todaysSessions but mutable)
  const [sessionStatuses, setSessionStatuses] = useState<Record<number, 'upcoming' | 'in-progress' | 'completed'>>(
    () => Object.fromEntries(todaysSessions.map(s => [s.id, s.status]))
  );
  const [confirmTarget, setConfirmTarget] = useState<typeof todaysSessions[0] | null>(null);
  const [meetLinkTarget, setMeetLinkTarget] = useState<typeof todaysSessions[0] | null>(null);
  const [completedRatings, setCompletedRatings] = useState<Record<number, number | null>>({});
  const [sharedLinks, setSharedLinks] = useState<Record<number, string>>({});

  // Subscribe to store updates (when student rates)
  useEffect(() => {
    const sync = () => {
      const all = getCompletedSessions();
      const map: Record<number, number | null> = {};
      all.forEach(s => { map[s.sessionId] = s.rating; });
      setCompletedRatings(map);
    };
    sync();
    return subscribeStore(sync);
  }, []);

  const handleMarkComplete = (s: typeof todaysSessions[0]) => {
    setConfirmTarget(s);
  };

  const handleConfirmComplete = () => {
    if (!confirmTarget) return;
    setSessionStatuses(prev => ({ ...prev, [confirmTarget.id]: 'completed' }));
    markSessionComplete({
      sessionId: confirmTarget.id,
      studentName: confirmTarget.name,
      subject: confirmTarget.concern,
      time: confirmTarget.time,
    });
    setConfirmTarget(null);
  };

  const handleStartSession = (s: typeof todaysSessions[0]) => {
    setMeetLinkTarget(s);
  };

  const handleShareLink = (link: string) => {
    if (!meetLinkTarget) return;
    shareMeetLink({
      sessionId: meetLinkTarget.id,
      studentName: meetLinkTarget.name,
      subject: meetLinkTarget.concern,
      time: meetLinkTarget.time,
      meetLink: link,
    });
    setSessionStatuses(prev => ({ ...prev, [meetLinkTarget.id]: 'in-progress' }));
    setSharedLinks(prev => ({ ...prev, [meetLinkTarget.id]: link }));
    setMeetLinkTarget(null);
    // open meet in new tab for faculty too
    window.open(link, '_blank');
  };

  const upcoming = todaysSessions.filter(s => sessionStatuses[s.id] === 'upcoming').length;
  const inProgress = todaysSessions.filter(s => sessionStatuses[s.id] === 'in-progress').length;
  const completed = todaysSessions.filter(s => sessionStatuses[s.id] === 'completed').length;

  const quickActions = [
    { icon: Play,         label: 'Start Next Session',  desc: nextSession?.time ?? '—',        accent: '#E31837', bg: 'bg-[#E31837]', textC: 'text-white', primary: true  },
    { icon: Calendar,     label: 'View Full Schedule',   desc: 'This week',                     accent: '#3b82f6', bg: 'bg-blue-50',   textC: 'text-blue-700', primary: false },
    { icon: Users,        label: 'Assigned Students',    desc: '42 Students',                   accent: '#8b5cf6', bg: 'bg-violet-50', textC: 'text-violet-700', primary: false },
    { icon: MessageSquare,label: 'Submit Feedback',      desc: '3 pending',                     accent: '#f59e0b', bg: 'bg-amber-50',  textC: 'text-amber-700', primary: false },
    { icon: Flag,         label: 'Escalate Student',     desc: 'Flag concern',                  accent: '#ef4444', bg: 'bg-red-50',    textC: 'text-red-700',   primary: false },
    { icon: Download,     label: 'Download Report',      desc: 'Export PDF',                    accent: '#22c55e', bg: 'bg-emerald-50',textC: 'text-emerald-700', primary: false },
  ];

  return (
    <div className="space-y-6">
      {/* Meet Link Modal */}
      {meetLinkTarget && (
        <MeetLinkModal
          session={meetLinkTarget}
          onShare={handleShareLink}
          onCancel={() => setMeetLinkTarget(null)}
        />
      )}
      {/* Mark Complete Modal */}
      {confirmTarget && (
        <MarkCompleteModal
          session={confirmTarget}
          onConfirm={handleConfirmComplete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-tight">Today's Sessions</h2>
          <p className="text-[12px] text-gray-400 font-medium mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { v: todaysSessions.length, l: 'Sessions Today', bg: 'bg-gray-900',     text: 'text-white'         },
            { v: inProgress,            l: 'In Progress',    bg: 'bg-[#E31837]',    text: 'text-white'         },
            { v: upcoming,              l: 'Upcoming',       bg: 'bg-blue-50',      text: 'text-blue-700'      },
            { v: completed,             l: 'Done',           bg: 'bg-emerald-50',   text: 'text-emerald-700'   },
          ].map(b => (
            <div key={b.l} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold ${b.bg} ${b.text}`}>
              <span className="text-[13px] font-extrabold">{b.v}</span>
              <span className="opacity-75 font-semibold">{b.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTIVITY BAR ── */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="shrink-0">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Session Progress</div>
          <div className="text-[11px] text-gray-600 font-semibold">{completed}/{todaysSessions.length} completed</div>
        </div>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E31837] to-[#ff6b7a] rounded-full transition-all duration-700"
            style={{ width: `${(completed / todaysSessions.length) * 100}%` }}
          />
        </div>
        <div className="shrink-0 text-[12px] font-extrabold text-gray-900">
          {Math.round((completed / todaysSessions.length) * 100)}%
        </div>
        {inProgress > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E31837]/8 rounded-xl border border-[#E31837]/15">
            <span className="w-1.5 h-1.5 bg-[#E31837] rounded-full animate-pulse" />
            <span className="text-[10px] font-extrabold text-[#E31837]">Live Session Active</span>
          </div>
        )}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid xl:grid-cols-[1fr_280px] gap-5 items-start">

        {/* LEFT — Session Cards */}
        <div className="space-y-3">
          {todaysSessions.map((s) => {
            const ConcernIcon = s.concernIcon;
            const conf = CONFIDENCE_CFG[s.confidence];
            const currentStatus = sessionStatuses[s.id] ?? s.status;
            const stat = STATUS_CFG[currentStatus];
            const isNext = nextSession?.id === s.id;
            const isLive = currentStatus === 'in-progress';
            const isDone = currentStatus === 'completed';
            const sessionRating = completedRatings[s.id] ?? null;

            return (
              <div
                key={s.id}
                className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 group
                  hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)]
                  ${isLive ? 'border-[#E31837]/30 shadow-[0_0_0_2px_rgba(227,24,55,0.08)]' : ''}
                  ${isNext && !isLive ? 'border-blue-200/60 shadow-[0_0_0_2px_rgba(59,130,246,0.07)]' : ''}
                  ${!isLive && !isNext ? 'border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.03)]' : ''}
                `}
              >
                {/* Left status strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-colors`}
                  style={{ background: stat.color }} />

                <div className="pl-4 pr-5 py-4">
                  <div className="flex items-start gap-4">

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${s.avatarGrad} flex items-center justify-center shadow-md`}>
                        <span className="text-white font-extrabold text-[13px]">{s.initials}</span>
                      </div>
                      {isLive && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E31837] rounded-full border-2 border-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping absolute" />
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        {/* Time */}
                        <span className="text-[11px] font-extrabold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-lg border border-black/[0.04]">
                          {s.time}
                        </span>
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${stat.bg} ${stat.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${stat.dot} ${isLive ? 'animate-pulse' : ''}`} />
                          {stat.label}
                        </span>
                        {/* Next session countdown */}
                        {isNext && !isLive && <CountdownChip timeRaw={s.timeRaw} />}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-[15px] font-extrabold text-gray-900 tracking-tight leading-snug">{s.name}</h4>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.program} • {s.year} • {s.uid}</p>
                        </div>
                        {/* Mode badge */}
                        <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold mt-0.5
                          ${s.mode === 'Online' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                          {s.mode === 'Online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                          {s.mode}
                        </span>
                      </div>

                      {/* Concern + Confidence row */}
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-700">
                          <ConcernIcon className="w-3 h-3 text-gray-500" />
                          {s.concern}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold ${conf.bg} ${conf.text}`}>
                          <span className="text-[8px] font-extrabold uppercase tracking-wider">Confidence</span>
                          <span className={`w-12 h-1 rounded-full bg-gray-200 overflow-hidden`}>
                            <span className={`block h-full ${conf.bar} rounded-full`} style={{ background: conf.color }} />
                          </span>
                          {s.confidence}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/[0.04]">
                    <button className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 text-[11px] font-bold rounded-xl transition-all duration-200 hover:-translate-y-[1px]">
                      <User className="w-3 h-3" />View Profile
                    </button>
                    {!isDone ? (
                      <>
                        <button
                          onClick={() => handleStartSession(s)}
                          className={`flex items-center gap-1.5 px-4 py-2 text-white text-[11px] font-extrabold rounded-xl transition-all duration-200 hover:-translate-y-[1px] shadow-sm
                          ${isLive
                            ? 'bg-gradient-to-r from-[#E31837] to-[#ff4d5e] shadow-red-600/20 hover:shadow-md hover:shadow-red-600/30'
                            : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:shadow-md'
                          }`}>
                          <Play className="w-3 h-3" />
                          {isLive ? 'Reshare Link' : 'Start Session'}
                        </button>
                        {/* Show shared link chip if link already shared */}
                        {sharedLinks[s.id] && (
                          <button
                            onClick={() => window.open(sharedLinks[s.id], '_blank')}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />Open Meet
                          </button>
                        )}
                        {isLive && (
                          <button
                            onClick={() => handleMarkComplete(s)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-extrabold rounded-xl transition-all duration-200 hover:-translate-y-[1px] shadow-sm shadow-emerald-500/20"
                          >
                            <CheckCheck className="w-3 h-3" />Mark Complete
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-xl border border-emerald-100">
                          <CheckCheck className="w-3 h-3" />Session Done
                        </span>
                        {/* Rating display */}
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(star => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${sessionRating !== null && star <= sessionRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-amber-600">
                            {sessionRating !== null ? `${sessionRating}/5` : 'Awaiting'}
                          </span>
                        </div>
                      </div>
                    )}
                    <button className="ml-auto flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-gray-600 text-[11px] font-semibold rounded-xl hover:bg-gray-50 transition-all">
                      <FileText className="w-3 h-3" />Notes
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — Quick Actions Panel */}
        <div className="space-y-3">

          {/* Next session callout */}
          {nextSession && (
            <div className="relative overflow-hidden rounded-2xl p-4 text-white"
              style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #E31837 100%)' }}>
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/60">Up Next</span>
                </div>
                <div className="font-extrabold text-[15px] leading-tight">{nextSession.name}</div>
                <div className="text-white/60 text-[11px] mt-0.5">{nextSession.program}</div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="flex items-center gap-1 text-[12px] font-bold"><Clock className="w-3 h-3 opacity-60" />{nextSession.time}</span>
                  <CountdownChip timeRaw={nextSession.timeRaw} />
                </div>
                <button className="mt-3 w-full py-2.5 bg-white text-[#E31837] text-[12px] font-extrabold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-md">
                  <Play className="w-3.5 h-3.5" />Start Session
                </button>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-black/[0.04]">
              <div className="text-[12px] font-extrabold text-gray-900 uppercase tracking-wider">Quick Actions</div>
            </div>
            <div className="p-2 space-y-1">
              {quickActions.slice(1).map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group text-left">
                    <div className={`w-8 h-8 rounded-[10px] ${a.bg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" style={{ color: a.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold text-gray-800 leading-tight">{a.label}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{a.desc}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Faculty productivity */}
          <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4">
            <div className="text-[11px] font-extrabold text-gray-900 uppercase tracking-wider mb-3">Today's Productivity</div>
            <div className="space-y-2.5">
              {[
                { label: 'Sessions Done',    val: `${completed}/${todaysSessions.length}`, pct: (completed/todaysSessions.length)*100, color: '#22c55e' },
                { label: 'Response Rate',    val: '94%',  pct: 94,  color: '#3b82f6' },
                { label: 'Avg Session Time', val: '6.8m', pct: 68,  color: '#E31837' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 font-semibold">{m.label}</span>
                    <span className="text-[11px] font-extrabold text-gray-900">{m.val}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*        TAB 3: STUDENT QUERIES              */
/* ═══════════════════════════════════════════ */

function QueriesTab() {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Student Queries</h2>
          <p className="text-[14px] text-gray-400 font-medium mt-1">Pending academic & personal queries from students</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[11px] font-bold flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />3 Pending
          </span>
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />2 Resolved
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {studentQueries.map((q) => (
          <div key={q.id} className="p-5 bg-white rounded-2xl border border-black/[0.04] hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-400 hover:-translate-y-[2px]">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white font-bold text-[10px]">
                  {q.student.split(' ').map(n => n[0]).join('')}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-[14px] font-bold text-gray-900">{q.student}</h4>
                  <span className="text-[11px] text-gray-400 font-medium">{q.uid}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    q.status === 'pending'
                      ? 'bg-amber-50 text-amber-500'
                      : 'bg-emerald-50 text-emerald-500'
                  }`}>{q.status}</span>
                  <span className="text-[11px] text-gray-300 font-medium ml-auto">{q.time}</span>
                </div>
                <p className="text-[13px] text-[#E31837] font-semibold mt-1">{q.subject}</p>
                <p className="text-[13px] text-gray-500 font-medium mt-1 leading-relaxed">{q.message}</p>

                {q.status === 'pending' && (
                  <div className="flex items-center gap-2 mt-3">
                    <button className="px-4 py-2 bg-[#E31837] text-white rounded-xl text-[11px] font-bold hover:shadow-md hover:shadow-red-600/20 transition-all">Reply</button>
                    <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-bold hover:bg-emerald-100 transition-all">Mark Resolved</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*        TAB 4: FACULTY ANALYTICS            */
/* ═══════════════════════════════════════════ */

function FacultyAnalyticsTab() {
  const stats = [
    { label: 'Total Hours Churned', value: '142 hrs', change: '+18 this month', icon: Clock, tint: 'bg-red-50 text-[#E31837]' },
    { label: 'Average Rating', value: '4.8/5.0', change: 'Based on 245 reviews', icon: Star, tint: 'bg-amber-50 text-amber-500' },
    { label: 'Resolution Rate', value: '98%', change: '+2% vs last semester', icon: Target, tint: 'bg-emerald-50 text-emerald-500' },
    { label: 'Students Mentored', value: '156', change: '12 active this week', icon: User, tint: 'bg-blue-50 text-blue-500' },
  ];

  const monthlyData = [
    { month: 'Jan', hours: 22 },
    { month: 'Feb', hours: 28 },
    { month: 'Mar', hours: 25 },
    { month: 'Apr', hours: 32 },
    { month: 'May', hours: 35 },
  ];
  const maxHours = Math.max(...monthlyData.map(d => d.hours));

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Performance Analytics</h2>
        <p className="text-[14px] text-gray-400 font-medium mt-1">Your mentorship performance and impact metrics</p>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-black/[0.04] hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300 group hover:-translate-y-1">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.tint} mb-4 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-[26px] font-extrabold text-gray-900">{s.value}</div>
              <div className="text-[12px] text-gray-400 font-semibold mt-0.5">{s.label}</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-500 font-bold">{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Hours Chart */}
      <div className="bg-white rounded-2xl p-7 border border-black/[0.04]">
        <h3 className="text-[16px] font-bold text-gray-800 mb-6">Monthly Hours Churned</h3>
        <div className="flex items-end gap-5 h-[160px]">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500">{d.hours}h</span>
              <div
                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-xl transition-all duration-700 hover:opacity-80"
                style={{ height: `${(d.hours / maxHours) * 120}px` }}
              />
              <span className="text-[11px] font-semibold text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Breakdown */}
      <div className="bg-white rounded-2xl p-7 border border-black/[0.04]">
        <h3 className="text-[16px] font-bold text-gray-800 mb-5">Session Category Breakdown</h3>
        <div className="space-y-5">
          {[
            { label: 'Academic Doubt Clearing', pct: 48, color: 'from-[#E31837] to-[#ff4d5e]' },
            { label: 'Career & Placement Guidance', pct: 27, color: 'from-blue-500 to-blue-400' },
            { label: 'Project Mentorship', pct: 15, color: 'from-emerald-500 to-emerald-400' },
            { label: 'Personal Counseling', pct: 10, color: 'from-amber-500 to-amber-400' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-gray-600">{item.label}</span>
                <span className="text-[13px] font-bold text-gray-800">{item.pct}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
