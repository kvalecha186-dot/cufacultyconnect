import { useState, useEffect, useRef } from 'react';
import { GlowCard } from './ui/spotlight-card';
import cuLogo from '../../assets/CU.png';
import {
  GraduationCap,
  BookOpen,
  Building,
  ArrowRight,
  Activity,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Video,
  BarChart3,
  Zap,
  Shield,
  Menu,
  X,
  Star,
  Search,
  CalendarCheck,
  UserCheck,
  Lightbulb,
  Users,
  TrendingUp,
  MessageSquare,
  Gauge,
} from 'lucide-react';

/* ───────────── types ───────────── */
type LoginType = 'student' | 'faculty' | 'hod';

interface CUIMSLandingProps {
  onLoginClick: (type: LoginType) => void;
  onFacultyPortal: () => void;
  onAboutClick: () => void;
  onBookSlot: () => void;
}

/* ───────────── scroll reveal ───────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ───────────── login cards config ───────────── */
const loginCards: {
  type: LoginType;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof GraduationCap;
  gradient: string;
  shadowColor: string;
  accentColor: string;
  featureGradient: string;
  featureGlow: string;
  tag: string;
  keyFeatures: { icon: typeof GraduationCap; title: string; desc: string }[];
}[] = [
  {
    type: 'student',
    title: 'Student',
    subtitle: '& Parent Login',
    description: 'Access your dashboard, book mentorship sessions, track academics, and stay connected with faculty.',
    icon: GraduationCap,
    gradient: 'from-[#E30613] to-[#ff6b6b]',
    shadowColor: 'shadow-red-400/40',
    accentColor: '#E30613',
    featureGradient: 'from-[#E30613] to-[#ff6b6b]',
    featureGlow: 'rgba(227,6,19,0.35)',
    tag: 'Most Used',
    keyFeatures: [
      { icon: CalendarCheck, title: 'Book Sessions', desc: 'Track mentorship meetings' },
      { icon: TrendingUp, title: 'Academic Progress', desc: 'Monitor performance' },
      { icon: Users, title: 'Faculty Support', desc: 'Stay connected' },
    ],
  },
  {
    type: 'faculty',
    title: 'Faculty',
    subtitle: '& Senior Login',
    description: 'Manage mentorship schedules, track student progress, and connect with advisors seamlessly.',
    icon: BookOpen,
    gradient: 'from-[#1a1a2e] to-[#E30613]',
    shadowColor: 'shadow-slate-700/40',
    accentColor: '#E30613',
    featureGradient: 'from-[#7b1113] to-[#3a0a0c]',
    featureGlow: 'rgba(123,17,19,0.4)',
    tag: 'Mentor Portal',
    keyFeatures: [
      { icon: CalendarCheck, title: 'Manage Sessions', desc: 'Organize your calendar' },
      { icon: UserCheck, title: 'Monitor Students', desc: 'Follow mentee journeys' },
      { icon: MessageSquare, title: 'Provide Feedback', desc: 'Guide with insights' },
    ],
  },
  {
    type: 'hod',
    title: 'Director',
    subtitle: '& HOD Login',
    description: 'Macro-level oversight of departments, institutional analytics, and administrative control.',
    icon: Building,
    gradient: 'from-[#7b0000] to-[#E30613]',
    shadowColor: 'shadow-red-900/40',
    accentColor: '#E30613',
    featureGradient: 'from-[#5c0008] to-[#1a0002]',
    featureGlow: 'rgba(92,0,8,0.45)',
    tag: 'Admin Access',
    keyFeatures: [
      { icon: BarChart3, title: 'Department Insights', desc: 'Mentorship at a glance' },
      { icon: Activity, title: 'Mentorship Effectiveness', desc: 'Measure mentor impact, session quality, and student satisfaction.' },
      { icon: Gauge, title: 'Performance Monitoring', desc: 'Outcomes across cohorts' },
    ],
  },
];



/* ───────────── testimonials data ───────────── */
const testimonials = [
  {
    name: 'Aanya Sharma',
    dept: 'B.Tech CSE — 3rd Year',
    avatar: 'AS',
    avatarImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    color: 'from-[#E30613] to-[#ff6b6b]',
    tagColor: '#E30613',
    tag: 'MENTORSHIP',
    stars: 5,
    quote: 'The mentorship sessions helped me choose the right career path. My faculty mentor guided me through internship applications and I landed my dream role at a top tech firm.',
  },
  {
    name: 'Rohan Mehta',
    dept: 'MBA Marketing — 2nd Year',
    avatar: 'RM',
    avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    color: 'from-[#1a1a2e] to-[#E30613]',
    tagColor: '#3b82f6',
    tag: 'ACADEMICS',
    stars: 5,
    quote: 'Direct interaction with faculty improved my confidence tremendously. The platform made scheduling so easy — I never had to worry about missing a session.',
  },
  {
    name: 'Priya Verma',
    dept: 'B.Com Honours — Final Year',
    avatar: 'PV',
    avatarImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    color: 'from-[#7b0000] to-[#E30613]',
    tagColor: '#22c55e',
    tag: 'CAREER',
    stars: 5,
    quote: 'The platform made it easy to connect with experts from my department. I resolved semester-long doubts in just two focused sessions. Absolutely life-changing!',
  },
  {
    name: 'Karan Singh',
    dept: 'B.Tech ECE — 2nd Year',
    avatar: 'KS',
    avatarImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    color: 'from-[#E30613] to-[#ff6b6b]',
    tagColor: '#f59e0b',
    tag: 'SENIOR BUDDY',
    stars: 5,
    quote: 'My senior buddy helped me navigate the first year with ease. CU Faculty Connect is the best thing that happened to my academic journey at Chandigarh University.',
  },
  {
    name: 'Simran Kaur',
    dept: 'MCA — 1st Year',
    avatar: 'SK',
    avatarImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    color: 'from-[#1a1a2e] to-[#E30613]',
    tagColor: '#8b5cf6',
    tag: 'GUIDANCE',
    stars: 4,
    quote: 'I used to feel lost about which electives to pick. After just one session with my faculty mentor, I had a clear roadmap for the next two years. Highly recommend!',
  },
  {
    name: 'Arjun Nair',
    dept: 'B.Tech Mech — 3rd Year',
    avatar: 'AN',
    avatarImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
    color: 'from-[#E30613] to-[#ff6b6b]',
    tagColor: '#E30613',
    tag: 'RESEARCH',
    stars: 5,
    quote: 'Faculty Connect bridged the gap between theory and industry. My mentor introduced me to real projects and helped me publish my first research paper in 2nd year itself.',
  },
  {
    name: 'Divya Patel',
    dept: 'BBA Finance — 2nd Year',
    avatar: 'DP',
    avatarImg: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face',
    color: 'from-[#7b0000] to-[#E30613]',
    tagColor: '#3b82f6',
    tag: 'FACULTY',
    stars: 5,
    quote: 'My faculty mentor helped me crack a competitive finance certification. Her guidance on case studies was invaluable. I am now more confident in my professional future.',
  },
];



/* ───────────── feature showcase (split left/right) ───────────── */
const FEATURES = [
  {
    id: 'live',
    icon: Video,
    label: 'Live Sessions',
    title: 'Real-Time Mentorship,\nAny Time You Need It',
    description: 'Jump into face-to-face video sessions with your assigned faculty mentor — no waiting, no email chains. Zero scheduling friction means you get answers the moment doubt strikes.',
    pills: ['Available 24/7', 'HD Video', 'Instant Join'],
    badge: 'LIVE NOW',
    badgeColor: '#22c55e',
    visual: 'live',
  },
  {
    id: 'security',
    icon: Shield,
    label: 'Enterprise Security',
    title: 'CU-Grade Security,\nRole-Based Access',
    description: 'Built on Chandigarh University\'s SSO infrastructure with multi-layer role enforcement — students, mentors, HODs and directors each see exactly what they\'re authorised to.',
    pills: ['SSO Login', 'Role-Based', 'Encrypted'],
    badge: 'VERIFIED',
    badgeColor: '#3b82f6',
    visual: 'security',
  },
  {
    id: 'speed',
    icon: Zap,
    label: '5–7 Min Sessions',
    title: 'Hyper-Focused\nDouble-Click Doubts',
    description: 'Our structured 5-to-7 minute micro-session format eliminates small talk and gets straight to resolution — engineered for the pace of university life.',
    pills: ['Focused Format', 'Time-Boxed', 'High Throughput'],
    badge: 'FAST',
    badgeColor: '#f59e0b',
    visual: 'speed',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Deep Analytics',
    title: 'Institutional Intelligence\nat a Glance',
    description: 'Track satisfaction scores, resolution rates, SLA compliance and at-risk students in real time — giving HODs and Directors a bird-eye command of the entire mentorship pipeline.',
    pills: ['Real-Time', 'SLA Tracking', 'Risk Flags'],
    badge: 'LIVE DATA',
    badgeColor: '#8b5cf6',
    visual: 'analytics',
  },
  {
    id: 'community',
    icon: Users,
    label: '30K+ Students',
    title: 'A Thriving Campus\nMentorship Network',
    description: 'Over 30,000 students guided by 2,000+ verified faculty mentors — with a 98% satisfaction rate that speaks louder than any brochure.',
    pills: ['30K+ Students', '2K+ Mentors', '98% Satisfaction'],
    badge: 'GROWING',
    badgeColor: '#E30613',
    visual: 'community',
  },
];

function FeatureVisual({ type }: { type: string }) {
  if (type === 'live') return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Screen */}
      <rect x="30" y="30" width="360" height="220" rx="20" fill="#1a1a2e" opacity="0.97"/>
      <rect x="30" y="30" width="360" height="220" rx="20" stroke="#E30613" strokeWidth="2" opacity="0.4"/>
      {/* Two video tiles */}
      <rect x="50" y="52" width="155" height="110" rx="12" fill="#E30613" opacity="0.18"/>
      <rect x="215" y="52" width="155" height="110" rx="12" fill="#3b82f6" opacity="0.18"/>
      {/* Avatar circles */}
      <circle cx="127" cy="97" r="28" fill="#E30613" opacity="0.7"/>
      <text x="127" y="103" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">ST</text>
      <circle cx="292" cy="97" r="28" fill="#3b82f6" opacity="0.7"/>
      <text x="292" y="103" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">FM</text>
      {/* Name labels */}
      <rect x="68" y="148" width="118" height="6" rx="3" fill="white" opacity="0.2"/>
      <rect x="233" y="148" width="118" height="6" rx="3" fill="white" opacity="0.2"/>
      {/* Control bar */}
      <rect x="50" y="185" width="320" height="48" rx="10" fill="white" opacity="0.06"/>
      {/* Mic */}
      <circle cx="155" cy="209" r="14" fill="white" opacity="0.12"/>
      <rect x="149" y="202" width="12" height="10" rx="3" fill="white" opacity="0.6"/>
      <path d="M145 212 Q145 220 155 220 Q165 220 165 212" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* Camera */}
      <circle cx="210" cy="209" r="14" fill="white" opacity="0.12"/>
      <rect x="202" y="204" width="14" height="10" rx="3" fill="white" opacity="0.6"/>
      <polygon points="216,206 222,209 216,212" fill="white" opacity="0.6"/>
      {/* End call */}
      <circle cx="265" cy="209" r="14" fill="#E30613" opacity="0.9"/>
      <path d="M258 209 Q261 205 265 205 Q269 205 272 209" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Live badge */}
      <rect x="314" y="196" width="46" height="22" rx="6" fill="#22c55e" opacity="0.9"/>
      <text x="337" y="211" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">LIVE</text>
      {/* Pulse dot */}
      <circle cx="322" cy="207" r="3" fill="white"><animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite"/></circle>
      {/* Bottom info bar */}
      <rect x="30" y="260" width="360" height="40" rx="10" fill="#E30613" opacity="0.08"/>
      <circle cx="56" cy="280" r="10" fill="#E30613" opacity="0.7"/>
      <rect x="74" y="274" width="80" height="6" rx="3" fill="#E30613" opacity="0.5"/>
      <rect x="74" y="284" width="50" height="4" rx="2" fill="#888" opacity="0.4"/>
      <rect x="310" y="272" width="60" height="16" rx="8" fill="#E30613" opacity="0.9"/>
      <text x="340" y="284" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Join Now</text>
    </svg>
  );
  if (type === 'security') return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Shield main */}
      <path d="M210 30 L320 75 L320 175 Q320 240 210 280 Q100 240 100 175 L100 75 Z" fill="#1a1a2e" opacity="0.9"/>
      <path d="M210 30 L320 75 L320 175 Q320 240 210 280 Q100 240 100 175 L100 75 Z" stroke="#E30613" strokeWidth="2" opacity="0.5"/>
      {/* Inner shield glow */}
      <path d="M210 55 L300 92 L300 175 Q300 228 210 260 Q120 228 120 175 L120 92 Z" fill="#E30613" opacity="0.07"/>
      {/* Lock icon center */}
      <rect x="185" y="130" width="50" height="40" rx="8" fill="#E30613" opacity="0.9"/>
      <path d="M197 130 L197 118 Q197 103 210 103 Q223 103 223 118 L223 130" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="210" cy="152" r="5" fill="white"/>
      <rect x="208" y="152" width="4" height="8" rx="2" fill="white"/>
      {/* Orbit rings */}
      <circle cx="210" cy="160" r="75" stroke="#E30613" strokeWidth="1" strokeDasharray="6 4" opacity="0.25"><animateTransform attributeName="transform" type="rotate" from="0 210 160" to="360 210 160" dur="18s" repeatCount="indefinite"/></circle>
      <circle cx="210" cy="160" r="105" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 6" opacity="0.15"><animateTransform attributeName="transform" type="rotate" from="360 210 160" to="0 210 160" dur="25s" repeatCount="indefinite"/></circle>
      {/* Floating badges */}
      <rect x="60" y="100" width="70" height="26" rx="8" fill="#E30613" opacity="0.15"/>
      <rect x="60" y="100" width="70" height="26" rx="8" stroke="#E30613" strokeWidth="1" opacity="0.4"/>
      <text x="95" y="117" textAnchor="middle" fill="#E30613" fontSize="9" fontWeight="bold">SSO LOGIN</text>
      <rect x="290" y="100" width="72" height="26" rx="8" fill="#3b82f6" opacity="0.12"/>
      <rect x="290" y="100" width="72" height="26" rx="8" stroke="#3b82f6" strokeWidth="1" opacity="0.3"/>
      <text x="326" y="117" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">ROLE-BASED</text>
      <rect x="60" y="210" width="72" height="26" rx="8" fill="#22c55e" opacity="0.12"/>
      <rect x="60" y="210" width="72" height="26" rx="8" stroke="#22c55e" strokeWidth="1" opacity="0.3"/>
      <text x="96" y="227" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">ENCRYPTED</text>
      <rect x="290" y="210" width="72" height="26" rx="8" fill="#f59e0b" opacity="0.12"/>
      <rect x="290" y="210" width="72" height="26" rx="8" stroke="#f59e0b" strokeWidth="1" opacity="0.3"/>
      <text x="326" y="227" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">VERIFIED</text>
      {/* Check marks on connecting lines */}
      <line x1="130" y1="113" x2="170" y2="140" stroke="#E30613" strokeWidth="1" strokeDasharray="3 2" opacity="0.3"/>
      <line x1="290" y1="113" x2="250" y2="140" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2" opacity="0.3"/>
      <line x1="132" y1="223" x2="172" y2="185" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 2" opacity="0.3"/>
      <line x1="290" y1="223" x2="250" y2="185" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.3"/>
    </svg>
  );
  if (type === 'speed') return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Speedometer arc */}
      <path d="M80 220 A130 130 0 0 1 340 220" stroke="#1a1a2e" strokeWidth="24" strokeLinecap="round" opacity="0.15"/>
      <path d="M80 220 A130 130 0 0 1 260 108" stroke="url(#speedGrad)" strokeWidth="24" strokeLinecap="round"/>
      <defs>
        <linearGradient id="speedGrad" x1="80" y1="220" x2="260" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22c55e"/>
          <stop offset="0.5" stopColor="#f59e0b"/>
          <stop offset="1" stopColor="#E30613"/>
        </linearGradient>
      </defs>
      {/* Tick marks */}
      {[0,30,60,90,120,150,180].map((deg,i) => {
        const rad = (deg - 180) * Math.PI / 180;
        const cx = 210 + 130 * Math.cos(rad);
        const cy = 220 + 130 * Math.sin(rad);
        const ix = 210 + 112 * Math.cos(rad);
        const iy = 220 + 112 * Math.sin(rad);
        return <line key={i} x1={cx} y1={cy} x2={ix} y2={iy} stroke="white" strokeWidth={i%3===0?2:1} opacity={i%3===0?0.4:0.2}/>;
      })}
      {/* Needle */}
      <line x1="210" y1="220" x2="268" y2="118" stroke="#E30613" strokeWidth="3" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="-30 210 220" to="0 210 220" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/></line>
      <circle cx="210" cy="220" r="12" fill="#1a1a2e" stroke="#E30613" strokeWidth="3"/>
      <circle cx="210" cy="220" r="5" fill="#E30613"/>
      {/* Big number */}
      <text x="210" y="200" textAnchor="middle" fill="#1a1a2e" fontSize="52" fontWeight="900" opacity="0.9">5–7</text>
      <text x="210" y="222" textAnchor="middle" fill="#E30613" fontSize="13" fontWeight="700" letterSpacing="3">MIN SESSIONS</text>
      {/* Mini stat pills bottom */}
      <rect x="60" y="255" width="88" height="40" rx="10" fill="#E30613" opacity="0.1"/>
      <text x="104" y="272" textAnchor="middle" fill="#E30613" fontSize="16" fontWeight="900">1.2K</text>
      <text x="104" y="286" textAnchor="middle" fill="#888" fontSize="9" fontWeight="600">DAILY</text>
      <rect x="166" y="255" width="88" height="40" rx="10" fill="#1a1a2e" opacity="0.07"/>
      <text x="210" y="272" textAnchor="middle" fill="#1a1a2e" fontSize="16" fontWeight="900">94%</text>
      <text x="210" y="286" textAnchor="middle" fill="#888" fontSize="9" fontWeight="600">RESOLVED</text>
      <rect x="272" y="255" width="88" height="40" rx="10" fill="#3b82f6" opacity="0.1"/>
      <text x="316" y="272" textAnchor="middle" fill="#3b82f6" fontSize="16" fontWeight="900">4.9★</text>
      <text x="316" y="286" textAnchor="middle" fill="#888" fontSize="9" fontWeight="600">RATING</text>
    </svg>
  );
  if (type === 'analytics') return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Dashboard card bg */}
      <rect x="20" y="20" width="380" height="280" rx="20" fill="#1a1a2e" opacity="0.04"/>
      <rect x="20" y="20" width="380" height="280" rx="20" stroke="#E30613" strokeWidth="1" opacity="0.1"/>
      {/* Top mini stat cards */}
      {[{x:30,v:'95%',l:'Satisfaction',c:'#22c55e'},{x:155,v:'2.1K',l:'Sessions',c:'#E30613'},{x:280,v:'98%',l:'SLA Met',c:'#3b82f6'}].map((s)=>(
        <g key={s.l}>
          <rect x={s.x} y="35" width="110" height="55" rx="12" fill={s.c} opacity="0.1"/>
          <rect x={s.x} y="35" width="110" height="55" rx="12" stroke={s.c} strokeWidth="1" opacity="0.25"/>
          <text x={s.x+55} y="60" textAnchor="middle" fill={s.c} fontSize="18" fontWeight="900">{s.v}</text>
          <text x={s.x+55} y="77" textAnchor="middle" fill="#888" fontSize="9" fontWeight="600">{s.l}</text>
        </g>
      ))}
      {/* Bar chart */}
      <text x="30" y="118" fill="#1a1a2e" fontSize="11" fontWeight="700" opacity="0.5">Weekly Sessions</text>
      {[{h:55,c:'#E30613'},{h:80,c:'#E30613'},{h:45,c:'#E30613'},{h:100,c:'#E30613'},{h:70,c:'#E30613'},{h:120,c:'#E30613'},{h:90,c:'#E30613'}].map((b,i)=>(
        <g key={i}>
          <rect x={30+i*53} y={235-b.h} width="38" height={b.h} rx="6" fill={b.c} opacity={0.15+i*0.06}/>
          <rect x={30+i*53} y={235-b.h} width="38" height="6" rx="3" fill={b.c} opacity="0.8"/>
        </g>
      ))}
      {/* X axis */}
      <line x1="30" y1="240" x2="390" y2="240" stroke="#ccc" strokeWidth="1" opacity="0.4"/>
      {['M','T','W','T','F','S','S'].map((d,i)=>(
        <text key={i} x={49+i*53} y="254" textAnchor="middle" fill="#888" fontSize="9">{d}</text>
      ))}
      {/* Line chart overlay */}
      <polyline points="49,195 102,172 155,204 208,152 261,178 314,132 367,158" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
      {[{x:49,y:195},{x:102,y:172},{x:155,y:204},{x:208,y:152},{x:261,y:178},{x:314,y:132},{x:367,y:158}].map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" opacity="0.8"/>
      ))}
      {/* Legend */}
      <rect x="30" y="270" width="10" height="10" rx="2" fill="#E30613" opacity="0.7"/>
      <text x="46" y="279" fill="#888" fontSize="9">Sessions</text>
      <rect x="110" y="270" width="10" height="10" rx="2" fill="#3b82f6" opacity="0.7"/>
      <text x="126" y="279" fill="#888" fontSize="9">Satisfaction</text>
    </svg>
  );
  // community
  return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Central big stat */}
      <circle cx="210" cy="145" r="90" fill="#E30613" opacity="0.07"/>
      <circle cx="210" cy="145" r="65" fill="#E30613" opacity="0.1"/>
      <text x="210" y="135" textAnchor="middle" fill="#E30613" fontSize="38" fontWeight="900">30K+</text>
      <text x="210" y="158" textAnchor="middle" fill="#1a1a2e" fontSize="12" fontWeight="700" opacity="0.6">ACTIVE STUDENTS</text>
      {/* Orbiting avatars */}
      {[
        {deg:0,  label:'AS',color:'#E30613',r:105},
        {deg:60, label:'RM',color:'#3b82f6',r:105},
        {deg:120,label:'PV',color:'#22c55e',r:105},
        {deg:180,label:'KS',color:'#f59e0b',r:105},
        {deg:240,label:'SK',color:'#8b5cf6',r:105},
        {deg:300,label:'AT',color:'#E30613',r:105},
      ].map((av,i)=>{
        const rad = av.deg * Math.PI / 180;
        const cx = 210 + av.r * Math.cos(rad);
        const cy = 145 + av.r * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="22" fill={av.color} opacity="0.85"/>
            <text x={cx} y={cy+5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{av.label}</text>
          </g>
        );
      })}
      {/* Dashed orbit ring */}
      <circle cx="210" cy="145" r="105" stroke="#E30613" strokeWidth="1" strokeDasharray="5 4" opacity="0.2"><animateTransform attributeName="transform" type="rotate" from="0 210 145" to="360 210 145" dur="30s" repeatCount="indefinite"/></circle>
      {/* Bottom stat row */}
      {[{x:40,v:'2K+',l:'Faculty',c:'#3b82f6'},{x:168,v:'98%',l:'Satisfaction',c:'#22c55e'},{x:296,v:'15K+',l:'Sessions',c:'#8b5cf6'}].map(s=>(
        <g key={s.l}>
          <rect x={s.x} y="262" width="96" height="42" rx="10" fill={s.c} opacity="0.1"/>
          <rect x={s.x} y="262" width="96" height="42" rx="10" stroke={s.c} strokeWidth="1" opacity="0.25"/>
          <text x={s.x+48} y="281" textAnchor="middle" fill={s.c} fontSize="15" fontWeight="900">{s.v}</text>
          <text x={s.x+48} y="295" textAnchor="middle" fill="#888" fontSize="9" fontWeight="600">{s.l}</text>
        </g>
      ))}
    </svg>
  );
}

function FeatureShowcase({ visible }: { visible: boolean }) {
  const [active, setActive] = useState(0);
  const f = FEATURES[active];
  const Icon = f.icon;
  return (
    <div className={`w-full transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex flex-col lg:flex-row gap-10 items-stretch">

        {/* ── LEFT: text panel ── */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">

          {/* Tab pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {FEATURES.map((feat, i) => {
              const TabIcon = feat.icon;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-300
                    ${ active === i
                      ? 'bg-[#E30613] text-white shadow-lg shadow-red-400/30'
                      : 'bg-white border border-slate-200 text-[#555] hover:border-[#E30613]/40 hover:text-[#E30613]'
                    }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {feat.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div key={active} className="flex-1 flex flex-col justify-center" style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-5 w-fit">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.14em] text-white"
                style={{ background: f.badgeColor }}
              >
                {f.badge}
              </span>
            </div>

            {/* Icon + title */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#E30613]/10 border border-[#E30613]/20 flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-[#E30613]" />
              </div>
              <h3 className="text-[36px] lg:text-[46px] font-extrabold text-[#1A1A1A] leading-tight tracking-tight whitespace-pre-line">
                {f.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-[17px] text-[#666] leading-relaxed font-medium mb-7 max-w-[480px]">
              {f.description}
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {f.pills.map((p) => (
                <span key={p} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E30613]/8 border border-[#E30613]/15 text-[13px] font-bold text-[#E30613]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E30613]" />
                  {p}
                </span>
              ))}
            </div>

            {/* Step dots */}
            <div className="flex items-center gap-2">
              {FEATURES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === active ? 'w-8 h-2.5 bg-[#E30613]' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-[#E30613]/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: visual panel ── */}
        <div className="lg:flex-1 shrink-0">
          <div
            key={active}
            className="relative w-full h-[420px] lg:h-full min-h-[400px] rounded-3xl overflow-hidden flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #fff5f5 0%, #fff 60%, #f8f0ff 100%)',
              border: '1.5px solid rgba(227,6,19,0.12)',
              boxShadow: '0 24px 64px rgba(227,6,19,0.1), 0 4px 16px rgba(0,0,0,0.06)',
              animation: 'fadeSlideRight 0.45s ease both',
            }}
          >
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#E30613]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#E30613]/6 rounded-full blur-2xl" />
            <div className="relative w-full h-full p-6">
              <FeatureVisual type={f.visual} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export function CUIMSLanding({
  onLoginClick,
  onAboutClick,
}: CUIMSLandingProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cardsReveal = useScrollReveal(0.08);
  const metricsReveal = useScrollReveal(0.1);
  const featuresReveal = useScrollReveal(0.1);
  const stepsReveal = useScrollReveal(0.1);
  const testimonialsReveal = useScrollReveal(0.1);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 40%, #fff7f7 100%)' }}>

      {/* ── FLOATING BACKGROUND PARTICLES ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-[#E30613]/[0.04] rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] right-[8%] w-96 h-96 bg-[#E30613]/[0.03] rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-[20%] left-[15%] w-64 h-64 bg-rose-100/30 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_4s]" />
        <div className="absolute top-[65%] right-[20%] w-48 h-48 bg-[#E30613]/[0.03] rounded-full blur-2xl animate-[pulse_9s_ease-in-out_infinite_1s]" />
      </div>

      {/* ═══════════ NAVBAR ═══════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-2xl shadow-[0_4px_32px_rgba(227,6,19,0.08)] border-b border-red-100/40'
          : 'bg-white/60 backdrop-blur-xl'
      }`}>
        {/* Subtle top accent line */}
        <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#E30613] to-transparent opacity-80" />

        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="flex items-center h-[74px]">

            {/* ── LEFT: CU university logo ── */}
            <div className="flex items-center w-[180px]">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-[#E30613]/10 rounded-xl blur-md scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <img
                  src={cuLogo}
                  alt="Chandigarh University"
                  className="relative h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* ── CENTER: Brand name ── */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2.5 cursor-pointer group select-none">
                <span className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
                  CU{' '}
                  <span className="text-[#E30613]">Faculty</span>
                  {' '}Connect
                </span>
              </div>
            </div>

            {/* ── RIGHT: Nav links ── */}
            <div className="w-[180px] flex justify-end items-center gap-1">
              {[
                { label: 'Home', active: true },
                { label: 'About', onClick: onAboutClick },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`relative px-3.5 py-1.5 rounded-lg text-[14px] font-semibold transition-all duration-300 group/nav ${
                    item.active
                      ? 'bg-[#E30613]/10 text-[#E30613]'
                      : 'text-[#555] hover:text-[#1A1A1A] hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                  {item.active && (
                    <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E30613]" />
                  )}
                </button>
              ))}
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="md:hidden ml-1 p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              >
                {mobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ${mobileMenu ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/95 backdrop-blur-xl border-t border-red-100/30 px-5 py-3 space-y-1">
            {['Home', 'About'].map((label) => (
              <button
                key={label}
                onClick={() => { setMobileMenu(false); if (label === 'About') onAboutClick(); }}
                className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-[#444] hover:bg-red-50 hover:text-[#E30613] font-semibold text-sm transition-all duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E30613]/40" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ═══════════ HERO HEADER ═══════════ */}
      <section className="relative pt-[100px] pb-10 px-6 sm:px-12 lg:px-20">

        {/* Background blobs */}
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#E30613]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-0 w-[300px] h-[300px] bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#E30613]/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full text-center">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Main headline */}
            <h1 className="text-[36px] sm:text-[48px] lg:text-[58px] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#1A1A1A]">
              Where Students{' '}
              <span className="relative inline-block">
                <span className="text-[#E30613]">Connect,</span>
              </span>
              <br />
              <span className="text-[#E30613]">Learn,</span> and{' '}
              <span className="relative inline-block">
                <span className="text-[#E30613]">Thrive</span>
                {/* Underline swoosh */}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8 Q50 2 100 6 Q150 10 198 4" stroke="#E30613" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
                </svg>
              </span>
              .
            </h1>

            {/* Subtext */}
            <p className={`mt-7 text-[#777] text-[15px] sm:text-[16px] font-medium max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Connect with experienced faculty, senior mentors, and personalized support to make confident academic and career decisions.
            </p>

          </div>
        </div>
      </section>



      {/* ═══════════ LOGIN PORTAL CARDS — 3D CRAZY ═══════════ */}
      <section ref={cardsReveal.ref} className="relative px-6 sm:px-12 lg:px-20 pb-20 pt-4">

        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E30613]/[0.02] to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E30613]/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {loginCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.type}
                id={`login-card-${card.type}`}
                style={{
                  transitionDelay: cardsReveal.visible ? `${index * 150}ms` : '0ms',
                  perspective: '1000px',
                }}
                className={`group relative text-left transition-all duration-700
                  ${cardsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              >
                {/* 3D Card wrapper */}
                <div className={`relative rounded-3xl overflow-hidden
                  transition-all duration-500 ease-out
                  group-hover:-translate-y-3 group-hover:rotate-1
                  shadow-2xl ${card.shadowColor}
                  group-hover:shadow-[0_32px_64px_-12px] group-hover:${card.shadowColor}
                `}>

                  {/* Gradient top banner */}
                  <div className={`relative bg-gradient-to-br ${card.gradient} p-7 pb-10 overflow-hidden min-h-[200px]`}>
                    {/* Decorative circles */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute top-4 right-16 w-8 h-8 bg-white/10 rounded-full" />

                    {/* Tag badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] font-bold text-white tracking-[0.12em] uppercase">{card.tag}</span>
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-[-6deg] transition-all duration-500 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-[22px] font-extrabold text-white tracking-tight leading-none">
                      {card.title}
                    </h3>
                    <p className="text-white/70 text-[22px] font-extrabold mt-1">{card.subtitle}</p>
                  </div>

                  {/* White bottom section */}
                  <div className="bg-white px-7 pt-6 pb-7">
                    {/* Description */}
                    <p className="text-[13px] text-[#666] leading-relaxed font-medium mb-6">{card.description}</p>

                    {/* What You Can Do — premium vertical feature rows */}
                    <div className="mb-6">
                      <span className="text-[9.5px] font-extrabold text-[#AAA] uppercase tracking-[0.16em] mb-3 block">What You Can Do</span>

                      <div className="relative pl-4">
                        {/* Thin colored accent rail */}
                        <div
                          className={`absolute left-0 top-1 bottom-1 w-[2.5px] rounded-full bg-gradient-to-b ${card.featureGradient} opacity-70`}
                        />

                        <div className="divide-y divide-[#F2F2F2]/60">
                          {card.keyFeatures.map((kf, fi) => {
                            const KFIcon = kf.icon;
                            return (
                              <div
                                key={fi}
                                className="group/kf relative flex items-center gap-4 py-3 pr-1 rounded-xl cursor-default transition-all duration-300 ease-out hover:-translate-y-[2px] hover:bg-[#FAFAFA] hover:shadow-[0_6px_16px_-6px_var(--glow-color)]"
                                style={{ ['--glow-color' as string]: card.featureGlow }}
                              >
                                {/* Glowing icon circle */}
                                <div className="relative shrink-0">
                                  <div
                                    className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover/kf:opacity-50 scale-125 transition-opacity duration-300 bg-gradient-to-br ${card.featureGradient}`}
                                  />
                                  <div
                                    className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${card.featureGradient} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover/kf:scale-105`}
                                  >
                                    <KFIcon className="w-[18px] h-[18px] text-white" strokeWidth={1.9} />
                                  </div>
                                </div>

                                {/* Title + desc */}
                                <div className="flex-1 min-w-0">
                                  <div className="text-[13px] font-extrabold text-[#1A1A1A] leading-tight">{kf.title}</div>
                                  <div className="text-[11px] text-[#999] font-medium leading-snug mt-0.5">{kf.desc}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Sign In button */}
                    <button
                      type="button"
                      onClick={() => onLoginClick(card.type)}
                      className={`relative flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r ${card.gradient} text-white text-[13px] font-bold tracking-wide overflow-hidden cursor-pointer
                      shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                      <span className="relative">Sign In</span>
                      <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* 3D bottom edge */}
                  <div className={`h-2 bg-gradient-to-r ${card.gradient} opacity-60`} />
                </div>

                {/* 3D shadow floor */}
                <div className={`absolute -bottom-3 left-4 right-4 h-6 bg-gradient-to-r ${card.gradient} opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity duration-500`} />
              </div>
            );
          })}
        </div>
      </section>



      {/* ═══════════ WHY FACULTY CONNECT — SPLIT SHOWCASE ═══════════ */}
      <section ref={featuresReveal.ref} className="relative py-24 px-6 sm:px-12 lg:px-20 overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/[0.02] via-transparent to-[#E30613]/[0.02] pointer-events-none" />

        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${featuresReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E30613]/10 border border-[#E30613]/20 text-[11px] font-bold text-[#E30613] tracking-[0.14em] uppercase mb-4">
            Platform Features
          </span>
          <h2 className="text-[32px] lg:text-[42px] font-extrabold text-[#1A1A1A] tracking-[-0.03em] leading-tight">
            Why <span className="text-[#E30613]">Faculty Connect?</span>
          </h2>
          <p className="mt-3 text-[#777] text-[15px] font-medium max-w-md mx-auto">Purpose-built for Chandigarh University's mentorship ecosystem</p>
        </div>

        <FeatureShowcase visible={featuresReveal.visible} />
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section ref={stepsReveal.ref} className="relative py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">

        {/* ── Matching soft-rose bg from testimonials ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(160deg, #fff5f5 0%, #ffffff 50%, #fef2f2 100%)' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#E30613]/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[260px] bg-rose-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">

          {/* ── Header ── */}
          <div className={`text-center mb-20 transition-all duration-700 ${stepsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E30613]/10 border border-[#E30613]/20 text-[11px] font-bold text-[#E30613] tracking-[0.14em] uppercase mb-4">
              Simple Process
            </span>
            <h2 className="text-[32px] lg:text-[42px] font-extrabold text-[#1A1A1A] tracking-[-0.03em] leading-tight">
              How Faculty Connect <span className="text-[#E30613]">Works</span>
            </h2>
            <p className="mt-3 text-[#777] text-[15px] font-medium max-w-md mx-auto">Get expert guidance in four simple steps.</p>
          </div>

          {/* ── Steps layout ── */}
          <div className="relative">

            {/* ── Horizontal connector line (desktop) — sits at icon center ── */}
            <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%-8px)] right-[calc(12.5%-8px)] h-[2px] z-0"
              style={{ background: 'linear-gradient(to right, transparent, #E30613 15%, #E30613 85%, transparent)' }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
              {[
                {
                  icon: Search,
                  step: '01',
                  title: 'Choose Your Concern',
                  desc: 'Select the area you need help with — academics, career, or personal guidance.',
                  gradient: 'from-[#E30613] to-[#ff6b6b]',
                  accentColor: '#E30613',
                  tag: 'STEP ONE',
                },
                {
                  icon: CalendarCheck,
                  step: '02',
                  title: 'Book a Session',
                  desc: "Pick a convenient time slot from your mentor's available schedule instantly.",
                  gradient: 'from-[#1a1a2e] to-[#E30613]',
                  accentColor: '#c0392b',
                  tag: 'STEP TWO',
                },
                {
                  icon: UserCheck,
                  step: '03',
                  title: 'Meet Your Mentor',
                  desc: 'Connect face-to-face with your assigned faculty or senior buddy in a live session.',
                  gradient: 'from-[#7b0000] to-[#E30613]',
                  accentColor: '#922b21',
                  tag: 'STEP THREE',
                },
                {
                  icon: Lightbulb,
                  step: '04',
                  title: 'Get Personalized Guidance',
                  desc: 'Walk away with a clear, actionable plan tailored to your unique academic journey.',
                  gradient: 'from-[#E30613] to-[#ff6b6b]',
                  accentColor: '#E30613',
                  tag: 'STEP FOUR',
                },
              ].map((s, i) => {
                const SIcon = s.icon;
                return (
                  <div
                    key={i}
                    className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
                      stepsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: stepsReveal.visible ? `${i * 130}ms` : '0ms' }}
                  >
                    {/* ── Floating icon block (above card) ── */}
                    <div className="relative mb-6 group/icon">
                      {/* Glow halo behind icon */}
                      <div
                        className="absolute inset-0 rounded-[20px] blur-xl opacity-40 scale-110 transition-opacity duration-500 group-hover/icon:opacity-70"
                        style={{ background: `linear-gradient(135deg, ${s.accentColor}, #ff6b6b)` }}
                      />
                      {/* Icon square */}
                      <div
                        className={`relative w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br ${s.gradient} flex items-center justify-center
                          shadow-[0_8px_24px_rgba(227,6,19,0.35)]
                          group-hover/icon:scale-110 group-hover/icon:-rotate-6
                          transition-all duration-400`}
                      >
                        <SIcon className="w-7 h-7 text-white" strokeWidth={1.8} />
                      </div>
                      {/* Step number badge */}
                      <div className="absolute -top-2.5 -right-2.5 w-[22px] h-[22px] rounded-full bg-white border-2 border-[#E30613] flex items-center justify-center shadow-sm">
                        <span className="text-[8.5px] font-extrabold text-[#E30613] leading-none">{s.step}</span>
                      </div>
                    </div>

                    {/* ── GlowCard content card ── */}
                    <GlowCard
                      glowColor="red"
                      customSize
                      className="!rounded-[20px] !p-0 !gap-0 !grid-rows-none !aspect-auto w-full !shadow-none"
                    >
                      <div
                        className="relative bg-white rounded-[18px] px-6 pt-6 pb-5 w-full text-center overflow-hidden
                          shadow-[0_4px_24px_rgba(0,0,0,0.07)]
                          hover:shadow-[0_10px_40px_rgba(227,6,19,0.12)]
                          hover:-translate-y-1
                          transition-all duration-300"
                      >
                        {/* Colored accent line top */}
                        <div
                          className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full"
                          style={{ background: `linear-gradient(to right, transparent, ${s.accentColor}, transparent)` }}
                        />

                        {/* Tag pill */}
                        <div
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9.5px] font-extrabold tracking-[0.1em] mb-3"
                          style={{ color: s.accentColor, background: `${s.accentColor}15`, border: `1px solid ${s.accentColor}25` }}
                        >
                          {s.tag}
                        </div>

                        {/* Title */}
                        <h4 className="font-extrabold text-[#1A1A1A] text-[15px] tracking-tight mb-2 leading-snug">
                          {s.title}
                        </h4>

                        {/* Divider */}
                        <div className="w-8 h-[2px] rounded-full mx-auto mb-3" style={{ background: s.accentColor, opacity: 0.4 }} />

                        {/* Description */}
                        <p className="text-[12.5px] text-[#777] leading-relaxed font-medium">
                          {s.desc}
                        </p>

                        {/* Bottom accent dot */}
                        <div className="flex justify-center gap-1 mt-4">
                          {[...Array(3)].map((_, d) => (
                            <div
                              key={d}
                              className="rounded-full transition-all duration-300"
                              style={{
                                width: d === 1 ? '16px' : '5px',
                                height: '5px',
                                background: d === 1 ? s.accentColor : `${s.accentColor}40`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS — INFINITE MARQUEE ═══════════ */}
      <section ref={testimonialsReveal.ref} className="relative py-24 overflow-hidden">

        {/* ── Soft rose background ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(160deg, #fef2f2 0%, #fff7f7 50%, #fef2f2 100%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-[#E30613]/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[260px] bg-rose-100/20 rounded-full blur-3xl pointer-events-none" />

        {/* ── Inject marquee keyframe ── */}
        <style>{`
          @keyframes marquee-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-scroll 38s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="relative">

          {/* ── Section header ── */}
          <div className={`text-center mb-14 px-6 sm:px-12 lg:px-20 transition-all duration-700 ${testimonialsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E30613]/10 border border-[#E30613]/20 text-[11px] font-bold text-[#E30613] tracking-[0.14em] uppercase mb-4">
              Student Stories
            </span>
            <h2 className="text-[32px] lg:text-[42px] font-extrabold text-[#1A1A1A] tracking-[-0.03em] leading-tight">
              Success Stories from <span className="text-[#E30613]">Our Students</span>
            </h2>
            <p className="mt-3 text-[#777] text-[15px] font-medium max-w-lg mx-auto">
              Real experiences from students who benefited from faculty mentorship and guidance.
            </p>
          </div>

          {/* ── Marquee strip ── */}
          <div
            className={`relative w-full transition-all duration-700 delay-200 ${testimonialsReveal.visible ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Left fade edge */}
            <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #fef2f2 0%, transparent 100%)' }} />
            {/* Right fade edge */}
            <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, #fef2f2 0%, transparent 100%)' }} />

            {/* Scrolling track — cards duplicated for seamless loop */}
            <div className="overflow-hidden">
              <div className="marquee-track gap-5 py-4 px-2">
                {/* Original set + duplicate for seamless loop */}
                {[...testimonials, ...testimonials].map((t, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[360px]"
                    style={{ paddingLeft: i === 0 || i === testimonials.length ? '0' : undefined }}
                  >
                    <GlowCard
                      glowColor="red"
                      customSize
                      className="!rounded-[20px] !p-0 !gap-0 !grid-rows-none !aspect-auto w-full !shadow-none"
                    >
                      <div className="bg-white rounded-[18px] p-7 w-full flex flex-col gap-0
                        shadow-[0_4px_28px_rgba(0,0,0,0.07)]
                        hover:shadow-[0_8px_44px_rgba(227,6,19,0.13)]
                        transition-shadow duration-300"
                      >

                        {/* ── Row 1: Stars + Category badge ── */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex gap-[3px]">
                            {[...Array(5)].map((_, si) => (
                              <Star
                                key={si}
                                className={`w-[14px] h-[14px] ${si < t.stars ? 'fill-[#E30613] text-[#E30613]' : 'fill-slate-200 text-slate-200'}`}
                              />
                            ))}
                          </div>
                          <span
                            className="px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-[0.1em]"
                            style={{ color: t.tagColor, background: `${t.tagColor}18`, border: `1px solid ${t.tagColor}30` }}
                          >
                            {t.tag}
                          </span>
                        </div>

                        {/* ── Accent line ── */}
                        <div className="w-8 h-[2.5px] rounded-full mb-4" style={{ background: t.tagColor }} />

                        {/* ── Quote ── */}
                        <p className="text-[#2a2a2a] text-[13.5px] leading-[1.75] italic font-normal mb-6 flex-1">
                          "{t.quote}"
                        </p>

                        {/* ── Divider ── */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-rose-100 to-transparent mb-5" />

                        {/* ── Author row ── */}
                        <div className="flex items-center gap-3">
                          <img
                            src={t.avatarImg}
                            alt={t.name}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                            className="w-[42px] h-[42px] rounded-[10px] object-cover shadow-sm shrink-0"
                          />
                          <div className={`w-[42px] h-[42px] rounded-[10px] bg-gradient-to-br ${t.color} flex items-center justify-center shadow-sm shrink-0 hidden`}>
                            <span className="text-white font-extrabold text-[11px]">{t.avatar}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#1A1A1A] text-[13.5px] leading-tight truncate">{t.name}</div>
                            <div className="text-[11px] font-medium mt-0.5 truncate" style={{ color: t.tagColor }}>{t.dept}</div>
                          </div>
                        </div>

                      </div>
                    </GlowCard>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom stat strip ── */}
          <div className={`mt-14 px-6 sm:px-12 lg:px-20 flex flex-wrap justify-center gap-10 transition-all duration-700 delay-400 ${testimonialsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {[
              { value: '30,000+', label: 'Students Mentored' },
              { value: '98%',     label: 'Satisfaction Rate'  },
              { value: '2,000+',  label: 'Faculty Mentors'    },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-[28px] font-extrabold text-[#E30613] tracking-tight">{s.value}</span>
                <span className="text-[12px] font-semibold text-[#999] uppercase tracking-[0.1em]">{s.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#1A1A1A] text-gray-400 pt-14 lg:pt-20 pb-6">
        <div className="max-w-full mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 pb-12 border-b border-white/[0.08]">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#E30613] rounded-xl flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">CU</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">CU Faculty Connect</div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.12em]">Chandigarh University</div>
                </div>
              </div>
              <p className="text-[13px] leading-[1.8] text-gray-500 font-medium">Streamlines student onboarding & retention by enabling direct faculty interactions, scheduling, feedback, and risk tracking.</p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-[13px] mb-5 uppercase tracking-[0.12em]">Quick Links</h4>
              <ul className="space-y-3">
                {['Student Portal', 'Faculty Dashboard', 'HOD Portal', 'About Us', 'Analytics'].map((link) => (
                  <li key={link}><a href="#" className="text-[13px] font-medium text-gray-500 hover:text-[#FF3B47] transition-colors duration-300 flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /><span>{link}</span>
                  </a></li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-[13px] mb-5 uppercase tracking-[0.12em]">Contact Us</h4>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 text-[13px] font-medium text-gray-500"><MapPin className="w-4 h-4 mt-0.5 text-[#E30613] shrink-0" /><span>NH-05 Chandigarh-Ludhiana Highway, Gharuan, Mohali, Punjab – 140413</span></li>
                <li className="flex items-center gap-3 text-[13px] font-medium text-gray-500"><Phone className="w-4 h-4 text-[#E30613] shrink-0" /><span>+91-160-3051003</span></li>
                <li className="flex items-center gap-3 text-[13px] font-medium text-gray-500"><Mail className="w-4 h-4 text-[#E30613] shrink-0" /><span>connect@cuchd.in</span></li>
                <li className="flex items-center gap-3 text-[13px] font-medium text-gray-500"><Globe className="w-4 h-4 text-[#E30613] shrink-0" /><span>www.cuchd.in</span></li>
              </ul>
            </div>
            {/* Social */}
            <div>
              <h4 className="text-white font-bold text-[13px] mb-5 uppercase tracking-[0.12em]">Follow Us</h4>
              <div className="flex items-center gap-2.5">
                {[Facebook, Twitter, Linkedin, Youtube].map((SI, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/[0.05] hover:bg-[#E30613] rounded-xl flex items-center justify-center transition-all duration-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/20"><SI className="w-4 h-4 text-gray-400 hover:text-white" /></a>
                ))}
              </div>

            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-gray-600 font-medium">
            <p>© 2025 CU Faculty Connect — Chandigarh University. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-[#FF3B47] transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-[#FF3B47] transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-[#FF3B47] transition-colors duration-300">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
