import { useState, useEffect, useRef } from 'react';
import {
  Users, Crown, Star, Calendar, GraduationCap,
  Building, Layers, User, BarChart3, TrendingUp, Activity,
} from 'lucide-react';
import { HODAnalyticsDashboard } from './HODAnalyticsDashboard';
import { CURRENT_HOD, DEPARTMENT_STATS } from '../../data/cuAcademicData';

export function HODCentralView({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'audit':     return <FacultyAudit />;
    case 'analytics': return <HODAnalyticsDashboard />;
    default:          return <Overview />;
  }
}

const hodDeptStats = DEPARTMENT_STATS.find(d => d.code === CURRENT_HOD.departmentCode) || DEPARTMENT_STATS[0];

/* ── Animated counter ── */
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

/* ════════════════════════════════════════
   OVERVIEW — Premium HOD Dashboard
════════════════════════════════════════ */
function Overview() {
  const h = CURRENT_HOD;
  const freshers  = useCountUp(hodDeptStats.totalStudents);
  const mentors   = useCountUp(hodDeptStats.facultyAssigned + hodDeptStats.seniorMentors + (hodDeptStats.hodsAssigned || 1));
  const sessions  = useCountUp(hodDeptStats.sessionsConducted);

  const SECTIONS = [
    '25AML-101','25AML-102','25AML-103','25AML-201','25AML-202',
    '25AML-301','25AML-302','25AML-303','25AML-304',
    '25AML-401','25AML-402','25AML-403',
  ];

  return (
    <div className="space-y-6">

      {/* ── HERO BANNER ── */}
      <div className="relative rounded-[32px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #13233F 0%, #244A8A 50%, #3568E8 100%)' }}>
        {/* Orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/[0.06] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="absolute top-8 right-40 w-24 h-24 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute bottom-4 right-10 w-20 h-20 bg-[#E10619]/[0.15] rounded-full blur-2xl pointer-events-none" />
        {/* Red accent glow */}
        <div className="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(225,6,25,0.16) 0%, transparent 70%)' }} />

        <div className="relative p-7 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-[76px] h-[76px] rounded-[22px] bg-white/15 border-2 border-white/25 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <span className="text-white font-extrabold text-[26px] tracking-tight">{h.initials}</span>
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
              <h1 className="text-white text-[24px] sm:text-[27px] font-extrabold tracking-tight leading-tight">{h.name}</h1>
              <p className="text-white/55 text-[13px] font-medium mt-1">Head of Department • Artificial Intelligence & Machine Learning</p>
              <p className="text-white/30 text-[11px] mt-2 italic">"Empowering every student through academic excellence and strong mentorship."</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── DEPARTMENT INFO CARD ── */}
      <div className="relative rounded-[28px] overflow-hidden border border-white/15 p-6"
        style={{ background: 'linear-gradient(145deg, rgba(19,35,63,0.97) 0%, rgba(36,74,138,0.95) 100%)', boxShadow: '0 8px 32px rgba(19,35,63,0.15)' }}>
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="flex flex-wrap items-center gap-6 text-[13px] relative">
          {[
            { icon: Building, label: 'Department',     value: `${h.department} (${h.departmentCode})`, color: '#3568E8' },
            { icon: Layers,   label: 'Blocks Managed', value: h.blocks.join(', '),                      color: '#8B5CF6' },
            { icon: User,     label: 'Employee ID',    value: h.empId,                                  color: '#22C55E' },
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
          {SECTIONS.map(sec => (
            <span key={sec}
              className="px-2.5 py-1 rounded-[8px] text-[10px] font-bold text-white/70 border border-white/10 cursor-default transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/25"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              {sec}
            </span>
          ))}
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Users, label: 'Total Freshers', value: freshers,
            sub: `${hodDeptStats.totalSections} sections enrolled`,
            grad: 'linear-gradient(135deg, #3a0505 0%, #7a0000 55%, #E10619 100%)',
          },
          {
            icon: Crown, label: 'Active Mentors', value: mentors,
            sub: `${hodDeptStats.facultyAssigned} Faculty • ${hodDeptStats.seniorMentors} Senior • ${hodDeptStats.hodsAssigned || 1} HOD`,
            grad: 'linear-gradient(135deg, #1a0a3a 0%, #3b1f82 55%, #7c3aed 100%)',
          },
          {
            icon: Calendar, label: 'Sessions This Month', value: sessions,
            sub: '+18% vs last month',
            grad: 'linear-gradient(135deg, #001535 0%, #003b8e 55%, #3568E8 100%)',
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i}
              className="relative rounded-[24px] overflow-hidden p-6 hover:-translate-y-[3px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.20)] transition-all duration-300 cursor-default"
              style={{ background: s.grad }}>
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/[0.05] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/[0.03] rounded-full pointer-events-none" />
              <div className="relative">
                <div className="w-11 h-11 rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-[32px] font-extrabold text-white leading-none tracking-tight">
                  {s.value.toLocaleString()}
                </div>
                <div className="text-[12px] font-bold text-white/80 mt-2 leading-snug">{s.label}</div>
                <div className="text-[10px] text-white/40 font-medium mt-0.5">{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── STUDENT FEEDBACK ANALYTICS removed ── */}
    </div>
  );
}

/* ════════════════════════════════════════
   FACULTY AUDIT TAB
════════════════════════════════════════ */
const facultyData = [
  { name: 'Dr. Rajesh Kumar',   sections: '25AML-101, 102, 103', block: 'B1', assigned: '42/50', resolved: 156, stalled: 3,  sla: 3.2, rating: 4.9, sessions: 28 },
  { name: 'Prof. Anita Mehra',  sections: '25AML-201, 202',      block: 'B1', assigned: '38/45', resolved: 134, stalled: 5,  sla: 4.1, rating: 4.7, sessions: 22 },
  { name: 'Dr. Sandeep Singh',  sections: '25AML-301, 302, 303', block: 'B1', assigned: '25/30', resolved: 98,  stalled: 2,  sla: 2.8, rating: 4.8, sessions: 18 },
  { name: 'Prof. Meena Sharma', sections: '25AML-304, 401',      block: 'B1', assigned: '35/40', resolved: 112, stalled: 8,  sla: 5.3, rating: 4.2, sessions: 15 },
  { name: 'Dr. Vikram Patel',   sections: '25AML-402, 403',      block: 'B1', assigned: '28/35', resolved: 89,  stalled: 1,  sla: 3.0, rating: 4.9, sessions: 20 },
];

function FacultyAudit() {
  return (
    <div className="space-y-5">
      {/* Section header banner */}
      <div className="relative rounded-[28px] overflow-hidden p-5"
        style={{ background: 'linear-gradient(135deg, #13233F 0%, #244A8A 60%, #3568E8 100%)' }}>
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="relative">
          <h2 className="text-[18px] font-extrabold text-white tracking-tight">Faculty Activity Report</h2>
          <p className="text-[12px] text-white/45 font-medium mt-0.5">{CURRENT_HOD.department}</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#F0F0F0] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, #F8F9FB 0%, #F0F2F5 100%)' }}>
                {['Faculty','Assigned Sections','Block','Students','Resolved','Stalled','Avg SLA','Sessions','Rating'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#999] uppercase tracking-wider px-4 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facultyData.map((f, i) => {
                const sc = f.sla < 3.5 ? '#22C55E' : f.sla <= 5 ? '#d97706' : '#E10619';
                return (
                  <tr key={i} className="border-t border-[#F5F5F5] hover:bg-blue-50/20 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-[8px] flex items-center justify-center text-white text-[9px] font-extrabold shrink-0"
                          style={{ background: 'linear-gradient(135deg, #13233F, #3568E8)' }}>
                          {f.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <span className="text-[12px] font-semibold text-[#1A1A1A]">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3568E8]/8 text-[#3568E8]">{f.sections}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-[#444] font-medium">{f.block}</td>
                    <td className="px-4 py-3.5 text-[12px] text-[#666]">{f.assigned}</td>
                    <td className="px-4 py-3.5 text-[12px] font-bold text-[#22C55E]">{f.resolved}</td>
                    <td className="px-4 py-3.5 text-[12px] font-bold text-[#E10619]">{f.stalled}</td>
                    <td className="px-4 py-3.5 text-[12px] font-bold" style={{ color: sc }}>{f.sla} min</td>
                    <td className="px-4 py-3.5 text-[12px] text-[#444]">{f.sessions}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[12px] font-bold">{f.rating}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
