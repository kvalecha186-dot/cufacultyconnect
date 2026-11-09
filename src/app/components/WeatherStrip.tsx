import { useMemo } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  CloudDrizzle,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Thermometer,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface DayForecast {
  day: string;
  icon: React.ElementType;
  high: number;
  low: number;
  label: string;
}

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const WEATHER_VARIANTS: {
  icon: React.ElementType;
  label: string;
  highRange: [number, number];
  lowRange: [number, number];
}[] = [
  { icon: Sun, label: 'Sunny', highRange: [40, 45], lowRange: [28, 32] },
  { icon: CloudSun, label: 'Partly Cloudy', highRange: [36, 42], lowRange: [27, 31] },
  { icon: Cloud, label: 'Cloudy', highRange: [33, 38], lowRange: [26, 30] },
  { icon: CloudRain, label: 'Rainy', highRange: [30, 35], lowRange: [24, 28] },
  { icon: CloudDrizzle, label: 'Drizzle', highRange: [31, 36], lowRange: [25, 29] },
  { icon: Sun, label: 'Clear Sky', highRange: [41, 45], lowRange: [29, 33] },
  { icon: CloudSun, label: 'Hazy Sun', highRange: [37, 43], lowRange: [28, 32] },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randInRange(min: number, max: number, seed: number): number {
  return Math.round(min + seededRandom(seed) * (max - min));
}

/* ──────────────────────────────────────────────
   Quick‑link data
   ────────────────────────────────────────────── */

const QUICK_LINKS = [
  { label: 'Book a Faculty Slot', href: '#book' },
  { label: 'Faculty Directory', href: '#directory' },
  { label: 'Student Dashboard', href: '#dashboard' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'FAQs & Support', href: '#support' },
  { label: 'Privacy Policy', href: '#privacy' },
];

const SOCIAL_LINKS: { icon: React.ElementType; href: string; label: string }[] = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function WeatherStrip() {
  /* ── 7‑day forecast starting from today ── */
  const forecast: DayForecast[] = useMemo(() => {
    const today = new Date();
    const todayIndex = today.getDay(); // 0‑6

    return Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (todayIndex + i) % 7;
      const variant = WEATHER_VARIANTS[(dayIndex + i) % WEATHER_VARIANTS.length];
      const seed = dayIndex * 100 + i;

      return {
        day: i === 0 ? 'Today' : DAY_NAMES[dayIndex],
        icon: variant.icon,
        high: randInRange(variant.highRange[0], variant.highRange[1], seed),
        low: randInRange(variant.lowRange[0], variant.lowRange[1], seed + 50),
        label: variant.label,
      };
    });
  }, []);

  return (
    <>
      {/* ─── WEATHER STRIP ────────────────────────────── */}
      <section className="w-full bg-[#D32F2F] select-none">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch">
          {/* ── Left: Current Weather ── */}
          <div className="flex items-center gap-5 px-6 py-4 lg:py-3 lg:pr-8 shrink-0">
            {/* Location */}
            <div className="flex flex-col items-start leading-tight">
              <span className="text-white font-bold text-sm tracking-widest uppercase">
                Gharuan
              </span>
              <span className="text-white/70 text-[11px] font-medium tracking-wider uppercase">
                Weather
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-white/20" />

            {/* Sun icon + temp */}
            <div className="flex items-center gap-3">
              <Sun className="w-9 h-9 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" />

              <div className="flex flex-col leading-tight">
                <span className="text-white text-3xl font-extrabold tracking-tight">
                  34°C
                </span>
                <span className="text-white/70 text-xs font-medium">
                  partly cloudy
                </span>
              </div>
            </div>

            {/* Feels‑like */}
            <div className="hidden md:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur">
              <Thermometer className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white/80 text-[11px] font-medium">
                Feels 38°C
              </span>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="hidden lg:block w-px bg-white/15 my-2" />

          {/* ── Right: 7‑day forecast ── */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-stretch min-w-max">
              {forecast.map((day, idx) => {
                const Icon = day.icon;
                return (
                  <div
                    key={day.day + idx}
                    className={[
                      'group flex flex-col items-center justify-center gap-1 px-5 py-3',
                      'transition-colors duration-200 cursor-default',
                      'hover:bg-white/10',
                      idx !== 0 ? 'border-l border-white/10' : '',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'text-[11px] font-semibold tracking-wide uppercase',
                        idx === 0 ? 'text-yellow-200' : 'text-white/70',
                      ].join(' ')}
                    >
                      {day.day}
                    </span>

                    <Icon
                      className={[
                        'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                        idx === 0
                          ? 'text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.5)]'
                          : 'text-white/80',
                      ].join(' ')}
                    />

                    <div className="flex items-baseline gap-1">
                      <span className="text-white text-sm font-bold">
                        {day.high}°
                      </span>
                      <span className="text-white/50 text-xs font-medium">
                        {day.low}°
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="w-full bg-[#1a1a1a] text-white">
        {/* Main grid */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Column 1 – About */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-7 bg-[#D32F2F] rounded-full" />
                <h3 className="text-lg font-bold tracking-tight">
                  CU Faculty Connect
                </h3>
              </div>

              <p className="text-white/50 text-sm leading-relaxed font-light max-w-sm">
                Chandigarh University's premier platform connecting students
                directly with faculty experts through scheduled video
                interactions. Building stronger academic relationships, one
                conversation at a time.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D32F2F] hover:border-[#D32F2F] transition-all duration-300 group"
                  >
                    <social.icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 – Quick Links */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold tracking-tight">Quick Links</h3>

              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-light transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 – Contact */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold tracking-tight">Contact Info</h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D32F2F] mt-0.5 shrink-0" />
                  <span className="text-white/50 text-sm font-light leading-relaxed">
                    Chandigarh University, NH‑05, Ludhiana–Chandigarh State
                    Hwy, Gharuan, Punjab 140413
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  <a
                    href="tel:+911800121488"
                    className="text-white/50 hover:text-white text-sm font-light transition-colors"
                  >
                    1800‑121‑4888 (Toll Free)
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  <a
                    href="mailto:info@cuchd.in"
                    className="text-white/50 hover:text-white text-sm font-light transition-colors"
                  >
                    info@cuchd.in
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs font-light text-center sm:text-left">
              © 2025 CU Faculty Connect – Chandigarh University. All rights
              reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="#terms"
                className="text-white/30 hover:text-white/60 text-xs font-light transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#privacy"
                className="text-white/30 hover:text-white/60 text-xs font-light transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#cookies"
                className="text-white/30 hover:text-white/60 text-xs font-light transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
