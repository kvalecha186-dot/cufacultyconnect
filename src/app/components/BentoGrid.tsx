import { Calendar, Video, TrendingUp, Zap, CheckCircle2, Clock } from 'lucide-react';

export function BentoGrid() {
  return (
    <section className="relative bg-white py-32 px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-24">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-px bg-[#D32F2F]"></div>
            <span className="text-xs tracking-widest text-gray-400 uppercase font-light">How It Works</span>
          </div>
          <h2 className="text-6xl lg:text-7xl font-bold text-[#0F2942] leading-[0.95] tracking-tight mb-8">
            Your Journey to<br />Academic Excellence
          </h2>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            A seamless, three-step process designed to connect you with the right faculty expert at the perfect moment.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
          {/* Large Feature: Choose Your Slot */}
          <div className="md:col-span-2 md:row-span-2 group relative bg-gradient-to-br from-[#0F2942] to-[#1a3a54] rounded-3xl p-10 overflow-hidden hover:scale-[1.02] transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
                  <Calendar className="w-7 h-7 text-[#D32F2F]" />
                </div>
                <div className="inline-block px-3 py-1 bg-[#D32F2F]/20 text-[#D32F2F] text-xs font-semibold rounded-full mb-4 border border-[#D32F2F]/30">
                  STEP 01
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                  Choose Your<br />Perfect Slot
                </h3>
                <p className="text-white/60 font-light leading-relaxed max-w-md">
                  AI-powered matching connects you with the most relevant faculty based on your concerns, availability, and academic profile.
                </p>
              </div>

              {/* Mini Calendar Visualization */}
              <div className="grid grid-cols-7 gap-2 mt-8">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full ${
                      i === 8 ? 'bg-[#D32F2F]' :
                      i === 5 || i === 9 ? 'bg-[#D32F2F]/30' :
                      'bg-white/10'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Connection Card */}
          <div className="md:row-span-2 group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#D32F2F]/5 transition-all duration-500">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D32F2F]/5 rounded-full blur-2xl"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D32F2F]/10 rounded-xl mb-6">
                  <Video className="w-6 h-6 text-[#D32F2F]" />
                </div>
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full mb-4">
                  STEP 02
                </div>
                <h3 className="text-2xl font-bold text-[#0F2942] mb-3 leading-tight">
                  Meet Faculty via Zoom
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  Instant video access through integrated Zoom sessions.
                </p>
              </div>

              {/* Video Icon Animation */}
              <div className="flex items-center gap-2 mt-6">
                <div className="w-2 h-2 bg-[#D32F2F] rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400 font-medium">Live in 5-7 minutes</span>
              </div>
            </div>
          </div>

          {/* Resolution & Support */}
          <div className="md:row-span-2 group relative bg-white rounded-3xl p-8 border border-gray-200 overflow-hidden hover:border-[#D32F2F]/30 transition-all duration-500">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D32F2F]/10 rounded-xl mb-6">
                  <CheckCircle2 className="w-6 h-6 text-[#D32F2F]" />
                </div>
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full mb-4">
                  STEP 03
                </div>
                <h3 className="text-2xl font-bold text-[#0F2942] mb-3 leading-tight">
                  Get Immediate Resolution
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  Personalized guidance with automatic follow-up for complex issues.
                </p>
              </div>

              {/* Success Rate Indicator */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Resolution Rate</span>
                  <span className="text-sm font-bold text-[#0F2942]">98%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[98%] h-full bg-[#D32F2F] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Speed Stat */}
          <div className="md:col-span-1 group relative bg-[#D32F2F] rounded-3xl p-6 overflow-hidden hover:scale-[1.02] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <Zap className="w-8 h-8 text-white/80" />
              <div>
                <div className="text-4xl font-bold text-white mb-1">5-7</div>
                <div className="text-sm text-white/80 font-light">Minutes per session</div>
              </div>
            </div>
          </div>

          {/* Availability Stat */}
          <div className="md:col-span-1 group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <Clock className="w-8 h-8 text-gray-400" />
              <div>
                <div className="text-4xl font-bold text-[#0F2942] mb-1">24/7</div>
                <div className="text-sm text-gray-500 font-light">Booking available</div>
              </div>
            </div>
          </div>

          {/* Faculty Count */}
          <div className="md:col-span-1 group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-500">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <TrendingUp className="w-8 h-8 text-gray-400" />
              <div>
                <div className="text-4xl font-bold text-[#0F2942] mb-1">100+</div>
                <div className="text-sm text-gray-500 font-light">Expert faculty</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
