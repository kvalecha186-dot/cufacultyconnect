import { useState, useEffect, useRef } from 'react';
import splashBg from '../../assets/splash-bg.jpg';

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size: Math.random() * 5 + 3,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  duration: Math.random() * 6 + 8,
  opacity: Math.random() * 0.18 + 0.06,
}));

const FloatingIcons = () => (
  <>
    <div className="splash-float-icon" style={{ top: '12%', left: '8%', animationDelay: '0s', animationDuration: '7s' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="rgba(255,255,255,0.18)"/>
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="rgba(255,255,255,0.12)"/>
      </svg>
    </div>
    <div className="splash-float-icon" style={{ top: '18%', right: '9%', animationDelay: '1.2s', animationDuration: '9s' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="rgba(255,255,255,0.14)"/>
      </svg>
    </div>
    <div className="splash-float-icon" style={{ bottom: '22%', left: '6%', animationDelay: '2.1s', animationDuration: '8s' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 18H7V4h10v16z" fill="rgba(255,255,255,0.13)"/>
        <path d="M9 7h6v1.5H9zm0 3h6v1.5H9zm0 3h4v1.5H9z" fill="rgba(255,255,255,0.13)"/>
      </svg>
    </div>
    <div className="splash-float-icon" style={{ bottom: '18%', right: '7%', animationDelay: '0.8s', animationDuration: '10s' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="rgba(255,255,255,0.13)"/>
      </svg>
    </div>
    <div className="splash-float-icon" style={{ top: '55%', left: '4%', animationDelay: '3s', animationDuration: '11s' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="rgba(255,255,255,0.12)"/>
      </svg>
    </div>
    <div className="splash-float-icon" style={{ top: '40%', right: '5%', animationDelay: '1.8s', animationDuration: '9.5s' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H8v2h8v-2h-3v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="rgba(255,255,255,0.13)"/>
      </svg>
    </div>
  </>
);

// ── Cool SVG stat icons (no emojis) ──
// Card 1: Graduation cap with orbiting dashes
// Card 2: Person + verified star badge
// Card 3: Bar chart with arc ring

const StatIcons = {
  students: (color: string) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Dashed orbit ring */}
      <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.35" className="stat-orbit"/>
      {/* Cap body */}
      <polygon points="20,10 6,17 20,24 34,17" fill={color} opacity="0.95"/>
      {/* Cap brim glow */}
      <polygon points="20,10 6,17 20,24 34,17" fill="white" opacity="0.08"/>
      {/* Tassel arm */}
      <line x1="34" y1="17" x2="34" y2="25" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="34" cy="26.5" r="2" fill={color}/>
      {/* Diploma scroll */}
      <path d="M14 20v6c0 3 2.8 5 6 5s6-2 6-5v-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8"/>
    </svg>
  ),
  mentors: (color: string) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Soft pulse ring */}
      <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1" opacity="0.25" className="stat-pulse-ring"/>
      {/* Head */}
      <circle cx="20" cy="15" r="6" fill={color} opacity="0.92"/>
      <circle cx="20" cy="15" r="6" fill="white" opacity="0.07"/>
      {/* Body */}
      <path d="M9 33c0-6.1 4.9-11 11-11s11 4.9 11 11" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* Verified star badge (top-right) */}
      <circle cx="32" cy="9" r="5.5" fill={color} opacity="0.18"/>
      <polygon points="32,5 33.2,8.5 37,8.5 34,10.8 35.2,14.2 32,12 28.8,14.2 30,10.8 27,8.5 30.8,8.5"
        fill={color} opacity="0.95"/>
    </svg>
  ),
  satisfaction: (color: string) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Track ring */}
      <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.12)" strokeWidth="3" fill="none"/>
      {/* Progress arc ~95% */}
      <circle cx="20" cy="20" r="16" stroke={color} strokeWidth="3" fill="none"
        strokeDasharray="95 5" strokeDashoffset="25" strokeLinecap="round" className="stat-arc"/>
      {/* Bar chart inside */}
      <rect x="12" y="26" width="4" height="5" rx="1.5" fill={color} opacity="0.5"/>
      <rect x="18" y="22" width="4" height="9" rx="1.5" fill={color} opacity="0.72"/>
      <rect x="24" y="17" width="4" height="14" rx="1.5" fill={color} opacity="0.95"/>
      {/* Checkmark */}
      <path d="M13 17l3.5 3.5 7-8" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const STATS = [
  {
    value: '2500+',
    label: 'Students Guided',
    svgKey: 'students' as const,
    color: '#FFD84D',
    accent: 'rgba(255,216,77,0.18)',
    glow: 'rgba(255,216,77,0.5)',
    border: 'rgba(255,216,77,0.45)',
    badge: 'GROWING',
    badgeColor: 'rgba(255,216,77,0.88)',
  },
  {
    value: '150+',
    label: 'Expert Mentors',
    svgKey: 'mentors' as const,
    color: '#5DD4FF',
    accent: 'rgba(93,212,255,0.16)',
    glow: 'rgba(93,212,255,0.48)',
    border: 'rgba(93,212,255,0.4)',
    badge: 'VERIFIED',
    badgeColor: 'rgba(93,212,255,0.88)',
  },
  {
    value: '95%',
    label: 'Satisfaction',
    svgKey: 'satisfaction' as const,
    color: '#C084FC',
    accent: 'rgba(192,132,252,0.16)',
    glow: 'rgba(192,132,252,0.48)',
    border: 'rgba(192,132,252,0.4)',
    badge: 'TOP RATED',
    badgeColor: 'rgba(192,132,252,0.88)',
  },
];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit' | 'done'>('enter');
  const [progress, setProgress] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const enterTimer = setTimeout(() => setPhase('visible'), 120);
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { if (progressRef.current) clearInterval(progressRef.current); return 100; }
        return p + 100 / (4600 / 40);
      });
    }, 40);
    const exitTimer = setTimeout(() => setPhase('exit'), 5200);
    const doneTimer = setTimeout(() => {
      setPhase('done'); document.body.style.overflow = ''; onComplete();
    }, 5800);
    return () => {
      clearTimeout(enterTimer); clearTimeout(exitTimer); clearTimeout(doneTimer);
      if (progressRef.current) clearInterval(progressRef.current);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (phase === 'done') return null;
  const isVisible = phase === 'visible';
  const isExit = phase === 'exit';

  return (
    <div className="splash-root" style={{
      opacity: isExit ? 0 : 1,
      transition: isExit ? 'opacity 600ms cubic-bezier(0.4,0,0.2,1)' : 'none',
      pointerEvents: isExit ? 'none' : 'auto',
    }}>
      <div className="splash-bg" style={{ ['--splash-img' as string]: `url(${splashBg})` }} />
      <div className="splash-glow splash-glow-1" /><div className="splash-glow splash-glow-2" /><div className="splash-glow splash-glow-3" />

      {PARTICLES.map(p => (
        <div key={p.id} className="splash-particle" style={{
          width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`,
          opacity: p.opacity, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
        }} />
      ))}
      <FloatingIcons />

      <div className="splash-center">

        {/* Logo */}
        <div className="splash-logo-wrap" style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.75) translateY(20px)',
          transition: 'all 700ms cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div className="splash-pulse-ring" /><div className="splash-pulse-ring splash-pulse-ring-2" />
          <div className="splash-logo-circle">
            <div className="splash-logo-inner">
              <span className="splash-logo-cu">CU</span>
              <span className="splash-logo-sub">FACULTY</span>
              <span className="splash-logo-sub">CONNECT</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="splash-text-block" style={{
          opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 800ms cubic-bezier(0.4,0,0.2,1) 300ms',
        }}>
          <h1 className="splash-heading">CU Faculty Connect</h1>
          <p className="splash-tagline">Connect. Learn. Grow.</p>
          <p className="splash-desc">Faculty Mentorship&nbsp;•&nbsp;Senior Guidance&nbsp;•&nbsp;Career Support</p>
        </div>

        {/* Stat Cards */}
        <div className="splash-stats" style={{
          opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 800ms cubic-bezier(0.4,0,0.2,1) 600ms',
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} className="splash-stat-card"
              onMouseEnter={() => setHoveredCard(i)} onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${700 + i * 150}ms`,
                background: hoveredCard === i ? `linear-gradient(145deg, ${s.accent}, rgba(255,255,255,0.06))` : 'rgba(255,255,255,0.07)',
                borderColor: hoveredCard === i ? s.border : 'rgba(255,255,255,0.14)',
                boxShadow: hoveredCard === i
                  ? `0 0 30px ${s.glow}, 0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)`
                  : '0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
                transform: hoveredCard === i ? 'translateY(-6px) scale(1.05)' : 'translateY(0) scale(1)',
              }}>

              <span className="stat-badge" style={{ background: s.badgeColor, color: '#1a0800' }}>{s.badge}</span>

              {/* Glowing SVG icon */}
              <div className="stat-svg-wrap" style={{
                filter: `drop-shadow(0 0 8px ${s.color}88)`,
                animationDelay: `${i * 0.35}s`,
              }}>
                {StatIcons[s.svgKey](s.color)}
              </div>

              <span className="splash-stat-value" style={{ color: '#fff' }}>{s.value}</span>
              <span className="splash-stat-label">{s.label}</span>
              <div className="stat-shimmer-line" style={{ background: `linear-gradient(90deg, transparent, ${s.glow}, transparent)` }} />
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="splash-progress-wrap" style={{
          opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 700ms cubic-bezier(0.4,0,0.2,1) 900ms',
        }}>
          <p className="splash-progress-label">Preparing your mentorship experience…</p>
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            <div className="splash-progress-glow" style={{ left: `${Math.min(progress, 100)}%` }} />
          </div>
          <span className="splash-progress-pct">{Math.round(Math.min(progress, 100))}%</span>
        </div>
      </div>

      <div className="splash-footer" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 800ms ease 1100ms' }}>
        <span className="splash-footer-dot" /><p className="splash-footer-text">DIGITAL MENTORSHIP PLATFORM</p><span className="splash-footer-dot" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');
        .splash-root {
          position:fixed; inset:0; z-index:9999;
          display:flex; align-items:center; justify-content:center;
          font-family:'Inter','Poppins',system-ui,sans-serif; overflow:hidden;
        }
        .splash-bg {
          position:absolute; inset:0; background-color:#C2000F;
          background-image:var(--splash-img,none);
          background-size:cover; background-position:center 20%; background-repeat:no-repeat;
        }
        .splash-bg::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(227,6,19,0.55) 0%,rgba(194,0,15,0.50) 35%,rgba(181,0,18,0.52) 65%,rgba(122,0,16,0.62) 100%);
        }
        .splash-glow { position:absolute; border-radius:50%; pointer-events:none; filter:blur(80px); }
        .splash-glow-1 { width:55vw; height:55vw; top:-15%; left:-10%; background:radial-gradient(circle,rgba(255,80,80,0.28) 0%,transparent 70%); animation:glowDrift1 12s ease-in-out infinite; }
        .splash-glow-2 { width:45vw; height:45vw; bottom:-10%; right:-8%; background:radial-gradient(circle,rgba(200,0,30,0.35) 0%,transparent 70%); animation:glowDrift2 15s ease-in-out infinite; }
        .splash-glow-3 { width:35vw; height:35vw; top:40%; left:50%; transform:translate(-50%,-50%); background:radial-gradient(circle,rgba(255,255,255,0.07) 0%,transparent 65%); }
        @keyframes glowDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(3%,5%) scale(1.08)} }
        @keyframes glowDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-4%,-3%) scale(1.05)} }
        .splash-particle { position:absolute; border-radius:50%; background:rgba(255,255,255,0.7); animation:particleDrift linear infinite; pointer-events:none; }
        @keyframes particleDrift {
          0%{transform:translateY(0) translateX(0) scale(1)} 33%{transform:translateY(-18px) translateX(10px) scale(1.15)}
          66%{transform:translateY(-8px) translateX(-10px) scale(0.9)} 100%{transform:translateY(0) translateX(0) scale(1)}
        }
        .splash-float-icon { position:absolute; animation:iconFloat ease-in-out infinite; pointer-events:none; }
        @keyframes iconFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(6deg)} }
        .splash-center {
          position:relative; z-index:2; display:flex; flex-direction:column; align-items:center;
          gap:28px; padding:0 24px; max-width:520px; width:100%;
        }
        .splash-logo-wrap { position:relative; display:flex; align-items:center; justify-content:center; }
        .splash-pulse-ring {
          position:absolute; width:148px; height:148px; border-radius:50%;
          border:2px solid rgba(255,255,255,0.25); animation:pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        .splash-pulse-ring-2 { width:172px; height:172px; border-color:rgba(255,255,255,0.12); animation-delay:0.8s; }
        @keyframes pulseRing { 0%{transform:scale(0.92);opacity:0.8} 60%{transform:scale(1.08);opacity:0} 100%{transform:scale(1.08);opacity:0} }
        .splash-logo-circle {
          width:128px; height:128px; background:#fff; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 40px rgba(0,0,0,0.22),0 0 0 6px rgba(255,255,255,0.15);
          animation:logoPulse 3s ease-in-out infinite;
        }
        @keyframes logoPulse {
          0%,100%{box-shadow:0 8px 40px rgba(0,0,0,0.22),0 0 0 6px rgba(255,255,255,0.15)}
          50%{box-shadow:0 12px 56px rgba(0,0,0,0.28),0 0 0 10px rgba(255,255,255,0.22)}
        }
        .splash-logo-inner{text-align:center}
        .splash-logo-cu{display:block;color:#E30613;font-family:'Poppins',sans-serif;font-weight:900;font-size:34px;line-height:1;letter-spacing:-1px}
        .splash-logo-sub{display:block;color:#888;font-size:7.5px;font-weight:700;letter-spacing:0.22em;line-height:1.5}
        .splash-text-block{text-align:center}
        .splash-heading{color:#fff;font-family:'Poppins',sans-serif;font-size:clamp(22px,5vw,30px);font-weight:800;letter-spacing:-0.5px;margin:0 0 6px}
        .splash-tagline{color:rgba(255,255,255,0.9);font-size:clamp(13px,3vw,16px);font-weight:600;letter-spacing:0.12em;margin:0 0 8px;text-transform:uppercase}
        .splash-desc{color:rgba(255,255,255,0.6);font-size:clamp(11px,2.5vw,13px);font-weight:400;margin:0;letter-spacing:0.04em}

        /* ══ STAT CARDS ══ */
        .splash-stats { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
        .splash-stat-card {
          position:relative; overflow:hidden;
          display:flex; flex-direction:column; align-items:center; gap:5px;
          padding:14px 16px 14px; border-radius:20px;
          border:1.5px solid rgba(255,255,255,0.14);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          min-width:104px; cursor:default;
          transition:transform 280ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 280ms ease, border-color 280ms ease, background 280ms ease;
          animation:cardBounceIn 600ms cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes cardBounceIn { 0%{opacity:0;transform:scale(0.6) translateY(18px)} 100%{opacity:1;transform:scale(1) translateY(0)} }

        .stat-badge {
          font-size:8px; font-weight:800; letter-spacing:0.12em;
          padding:2px 8px; border-radius:99px; text-transform:uppercase; opacity:0.92;
        }

        /* SVG icon wrapper — slow spin + glow */
        .stat-svg-wrap {
          display:flex; align-items:center; justify-content:center;
          animation:svgSpin 8s linear infinite;
        }
        /* Only orbit and arc children rotate/animate */
        .stat-orbit { animation:orbitSpin 10s linear infinite; transform-origin:center; }
        .stat-pulse-ring { animation:pulseScale 2.5s ease-in-out infinite; transform-origin:center; }
        .stat-arc { animation:arcDraw 3s ease-in-out infinite; transform-origin:center; }
        @keyframes orbitSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseScale { 0%,100%{opacity:0.25;transform:scale(0.95)} 50%{opacity:0.5;transform:scale(1.05)} }
        @keyframes arcDraw { 0%,100%{stroke-dashoffset:25} 50%{stroke-dashoffset:5} }
        /* Gentle float on icon wrap */
        @keyframes svgSpin { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

        .splash-stat-value {
          color:#fff; font-family:'Poppins',sans-serif;
          font-size:clamp(17px,4vw,22px); font-weight:900;
          line-height:1.1; letter-spacing:-0.5px;
          text-shadow:0 2px 8px rgba(0,0,0,0.3);
        }
        .splash-stat-label {
          color:rgba(255,255,255,0.7); font-size:9.5px;
          font-weight:600; text-align:center; letter-spacing:0.05em;
        }
        .stat-shimmer-line {
          position:absolute; bottom:0; left:0; right:0; height:2px;
          border-radius:0 0 20px 20px;
          animation:shimmerSlide 1.8s ease-in-out infinite;
        }
        @keyframes shimmerSlide { 0%{opacity:0.3;transform:scaleX(0.5)} 50%{opacity:1;transform:scaleX(1)} 100%{opacity:0.3;transform:scaleX(0.5)} }

        /* ── Progress ── */
        .splash-progress-wrap { width:100%; max-width:340px; display:flex; flex-direction:column; align-items:center; gap:8px; }
        .splash-progress-label { color:rgba(255,255,255,0.55); font-size:11px; font-weight:500; letter-spacing:0.06em; text-align:center; margin:0; }
        .splash-progress-track { position:relative; width:100%; height:4px; background:rgba(255,255,255,0.15); border-radius:99px; overflow:visible; }
        .splash-progress-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,rgba(255,255,255,0.7),#fff); box-shadow:0 0 10px rgba(255,255,255,0.5); transition:width 80ms linear; }
        .splash-progress-glow { position:absolute; top:50%; transform:translate(-50%,-50%); width:12px; height:12px; border-radius:50%; background:#fff; box-shadow:0 0 14px 4px rgba(255,255,255,0.6); transition:left 80ms linear; pointer-events:none; }
        .splash-progress-pct { color:rgba(255,255,255,0.4); font-size:10px; font-weight:600; letter-spacing:0.1em; }

        /* ── Footer ── */
        .splash-footer { position:absolute; bottom:32px; left:0; right:0; display:flex; align-items:center; justify-content:center; gap:10px; z-index:2; }
        .splash-footer-text { color:rgba(255,255,255,0.3); font-size:10px; font-weight:600; letter-spacing:0.25em; margin:0; }
        .splash-footer-dot { width:3px; height:3px; border-radius:50%; background:rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}
