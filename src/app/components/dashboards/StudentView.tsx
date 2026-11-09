import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  GraduationCap, CalendarDays,
  Send, Video, Calendar,
  Star, MessageSquare, BarChart3,
  CalendarPlus, Users,
  Mail, BookOpen, Clock3, Building2,
  Sparkles, ChevronRight, ChevronLeft,
  CheckCircle2, Zap,
  Compass, FlaskConical,
  CheckCheck, ClipboardList, FileText,
  X, ArrowRight, MessageCircle, UserCheck,
  BrainCircuit, Code2, Rocket, Mic, TrendingUp, Trophy,
  Laptop2, Target, Home, PartyPopper, Network, Scale, Lightbulb, HelpCircle,
  Briefcase, Wallet, Award, Lock,
} from 'lucide-react';
import { CURRENT_STUDENT } from '../../data/cuAcademicData';
import { useMentorship, type MentorshipRequest, type SessionFeedback } from '../../data/mentorshipStore';
import courseImg from '../../../assets/course.png';
import sectionImg from '../../../assets/section.png';
import blockImg from '../../../assets/block.png';
import semesterImg from '../../../assets/semester.png';
import batchImg from '../../../assets/batch.png';

export function StudentView({ activeTab, onBookSession }: { activeTab: string; onBookSession?: () => void }) {
  switch (activeTab) {
    case 'queries': return <QueryResolution />;
    case 'scheduler': return <SmartScheduler onBookSession={onBookSession} />;
    default: return <Overview onBookSession={onBookSession} />;
  }
}

/* ════════════════════════════════════════
   OVERVIEW — Premium Dashboard
════════════════════════════════════════ */
function Overview({ onBookSession }: { onBookSession?: () => void }) {
  const s = CURRENT_STUDENT;
  const [bookSessionOpen, setBookSessionOpen] = useState(false);
  const [talkSeniorOpen, setTalkSeniorOpen] = useState(false);
  const { requests, registerScrollToRequests } = useMentorship();
  const requestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerScrollToRequests(() => {
      requestsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [registerScrollToRequests]);

  return (
    <div className="space-y-6">

      {/* ── HERO WELCOME BANNER ── */}
      <div className="relative rounded-[24px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #E30613 60%, #ff6b6b 100%)' }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />
        <div className="absolute top-4 right-40 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-[60px] h-[60px] rounded-[18px] bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-xl">
                <span className="text-white font-extrabold text-[20px]">{s.initials}</span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-[#22C55E] rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <p className="text-white/60 text-[12px] font-semibold mb-0.5">Good morning 👋</p>
              <h1 className="text-white text-[24px] font-extrabold tracking-tight leading-tight">
                Welcome back, {s.name.split(' ')[0]}!
              </h1>
              <p className="text-white/60 text-[12px] font-medium mt-1">
                {s.uid} &nbsp;·&nbsp; {s.course} &nbsp;·&nbsp; Semester {s.semester}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACADEMIC PROFILE STRIP ── */}
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-[8px] bg-[#E30613]/10 flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-[#E30613]" />
          </div>
          <span className="text-[13px] font-bold text-[#1A1A1A]">Academic Profile</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { l: 'COURSE', v: s.course, accent: '#E30613', icon: GraduationCap, img: courseImg },
            { l: 'SECTION', v: s.section, accent: '#3b82f6', icon: Users, img: sectionImg },
            { l: 'BLOCK', v: `Block ${s.block}`, accent: '#22C55E', icon: Building2, img: blockImg },
            { l: 'SEMESTER', v: `Sem ${s.semester}`, accent: '#f59e0b', icon: BookOpen, img: semesterImg },
            { l: 'BATCH', v: `${s.batch}`, accent: '#8b5cf6', icon: CalendarDays, img: batchImg },
          ].map(f => (
            <div key={f.l} className="group relative rounded-[16px] overflow-hidden bg-[#FAFAFA] border border-[#F0F0F0] hover:shadow-md hover:-translate-y-[1px] transition-all duration-200">
              {/* image area — backend can populate `img` with a real photo/illustration URL */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                {f.img ? (
                  <img src={f.img} alt={f.l} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${f.accent}1A, ${f.accent}33)` }}>
                    <f.icon className="w-7 h-7" style={{ color: f.accent }} strokeWidth={1.75} />
                  </div>
                )}
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: f.accent }} />
              </div>
              {/* label + value */}
              <div className="p-2.5">
                <div className="text-[8.5px] font-bold uppercase tracking-[0.1em]" style={{ color: f.accent }}>{f.l}</div>
                <div className="text-[12px] font-extrabold text-[#1A1A1A] mt-0.5 leading-tight truncate">{f.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MY REQUESTS ── */}
      <div ref={requestsRef} className="space-y-4">
        <FacultyGuidanceSection requests={requests} />
      </div>

      {/* ── TWO ACTION CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Book a Session */}
        <button
          onClick={() => setBookSessionOpen(true)}
          className="group relative rounded-[20px] overflow-hidden text-left border border-[#F0F0F0] hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d0a0a 45%, #E30613 100%)' }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative p-5">
            <div className="w-10 h-10 rounded-[12px] bg-white/15 flex items-center justify-center mb-4">
              <CalendarPlus className="w-5 h-5 text-white" />
            </div>
            <div className="text-white text-[16px] font-extrabold tracking-tight mb-1">Book a Session</div>
            <div className="text-white/60 text-[12px] font-medium leading-relaxed">Schedule a 1-on-1 with your assigned faculty mentor</div>
            <div className="mt-4 flex items-center gap-1.5 text-white/80 text-[11px] font-bold">
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </button>

        {/* Talk to a Senior */}
        <button
          onClick={() => setTalkSeniorOpen(true)}
          className="group relative rounded-[20px] overflow-hidden text-left border border-[#F0F0F0] hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%)' }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative p-5">
            <div className="w-10 h-10 rounded-[12px] bg-white/15 flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-white text-[16px] font-extrabold tracking-tight mb-1">Talk to a Senior</div>
            <div className="text-white/60 text-[12px] font-medium leading-relaxed">Connect with a senior student for guidance & campus tips</div>
            <div className="mt-4 flex items-center gap-1.5 text-white/80 text-[11px] font-bold">
              <span>Connect now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </button>
      </div>

      {/* ── READY FOR CAMPUS ── */}
      <ReadyForCampusSection />

      {/* ── CLUBS & COMMUNITIES ── */}
      <ClubsSection />

      {/* ── MODALS ── */}
      <BookSessionModal isOpen={bookSessionOpen} onClose={() => setBookSessionOpen(false)} />
      <TalkToSeniorModal isOpen={talkSeniorOpen} onClose={() => setTalkSeniorOpen(false)} />
    </div>
  );
}

/* ════════════════════════════════════════
   FACULTY GUIDANCE REQUESTS (Book a Session)
   — bento-grid, multi-tone status identity —
════════════════════════════════════════ */

const FACULTY_STATUS_THEME = {
  pending:     { name: 'Awaiting Assignment', bg: '#FFF8EB', strip: 'linear-gradient(180deg,#F59E0B,#D97706)', text: '#92400E', chip: '#FDE9C8', dot: '#F59E0B', glow: 'rgba(245,158,11,0.18)' },
  confirmed:   { name: 'Confirmed',           bg: '#F2EFFF', strip: 'linear-gradient(180deg,#8B5CF6,#6D28D9)', text: '#4C1D95', chip: '#E4DBFF', dot: '#8B5CF6', glow: 'rgba(139,92,246,0.18)' },
  ready:       { name: 'Ready to Join',       bg: '#FFFBEB', strip: 'linear-gradient(180deg,#F59E0B,#EAB308)', text: '#854D0E', chip: '#FEF3C7', dot: '#EAB308', glow: 'rgba(234,179,8,0.22)' },
  in_progress: { name: 'Live now',            bg: '#EBFCF1', strip: 'linear-gradient(180deg,#22C55E,#15803D)', text: '#14532D', chip: '#CFF7DA', dot: '#22C55E', glow: 'rgba(34,197,94,0.22)' },
  ended:       { name: 'Ended',               bg: '#F4F4F5', strip: 'linear-gradient(180deg,#94A3B8,#64748B)', text: '#3F3F46', chip: '#E5E7EB', dot: '#94A3B8', glow: 'rgba(100,116,139,0.12)' },
  completed:   { name: 'Session Completed',    bg: '#F0FDF4', strip: 'linear-gradient(180deg,#16a34a,#22c55e)', text: '#14532D', chip: '#D1FAE5', dot: '#22c55e', glow: 'rgba(34,197,94,0.18)' },
} as const;

function FacultyGuidanceSection({ requests }: { requests: MentorshipRequest[] }) {
  const list = requests.filter(r => r.type === 'session');
  const { seedDemoSessions } = useMentorship();
  return (
    <div className="relative rounded-[28px] p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, rgba(20,20,30,0.92) 0%, rgba(10,10,16,0.96) 55%, rgba(24,8,14,0.94) 100%)',
        boxShadow: '0 24px 60px -28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
      {/* glass noise + glow orbs */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full pointer-events-none blur-[2px]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-16 w-60 h-60 rounded-full pointer-events-none blur-[2px]" style={{ background: 'radial-gradient(circle, rgba(227,6,19,0.20), transparent 70%)' }} />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10), transparent 70%)' }} />

      <div className="relative flex items-center gap-3 mb-6">
        <div className="relative w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(227,6,19,0.9), rgba(255,107,107,0.85))',
            boxShadow: '0 8px 22px -4px rgba(227,6,19,0.55), inset 0 1px 0 rgba(255,255,255,0.35)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}>
          <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <span className="text-[15.5px] font-extrabold text-white tracking-tight">Faculty Guidance</span>
          <p className="text-[10.5px] text-white/40 font-semibold -mt-0.5">Mentor sessions, tracked live</p>
        </div>
        {list.length > 0 && (
          <span className="text-[10px] font-extrabold px-3 py-1.5 rounded-full backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.14)' }}>
            {list.length} {list.length === 1 ? 'session' : 'sessions'}
          </span>
        )}
        <button
          onClick={seedDemoSessions}
          className="ml-auto text-[10px] font-extrabold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 transition-all hover:scale-[1.03] active:scale-[0.97]"
          style={{ background: 'rgba(139,92,246,0.18)', color: '#D6C5FF', border: '1px solid rgba(139,92,246,0.3)' }}
          title="Inject 4 demo sessions — one for each status"
        >
          <Sparkles className="w-3 h-3" /> Demo states
        </button>
      </div>

      {list.length === 0 ? (
        <div className="relative text-center py-12 rounded-[20px] backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(255,255,255,0.12)' }}>
          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-white/5">
            <GraduationCap className="w-6 h-6 text-white/25" />
          </div>
          <p className="text-[12px] text-white/50 font-semibold">No faculty requests yet</p>
          <p className="text-[10px] text-white/25 mt-1">Book a session to get assigned a faculty mentor</p>
        </div>
      ) : (
        <div className="relative">
          {/* timeline spine */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))' }} />
          <div className="space-y-4">
            {list.map((r, i) => <FacultyTimelineCard key={r.id} request={r} isLast={i === list.length - 1} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function FacultyTimelineCard({ request, isLast }: { request: MentorshipRequest; isLast: boolean }) {
  const { highlightRequestId, setHighlightRequestId, sessionFeedbacks, submitFeedback, sharedMeetingLinks } = useMentorship();
  const [highlighted, setHighlighted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [prepareKitOpen, setPrepareKitOpen] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackDone, setFeedbackDone] = useState(false);

  const isCompleted = (request.status as string) === 'completed';
  const existingFeedback = sessionFeedbacks.find(f => f.sessionId === request.id);

  function handleSubmitFeedback(rating: number) {
    submitFeedback(request.id, rating, comment);
    setFeedbackDone(true);
  }

  useEffect(() => {
    if (highlightRequestId === request.id) {
      setHighlighted(true);
      const t = setTimeout(() => { setHighlighted(false); setHighlightRequestId(null); }, 2200);
      return () => clearTimeout(t);
    }
  }, [highlightRequestId, request.id, setHighlightRequestId]);

  const assigned = request.status === 'assigned';

  useEffect(() => {
    if (!assigned) return;
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, [assigned]);
  const meetingStatus = assigned ? getMeetingStatus(request.sessionDate, request.sessionTime, now) : null;
  const countdown = meetingStatus === 'confirmed' ? getCountdownParts(request.sessionDate, request.sessionTime, now) : null;
  const mentor = request.mentor;
  // Get shared meeting link (matched via faculty request ID stored in sharedMeetingLinks)
  const sharedLink = sharedMeetingLinks.find(l => l.studentRequestId === request.id)?.link ?? null;

  const statusKey: keyof typeof FACULTY_STATUS_THEME =
    isCompleted ? 'completed'
    : meetingStatus ?? (assigned ? 'confirmed' : 'pending');
  const theme = FACULTY_STATUS_THEME[statusKey];

  return (
    <div className="relative flex gap-4">
      {/* timeline node */}
      <div className="relative shrink-0 flex flex-col items-center" style={{ width: 40 }}>
        <div
          className={`relative w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-500 ${statusKey === 'in_progress' ? 'animate-pulse' : ''} ${highlighted ? 'scale-110' : ''}`}
          style={{
            background: theme.strip,
            boxShadow: `0 0 0 4px rgba(255,255,255,0.05), 0 8px 18px -6px ${theme.glow}`,
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          <GraduationCap className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-1" style={{ minHeight: 12, background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))' }} />
        )}
      </div>

      {/* glass card */}
      <div
        className={`flex-1 relative rounded-[20px] overflow-hidden mb-1 backdrop-blur-xl transition-all duration-500 ${highlighted ? 'scale-[1.012]' : ''}`}
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.97), rgba(255,255,255,0.90))',
          boxShadow: highlighted
            ? `0 0 0 3px ${theme.glow}, 0 18px 36px -16px ${theme.glow}`
            : `0 10px 28px -16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)`,
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        {/* top accent sheen */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: theme.strip }} />
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-50" style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 70%)` }} />

        <div className="relative px-5 py-4">
          {/* header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${statusKey === 'in_progress' ? 'animate-pulse' : ''}`} style={{ background: theme.dot }} />
                <span className="text-[9.5px] font-extrabold uppercase tracking-[0.08em]" style={{ color: theme.text }}>{theme.name}</span>
              </div>
              <h4 className="text-[14px] font-extrabold text-[#1A1A1A] mt-1 tracking-tight truncate">{request.topic}</h4>
              <p className="text-[10px] text-[#9A9A9A] font-semibold mt-0.5">Submitted {request.dateSubmitted}</p>
            </div>
            <div className="shrink-0 w-9 h-9 rounded-[12px] flex items-center justify-center backdrop-blur-sm" style={{ background: theme.chip, border: '1px solid rgba(255,255,255,0.5)' }}>
              <GraduationCap className="w-4 h-4" style={{ color: theme.text }} />
            </div>
          </div>

          {!assigned && (
            <p className="text-[11px] text-[#8A8A8A] font-medium mt-3 leading-relaxed">
              Finding your mentor — you'll be notified within 3–4 hours.
            </p>
          )}

          {/* assigned content */}
          {assigned && mentor && (
            <div className="mt-4 space-y-2.5">
              {/* mentor tile */}
              <div className="flex items-center gap-3 rounded-[16px] p-3 backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)' }}>
                <div className="relative w-11 h-11 shrink-0">
                  <div className="absolute inset-0 rounded-full blur-[6px] opacity-60" style={{ background: 'linear-gradient(135deg,#E30613,#ff8a8a,#ffb199)' }} />
                  <div className="relative w-11 h-11 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                    style={{ background: 'linear-gradient(140deg,#E30613 0%,#ff5a5a 55%,#ff9472 100%)' }}>
                    <span className="text-white font-extrabold text-[12.5px] tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{mentor.initials}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-extrabold text-[#1A1A1A] truncate">{mentor.name}</div>
                  <div className="text-[9.5px] text-[#888] font-semibold mt-0.5 truncate">{mentor.designation}</div>
                </div>
              </div>

              {/* date + time row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-[14px] p-3 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.6)' }}>
                  <div className="flex items-center gap-1 text-[8.5px] font-extrabold uppercase tracking-wider text-[#AAA]">
                    <CalendarDays className="w-3 h-3" /> Date
                  </div>
                  <div className="text-[11.5px] font-extrabold text-[#1A1A1A] mt-1">{request.sessionDate || '—'}</div>
                </div>
                <div className="rounded-[14px] p-3 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.6)' }}>
                  <div className="flex items-center gap-1 text-[8.5px] font-extrabold uppercase tracking-wider text-[#AAA]">
                    <Clock3 className="w-3 h-3" /> Time
                  </div>
                  <div className="text-[11.5px] font-extrabold text-[#1A1A1A] mt-1">{request.sessionTime || '—'}</div>
                </div>
              </div>

              {/* mode row */}
              <div className="flex items-center justify-between rounded-[14px] px-3.5 py-2.5 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.6)' }}>
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#555]">
                  <Building2 className="w-3.5 h-3.5 text-[#AAA]" /> {request.mode || 'Offline'}
                </div>
                {meetingStatus && <MeetingStatusBadge status={meetingStatus} countdown={countdown} />}
              </div>

              {meetingStatus && <JoinMeetingButton status={meetingStatus} meetingLink={sharedLink} />}

              {/* Prepare Session Kit */}
              <button
                onClick={() => setPrepareKitOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-[11.5px] font-extrabold transition-all hover:shadow-md active:scale-[0.98]"
                style={{ background: '#EEF2FF', color: '#4338CA', border: '1px solid #E0E7FF' }}
              >
                <ClipboardList className="w-3.5 h-3.5" /> Prepare Session Kit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── COMPLETED FEEDBACK (Timeline Card) ── */}
      {isCompleted && (
        <div className="flex-1 mb-1">
          <div className="relative rounded-[20px] overflow-hidden backdrop-blur-xl"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.97), rgba(255,255,255,0.90))',
              boxShadow: '0 10px 28px -16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg,#16a34a,#22c55e)' }} />
            <div className="px-5 py-4">

              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#16a34a]">Session Completed ✅</div>
                  <div className="text-[11px] font-semibold text-[#555] mt-0.5">{request.topic} · {request.sessionDate}</div>
                </div>
              </div>

              {existingFeedback || feedbackDone ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-[14px]"
                  style={{ background: 'linear-gradient(135deg,#fffbeb,#fef9c3)', border: '1.5px solid rgba(234,179,8,0.25)' }}>
                  <span className="text-[22px]">🌟</span>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#a16207]">Your Rating</div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${
                          s <= (existingFeedback?.rating ?? 0) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#D0D0D0]'
                        }`} />
                      ))}
                      <span className="text-[12px] font-extrabold text-[#92400e] ml-1.5">{existingFeedback?.rating}/5</span>
                    </div>
                    {existingFeedback?.comment && (
                      <div className="text-[10px] text-[#666] font-medium mt-1 italic">"{existingFeedback.comment}"</div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[11px] font-extrabold text-[#1A1A1A] mb-3">Rate your session with <span className="text-[#E30613]">{request.mentor?.name ?? 'your mentor'}</span></div>
                  <div className="flex items-center gap-2 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <button key={s}
                        onMouseEnter={() => setHoverStar(s)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() => handleSubmitFeedback(s)}
                        className="transition-all duration-100 hover:scale-125 active:scale-95">
                        <Star className={`w-8 h-8 transition-colors ${
                          s <= (hoverStar || 0) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#E0E0E0]'
                        }`} />
                      </button>
                    ))}
                    {hoverStar > 0 && (
                      <span className="text-[11px] font-extrabold ml-1 text-[#E30613]">
                        {['','Poor','Fair','Good','Great','Excellent'][hoverStar]}
                      </span>
                    )}
                  </div>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a note (optional)..."
                    rows={2}
                    className="w-full text-[11px] font-medium px-3 py-2.5 rounded-[10px] border border-[#EBEBEB] bg-white resize-none outline-none focus:border-[#22c55e]/40 transition-all"
                  />
                  <p className="text-[9px] text-[#BBB] font-medium mt-1.5">⭐ Tap a star to submit instantly</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PrepareSessionKitModal isOpen={prepareKitOpen} onClose={() => setPrepareKitOpen(false)} request={request} />
    </div>
  );
}

/* ════════════════════════════════════════
   PREPARE SESSION KIT — suggested questions + pre-session checklist
════════════════════════════════════════ */

const SESSION_KIT_QUESTIONS: string[] = [
  'What should I prioritize during my first month?',
  'Which common freshers mistakes can I avoid?',
  "What's one simple next step I can take this week?",
];

const SESSION_KIT_TASKS: { id: string; label: string }[] = [
  { id: 'questions', label: 'Write down your top three questions' },
  { id: 'faqs', label: 'Review common FAQs for fee & finance' },
  { id: 'admission', label: 'Keep your admission details nearby' },
  { id: 'av', label: 'Check audio and video 5 minutes before start' },
];

function PrepareSessionKitModal({ isOpen, onClose, request }: { isOpen: boolean; onClose: () => void; request: MentorshipRequest | null }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) setChecked({});
  }, [isOpen, request?.id]);

  function toggle(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  if (!isOpen || !request) return null;

  const doneCount = SESSION_KIT_TASKS.filter(t => checked[t.id]).length;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>

      {/* ── Header ── */}
      <div className="relative px-5 pt-5 pb-4 shrink-0"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #6366f1 100%)' }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative flex items-center justify-between mb-3">
          <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Prepare Session Kit</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <h2 className="relative text-white text-[16px] font-extrabold mt-0.5 truncate">{request.topic}</h2>
        <p className="relative text-white/50 text-[11px] font-medium mt-0.5">
          {request.mentor ? `with ${request.mentor.name}` : 'Get ready for your session'}{request.sessionDate ? ` · ${request.sessionDate}` : ''}{request.sessionTime ? ` · ${request.sessionTime}` : ''}
        </p>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

        {/* Suggested Questions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: '#EEF2FF' }}>
              <Lightbulb className="w-3.5 h-3.5" style={{ color: '#4f46e5' }} />
            </div>
            <span className="text-[13px] font-extrabold text-[#1A1A1A]">Suggested Questions</span>
          </div>
          <div className="space-y-2">
            {SESSION_KIT_QUESTIONS.map((q, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-[14px] border border-[#E8EAFD] bg-[#F8F9FF] px-3.5 py-3">
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white" style={{ background: '#6366f1' }}>{i + 1}</span>
                <p className="text-[12px] text-[#333] font-medium leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Before Your Session checklist */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: '#FFF7E6' }}>
                <CheckCheck className="w-3.5 h-3.5" style={{ color: '#D97706' }} />
              </div>
              <span className="text-[13px] font-extrabold text-[#1A1A1A]">Before Your Session</span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#888]">{doneCount}/{SESSION_KIT_TASKS.length}</span>
          </div>
          <div className="space-y-2">
            {SESSION_KIT_TASKS.map(task => {
              const isDone = !!checked[task.id];
              return (
                <button key={task.id} onClick={() => toggle(task.id)}
                  className={`w-full flex items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left transition-all ${isDone ? 'border-[#BBF7D0] bg-[#F0FDF4]' : 'border-[#EBEBEB] bg-white hover:bg-[#FAFAFA]'}`}>
                  <span className={`shrink-0 w-5 h-5 rounded-[7px] border-2 flex items-center justify-center transition-all ${isDone ? 'bg-[#22C55E] border-[#22C55E]' : 'border-[#D5D5D5] bg-white'}`}>
                    {isDone && <CheckCheck className="w-3 h-3 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`text-[12px] font-semibold leading-snug ${isDone ? 'text-[#15803D] line-through' : 'text-[#333]'}`}>{task.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 pb-5 pt-3 shrink-0 border-t border-[#F5F5F5]">
        <button onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-white text-[13px] font-extrabold transition-all shadow-md hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg,#4338ca,#6366f1)' }}>
          <CheckCircle2 className="w-4 h-4" /> Done — I'm Ready
        </button>
      </div>
    </ModalOverlay>
  );
}

const MEETING_DURATION_MIN = 30;
const EARLY_ACCESS_MIN = 10;

function parseSessionDateTime(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr || !timeStr) return null;
  const parsed = new Date(`${dateStr} ${timeStr}`);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/** 4-state meeting lifecycle: confirmed (locked) → ready (early access) → in_progress (live) → ended */
function getMeetingStatus(dateStr?: string, timeStr?: string, now: Date = new Date()): 'confirmed' | 'ready' | 'in_progress' | 'ended' | null {
  const start = parseSessionDateTime(dateStr, timeStr);
  if (!start) return null;
  const earlyAccess = new Date(start.getTime() - EARLY_ACCESS_MIN * 60000);
  const end = new Date(start.getTime() + MEETING_DURATION_MIN * 60000);
  if (now < earlyAccess) return 'confirmed';
  if (now >= earlyAccess && now < start) return 'ready';
  if (now >= start && now <= end) return 'in_progress';
  return 'ended';
}

/** Returns ms until session start, for the "starts in Xh Ym" countdown on confirmed sessions */
function getCountdownParts(dateStr?: string, timeStr?: string, now: Date = new Date()): { hours: number; minutes: number } | null {
  const start = parseSessionDateTime(dateStr, timeStr);
  if (!start) return null;
  const diffMs = start.getTime() - now.getTime();
  if (diffMs <= 0) return null;
  const totalMinutes = Math.floor(diffMs / 60000);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

function MeetingStatusBadge({ status, countdown }: { status: 'confirmed' | 'ready' | 'in_progress' | 'ended'; countdown?: { hours: number; minutes: number } | null }) {
  const config = {
    confirmed:   { label: countdown ? `Meeting Locked · Starts in ${countdown.hours}h ${countdown.minutes}m` : 'Meeting Locked', bg: '#F2EFFF', color: '#6D28D9', dotColor: '#8B5CF6', pulse: false },
    ready:       { label: 'Your Meeting is Ready', bg: '#FEF9C3', color: '#854D0E', dotColor: '#EAB308', pulse: true },
    in_progress: { label: 'Meeting in Progress', bg: '#DCFCE7', color: '#15803D', dotColor: '#22C55E', pulse: true },
    ended:       { label: 'Meeting Ended', bg: '#F3F4F6', color: '#6B7280', dotColor: '#9CA3AF', pulse: false },
  }[status];

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold" style={{ background: config.bg, color: config.color }}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.pulse ? 'animate-pulse' : ''}`} style={{ background: config.dotColor }} />
      {config.label}
    </span>
  );
}

function JoinMeetingButton({ status, meetingLink }: { status: 'confirmed' | 'ready' | 'in_progress' | 'ended'; meetingLink?: string | null }) {
  // Enable join as soon as faculty shares a link — even before the scheduled time
  const enabled = !!meetingLink && status !== 'ended';
  const variant = {
    confirmed:   { bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)', label: meetingLink ? 'Join Meeting — Link Ready!' : 'Join Locked — Waiting for link', icon: meetingLink ? <Video className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" /> },
    ready:       { bg: 'linear-gradient(135deg,#EAB308,#CA8A04)', label: meetingLink ? 'Join Meeting' : 'Waiting for link…', icon: <Video className="w-3.5 h-3.5" /> },
    in_progress: { bg: 'linear-gradient(135deg,#22C55E,#16A34A)', label: meetingLink ? 'Join Meeting' : 'Waiting for link…', icon: <Video className="w-3.5 h-3.5" /> },
    ended:       { bg: '', label: 'Meeting Ended', icon: <Video className="w-3.5 h-3.5" /> },
  }[status];

  return (
    <button
      disabled={!enabled}
      onClick={() => { if (enabled && meetingLink) window.open(meetingLink, '_blank'); }}
      className={`flex items-center justify-center gap-1.5 w-full mt-2 px-3 py-2 rounded-[10px] text-[11px] font-extrabold transition-all duration-200 ${
        enabled ? 'text-white hover:shadow-md active:scale-[0.98] cursor-pointer' : 'bg-[#F3F4F6] text-[#B0B0B0] cursor-not-allowed'
      }`}
      style={enabled ? { background: variant.bg } : {}}
    >
      {variant.icon}
      {variant.label}
    </button>
  );
}

function RequestCard({ request }: { request: MentorshipRequest }) {
  const { highlightRequestId, setHighlightRequestId, sessionFeedbacks, submitFeedback, completedSessions, sharedMeetingLinks } = useMentorship();
  const [highlighted, setHighlighted] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackDone, setFeedbackDone] = useState(false);

  const isCompleted = (request.status as string) === 'completed';
  const existingFeedback: SessionFeedback | undefined = sessionFeedbacks.find(f => f.sessionId === request.id);
  const completedSession = completedSessions.find(s => s.id === request.id);

  function handleSubmitFeedback(rating: number) {
    submitFeedback(request.id, rating, comment);
    setFeedbackDone(true);
  }

  useEffect(() => {
    if (highlightRequestId === request.id) {
      setHighlighted(true);
      const t = setTimeout(() => { setHighlighted(false); setHighlightRequestId(null); }, 2200);
      return () => clearTimeout(t);
    }
  }, [highlightRequestId, request.id, setHighlightRequestId]);

  const assigned = request.status === 'assigned';
  const isFaculty = request.type === 'session';
  const meetingStatus = isFaculty && assigned ? getMeetingStatus(request.sessionDate, request.sessionTime) : null;
  const countdown = meetingStatus === 'confirmed' ? getCountdownParts(request.sessionDate, request.sessionTime) : null;
  const sharedLink = sharedMeetingLinks.find(l => l.studentRequestId === request.id)?.link ?? null;

  const theme = isFaculty
    ? {
        accent: '#DC2626',
        light: '#FEF2F2',
        ring: 'rgba(220,38,38,0.35)',
        icon: <GraduationCap className="w-3.5 h-3.5 shrink-0" style={{ color: '#DC2626' }} />,
        assignedLabel: '🟥 Faculty Assigned',
        mentorIcon: <GraduationCap className="w-5 h-5 text-white" />,
        mentorEmoji: '👨\u200d🏫',
        roleLabel: 'Professor',
      }
    : {
        accent: '#2563EB',
        light: '#EFF6FF',
        ring: 'rgba(37,99,235,0.35)',
        icon: <MessageCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#2563EB' }} />,
        assignedLabel: '🟦 Senior Mentor Assigned',
        mentorIcon: null,
        mentorEmoji: '👤',
        roleLabel: 'Senior Mentor',
      };

  return (
    <div
      className={`rounded-[16px] border p-4 transition-all duration-500 ${
        highlighted ? 'shadow-md' : 'border-[#F0F0F0] bg-[#FAFAFA]'
      }`}
      style={{
        borderLeft: `4px solid ${theme.accent}`,
        ...(highlighted ? { borderColor: theme.accent, background: theme.light, boxShadow: `0 0 0 2px ${theme.ring}` } : {}),
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {theme.icon}
            <h4 className="text-[13px] font-extrabold text-[#1A1A1A] truncate">{request.topic}</h4>
          </div>
          <p className="text-[10px] text-[#999] font-medium mt-1">Submitted on {request.dateSubmitted}</p>
        </div>

        {assigned ? (
          <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border"
            style={{ background: theme.light, color: theme.accent, borderColor: `${theme.accent}33` }}>
            {theme.assignedLabel}
          </span>
        ) : (
          <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" /> Pending Assignment
          </span>
        )}
      </div>

      {!assigned && (
        <p className="text-[11px] text-[#888] font-medium mt-2.5 leading-relaxed">
          {isFaculty
            ? 'Our team is finding a suitable faculty mentor for your query. You will be notified within 3–4 hours.'
            : 'Our team is finding a suitable senior mentor for your query. You will be notified within 3–4 hours.'}
        </p>
      )}

      {/* Assignment reveal — tracking card, not communication card */}
      <div className={`grid transition-all duration-500 ease-out ${assigned ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`} style={{ overflow: 'hidden' }}>
        <div className="min-h-0">
          {request.mentor && (
            <div className="rounded-[14px] border p-3.5" style={{ borderColor: `${theme.accent}33`, background: theme.light }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: theme.accent }}>
                  {isFaculty
                    ? theme.mentorIcon
                    : <span className="text-white font-extrabold text-[12px]">{request.mentor.initials}</span>}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-extrabold text-[#1A1A1A]">{theme.mentorEmoji} {request.mentor.name}</div>
                  <div className="text-[10px] text-[#666] font-semibold mt-0.5">{request.mentor.designation}</div>
                  {!isFaculty && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-[10px] font-bold text-[#666]">⭐ {theme.roleLabel}</span>
                    </div>
                  )}
                </div>
              </div>

              {isFaculty ? (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="px-3 py-2 rounded-[10px] bg-white border border-[#F0F0F0]">
                    <div className="text-[9px] font-bold text-[#AAA] uppercase tracking-wider">Session Date</div>
                    <div className="text-[11px] font-bold text-[#1A1A1A] mt-0.5">{request.sessionDate || '—'}</div>
                  </div>
                  <div className="px-3 py-2 rounded-[10px] bg-white border border-[#F0F0F0]">
                    <div className="text-[9px] font-bold text-[#AAA] uppercase tracking-wider">Session Time</div>
                    <div className="text-[11px] font-bold text-[#1A1A1A] mt-0.5">{request.sessionTime || '—'}</div>
                  </div>
                  <div className="px-3 py-2 rounded-[10px] bg-white border border-[#F0F0F0] col-span-2">
                    <div className="text-[9px] font-bold text-[#AAA] uppercase tracking-wider">Mode</div>
                    <div className="text-[11px] font-bold text-[#1A1A1A] mt-0.5">{request.mode || 'Offline'}</div>
                  </div>
                  {meetingStatus && (
                    <div className="col-span-2 flex items-center justify-between mt-1">
                      <MeetingStatusBadge status={meetingStatus} countdown={countdown} />
                    </div>
                  )}
                  {meetingStatus && (
                    <div className="col-span-2">
                      <JoinMeetingButton status={meetingStatus} meetingLink={sharedLink} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-3 px-3 py-2 rounded-[10px] bg-white border border-[#F0F0F0]">
                  <Clock3 className="w-3 h-3 shrink-0" style={{ color: theme.accent }} />
                  <span className="text-[10px] font-bold text-[#444]">📅 {request.mentor.availability}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── COMPLETED + FEEDBACK ── */}
      {isCompleted && (
        <div className="mt-3">
          {/* Completed banner */}
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-[14px] mb-3"
            style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid rgba(34,197,94,0.25)' }}>
            <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#16a34a]">Session Completed ✅</div>
              <div className="text-[11px] font-semibold text-[#555] mt-0.5">How was your mentoring experience?</div>
            </div>
          </div>

          {/* Feedback UI */}
          {existingFeedback || feedbackDone ? (
            // Already rated
            <div className="flex items-center gap-3 px-4 py-3 rounded-[14px]"
              style={{ background: 'linear-gradient(135deg,#fffbeb,#fef9c3)', border: '1.5px solid rgba(234,179,8,0.25)' }}>
              <span className="text-[22px]">🌟</span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#a16207]">Your Rating</div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s}
                      className={`w-4 h-4 ${
                        s <= (existingFeedback?.rating ?? 0)
                          ? 'fill-[#f59e0b] text-[#f59e0b]'
                          : 'text-[#D0D0D0]'
                      }`} />
                  ))}
                  <span className="text-[12px] font-extrabold text-[#92400e] ml-1.5">{existingFeedback?.rating}/5</span>
                </div>
                {existingFeedback?.comment && (
                  <div className="text-[10px] text-[#666] font-medium mt-1 italic">"{existingFeedback.comment}"</div>
                )}
              </div>
            </div>
          ) : (
            // Rate now
            <div className="rounded-[16px] border border-[#F0F0F0] overflow-hidden"
              style={{ background: '#FAFAFA' }}>
              <div className="px-4 pt-4 pb-3">
                <div className="text-[11px] font-extrabold text-[#1A1A1A] mb-3">Rate your session with <span style={{ color: theme.accent }}>{request.mentor?.name ?? 'your mentor'}</span></div>

                {/* Stars */}
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <button key={s}
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => handleSubmitFeedback(s)}
                      className="transition-all duration-100 hover:scale-125 active:scale-95">
                      <Star className={`w-8 h-8 transition-colors ${
                        s <= (hoverStar || 0)
                          ? 'fill-[#f59e0b] text-[#f59e0b]'
                          : 'text-[#E0E0E0]'
                      }`} />
                    </button>
                  ))}
                  {hoverStar > 0 && (
                    <span className="text-[11px] font-extrabold ml-1" style={{ color: theme.accent }}>
                      {['','Poor','Fair','Good','Great','Excellent'][hoverStar]}
                    </span>
                  )}
                </div>

                {/* Optional comment */}
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a note (optional)..."
                  rows={2}
                  className="w-full text-[11px] font-medium px-3 py-2.5 rounded-[10px] border border-[#EBEBEB] bg-white resize-none outline-none focus:border-[#E30613]/30 focus:ring-1 focus:ring-[#E30613]/10 transition-all"
                />
                <p className="text-[9px] text-[#BBB] font-medium mt-1.5">Tap a star to submit instantly</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   MODAL OVERLAY — fixed, centered, locks scroll
════════════════════════════════════════ */
function ModalOverlay({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="animate-modalFadeIn"
      style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', overflow: 'hidden' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-[24px] shadow-2xl flex flex-col animate-modalScaleIn"
        style={{ maxWidth: 520, width: 'calc(100% - 32px)', maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {children}
      </div>
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-modalFadeIn { animation: modalFadeIn 0.2s ease-out forwards; }
        .animate-modalScaleIn { animation: modalScaleIn 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
      `}</style>
    </div>,
    document.body
  );
}

/* ════════════════════════════════════════
   BOOK SESSION MODAL — 4-step flow
════════════════════════════════════════ */
const HELP_CATEGORIES = [
  { id: 'academics',   label: 'Academics',     subline: 'Courses, exams & syllabus',     icon: BookOpen,   color: '#3b82f6', bg: '#eff6ff', emoji: '📚' },
  { id: 'placements',  label: 'Placements',    subline: 'Career & Internship',           icon: Briefcase,  color: '#f59e0b', bg: '#fffbeb', emoji: '💼' },
  { id: 'hostel',      label: 'Hostel Life',   subline: 'Room, Mess & campus living',    icon: Home,       color: '#22c55e', bg: '#f0fdf4', emoji: '🏠' },
  { id: 'campus',      label: 'Campus Life',   subline: 'Clubs, events & societies',     icon: PartyPopper,color: '#e879f9', bg: '#fdf4ff', emoji: '🎉' },
  { id: 'finance',     label: 'Fee & Finance', subline: 'Scholarships & payments',       icon: Wallet,     color: '#06b6d4', bg: '#ecfeff', emoji: '💳' },
  { id: 'scholarship', label: 'Scholarship',   subline: 'Grants & financial aid',        icon: Award,      color: '#f97316', bg: '#fff7ed', emoji: '🏆' },
];

const CALENDAR_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CALENDAR_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function getAvailableDates(y: number, m: number): Set<number> {
  const avail = new Set<number>();
  const today = new Date(); today.setHours(0,0,0,0);
  for (let d = 1; d <= getDaysInMonth(y, m); d++) {
    const dt = new Date(y, m, d);
    const dow = dt.getDay();
    if (dow >= 1 && dow <= 5 && dt > today && (dt.getTime() - today.getTime()) / 86400000 <= 30) avail.add(d);
  }
  return avail;
}

const TIME_OPTIONS = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM'];
const BOOKED_TIMES = new Set(['9:30 AM','11:00 AM','2:30 PM','4:00 PM']);

function BookSessionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addRequest, scrollToMyRequests } = useMentorship();
  const [step, setStep] = useState(1); // 1=category 2=details 3=date 4=time 5=success
  const [selectedCategory, setSelectedCategory] = useState('');
  const [detailsMessage, setDetailsMessage] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [parentMayJoin, setParentMayJoin] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const availDates = getAvailableDates(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);

  const fmtDate = (d: number) => `${CALENDAR_MONTHS[viewMonth]} ${d}, ${viewYear}`;
  const isSelDate = (d: number) => selectedDate === fmtDate(d);

  function reset() {
    setStep(1); setSelectedCategory(''); setDetailsMessage('');
    setPreferredLanguage('English'); setParentMayJoin(false);
    setSelectedDate(''); setSelectedTime('');
    setBooking(false); setRequestId(null);
  }
  function handleClose() { reset(); onClose(); }

  function handleBook() {
    setBooking(true);
    setTimeout(() => {
      setBooking(false);
      const categoryLabel = HELP_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'General Help';
      const id = addRequest(categoryLabel, 'session', {
        sessionDate: selectedDate,
        sessionTime: selectedTime,
        mode: 'Offline',
      });
      setRequestId(id);
      setStep(5);
    }, 1600);
  }

  const canProceed = () => {
    if (step === 1) return !!selectedCategory;
    if (step === 2) return !!detailsMessage.trim();
    if (step === 3) return !!selectedDate;
    if (step === 4) return !!selectedTime;
    return false;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 shrink-0"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d0a0a 50%, #E30613 100%)' }}>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative flex items-center justify-between mb-3">
            <div className="flex gap-1.5">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step && step < 5 ? 'bg-white' : i < step || step === 5 ? 'bg-white' : 'bg-white/25'}`}
                  style={{ width: i === (step < 5 ? step : 4) && step < 5 ? 24 : 8 }} />
              ))}
            </div>
            <button onClick={handleClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="relative">
            {step === 1 && <><p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Step 1 of 4</p><h2 className="text-white text-[18px] font-extrabold mt-0.5">What Would You Like Help With?</h2></>}
            {step === 2 && <><p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Step 2 of 4</p><h2 className="text-white text-[18px] font-extrabold mt-0.5">{HELP_CATEGORIES.find(c => c.id === selectedCategory)?.label}</h2></>}
            {step === 3 && <><p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Step 3 of 4</p><h2 className="text-white text-[18px] font-extrabold mt-0.5">Choose a Date</h2></>}
            {step === 4 && <><p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Step 4 of 4</p><h2 className="text-white text-[18px] font-extrabold mt-0.5">Select a Time</h2></>}
            {step === 5 && <h2 className="text-white text-[18px] font-extrabold">Session Requested!</h2>}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {/* ── STEP 3: CALENDAR ── */}
          {step === 3 && (
            <div className="rounded-[20px] overflow-hidden" style={{ background: 'linear-gradient(160deg,#0f0c29,#1a1a2e,#2d0a0a)' }}>

              {/* Month nav */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <button
                  onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <ChevronLeft className="w-4 h-4 text-white/70" />
                </button>

                <div className="text-center">
                  <div className="text-[15px] font-extrabold text-white tracking-tight">
                    {['January','February','March','April','May','June','July','August','September','October','November','December'][viewMonth]}
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{viewYear}</div>
                </div>

                <button
                  onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 px-4 mb-1">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d, i) => (
                  <div key={i} className="text-center py-2 text-[10px] font-bold"
                    style={{ color: i === 0 || i === 6 ? 'rgba(255,255,255,0.2)' : 'rgba(227,6,19,0.8)' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-[3px] px-4 pb-4">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const avail = availDates.has(d);
                  const sel = isSelDate(d);
                  const isToday = new Date().getDate() === d && new Date().getMonth() === viewMonth && new Date().getFullYear() === viewYear;
                  return (
                    <button
                      key={d}
                      onClick={() => avail && setSelectedDate(fmtDate(d))}
                      disabled={!avail}
                      className="aspect-square flex flex-col items-center justify-center rounded-[10px] transition-all duration-150 relative"
                      style={
                        sel
                          ? { background: 'linear-gradient(135deg,#E30613,#ff4d5e)', boxShadow: '0 0 16px rgba(227,6,19,0.6)', transform: 'scale(1.1)' }
                          : avail
                            ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }
                            : {}
                      }
                    >
                      <span className={`text-[12px] font-bold leading-none ${
                        sel ? 'text-white' :
                        avail ? 'text-white/80' :
                        'text-white/15'
                      }`}>{d}</span>

                      {/* Today ring */}
                      {isToday && !sel && (
                        <span className="absolute inset-0 rounded-[10px]" style={{ border: '1.5px solid rgba(227,6,19,0.6)' }} />
                      )}

                      {/* Available dot */}
                      {avail && !sel && (
                        <span className="w-1 h-1 rounded-full mt-[2px]" style={{ background: 'rgba(227,6,19,0.5)' }} />
                      )}

                      {/* Selected checkmark */}
                      {sel && (
                        <span className="text-white/80 text-[7px] font-black mt-[1px]">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected date banner — inside the dark card */}
              {selectedDate && (
                <div className="mx-4 mb-4 flex items-center gap-3 px-4 py-3 rounded-[14px]"
                  style={{ background: 'rgba(227,6,19,0.15)', border: '1px solid rgba(227,6,19,0.3)' }}>
                  <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#E30613,#ff4d5e)' }}>
                    <CalendarDays className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: 'rgba(255,100,100,0.8)' }}>📅 Date Selected</div>
                    <div className="text-[13px] font-extrabold text-white mt-0.5">{selectedDate}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: 'rgba(34,197,94,0.9)' }} />
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center gap-5 px-5 pb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(227,6,19,0.5)' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-[5px]" style={{ background: 'linear-gradient(135deg,#E30613,#ff4d5e)' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-[5px]" style={{ border: '1.5px solid rgba(227,6,19,0.6)', background: 'transparent' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Today</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: TIME ── */}
          {step === 4 && (
            <div className="space-y-5">

              {/* Date pill */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg,#fff5f5,#ffe4e4)', border: '1px solid rgba(227,6,19,0.15)' }}>
                  <CalendarDays className="w-3.5 h-3.5 text-[#E30613]" />
                  <span className="text-[12px] font-bold text-[#E30613]">{selectedDate}</span>
                </div>
              </div>

              {/* ─── AVAILABLE SLOTS ─── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-sm" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
                  <span className="text-[11px] font-extrabold text-[#1A1A1A] uppercase tracking-wider">Available</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#22c55e] border border-[#22c55e]/20">
                    {TIME_OPTIONS.filter(t => !BOOKED_TIMES.has(t)).length} slots
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {TIME_OPTIONS.filter(t => !BOOKED_TIMES.has(t)).map(t => {
                    const sel = selectedTime === t;
                    const [time, period] = t.split(' ');
                    return (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        className="relative flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-200 text-left overflow-hidden"
                        style={sel
                          ? { background: 'linear-gradient(135deg,#E30613,#ff4d5e)', boxShadow: '0 6px 20px rgba(227,6,19,0.3)', transform: 'scale(1.02)' }
                          : { background: '#FAFAFA', border: '1.5px solid #F0F0F0' }
                        }>
                        {/* time block */}
                        <div className="flex flex-col">
                          <span className={`text-[15px] font-extrabold leading-none ${sel ? 'text-white' : 'text-[#1A1A1A]'}`}>{time}</span>
                          <span className={`text-[10px] font-bold mt-0.5 ${sel ? 'text-white/70' : 'text-[#999]'}`}>{period}</span>
                        </div>
                        {/* selected check */}
                        {sel && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-white/25 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#F0F0F0]" />
                <span className="text-[10px] font-bold text-[#CCC] uppercase tracking-wider">Unavailable</span>
                <div className="flex-1 h-px bg-[#F0F0F0]" />
              </div>

              {/* ─── FULL / BOOKED SLOTS ─── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]/60" />
                  <span className="text-[11px] font-extrabold text-[#999] uppercase tracking-wider">Full</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fff1f2] text-[#f43f5e]/70 border border-[#f43f5e]/10">
                    {BOOKED_TIMES.size} slots
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {TIME_OPTIONS.filter(t => BOOKED_TIMES.has(t)).map(t => {
                    const [time, period] = t.split(' ');
                    return (
                      <div key={t}
                        className="relative flex items-center gap-3 px-4 py-3 rounded-[16px] overflow-hidden"
                        style={{ background: '#FAFAFA', border: '1.5px dashed #EBEBEB', opacity: 0.7 }}>
                        <div className="flex flex-col">
                          <span className="text-[15px] font-extrabold leading-none text-[#CCC] line-through">{time}</span>
                          <span className="text-[10px] font-bold mt-0.5 text-[#DDD]">{period}</span>
                        </div>
                        <span className="ml-auto text-[9px] font-extrabold px-2 py-1 rounded-full bg-[#f43f5e]/8 text-[#f43f5e]/60">Full</span>
                        {/* lock icon */}
                        <div className="absolute top-2 right-2">
                          <Lock className="w-3 h-3 text-[#DDD]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected banner */}
              {selectedTime && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-[16px]"
                  style={{ background: 'linear-gradient(135deg,#fff5f5,#ffe4e4)', border: '1.5px solid rgba(227,6,19,0.2)' }}>
                  <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#E30613,#ff4d5e)' }}>
                    <Clock3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#E30613]/70">⏰ Time Locked In</div>
                    <div className="text-[14px] font-extrabold text-[#1A1A1A]">{selectedTime}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-[#22c55e]" />
                </div>
              )}
            </div>
          )}

          {/* ── STEP 1: CATEGORY ── */}
          {step === 1 && (
            <div>
              <p className="text-[12px] text-[#888] mb-4">Select the area you'd like guidance on</p>
              <div className="grid grid-cols-2 gap-3">
                {HELP_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const sel = selectedCategory === cat.id;
                  return (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                      className={`relative text-left p-4 rounded-[18px] border-2 transition-all duration-200 overflow-hidden group
                        ${sel
                          ? 'border-transparent shadow-lg scale-[0.98]'
                          : 'border-[#F0F0F0] bg-white hover:border-transparent hover:shadow-md hover:scale-[0.99]'
                        }`}
                      style={sel ? { background: cat.bg, borderColor: cat.color + '40', boxShadow: `0 8px 24px ${cat.color}25` } : {}}>

                      {/* Selected checkmark */}
                      {sel && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                          style={{ background: cat.color }}>
                          <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}

                      {/* Icon box */}
                      <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-3 transition-all duration-200"
                        style={{ background: sel ? cat.color : cat.bg }}>
                        <Icon className="w-5 h-5" style={{ color: sel ? 'white' : cat.color }} />
                      </div>

                      <div className={`text-[13px] font-extrabold leading-tight transition-colors ${sel ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>
                        {cat.emoji} {cat.label}
                      </div>
                      <div className="text-[10.5px] text-[#999] font-medium mt-1 leading-snug">{cat.subline}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: DETAILS ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-[12.5px] font-bold text-[#1A1A1A] mb-2 leading-snug">Share a little more so your future mentor comes prepared</p>
                <textarea
                  value={detailsMessage}
                  onChange={e => setDetailsMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows={4}
                  maxLength={300}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[12px] text-[12px] text-[#1A1A1A] placeholder:text-[#CCC] resize-none focus:outline-none focus:border-[#E30613]/40 focus:bg-white transition-all"
                />
                <div className="text-right text-[10px] text-[#CCC] mt-1">{detailsMessage.length}/300</div>
              </div>

              <div>
                <p className="text-[10px] font-extrabold text-[#666] uppercase tracking-[0.1em] mb-2">Preferred Language</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Hindi','English','Punjabi'].map(lang => {
                    const sel = preferredLanguage === lang;
                    return (
                      <button key={lang} onClick={() => setPreferredLanguage(lang)}
                        className={`py-2.5 rounded-[12px] text-[12px] font-bold border transition-all duration-150
                          ${sel ? 'text-white border-transparent shadow-md' : 'bg-[#FAFAFA] border-[#EBEBEB] text-[#1A1A1A] hover:border-[#E30613]/30 hover:text-[#E30613] hover:bg-[#FFF0F0]'}`}
                        style={sel ? { background: 'linear-gradient(135deg, #E30613, #ff4d5e)' } : {}}>
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-[14px] border border-[#EBEBEB] bg-[#FAFAFA]">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold text-[#1A1A1A]">A Parent May Join</p>
                  <p className="text-[10.5px] text-[#999] font-medium mt-0.5 leading-snug">Your mentor will make a space for family questions.</p>
                </div>
                <button
                  onClick={() => setParentMayJoin(p => !p)}
                  aria-pressed={parentMayJoin}
                  className={`shrink-0 w-11 h-6 rounded-full relative transition-colors duration-200 ${parentMayJoin ? 'bg-[#E30613]' : 'bg-[#DDD]'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${parentMayJoin ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#F5F5F5]">
                <Lock className="w-3.5 h-3.5 text-[#AAA] shrink-0 mt-0.5" />
                <p className="text-[10.5px] text-[#999] font-medium leading-relaxed">Your message stays private and is shared only with your assigned expert after confirmation.</p>
              </div>
            </div>
          )}

          {/* ── STEP 5: SUCCESS ── */}
          {step === 5 && (() => {
            const cat = HELP_CATEGORIES.find(c => c.id === selectedCategory);
            return (
              <div className="-mx-5 -mt-5">

                {/* ── Hero banner ── */}
                <div className="relative overflow-hidden px-6 pt-8 pb-6 flex flex-col items-center text-center"
                  style={{ background: 'linear-gradient(160deg,#0f0c29 0%,#1a1a2e 50%,#2d0a0a 100%)' }}>

                  {/* floating confetti dots */}
                  {['#E30613','#ff4d5e','#f59e0b','#22c55e','#3b82f6','#e879f9'].map((c,i) => (
                    <span key={i} className="absolute rounded-full animate-bounce"
                      style={{
                        width: 6+i*2, height: 6+i*2, background: c, opacity: 0.5,
                        top: `${10+i*12}%`, left: i%2===0 ? `${8+i*5}%` : `${75-i*5}%`,
                        animationDelay: `${i*0.2}s`, animationDuration: `${1.5+i*0.3}s`
                      }} />
                  ))}

                  {/* big emoji in glowing ring */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-[36px]"
                      style={{ background: 'rgba(227,6,19,0.15)', border: '2px solid rgba(227,6,19,0.3)', boxShadow: '0 0 32px rgba(227,6,19,0.25)' }}>
                      🎉
                    </div>
                    {/* pulse ring */}
                    <div className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: 'rgba(227,6,19,0.08)', animationDuration: '2s' }} />
                  </div>

                  <h3 className="text-[22px] font-extrabold text-white tracking-tight">You're All Set!</h3>
                  <p className="text-[12px] mt-1.5 leading-relaxed max-w-[240px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Faculty mentor will be assigned within <span className="text-white font-bold">3–4 hours</span>.
                    We'll notify you instantly.
                  </p>
                </div>

                {/* ── Booking summary card ── */}
                <div className="mx-5 mt-4 mb-2 rounded-[18px] overflow-hidden border border-[#F0F0F0]">

                  {/* card header */}
                  <div className="flex items-center gap-3 px-4 py-3"
                    style={{ background: cat ? cat.bg : '#fafafa', borderBottom: '1px solid #F0F0F0' }}>
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[16px]"
                      style={{ background: cat ? cat.color : '#E30613', boxShadow: cat ? `0 4px 12px ${cat.color}40` : undefined }}>
                      {cat?.emoji ?? '📌'}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cat?.color ?? '#E30613' }}>Help Topic</div>
                      <div className="text-[13px] font-extrabold text-[#1A1A1A]">{cat?.label ?? 'General'}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0fdf4] border border-[#22c55e]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      <span className="text-[10px] font-extrabold text-[#22c55e]">Pending</span>
                    </div>
                  </div>

                  {/* rows */}
                  {[
                    { icon: '📅', l: 'Date',     v: selectedDate },
                    { icon: '⏰', l: 'Time',     v: selectedTime },
                    { icon: '🗣️', l: 'Language', v: preferredLanguage },
                    ...(parentMayJoin ? [{ icon: '👨‍👩‍👧', l: 'Parent', v: 'May join the session' }] : []),
                    ...(detailsMessage.trim() ? [{ icon: '💬', l: 'Note', v: detailsMessage.trim() }] : []),
                  ].map((row, i, arr) => (
                    <div key={row.l}
                      className="flex items-start gap-3 px-4 py-3"
                      style={{ background: i % 2 === 0 ? '#FAFAFA' : '#FFFFFF', borderBottom: i < arr.length-1 ? '1px solid #F5F5F5' : 'none' }}>
                      <span className="text-[14px] shrink-0 mt-0.5">{row.icon}</span>
                      <span className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider w-14 shrink-0 pt-0.5">{row.l}</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A] leading-snug">{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 shrink-0 border-t border-[#F5F5F5]">
          {step < 5 && (
            <div className="flex gap-2.5">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-[12px] border border-[#EBEBEB] text-[#555] text-[13px] font-semibold hover:bg-[#F5F5F5] transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button
                onClick={() => { if (step < 4) setStep(s => s + 1); else handleBook(); }}
                disabled={!canProceed() || booking}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-extrabold transition-all duration-200 ${canProceed() && !booking ? 'text-white shadow-md hover:shadow-lg' : 'bg-[#F0F0F0] text-[#CCC] cursor-not-allowed'}`}
                style={canProceed() && !booking ? { background: 'linear-gradient(135deg, #E30613, #ff4d5e)' } : {}}>
                {booking ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Booking...</>
                ) : step === 4 ? (
                  <><CheckCheck className="w-4 h-4" /> Book Session</>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
          {step === 5 && (
            <div className="flex gap-2.5">
              <button onClick={handleClose}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-[14px] border-2 border-[#EBEBEB] text-[#555] text-[13px] font-extrabold hover:bg-[#F5F5F5] transition-all">
                🏠 Dashboard
              </button>
              <button onClick={() => { scrollToMyRequests(requestId ?? undefined); handleClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-white text-[13px] font-extrabold transition-all shadow-lg"
                style={{ background: 'linear-gradient(135deg,#E30613,#ff4d5e)', boxShadow: '0 6px 20px rgba(227,6,19,0.3)' }}>
                View My Requests <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
    </ModalOverlay>
  );
}

/* ════════════════════════════════════════
   TALK TO A SENIOR MODAL — choose area → profile → live chat
════════════════════════════════════════ */

interface SeniorArea {
  id: string;
  label: string;
  subline: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
  mentorName: string;
  mentorInitials: string;
  mentorYear: string;
  mentorBio: string;
  mentorTags: string[];
  firstMessage: string;
}

const SENIOR_AREAS: SeniorArea[] = [
  {
    id: 'hostel',
    label: 'Hostel Mentor',
    subline: 'Rooms, mess & daily campus living',
    icon: <Home className="w-5 h-5" />,
    accent: '#22c55e',
    bg: '#f0fdf4',
    mentorName: 'Ananya Kapoor',
    mentorInitials: 'AK',
    mentorYear: '3rd Year, CSE (AI & ML)',
    mentorBio: 'Hostel resident since first year, currently a hostel committee member. Can help with room settling-in, mess timings, laundry, local essentials and weekend routines.',
    mentorTags: ['Hostel Life', 'Daily Routine', 'Local Tips'],
    firstMessage: "Hi! I'm here to help. What's making you feel uncertain about hostel life?",
  },
  {
    id: 'placement',
    label: 'Placement Expert',
    subline: 'Resume, interviews & internships',
    icon: <Briefcase className="w-5 h-5" />,
    accent: '#f59e0b',
    bg: '#fffbeb',
    mentorName: 'Rahul Sharma',
    mentorInitials: 'RS',
    mentorYear: '4th Year, CSE (AI & ML)',
    mentorBio: 'Placed in two internships and currently mentoring juniors on resumes, DSA prep and interview rounds. Knows exactly what recruiters look for in first-year to final-year students.',
    mentorTags: ['Resume Review', 'DSA Prep', 'Mock Interviews'],
    firstMessage: "Hi! I'm here to help. What's making you feel uncertain about placements?",
  },
  {
    id: 'culture',
    label: 'Culture Lead',
    subline: 'Clubs, events & student communities',
    icon: <PartyPopper className="w-5 h-5" />,
    accent: '#e879f9',
    bg: '#fdf4ff',
    mentorName: 'Simran Kaur',
    mentorInitials: 'SK',
    mentorYear: '3rd Year, CSE (AI & ML)',
    mentorBio: 'Core member of three student societies and event lead for two fests. Can guide you on which clubs fit your interests and how to get involved from semester one.',
    mentorTags: ['Clubs & Fests', 'Networking', 'Campus Events'],
    firstMessage: "Hi! I'm here to help. What's making you feel uncertain about campus culture?",
  },
  {
    id: 'academic',
    label: 'Academic Guide',
    subline: 'Courses, electives & study planning',
    icon: <BookOpen className="w-5 h-5" />,
    accent: '#2563eb',
    bg: '#eff6ff',
    mentorName: 'Dev Malhotra',
    mentorInitials: 'DM',
    mentorYear: '4th Year, CSE (AI & ML)',
    mentorBio: 'Topper of his batch for two consecutive years. Helps juniors plan electives, manage credit load and build a realistic semester-wise study routine.',
    mentorTags: ['Course Planning', 'Study Tips', 'Electives'],
    firstMessage: "Hi! I'm here to help. What's making you feel uncertain about your academics?",
  },
];

interface ChatMessage {
  id: string;
  from: 'senior' | 'student';
  text: string;
  time: string;
}

function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

function TalkToSeniorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addRequest } = useMentorship();

  const [view, setView] = useState<'areas' | 'profile' | 'chat'>('areas');
  const [selectedArea, setSelectedArea] = useState<SeniorArea | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function reset() {
    setView('areas'); setSelectedArea(null); setMessages([]); setDraft('');
  }
  function handleClose() { reset(); onClose(); }

  function openProfile(area: SeniorArea) {
    setSelectedArea(area);
    setView('profile');
  }

  function handleConnect(area: SeniorArea) {
    setSelectedArea(area);
    setMessages([{ id: `M-${Date.now()}`, from: 'senior', text: area.firstMessage, time: nowTime() }]);
    addRequest(area.label, 'senior');
    setView('chat');
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: `M-${Date.now()}`, from: 'student', text, time: nowTime() }]);
    setDraft('');
  }

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>

      {/* ── Header ── */}
      <div className="relative px-5 pt-5 pb-4 shrink-0"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%)' }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative flex items-center justify-between mb-3">
          {view !== 'areas' ? (
            <button
              onClick={() => setView(view === 'chat' ? 'areas' : 'areas')}
              className="flex items-center gap-1 text-white/70 text-[11px] font-bold hover:text-white transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" /> Areas
            </button>
          ) : <span />}
          <button onClick={handleClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div className="relative">
          {view === 'areas' && (
            <>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Talk to a Senior</p>
              <h2 className="text-white text-[18px] font-extrabold mt-0.5">What do you need guidance on?</h2>
              <p className="text-white/50 text-[11px] font-medium mt-0.5">Choose an area and connect with a senior in that space</p>
            </>
          )}
          {view === 'profile' && selectedArea && (
            <>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{selectedArea.label}</p>
              <h2 className="text-white text-[18px] font-extrabold mt-0.5">{selectedArea.mentorName}</h2>
              <p className="text-white/50 text-[11px] font-medium mt-0.5">{selectedArea.mentorYear}</p>
            </>
          )}
          {view === 'chat' && selectedArea && (
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-white/30"
                  style={{ background: 'linear-gradient(140deg,#2563eb,#60a5fa,#93c5fd)' }}>
                  <span className="text-white font-extrabold text-[11px]">{selectedArea.mentorInitials}</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-[#1e3a5f]" />
              </div>
              <div>
                <h2 className="text-white text-[14px] font-extrabold leading-tight">{selectedArea.mentorName}</h2>
                <p className="text-white/50 text-[10.5px] font-medium">{selectedArea.label} · Online</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      {view === 'areas' && (
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            {SENIOR_AREAS.map(area => (
              <div key={area.id}
                className="relative rounded-[18px] border border-[#F0F0F0] bg-white p-4 hover:shadow-md transition-all duration-200 flex flex-col">
                <div className="w-11 h-11 rounded-[13px] flex items-center justify-center mb-3"
                  style={{ background: area.bg, color: area.accent }}>
                  {area.icon}
                </div>
                <h4 className="text-[13px] font-extrabold text-[#1A1A1A] leading-tight">{area.label}</h4>
                <p className="text-[10.5px] text-[#999] font-medium mt-1 leading-snug flex-1">{area.subline}</p>

                <div className="flex items-center gap-2 mt-3 mb-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(140deg, ${area.accent}, ${area.accent}99)` }}>
                    <span className="text-white font-extrabold text-[9px]">{area.mentorInitials}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold text-[#1A1A1A] truncate">{area.mentorName}</div>
                    <div className="text-[8.5px] text-[#AAA] font-semibold truncate">{area.mentorYear}</div>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button onClick={() => openProfile(area)}
                    className="flex-1 py-2 rounded-[10px] border border-[#EBEBEB] text-[#555] text-[10.5px] font-bold hover:bg-[#F5F5F5] transition-colors">
                    Profile
                  </button>
                  <button onClick={() => handleConnect(area)}
                    className="flex-1 py-2 rounded-[10px] text-white text-[10.5px] font-extrabold transition-all hover:shadow-md"
                    style={{ background: area.accent }}>
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'profile' && selectedArea && (
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-16 h-16 shrink-0">
              <div className="absolute inset-0 rounded-full blur-[6px] opacity-50" style={{ background: selectedArea.accent }} />
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                style={{ background: `linear-gradient(140deg, ${selectedArea.accent}, ${selectedArea.accent}99)` }}>
                <span className="text-white font-extrabold text-[18px]">{selectedArea.mentorInitials}</span>
              </div>
            </div>
            <div>
              <h3 className="text-[16px] font-extrabold text-[#1A1A1A]">{selectedArea.mentorName}</h3>
              <p className="text-[11px] text-[#888] font-semibold mt-0.5">{selectedArea.mentorYear}</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold"
                style={{ background: selectedArea.bg, color: selectedArea.accent }}>
                {selectedArea.label}
              </span>
            </div>
          </div>

          <p className="text-[12px] text-[#555] font-medium leading-relaxed mb-5">{selectedArea.mentorBio}</p>

          <p className="text-[10px] font-extrabold text-[#AAA] uppercase tracking-[0.08em] mb-2">Can help with</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedArea.mentorTags.map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-[10.5px] font-bold border"
                style={{ background: selectedArea.bg, color: selectedArea.accent, borderColor: `${selectedArea.accent}30` }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {view === 'chat' && selectedArea && (
        <div className="flex-1 overflow-y-auto px-5 py-5 bg-[#FAFAFA]">
          <div className="space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-[16px] ${
                  m.from === 'student'
                    ? 'text-white rounded-br-[4px]'
                    : 'bg-white border border-[#F0F0F0] text-[#1A1A1A] rounded-bl-[4px]'
                }`}
                  style={m.from === 'student' ? { background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' } : {}}>
                  <p className="text-[12.5px] font-medium leading-relaxed">{m.text}</p>
                  <p className={`text-[9px] font-semibold mt-1 ${m.from === 'student' ? 'text-white/60' : 'text-[#AAA]'}`}>{m.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      {view === 'profile' && selectedArea && (
        <div className="px-5 pb-5 pt-3 shrink-0 border-t border-[#F5F5F5]">
          <button onClick={() => handleConnect(selectedArea)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-white text-[13px] font-extrabold transition-all shadow-md hover:shadow-lg"
            style={{ background: selectedArea.accent }}>
            <MessageCircle className="w-4 h-4" /> Connect & Start Chat
          </button>
        </div>
      )}

      {view === 'chat' && (
        <div className="px-5 pb-5 pt-3 shrink-0 border-t border-[#F5F5F5]">
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[14px] text-[12.5px] text-[#1A1A1A] placeholder:text-[#CCC] focus:outline-none focus:border-[#2563eb]/40 focus:bg-white transition-all"
            />
            <button onClick={sendMessage} disabled={!draft.trim()}
              className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-all ${
                draft.trim() ? 'text-white shadow-md hover:shadow-lg active:scale-95' : 'bg-[#F0F0F0] text-[#CCC] cursor-not-allowed'
              }`}
              style={draft.trim() ? { background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' } : {}}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ModalOverlay>
  );
}

/* ════════════════════════════════════════
   READY FOR CAMPUS — pre-arrival checklist
════════════════════════════════════════ */

interface CampusChecklistSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
  tasks: string[];
  note?: string;
}

const CAMPUS_CHECKLIST_SECTIONS: CampusChecklistSection[] = [
  {
    id: 'academic',
    title: 'Academic Documents',
    icon: <FileText className="w-4 h-4" />,
    accent: '#2563eb',
    bg: '#eff6ff',
    tasks: ['Abbreviation', 'Migration letter', 'Character certificates', 'Any diploma', 'Passport size photos', 'Class 10 and 12 marksheet'],
    note: 'All documents should be original',
  },
  {
    id: 'hostel',
    title: 'Hostel Readiness',
    icon: <Home className="w-4 h-4" />,
    accent: '#22c55e',
    bg: '#f0fdf4',
    tasks: ['Hostel allocation letter', 'Emergency contact details', 'Medical information', 'Packing essentials received'],
  },
  {
    id: 'firstday',
    title: 'Before First Day',
    icon: <Compass className="w-4 h-4" />,
    accent: '#f59e0b',
    bg: '#fffbeb',
    tasks: ['Orientation schedule read', 'Campus map viewed', 'Important contacts saved', 'University email activated'],
  },
  {
    id: 'carry',
    title: 'Things to Carry',
    icon: <Briefcase className="w-4 h-4" />,
    accent: '#8b5cf6',
    bg: '#f5f3ff',
    tasks: ['Original documents', 'Photocopies', 'Medical records', 'Hostel records'],
  },
  {
    id: 'remember',
    title: 'Things to Remember',
    icon: <Zap className="w-4 h-4" />,
    accent: '#E30613',
    bg: '#fff0f0',
    tasks: ['Fee deadlines checked', 'Hostel reporting date noted', 'Academic calendar reviewed', 'Transport information reviewed'],
  },
];

const TOTAL_CAMPUS_TASKS = CAMPUS_CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.tasks.length, 0);

function ReadyForCampusSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = TOTAL_CAMPUS_TASKS > 0 ? Math.round((doneCount / TOTAL_CAMPUS_TASKS) * 100) : 0;

  return (
    <div className="bg-white rounded-[24px] border border-[#F0F0F0] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)]">

      {/* ── Section Header ── */}
      <div className="relative px-5 py-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #1e3a5f 55%, #2563eb 100%)' }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -bottom-5 left-28 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[9px] bg-white/15 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="text-white text-[13px] font-extrabold tracking-tight">Ready for Campus</span>
              <p className="text-white/55 text-[10px] font-medium mt-0.5">Your pre-arrival checklist</p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/20 shrink-0">
            {doneCount}/{TOTAL_CAMPUS_TASKS} tasks
          </span>
        </div>
        {/* progress bar */}
        <div className="relative mt-3 h-1.5 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#22c55e,#86efac)' }} />
        </div>
      </div>

      {/* ── Checklist Grid ── */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CAMPUS_CHECKLIST_SECTIONS.map(section => {
          const sectionDone = section.tasks.filter((_, i) => checked[`${section.id}-${i}`]).length;
          return (
            <div key={section.id} className="rounded-[16px] border border-[#F0F0F0] bg-[#FAFAFA] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0" style={{ background: section.bg, color: section.accent }}>
                  {section.icon}
                </div>
                <span className="text-[12px] font-extrabold text-[#1A1A1A] flex-1">{section.title}</span>
                <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full shrink-0" style={{ background: section.bg, color: section.accent }}>
                  {sectionDone}/{section.tasks.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {section.tasks.map((task, i) => {
                  const key = `${section.id}-${i}`;
                  const isDone = !!checked[key];
                  return (
                    <button key={key} onClick={() => toggle(key)}
                      className="w-full flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left transition-all hover:bg-white">
                      <span className={`shrink-0 w-[18px] h-[18px] rounded-[6px] border-2 flex items-center justify-center transition-all ${isDone ? 'border-transparent' : 'border-[#D5D5D5] bg-white'}`}
                        style={isDone ? { background: section.accent } : {}}>
                        {isDone && <CheckCheck className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </span>
                      <span className={`text-[11px] font-semibold leading-snug ${isDone ? 'text-[#AAA] line-through' : 'text-[#444]'}`}>{task}</span>
                    </button>
                  );
                })}
              </div>
              {section.note && (
                <p className="text-[9.5px] text-[#AAA] font-medium italic mt-2 pl-1">* {section.note}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   CLUBS & COMMUNITIES — Discovery Engine
════════════════════════════════════════ */
function ClubsSection() {
  const clubs: {
    id: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    name: string;
    desc: string;
    event: string;
    members: number;
    rating: number;
    badge: string;
    badgeBg: string;
    accent: string;
    leftBar: string;
  }[] = [
    {
      id: 'coding',
      icon: <Code2 className="w-4 h-4" />,
      iconBg: '#EFF6FF',
      iconColor: '#2563eb',
      name: 'Coding Ninjas Community',
      desc: 'DSA practice, programming contests & technical mentorship',
      event: 'CP Contest – Jul 5',
      members: 520,
      rating: 4.8,
      badge: 'Most Popular',
      badgeBg: '#FFF7E6',
      accent: '#f59e0b',
      leftBar: '#f59e0b',
    },
    {
      id: 'entrep',
      icon: <TrendingUp className="w-4 h-4" />,
      iconBg: '#F0FDF4',
      iconColor: '#10b981',
      name: 'Entrepreneurship Club',
      desc: 'Startup culture, innovation pitches & peer networking',
      event: 'Pitch Day – Jul 19',
      members: 290,
      rating: 4.7,
      badge: 'Best for Freshers',
      badgeBg: '#F0FDF4',
      accent: '#10b981',
      leftBar: '#10b981',
    },
    {
      id: 'ai',
      icon: <BrainCircuit className="w-4 h-4" />,
      iconBg: '#FFF1F2',
      iconColor: '#E30613',
      name: 'AI For Everyone Club',
      desc: 'ML projects, workshops, AI competitions & hackathons',
      event: 'ML Hackathon – Jun 28',
      members: 340,
      rating: 4.9,
      badge: 'AI & ML Focused',
      badgeBg: '#FFF0F0',
      accent: '#E30613',
      leftBar: '#E30613',
    },
    {
      id: 'cp',
      icon: <Trophy className="w-4 h-4" />,
      iconBg: '#EEF2FF',
      iconColor: '#6366f1',
      name: 'ICPC CU Chapter',
      desc: 'Competitive programming, Codeforces ladders & ICPC prep',
      event: 'Mock ICPC – Jul 8',
      members: 175,
      rating: 4.8,
      badge: 'Competitive Prog.',
      badgeBg: '#EEF2FF',
      accent: '#6366f1',
      leftBar: '#6366f1',
    },
    {
      id: 'scifi',
      icon: <Rocket className="w-4 h-4" />,
      iconBg: '#F5F3FF',
      iconColor: '#8b5cf6',
      name: 'Sci-Fi Innovation Club',
      desc: 'Futuristic research, product building & innovation sprints',
      event: 'TechTalk – Jul 12',
      members: 210,
      rating: 4.7,
      badge: 'Skill Development',
      badgeBg: '#F5F3FF',
      accent: '#8b5cf6',
      leftBar: '#8b5cf6',
    },
    {
      id: 'orators',
      icon: <Mic className="w-4 h-4" />,
      iconBg: '#FFF7ED',
      iconColor: '#f97316',
      name: 'Young Orators Club',
      desc: 'Public speaking, MUNs, debates & leadership workshops',
      event: 'Debate Night – Jun 30',
      members: 180,
      rating: 4.6,
      badge: 'Creative Community',
      badgeBg: '#FFF8F0',
      accent: '#f97316',
      leftBar: '#f97316',
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-[#F0F0F0] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)]">

      {/* ── Section Header ── */}
      <div className="relative px-5 py-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #E30613 100%)' }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -bottom-5 left-28 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[9px] bg-white/15 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="text-white text-[13px] font-extrabold tracking-tight">Discover Clubs & Communities</span>
              <p className="text-white/55 text-[10px] font-medium mt-0.5">
                Curated for &nbsp;<span className="text-white font-bold">B.E. CSE (AI &amp; ML)</span>
              </p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/20 shrink-0">
            {clubs.length} clubs
          </span>
        </div>
      </div>

      {/* ── Club Cards ── */}
      <div className="p-5 space-y-2">
        {clubs.map((club) => (
          <div key={club.id}
            className="rounded-[12px] border border-[#F0F0F0] bg-white hover:bg-[#FAFAFA] hover:shadow-sm hover:border-[#E5E5E5] transition-all duration-200"
            style={{ borderLeft: `3px solid ${club.leftBar}` }}>
            <div className="px-3.5 py-3 flex items-center gap-3">

              {/* ── Vector Icon Avatar ── */}
              <div
                className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
                style={{
                  background: club.iconBg,
                  color: club.iconColor,
                  boxShadow: `0 0 0 1px ${club.iconColor}18`,
                }}>
                {club.icon}
              </div>

              {/* ── Text Content ── */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[12.5px] font-bold text-[#111] leading-tight truncate tracking-tight">{club.name}</h3>
                  <span
                    className="shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap border tracking-wide"
                    style={{ color: club.accent, background: club.badgeBg, borderColor: `${club.accent}28` }}>
                    {club.badge}
                  </span>
                </div>

                <p className="text-[10.5px] text-[#888] font-normal mt-0.5 leading-snug line-clamp-1">{club.desc}</p>

                {/* ── Meta Row ── */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 text-[#BCC]" />
                    <span className="text-[9.5px] font-medium text-[#999]">{club.members}</span>
                  </div>
                  <span className="text-[#DDD] text-[10px]">·</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-[#f59e0b] text-[#f59e0b]" />
                    <span className="text-[9.5px] font-semibold text-[#999]">{club.rating}</span>
                  </div>
                  <span className="text-[#DDD] text-[10px]">·</span>
                  <div className="flex items-center gap-1 min-w-0">
                    <CalendarDays className="w-2.5 h-2.5 shrink-0" style={{ color: club.accent }} />
                    <span className="text-[9.5px] font-semibold truncate" style={{ color: club.accent }}>{club.event}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* ── Footer link ── */}
        <a
          href="https://cuintranet.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-1 py-3 rounded-[12px] text-[12px] font-extrabold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_6px_20px_rgba(227,6,19,0.3)] hover:-translate-y-[1px]"
          style={{ background: 'linear-gradient(135deg, #E30613 0%, #ff4d5e 100%)' }}
        >
          Register on CU-Intranet <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}


function QueryResolution() {
  const [cat, setCat] = useState('');
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-[12px] bg-[#E30613]/10 flex items-center justify-center">
            <MessageSquare className="w-4.5 h-4.5 text-[#E30613]" />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-[#1A1A1A]">Submit New Query</h2>
            <p className="text-[11px] text-[#888] font-medium">Your mentor will respond within 2–4 hours</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-extrabold text-[#666] uppercase tracking-[0.1em] mb-1.5">Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[14px] text-[13px] text-[#1A1A1A] font-medium focus:outline-none focus:border-[#E30613]/50 focus:ring-2 focus:ring-[#E30613]/10 transition-all">
              <option value="">Select category...</option>
              {['Academic Query', 'Attendance Discrepancy', 'Hostel/Mess Problem', 'CUIMS Navigation', 'Placement Eligibility'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-[#666] uppercase tracking-[0.1em] mb-1.5">Title</label>
            <input type="text" placeholder="Brief summary of your query"
              className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[14px] text-[13px] focus:outline-none focus:border-[#E30613]/50 focus:ring-2 focus:ring-[#E30613]/10 transition-all" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[10px] font-extrabold text-[#666] uppercase tracking-[0.1em] mb-1.5">Detailed Description</label>
          <textarea rows={4} placeholder="Describe your issue in detail..."
            className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[14px] text-[13px] focus:outline-none focus:border-[#E30613]/50 focus:ring-2 focus:ring-[#E30613]/10 transition-all resize-none" />
        </div>
        <div className="mb-5 border-2 border-dashed border-[#EBEBEB] rounded-[16px] p-6 text-center hover:border-[#E30613]/30 hover:bg-[#E30613]/[0.02] transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-[12px] bg-[#F5F5F5] flex items-center justify-center mx-auto mb-2 group-hover:bg-[#E30613]/10 transition-colors">
            <Send className="w-4 h-4 text-[#CCC] group-hover:text-[#E30613] transition-colors" />
          </div>
          <p className="text-[12px] font-semibold text-[#999]">Drag & drop files, or <span className="text-[#E30613] font-bold">browse</span></p>
          <p className="text-[10px] text-[#CCC] mt-1">PDF, PNG, JPG up to 10MB</p>
        </div>
        <button className="px-7 py-3 bg-[#E30613] hover:bg-[#B0000D] text-white text-[13px] font-bold rounded-[14px] transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_rgba(227,6,19,0.3)] flex items-center gap-2">
          <Send className="w-4 h-4" /> Submit Query
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SMART SCHEDULER
════════════════════════════════════════ */
function SmartScheduler({ onBookSession }: { onBookSession?: () => void }) {
  const [schedTab, setSchedTab] = useState<'faculty' | 'buddy'>('faculty');
  const [mode, setMode] = useState<'virtual' | 'inperson'>('virtual');
  const [selected, setSelected] = useState<string | null>(null);

  const [bookings, setBookings] = useState<{
    id: string; target: string; type: 'faculty'|'buddy';
    mode: 'virtual'|'inperson'; slot: string;
  }[]>([
    { id: 'B-101', target: 'Dr. Sandeep Singh', type: 'faculty', mode: 'virtual', slot: 'Mon, Jun 2 at 10:00 AM' }
  ]);

  const [reservedSlots, setReservedSlots] = useState<Set<string>>(new Set([
    'Mon, Jun 2-10:00 AM','Tue, Jun 3-9:00 AM','Wed, Jun 4-2:00 PM',
    'Thu, Jun 5-3:00 PM','Fri, Jun 6-11:00 AM',
  ]));

  const days  = ['Mon, Jun 2','Tue, Jun 3','Wed, Jun 4','Thu, Jun 5','Fri, Jun 6'];
  const slots = ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'];

  const handleConfirmBooking = () => {
    if (!selected) return;
    const [day, time] = selected.split('-');
    const targetName = schedTab === 'faculty' ? 'Dr. Sandeep Singh' : 'Ananya Kapoor';
    setBookings(prev => [{
      id: `B-${Math.floor(100+Math.random()*900)}`,
      target: targetName, type: schedTab, mode,
      slot: `${day} at ${time}`,
    }, ...prev]);
    setReservedSlots(prev => { const n = new Set(prev); n.add(selected); return n; });
    setSelected(null);
  };

  const handleCancelBooking = (id: string, slotKey: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    setReservedSlots(prev => { const n = new Set(prev); n.delete(slotKey); return n; });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[16px] font-extrabold text-[#1A1A1A]">Smart Scheduler</h2>
            <p className="text-[11px] text-[#888] font-medium mt-0.5">Book 1-on-1 sessions in seconds</p>
          </div>
          <div className="flex items-center gap-2">
            {onBookSession && (
              <button onClick={onBookSession}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E30613] to-[#ff4d5e] text-white text-[11px] font-extrabold rounded-[12px] shadow-md shadow-red-500/25 hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200">
                <CalendarPlus className="w-4 h-4" /> Book Interaction
              </button>
            )}
            <div className="flex bg-[#F5F5F5] rounded-[12px] p-1 border border-[#EBEBEB]">
            {(['faculty','buddy'] as const).map(t => (
              <button key={t} onClick={() => { setSchedTab(t); setSelected(null); }}
                className={`px-4 py-1.5 rounded-[10px] text-[11px] font-bold transition-all duration-200 ${
                  schedTab === t ? 'bg-white text-[#E30613] shadow-sm' : 'text-[#999] hover:text-[#666]'}`}>
                {t === 'faculty' ? 'Faculty Expert' : 'Senior Buddy'}
              </button>
            ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-extrabold text-[#888] uppercase tracking-[0.1em]">Mode:</span>
          <div className="flex bg-[#F5F5F5] rounded-[12px] p-1 border border-[#EBEBEB]">
            {(['virtual','inperson'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  mode === m ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#999]'}`}>
                {m === 'virtual' ? <><Video className="w-3 h-3" />Virtual</> : <><CalendarDays className="w-3 h-3" />In-Person</>}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-2 min-w-[600px]">
            <div />
            {days.map(d => <div key={d} className="text-center text-[10px] font-extrabold text-[#888] uppercase tracking-wider pb-2">{d}</div>)}
            {slots.map(sl => (
              <div key={sl} className="contents">
                <div className="text-[10px] font-bold text-[#888] flex items-center">{sl}</div>
                {days.map(d => {
                  const key = `${d}-${sl}`;
                  const isBooked = reservedSlots.has(key);
                  const isSel = selected === key;
                  return (
                    <button key={key} disabled={isBooked} onClick={() => setSelected(isSel ? null : key)}
                      className={`py-2.5 rounded-[10px] text-[10px] font-bold transition-all duration-200 border ${
                        isBooked ? 'bg-[#F5F5F5] text-[#CCC] cursor-not-allowed border-dashed border-[#EBEBEB]' :
                        isSel ? 'bg-[#E30613] text-white shadow-md border-[#E30613] scale-[0.97]' :
                        'bg-[#FAFAFA] text-[#666] hover:bg-[#E30613]/8 hover:text-[#E30613] hover:border-[#E30613]/20 border-transparent'}`}>
                      {isBooked ? 'Reserved' : isSel ? '✓ Selected' : 'Open'}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div className="mt-5 p-4 rounded-[16px] border border-[#E30613]/20 flex items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, #E30613/[0.03] 0%, #fff5f5 100%)' }}>
            <div>
              <div className="text-[12px] font-extrabold text-[#1A1A1A]">
                {selected.replace('-', ' at ')}
              </div>
              <div className="text-[10px] text-[#666] mt-0.5">
                {schedTab === 'faculty' ? 'Dr. Sandeep Singh' : 'Ananya Kapoor'} · {mode === 'virtual' ? 'Virtual Meet' : 'In-Person Block B1'}
              </div>
            </div>
            <button onClick={handleConfirmBooking}
              className="px-4 py-2 bg-[#E30613] text-white text-[11px] font-bold rounded-[12px] hover:bg-[#B0000D] transition-colors shadow-sm shrink-0">
              Confirm Booking
            </button>
          </div>
        )}
      </div>

      {/* Booked appointments */}
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-[8px] bg-[#E30613]/10 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-[#E30613]" />
          </div>
          <h3 className="text-[14px] font-extrabold text-[#1A1A1A]">Your Upcoming Appointments</h3>
        </div>
        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map(b => {
              const slotKey = b.slot.replace(' at ', '-');
              return (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-[14px] bg-[#FAFAFA] border border-[#F0F0F0] hover:border-[#E5E5E5] hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${b.mode === 'virtual' ? 'bg-blue-50' : 'bg-[#22C55E]/10'}`}>
                      {b.mode === 'virtual' ? <Video className="w-4 h-4 text-blue-500" /> : <CalendarDays className="w-4 h-4 text-[#22C55E]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E30613]/10 text-[#E30613] uppercase">{b.id}</span>
                        <span className="text-[12px] font-bold text-[#1A1A1A]">{b.target}</span>
                      </div>
                      <div className="text-[11px] text-[#888] font-medium mt-0.5">{b.slot} · {b.mode === 'virtual' ? 'Virtual' : 'In-Person'}</div>
                    </div>
                  </div>
                  <button onClick={() => handleCancelBooking(b.id, slotKey)}
                    className="px-3 py-1.5 border border-red-100 text-[#E30613] hover:bg-red-50 text-[10px] font-bold rounded-[10px] transition-all shrink-0">
                    Cancel
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-[#EBEBEB] rounded-[16px]">
            <Calendar className="w-8 h-8 text-[#DDD] mx-auto mb-2" />
            <p className="text-[12px] text-[#999] font-medium">No upcoming appointments</p>
            <p className="text-[10px] text-[#CCC] mt-1">Use the scheduler above to book a slot</p>
          </div>
        )}
      </div>
    </div>
  );
}
