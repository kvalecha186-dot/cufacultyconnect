import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Calendar, Clock,
  BookOpen, Building2, Briefcase, Home, Code2,
  Compass, HelpCircle, MessageSquare, CheckCircle2,
  User, Sparkles, ArrowRight, Star,
} from 'lucide-react';
import { CURRENT_FACULTY, CURRENT_STUDENT } from '../data/cuAcademicData';

/* ─── Types ─── */
interface BookInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PURPOSES = [
  { id: 'academics',  label: 'Academics',       icon: BookOpen,   color: '#3b82f6', bg: '#eff6ff' },
  { id: 'campus',     label: 'Campus Life',      icon: Building2,  color: '#22c55e', bg: '#f0fdf4' },
  { id: 'placements', label: 'Placements',       icon: Briefcase,  color: '#f59e0b', bg: '#fffbeb' },
  { id: 'hostel',     label: 'Hostel',           icon: Home,       color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'projects',   label: 'Projects',         icon: Code2,      color: '#06b6d4', bg: '#ecfeff' },
  { id: 'career',     label: 'Career Guidance',  icon: Compass,    color: '#ec4899', bg: '#fdf2f8' },
  { id: 'other',      label: 'Other',            icon: HelpCircle, color: '#6b7280', bg: '#f9fafb' },
];

const TIME_SLOTS = [
  { id: 't1', time: '9:00 AM',  available: true  },
  { id: 't2', time: '9:30 AM',  available: false },
  { id: 't3', time: '10:00 AM', available: true  },
  { id: 't4', time: '10:30 AM', available: true  },
  { id: 't5', time: '11:00 AM', available: false },
  { id: 't6', time: '11:30 AM', available: true  },
  { id: 't7', time: '2:00 PM',  available: true  },
  { id: 't8', time: '2:30 PM',  available: true  },
  { id: 't9', time: '3:00 PM',  available: false },
  { id: 't10', time: '3:30 PM', available: true  },
  { id: 't11', time: '4:00 PM', available: true  },
  { id: 't12', time: '4:30 PM', available: false },
];

/* ─── Confetti particle ─── */
function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      className="absolute top-0 w-2 h-2 rounded-sm"
      style={{ left: `${x}%`, backgroundColor: color }}
      initial={{ y: -10, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ y: 300, opacity: 0, rotate: 720, scale: 0.3 }}
      transition={{ duration: 2.5, delay, ease: 'easeIn' }}
    />
  );
}

/* ─── Calendar helpers ─── */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

/* Available days: Mon–Fri only, from tomorrow onwards for next 30 days */
function getAvailableDates(year: number, month: number): Set<number> {
  const available = new Set<number>();
  const today = new Date();
  const daysInMonth = getDaysInMonth(year, month);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isFuture = date > today;
    const within30 = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30;
    if (isWeekday && isFuture && within30) available.add(d);
  }
  return available;
}

/* ─── Step indicator ─── */
function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i + 1 === step ? 24 : 8, opacity: i + 1 <= step ? 1 : 0.25 }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full bg-white"
        />
      ))}
    </div>
  );
}

/* ─── Calendar component ─── */
function CalendarPicker({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const available = getAvailableDates(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const formatDate = (d: number) => `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const selectedKey = selected ? new Date(selected) : null;
  const isSelected = (d: number) => selectedKey?.getDate() === d && selectedKey?.getMonth() === viewMonth && selectedKey?.getFullYear() === viewYear;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <span className="text-white font-bold text-[14px]">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map(d => <div key={d} className="text-center text-white/40 text-[10px] font-bold py-1">{d}</div>)}
      </div>
      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const avail = available.has(d);
          const sel = isSelected(d);
          return (
            <motion.button
              key={d}
              whileHover={avail ? { scale: 1.12 } : {}}
              whileTap={avail ? { scale: 0.95 } : {}}
              onClick={() => avail && onSelect(formatDate(d))}
              disabled={!avail}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-[12px] font-semibold transition-all duration-200 relative
                ${sel ? 'bg-white text-[#E30613] shadow-lg shadow-white/30 font-extrabold' : ''}
                ${avail && !sel ? 'bg-white/10 text-white hover:bg-white/25 cursor-pointer' : ''}
                ${!avail ? 'text-white/20 cursor-not-allowed' : ''}
              `}
            >
              {d}
              {avail && !sel && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#22c55e] rounded-full" />}
            </motion.button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#22c55e] rounded-full" /><span className="text-white/50 text-[10px]">Available</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-md bg-white/10 border border-white/20 flex items-center justify-center"><span className="text-white text-[8px] font-bold">✓</span></div><span className="text-white/50 text-[10px]">Selected</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-md bg-transparent flex items-center justify-center"><span className="text-white/20 text-[10px]">–</span></div><span className="text-white/50 text-[10px]">Unavailable</span></div>
      </div>
    </div>
  );
}

/* ─── Step 1: Date & Time ─── */
function StepDateTime({ date, time, onDate, onTime }: {
  date: string; time: string; onDate: (d: string) => void; onTime: (t: string) => void;
}) {
  const selectedSlot = TIME_SLOTS.find(s => s.id === time);
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-white/70" />
          <span className="text-white font-bold text-[13px] uppercase tracking-wider">Pick a Date</span>
        </div>
        <CalendarPicker selected={date} onSelect={onDate} />
      </div>
      {date && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-white/70" />
            <span className="text-white font-bold text-[13px] uppercase tracking-wider">Select Time Slot</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map(slot => (
              <motion.button
                key={slot.id}
                whileHover={slot.available ? { scale: 1.04, y: -2 } : {}}
                whileTap={slot.available ? { scale: 0.96 } : {}}
                onClick={() => slot.available && onTime(slot.id)}
                disabled={!slot.available}
                className={`
                  py-2.5 px-2 rounded-xl text-center transition-all duration-200 border
                  ${time === slot.id ? 'bg-white text-[#E30613] border-white shadow-lg shadow-white/20 font-extrabold' : ''}
                  ${slot.available && time !== slot.id ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 cursor-pointer' : ''}
                  ${!slot.available ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed line-through' : ''}
                `}
              >
                <div className="text-[11px] font-bold">{slot.time}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      {date && selectedSlot && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-4 py-3 bg-white/10 rounded-xl border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
          <span className="text-white/80 text-[12px]">
            Slot selected: <span className="text-white font-bold">{new Date(date).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' })}</span> at <span className="text-white font-bold">{selectedSlot.time}</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Step 2: Purpose ─── */
function StepPurpose({ purpose, concern, onPurpose, onConcern }: {
  purpose: string; concern: string; onPurpose: (p: string) => void; onConcern: (c: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-white/70" />
          <span className="text-white font-bold text-[13px] uppercase tracking-wider">Purpose of Interaction</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PURPOSES.map(p => {
            const Icon = p.icon;
            const sel = purpose === p.id;
            return (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onPurpose(p.id)}
                className={`
                  relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-200 overflow-hidden
                  ${sel ? 'border-white bg-white shadow-lg shadow-white/20' : 'border-white/20 bg-white/8 hover:bg-white/15 hover:border-white/40'}
                `}
              >
                {sel && <motion.div layoutId="purposeGlow" className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5" />}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${sel ? 'shadow-md' : 'bg-white/10'}`}
                  style={sel ? { backgroundColor: p.bg } : {}}>
                  <Icon className="w-5 h-5" style={{ color: sel ? p.color : 'rgba(255,255,255,0.8)' }} />
                </div>
                <span className={`text-[11px] font-bold text-center leading-tight ${sel ? 'text-[#1A1A1A]' : 'text-white/80'}`}>{p.label}</span>
                {sel && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-4 h-4 bg-[#E30613] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </motion.div>}
              </motion.button>
            );
          })}
        </div>
      </div>
      {purpose && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-white/70" />
            <span className="text-white font-bold text-[13px] uppercase tracking-wider">Describe Your Concern <span className="text-white/40 normal-case font-medium">(optional)</span></span>
          </div>
          <textarea
            value={concern}
            onChange={e => onConcern(e.target.value)}
            placeholder="Briefly describe what you'd like to discuss so your mentor can prepare..."
            rows={4}
            maxLength={300}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-[13px] resize-none focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
          />
          <div className="flex justify-end mt-1">
            <span className="text-white/30 text-[10px]">{concern.length}/300</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Step 3: Summary ─── */
function StepSummary({ date, time, purpose, concern }: { date: string; time: string; purpose: string; concern: string }) {
  const f = CURRENT_FACULTY;
  const s = CURRENT_STUDENT;
  const slot = TIME_SLOTS.find(t => t.id === time);
  const purposeObj = PURPOSES.find(p => p.id === purpose);
  const PurposeIcon = purposeObj?.icon ?? HelpCircle;
  const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-white/60 text-[12px]">Review your booking before confirming</p>
      </div>

      {/* Mentor card */}
      <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#E30613] to-[#9b0000] flex items-center justify-center shadow-lg shrink-0">
          <span className="text-white font-extrabold text-[15px]">{f.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-extrabold text-[14px]">{f.name}</div>
          <div className="text-white/50 text-[11px]">{f.designation}</div>
          <div className="text-white/40 text-[10px] mt-0.5">{f.department} • Block {f.block}</div>
        </div>
        <div className="shrink-0">
          <div className="flex items-center gap-1 px-2 py-1 bg-[#22c55e]/20 rounded-lg border border-[#22c55e]/30">
            <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
            <span className="text-[#22c55e] text-[10px] font-bold">Available</span>
          </div>
        </div>
      </div>

      {/* Booking details */}
      <div className="space-y-2.5">
        {[
          { label: 'Student', value: `${s.name} • ${s.uid}`, icon: User },
          { label: 'Date', value: formattedDate, icon: Calendar },
          { label: 'Time', value: slot?.time ?? '', icon: Clock },
          { label: 'Purpose', value: purposeObj?.label ?? '', icon: PurposeIcon },
        ].map(row => {
          const RowIcon = row.icon;
          return (
            <div key={row.label} className="flex items-start gap-3 px-4 py-3 bg-white/8 rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <RowIcon className="w-3.5 h-3.5 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white/40 text-[9px] font-bold uppercase tracking-wider">{row.label}</div>
                <div className="text-white font-semibold text-[12px] mt-0.5 leading-snug">{row.value}</div>
              </div>
            </div>
          );
        })}
        {concern && (
          <div className="flex items-start gap-3 px-4 py-3 bg-white/8 rounded-xl border border-white/10">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/40 text-[9px] font-bold uppercase tracking-wider">Concern</div>
              <div className="text-white/70 text-[11px] mt-0.5 leading-relaxed italic">"{concern}"</div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-[#E30613]/15 rounded-xl border border-[#E30613]/30">
        <p className="text-white/60 text-[11px] text-center leading-relaxed">
          A <span className="text-white font-semibold">confirmation notification</span> will be sent after booking. Sessions are <span className="text-white font-semibold">7 minutes</span> and conducted via <span className="text-white font-semibold">video call</span>.
        </p>
      </div>
    </div>
  );
}

/* ─── Success Screen ─── */
const CONFETTI_COLORS = ['#E30613','#ff6b6b','#ffd700','#22c55e','#3b82f6','#a855f7','#fff'];
function SuccessScreen({ date, time, purpose }: { date: string; time: string; purpose: string }) {
  const f = CURRENT_FACULTY;
  const slot = TIME_SLOTS.find(t => t.id === time);
  const purposeObj = PURPOSES.find(p => p.id === purpose);
  const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
  const particles = Array.from({ length: 28 }, (_, i) => ({
    delay: i * 0.07,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  return (
    <div className="flex flex-col items-center py-4 relative overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => <ConfettiParticle key={i} {...p} />)}
      </div>

      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-5"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-2xl shadow-green-500/40">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}>
            <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
          </motion.div>
        </div>
        {/* Pulse rings */}
        {[1,2].map(i => (
          <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-[#22c55e]/40"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.5 + i * 0.4, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.6 + i * 0.3, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <h2 className="text-white text-[22px] font-extrabold tracking-tight">Session Booked!</h2>
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </div>
        <p className="text-white/60 text-[13px]">Your interaction has been confirmed</p>
      </motion.div>

      {/* Booking card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
        className="w-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/25 p-5 mb-4"
      >
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/15">
          <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-[#E30613] to-[#9b0000] flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-[13px]">{f.initials}</span>
          </div>
          <div>
            <div className="text-white font-extrabold text-[14px]">{f.name}</div>
            <div className="text-white/50 text-[11px]">{f.designation}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Date', value: formattedDate, icon: '📅' },
            { label: 'Time', value: slot?.time ?? '', icon: '⏰' },

            { label: 'Purpose', value: purposeObj?.label ?? '', icon: '🎯' },
          ].map(item => (
            <div key={item.label} className="bg-white/8 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[12px]">{item.icon}</span>
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
              </div>
              <div className="text-white font-bold text-[12px]">{item.value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="text-center px-2">
        <p className="text-white/40 text-[11px] leading-relaxed">
          Check your notifications for the meeting link. Join on time for the best experience.
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN MODAL EXPORT
═══════════════════════════════════════════════ */
export function BookInteractionModal({ isOpen, onClose }: BookInteractionModalProps) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [concern, setConcern] = useState('');
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const TOTAL_STEPS = 3;

  useEffect(() => {
    if (isOpen) {
      setStep(1); setDate(''); setTime(''); setPurpose(''); setConcern(''); setBooked(false); setBooking(false);
    }
  }, [isOpen]);

  const canNext = () => {
    if (step === 1) return !!date && !!time;
    if (step === 2) return !!purpose;
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else handleConfirm();
  };

  const handleConfirm = () => {
    setBooking(true);
    setTimeout(() => { setBooking(false); setBooked(true); }, 1800);
  };

  const stepTitles = ['Choose Date & Time', 'Purpose & Concern', 'Confirm Booking'];
  const stepSubtitles = ['Select your preferred slot', 'What would you like to discuss?', 'Review and confirm'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={e => { if (e.target === overlayRef.current) onClose(); }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative w-full max-w-lg max-h-[92vh] rounded-[28px] overflow-hidden shadow-2xl flex flex-col"
            style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #2d0a0a 40%, #E30613 100%)' }}
          >
            {/* Decorative orbs */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-32 h-32 bg-[#E30613]/10 rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative shrink-0 px-6 pt-6 pb-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {!booked ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <StepDots step={step} total={TOTAL_STEPS} />
                        <span className="text-white/40 text-[10px] font-bold">STEP {step} OF {TOTAL_STEPS}</span>
                      </div>
                      <h2 className="text-white text-[20px] font-extrabold tracking-tight">{stepTitles[step - 1]}</h2>
                      <p className="text-white/50 text-[12px] mt-0.5">{stepSubtitles[step - 1]}</p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E30613] to-[#9b0000] flex items-center justify-center">
                        <span className="text-white font-extrabold text-[10px]">CU</span>
                      </div>
                      <span className="text-white font-extrabold text-[16px]">Faculty Connect</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0 mt-0.5"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto px-6 pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <AnimatePresence mode="wait">
                {booked ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    <SuccessScreen date={date} time={time} purpose={purpose} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step === 1 && <StepDateTime date={date} time={time} onDate={setDate} onTime={setTime} />}
                    {step === 2 && <StepPurpose purpose={purpose} concern={concern} onPurpose={setPurpose} onConcern={setConcern} />}
                    {step === 3 && <StepSummary date={date} time={time} purpose={purpose} concern={concern} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {!booked && (
              <div className="relative shrink-0 px-6 py-4 border-t border-white/10 flex items-center gap-3">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[13px] font-semibold transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <button onClick={onClose} className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[13px] font-semibold transition-colors">
                    Cancel
                  </button>
                )}
                <motion.button
                  onClick={handleNext}
                  disabled={!canNext() || booking}
                  whileHover={canNext() && !booking ? { scale: 1.02, y: -1 } : {}}
                  whileTap={canNext() && !booking ? { scale: 0.98 } : {}}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-extrabold transition-all duration-300 ${
                    canNext() && !booking
                      ? 'bg-white text-[#E30613] shadow-lg shadow-white/20 hover:shadow-xl'
                      : 'bg-white/20 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {booking ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#E30613]/30 border-t-[#E30613] rounded-full" />
                      Confirming...
                    </>
                  ) : step === TOTAL_STEPS ? (
                    <><CheckCircle2 className="w-4 h-4" /> Confirm Booking</>
                  ) : (
                    <>Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </div>
            )}
            {booked && (
              <div className="relative shrink-0 px-6 py-4 border-t border-white/10">
                <button onClick={onClose}
                  className="w-full py-3 rounded-xl bg-white text-[#E30613] font-extrabold text-[13px] hover:bg-white/90 transition-colors shadow-lg shadow-white/20">
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
