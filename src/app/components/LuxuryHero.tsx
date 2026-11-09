import { Sparkles, ArrowRight, Video } from 'lucide-react';

interface LuxuryHeroProps {
  onBookSlot: () => void;
  onFacultyPortal: () => void;
  onAboutClick: () => void;
  onAnalyticsClick: () => void;
}

export function LuxuryHero({ onBookSlot, onFacultyPortal, onAboutClick, onAnalyticsClick }: LuxuryHeroProps) {
  return (
    <section className="relative min-h-screen bg-[#0F2942] overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#D32F2F]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#D32F2F]/3 rounded-full blur-[100px]"></div>
      </div>

      {/* Minimalist Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-1 h-8 bg-[#D32F2F]"></div>
          <span className="text-white font-semibold tracking-tight">CU–Faculty Connect</span>
        </div>
        <nav className="flex items-center gap-8">
          <button
            onClick={onAboutClick}
            className="text-white/60 hover:text-white text-sm transition-colors font-light"
          >
            About
          </button>
          <button
            onClick={onAnalyticsClick}
            className="text-white/60 hover:text-white text-sm transition-colors font-light"
          >
            Analytics
          </button>
          <button
            onClick={onFacultyPortal}
            className="px-6 py-2.5 bg-white text-[#0F2942] hover:bg-gray-100 text-sm font-semibold rounded-xl transition-all shadow-lg"
          >
            Faculty Portal
          </button>
        </nav>
      </header>

      {/* Editorial Hero Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Typography Statement */}
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-white/60" />
              <span className="text-xs font-medium text-white/80 tracking-wide">CHANDIGARH UNIVERSITY EXCELLENCE</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[0.92] tracking-tighter">
                Personal<br />
                Conversations.
              </h1>
              <h1 className="text-7xl lg:text-8xl xl:text-9xl font-bold text-white/30 leading-[0.92] tracking-tighter">
                Stronger<br />
                Connections.
              </h1>
              <h1 className="text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.92] tracking-tighter">
                <span className="text-[#D32F2F]">
                  Higher<br />
                  Retention.
                </span>
              </h1>
            </div>

            <p className="text-2xl text-white/50 leading-relaxed max-w-xl font-light">
              Direct video access to faculty experts, department heads, and academic advisors.
              Personalized guidance within minutes.
            </p>

            {/* Minimalist Stats */}
            <div className="flex items-center gap-16 pt-8">
              <div>
                <div className="text-5xl font-bold text-white mb-2">2.5K+</div>
                <div className="text-xs text-white/30 font-light uppercase tracking-wider">Students Connected</div>
              </div>
              <div className="w-px h-14 bg-white/10"></div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">94%</div>
                <div className="text-xs text-white/30 font-light uppercase tracking-wider">Satisfaction Rate</div>
              </div>
              <div className="w-px h-14 bg-white/10"></div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">5-7min</div>
                <div className="text-xs text-white/30 font-light uppercase tracking-wider">Avg Session</div>
              </div>
            </div>
          </div>

          {/* Right: Glassmorphic CTA Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/10 to-transparent rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/[0.03] backdrop-blur-3xl rounded-3xl p-12 border border-white/10 space-y-10 shadow-2xl shadow-black/10">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white">Book Your Interaction</h3>
                <p className="text-white/60 font-light leading-relaxed">
                  Schedule a direct conversation with faculty experts tailored to your academic journey.
                </p>
              </div>

              {/* Minimalist Feature List */}
              <div className="space-y-4">
                {[
                  { label: 'Instant Zoom Integration', icon: Video },
                  { label: 'Smart Faculty Matching', icon: Sparkles },
                  { label: 'Real-time Availability', icon: ArrowRight }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-[#D32F2F]/50 transition-all">
                      <item.icon className="w-4 h-4 text-white/60 group-hover:text-[#D32F2F] transition-colors" />
                    </div>
                    <span className="text-sm text-white/80 font-light">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Crimson CTA Button */}
              <button
                onClick={onBookSlot}
                className="group relative w-full py-5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-2xl overflow-hidden transition-all shadow-[0_0_40px_rgba(211,47,47,0.3)] hover:shadow-[0_0_60px_rgba(211,47,47,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <span className="font-semibold tracking-wide">Book Your Faculty Slot</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <p className="text-xs text-white/40 text-center font-light">
                No credit card required • Instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20"></div>
        <div className="text-xs text-white/40 tracking-widest">SCROLL</div>
      </div>
    </section>
  );
}
