import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Search, Calendar, Video, Building2, ChevronRight, Clock3,
} from 'lucide-react';
import { DEPARTMENT_STATS } from '../../data/cuAcademicData';

/* ── Helper: deterministic count-up ── */
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    done.current = false; setVal(0);
    const t0 = performance.now();
    const tick = (now: number) => {
      if (done.current) return;
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick); else done.current = true;
    };
    requestAnimationFrame(tick);
    return () => { done.current = true; };
  }, [target, duration]);
  return val;
}

/* ── Mock session log across departments ── */
interface SessionRecord {
  id: string; studentName: string; studentInitials: string;
  mentorName: string; mentorType: 'Faculty' | 'Senior' | 'HOD';
  deptCode: string; topic: string; mode: 'Online' | 'Offline';
  status: 'Completed' | 'Live' | 'Upcoming';
  date: string; time: string; rating: number | null;
}

const STUDENT_NAMES = ['Aryan Sharma','Neha Gupta','Karan Verma','Diya Singh','Rohit Kapoor','Sanya Mehta','Aditya Joshi','Pooja Rao','Vikram Bose','Ishita Nair'];
const MENTOR_NAMES = ['Dr. Sandeep Singh','Dr. Priya Mehta','Ananya Kapoor','Rohan Malhotra','Dr. Amit Sharma','Megha Pillai','Dr. Rajan Verma','Karan Joshi'];
const TOPICS = ['Academics','Career Guidance','Hostel Life','Placement Prep','Course Planning','Project Mentorship','Networking','Personal Growth'];

function genSessions(deptCode: string, count: number): SessionRecord[] {
  const out: SessionRecord[] = [];
  const statuses: SessionRecord['status'][] = ['Completed','Completed','Completed','Live','Upcoming'];
  for (let i = 0; i < count; i++) {
    const student = STUDENT_NAMES[i % STUDENT_NAMES.length];
    const mentor = MENTOR_NAMES[(i * 2 + 1) % MENTOR_NAMES.length];
    const status = statuses[i % statuses.length];
    out.push({
      id: `${deptCode}-S${i}`,
      studentName: student,
      studentInitials: student.split(' ').map(p => p[0]).join(''),
      mentorName: mentor,
      mentorType: i % 3 === 0 ? 'Senior' : 'Faculty',
      deptCode,
      topic: TOPICS[i % TOPICS.length],
      mode: i % 2 === 0 ? 'Offline' : 'Online',
      status,
      date: status === 'Upcoming' ? 'Jun 22, 2026' : 'Jun 16, 2026',
      time: ['10:00 AM','11:30 AM','2:00 PM','3:30 PM','4:00 PM'][i % 5],
      rating: status === 'Completed' ? (4 + (i % 10) / 10) : null,
    });
  }
  return out;
}

const ALL_SESSIONS: SessionRecord[] = DEPARTMENT_STATS.flatMap(d => genSessions(d.code, 14));

const STATUS_THEME: Record<SessionRecord['status'], { bg: string; text: string; dot: string }> = {
  Completed: { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },
  Live:      { bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' },
  Upcoming:  { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
};

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export function SessionDirectoryDashboard({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');

  const deptNameByCode = Object.fromEntries(DEPARTMENT_STATS.map(d => [d.code, d.name]));
  const statuses = ['All', 'Completed', 'Live', 'Upcoming'];
  const modes = ['All', 'Online', 'Offline'];

  const filtered = ALL_SESSIONS.filter(s => {
    const q = search.trim().toLowerCase();
    const deptName = deptNameByCode[s.deptCode] ?? s.deptCode;
    return (!q || s.studentName.toLowerCase().includes(q) || s.mentorName.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q) || deptName.toLowerCase().includes(q))
      && (statusFilter === 'All' || s.status === statusFilter)
      && (modeFilter === 'All' || s.mode === modeFilter);
  });

  const animTotal = useCountUp(ALL_SESSIONS.length);
  const animLive = useCountUp(ALL_SESSIONS.filter(s => s.status === 'Live').length);
  const animUpcoming = useCountUp(ALL_SESSIONS.filter(s => s.status === 'Upcoming').length);
  const animCompleted = useCountUp(ALL_SESSIONS.filter(s => s.status === 'Completed').length);

  return createPortal(
    <div className="fixed inset-0 z-[70] overflow-y-auto" style={{ background: 'linear-gradient(160deg,#F5F8FF 0%,#F5F7FB 40%,#EFF4FF 100%)' }}>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-300/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-200/10 blur-[150px] pointer-events-none" />

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #001535 0%, #003b8e 55%, #3568E8 100%)' }}>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/[0.06] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="relative px-6 pt-8 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[28px] sm:text-[34px] font-extrabold text-white tracking-tight leading-tight">Session Directory</h1>
              <p className="text-white/45 text-[13px] font-medium mt-2 max-w-lg">Every mentorship session across the university — live, upcoming, and completed.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-[14px] bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/15 hover:border-white/30 shrink-0 mt-1">
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Sessions', value: animTotal, icon: '📅' },
              { label: 'Live Now', value: animLive, icon: '🟢' },
              { label: 'Upcoming', value: animUpcoming, icon: '🔵' },
              { label: 'Completed', value: animCompleted, icon: '✅' },
            ].map(s => (
              <div key={s.label} className="rounded-[18px] px-4 py-3 border border-white/10 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-[22px]">{s.icon}</span>
                <div>
                  <div className="text-[20px] font-extrabold text-white leading-none">{s.value}</div>
                  <div className="text-[9px] text-white/50 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto relative z-10">
        <div className="rounded-[32px] border border-blue-100/50 bg-white/70 backdrop-blur-md overflow-hidden shadow-[0_12px_40px_rgba(36,74,138,0.04),_0_2px_8px_rgba(36,74,138,0.02)]">
          {/* Controls */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[10px] bg-blue-50 border border-blue-100/60 flex items-center justify-center"><Calendar className="w-4 h-4 text-blue-600" /></div>
              <div className="text-[15px] font-extrabold text-slate-800">Session Log</div>
              <span className="ml-auto text-[11px] text-slate-500 font-semibold">{filtered.length} sessions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by student, mentor, or topic..."
                  className="w-full pl-8 pr-3 py-2 rounded-[10px] border border-slate-200 bg-white text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-300"
                />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-[10px] border border-slate-200 bg-white text-[12px] text-slate-700 focus:outline-none focus:border-blue-300">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={modeFilter} onChange={e => setModeFilter(e.target.value)}
                className="px-3 py-2 rounded-[10px] border border-slate-200 bg-white text-[12px] text-slate-700 focus:outline-none focus:border-blue-300">
                {modes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Session rows */}
          <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-400 text-[13px] font-medium">No sessions match your filters.</div>
            )}
            {filtered.map(s => {
              const theme = STATUS_THEME[s.status];
              return (
                <div key={s.id} className="flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                    style={{ background: 'linear-gradient(140deg,#2563eb,#60a5fa,#93c5fd)' }}>
                    <span className="text-white font-extrabold text-[10px]">{s.studentInitials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-slate-800 truncate">{s.studentName}</span>
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: theme.bg, color: theme.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.dot }} />
                        {s.status}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-slate-400 font-semibold mt-0.5 truncate">with {s.mentorName} · {s.topic}</div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mt-1 sm:hidden">
                      {s.mode === 'Online' ? <Video className="w-3 h-3 text-slate-400" /> : <Building2 className="w-3 h-3 text-slate-400" />}
                      {s.mode}
                      <span className="text-slate-300 mx-0.5">·</span>
                      <Clock3 className="w-3 h-3 text-slate-400" />{s.time}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-600 shrink-0">
                    {s.mode === 'Online' ? <Video className="w-3.5 h-3.5 text-slate-400" /> : <Building2 className="w-3.5 h-3.5 text-slate-400" />}
                    {s.mode}
                  </div>
                  <div className="hidden md:block text-right shrink-0 w-32">
                    <div className="text-[10.5px] font-semibold text-slate-500 flex items-center justify-end gap-1"><Clock3 className="w-3 h-3" />{s.time}</div>
                    <div className="text-[9.5px] text-slate-400">{s.date}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
