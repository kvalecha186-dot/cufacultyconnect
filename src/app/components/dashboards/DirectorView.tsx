import { useState, useEffect, useRef } from 'react';
import {
  Globe, Building, TrendingUp, Activity, Award,
  Users, Star, Crown, Calendar,
  ArrowUp, GraduationCap, Layers, Trophy, Clock, BarChart3,
} from 'lucide-react';
import { CURRENT_DIRECTOR, DEPARTMENT_STATS, CU_BLOCKS } from '../../data/cuAcademicData';
import { MentorAnalyticsDashboard } from './MentorAnalyticsDashboard';
import { StudentDirectoryDashboard } from './StudentDirectoryDashboard';
import { SessionDirectoryDashboard } from './SessionDirectoryDashboard';

export function DirectorView({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'welfare':     return <StudentWelfare />;
    case 'recognition': return <TopPerformers />;
    case 'compliance':  return <ComplianceAudit />;
    default:            return <Overview />;
  }
}

/* ── Totals ── */
const totals = {
  departments:    DEPARTMENT_STATS.length,
  sections:       DEPARTMENT_STATS.reduce((a, d) => a + d.totalSections, 0),
  students:       DEPARTMENT_STATS.reduce((a, d) => a + d.totalStudents, 0),
  faculty:        DEPARTMENT_STATS.reduce((a, d) => a + d.facultyAssigned, 0),
  seniors:        DEPARTMENT_STATS.reduce((a, d) => a + d.seniorMentors, 0),
  hods:           DEPARTMENT_STATS.reduce((a, d) => a + d.hodsAssigned, 0),
  sessions:       DEPARTMENT_STATS.reduce((a, d) => a + d.sessionsConducted, 0),
  doubtsResolved: DEPARTMENT_STATS.reduce((a, d) => a + d.doubtsResolved, 0),
};


/* ── Animated count-up hook ── */
function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

/* ── Shared premium section header ── */
function SectionHero({ gradient, icon: Icon, badge, title, subtitle }: {
  gradient: string; icon: any; badge: string; title: string; subtitle: string;
}) {
  return (
    <div className="relative rounded-[28px] overflow-hidden p-6 mb-1"
      style={{ background: gradient }}>
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/[0.05] rounded-full pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/[0.04] rounded-full pointer-events-none" />
      <div className="absolute bottom-4 right-10 w-20 h-20 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white/60 mb-3"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          <Icon className="w-3 h-3" />{badge}
        </div>
        <h2 className="text-[22px] font-extrabold text-white tracking-tight">{title}</h2>
        <p className="text-[13px] text-white/45 font-medium mt-1">{subtitle}</p>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════
   OVERVIEW
════════════════════════════════════════ */
function Overview() {
  const d = CURRENT_DIRECTOR;
  const animStudents  = useCountUp(totals.students);
  const animMentors   = useCountUp(totals.faculty + totals.seniors + totals.hods);
  const animSessions  = useCountUp(totals.sessions);
  const [showMentorAnalytics, setShowMentorAnalytics] = useState(false);
  const [showStudentDirectory, setShowStudentDirectory] = useState(false);
  const [showSessionDirectory, setShowSessionDirectory] = useState(false);

  return (
    <div className="space-y-6">
      {showMentorAnalytics && (
        <MentorAnalyticsDashboard onClose={() => setShowMentorAnalytics(false)} />
      )}
      {showStudentDirectory && (
        <StudentDirectoryDashboard onClose={() => setShowStudentDirectory(false)} />
      )}
      {showSessionDirectory && (
        <SessionDirectoryDashboard onClose={() => setShowSessionDirectory(false)} />
      )}

      {/* ── HERO BANNER ── */}
      <div className="relative rounded-[32px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #13233F 0%, #244A8A 50%, #3568E8 100%)' }}>
        <div className="absolute -bottom-16 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(225,6,25,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/[0.06] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="absolute top-8 right-52 w-28 h-28 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute bottom-4 right-10 w-20 h-20 bg-[#E10619]/[0.15] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-white/[0.03] rounded-full pointer-events-none" />
        <div className="relative p-7 sm:p-9">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-[80px] h-[80px] rounded-[24px] bg-white/15 border-2 border-white/25 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <span className="text-white font-extrabold text-[28px] tracking-tight">{d.initials}</span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#22C55E] rounded-full border-[2.5px] border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/70 border border-white/15"
                  style={{ background: 'rgba(255,255,255,0.10)' }}>
                  🏛 University Director
                </span>
              </div>
              <h1 className="text-white text-[26px] sm:text-[30px] font-extrabold tracking-tight leading-tight">{d.name}</h1>
              <p className="text-white/55 text-[13px] font-medium mt-1">Director • Chandigarh University</p>
              <p className="text-white/30 text-[11px] mt-2 italic">"Driving academic excellence and institutional innovation across every campus."</p>
            </div>
          </div>
        </div>
      </div>


      {/* ── UNIVERSITY INFO CARD ── */}
      <div className="relative rounded-[28px] overflow-hidden border border-white/15 p-6"
        style={{ background: 'linear-gradient(145deg, rgba(19,35,63,0.97) 0%, rgba(36,74,138,0.95) 100%)', boxShadow: '0 8px 32px rgba(19,35,63,0.18)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="flex flex-wrap items-center gap-6 text-[13px] relative">
          {[
            { icon: Building, label: 'Departments',    value: String(totals.departments),           color: '#3568E8' },
            { icon: Layers,   label: 'Total Sections', value: String(totals.sections),              color: '#8B5CF6' },
            { icon: Users,    label: 'Total Freshers', value: totals.students.toLocaleString(),     color: '#E10619' },
            { icon: Crown,    label: 'Active Faculty', value: String(totals.faculty),               color: '#22C55E' },
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
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider mr-1">Academic Blocks:</span>
          {Object.entries(CU_BLOCKS).map(([code, block]) => (
            <span key={code}
              className="px-2.5 py-1 rounded-[8px] text-[10px] font-bold text-white/70 border border-white/10 cursor-default transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/25"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              {code} ({block.departments[0]})
            </span>
          ))}
        </div>
      </div>


      {/* ── EXECUTIVE KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Users,        label: 'Total Freshers',  value: animStudents, sub: `${totals.sections} sections`,                        grad: 'linear-gradient(135deg, #3a0505 0%, #7a0000 55%, #E10619 100%)', onClick: () => setShowStudentDirectory(true) },
          { icon: Crown,        label: 'Total Mentors',   value: animMentors,  sub: `${totals.faculty} Faculty • ${totals.seniors} Senior • ${totals.hods} HOD`, grad: 'linear-gradient(135deg, #1a0a3a 0%, #3b1f82 55%, #7c3aed 100%)', onClick: () => setShowMentorAnalytics(true) },
          { icon: Calendar,     label: 'Total Sessions',  value: animSessions, sub: '+22% vs last month',                                  grad: 'linear-gradient(135deg, #001535 0%, #003b8e 55%, #3568E8 100%)', onClick: () => setShowSessionDirectory(true) },
        ].map((s, i) => {
          const Icon = s.icon;
          const hasClick = !!(s as any).onClick;
          return (
            <div key={i}
              onClick={(s as any).onClick}
              className={`relative rounded-[24px] overflow-hidden p-6 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition-all duration-300 ${hasClick ? 'cursor-pointer group' : 'cursor-default'}`}
              style={{ background: s.grad }}>
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/[0.05] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/[0.03] rounded-full pointer-events-none" />
              {hasClick && <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[24px]"/>}
              <div className="relative">
                <div className="w-11 h-11 rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-[30px] font-extrabold text-white leading-none tracking-tight">
                  {s.value.toLocaleString()}
                </div>
                <div className="text-[12px] font-bold text-white/80 mt-2 leading-snug">{s.label}</div>
                <div className="text-[10px] text-white/40 font-medium mt-0.5">{s.sub}</div>
                {hasClick && <div className="text-[9px] text-white/30 font-bold uppercase tracking-wider mt-2">Click to explore →</div>}
              </div>
            </div>
          );
        })}
      </div>



    </div>
  );
}


/* ════════════════════════════════════════
   STUDENT WELFARE
════════════════════════════════════════ */
function StudentWelfare() {
  const blockWelfare = [
    { block: 'B1', label: 'CSE/AI/ML Block',    students: 3600, grievances: 34, satisfaction: 91, concerns: ['Lab availability', 'AC maintenance'] },
    { block: 'B2', label: 'IT/ECE/Mech Block',  students: 2600, grievances: 28, satisfaction: 88, concerns: ['Parking', 'Canteen hours'] },
    { block: 'B3', label: 'AI/Cyber/IoT Block', students: 1050, grievances: 15, satisfaction: 89, concerns: ['Network speed', 'Lab software'] },
    { block: 'C1', label: 'BCA/MCA Block',       students: 800,  grievances: 18, satisfaction: 85, concerns: ['Classroom projectors', 'Washroom'] },
    { block: 'D1', label: 'BBA Block',           students: 500,  grievances: 8,  satisfaction: 92, concerns: ['Library hours'] },
    { block: 'D2', label: 'MBA Block',           students: 600,  grievances: 6,  satisfaction: 93, concerns: ['Conference room booking'] },
    { block: 'A1', label: 'Pharmacy Block',      students: 400,  grievances: 12, satisfaction: 87, concerns: ['Lab chemicals supply', 'First aid'] },
  ];

  return (
    <div className="space-y-6">
      <SectionHero
        gradient="linear-gradient(135deg, #13233F 0%, #244A8A 60%, #3568E8 100%)"
        icon={Users}
        badge="Student Welfare"
        title="Block-wise Welfare Report"
        subtitle="Student satisfaction, grievances and top concerns per academic block"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blockWelfare.map((b, i) => {
          const sc   = b.satisfaction >= 90 ? '#22C55E' : b.satisfaction >= 85 ? '#d97706' : '#E10619';
          const scBg = b.satisfaction >= 90 ? 'rgba(34,197,94,0.14)' : b.satisfaction >= 85 ? 'rgba(217,119,6,0.14)' : 'rgba(225,6,25,0.14)';
          const grad = b.satisfaction >= 90
            ? 'linear-gradient(135deg, #021a0a 0%, #065221 60%, #16a34a 100%)'
            : b.satisfaction >= 85
            ? 'linear-gradient(135deg, #1a100a 0%, #6b3500 60%, #d97706 100%)'
            : 'linear-gradient(135deg, #3a0505 0%, #7a0000 60%, #E10619 100%)';
          return (
            <div key={i}
              className="relative rounded-[24px] overflow-hidden border border-white/10 p-5 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition-all duration-300 cursor-default"
              style={{ background: grad }}>
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/[0.05] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/[0.03] rounded-full pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[11px] bg-white/15 border border-white/20 flex items-center justify-center text-white text-[11px] font-extrabold">
                      {b.block}
                    </div>
                    <div>
                      <div className="text-[14px] font-extrabold text-white leading-tight">Block {b.block}</div>
                      <div className="text-[10px] text-white/45 font-medium">{b.label}</div>
                    </div>
                  </div>
                  <div className="text-[18px] font-extrabold px-3 py-1.5 rounded-[10px]"
                    style={{ color: sc, background: scBg }}>
                    {b.satisfaction}%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-3 rounded-[12px] text-center border border-white/10" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="text-[16px] font-extrabold text-white">{b.students.toLocaleString()}</div>
                    <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Students</div>
                  </div>
                  <div className="p-3 rounded-[12px] text-center border border-amber-300/20" style={{ background: 'rgba(251,191,36,0.10)' }}>
                    <div className="text-[16px] font-extrabold text-amber-300">{b.grievances}</div>
                    <div className="text-[9px] text-amber-300/60 font-bold uppercase tracking-wider mt-0.5">Grievances</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-white/40 font-medium mb-1.5">
                    <span>Satisfaction</span><span style={{ color: sc }}>{b.satisfaction}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${b.satisfaction}%`, background: `linear-gradient(90deg, ${sc}, ${sc}bb)` }} />
                  </div>
                </div>
                <div className="text-[10px] text-white/40 leading-relaxed">
                  <span className="font-bold text-white/60">Top concerns: </span>{b.concerns.join(', ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

