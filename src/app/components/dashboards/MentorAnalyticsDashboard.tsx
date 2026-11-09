import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Search, ChevronDown, ChevronUp, Star,
  Users, GraduationCap, Calendar, CheckCircle2,
  TrendingUp, Award, Clock, BarChart3, Activity,
  ArrowUp, BookOpen, Crown, Building, Trophy,
  Filter, SortAsc, ChevronRight,
} from 'lucide-react';
import { DEPARTMENT_STATS } from '../../data/cuAcademicData';

/* ──────────────────────────────────────────
   MENTOR DATA
────────────────────────────────────────── */
export interface MentorRecord {
  id: string; name: string; initials: string;
  type: 'Faculty' | 'Senior' | 'HOD';
  department: string; deptCode: string; block: string;
  empId: string; designation: string;
  studentsAssigned: number; activeStudents: number;
  sessionsConducted: number; avgRating: number;
  doubtsResolved: number; resolutionRate: number;
  lastActive: string; status: 'Active' | 'On Leave' | 'Inactive';
  experience: string; joinedDate: string;
  monthlyActivity: number[]; satisfactionTrend: number[];
  recentActivity: string[]; avgResponseTime: string; avgMonthlySessions: number;
}

const MENTOR_DATA: MentorRecord[] = [
  { id:'f1',name:'Dr. Sandeep Singh',initials:'SS',type:'Faculty',department:'CSE (AI & ML)',deptCode:'AML',block:'B1',empId:'CU-FAC-08421',designation:'Associate Professor',studentsAssigned:25,activeStudents:22,sessionsConducted:48,avgRating:4.8,doubtsResolved:142,resolutionRate:96,lastActive:'2h ago',status:'Active',experience:'8 years',joinedDate:'March 2018',avgResponseTime:'< 2 hrs',avgMonthlySessions:9,monthlyActivity:[7,8,9,6,10,11,9,10,12,10,11,13],satisfactionTrend:[4.5,4.6,4.7,4.6,4.8,4.8,4.9,4.8],recentActivity:['Conducted session with 25AML-301 batch','Resolved 3 academic queries','Received 5-star feedback from Aryan Sharma','Added follow-up notes for Neha Gupta'] },
  { id:'f2',name:'Dr. Priya Mehta',initials:'PM',type:'Faculty',department:'CSE (Core)',deptCode:'BCS',block:'B1',empId:'CU-FAC-07312',designation:'Assistant Professor',studentsAssigned:30,activeStudents:27,sessionsConducted:54,avgRating:4.7,doubtsResolved:165,resolutionRate:94,lastActive:'1h ago',status:'Active',experience:'6 years',joinedDate:'July 2019',avgResponseTime:'< 3 hrs',avgMonthlySessions:10,monthlyActivity:[8,9,10,8,11,12,10,11,13,11,12,14],satisfactionTrend:[4.4,4.5,4.6,4.5,4.7,4.7,4.8,4.7],recentActivity:['Uploaded new resource for 25BCS-201','Completed monthly review meeting','Resolved lab assignment issue','Acknowledged 4 new mentee requests'] },
  { id:'f3',name:'Dr. Amit Sharma',initials:'AS',type:'Faculty',department:'Information Technology',deptCode:'BIT',block:'B2',empId:'CU-FAC-06201',designation:'Professor',studentsAssigned:28,activeStudents:25,sessionsConducted:42,avgRating:4.6,doubtsResolved:130,resolutionRate:92,lastActive:'5h ago',status:'Active',experience:'11 years',joinedDate:'Jan 2014',avgResponseTime:'< 4 hrs',avgMonthlySessions:8,monthlyActivity:[6,7,8,6,9,10,8,9,11,9,10,12],satisfactionTrend:[4.3,4.4,4.5,4.4,4.6,4.6,4.7,4.6],recentActivity:['Hosted webinar on Cloud Computing','Resolved project submission queries','Provided academic counseling to 3 students','Submitted mentor report for Q2'] },
  { id:'f4',name:'Dr. Kavita Rao',initials:'KR',type:'Faculty',department:'BCA',deptCode:'BCA',block:'C1',empId:'CU-FAC-05990',designation:'Associate Professor',studentsAssigned:20,activeStudents:18,sessionsConducted:36,avgRating:4.5,doubtsResolved:110,resolutionRate:90,lastActive:'1d ago',status:'Active',experience:'9 years',joinedDate:'Aug 2016',avgResponseTime:'< 5 hrs',avgMonthlySessions:7,monthlyActivity:[5,6,7,5,8,9,7,8,10,8,9,11],satisfactionTrend:[4.2,4.3,4.4,4.3,4.5,4.5,4.6,4.5],recentActivity:['Conducted orientation session for new batch','Resolved exam-related queries','Submitted mentee progress report','Added learning resources to portal'] },
  { id:'f5',name:'Dr. Rajan Verma',initials:'RV',type:'Faculty',department:'MBA',deptCode:'MBA',block:'D2',empId:'CU-FAC-04801',designation:'Professor',studentsAssigned:22,activeStudents:20,sessionsConducted:38,avgRating:4.9,doubtsResolved:155,resolutionRate:98,lastActive:'30m ago',status:'Active',experience:'14 years',joinedDate:'June 2011',avgResponseTime:'< 1 hr',avgMonthlySessions:11,monthlyActivity:[9,10,11,9,12,13,11,12,14,12,13,15],satisfactionTrend:[4.6,4.7,4.8,4.7,4.9,4.9,5.0,4.9],recentActivity:['Recognized as top mentor Q1 2025','Conducted group career counseling','Resolved internship-related doubts','Published mentorship best-practices guide'] },
  { id:'f6',name:'Dr. Nisha Kapoor',initials:'NK',type:'Faculty',department:'Pharmacy',deptCode:'BPH',block:'A1',empId:'CU-FAC-03512',designation:'Assistant Professor',studentsAssigned:18,activeStudents:15,sessionsConducted:30,avgRating:4.4,doubtsResolved:98,resolutionRate:88,lastActive:'3d ago',status:'On Leave',experience:'5 years',joinedDate:'Jan 2020',avgResponseTime:'< 6 hrs',avgMonthlySessions:6,monthlyActivity:[4,5,6,4,7,8,6,7,9,0,0,0],satisfactionTrend:[4.1,4.2,4.3,4.2,4.4,4.4,4.5,4.4],recentActivity:['Last session: Pharmacy lab orientation','Left follow-up notes before leave','Delegated queries to Dr. Rao'] },
  { id:'f7',name:'Dr. Suresh Bhatia',initials:'SB',type:'Faculty',department:'Electronics & Communication',deptCode:'BEC',block:'B2',empId:'CU-FAC-02887',designation:'Professor',studentsAssigned:26,activeStudents:23,sessionsConducted:44,avgRating:4.6,doubtsResolved:128,resolutionRate:91,lastActive:'4h ago',status:'Active',experience:'12 years',joinedDate:'Mar 2013',avgResponseTime:'< 3 hrs',avgMonthlySessions:9,monthlyActivity:[7,8,9,7,10,11,9,10,12,10,11,13],satisfactionTrend:[4.3,4.4,4.5,4.4,4.6,4.6,4.7,4.6],recentActivity:['Completed circuit design workshop','Resolved VLSI project queries','Submitted Q2 mentor report','Guided 2 students on internship applications'] },
  { id:'f8',name:'Dr. Anita Joshi',initials:'AJ',type:'Faculty',department:'BBA',deptCode:'BBA',block:'D1',empId:'CU-FAC-02201',designation:'Associate Professor',studentsAssigned:24,activeStudents:21,sessionsConducted:40,avgRating:4.7,doubtsResolved:118,resolutionRate:93,lastActive:'2h ago',status:'Active',experience:'7 years',joinedDate:'Aug 2018',avgResponseTime:'< 2 hrs',avgMonthlySessions:8,monthlyActivity:[6,7,8,6,9,10,8,9,11,9,10,12],satisfactionTrend:[4.4,4.5,4.6,4.5,4.7,4.7,4.8,4.7],recentActivity:['Hosted leadership skills workshop','Resolved placement-related queries','Submitted mentee progress report','Organized group study for BBA finals'] },
  { id:'s1',name:'Ananya Kapoor',initials:'AK',type:'Senior',department:'CSE (AI & ML)',deptCode:'AML',block:'B1',empId:'23AML12045',designation:'Senior Peer Mentor (Sem 5)',studentsAssigned:15,activeStudents:14,sessionsConducted:28,avgRating:4.7,doubtsResolved:84,resolutionRate:95,lastActive:'1h ago',status:'Active',experience:'1.5 years',joinedDate:'June 2025',avgResponseTime:'< 2 hrs',avgMonthlySessions:7,monthlyActivity:[5,6,7,5,8,8,7,8,9,8,9,10],satisfactionTrend:[4.4,4.5,4.6,4.5,4.7,4.7,4.8,4.7],recentActivity:['Organized group study for 25AML-101','Helped 2 freshers with hostel issues','Received 5-star rating from Deepa Iyer','Conducted doubt session on Python basics'] },
  { id:'s2',name:'Rohan Malhotra',initials:'RM',type:'Senior',department:'CSE (Core)',deptCode:'BCS',block:'B1',empId:'23BCS14032',designation:'Senior Peer Mentor (Sem 5)',studentsAssigned:18,activeStudents:16,sessionsConducted:32,avgRating:4.6,doubtsResolved:92,resolutionRate:93,lastActive:'3h ago',status:'Active',experience:'1 year',joinedDate:'Aug 2025',avgResponseTime:'< 3 hrs',avgMonthlySessions:8,monthlyActivity:[6,7,8,6,9,9,8,9,10,9,10,11],satisfactionTrend:[4.3,4.4,4.5,4.4,4.6,4.6,4.7,4.6],recentActivity:['Conducted campus tour for 25BCS-201','Resolved attendance query for 3 students','Shared academic resources on portal','Completed DL points activity'] },
  { id:'s3',name:'Preethi Nair',initials:'PN',type:'Senior',department:'Information Technology',deptCode:'BIT',block:'B2',empId:'23BIT11023',designation:'Senior Peer Mentor (Sem 5)',studentsAssigned:14,activeStudents:12,sessionsConducted:24,avgRating:4.5,doubtsResolved:72,resolutionRate:91,lastActive:'6h ago',status:'Active',experience:'1 year',joinedDate:'Aug 2025',avgResponseTime:'< 4 hrs',avgMonthlySessions:6,monthlyActivity:[4,5,6,4,7,7,6,7,8,7,8,9],satisfactionTrend:[4.2,4.3,4.4,4.3,4.5,4.5,4.6,4.5],recentActivity:['Hosted intro session for IT freshers','Answered 8 queries this week','Shared notes for Data Structures','Earned Gold tier reward badge'] },
  { id:'s4',name:'Vikram Bose',initials:'VB',type:'Senior',department:'BCA',deptCode:'BCA',block:'C1',empId:'23BCA09014',designation:'Senior Peer Mentor (Sem 5)',studentsAssigned:12,activeStudents:10,sessionsConducted:20,avgRating:4.3,doubtsResolved:60,resolutionRate:88,lastActive:'2d ago',status:'Active',experience:'8 months',joinedDate:'Oct 2025',avgResponseTime:'< 6 hrs',avgMonthlySessions:5,monthlyActivity:[3,4,5,3,6,6,5,6,7,6,7,8],satisfactionTrend:[4.0,4.1,4.2,4.1,4.3,4.3,4.4,4.3],recentActivity:['Resolved registration portal issue','Conducted BCA orientation session','Submitted weekly mentorship log'] },
  { id:'s5',name:'Megha Pillai',initials:'MP',type:'Senior',department:'CSE (AI & ML)',deptCode:'AML',block:'B1',empId:'23AML13067',designation:'Senior Peer Mentor (Sem 5)',studentsAssigned:16,activeStudents:15,sessionsConducted:30,avgRating:4.8,doubtsResolved:88,resolutionRate:96,lastActive:'45m ago',status:'Active',experience:'1.5 years',joinedDate:'June 2025',avgResponseTime:'< 1 hr',avgMonthlySessions:8,monthlyActivity:[6,7,8,6,9,9,8,9,10,9,10,11],satisfactionTrend:[4.5,4.6,4.7,4.6,4.8,4.8,4.9,4.8],recentActivity:['Top mentor of the week','Organized group career counseling','Received 5-star feedback ×3 this week','Completed 30 mentorship sessions milestone'] },
  { id:'s6',name:'Karan Joshi',initials:'KJ',type:'Senior',department:'CSE (Core)',deptCode:'BCS',block:'B1',empId:'23BCS15088',designation:'Senior Peer Mentor (Sem 5)',studentsAssigned:13,activeStudents:11,sessionsConducted:22,avgRating:4.4,doubtsResolved:66,resolutionRate:89,lastActive:'1d ago',status:'Inactive',experience:'8 months',joinedDate:'Oct 2025',avgResponseTime:'< 8 hrs',avgMonthlySessions:4,monthlyActivity:[3,4,5,3,6,5,4,5,6,2,1,0],satisfactionTrend:[4.1,4.2,4.3,4.2,4.4,4.3,4.2,4.1],recentActivity:['Last active: 25BCS session 3 weeks ago','Missed 2 scheduled sessions','Flagged for low engagement'] },
  { id:'s7',name:'Divya Menon',initials:'DM',type:'Senior',department:'MBA',deptCode:'MBA',block:'D2',empId:'23MBA10054',designation:'Senior Peer Mentor (Sem 3)',studentsAssigned:17,activeStudents:15,sessionsConducted:26,avgRating:4.6,doubtsResolved:78,resolutionRate:92,lastActive:'2h ago',status:'Active',experience:'1 year',joinedDate:'Aug 2025',avgResponseTime:'< 3 hrs',avgMonthlySessions:7,monthlyActivity:[5,6,7,5,8,8,7,8,9,8,9,10],satisfactionTrend:[4.3,4.4,4.5,4.4,4.6,4.6,4.7,4.6],recentActivity:['Organized MBA case study session','Resolved internship portal issues','Shared interview prep resources','Received commendation from faculty mentor'] },
  { id:'s8',name:'Arjun Tiwari',initials:'AT',type:'Senior',department:'Electronics & Communication',deptCode:'BEC',block:'B2',empId:'23BEC08077',designation:'Senior Peer Mentor (Sem 5)',studentsAssigned:14,activeStudents:12,sessionsConducted:22,avgRating:4.5,doubtsResolved:68,resolutionRate:90,lastActive:'5h ago',status:'Active',experience:'1 year',joinedDate:'Aug 2025',avgResponseTime:'< 4 hrs',avgMonthlySessions:6,monthlyActivity:[4,5,6,4,7,7,6,7,8,7,8,9],satisfactionTrend:[4.2,4.3,4.4,4.3,4.5,4.5,4.6,4.5],recentActivity:['Hosted ECE lab orientation','Resolved component procurement queries','Shared circuit design notes','Completed peer review activity'] },
  { id:'h1',name:'Dr. Amrit Pal Singh',initials:'AP',type:'HOD',department:'CSE (AI & ML)',deptCode:'AML',block:'B1',empId:'CU-HOD-00112',designation:'Head of Department',studentsAssigned:45,activeStudents:40,sessionsConducted:72,avgRating:4.9,doubtsResolved:210,resolutionRate:99,lastActive:'10m ago',status:'Active',experience:'15 years',joinedDate:'August 2012',avgResponseTime:'< 1 hr',avgMonthlySessions:12,monthlyActivity:[10,12,14,11,13,15,12,14,16,13,15,18],satisfactionTrend:[4.6,4.7,4.8,4.7,4.9,4.9,4.9,4.9],recentActivity:['Reviewed faculty progress reports','Approved syllabus adjustment proposals','Conducted department-wide SLA audit'] },
  { id:'h2',name:'Dr. Seema Rani',initials:'SR',type:'HOD',department:'CSE (Core)',deptCode:'BCS',block:'B1',empId:'CU-HOD-00145',designation:'Head of Department',studentsAssigned:50,activeStudents:45,sessionsConducted:80,avgRating:4.8,doubtsResolved:230,resolutionRate:98,lastActive:'1h ago',status:'Active',experience:'13 years',joinedDate:'June 2014',avgResponseTime:'< 2 hrs',avgMonthlySessions:14,monthlyActivity:[11,13,15,12,14,16,13,15,17,14,16,19],satisfactionTrend:[4.5,4.6,4.7,4.6,4.8,4.8,4.8,4.8],recentActivity:['Held faculty coordination meeting','Resolved escalated student dispute','Submitted quarterly academic report'] },
];

/* ── Helpers ── */
function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    done.current = false; setVal(0);
    const t0 = performance.now();
    const tick = (now: number) => {
      if (done.current) return;
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { done.current = true; };
  }, [target, duration]);
  return val;
}

function StatusPill({ status }: { status: MentorRecord['status'] }) {
  const cfg = { Active:{bg:'#DCFCE7',color:'#16A34A',dot:'#22C55E'}, 'On Leave':{bg:'#FEF9C3',color:'#B45309',dot:'#F59E0B'}, Inactive:{bg:'#FEE2E2',color:'#DC2626',dot:'#EF4444'} }[status];
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border" style={{ background: cfg.bg, color: cfg.color, borderColor:`${cfg.dot}40` }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />{status}</span>;
}

function TypeBadge({ type }: { type: MentorRecord['type'] }) {
  if (type === 'Faculty') return <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-blue-200" style={{ background:'#EFF6FF', color:'#1D4ED8' }}>👨‍🏫 Faculty</span>;
  if (type === 'Senior') return <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-purple-200" style={{ background:'#F5F3FF', color:'#7C3AED' }}>🎓 Senior</span>;
  return <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-emerald-200" style={{ background:'#ECFDF5', color:'#047857' }}>🏛️ HOD</span>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} className={`w-3 h-3 ${s<=Math.floor(rating)?'text-amber-400 fill-amber-400':'text-gray-200'}`}/>)}</div>
      <span className="text-[11px] font-bold text-amber-500">{rating.toFixed(1)}</span>
    </div>
  );
}

function SparkLine({ data, color='#6B9BF7' }: { data:number[]; color?:string }) {
  const w=120,h=32,max=Math.max(...data,1);
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-(v/max)*h}`).join(' ');
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none"><polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/></svg>;
}

function DonutChart({ pct, color, size=64, dark=false }: { pct:number; color:string; size?:number; dark?:boolean }) {
  const r=size/2-6,cx=size/2,cy=size/2,circ=2*Math.PI*r,dash=(pct/100)*circ;
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)"} strokeWidth="6"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+4} textAnchor="middle" fill={dark ? "white" : "#1E293B"} fontSize="10" fontWeight="700">{pct}%</text>
    </svg>
  );
}

function SummaryCard({ icon:Icon, label, value, sub, color, borderClr, bgLight }: { icon:any; label:string; value:number|string; sub:string; color:string; borderClr:string; bgLight:string }) {
  return (
    <div className="relative rounded-[24px] overflow-hidden p-5 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(36,74,138,0.08)] transition-all duration-300 cursor-default border bg-white/60 backdrop-blur-sm"
      style={{
        borderColor: borderClr,
        background: `linear-gradient(135deg, #FFFFFF 0%, ${bgLight} 100%)`
      }}>
      <div className="absolute -top-8 -right-8 w-28 h-28 bg-current opacity-[0.03] rounded-full pointer-events-none" style={{ color }}/>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-current opacity-[0.01] rounded-full pointer-events-none" style={{ color }}/>
      <div className="relative">
        <div className="w-10 h-10 rounded-[13px] flex items-center justify-center mb-3 border" style={{ background: `${color}12`, borderColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }}/>
        </div>
        <div className="text-[26px] font-extrabold text-slate-800 leading-none tracking-tight">{value}</div>
        <div className="text-[11px] font-bold text-slate-600 mt-2 leading-snug">{label}</div>
        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

/* ── Mentor Detail Side Panel ── */
function MentorDetailPanel({ mentor, onClose }: { mentor:MentorRecord; onClose:()=>void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]" onClick={onClose}/>
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[520px] z-[90] overflow-y-auto shadow-2xl border-l border-slate-200"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 pt-6 pb-4 border-b border-white/10"
          style={{ background: 'linear-gradient(135deg, #1E293B 0%, #244A8A 100%)' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white/60" style={{ background:'rgba(255,255,255,0.08)' }}>
              <BarChart3 className="w-3 h-3"/> Mentor Profile
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/15"><X className="w-4 h-4 text-white/70"/></button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-white font-extrabold text-[22px] border border-white/25 shrink-0 shadow-2xl"
              style={{ background: mentor.type==='Faculty' ? 'linear-gradient(135deg,#1a0a3a,#3b1f82,#7c3aed)' : mentor.type==='Senior' ? 'linear-gradient(135deg,#13233F,#244A8A,#3568E8)' : 'linear-gradient(135deg,#064e3b,#0f766e,#10b981)' }}>
              {mentor.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap"><TypeBadge type={mentor.type}/><StatusPill status={mentor.status}/></div>
              <div className="text-[20px] font-extrabold text-white leading-tight truncate">{mentor.name}</div>
              <div className="text-[11px] text-white/45 font-medium mt-0.5">{mentor.designation}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{mentor.department} • Block {mentor.block}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {[{label:'Employee ID',value:mentor.empId},{label:'Experience',value:mentor.experience},{label:'Joined',value:mentor.joinedDate}].map(({label,value})=>(
              <div key={label} className="rounded-[12px] p-3 text-center border border-white/10" style={{ background:'rgba(255,255,255,0.06)' }}>
                <div className="text-[11px] font-bold text-white truncate">{value}</div>
                <div className="text-[9px] text-white/35 font-bold uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Performance */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Activity className="w-3.5 h-3.5"/> Performance Analytics</div>
            <div className="grid grid-cols-2 gap-3">
              {[{label:'Students Assigned',value:mentor.studentsAssigned,icon:Users,color:'#3568E8'},{label:'Active Mentees',value:mentor.activeStudents,icon:Activity,color:'#22C55E'},{label:'Sessions Conducted',value:mentor.sessionsConducted,icon:Calendar,color:'#7c3aed'},{label:'Doubts Resolved',value:mentor.doubtsResolved,icon:CheckCircle2,color:'#E10619'}].map(({label,value,icon:Icon,color})=>(
                <div key={label} className="rounded-[16px] p-4 border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-[10px] flex items-center justify-center mb-2 border border-slate-200/40" style={{ background:`${color}12` }}><Icon className="w-4 h-4" style={{ color }}/></div>
                  <div className="text-[22px] font-extrabold text-slate-800">{value}</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2.5 mt-3">
              <div className="rounded-[14px] p-3 border border-slate-100 bg-slate-50/50 text-center"><div className="text-[18px] font-extrabold text-amber-500">{mentor.avgRating.toFixed(1)}</div><div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Avg Rating</div></div>
              <div className="rounded-[14px] p-3 border border-slate-100 bg-slate-50/50 text-center"><div className="text-[18px] font-extrabold text-emerald-600">{mentor.resolutionRate}%</div><div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Resolution</div></div>
              <div className="rounded-[14px] p-3 border border-slate-100 bg-slate-50/50 text-center"><div className="text-[14px] font-extrabold text-sky-600">{mentor.avgResponseTime}</div><div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Response</div></div>
            </div>
          </div>
          {/* Visual Analytics */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5"/> Visual Analytics</div>
            <div className="rounded-[16px] p-4 border border-slate-100 bg-slate-50/50 mb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[12px] font-bold text-slate-700">Monthly Activity</div>
                <SparkLine data={mentor.monthlyActivity}/>
              </div>
              <div className="flex items-end gap-1 h-20">
                {mentor.monthlyActivity.map((v,i)=>{
                  const max=Math.max(...mentor.monthlyActivity,1);
                  return <div key={i} className="flex-1 rounded-t-sm transition-all duration-500" style={{ height:`${(v/max)*100}%`, background:v===0?'rgba(0,0,0,0.04)':'linear-gradient(to top,#3568E8,#6B9BF7)' }}/>;
                })}
              </div>
              <div className="flex justify-between mt-1 text-[9px] text-slate-400"><span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span></div>
            </div>
            <div className="flex items-stretch gap-3">
              <div className="flex-1 rounded-[16px] p-4 border border-slate-100 bg-slate-50/50">
                <div className="text-[12px] font-bold text-slate-700 mb-2">Satisfaction Trend</div>
                <SparkLine data={mentor.satisfactionTrend.map(v=>v*20)} color="#F59E0B"/>
                <div className="text-[10px] text-slate-400 mt-1">Last 8 months</div>
              </div>
              <div className="rounded-[16px] p-4 border border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center">
                <div className="text-[11px] font-bold text-slate-700 mb-2">Resolution</div>
                <DonutChart pct={mentor.resolutionRate} color="#22C55E" dark={false}/>
              </div>
            </div>
          </div>
          {/* Avg Monthly Sessions */}
          <div className="rounded-[16px] p-4 border border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[11px] bg-purple-50 border border-purple-100 flex items-center justify-center"><Clock className="w-4 h-4 text-purple-600"/></div>
              <div><div className="text-[12px] font-bold text-slate-700">Avg Monthly Sessions</div><div className="text-[10px] text-slate-400">Across current semester</div></div>
            </div>
            <div className="text-[24px] font-extrabold text-purple-600">{mentor.avgMonthlySessions}</div>
          </div>
          {/* Recent Activity */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5"/> Recent Activity</div>
            <div className="space-y-2">
              {mentor.recentActivity.map((act,i)=>(
                <div key={i} className="flex items-start gap-3 rounded-[12px] p-3 border border-slate-100 bg-slate-50/50">
                  <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/></div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">{act}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Mentor Table Row ── */
function MentorRow({ mentor, onOpen, idx }: { mentor:MentorRecord; onOpen:(m:MentorRecord)=>void; idx:number }) {
  const isEven = idx % 2 === 0;
  return (
    <button onClick={()=>onOpen(mentor)}
      className="w-full grid grid-cols-[44px_1.6fr_0.9fr_1fr_0.65fr_0.65fr_0.8fr_1.1fr_0.7fr_0.6fr] items-center gap-3 px-4 py-3.5 rounded-[14px] border hover:border-blue-300 hover:shadow-[0_6px_20px_rgba(36,74,138,0.06)] hover:-translate-y-[1px] transition-all duration-200 text-left group"
      style={{ background: isEven ? '#FFFFFF' : '#F8FBFF', borderColor: isEven ? '#E8EFFF' : '#EEF4FF' }}>
      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white font-extrabold text-[12px] border border-white/20 shrink-0 group-hover:scale-105 transition-transform shadow-sm"
        style={{ background: mentor.type==='Faculty' ? 'linear-gradient(135deg,#1e3a8a,#3568E8)' : mentor.type==='Senior' ? 'linear-gradient(135deg,#5b21b6,#7c3aed)' : 'linear-gradient(135deg,#065f46,#10b981)' }}>
        {mentor.initials}
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-bold text-gray-800 truncate group-hover:text-blue-700 transition-colors">{mentor.name}</div>
        <div className="text-[10px] text-gray-400 font-medium truncate">{mentor.empId}</div>
      </div>
      <div><TypeBadge type={mentor.type}/></div>
      <div className="min-w-0">
        <div className="text-[11px] text-gray-700 font-semibold truncate">{mentor.department}</div>
        <div className="text-[9px] text-gray-400 font-medium">Block {mentor.block}</div>
      </div>
      <div className="text-[14px] font-bold text-gray-800 text-center">{mentor.studentsAssigned}</div>
      <div className="text-[14px] font-bold text-gray-800 text-center">{mentor.sessionsConducted}</div>
      <div className="flex justify-center"><StarRating rating={mentor.avgRating}/></div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full" style={{ width:`${mentor.resolutionRate}%`, background:'linear-gradient(90deg,#22C55E,#4ade80)' }}/></div>
        <span className="text-[10px] font-bold text-emerald-600 w-8 shrink-0">{mentor.resolutionRate}%</span>
      </div>
      <div className="flex justify-center"><StatusPill status={mentor.status}/></div>
      <div className="text-[10px] text-gray-400 font-medium text-right">{mentor.lastActive}</div>
    </button>
  );
}

/* ── Types ── */
type SortKey = 'students'|'sessions'|'rating'|'resolution'|'recent';
type TypeFilter = 'All'|'Faculty'|'Senior'|'HOD';

/* ── Filter Chip ── */
function FilterSelect({ label, value, options, onChange }: { label:string; value:string; options:string[]; onChange:(v:string)=>void }) {
  return (
    <div className="relative">
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-[10px] text-[11px] font-bold text-gray-600 border border-gray-200 cursor-pointer hover:border-blue-300 bg-white transition-colors focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        style={{}}>
        <option value={options[0]}>{label}: {options[0]}</option>
        {options.slice(1).map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"/>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export function MentorAnalyticsDashboard({ onClose }: { onClose: ()=>void }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [blockFilter, setBlockFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('students');
  const [selectedMentor, setSelectedMentor] = useState<MentorRecord|null>(null);
  const [facultyExpanded, setFacultyExpanded] = useState(true);
  const [seniorExpanded, setSeniorExpanded] = useState(true);
  const [hodExpanded, setHodExpanded] = useState(true);

  const faculty = MENTOR_DATA.filter(m=>m.type==='Faculty');
  const seniors = MENTOR_DATA.filter(m=>m.type==='Senior');
  const hods = MENTOR_DATA.filter(m=>m.type==='HOD');
  const totalStudentsMentored = MENTOR_DATA.reduce((a,m)=>a+m.studentsAssigned,0);
  const totalSessions = MENTOR_DATA.reduce((a,m)=>a+m.sessionsConducted,0);
  const totalDoubts = MENTOR_DATA.reduce((a,m)=>a+m.doubtsResolved,0);
  const avgRating = MENTOR_DATA.reduce((a,m)=>a+m.avgRating,0)/MENTOR_DATA.length;
  const avgResolution = Math.round(MENTOR_DATA.reduce((a,m)=>a+m.resolutionRate,0)/MENTOR_DATA.length);

  const animTotal    = useCountUp(MENTOR_DATA.length);
  const animFaculty  = useCountUp(faculty.length);
  const animSenior   = useCountUp(seniors.length);
  const animHods     = useCountUp(hods.length);
  const animStudents = useCountUp(totalStudentsMentored);
  const animSessions = useCountUp(totalSessions);
  const animDoubts   = useCountUp(totalDoubts);

  const departments = ['All',...Array.from(new Set(MENTOR_DATA.map(m=>m.department)))];
  const blocks = ['All',...Array.from(new Set(MENTOR_DATA.map(m=>`Block ${m.block}`)))];
  const statuses = ['All','Active','On Leave','Inactive'];

  const recencyRank = (s:string) => s.includes('m ago')||s.includes('h ago') ? 0 : s.includes('d ago') ? parseInt(s)||1 : 99;

  let filtered = MENTOR_DATA.filter(m => {
    const q=search.trim().toLowerCase();
    return (!q||m.name.toLowerCase().includes(q)||m.empId.toLowerCase().includes(q))
      && (typeFilter==='All'||m.type===typeFilter)
      && (deptFilter==='All'||m.department===deptFilter)
      && (blockFilter==='All'||`Block ${m.block}`===blockFilter)
      && (statusFilter==='All'||m.status===statusFilter);
  });
  filtered = [...filtered].sort((a,b)=>{
    switch(sortKey) {
      case 'students': return b.studentsAssigned-a.studentsAssigned;
      case 'sessions': return b.sessionsConducted-a.sessionsConducted;
      case 'rating':   return b.avgRating-a.avgRating;
      case 'resolution': return b.resolutionRate-a.resolutionRate;
      case 'recent':   return recencyRank(a.lastActive)-recencyRank(b.lastActive);
      default: return 0;
    }
  });

  const filteredFaculty = filtered.filter(m=>m.type==='Faculty');
  const filteredSenior  = filtered.filter(m=>m.type==='Senior');
  const filteredHods    = filtered.filter(m=>m.type==='HOD');

  const deptAnalytics = DEPARTMENT_STATS.map(d=>({
    name:d.name, code:d.code, faculty:d.facultyAssigned, senior:d.seniorMentors, hod:d.hodsAssigned || 1,
    students:d.totalStudents, rating:(4.2+(d.satisfaction-88)/40).toFixed(1),
    sessions:d.sessionsConducted, satisfaction:d.satisfaction,
  })).sort((a,b)=>b.satisfaction-a.satisfaction);

  return createPortal(
    <div className="fixed inset-0 z-[70] overflow-y-auto" style={{ background:'linear-gradient(160deg,#F8FAFC 0%,#F5F7FB 40%,#EFF4FF 100%)' }}>
      {/* Subtle blue background glow overlays */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-300/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-200/10 blur-[150px] pointer-events-none" />
      
      {selectedMentor && <MentorDetailPanel mentor={selectedMentor} onClose={()=>setSelectedMentor(null)}/>}

      {/* ── HERO HEADER — keeps the blue gradient identity ── */}
      <div className="relative overflow-hidden" style={{ background:'linear-gradient(135deg, #1E293B 0%, #244A8A 50%, #3568E8 100%)' }}>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/[0.06] rounded-full pointer-events-none"/>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/[0.04] rounded-full pointer-events-none"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(225,6,25,0.08) 0%,transparent 70%)' }}/>
        <div className="relative px-6 pt-8 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[28px] sm:text-[34px] font-extrabold text-white tracking-tight leading-tight">University Mentor Network</h1>
              <p className="text-white/45 text-[13px] font-medium mt-2 max-w-lg">Complete overview of Faculty and Senior Mentor performance across all departments.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-[14px] bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/15 hover:border-white/30 shrink-0 mt-1">
              <X className="w-5 h-5 text-white/80"/>
            </button>
          </div>
          {/* Hero Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { label:'Total Mentors',    value:animTotal,    icon:'👥', color:'rgba(53,104,232,0.3)' },
              { label:'Faculty Mentors',  value:animFaculty,  icon:'👨‍🏫', color:'rgba(124,58,237,0.3)' },
              { label:'Senior Mentors',   value:animSenior,   icon:'🎓', color:'rgba(34,197,94,0.25)'  },
              { label:'HOD Mentors',      value:animHods,     icon:'🏛️', color:'rgba(16,185,129,0.25)' },
              { label:'Students Mentored',value:animStudents, icon:'📚', color:'rgba(225,6,25,0.25)'   },
              { label:'Avg Rating',       value:avgRating.toFixed(1), icon:'⭐', color:'rgba(251,191,36,0.25)' },
            ].map(s=>(
              <div key={s.label} className="rounded-[18px] px-4 py-3 border border-white/10 flex items-center gap-3" style={{ background:s.color }}>
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
        {/* ── MENTOR DIRECTORY ── */}
        <div className="rounded-[32px] border border-blue-100/50 bg-white/70 backdrop-blur-md overflow-hidden shadow-[0_12px_40px_rgba(36,74,138,0.04),_0_2px_8px_rgba(36,74,138,0.02)]">
          {/* Controls */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[10px] bg-blue-50 border border-blue-100/60 flex items-center justify-center"><Users className="w-4 h-4 text-blue-600"/></div>
              <div className="text-[15px] font-extrabold text-slate-800">Mentor Directory</div>
              <span className="ml-auto text-[11px] text-slate-500 font-semibold">{filtered.length} mentors</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or ID..."
                  className="w-full pl-9 pr-4 py-2 rounded-[12px] text-[12px] text-slate-700 placeholder-slate-400 border border-slate-200 bg-white/80 focus:outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"/>
              </div>
              {/* Type tabs */}
              <div className="flex rounded-[12px] border border-slate-200 overflow-hidden bg-slate-100/50 p-0.5">
                {(['All','Faculty','Senior','HOD'] as TypeFilter[]).map(t=>(
                  <button key={t} onClick={()=>setTypeFilter(t)}
                    className={`px-3 py-1.5 text-[11px] font-bold transition-all rounded-[10px] ${typeFilter===t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <FilterSelect label="Dept"   value={deptFilter}   options={departments} onChange={setDeptFilter}/>
              <FilterSelect label="Block"  value={blockFilter}  options={blocks}       onChange={setBlockFilter}/>
              <FilterSelect label="Status" value={statusFilter} options={statuses}     onChange={setStatusFilter}/>
              {/* Sort */}
              <div className="relative">
                <select value={sortKey} onChange={e=>setSortKey(e.target.value as SortKey)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-[12px] text-[11px] font-bold text-slate-700 border border-slate-200 bg-white/80 cursor-pointer hover:border-blue-300 transition-colors focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5">
                  <option value="students">Sort: Students</option>
                  <option value="sessions">Sort: Sessions</option>
                  <option value="rating">Sort: Rating</option>
                  <option value="resolution">Sort: Resolution</option>
                  <option value="recent">Sort: Recently Active</option>
                </select>
                <SortAsc className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
              </div>
            </div>
          </div>
          {/* Table Header */}
          <div className="grid grid-cols-[44px_1.6fr_0.9fr_1fr_0.65fr_0.65fr_0.8fr_1.1fr_0.7fr_0.6fr] gap-3 px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-white/90 border-b border-blue-100/30"
            style={{ background: 'linear-gradient(90deg, #1E293B 0%, #244A8A 50%, #3568E8 100%)' }}>
            <div/><div>Mentor</div><div>Type</div><div>Department</div>
            <div className="text-center">Students</div><div className="text-center">Sessions</div>
            <div className="text-center">Rating</div><div>Resolution</div>
            <div className="text-center">Status</div><div className="text-right">Last Active</div>
          </div>

          {/* Faculty Section */}
          <div className="p-3">
            <button onClick={()=>setFacultyExpanded(v=>!v)}
              className="w-full flex items-center gap-2 px-3.5 py-3 rounded-[16px] mb-2.5 hover:shadow-md hover:shadow-blue-500/5 transition-all group border text-left"
              style={{ background: 'linear-gradient(95deg, #EFF6FF 0%, #DBEAFE 100%)', borderColor: '#BFDBFE' }}>
              <div className="w-6.5 h-6.5 rounded-[8px] bg-blue-600/10 flex items-center justify-center"><Crown className="w-3.5 h-3.5 text-blue-600"/></div>
              <span className="text-[12px] font-extrabold text-blue-900">👨‍🏫 Faculty Mentors</span>
              <span className="text-[10px] text-blue-600/75 font-bold">({filteredFaculty.length})</span>
              <div className="ml-auto">{facultyExpanded ? <ChevronUp className="w-4 h-4 text-blue-600/75"/> : <ChevronDown className="w-4 h-4 text-blue-600/75"/>}</div>
            </button>
            {facultyExpanded && (
              <div className="space-y-1.5 mb-4">
                {filteredFaculty.length === 0
                  ? <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-[14px] border border-dashed border-slate-200 text-[13px]">No faculty mentors match filters</div>
                  : filteredFaculty.map((m, idx)=><MentorRow key={m.id} mentor={m} onOpen={setSelectedMentor} idx={idx}/>)
                }
              </div>
            )}

            {/* Senior Section */}
            <button onClick={()=>setSeniorExpanded(v=>!v)}
              className="w-full flex items-center gap-2 px-3.5 py-3 rounded-[16px] mb-2.5 hover:shadow-md hover:shadow-purple-500/5 transition-all group border text-left"
              style={{ background: 'linear-gradient(95deg, #F5F3FF 0%, #EDE9FE 100%)', borderColor: '#DDD6FE' }}>
              <div className="w-6.5 h-6.5 rounded-[8px] bg-purple-600/10 flex items-center justify-center"><GraduationCap className="w-3.5 h-3.5 text-purple-600"/></div>
              <span className="text-[12px] font-extrabold text-purple-900">🎓 Senior Mentors</span>
              <span className="text-[10px] text-purple-600/75 font-bold">({filteredSenior.length})</span>
              <div className="ml-auto">{seniorExpanded ? <ChevronUp className="w-4 h-4 text-purple-600/75"/> : <ChevronDown className="w-4 h-4 text-purple-600/75"/>}</div>
            </button>
            {seniorExpanded && (
              <div className="space-y-1.5 mb-4">
                {filteredSenior.length === 0
                  ? <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-[14px] border border-dashed border-slate-200 text-[13px]">No senior mentors match filters</div>
                  : filteredSenior.map((m, idx)=><MentorRow key={m.id} mentor={m} onOpen={setSelectedMentor} idx={idx}/>)
                }
              </div>
            )}

            {/* HOD Section */}
            <button onClick={()=>setHodExpanded(v=>!v)}
              className="w-full flex items-center gap-2 px-3.5 py-3 rounded-[16px] mb-2.5 hover:shadow-md hover:shadow-emerald-500/5 transition-all group border text-left"
              style={{ background: 'linear-gradient(95deg, #ECFDF5 0%, #D1FAE5 100%)', borderColor: '#A7F3D0' }}>
              <div className="w-6.5 h-6.5 rounded-[8px] bg-emerald-600/10 flex items-center justify-center"><Building className="w-3.5 h-3.5 text-emerald-600"/></div>
              <span className="text-[12px] font-extrabold text-emerald-900">🏛️ HOD Mentors</span>
              <span className="text-[10px] text-emerald-600/75 font-bold">({filteredHods.length})</span>
              <div className="ml-auto">{hodExpanded ? <ChevronUp className="w-4 h-4 text-emerald-600/75"/> : <ChevronDown className="w-4 h-4 text-emerald-600/75"/>}</div>
            </button>
            {hodExpanded && (
              <div className="space-y-1.5">
                {filteredHods.length === 0
                  ? <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-[14px] border border-dashed border-slate-200 text-[13px]">No HOD mentors match filters</div>
                  : filteredHods.map((m, idx)=><MentorRow key={m.id} mentor={m} onOpen={setSelectedMentor} idx={idx}/>)
                }
              </div>
            )}
          </div>
        </div>

        {/* ── DEPARTMENT-WISE ANALYTICS ── */}
        <div className="rounded-[32px] border border-blue-100/50 bg-white/70 backdrop-blur-md overflow-hidden shadow-[0_12px_40px_rgba(36,74,138,0.04),_0_2px_8px_rgba(36,74,138,0.02)]">
          <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-emerald-50 border border-emerald-100 flex items-center justify-center"><Building className="w-4 h-4 text-emerald-600"/></div>
            <div className="text-[15px] font-extrabold text-slate-800">Department-wise Analytics</div>
          </div>
          <div className="p-4 space-y-2">
            {/* Header */}
            <div className="grid grid-cols-[1.8fr_0.6fr_0.6fr_0.6fr_0.8fr_0.6fr_1fr] gap-3 px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-white/90 rounded-t-[16px] shadow-sm"
              style={{ background: 'linear-gradient(90deg, #1E293B 0%, #244A8A 50%, #3568E8 100%)' }}>
              <div>Department</div><div className="text-center">Faculty</div><div className="text-center">Senior</div><div className="text-center">HOD</div>
              <div>Students</div><div>Rating</div><div>Satisfaction</div>
            </div>
            {deptAnalytics.map((d,i)=>{
              const isTop = i === 0;
              const isEven = i % 2 === 0;
              return (
                <div key={d.code} className="grid grid-cols-[1.8fr_0.6fr_0.6fr_0.6fr_0.8fr_0.6fr_1fr] gap-3 items-center px-4 py-3.5 rounded-[14px] border transition-all hover:border-blue-300 hover:shadow-[0_4px_15px_rgba(53,104,232,0.05)]"
                  style={{
                    background: isTop ? 'rgba(34,197,94,0.06)' : (isEven ? '#FFFFFF' : '#F8FBFF'),
                    borderColor: isTop ? 'rgba(34,197,94,0.2)' : (isEven ? '#E8EFFF' : '#EEF4FF')
                  }}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isTop && <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-bounce"/>}
                    <div className="min-w-0">
                      <div className="text-[12px] font-bold text-slate-800 truncate">{d.name}</div>
                      <div className="text-[9px] text-slate-400 font-semibold">{d.code}</div>
                    </div>
                  </div>
                  <div className="text-[13px] font-bold text-blue-600 text-center">{d.faculty}</div>
                  <div className="text-[13px] font-bold text-purple-600 text-center">{d.senior}</div>
                  <div className="text-[13px] font-bold text-emerald-600 text-center">{d.hod}</div>
                  <div className="text-[13px] font-bold text-slate-700 text-center">{d.students.toLocaleString()}</div>
                  <div className="flex items-center justify-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400"/><span className="text-[12px] font-bold">{d.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width:`${d.satisfaction}%`, background:isTop?'linear-gradient(90deg,#22C55E,#4ade80)':'linear-gradient(90deg,#3568E8,#6B9BF7)' }}/>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 w-8 shrink-0">{d.satisfaction}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spacer */}
        <div className="h-6"/>
      </div>
    </div>,
    document.body
  );
}
