import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Play, Clock, Star, Calendar, Search,
  GraduationCap, FileText, Video, MapPin,
  Home, Briefcase, Users, HeartHandshake, Compass,
  X, CheckCircle2, Download, ClipboardList, AlertOctagon, Hourglass,
  UserCheck, MessageCircle, BookOpen, TrendingUp, Wifi, WifiOff,
  Sparkles, ArrowRight, Link, Send, ExternalLink, Copy,
} from 'lucide-react';
import { CURRENT_FACULTY, STUDENT_ENGAGEMENTS } from '../../data/cuAcademicData';
import { useMentorship, type FacultyIncomingRequest } from '../../data/mentorshipStore';

export function FacultyMentorView({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'mentees':  return <AssignedStudents />;
    case 'doubts':   return <AcademicDoubts />;
    case 'sessions': return <SessionManager />;
    case 'profiles': return <StudentProfiles />;
    default:         return <Overview />;
  }
}

/* ── Shared helpers ─────────────────────────────────────────────────────── */
const menteeData = STUDENT_ENGAGEMENTS.map(e => ({
  name: e.student.name, uid: e.student.uid, section: e.student.section,
  courseCode: e.student.courseCode, block: e.student.block, course: e.student.course,
  att: e.attendance, status: e.level, steps: e.milestones,
  doubts: e.doubtsSubmitted, sessions: e.sessionsAttended, lastActive: e.lastActive,
}));

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const CATEGORY_META: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  hostel:    { color: '#7c3aed', bg: '#f5f3ff', icon: <Home      className="w-3 h-3" />, label: 'Hostel & Academics' },
  academic:  { color: '#2563eb', bg: '#eff6ff', icon: <BookOpen  className="w-3 h-3" />, label: 'Academic Query'     },
  placement: { color: '#d97706', bg: '#fffbeb', icon: <Briefcase className="w-3 h-3" />, label: 'Placement Query'    },
  personal:  { color: '#ec4899', bg: '#fdf2f8', icon: <HeartHandshake className="w-3 h-3" />, label: 'Personal Guidance' },
  general:   { color: '#64748b', bg: '#f8fafc', icon: <MessageCircle className="w-3 h-3" />, label: 'General Query'    },
};

function getCategoryMeta(key: string) {
  return CATEGORY_META[key] ?? CATEGORY_META.general;
}

/* ════════════════════════════════════════
   START MEETING MODAL — Premium redesign
════════════════════════════════════════ */
function StartMeetingModal({ req, onClose }: {
  req: FacultyIncomingRequest;
  onClose: () => void;
}) {
  const { shareMeetingLink, getMeetingLink } = useMentorship();
  const existingLink = getMeetingLink(req.id);

  const [meetLink, setMeetLink] = useState(existingLink ?? '');
  const [sharing, setSharing]   = useState(false);
  const [shared, setShared]     = useState(!!existingLink);
  const [copied, setCopied]     = useState(false);
  const [focused, setFocused]   = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isValid = (url: string) =>
    url.trim().length > 8 && url.trim().startsWith('http');

  function handleShare() {
    if (!isValid(meetLink)) return;
    setSharing(true);
    setTimeout(() => {
      shareMeetingLink(req.id, meetLink.trim());
      setSharing(false);
      setShared(true);
    }, 1000);
  }

  function handleCopy() {
    navigator.clipboard.writeText(meetLink.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  const meta = getCategoryMeta(req.categoryKey);
  const valid = isValid(meetLink);

  return createPortal(
    <div
      className="sm-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        background: 'rgba(10,10,20,0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'smOverlayFadeIn 260ms ease-out forwards',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="sm-modal-window"
        style={{
          position: 'relative',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 28,
          display: 'flex',
          flexDirection: 'column',
          background: '#0f0e17',
          boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
          animation: 'smModalFadeScaleIn 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}>

        {/* ── Header ── */}
        <div className="relative px-5 pt-4 pb-5 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1a1040 0%, #2d1b6e 45%, #4f46e5 100%)' }}>

          {/* decorative orbs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)' }} />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.3), transparent 70%)' }} />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)' }} />

          {/* Top bar */}
          <div className="relative flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[9px] font-extrabold text-white/60 uppercase tracking-[0.12em]">Start Meeting</span>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          {/* Student card */}
          <div className="relative flex items-center gap-3.5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-[16px] flex items-center justify-center font-extrabold text-[17px] text-white shadow-xl"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                {req.studentInitials}
              </div>
              {/* online ring */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#16a34a,#22C55E)', border: '2px solid #1a1040' }}>
                <Video className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-white text-[18px] font-extrabold tracking-tight leading-tight truncate">{req.studentName}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-white/40 text-[10px] font-semibold">{req.studentUID}</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/25" />
                <span className="text-white/40 text-[10px] font-semibold">{req.studentSection}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full w-fit"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <span className="text-white/70">{meta.icon}</span>
                <span className="text-white/60 text-[9px] font-bold">{meta.label}</span>
              </div>
            </div>
          </div>

          {/* Schedule row */}
          <div className="relative flex items-center gap-2 mt-4 flex-wrap">
            {[
              { icon: <Calendar className="w-3 h-3" />, val: req.preferredDate },
              { icon: <Clock className="w-3 h-3" />,    val: req.preferredTime },
              ...(req.duration ? [{ icon: <Hourglass className="w-3 h-3" />, val: req.duration }] : []),
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px]"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-white/40">{item.icon}</span>
                <span className="text-[10px] font-bold text-white/65">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-5 space-y-4" style={{ background: '#13121f' }}>

          {!shared ? (
            <>
              {/* Step labels */}
              <div className="flex items-center gap-3">
                {[
                  { n: '1', t: 'Create meeting' },
                  { n: '2', t: 'Paste link' },
                  { n: '3', t: 'Share' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold"
                      style={{ background: 'rgba(139,92,246,0.25)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.35)' }}>
                      {s.n}
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.t}</span>
                    {i < 2 && <div className="w-4 h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />}
                  </div>
                ))}
              </div>

              {/* Platform buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    label: 'Google Meet',
                    url: 'https://meet.google.com/new',
                    bg: 'rgba(255,255,255,0.04)',
                    border: 'rgba(255,255,255,0.08)',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                        <path d="M3 7h8v4H3z" fill="#34A853"/>
                        <path d="M14.5 7.5l5-3.5v16l-5-3.5V7.5z" fill="#4285F4"/>
                        <path d="M3 11v6h8v-6H3z" fill="#FBBC04"/>
                        <path d="M3 17h8v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z" fill="#EA4335"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Zoom',
                    url: 'https://zoom.us/start/videomeeting',
                    bg: 'rgba(255,255,255,0.04)',
                    border: 'rgba(255,255,255,0.08)',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <rect width="24" height="24" rx="6" fill="#2D8CFF"/>
                        <path d="M4 8.5a1.5 1.5 0 011.5-1.5h7A1.5 1.5 0 0114 8.5v7A1.5 1.5 0 0112.5 17h-7A1.5 1.5 0 014 15.5v-7zm11 1.7l3.6-2.4A.8.8 0 0120 8.5v7a.8.8 0 01-1.4.5L15 13.8v-3.6z" fill="white"/>
                      </svg>
                    ),
                  },
                ].map(p => (
                  <button key={p.label} onClick={() => window.open(p.url, '_blank')}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-[14px] transition-all hover:scale-[1.02] active:scale-[0.98] group"
                    style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {p.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-[11px] font-extrabold text-white/80">{p.label}</div>
                      <div className="text-[9px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Tap to create →</div>
                    </div>
                    <ExternalLink className="w-3 h-3 ml-auto shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'white' }} />
                  </button>
                ))}
              </div>

              {/* Link input */}
              <div className="space-y-2">
                <label className="text-[9px] font-extrabold uppercase tracking-[0.12em] block"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Paste Meeting Link
                </label>
                <div className="relative flex gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                      <Video className="w-4 h-4" style={{ color: focused ? '#818cf8' : 'rgba(255,255,255,0.25)' }} />
                    </div>
                    <input
                      value={meetLink}
                      onChange={e => { setMeetLink(e.target.value); setShared(false); }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="w-full pl-10 pr-4 py-3.5 rounded-[14px] text-[12px] font-semibold placeholder:font-normal transition-all outline-none"
                      style={{
                        background: focused ? 'rgba(129,140,248,0.08)' : 'rgba(255,255,255,0.04)',
                        border: focused
                          ? '1.5px solid rgba(129,140,248,0.5)'
                          : valid
                            ? '1.5px solid rgba(34,197,94,0.4)'
                            : '1.5px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.85)',
                        fontFamily: 'monospace',
                      }}
                    />
                    {/* valid indicator */}
                    {valid && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      </div>
                    )}
                  </div>
                  {meetLink && (
                    <button onClick={handleCopy}
                      className="w-12 rounded-[14px] flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
                      {copied
                        ? <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                        : <Copy className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />}
                    </button>
                  )}
                </div>
                {meetLink && !valid && (
                  <p className="text-[10px] font-semibold px-1" style={{ color: '#f87171' }}>
                    ⚠ Must start with https://
                  </p>
                )}
              </div>

              {/* Share CTA */}
              <button
                disabled={!valid || sharing}
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[16px] text-[13px] font-extrabold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{
                  background: valid
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #9333ea 100%)'
                    : 'rgba(255,255,255,0.07)',
                  color: valid ? 'white' : 'rgba(255,255,255,0.3)',
                  boxShadow: valid ? '0 8px 28px rgba(79,70,229,0.45), 0 0 0 1px rgba(139,92,246,0.3)' : 'none',
                }}>
                {sharing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending to student…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Share Link with Student
                  </>
                )}
              </button>

              <button onClick={onClose}
                className="w-full py-2.5 rounded-[12px] text-[11px] font-semibold transition-colors"
                style={{ color: 'rgba(255,255,255,0.25)' }}>
                Cancel
              </button>
            </>
          ) : (
            /* ══ SUCCESS STATE ══ */
            <div className="space-y-4">

              {/* Success banner */}
              <div className="relative rounded-[18px] overflow-hidden px-5 py-4"
                style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 60%, #166534 100%)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.2), transparent 70%)' }} />
                <div className="flex items-center gap-3.5 relative">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#16a34a,#22C55E)', boxShadow: '0 4px 16px rgba(34,197,94,0.4)' }}>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold text-white">Link Shared!</div>
                    <div className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(134,239,172,0.7)' }}>
                      {req.studentName} can now join from their dashboard
                    </div>
                  </div>
                </div>
              </div>

              {/* Link display */}
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-[14px]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Video className="w-3.5 h-3.5 shrink-0" style={{ color: '#818cf8' }} />
                <span className="flex-1 text-[11px] font-mono truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {meetLink}
                </span>
                <button onClick={handleCopy}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[9px] font-bold transition-all"
                  style={{ background: 'rgba(129,140,248,0.15)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.25)' }}>
                  {copied ? <><CheckCircle2 className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => { setShared(false); setMeetLink(''); }}
                  className="flex-1 py-3 rounded-[14px] text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Change Link
                </button>
                <button
                  onClick={() => window.open(meetLink, '_blank')}
                  className="flex-1 py-3 rounded-[14px] text-white text-[11px] font-extrabold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 16px rgba(79,70,229,0.4)' }}>
                  <Video className="w-3.5 h-3.5" /> Join & Host
                </button>
              </div>

              <button onClick={onClose}
                className="w-full py-2.5 rounded-[12px] text-[11px] font-semibold transition-colors"
                style={{ color: 'rgba(255,255,255,0.2)' }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes smOverlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes smModalFadeScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ════════════════════════════════════════
   VIEW PROFILE MODAL
════════════════════════════════════════ */
function ProfileModal({ req, onClose, onAccept }: {
  req: FacultyIncomingRequest;
  onClose: () => void;
  onAccept: () => void;
}) {
  const meta = getCategoryMeta(req.categoryKey);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">

        {/* Header */}
        <div className="relative px-6 pt-5 pb-4 shrink-0"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d0a0a 50%, #E30613 100%)' }}>
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/5 rounded-full" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-extrabold text-[16px]">
                {req.studentInitials}
              </div>
              <div>
                <h2 className="text-white text-[16px] font-extrabold">{req.studentName}</h2>
                <p className="text-white/60 text-[10px] font-medium mt-0.5">{req.studentUID} · {req.studentSection}</p>
                <div className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full w-fit"
                  style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <span style={{ color: 'white' }}>{meta.icon}</span>
                  <span className="text-white text-[9px] font-bold">{meta.label}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0">
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">

          {/* Student Details */}
          <div className="rounded-[14px] border border-[#F0F0F0] overflow-hidden">
            <div className="px-3 py-2 bg-[#FAFAFA] border-b border-[#F0F0F0]">
              <span className="text-[9px] font-extrabold text-[#AAA] uppercase tracking-[0.1em]">Student Details</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-y divide-[#F5F5F5]">
              {[
                { l: 'Course',    v: req.studentCourse   },
                { l: 'Section',   v: req.studentSection  },
                { l: 'Semester',  v: req.studentSemester },
                { l: 'Batch',     v: req.studentBatch    },
                { l: 'City',      v: req.studentCity     },
                { l: 'Residence', v: req.studentHostel   },
              ].map(f => (
                <div key={f.l} className="px-3 py-2">
                  <div className="text-[8px] font-bold text-[#AAA] uppercase tracking-wider">{f.l}</div>
                  <div className="text-[11px] font-semibold text-[#1A1A1A] mt-0.5 truncate">{f.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Schedule — just date, time, duration */}
          <div className="rounded-[14px] border border-[#F0F0F0] overflow-hidden">
            <div className="px-3 py-2 bg-[#FAFAFA] border-b border-[#F0F0F0]">
              <span className="text-[9px] font-extrabold text-[#AAA] uppercase tracking-[0.1em]">Meeting Schedule</span>
            </div>
            <div className="flex items-center divide-x divide-[#F5F5F5]">
              <div className="flex-1 px-3 py-2.5">
                <div className="text-[8px] font-bold text-[#AAA] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#E30613]" /> Date
                </div>
                <div className="text-[12px] font-bold text-[#1A1A1A] mt-0.5">{req.preferredDate || 'TBD'}</div>
              </div>
              <div className="flex-1 px-3 py-2.5">
                <div className="text-[8px] font-bold text-[#AAA] uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#E30613]" /> Time
                </div>
                <div className="text-[12px] font-bold text-[#1A1A1A] mt-0.5">{req.preferredTime || 'TBD'}</div>
              </div>
              {req.duration && (
                <div className="flex-1 px-3 py-2.5">
                  <div className="text-[8px] font-bold text-[#AAA] uppercase tracking-wider flex items-center gap-1">
                    <Hourglass className="w-3 h-3 text-[#AAA]" /> Duration
                  </div>
                  <div className="text-[12px] font-bold text-[#555] mt-0.5">{req.duration}</div>
                </div>
              )}
            </div>
          </div>

          {/* Concern */}
          <div className="rounded-[14px] border border-[#F0F0F0] overflow-hidden">
            <div className="px-3 py-2 bg-[#FAFAFA] border-b border-[#F0F0F0] flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-[#AAA] uppercase tracking-[0.1em]">Student's Concern</span>
              <div className="flex items-center gap-1">
                <span className="text-[#AAA] text-[9px] font-medium">Submitted </span>
                <span className="text-[#1A1A1A] text-[9px] font-bold">{timeAgo(req.submittedAt)}</span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[11px] text-[#333] font-medium leading-relaxed bg-[#FAFAFA] px-3 py-2.5 rounded-[10px] border border-[#F0F0F0] italic">
                "{req.concern}"
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          {req.status === 'pending' && (
            <div className="flex gap-2.5 pt-1">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-[12px] border-2 border-[#EBEBEB] text-[#555] text-[12px] font-bold hover:bg-[#F5F5F5] transition-colors">
                Close
              </button>
              <button onClick={() => { onAccept(); onClose(); }}
                className="flex-1 py-2.5 rounded-[12px] text-white text-[12px] font-extrabold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #E30613, #ff4d5e)' }}>
                <UserCheck className="w-4 h-4" /> Accept & Assign Myself
              </button>
            </div>
          )}
          {req.status === 'accepted' && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#22C55E]/8 border border-[#22C55E]/20">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span className="text-[11px] font-bold text-[#22C55E]">You've accepted this request. The student has been notified.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   OVERVIEW — Premium Faculty Dashboard
════════════════════════════════════════ */
function Overview() {
  const f = CURRENT_FACULTY;
  const { facultyIncoming, acceptFacultyRequest, markSessionComplete, sessionFeedbacks } = useMentorship();
  const [profileReq, setProfileReq] = useState<FacultyIncomingRequest | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [startMeetingReq, setStartMeetingReq] = useState<FacultyIncomingRequest | null>(null);

  const pending  = facultyIncoming.filter(r => r.status === 'pending');
  const accepted   = facultyIncoming.filter(r => r.status === 'accepted');
  const completed  = facultyIncoming.filter(r => r.status === 'completed');

  function handleAccept(id: string) {
    setAccepting(id);
    setTimeout(() => {
      acceptFacultyRequest(id);
      setAccepting(null);
    }, 900);
  }

  return (
    <div className="space-y-6">

      {/* ── HERO BANNER ── */}
      <div className="relative rounded-[28px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0505 35%, #7a0000 65%, #E30613 100%)' }}>
        {/* Floating orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.03] rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute top-8 right-40 w-24 h-24 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute bottom-4 right-8 w-16 h-16 bg-[#E30613]/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/[0.02] rounded-full pointer-events-none" />

        <div className="relative p-7 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-[72px] h-[72px] rounded-[22px] bg-white/15 border-2 border-white/25 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <span className="text-white font-extrabold text-[24px] tracking-tight">{f.initials}</span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#22C55E] rounded-full border-[2.5px] border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/60"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />Faculty Mentor
                </span>
              </div>
              <h1 className="text-white text-[24px] sm:text-[26px] font-extrabold tracking-tight leading-tight">{f.name}</h1>
              <p className="text-white/55 text-[13px] font-medium mt-1">{f.designation} · {f.department}</p>
              <p className="text-white/30 text-[11px] mt-1.5 italic">"Helping freshers build confidence through meaningful conversations."</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── IMPACT METRICS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { v: '15',  l: 'Students Mentored',     sub: 'Assigned to you',              icon: GraduationCap,  grad: 'linear-gradient(135deg, #0d0d1a 0%, #7a0000 60%, #E30613 100%)' },
          { v: '4.8', l: 'Avg. Satisfaction',     sub: 'Based on student feedback',    icon: Star,           grad: 'linear-gradient(135deg, #0d0a1a 0%, #1e1060 55%, #4c30c4 100%)' },
          { v: '8',   l: 'Sessions Completed',    sub: 'This admission cycle',         icon: Calendar,       grad: 'linear-gradient(135deg, #000d1a 0%, #003366 55%, #1a6bbf 100%)' },
          { v: '87%', l: 'Resolution Rate',       sub: 'Concerns fully resolved',      icon: TrendingUp,    grad: 'linear-gradient(135deg, #001a0d 0%, #014d26 55%, #0a8c4a 100%)' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.l}
              className="relative rounded-[22px] overflow-hidden p-5 hover:-translate-y-[3px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 cursor-default"
              style={{ background: m.grad }}>
              {/* Orbs */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/[0.04] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/[0.03] rounded-full pointer-events-none" />
              <div className="relative">
                <div className="w-10 h-10 rounded-[12px] bg-white/10 border border-white/15 flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-[30px] font-extrabold text-white leading-none tracking-tight">{m.v}</div>
                <div className="text-[12px] font-bold text-white/80 mt-1.5 leading-snug">{m.l}</div>
                <div className="text-[10px] text-white/40 font-medium mt-0.5">{m.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── INCOMING STUDENT REQUESTS ── */}
      <div id="incoming-requests"
        className="bg-white rounded-[24px] border border-[#F0F0F0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #1a0505, #E30613)' }}>
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[15px] font-extrabold text-[#1A1A1A] tracking-tight">Incoming Student Requests</span>
              <p className="text-[10px] text-[#AAA] font-medium mt-0.5">Review and respond to mentorship requests</p>
            </div>
          </div>
          <div className="flex gap-2">
            {pending.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-[#E30613]/8 text-[#E30613] border border-[#E30613]/15">
                <span className="w-1.5 h-1.5 bg-[#E30613] rounded-full animate-pulse" />{pending.length} pending
              </span>
            )}
            {accepted.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                <CheckCircle2 className="w-3 h-3" />{accepted.length} accepted
              </span>
            )}
          </div>
        </div>

        {facultyIncoming.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-12 h-12 rounded-[16px] bg-[#F5F5F5] flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-[#DDD]" />
            </div>
            <p className="text-[13px] text-[#AAA] font-medium">No incoming requests right now</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F8F8F8]">
            {facultyIncoming.map(req => {
              const meta = getCategoryMeta(req.categoryKey);
              const isAccepted = req.status === 'accepted';
              const isAccepting = accepting === req.id;
              return (
                <div key={req.id}
                  className={`px-6 py-5 transition-all duration-200 group
                    ${isAccepted
                      ? 'bg-gradient-to-r from-[#f0fdf4] to-white'
                      : 'hover:bg-[#FDFAFA] hover:shadow-[inset_0_0_0_1px_rgba(227,6,19,0.06)]'
                    }`}>
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-[12px] font-extrabold shrink-0 mt-0.5 shadow-md"
                      style={{ background: isAccepted ? 'linear-gradient(135deg, #16a34a, #22C55E)' : 'linear-gradient(135deg, #1a1a2e, #E30613)' }}>
                      {isAccepted ? <CheckCircle2 className="w-5 h-5" /> : req.studentInitials}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="text-[14px] font-extrabold text-[#1A1A1A]">{req.studentName}</span>
                          <span className="text-[10px] text-[#BBB] ml-2 font-medium">{req.studentSection} · {req.studentUID}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] text-[#CCC] font-medium">{timeAgo(req.submittedAt)}</span>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                            style={{ color: meta.color, background: meta.bg, borderColor: `${meta.color}25` }}>
                            {meta.icon}{meta.label}
                          </div>
                        </div>
                      </div>
                      <p className="text-[12px] text-[#666] mt-2 leading-relaxed line-clamp-2">{req.concern}</p>

                      {/* ── Meeting Info Strip ── */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#FFF5F5] border border-[#FECDD3]">
                          <Calendar className="w-3.5 h-3.5 text-[#E30613] shrink-0" />
                          <span className="text-[12px] font-bold text-[#1A1A1A]">{req.preferredDate || 'TBD'}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#FFF5F5] border border-[#FECDD3]">
                          <Clock className="w-3.5 h-3.5 text-[#E30613] shrink-0" />
                          <span className="text-[12px] font-bold text-[#1A1A1A]">{req.preferredTime || 'TBD'}</span>
                        </div>
                        {(req.duration) && (
                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#F5F5F5] border border-[#E5E5E5]">
                            <Hourglass className="w-3.5 h-3.5 text-[#999] shrink-0" />
                            <span className="text-[12px] font-bold text-[#555]">{req.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => setProfileReq(req)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E5E5E5] text-[11px] font-bold text-[#555] bg-white hover:bg-[#F5F5F5] hover:border-[#D0D0D0] transition-all duration-200 shadow-sm">
                          <FileText className="w-3 h-3" /> View Profile
                        </button>
                        {!isAccepted && (
                          <button
                            disabled={isAccepting}
                            onClick={() => handleAccept(req.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[11px] font-extrabold transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(227,6,19,0.35)] disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-red-600/20"
                            style={{ background: 'linear-gradient(135deg, #E30613, #ff4d5e)' }}>
                            {isAccepting
                              ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Accepting...</>
                              : <><UserCheck className="w-3.5 h-3.5" /> Accept Request</>}
                          </button>
                        )}
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/8 border border-[#22C55E]/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted · Student Notified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ACCEPTED / UPCOMING SESSIONS ── */}
      {accepted.length > 0 && (
        <div className="rounded-[24px] overflow-hidden border border-[#E8F5E9]"
          style={{ background: 'linear-gradient(145deg, #f9fffe 0%, #f0fff8 100%)', boxShadow: '0 4px 28px rgba(34,197,94,0.08)' }}>

          {/* Section header */}
          <div className="px-6 pt-5 pb-4 flex items-center gap-3 border-b border-[#E8F5E9]">
            <div className="w-9 h-9 rounded-[12px] flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #0a5c28, #22C55E)' }}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[15px] font-extrabold text-[#1A1A1A] tracking-tight">Upcoming Sessions</span>
              <p className="text-[10px] text-[#AAA] font-medium mt-0.5">Accepted requests ready to begin</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />{accepted.length} scheduled
              </span>
            </div>
          </div>

          {/* Session cards */}
          <div className="p-4 grid gap-3">
            {accepted.map((req, idx) => {
              const meta = getCategoryMeta(req.categoryKey);
              const isFirst = idx === 0;
              return (
                <div key={req.id}
                  className={`relative rounded-[18px] overflow-hidden transition-all duration-300 hover:-translate-y-[2px] group ${
                    isFirst
                      ? 'shadow-[0_6px_24px_rgba(34,197,94,0.15)]'
                      : 'shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
                  }`}
                  style={{
                    background: isFirst
                      ? 'linear-gradient(135deg, #0a5c28 0%, #15803d 50%, #22C55E 100%)'
                      : 'white',
                    border: isFirst ? 'none' : '1px solid #E8F5E9',
                  }}>

                  {/* Decorative orbs on featured card */}
                  {isFirst && (
                    <>
                      <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/[0.05] rounded-full pointer-events-none" />
                      <div className="absolute bottom-0 left-8 w-20 h-20 bg-white/[0.03] rounded-full pointer-events-none" />
                    </>
                  )}

                  <div className="relative flex items-center gap-4 px-5 py-4">
                    {/* Left accent strip for non-featured */}
                    {!isFirst && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[18px] bg-gradient-to-b from-[#22C55E] to-[#15803d]" />
                    )}

                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center font-extrabold text-[13px] shrink-0 shadow-md ${
                      isFirst ? 'bg-white/20 border border-white/30 text-white' : 'text-white'
                    }`}
                      style={!isFirst ? { background: 'linear-gradient(135deg, #0a5c28, #22C55E)' } : {}}>
                      {req.studentInitials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {isFirst && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3 h-3 text-yellow-300" />
                          <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/60">Up Next</span>
                        </div>
                      )}
                      <div className={`text-[14px] font-extrabold leading-tight ${
                        isFirst ? 'text-white' : 'text-[#1A1A1A]'
                      }`}>{req.studentName}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${
                        isFirst ? 'text-white/60' : 'text-[#AAA]'
                      }`}>{req.studentSection} · {req.studentUID}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isFirst ? 'bg-white/15 text-white/80' : ''
                        }`}
                          style={!isFirst ? { color: meta.color, background: meta.bg } : {}}>
                          {meta.icon} {meta.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                          isFirst ? 'text-white/50' : 'text-[#999]'
                        }`}>
                          <Calendar className="w-3 h-3" /> {req.preferredDate} · <Clock className="w-3 h-3" /> {req.preferredTime}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          isFirst
                            ? 'bg-white/15 text-white/70'
                            : req.meetingMode === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {req.meetingMode === 'Online' ? <Wifi className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}
                          {req.meetingMode} · {req.meetingLocation}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 flex flex-col gap-1.5">
                      <button
                        onClick={() => setStartMeetingReq(req)}
                        className={`px-4 py-2 rounded-[12px] text-[11px] font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 shadow-md ${
                          isFirst
                            ? 'bg-white text-[#0a5c28] hover:shadow-lg hover:shadow-white/20'
                            : 'text-white hover:shadow-lg hover:shadow-[#22C55E]/30'
                        }`}
                        style={!isFirst ? { background: 'linear-gradient(135deg, #0a5c28, #22C55E)' } : {}}>
                        <Play className="w-3.5 h-3.5" />
                        {isFirst ? 'Start Now' : 'Begin'}
                      </button>
                      <button
                        onClick={() => markSessionComplete(req.id)}
                        className={`px-4 py-2 rounded-[12px] text-[11px] font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 ${
                          isFirst
                            ? 'bg-white/15 text-white border border-white/25 hover:bg-white/25'
                            : 'bg-[#f0fdf4] text-[#15803d] border border-[#22C55E]/25 hover:bg-[#dcfce7]'
                        }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── COMPLETED SESSIONS ── */}
      {completed.length > 0 && (
        <div className="rounded-[28px] overflow-hidden"
          style={{ background: 'linear-gradient(160deg,#0f0c29 0%,#1e1060 50%,#2d1b69 100%)', boxShadow: '0 8px 40px rgba(79,70,229,0.2)' }}>

          {/* Header */}
          <div className="px-6 pt-6 pb-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-[16px] flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#818cf8)', boxShadow: '0 4px 16px rgba(79,70,229,0.5)' }}>
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="text-[16px] font-extrabold text-white tracking-tight">Completed Sessions</div>
              <div className="text-[11px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Awaiting student ratings</div>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] animate-pulse" />
              <span className="text-[11px] font-extrabold text-[#818cf8]">{completed.length} done</span>
            </div>
          </div>

          {/* Cards */}
          <div className="px-4 pb-5 grid gap-3">
            {completed.map(req => {
              const meta = getCategoryMeta(req.categoryKey);
              const feedback = sessionFeedbacks.find(f => f.sessionId === req.id);
              return (
                <div key={req.id}
                  className="rounded-[20px] overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>

                  {/* Top: student info */}
                  <div className="flex items-center gap-4 px-5 pt-4 pb-3">
                    {/* Avatar with glow */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-[14px] flex items-center justify-center font-extrabold text-[14px] text-white"
                        style={{ background: 'linear-gradient(135deg,#4f46e5,#818cf8)', boxShadow: '0 4px 16px rgba(79,70,229,0.5)' }}>
                        {req.studentInitials}
                      </div>
                      {/* completed badge */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', border: '2px solid rgba(15,12,41,1)' }}>
                        <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-extrabold text-white">{req.studentName}</div>
                      <div className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {req.studentSection} · {req.studentUID}
                      </div>
                    </div>

                    {/* Category badge */}
                    <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ color: meta.color, background: `${meta.color}20`, border: `1px solid ${meta.color}30` }}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="mx-5" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                  {/* Bottom: date/time + rating */}
                  <div className="flex items-center gap-3 px-5 py-3 flex-wrap">
                    {/* Date pill */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px]"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Calendar className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.4)' }} />
                      <span className="text-[11px] font-bold text-white/70">{req.preferredDate}</span>
                    </div>
                    {/* Time pill */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px]"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Clock className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.4)' }} />
                      <span className="text-[11px] font-bold text-white/70">{req.preferredTime}</span>
                    </div>

                    {/* Rating — right side */}
                    <div className="ml-auto shrink-0 text-right">
                      {feedback ? (
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: 'rgba(251,191,36,0.7)' }}>Student Rating</div>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-4 h-4 ${
                                s <= feedback.rating
                                  ? 'fill-[#fbbf24] text-[#fbbf24]'
                                  : 'text-white/15'
                              }`} />
                            ))}
                            <span className="text-[12px] font-extrabold text-[#fbbf24] ml-1.5">{feedback.rating}/5</span>
                          </div>
                          {feedback.comment && (
                            <div className="text-[9px] font-medium italic max-w-[160px] text-right" style={{ color: 'rgba(255,255,255,0.4)' }}>
                              "{feedback.comment}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Awaiting</div>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.12)' }} />
                            ))}
                          </div>
                          <div className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>Student will rate soon</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileReq && (
        <ProfileModal
          req={profileReq}
          onClose={() => setProfileReq(null)}
          onAccept={() => handleAccept(profileReq.id)}
        />
      )}
      {startMeetingReq && (
        <StartMeetingModal
          req={startMeetingReq}
          onClose={() => setStartMeetingReq(null)}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   ASSIGNED STUDENTS TAB
════════════════════════════════════════ */
function AssignedStudents() {
  const f = CURRENT_FACULTY;
  const [search, setSearch]     = useState('');
  const [secFilter, setSecFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = menteeData
    .filter(m => secFilter    === 'All' || m.section === secFilter)
    .filter(m => statusFilter === 'All' || m.status  === statusFilter)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.uid.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-[18px] font-extrabold text-[#1A1A1A]">
          My Assigned Students <span className="text-[#AAA] font-medium text-[15px]">({filtered.length})</span>
        </h2>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-[16px] border border-[#F0F0F0] p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-[#CCC] absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or UID..."
            className="w-full pl-8 pr-3 py-2 rounded-[10px] bg-[#FAFAFA] border border-[#EBEBEB] text-[12px] font-semibold text-[#1A1A1A] placeholder:text-[#CCC] focus:outline-none focus:border-[#E30613]/40 transition-all" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', ...f.assignedSections].map(s => (
            <button key={s} onClick={() => setSecFilter(s)}
              className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold transition-all ${secFilter === s ? 'bg-[#E30613] text-white' : 'bg-[#F5F5F5] text-[#666] hover:bg-[#EBEBEB]'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', 'Active', 'Needs Attention', 'Requires Support'].map(st => (
            <button key={st} onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold transition-all ${statusFilter === st ? 'bg-[#1A1A1A] text-white' : 'bg-[#F5F5F5] text-[#666] hover:bg-[#EBEBEB]'}`}>
              {st}
            </button>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
                {['Student', 'Section', 'Last Interaction', 'Sessions', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[9px] font-extrabold text-[#AAA] uppercase tracking-[0.1em] px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8F8F8]">
              {filtered.length > 0 ? filtered.map((m, i) => {
                const sc = m.status === 'Active'
                  ? { color: '#22C55E', bg: '#f0fdf4', dot: '🟢' }
                  : m.status === 'Needs Attention'
                  ? { color: '#d97706', bg: '#fffbeb', dot: '🟠' }
                  : { color: '#E30613', bg: '#fff0f0', dot: '🔴' };
                return (
                  <tr key={i} className="hover:bg-[#FAFAFA] transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold shrink-0"
                          style={{ background: 'linear-gradient(135deg, #1a1a2e, #E30613)' }}>
                          {initials(m.name)}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#1A1A1A]">{m.name}</div>
                          <div className="text-[10px] text-[#AAA] font-mono">{m.uid}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E30613]/8 text-[#E30613]">{m.section}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-[#666]">{m.lastActive}</td>
                    <td className="px-4 py-3.5 text-[13px] font-bold text-[#1A1A1A]">{m.sessions}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ color: sc.color, background: sc.bg }}>
                        {sc.dot} {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-[8px] text-[10px] font-bold text-[#E30613] border border-[#E30613]/20 hover:bg-[#E30613]/5 transition-all">
                        View →
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-[#AAA] text-[13px]">No students match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   ACADEMIC DOUBTS TAB
════════════════════════════════════════ */
const doubtsData = [
  { id: 'D-1042', student: 'Aryan Sharma',  uid: '25AML10244', section: '25AML-301', title: 'What is a variable in C and how do we declare it?',      priority: 'HIGH',     elapsed: '2:34', status: 'open'     },
  { id: 'D-1041', student: 'Priya Mehta',   uid: '25AML11034', section: '25AML-302', title: 'Difference between local and global scope in Python',    priority: 'CRITICAL', elapsed: '4:12', status: 'open'     },
  { id: 'D-1040', student: 'Rohit Singh',   uid: '25AML12890', section: '25AML-301', title: 'How does a for-loop work? Need simple breakdown',        priority: 'MEDIUM',   elapsed: '1:05', status: 'open'     },
  { id: 'D-1039', student: 'Neha Gupta',    uid: '25AML13456', section: '25AML-303', title: 'Syntax error: IndentationError in nested if-statements', priority: 'HIGH',     elapsed: '3:48', status: 'open'     },
  { id: 'D-1035', student: 'Simran Kaur',   uid: '25AML14522', section: '25AML-302', title: 'How to use scanf for taking integer inputs in C',        priority: 'LOW',      elapsed: '-',    status: 'resolved' },
  { id: 'D-1034', student: 'Manish Tiwari', uid: '25BCS16055', section: '25BCS-201', title: 'Basic conditional statements (if-else) syntax query',    priority: 'MEDIUM',   elapsed: '-',    status: 'resolved' },
];
const PRIORITY_META: Record<string, { color: string; bg: string }> = {
  CRITICAL: { color: '#E30613', bg: '#fff0f0' },
  HIGH:     { color: '#d97706', bg: '#fffbeb' },
  MEDIUM:   { color: '#2563eb', bg: '#eff6ff' },
  LOW:      { color: '#AAA',    bg: '#F5F5F5' },
};

function AcademicDoubts() {
  const [tab, setTab] = useState<'open' | 'resolved'>('open');
  const filtered = doubtsData.filter(d => d.status === tab);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-[18px] font-extrabold text-[#1A1A1A]">Student Doubts</h2>
        <div className="flex bg-[#F5F5F5] rounded-[12px] p-0.5 border border-[#EBEBEB]">
          {(['open','resolved'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-[10px] text-[11px] font-bold transition-all capitalize ${tab === t ? 'bg-white text-[#E30613] shadow-sm' : 'text-[#999]'}`}>
              {t} ({doubtsData.filter(d => d.status === t).length})
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(d => {
          const pm = PRIORITY_META[d.priority] ?? PRIORITY_META.LOW;
          const mins = parseFloat(d.elapsed.split(':')[0]) || 0;
          return (
            <div key={d.id}
              className="bg-white rounded-[18px] border border-[#F0F0F0] p-5 hover:-translate-y-[1px] hover:shadow-md transition-all duration-300"
              style={d.status === 'open' && mins >= 4 ? { borderLeftWidth: 3, borderLeftColor: '#E30613' } : {}}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-[9px] text-[#AAA] font-mono">{d.id}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: pm.color, background: pm.bg }}>{d.priority}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E30613]/8 text-[#E30613]">{d.section}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1A1A1A]">{d.title}</h4>
                  <p className="text-[11px] text-[#888] mt-1">{d.student} · {d.uid}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {d.status === 'open' && (
                    <>
                      <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-[8px] flex items-center gap-1 ${mins >= 4 ? 'bg-[#E30613]/10 text-[#E30613]' : mins >= 3 ? 'bg-amber-50 text-amber-600' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                        <Clock className="w-3 h-3" /> {d.elapsed}
                      </span>
                      <button className="px-3 py-1.5 rounded-[10px] text-white text-[10px] font-bold flex items-center gap-1.5 hover:shadow-md transition-all"
                        style={{ background: 'linear-gradient(135deg, #E30613, #ff4d5e)' }}>
                        <Play className="w-3 h-3" /> Answer
                      </button>
                    </>
                  )}
                  {d.status === 'resolved' && (
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E]">✓ Resolved</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SESSION MANAGER TAB
════════════════════════════════════════ */
const sessionsData = [
  { id: 'S-201', student: 'Aryan Sharma (25AML-301)',  topic: 'Campus Navigation & Block Guide',         date: 'Today, 3:00 PM',     mode: 'Virtual',   loc: 'Zoom',               status: 'Upcoming',  feedback: null },
  { id: 'S-200', student: '25AML-302 Batch',           topic: 'Coding Club Registration',                date: 'Tomorrow, 11:00 AM', mode: 'In-Person', loc: 'Block B1, Cabin 312',status: 'Upcoming',  feedback: null },
  { id: 'S-199', student: 'Neha Gupta (25AML-303)',    topic: 'Societies Auditions Prep',                date: 'Jun 4, 2:00 PM',     mode: 'Virtual',   loc: 'Zoom',               status: 'Upcoming',  feedback: null },
  { id: 'S-198', student: 'Karan Verma (25BCS-201)',   topic: 'Classroom Reallocation & Maps',           date: 'Jun 1, 10:00 AM',    mode: 'Virtual',   loc: 'Zoom',               status: 'Completed', feedback: 4.8  },
  { id: 'S-197', student: 'Rohit Singh (25AML-301)',   topic: 'General Student Support & Counseling',    date: 'May 31, 3:00 PM',    mode: 'In-Person', loc: 'Block B1, Room 204', status: 'Completed', feedback: 4.5  },
  { id: 'S-196', student: 'Aditya Raj (25BCS-202)',    topic: 'Timetable Adjustment Assistance',         date: 'May 30, 11:00 AM',   mode: 'Virtual',   loc: 'Zoom',               status: 'Completed', feedback: 5.0  },
];

function SessionManager() {
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
  const filtered = sessionsData.filter(s => tab === 'upcoming' ? s.status === 'Upcoming' : s.status === 'Completed');
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-[18px] font-extrabold text-[#1A1A1A]">Session Manager</h2>
        <div className="flex bg-[#F5F5F5] rounded-[12px] p-0.5 border border-[#EBEBEB]">
          {(['upcoming','completed'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-[10px] text-[11px] font-bold transition-all capitalize ${tab === t ? 'bg-white text-[#E30613] shadow-sm' : 'text-[#999]'}`}>
              {t} ({sessionsData.filter(s => s.status === (t === 'upcoming' ? 'Upcoming' : 'Completed')).length})
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-[18px] border border-[#F0F0F0] p-5 hover:-translate-y-[1px] hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[9px] text-[#AAA] font-mono">{s.id}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.mode === 'Virtual' ? 'bg-blue-50 text-blue-600' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                    {s.mode === 'Virtual' ? '🎥' : '🏫'} {s.mode}
                  </span>
                </div>
                <h4 className="text-[13px] font-bold text-[#1A1A1A]">{s.topic}</h4>
                <p className="text-[11px] text-[#888] mt-1">{s.student} · {s.date} · {s.loc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {s.status === 'Completed' && s.feedback && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-[10px] bg-amber-50 border border-amber-100">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[12px] font-extrabold text-amber-700">{s.feedback}</span>
                  </div>
                )}
                {s.status === 'Upcoming' && (
                  <button className="px-4 py-2 rounded-[10px] text-white text-[11px] font-extrabold flex items-center gap-1.5 hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #E30613, #ff4d5e)' }}>
                    <Play className="w-3.5 h-3.5" /> Start Session
                  </button>
                )}
                {s.status === 'Completed' && (
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E]">✓ Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   STUDENT PROFILES TAB
════════════════════════════════════════ */
function StudentProfiles() {
  const [selected, setSelected] = useState<typeof menteeData[0] | null>(null);
  const [secFilter, setSecFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = menteeData
    .filter(m => secFilter === 'All' || m.section === secFilter)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.uid.toLowerCase().includes(search.toLowerCase()));

  if (selected) {
    const sc = selected.status === 'Active'
      ? { color: '#22C55E', bg: '#f0fdf4' }
      : selected.status === 'Needs Attention'
      ? { color: '#d97706', bg: '#fffbeb' }
      : { color: '#E30613', bg: '#fff0f0' };
    return (
      <div className="space-y-5">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#E30613] hover:underline">
          ← Back to profiles
        </button>
        <div className="bg-white rounded-[20px] border border-[#F0F0F0] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[18px] font-extrabold"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #E30613)' }}>
              {initials(selected.name)}
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-[#1A1A1A]">{selected.name}</h3>
              <p className="text-[12px] text-[#888] mt-0.5">{selected.uid} · {selected.course} · Sem 1</p>
            </div>
            <span className="ml-auto text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>{selected.status}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { l: 'Section',    v: selected.section    },
              { l: 'Course',     v: selected.courseCode },
              { l: 'Block',      v: selected.block      },
              { l: 'Attendance', v: `${selected.att}%`  },
              { l: 'Milestones', v: `${selected.steps}/5` },
            ].map(s => (
              <div key={s.l} className="relative p-3.5 rounded-[14px] bg-[#FAFAFA] border border-[#F0F0F0] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E30613]/30 rounded-t-[14px]" />
                <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#AAA] mt-1">{s.l}</div>
                <div className="text-[15px] font-extrabold text-[#1A1A1A] mt-1">{s.v}</div>
              </div>
            ))}
          </div>
          <h4 className="text-[13px] font-bold text-[#1A1A1A] mt-5 mb-3">Mentorship History</h4>
          <div className="space-y-2">
            {['General Guidance Session — May 25 (Virtual)', 'Coding Club Help — May 20 (In-Person)', 'Campus Adjustment Chat — May 15 (Virtual)'].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-[12px] bg-[#FAFAFA] border border-[#F0F0F0]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E30613] shrink-0" />
                <span className="text-[12px] text-[#444] font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-[18px] font-extrabold text-[#1A1A1A]">Student Profiles</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#CCC] absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
              className="pl-8 pr-3 py-2 rounded-[10px] bg-white border border-[#EBEBEB] text-[12px] font-semibold text-[#1A1A1A] placeholder:text-[#CCC] focus:outline-none focus:border-[#E30613]/40 w-[200px] transition-all" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['All', ...CURRENT_FACULTY.assignedSections].map(s => (
              <button key={s} onClick={() => setSecFilter(s)}
                className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold transition-all ${secFilter === s ? 'bg-[#E30613] text-white' : 'bg-[#F5F5F5] text-[#666] hover:bg-[#EBEBEB]'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? filtered.map((m, i) => {
          const sc = m.status === 'Active'
            ? { color: '#22C55E', bg: '#f0fdf4', border: '#22C55E20' }
            : m.status === 'Needs Attention'
            ? { color: '#d97706', bg: '#fffbeb', border: '#d9770620' }
            : { color: '#E30613', bg: '#fff0f0', border: '#E3061320' };
          return (
            <button key={i} onClick={() => setSelected(m)}
              className="bg-white rounded-[18px] border p-5 text-left hover:-translate-y-[2px] hover:shadow-lg transition-all duration-300 group"
              style={{ borderColor: sc.border }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1a1a2e, #E30613)' }}>
                  {initials(m.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[#1A1A1A] truncate">{m.name}</div>
                  <div className="text-[10px] text-[#AAA] font-mono">{m.uid}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-[#E30613]/8 text-[#E30613]">{m.section}</span>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ color: sc.color, background: sc.bg }}>{m.status}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#AAA]">
                <span>Att: <span className="font-bold text-[#1A1A1A]">{m.att}%</span></span>
                <span>Sessions: <span className="font-bold text-[#1A1A1A]">{m.sessions}</span></span>
                <span className="text-[#E30613] font-semibold group-hover:underline">View →</span>
              </div>
            </button>
          );
        }) : (
          <div className="col-span-full py-10 text-center text-[#AAA] text-[13px] font-semibold bg-white rounded-[18px] border border-[#F0F0F0]">
            No profiles match "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
