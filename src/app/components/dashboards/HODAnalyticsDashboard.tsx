import { useState } from 'react';
import { 
  TrendingUp, Star, CheckCircle, Zap, Clock, Award, 
  ChevronRight, AlertCircle, Library, BookOpen, Users, Layers, Calendar
} from 'lucide-react';
import { CURRENT_HOD, DEPARTMENT_STATS } from '../../data/cuAcademicData';

// Data specifically matching HOD's department (AML)
const amlMonthlyData = [
  { month: 'Jan', submitted: 160, resolved: 140, avgTime: 4.8 },
  { month: 'Feb', submitted: 230, resolved: 210, avgTime: 4.2 },
  { month: 'Mar', submitted: 350, resolved: 320, avgTime: 3.8 },
  { month: 'Apr', submitted: 300, resolved: 280, avgTime: 3.5 },
  { month: 'May', submitted: 480, resolved: 450, avgTime: 3.2 },
  { month: 'Jun', submitted: 620, resolved: 589, avgTime: 3.0 }
];

const amlSectionStats = [
  { section: '25AML-301', freshers: 42, doubts: 142, resolved: 136, attendance: 88, rating: 4.8, status: 'On Track' },
  { section: '25AML-302', freshers: 38, doubts: 98, resolved: 90, attendance: 85, rating: 4.6, status: 'On Track' },
  { section: '25AML-303', freshers: 25, doubts: 120, resolved: 104, attendance: 82, rating: 4.3, status: 'Needs Support' },
  { section: '25AML-304', freshers: 35, doubts: 88, resolved: 85, attendance: 91, rating: 4.9, status: 'On Track' }
];

const amlBottlenecks = [
  { topic: 'Pointer Confusion in C', count: 340, percent: 94 },
  { topic: 'Array Indexing & Off-by-one Errors', count: 290, percent: 85 },
  { topic: 'Nested Loops & Conditionals', count: 220, percent: 72 },
  { topic: 'Variable Scope & Indentation in Python', count: 185, percent: 64 },
  { topic: 'Scanf & Buffer Clears in C', count: 140, percent: 48 }
];

const slaCompliance = [
  { label: 'Under 3 mins (Optimal)', percent: 74, color: 'bg-green-500' },
  { label: '3 - 5 mins (Acceptable)', percent: 22, color: 'bg-amber-500' },
  { label: 'Over 5 mins (Breached)', percent: 4, color: 'bg-[#E30613]' }
];

export function HODAnalyticsDashboard() {
  const [activeSection, setActiveSection] = useState('All');
  const h = CURRENT_HOD || { departmentCode: 'AML', department: 'Artificial Intelligence & Machine Learning' };
  const hodDeptStats = DEPARTMENT_STATS.find(d => d.code === h.departmentCode) || DEPARTMENT_STATS[0];

  // Robust calculations for SVG chart points
  const pointsSubmitted = amlMonthlyData && amlMonthlyData.length > 0
    ? amlMonthlyData.map((d, i) => {
        const x = (i / (amlMonthlyData.length - 1 || 1)) * 500;
        const y = 140 - ((d.submitted || 0) / 700) * 110;
        return `${x},${y}`;
      }).join(' ')
    : '';

  const pointsResolved = amlMonthlyData && amlMonthlyData.length > 0
    ? amlMonthlyData.map((d, i) => {
        const x = (i / (amlMonthlyData.length - 1 || 1)) * 500;
        const y = 140 - ((d.resolved || 0) / 700) * 110;
        return `${x},${y}`;
      }).join(' ')
    : '';

  return (
    <div className="space-y-6 animate-fadeSlideIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-extrabold text-[#1A1A1A] flex items-center gap-2">
              <Library className="w-5 h-5 text-[#E30613]" /> 
              Department of {h.department || 'AI & ML'} (AML)
            </h2>
            <p className="text-[12px] text-[#666] mt-0.5">HOD command analytics, SLA monitoring, and syllabus performance benchmarks</p>
          </div>
          <div className="flex bg-[#F5F5F5] rounded-xl p-0.5 border border-[#E5E5E5] self-start md:self-auto">
            <span className="px-3.5 py-1.5 bg-white text-[#E30613] text-[11px] font-extrabold rounded-lg shadow-sm border border-[#E5E5E5]">
              Vite Core Analytics
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Block */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Department Freshers', value: (hodDeptStats?.totalStudents || 0).toLocaleString(), sub: '12 Active Sections', icon: Users, color: 'bg-[#E30613]/10 text-[#E30613]' },
          { label: 'Doubts Resolved', value: '1,989', sub: '95% Resolution Rate', icon: CheckCircle, color: 'bg-green-500/10 text-green-500' },
          { label: 'SLA Avg Response', value: '3.2 mins', sub: 'Compliance index 96%', icon: Clock, color: 'bg-blue-500/10 text-blue-500' },
          { label: 'Department Rating', value: '4.6 / 5.0', sub: 'Based on 856 reviews', icon: Star, color: 'bg-amber-500/10 text-amber-500' }
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E5E5] p-5 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-[#999] font-bold uppercase tracking-wider">{k.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.color}`}><Icon className="w-4 h-4" /></div>
              </div>
              <div className="text-[26px] font-extrabold text-[#1A1A1A] leading-none">{k.value}</div>
              <div className="text-[10px] text-[#666] font-bold mt-2">{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Graphs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Resolution Trends (Dual-Line SVG Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#E30613]" /> Doubts Resolution Trend
              </h3>
              <p className="text-[10px] text-[#999] mt-0.5">Submitted vs Resolved queries over time</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#E30613]" /> Submitted</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-green-500" /> Resolved</span>
            </div>
          </div>
          <div className="h-40 w-full relative pt-4 px-2">
            <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#F5F5F5" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#F5F5F5" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#F5F5F5" strokeWidth="1" />

              {/* Submitted Line */}
              {pointsSubmitted && (
                <polyline 
                  fill="none" stroke="#E30613" strokeWidth="2" strokeDasharray="4 2"
                  points={pointsSubmitted} 
                />
              )}
              {/* Resolved Line */}
              {pointsResolved && (
                <polyline 
                  fill="none" stroke="#22C55E" strokeWidth="2.5" 
                  points={pointsResolved} 
                />
              )}

              {/* Submitted dots */}
              {amlMonthlyData && amlMonthlyData.map((d, i) => {
                const x = (i / (amlMonthlyData.length - 1 || 1)) * 500;
                const y = 140 - ((d.submitted || 0) / 700) * 110;
                return (
                  <circle key={`s-${i}`} cx={x} cy={y} r="3.5" fill="#E30613" />
                );
              })}
              {/* Resolved dots */}
              {amlMonthlyData && amlMonthlyData.map((d, i) => {
                const x = (i / (amlMonthlyData.length - 1 || 1)) * 500;
                const y = 140 - ((d.resolved || 0) / 700) * 110;
                return (
                  <circle key={`r-${i}`} cx={x} cy={y} r="3.5" fill="#22C55E" />
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between mt-3 px-1 text-[10px] text-[#999] font-bold">
            {amlMonthlyData && amlMonthlyData.map(d => <span key={d.month}>{d.month}</span>)}
          </div>
        </div>

        {/* 2. Syllabus Bottlenecks (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" /> Syllabus Bottlenecks in AML
              </h3>
              <p className="text-[10px] text-[#999] mt-0.5">Top topics generating freshman academic queries</p>
            </div>
          </div>
          <div className="space-y-3">
            {amlBottlenecks && amlBottlenecks.map((b, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#1A1A1A]">
                  <span className="truncate max-w-[280px]">{b.topic}</span>
                  <span className="text-[#666]">{b.count} doubts ({b.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#E30613] to-[#FF3B47]" 
                    style={{ width: `${b.percent}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Section Wise Performance Index */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Section Performance Index (AML)
              </h3>
              <p className="text-[10px] text-[#999] mt-0.5">Detailed breakdown of mentee activity by section</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F5F5] border-b border-[#E5E5E5]">
                  {['Section', 'Mentees', 'Queries Submitted', 'Resolved Rate', 'Avg Attendance', 'Mentor Rating', 'Status'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-[#999] uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {amlSectionStats && amlSectionStats.map((s, i) => {
                  const pct = s.doubts > 0 ? Math.round((s.resolved / s.doubts) * 100) : 0;
                  const isSupport = s.status === 'Needs Support';
                  return (
                    <tr key={i} className="hover:bg-[#F5F5F5]/30">
                      <td className="px-4 py-3 text-[12px] font-extrabold text-[#E30613]">{s.section}</td>
                      <td className="px-4 py-3 text-[12px] text-[#444]">{s.freshers}</td>
                      <td className="px-4 py-3 text-[12px] text-[#444]">{s.doubts}</td>
                      <td className="px-4 py-3 text-[12px] font-bold text-[#22C55E]">{pct}%</td>
                      <td className="px-4 py-3 text-[12px] font-bold text-[#1A1A1A]">{s.attendance}%</td>
                      <td className="px-4 py-3 text-[12px] font-semibold">
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {s.rating}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isSupport ? 'bg-amber-50 text-amber-600' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. SLA Compliance Distribution */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <h3 className="text-[13px] font-bold text-[#1A1A1A] mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-500" /> Response SLA compliance Distribution
          </h3>
          <p className="text-[10px] text-[#999] mb-4">SLA target metrics for department mentors response times</p>
          <div className="space-y-4">
            <div className="w-full h-4 bg-[#F5F5F5] rounded-full overflow-hidden flex">
              {slaCompliance && slaCompliance.map((s, i) => (
                <div key={i} className={`h-full ${s.color || ''}`} style={{ width: `${s.percent || 0}%` }} title={`${s.label || ''}: ${s.percent || 0}%`} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {slaCompliance && slaCompliance.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#666]">
                    <span className={`w-2 h-2 rounded-full ${s.color || ''}`} />
                    {s.label ? s.label.split(' ')[0] : ''}
                  </div>
                  <div className="text-[14px] font-extrabold text-[#1A1A1A] mt-1">{s.percent || 0}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Department Recommendations */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-[#1A1A1A] mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#E30613]" /> HOD Actions & Recommendations
            </h3>
            <div className="space-y-2 text-[12px] text-[#444] leading-relaxed">
              <div className="p-3 bg-[#E30613]/5 border border-[#E30613]/10 rounded-xl">
                <strong>Schedule Remedial Sessions:</strong> <strong>Pointer Confusion in C</strong> is responsible for {amlBottlenecks?.[0]?.percent || 0}% of first-semester doubts. Suggest scheduling a department-wide workshop next week.
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200/50 rounded-xl">
                <strong>Academic Support Needed:</strong> Section <strong>25AML-303</strong> requires active support. Attendance averages are low (82%) with 120 unresolved doubts. Assigning Senior Buddy Rohanpreet Singh to support.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
