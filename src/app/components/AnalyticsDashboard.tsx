import { useState, useEffect, useRef } from 'react';
import { X, TrendingUp, Users, CheckCircle2, Clock, Zap, Target, ArrowUpRight, Activity, BarChart3 } from 'lucide-react';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
      setTimeout(() => setAnimateCards(true), 400);
    } else {
      setAnimateIn(false);
      setAnimateCards(false);
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  const metrics = [
    { value: '2,500+', label: 'Mentored Students', change: '+156 this month', icon: Users, gradient: 'from-[#E31837] to-[#C41230]', textColor: 'text-white', changeColor: 'text-white/50', big: true },
    { value: '94%', label: 'Satisfaction Rate', change: '+2% vs last quarter', icon: TrendingUp, gradient: '', textColor: 'text-gray-900', changeColor: 'text-emerald-500' },
    { value: '98%', label: 'Resolution Rate', change: '2,450 resolved', icon: CheckCircle2, gradient: '', textColor: 'text-gray-900', changeColor: 'text-emerald-500' },
    { value: '6.2 min', label: 'Avg Session Time', change: 'Within target', icon: Clock, gradient: '', textColor: 'text-gray-900', changeColor: 'text-blue-500' },
  ];

  const satisfactionMonths = [
    { month: 'Jan', pct: 89 }, { month: 'Feb', pct: 91 }, { month: 'Mar', pct: 92 },
    { month: 'Apr', pct: 93 }, { month: 'May', pct: 94 }, { month: 'Jun', pct: 95 },
  ];

  const categories = [
    { name: 'Academic Guidance', pct: 98, count: 1245 },
    { name: 'Placement Support', pct: 97, count: 890 },
    { name: 'Career Counseling', pct: 99, count: 432 },
    { name: 'Personal Mentorship', pct: 96, count: 283 },
  ];

  const funnel = [
    { label: 'Low Confidence Pre-Call', value: 145, desc: 'Flagged for priority intervention', color: 'from-[#E31837]/10 to-[#E31837]/5', text: 'text-[#E31837]', width: '100%' },
    { label: 'Follow-up Required', value: 89, desc: 'Additional support sessions', color: 'from-amber-100/80 to-amber-50', text: 'text-amber-600', width: '61%' },
    { label: 'Successfully Resolved', value: 178, desc: 'High confidence, no follow-up', color: 'from-emerald-100/80 to-emerald-50', text: 'text-emerald-600', width: '100%' },
  ];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-400 ${
        animateIn ? 'bg-black/60 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none'
      }`}
    >
      <div className={`relative bg-[#FAFAFA] rounded-3xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto transition-all duration-500 ease-out ${
        animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
      }`}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-2xl border-b border-black/[0.04] px-7 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E31837] to-[#C41230] rounded-xl flex items-center justify-center shadow-md shadow-red-600/15">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[22px] lg:text-[28px] font-extrabold text-gray-900 tracking-tight">Analytics Dashboard</h2>
                <p className="text-[13px] text-gray-400 font-medium">Real-time operational efficiency metrics</p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all hover:rotate-90 duration-300">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-10 space-y-8">

          {/* ═══ BENTO METRIC CARDS ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className={`relative p-6 rounded-[20px] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 ${
                    m.big
                      ? 'bg-gradient-to-br from-[#E31837] to-[#C41230] shadow-lg shadow-red-600/15'
                      : 'bg-white border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-lg'
                  } ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {m.big && (
                    <>
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/[0.05] rounded-full" />
                      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/[0.04] rounded-full" />
                    </>
                  )}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        m.big ? 'bg-white/15' : 'bg-red-50'
                      }`}>
                        <Icon className={`w-5 h-5 ${m.big ? 'text-white/80' : 'text-[#E31837]'}`} />
                      </div>
                      {!m.big && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-full">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-600">↑</span>
                        </div>
                      )}
                    </div>
                    <div className={`text-[36px] font-extrabold ${m.textColor} leading-none`}>{m.value}</div>
                    <div className={`text-[13px] font-semibold mt-1.5 ${m.big ? 'text-white/60' : 'text-gray-400'}`}>{m.label}</div>
                    <div className={`text-[11px] font-medium mt-3 pt-3 border-t ${m.big ? 'border-white/10' : 'border-gray-100'} ${m.changeColor}`}>
                      {m.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ CHARTS ROW ═══ */}
          <div className="grid lg:grid-cols-2 gap-5">

            {/* Satisfaction Trend — CSS bar chart */}
            <div className={`bg-white rounded-[20px] p-6 lg:p-7 border border-black/[0.04] transition-all duration-500 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '320ms' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900">Satisfaction Trend</h3>
                  <p className="text-[12px] text-gray-400 font-medium mt-0.5">Monthly improvement trajectory</p>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3" /> +6%
                </span>
              </div>
              <div className="flex items-end gap-3 h-[140px]">
                {satisfactionMonths.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.pct}%</span>
                    <div className="w-full rounded-xl overflow-hidden bg-gray-100 relative" style={{ height: '110px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#E31837] to-[#ff6b7a] rounded-xl transition-all duration-1000 ease-out group-hover:opacity-80"
                        style={{
                          height: animateCards ? `${((d.pct - 85) / 15) * 100}%` : '0%',
                          transitionDelay: `${600 + i * 100}ms`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution by Category */}
            <div className={`bg-white rounded-[20px] p-6 lg:p-7 border border-black/[0.04] transition-all duration-500 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900">Resolution by Category</h3>
                  <p className="text-[12px] text-gray-400 font-medium mt-0.5">Efficiency across concern types</p>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-[#E31837] rounded-full text-[10px] font-bold">
                  <Target className="w-3 h-3" /> 97.5% avg
                </span>
              </div>
              <div className="space-y-6">
                {categories.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-gray-700">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-medium">{c.count} cases</span>
                        <span className="text-[12px] font-bold text-gray-900">{c.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E31837] to-[#ff6b7a] rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: animateCards ? `${c.pct}%` : '0%',
                          transitionDelay: `${600 + i * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ RISK FUNNEL ═══ */}
          <div className={`bg-white rounded-[20px] p-6 lg:p-7 border border-black/[0.04] transition-all duration-500 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '480ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#E31837]" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-900">Risk-Tagging Funnel</h3>
                <p className="text-[12px] text-gray-400 font-medium">Automated student risk assessment pipeline</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {funnel.map((f, i) => (
                <div key={i} className={`relative p-5 rounded-2xl bg-gradient-to-br ${f.color} overflow-hidden group hover:-translate-y-1 transition-all duration-400`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`text-[28px] font-extrabold ${f.text}`}>{f.value}</div>
                    <ArrowUpRight className={`w-4 h-4 ${f.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className="text-[13px] font-bold text-gray-800">{f.label}</div>
                  <div className="text-[11px] text-gray-400 font-medium mt-1">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ LIVE SPEED METRICS ═══ */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Avg Response Time', value: '< 2 min', sub: 'From booking to connect', icon: Zap, tint: 'bg-amber-50 text-amber-500' },
              { label: 'Faculty Utilization', value: '87%', sub: 'Active session capacity', icon: Users, tint: 'bg-blue-50 text-blue-500' },
              { label: 'Student Return Rate', value: '76%', sub: 'Book 2+ sessions', icon: TrendingUp, tint: 'bg-emerald-50 text-emerald-500' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`bg-white rounded-2xl p-5 border border-black/[0.04] flex items-start gap-4 hover:shadow-md transition-all duration-400 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${560 + i * 80}ms` }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.tint}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[20px] font-extrabold text-gray-900">{s.value}</div>
                    <div className="text-[12px] font-semibold text-gray-600 mt-0.5">{s.label}</div>
                    <div className="text-[10px] text-gray-400 font-medium mt-0.5">{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-5">
          <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-[#E31837] to-[#C41230] text-white rounded-2xl hover:shadow-lg hover:shadow-red-600/15 transition-all font-bold text-sm">
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
