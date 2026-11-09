import { useState, useEffect, useRef } from 'react';
import {
  X, Users, BookOpen, Crown, GraduationCap, Briefcase,
  CheckCircle2, Sparkles,
  CalendarDays, UserCheck, Star,
  HeartHandshake, BarChart3, Layers,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  const allFeatures = [
    { icon: GraduationCap, color: '#E30613', text: 'Book 1-on-1 Faculty Sessions' },
    { icon: BookOpen, color: '#E30613', text: 'Faculty-Led Doubt Resolution' },
    { icon: HeartHandshake, color: '#7C3AED', text: 'Senior Buddy Peer Guidance' },
    { icon: Sparkles, color: '#7C3AED', text: 'Personalized Mentorship Recommendations' },
    { icon: GraduationCap, color: '#0284C7', text: 'Track Academic Progress' },
    { icon: BarChart3, color: '#0284C7', text: 'Academic Performance Insights' },
    { icon: CalendarDays, color: '#0284C7', text: 'Session Calendar & History' },
    { icon: HeartHandshake, color: '#059669', text: 'Hostel & Campus Life Guidance' },
    { icon: Briefcase, color: '#059669', text: 'Placement & Career Mentoring' },
    { icon: UserCheck, color: '#D97706', text: 'Faculty Availability Scheduling' },
    { icon: Layers, color: '#D97706', text: 'Query Tracking & Resolution Status' },
    { icon: Star, color: '#D97706', text: 'Mentor Feedback System' },
    { icon: Layers, color: '#E30613', text: 'Section-Wise Progress View' },
  ];

  const stats = [
    { v: '7,750+',  l: 'Students Served',   icon: Users },
    { v: '120+',    l: 'Faculty Mentors',    icon: BookOpen },
    { v: '180+',    l: 'Senior Buddies',     icon: HeartHandshake },
    { v: '15,000+', l: 'Sessions Conducted', icon: CalendarDays },
    { v: '94%',     l: 'Satisfaction Rate',  icon: Star },
    { v: '98%',     l: 'Issue Resolution',   icon: CheckCircle2 },
  ];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-400 ${
        animateIn ? 'bg-black/60 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none'
      }`}
    >
      <div className={`relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto transition-all duration-500 ease-out ${
        animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
      }`}>

        {/* Close */}
        <button onClick={onClose} className="absolute top-5 right-5 z-20 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all hover:rotate-90 duration-300">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* ══ HERO SECTION ══ */}
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left — red hero */}
          <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#2d0a0a] to-[#E30613] p-10 lg:p-12 lg:rounded-l-3xl overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-black/[0.06] rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 28px, white 28px, white 29px)' }} />

            <div className="relative z-10">
              <h2 className="text-[34px] lg:text-[40px] font-extrabold text-white leading-[1.1] tracking-tight">
                CU Faculty<br />Connect
              </h2>
              <p className="mt-4 text-white/60 text-[14px] leading-[1.85] max-w-sm">
                A complete mentorship and guidance ecosystem for Chandigarh University — connecting Students, Senior Buddies, Faculty Mentors, HODs, and the Director around one goal: every student's academic success.
              </p>

              <div className="mt-7 space-y-2.5">
                {[
                  'Student Onboarding & Academic Tracking',
                  'Peer Mentorship via Senior Buddies',
                  'Faculty-Led Doubt Resolution & Sessions',
                  'HOD & Director Oversight Dashboards',
                  'Smart Session Booking & Mentorship Tracking',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <span className="text-[12px] text-white/65 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Stats grid */}
              <div className="mt-9 grid grid-cols-3 gap-2.5">
                {stats.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="text-center p-2.5 bg-white/[0.07] backdrop-blur-sm rounded-xl border border-white/[0.08]">
                      <div className="text-[18px] font-extrabold text-white leading-none">{s.v}</div>
                      <div className="text-[8px] text-white/40 font-bold uppercase tracking-wider mt-1 leading-tight">{s.l}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — unified roles */}
          <div className="p-8 lg:p-10">
            <div className="mb-5">
              <h3 className="text-[20px] font-extrabold text-[#1a1a1a] tracking-tight">Who Uses CU Connect?</h3>
              <p className="text-[13px] text-[#999] mt-1">Five roles, one mentorship journey</p>
            </div>

            {/* Single unified card */}
            <div className="rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA] p-5">
              {/* Role icons row */}
              <div className="flex items-center gap-2 mb-4">
                {[
                  { icon: GraduationCap, color: '#E30613', label: 'Students' },
                  { icon: HeartHandshake, color: '#7C3AED', label: 'Senior Buddy' },
                  { icon: BookOpen, color: '#0284C7', label: 'Faculty Mentor' },
                  { icon: Crown, color: '#D97706', label: 'HOD' },
                  { icon: Briefcase, color: '#059669', label: 'Director' },
                ].map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <div key={i} title={r.label}
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${r.color}15` }}>
                      <Icon className="w-4 h-4" style={{ color: r.color }} />
                    </div>
                  );
                })}
                <span className="ml-1 text-[11px] font-bold text-[#AAA]">All Roles</span>
              </div>

              {/* Single description */}
              <p className="text-[12px] text-[#555] leading-relaxed mb-5">
                CU Connect guides every stakeholder through the mentorship journey — from a fresher booking their first session to a Director championing student welfare. Each role gets the tools they need to help students grow.
              </p>

              {/* Combined features grid — clean cards */}
              <div className="grid grid-cols-2 gap-2">
                {allFeatures.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white border border-[#F0F0F0] hover:border-[#E5E5E5] hover:shadow-sm transition-all duration-150">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${f.color}15` }}>
                        <Icon className="w-3 h-3" style={{ color: f.color }} />
                      </div>
                      <span className="text-[10.5px] font-semibold text-[#444] leading-tight">{f.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <div className="border-t border-[#F0F0F0] px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#BBB] font-medium">
            CU Faculty Connect • Chandigarh University • Built for Student Success
          </p>
          <button onClick={onClose}
            className="px-8 py-2.5 bg-gradient-to-r from-[#E30613] to-[#B0000D] text-white rounded-xl font-bold text-[13px] hover:shadow-lg hover:shadow-red-600/20 hover:-translate-y-0.5 transition-all duration-200">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
