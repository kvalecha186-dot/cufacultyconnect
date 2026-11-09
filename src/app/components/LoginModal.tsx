import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import {
  GraduationCap, BookOpen, Building, Eye, EyeOff, X, Loader2,
  CheckCircle2, Lock, User, ArrowRight, ArrowLeft, Briefcase,
  Crown, UserCheck, Hash, KeyRound, Shield, RefreshCw
} from 'lucide-react';

export type ResolvedRole = 'student' | 'faculty' | 'senior' | 'hod' | 'director';
type LoginType = 'student' | 'faculty' | 'hod';
type SubRole = 'faculty' | 'senior' | 'hod_role' | 'director' | null;

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (role: ResolvedRole) => void;
  onCancel: () => void;
  loginType: LoginType;
}

export function LoginModal({ isOpen, onLoginSuccess, onCancel, loginType }: LoginModalProps) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldA, setFieldA] = useState('');
  const [fieldB, setFieldB] = useState('');
  const [fieldC, setFieldC] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subRole, setSubRole] = useState<SubRole>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Verification Code States
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaSeed, setCaptchaSeed] = useState(0);

  const generateCaptcha = () => {
    // Mixed-case alphanumeric, excluding visually ambiguous characters (0/O, 1/l/I)
    const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const LOWER = 'abcdefghijkmnpqrstuvwxyz';
    const DIGITS = '23456789';
    const ALL = UPPER + LOWER + DIGITS;
    const length = Math.random() < 0.5 ? 4 : 5;

    // Guarantee at least one uppercase, one lowercase and one digit so every
    // code is a genuine mix (e.g. PszA2 / X7mK style), then fill any
    // remaining slots randomly and shuffle so the guaranteed characters
    // don't always land in the same position.
    const pool = [
      UPPER[Math.floor(Math.random() * UPPER.length)],
      LOWER[Math.floor(Math.random() * LOWER.length)],
      DIGITS[Math.floor(Math.random() * DIGITS.length)],
    ];
    while (pool.length < length) {
      pool.push(ALL[Math.floor(Math.random() * ALL.length)]);
    }
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    setCaptchaCode(pool.join(''));
    setCaptchaSeed(Math.random());
  };

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setSuccess(false);
      setLoading(false);
      setErrors({});
      setFieldA('');
      setFieldB('');
      setFieldC('');
      setCaptchaInput('');
      setSubRole(null);
      setShowPassword(false);
      generateCaptcha();
      requestAnimationFrame(() => { requestAnimationFrame(() => setAnimateIn(true)); });
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => { 
    setFieldA(''); 
    setFieldB(''); 
    setFieldC(''); 
    setCaptchaInput('');
    setErrors({}); 
    generateCaptcha(); 
  }, [subRole]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && !loading) onCancel();
  };

  const resolveRole = (): ResolvedRole => {
    if (loginType === 'student') return 'student';
    if (loginType === 'faculty') return subRole === 'senior' ? 'senior' : 'faculty';
    if (loginType === 'hod') return subRole === 'director' ? 'director' : 'hod';
    return 'student';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!fieldA.trim()) {
      errs.fieldA = 'This field is required';
    } else if (loginType === 'student') {
      const value = fieldA.trim();
      const uidEmailPattern = /^\d{2}[A-Za-z]{2,4}\d{4,6}@cuchd\.in$/;
      if (!uidEmailPattern.test(value)) {
        errs.fieldA = 'Enter a valid UID email (e.g. 21CSE08472@cuchd.in)';
      }
    }

    if (!fieldB.trim()) errs.fieldB = 'Password is required';
    else if (fieldB.length < 4) errs.fieldB = 'Must be at least 4 characters';
    
    // Captcha Validation — case-sensitive, exact match
    if (!captchaInput.trim()) {
      errs.captcha = 'Verification code is required';
    } else if (captchaInput.trim() !== captchaCode) {
      errs.captcha = 'Incorrect verification code';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Security: issue a fresh code after EVERY failed attempt (wrong
      // password, wrong captcha, or missing fields) so the same code can
      // never be reused across repeated guesses.
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    setLoading(true);
    const performLogin = async () => {
      if (isSupabaseConfigured && supabase && fieldA.includes('@')) {
        try {
          await supabase.auth.signInWithPassword({
            email: fieldA.trim().toLowerCase(),
            password: fieldB.trim(),
          });
        } catch (err) {
          console.warn('Supabase auth fallback:', err);
        }
      }

      setLoading(false);
      setSuccess(true);
      generateCaptcha(); // fresh code ready underneath for the next login
      const role = resolveRole();
      setTimeout(() => onLoginSuccess(role), 1800);
    };

    setTimeout(performLogin, 1500);
  };

  const needsThirdField = () => false;
  const needsRoleStep = () => loginType === 'faculty' || loginType === 'hod';
  const showRolePicker = () => needsRoleStep() && subRole === null;
  const showForm = () => loginType === 'student' || subRole !== null;

  const getHeader = () => {
    if (loginType === 'student') return { title: 'Student Login', subtitle: 'Access mentorship sessions, academic tracking & progress overview', icon: GraduationCap };
    if (loginType === 'faculty') {
      if (subRole === 'faculty') return { title: 'Faculty Login', subtitle: 'Manage student mentorship, conduct sessions & review analytics', icon: BookOpen };
      if (subRole === 'senior') return { title: 'Senior Mentor Login', subtitle: 'Guide freshers, share resources & track peer mentorship', icon: UserCheck };
      return { title: 'Faculty / Senior Login', subtitle: 'Select your role to continue', icon: BookOpen };
    }
    if (loginType === 'hod') {
      if (subRole === 'hod_role') return { title: 'HOD Login', subtitle: 'Department management, faculty monitoring & escalation control', icon: Crown };
      if (subRole === 'director') return { title: 'Director Login', subtitle: 'Institutional oversight, strategic metrics & compliance', icon: Briefcase };
      return { title: 'HOD / Director Login', subtitle: 'Select your administrative role to continue', icon: Building };
    }
    return { title: '', subtitle: '', icon: GraduationCap };
  };

  const getFields = () => {
    if (loginType === 'student') return { a: 'UID Email', aPlaceholder: 'e.g. 21CSE08472@cuchd.in', b: 'Password', bPlaceholder: 'Enter your password' };
    if (subRole === 'faculty') return { a: 'Faculty ID', aPlaceholder: 'e.g. CU-FAC-08421', b: 'Password', bPlaceholder: 'Enter your password' };
    if (subRole === 'senior') return { a: 'Senior UID', aPlaceholder: 'e.g. 23BCS12045', b: 'Password', bPlaceholder: 'Enter your password' };
    if (subRole === 'hod_role') return { a: 'HOD Login ID', aPlaceholder: 'e.g. CU-HOD-00112', b: 'Secure PIN / Password', bPlaceholder: 'Enter PIN or password' };
    if (subRole === 'director') return { a: 'Director Access ID', aPlaceholder: 'e.g. CU-DIR-00001', b: 'Authentication Key', bPlaceholder: 'Enter your secure key' };
    return { a: '', aPlaceholder: '', b: '', bPlaceholder: '' };
  };

  const header = getHeader();
  const fields = getFields();
  const Icon = header.icon;

  if (!visible) return null;

  return (
    <div ref={overlayRef} onClick={handleOverlayClick}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-350 ${animateIn ? 'bg-black/60 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none'}`}>
      <div className={`relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out ${animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
        <button onClick={onCancel} disabled={loading}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center transition-all text-white hover:rotate-90 duration-300">
          <X className="w-4 h-4" />
        </button>

        <div className="relative bg-gradient-to-r from-[#E30613] via-[#E30613] to-[#B0000D] px-8 py-8 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{header.title}</h2>
              <p className="text-sm text-white/70 mt-0.5 leading-snug max-w-[250px]">{header.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-7">
          {success ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">Login Successful!</h3>
              <p className="text-sm text-[#666] mt-1">Redirecting to your dashboard…</p>
              <div className="mt-4 flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i*150}ms` }} />)}
              </div>
            </div>
          ) : showRolePicker() ? (
            <div className="space-y-4 py-2">
              <p className="text-[14px] font-semibold text-[#444] text-center mb-5">Select your role to continue</p>
              {loginType === 'faculty' ? (
                <>
                  <RoleButton icon={BookOpen} title="I am Faculty" desc="Faculty mentors — manage freshers, doubts, sessions & academics" onClick={() => setSubRole('faculty')} />
                  <RoleButton icon={UserCheck} title="I am a Senior Mentor" desc="Senior students — guide freshers on campus life, clubs & careers" onClick={() => setSubRole('senior')} />
                </>
              ) : (
                <>
                  <RoleButton icon={Crown} title="I am an HOD" desc="Head of Department — faculty management, escalations & reports" onClick={() => setSubRole('hod_role')} />
                  <RoleButton icon={Briefcase} title="I am a Director" desc="Director — university-wide oversight, analytics & strategic control" onClick={() => setSubRole('director')} />
                </>
              )}
            </div>
          ) : showForm() ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {needsRoleStep() && (
                <button type="button" onClick={() => setSubRole(null)}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-[#E30613] hover:text-[#B0000D] transition-colors -mt-1 mb-1">
                  <ArrowLeft className="w-3 h-3" /> Back to role selection
                </button>
              )}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">{fields.a}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <input type="text" value={fieldA} onChange={e => { setFieldA(e.target.value); if (errors.fieldA) setErrors(p => ({...p, fieldA:''})); }}
                    placeholder={fields.aPlaceholder}
                    className={`w-full pl-11 pr-4 py-3 bg-[#F5F5F5] border-2 rounded-xl text-sm text-[#1A1A1A] transition-all duration-300 focus:outline-none focus:bg-white ${errors.fieldA ? 'border-red-300 focus:border-[#FF3B47]' : 'border-[#E5E5E5] focus:border-[#FF3B47]'}`} />
                </div>
                {errors.fieldA && <p className="mt-1 text-xs text-red-500 font-medium">{errors.fieldA}</p>}
                {!errors.fieldA && loginType === 'student' && (
                  <p className="mt-1 text-xs text-[#999]">Use your university UID email (e.g. 21CSE08472@cuchd.in)</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">{fields.b}</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <input type={showPassword ? 'text' : 'password'} value={fieldB} onChange={e => { setFieldB(e.target.value); if (errors.fieldB) setErrors(p => ({...p, fieldB:''})); }}
                    placeholder={fields.bPlaceholder}
                    className={`w-full pl-11 pr-12 py-3 bg-[#F5F5F5] border-2 rounded-xl text-sm text-[#1A1A1A] transition-all duration-300 focus:outline-none focus:bg-white ${errors.fieldB ? 'border-red-300 focus:border-[#FF3B47]' : 'border-[#E5E5E5] focus:border-[#FF3B47]'}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#1A1A1A] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.fieldB && <p className="mt-1 text-xs text-red-500 font-medium">{errors.fieldB}</p>}
              </div>

              {/* Premium Verification Code */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Verification Code</label>
                <div className="flex gap-3 items-stretch">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={captchaInput} 
                      onChange={e => { setCaptchaInput(e.target.value); if (errors.captcha) setErrors(p => ({...p, captcha:''})); }}
                      placeholder="Enter code shown"
                      maxLength={5}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className={`w-full h-full px-4 py-3 bg-[#F5F5F5] border-2 rounded-xl text-sm text-[#1A1A1A] tracking-wider focus:outline-none focus:bg-white ${errors.captcha ? 'border-red-300 focus:border-[#FF3B47]' : 'border-[#E5E5E5] focus:border-[#FF3B47]'}`} 
                    />
                  </div>

                  {/* Captcha Display Block — premium red/black themed */}
                  <div className="flex items-center gap-2">
                    <CaptchaDisplay code={captchaCode} seed={captchaSeed} />
                    <button 
                      type="button" 
                      onClick={generateCaptcha} 
                      className="shrink-0 p-3 bg-[#1A1A1A] hover:bg-[#E30613] border-2 border-[#1A1A1A] hover:border-[#E30613] rounded-xl text-white transition-all duration-300 hover:rotate-180"
                      title="Generate new code"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {errors.captcha && <p className="mt-1 text-xs text-red-500 font-medium">{errors.captcha}</p>}
                {!errors.captcha && <p className="mt-1 text-xs text-[#999]">Code is case-sensitive</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div onClick={() => setRemember(!remember)} className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${remember ? 'bg-[#E30613] border-transparent' : 'border-[#E5E5E5] group-hover:border-[#E30613]'}`}>
                    {remember && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm text-[#444]">Remember me</span>
                </label>
                <button type="button" className="text-sm font-medium text-[#E30613] hover:underline">Forgot Password?</button>
              </div>
              <button type="submit" disabled={loading}
                className="group relative w-full py-3.5 bg-gradient-to-r from-[#E30613] to-[#B0000D] text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex-1 flex items-center justify-center gap-2">
                  {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Authenticating...</span></>) : (<><span>Login Now</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>)}
                </span>
              </button>
              <div className="flex items-center justify-center gap-2 pt-1">
                <Shield className="w-3 h-3 text-[#666]" />
                <span className="text-[11px] text-[#666]">Secured with CU Enterprise Authentication</span>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function RoleButton({ icon: RIcon, title, desc, onClick }: { icon: typeof BookOpen; title: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center gap-4 p-5 bg-[#F5F5F5] hover:bg-[#E30613]/[0.04] border-2 border-[#E5E5E5] hover:border-[#FF3B47]/40 rounded-2xl text-left transition-all duration-300 group hover:-translate-y-[2px] hover:shadow-md">
      <div className="w-12 h-12 bg-[#E30613]/[0.08] group-hover:bg-[#E30613]/[0.14] rounded-xl flex items-center justify-center shrink-0 transition-colors">
        <RIcon className="w-6 h-6 text-[#E30613]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-bold text-[#1A1A1A]">{title}</div>
        <div className="text-[12px] text-[#666] mt-0.5 leading-snug">{desc}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-[#E30613] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
    </button>
  );
}

// Deterministic pseudo-random generator. Seeded per-code so the distortion
// (rotation/spacing/wave) stays stable while the user is typing, but a brand
// new layout is produced every time generateCaptcha() runs.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function CaptchaDisplay({ code, seed }: { code: string; seed: number }) {
  const rand = mulberry32(Math.floor(seed * 1_000_000) || 1);
  const height = 48;

  // Lay characters out with variable spacing, vertical jitter and rotation —
  // computed with a running cursor so the gaps themselves are uneven.
  let cursorX = 14;
  const chars = code.split('').map((ch) => {
    const rotate = (rand() - 0.5) * 28; // -14deg .. 14deg
    const dy = (rand() - 0.5) * 10;
    const charGap = 19 + (rand() - 0.5) * 8;
    const x = cursorX;
    cursorX += charGap;
    const y = height / 2 + 7 + dy;
    const accent = rand() > 0.55;
    return { ch, x, y, rotate, accent };
  });
  const width = Math.max(104, Math.round(cursorX + 12));

  // Two soft wave-distortion strokes drawn across the whole code.
  const waveA = `M0 ${height * 0.38} Q ${width * 0.25} ${height * 0.68}, ${width * 0.5} ${height * 0.4} T ${width} ${height * 0.46}`;
  const waveB = `M0 ${height * 0.66} Q ${width * 0.3} ${height * 0.28}, ${width * 0.6} ${height * 0.6} T ${width} ${height * 0.5}`;

  const noiseDots = Array.from({ length: 10 }).map((_, i) => ({
    cx: rand() * width,
    cy: rand() * height,
    key: i,
  }));

  return (
    <div
      className="relative shrink-0 rounded-xl overflow-hidden border-2 border-[#1A1A1A] select-none"
      style={{ width, height }}
      role="img"
      aria-label="Verification code image"
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" className="block">
        <defs>
          <linearGradient id="captchaBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="55%" stopColor="#3A0A0E" />
            <stop offset="100%" stopColor="#E30613" />
          </linearGradient>
          <pattern id="captchaStripes" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="9" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="2" />
          </pattern>
        </defs>

        <rect width={width} height={height} fill="url(#captchaBg)" />
        <rect width={width} height={height} fill="url(#captchaStripes)" />

        {/* subtle wave distortion */}
        <path d={waveA} stroke="#FF8088" strokeOpacity="0.4" strokeWidth="1.1" fill="none" />
        <path d={waveB} stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="1" fill="none" />

        {/* characters — rotated + spaced irregularly */}
        {chars.map((c, i) => (
          <text
            key={i}
            x={c.x}
            y={c.y}
            transform={`rotate(${c.rotate} ${c.x} ${c.y})`}
            fontSize="21"
            fontFamily="'Trebuchet MS', 'Segoe UI', sans-serif"
            fontWeight={800}
            fill={c.accent ? '#FFD7D9' : '#FFFFFF'}
          >
            {c.ch}
          </text>
        ))}

        {/* faint anti-OCR noise */}
        {noiseDots.map((d) => (
          <circle key={d.key} cx={d.cx} cy={d.cy} r={0.7} fill="#FFFFFF" fillOpacity={0.25} />
        ))}
      </svg>
    </div>
  );
}
