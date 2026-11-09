import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Search, Users, ChevronRight,
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

/* ── Mock fresher roster, grouped per department ── */
interface StudentRecord {
  id: string; name: string; initials: string; uid: string;
  course: string; deptCode: string; block: string;
  section: string; semester: number; batch: number;
  city: string; hostel: string; status: 'Active' | 'New';
}

const FIRST_NAMES = ['Aryan','Neha','Karan','Diya','Rohit','Sanya','Aditya','Pooja','Vikram','Ishita','Manav','Tanya','Yash','Riya','Dev','Anika','Sahil','Mira','Arjun','Kavya'];
const LAST_NAMES  = ['Sharma','Gupta','Verma','Singh','Kapoor','Mehta','Joshi','Rao','Bose','Nair','Iyer','Malhotra','Bhatia','Pillai','Tiwari','Kaur','Khan','Reddy','Chauhan','Saxena'];
const CITIES = ['Chandigarh','Ludhiana','Delhi','Jaipur','Amritsar','Mohali','Patiala','Shimla','Ambala','Panchkula'];

function genStudents(deptCode: string, block: string, count: number): StudentRecord[] {
  const out: StudentRecord[] = [];
  for (let i = 0; i < count; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 3 + 5) % LAST_NAMES.length];
    const sectionNum = 100 + (i % 6) * 1 + 1;
    out.push({
      id: `${deptCode}-${i}`,
      name: `${fn} ${ln}`,
      initials: `${fn[0]}${ln[0]}`,
      uid: `25${deptCode}${String(10000 + i).slice(-5)}`,
      course: deptCode,
      deptCode, block,
      section: `25${deptCode}-${sectionNum}`,
      semester: 1,
      batch: 2025,
      city: CITIES[i % CITIES.length],
      hostel: i % 4 === 0 ? 'Day Scholar' : `Hostel ${['A','B','C','D'][i % 4]}`,
      status: i % 7 === 0 ? 'New' : 'Active',
    });
  }
  return out;
}

const ALL_STUDENTS: StudentRecord[] = DEPARTMENT_STATS.flatMap(d =>
  genStudents(d.code, d.blocks[0], 18)
);

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export function StudentDirectoryDashboard({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const departments = ['All', ...DEPARTMENT_STATS.map(d => d.name)];
  const statuses = ['All', 'Active', 'New'];

  const deptNameByCode = Object.fromEntries(DEPARTMENT_STATS.map(d => [d.code, d.name]));

  const filtered = ALL_STUDENTS.filter(s => {
    const q = search.trim().toLowerCase();
    const deptName = deptNameByCode[s.deptCode] ?? s.deptCode;
    return (!q || s.name.toLowerCase().includes(q) || s.uid.toLowerCase().includes(q) || s.section.toLowerCase().includes(q))
      && (deptFilter === 'All' || deptName === deptFilter)
      && (statusFilter === 'All' || s.status === statusFilter);
  });

  const animTotal = useCountUp(ALL_STUDENTS.length);
  const animNew = useCountUp(ALL_STUDENTS.filter(s => s.status === 'New').length);
  const animDepts = useCountUp(DEPARTMENT_STATS.length);
  const animSections = useCountUp(DEPARTMENT_STATS.reduce((a, d) => a + d.totalSections, 0));

  return createPortal(
    <div className="fixed inset-0 z-[70] overflow-y-auto" style={{ background: 'linear-gradient(160deg,#FAF5F5 0%,#FBF7F5 40%,#FFF0F0 100%)' }}>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-red-300/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-rose-200/10 blur-[150px] pointer-events-none" />

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3a0505 0%, #7a0000 55%, #E10619 100%)' }}>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/[0.06] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="relative px-6 pt-8 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[28px] sm:text-[34px] font-extrabold text-white tracking-tight leading-tight">Fresher Directory</h1>
              <p className="text-white/45 text-[13px] font-medium mt-2 max-w-lg">Complete roster of incoming students across all departments and sections.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-[14px] bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/15 hover:border-white/30 shrink-0 mt-1">
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Freshers', value: animTotal, icon: '👥' },
              { label: 'New This Week', value: animNew, icon: '✨' },
              { label: 'Departments', value: animDepts, icon: '🏛️' },
              { label: 'Total Sections', value: animSections, icon: '📚' },
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
        <div className="rounded-[32px] border border-red-100/50 bg-white/70 backdrop-blur-md overflow-hidden shadow-[0_12px_40px_rgba(124,0,0,0.04),_0_2px_8px_rgba(124,0,0,0.02)]">
          {/* Controls */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[10px] bg-red-50 border border-red-100/60 flex items-center justify-center"><Users className="w-4 h-4 text-red-600" /></div>
              <div className="text-[15px] font-extrabold text-slate-800">Student Directory</div>
              <span className="ml-auto text-[11px] text-slate-500 font-semibold">{filtered.length} students</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, UID, or section..."
                  className="w-full pl-8 pr-3 py-2 rounded-[10px] border border-slate-200 bg-white text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-red-300"
                />
              </div>
              <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                className="px-3 py-2 rounded-[10px] border border-slate-200 bg-white text-[12px] text-slate-700 focus:outline-none focus:border-red-300">
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-[10px] border border-slate-200 bg-white text-[12px] text-slate-700 focus:outline-none focus:border-red-300">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Student rows */}
          <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-400 text-[13px] font-medium">No students match your filters.</div>
            )}
            {filtered.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                  style={{ background: 'linear-gradient(140deg,#E30613,#ff5a5a,#ff9472)' }}>
                  <span className="text-white font-extrabold text-[10px]">{s.initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-800 truncate">{s.name}</span>
                    {s.status === 'New' && (
                      <span className="text-[8.5px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">New</span>
                    )}
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-semibold mt-0.5">{s.uid} · {deptNameByCode[s.deptCode] ?? s.deptCode}</div>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <div className="text-[11px] font-bold text-slate-600">{s.section}</div>
                  <div className="text-[9.5px] text-slate-400 font-semibold">Block {s.block} · Sem {s.semester}</div>
                </div>
                <div className="hidden md:block text-right shrink-0 w-28">
                  <div className="text-[10.5px] font-semibold text-slate-500">{s.hostel}</div>
                  <div className="text-[9.5px] text-slate-400">{s.city}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
