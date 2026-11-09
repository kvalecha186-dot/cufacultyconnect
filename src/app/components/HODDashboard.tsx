import { useState, useEffect, useRef } from 'react';
import {
  User, Users, BarChart3, AlertTriangle, LogOut, Bell, Search,
  Award, Clock, CheckCircle2, TrendingUp, Star, Video, Target,
  Crown, Building, Activity, ArrowUpRight, UserCheck, AlertCircle,
  Layers, Mail, Phone, Sparkles, ArrowUp,
} from 'lucide-react';

type Tab = 'overview' | 'faculty' | 'escalations' | 'analytics';

interface HODDashboardProps { onBack: () => void; }

/* ─── Mock Data ─── */
const hodProfile = {
  name: 'Dr. Amrit Pal Singh',
  initials: 'AP',
  empId: 'CU-HOD-00112',
  email: 'amritpal.singh@cuchd.in',
  department: 'Artificial Intelligence & Machine Learning',
  departmentCode: 'AIML',
  blocks: ['B1', 'B2', 'B3'],
  facultyCount: 24,
  studentsUnder: 860,
};

const ASSIGNED_SECTIONS = [
  '25AML-101','25AML-102','25AML-103','25AML-201','25AML-202',
  '25AML-301','25AML-302','25AML-303','25AML-304',
  '25AML-401','25AML-402','25AML-403',
];

const facultyTracker = [
  { name: 'Dr. Rajesh Kumar',   subject: 'Data Structures & Algorithms',  activeSessions: 3, attendance: 97, satisfaction: 4.9, status: 'active' as const },
  { name: 'Prof. Anita Mehra',  subject: 'Object Oriented Programming',   activeSessions: 2, attendance: 95, satisfaction: 4.7, status: 'active' as const },
  { name: 'Dr. Sunil Verma',    subject: 'Advanced Calculus',             activeSessions: 0, attendance: 91, satisfaction: 4.5, status: 'idle'   as const },
  { name: 'Prof. Meena Kapoor', subject: 'Web Development',               activeSessions: 1, attendance: 94, satisfaction: 4.8, status: 'active' as const },
  { name: 'Dr. Vikram Joshi',   subject: 'Database Management Systems',   activeSessions: 0, attendance: 88, satisfaction: 4.3, status: 'idle'   as const },
  { name: 'Prof. Ritu Sharma',  subject: 'Computer Networks',             activeSessions: 2, attendance: 96, satisfaction: 4.6, status: 'active' as const },
  { name: 'Dr. Priya Singh',    subject: 'Operating Systems',             activeSessions: 1, attendance: 93, satisfaction: 4.4, status: 'active' as const },
  { name: 'Prof. Arun Malhotra',subject: 'Discrete Mathematics',          activeSessions: 0, attendance: 89, satisfaction: 4.2, status: 'idle'   as const },
];

const escalatedCases = [
  { id: 1, student: 'Rohit Mehra',  uid: '22BCS12340', issue: 'Repeated absenteeism — faculty unable to resolve in 3 sessions',       faculty: 'Dr. Sunil Verma',    priority: 'high'   as const, time: '2 hours ago'  },
  { id: 2, student: 'Simran Kaur',  uid: '22BCS16201', issue: 'Academic performance drop — needs mentorship reallocation',            faculty: 'Prof. Arun Malhotra',priority: 'medium' as const, time: '5 hours ago'  },
  { id: 3, student: 'Amit Verma',   uid: '22BCS10055', issue: 'Personal counseling required — beyond faculty scope',                  faculty: 'Dr. Vikram Joshi',   priority: 'high'   as const, time: '1 day ago'     },
  { id: 4, student: 'Kavya Nair',   uid: '22BCS13402', issue: 'Project guidance conflict — requesting mentor change',                 faculty: 'Prof. Meena Kapoor', priority: 'low'    as const, time: '2 days ago'    },
];

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setVal(Math.round(ease * target));
      if (pct < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

/* ═══════════════════════════════════════════ */
/*             HOD DASHBOARD SHELL            */
/* ═══════════════════════════════════════════ */
export function HODDashboard({ onBack }: HODDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [tabKey, setTabKey] = useState(0);

  const switchTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setTabKey(k => k + 1);
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'overview',    label: 'Overview',        icon: Crown        },
    { id: 'faculty',     label: 'Faculty Tracker', icon: Users        },
    { id: 'escalations', label: 'Escalations',     icon: AlertTriangle},
    { id: 'analytics',   label: 'Dept Analytics',  icon: BarChart3    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* ═══════ TOP BAR ═══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-white/80 backdrop-blur-2xl border-b border-black/[0.04] shadow-[0_1px_20px_rgba(0,0,0,0.04)]">
        <div className="h-full flex items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #13233F, #3568E8)' }}>
              <span className="text-white font-extrabold text-xs">CU</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[14px] text-gray-900 tracking-tight leading-tight">CU Connect</div>
              <div className="text-[9px] text-gray-400 font-semibold tracking-[0.14em] uppercase">HOD Portal</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 w-[260px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search faculty, students..."
                className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder:text-gray-300 font-medium" />
            </div>
            <button className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-[18px] h-[18px] text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E10619] rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 pr-1 py-1 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="hidden sm:block text-right">
                <div className="text-[12px] font-bold text-gray-800 leading-tight">{hodProfile.name}</div>
                <div className="text-[10px] text-gray-400 font-medium">Head of Dept.</div>
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #13233F, #3568E8)' }}>
                <span className="text-white font-bold text-[11px]">{hodProfile.initials}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-[68px] flex min-h-screen">

        {/* ═══════ SIDEBAR ═══════ */}
        <aside className="fixed left-0 top-[68px] bottom-0 w-[72px] lg:w-[240px] bg-white border-r border-black/[0.04] z-40 flex flex-col">
          <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => switchTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active
                      ? 'text-white shadow-md'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                  style={active ? { background: 'linear-gradient(135deg, #13233F, #3568E8)' } : {}}>
                  <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className={`hidden lg:block text-[13px] font-semibold ${active ? 'text-white' : ''}`}>{tab.label}</span>
                  {active && <div className="hidden lg:block ml-auto w-1.5 h-1.5 bg-white/60 rounded-full" />}
                </button>
              );
            })}
          </nav>
          <div className="p-2 lg:p-3 border-t border-gray-100">
            <button onClick={onBack}
              className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-[#E10619] transition-all duration-300">
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              <span className="hidden lg:block text-[13px] font-semibold">Back to Home</span>
            </button>
          </div>
        </aside>

        {/* ═══════ MAIN ═══════ */}
        <main className="flex-1 ml-[72px] lg:ml-[240px] p-5 lg:p-8">
          <div key={tabKey} className="hod-animate">
            {activeTab === 'overview'    && <OverviewTab />}
            {activeTab === 'faculty'     && <FacultyTrackerTab />}
            {activeTab === 'escalations' && <EscalationsTab />}
            {activeTab === 'analytics'   && <DeptAnalyticsTab />}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes hodFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hod-animate { animation: hodFadeIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*        TAB 1: OVERVIEW                     */
/* ═══════════════════════════════════════════ */
function OverviewTab() {
  const h = hodProfile;
  const totalFreshers  = useCountUp(1247);
  const activeMentors  = useCountUp(19);
  const sessionsMo     = useCountUp(142);

  return (
    <div className="space-y-6">

      {/* ── HERO BANNER ── */}
      <div className="relative rounded-[32px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #13233F 0%, #244A8A 50%, #3568E8 100%)' }}>
        {/* Red accent glow */}
        <div className="absolute -bottom-16 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(225,6,25,0.18) 0%, transparent 70%)' }} />
        {/* Orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/[0.06] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="absolute top-8 right-52 w-28 h-28 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute bottom-6 right-12 w-20 h-20 bg-[#E10619]/[0.15] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-white/[0.03] rounded-full pointer-events-none" />

        <div className="relative p-7 sm:p-9">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-[80px] h-[80px] rounded-[24px] bg-white/15 border-2 border-white/25 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <span className="text-white font-extrabold text-[28px] tracking-tight">{h.initials}</span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#22C55E] rounded-full border-[2.5px] border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/70 border border-white/15"
                  style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <Crown className="w-3 h-3" /> Head of Department
                </span>
              </div>
              <h1 className="text-white text-[26px] sm:text-[30px] font-extrabold tracking-tight leading-tight">{h.name}</h1>
              <p className="text-white/55 text-[13px] font-medium mt-1">Head of Department • {h.department}</p>
              <p className="text-white/30 text-[11px] mt-2 italic">"Empowering every student through academic excellence and strong mentorship."</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── DEPARTMENT INFO CARD ── */}
      <div className="relative rounded-[28px] overflow-hidden border border-white/20 p-6"
        style={{ background: 'linear-gradient(145deg, rgba(19,35,63,0.97) 0%, rgba(36,74,138,0.95) 100%)', boxShadow: '0 8px 32px rgba(19,35,63,0.18)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="flex flex-wrap items-center gap-6 text-[13px] relative">
          {[
            { icon: Building, label: 'Department', value: `${h.department} (${h.departmentCode})`, color: '#3568E8' },
            { icon: Layers,   label: 'Blocks Managed', value: h.blocks.join(', '),                  color: '#8B5CF6' },
            { icon: User,     label: 'Employee ID',    value: h.empId,                               color: '#22C55E' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0 border border-white/10"
                style={{ background: `${color}22` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</div>
                <div className="text-[13px] font-semibold text-white/85">{value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 relative">
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider mr-1">Assigned Sections:</span>
          {ASSIGNED_SECTIONS.map(sec => (
            <span key={sec}
              className="px-2.5 py-1 rounded-[8px] text-[10px] font-bold text-white/70 border border-white/10 cursor-default transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/25"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              {sec}
            </span>
          ))}
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Freshers',    value: totalFreshers, suffix: '',  sub: '12 sections enrolled',       icon: Users,    grad: 'linear-gradient(135deg, #3a0505 0%, #7a0000 55%, #E10619 100%)'  },
          { label: 'Active Mentors',    value: activeMentors, suffix: '',  sub: '5 Faculty + 14 Senior',      icon: Crown,    grad: 'linear-gradient(135deg, #1a0a3a 0%, #3b1f82 55%, #7c3aed 100%)'  },
          { label: 'Sessions This Month', value: sessionsMo,  suffix: '',  sub: '+18% vs last month',         icon: Activity, grad: 'linear-gradient(135deg, #001535 0%, #003b8e 55%, #3568E8 100%)'  },
          { label: 'Feedback Rating',   value: 46,            suffix: '/5',sub: 'Based on 856 submissions',   icon: Star,     grad: 'linear-gradient(135deg, #021a0a 0%, #065221 55%, #16a34a 100%)'  },
        ].map((m, i) => {
          const Icon = m.icon;
          const display = m.suffix === '/5' ? '4.6' : m.value.toLocaleString();
          return (
            <div key={i}
              className="relative rounded-[24px] overflow-hidden p-6 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition-all duration-300 cursor-default"
              style={{ background: m.grad }}>
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/[0.05] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/[0.03] rounded-full pointer-events-none" />
              <div className="relative">
                <div className="w-11 h-11 rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-[32px] font-extrabold text-white leading-none tracking-tight">{display}{m.suffix}</div>
                <div className="text-[12px] font-bold text-white/80 mt-2 leading-snug">{m.label}</div>
                <div className="text-[10px] text-white/40 font-medium mt-0.5">{m.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── STUDENT FEEDBACK ANALYTICS ── */}
      <div className="relative rounded-[28px] overflow-hidden border border-white/10 p-6"
        style={{ background: 'linear-gradient(145deg, #021a0a 0%, #065221 50%, #16a34a 100%)', boxShadow: '0 8px 32px rgba(22,163,74,0.12)' }}>
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-28 h-28 bg-white/[0.03] rounded-full pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[13px] bg-white/10 border border-white/15 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-white">Student Feedback Rating — {h.departmentCode}</div>
              <div className="text-[11px] text-white/40 font-medium">Based on 856 fresher submissions this semester</div>
            </div>
          </div>
          <div className="flex items-end gap-4 mb-5">
            <div className="text-[48px] font-extrabold text-white leading-none">4.6</div>
            <div className="pb-2">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                ))}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#4ade80] font-bold">
                <ArrowUp className="w-3 h-3" />+0.3 vs last semester
              </div>
            </div>
          </div>
          {/* Progress bars per semester */}
          <div className="space-y-2.5">
            {[
              { sem: 'Spring 2025', val: 92 },
              { sem: 'Fall 2024',   val: 87 },
              { sem: 'Spring 2024', val: 81 },
            ].map(({ sem, val }) => (
              <div key={sem} className="flex items-center gap-3">
                <div className="text-[10px] text-white/40 font-medium w-24 shrink-0">{sem}</div>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-300 transition-all duration-700"
                    style={{ width: `${val}%` }} />
                </div>
                <div className="text-[11px] font-bold text-white/70 w-8 text-right">{val}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOP PERFORMING FACULTY ── */}
      <div>
        <h3 className="text-[15px] font-extrabold text-[#13233F] mb-4 tracking-tight">Top Performing Faculty</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {facultyTracker.filter(f => f.satisfaction >= 4.6).slice(0,3).map((f, i) => (
            <div key={i} className="bg-white rounded-[20px] border border-black/[0.04] p-5 flex items-center gap-4 hover:-translate-y-[2px] hover:shadow-lg transition-all duration-300">
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-[10px] font-extrabold shrink-0"
                style={{ background: 'linear-gradient(135deg, #13233F, #3568E8)' }}>
                {f.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-[#1A1A1A] truncate">{f.name}</div>
                <div className="text-[11px] text-gray-400 font-medium truncate">{f.subject}</div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-[13px] font-bold">{f.satisfaction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*     TAB 2: FACULTY ACTIVITY TRACKER        */
/* ═══════════════════════════════════════════ */
function FacultyTrackerTab() {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="relative rounded-[28px] overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #13233F 0%, #244A8A 60%, #3568E8 100%)' }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white/60 mb-3"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <Users className="w-3 h-3" />Faculty Activity Tracker
          </div>
          <h2 className="text-[22px] font-extrabold text-white tracking-tight">Department Faculty</h2>
          <p className="text-[13px] text-white/45 font-medium mt-1">Live sessions, attendance & student satisfaction overview</p>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-[24px] border border-black/[0.04] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider"
          style={{ background: 'linear-gradient(90deg, #F8F9FB 0%, #F0F2F5 100%)' }}>
          <div className="col-span-4">Faculty</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-1 text-center">Sessions</div>
          <div className="col-span-2 text-center">Attendance</div>
          <div className="col-span-2 text-center">Rating</div>
        </div>
        {facultyTracker.map((f, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-colors items-center group">
            <div className="col-span-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-[11px] flex items-center justify-center text-white text-[9px] font-extrabold"
                  style={{ background: 'linear-gradient(135deg, #13233F, #3568E8)' }}>
                  {f.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${f.status === 'active' ? 'bg-emerald-400' : 'bg-gray-300'}`} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-gray-800">{f.name}</div>
                <div className="text-[10px] text-gray-400 font-medium capitalize">{f.status}</div>
              </div>
            </div>
            <div className="col-span-3 text-[12px] text-gray-500 font-medium">{f.subject}</div>
            <div className="col-span-1 text-center">
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[12px] font-bold ${
                f.activeSessions > 0 ? 'text-white' : 'bg-gray-50 text-gray-400'
              }`} style={f.activeSessions > 0 ? { background: 'linear-gradient(135deg, #3568E8, #244A8A)' } : {}}>
                {f.activeSessions}
              </span>
            </div>
            <div className="col-span-2 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${f.attendance >= 95 ? 'bg-emerald-400' : f.attendance >= 90 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${f.attendance}%` }} />
                </div>
                <span className="text-[12px] font-bold text-gray-700">{f.attendance}%</span>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <div className="inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[13px] font-bold text-gray-700">{f.satisfaction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*     TAB 3: ESCALATIONS                     */
/* ═══════════════════════════════════════════ */
function EscalationsTab() {
  const PRIORITY_STYLE = {
    high:   { bg: 'rgba(225,6,25,0.12)',   border: 'rgba(225,6,25,0.25)',   text: '#E10619', label: 'High Priority'   },
    medium: { bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.25)',  text: '#CA8A04', label: 'Medium Priority' },
    low:    { bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)', text: '#2563EB', label: 'Low Priority'    },
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative rounded-[28px] overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #3a0505 0%, #7a0000 55%, #E10619 100%)' }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/[0.03] rounded-full pointer-events-none" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white/60 mb-3"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <AlertTriangle className="w-3 h-3" />Escalation Center
            </div>
            <h2 className="text-[22px] font-extrabold text-white tracking-tight">Pending Escalations</h2>
            <p className="text-[13px] text-white/45 font-medium mt-1">Cases beyond the 5–7 min mentorship window</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/15">
              2 High Priority
            </span>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/15">
              4 Total
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {escalatedCases.map((c) => {
          const ps = PRIORITY_STYLE[c.priority];
          return (
            <div key={c.id} className="bg-white rounded-[22px] border border-black/[0.04] p-6 hover:-translate-y-[2px] hover:shadow-lg transition-all duration-300"
              style={{ borderLeft: `3px solid ${ps.text}` }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{ background: ps.bg, border: `1px solid ${ps.border}` }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: ps.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h4 className="text-[15px] font-bold text-gray-900">{c.student}</h4>
                    <span className="text-[11px] text-gray-400 font-medium">{c.uid}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: ps.text, background: ps.bg }}>{ps.label}</span>
                    <span className="text-[11px] text-gray-300 font-medium ml-auto">{c.time}</span>
                  </div>
                  <p className="text-[13px] text-gray-600 font-medium leading-relaxed">{c.issue}</p>
                  <p className="text-[12px] text-gray-400 font-medium mt-1.5">
                    Escalated from: <span className="text-gray-600 font-semibold">{c.faculty}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <button className="px-4 py-2 rounded-[11px] text-white text-[11px] font-bold hover:shadow-md transition-all"
                      style={{ background: 'linear-gradient(135deg, #13233F, #3568E8)' }}>
                      Reassign Mentor
                    </button>
                    <button className="px-4 py-2 rounded-[11px] bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-all">
                      Mark Resolved
                    </button>
                    <button className="px-4 py-2 rounded-[11px] bg-gray-50 text-gray-600 text-[11px] font-bold hover:bg-gray-100 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*     TAB 4: DEPT ANALYTICS                  */
/* ═══════════════════════════════════════════ */
function DeptAnalyticsTab() {
  const monthlyData = [
    { month: 'Jan', resolved: 82 },
    { month: 'Feb', resolved: 87 },
    { month: 'Mar', resolved: 91 },
    { month: 'Apr', resolved: 94 },
    { month: 'May', resolved: 98 },
  ];

  const resolutionRate = useCountUp(98);
  const totalSessions  = useCountUp(1247);

  const METRIC_CARDS = [
    {
      label: 'Resolution Rate', value: `${resolutionRate}%`, change: '+4% this semester',
      icon: Target,
      grad: 'linear-gradient(135deg, #3a0505 0%, #7a0000 55%, #E10619 100%)',
    },
    {
      label: 'Total Sessions', value: totalSessions.toLocaleString(), change: 'This semester',
      icon: Video,
      grad: 'linear-gradient(135deg, #001535 0%, #003b8e 55%, #3568E8 100%)',
    },
    {
      label: 'Avg Rating', value: '4.6/5.0', change: 'Across 24 faculty',
      icon: Star,
      grad: 'linear-gradient(135deg, #1a100a 0%, #6b3500 55%, #d97706 100%)',
    },
    {
      label: 'Active Mentors', value: '19/24', change: '5 on leave',
      icon: UserCheck,
      grad: 'linear-gradient(135deg, #021a0a 0%, #065221 55%, #16a34a 100%)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative rounded-[28px] overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #13233F 0%, #244A8A 60%, #3568E8 100%)' }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 left-10 w-36 h-36 bg-[#E10619]/[0.12] rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white/60 mb-3"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <BarChart3 className="w-3 h-3" />Department Analytics
          </div>
          <h2 className="text-[22px] font-extrabold text-white tracking-tight">Performance Dashboard</h2>
          <p className="text-[13px] text-white/45 font-medium mt-1">Real-time mentorship resolution and department data</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i}
              className="relative rounded-[24px] overflow-hidden p-6 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition-all duration-300 cursor-default"
              style={{ background: s.grad }}>
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/[0.05] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/[0.03] rounded-full pointer-events-none" />
              <div className="relative">
                <div className="w-11 h-11 rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-[28px] font-extrabold text-white leading-none">{s.value}</div>
                <div className="text-[12px] font-bold text-white/80 mt-2">{s.label}</div>
                <div className="flex items-center gap-1 mt-1.5">
                  <TrendingUp className="w-3 h-3 text-white/50" />
                  <span className="text-[10px] text-white/50 font-bold">{s.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution Trend Chart */}
      <div className="bg-white rounded-[24px] border border-black/[0.04] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #13233F, #3568E8)' }}>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#13233F]">Monthly Resolution Rate Trend</h3>
            <p className="text-[11px] text-gray-400 font-medium">Faculty mentorship performance over time</p>
          </div>
        </div>
        <div className="flex items-end gap-5 h-[160px]">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500">{d.resolved}%</span>
              <div className="w-full rounded-[10px] transition-all duration-700 hover:opacity-80"
                style={{
                  height: `${(d.resolved / 100) * 130}px`,
                  background: 'linear-gradient(180deg, #3568E8 0%, #13233F 100%)',
                }} />
              <span className="text-[11px] font-semibold text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mentorship Allocation Matrix */}
      <div className="bg-white rounded-[24px] border border-black/[0.04] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #065221, #16a34a)' }}>
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#13233F]">Mentorship Allocation Matrix</h3>
            <p className="text-[11px] text-gray-400 font-medium">Student load per faculty mentor</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { faculty: 'Dr. Rajesh Kumar',    students: 42, capacity: 50 },
            { faculty: 'Prof. Anita Mehra',   students: 38, capacity: 45 },
            { faculty: 'Prof. Ritu Sharma',   students: 35, capacity: 40 },
            { faculty: 'Dr. Priya Singh',     students: 44, capacity: 45 },
            { faculty: 'Prof. Meena Kapoor',  students: 28, capacity: 40 },
          ].map((a, i) => {
            const pct = (a.students / a.capacity) * 100;
            const overloaded = pct > 90;
            return (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[13px] font-semibold text-gray-600 w-[180px] shrink-0 truncate">{a.faculty}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: overloaded
                        ? 'linear-gradient(90deg, #E10619, #ff4d5e)'
                        : 'linear-gradient(90deg, #3568E8, #244A8A)',
                    }} />
                </div>
                <span className="text-[12px] font-bold text-gray-700 w-[60px] text-right shrink-0">{a.students}/{a.capacity}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
