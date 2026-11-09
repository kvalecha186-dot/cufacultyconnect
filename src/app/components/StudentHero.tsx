import { Video, Calendar, Award } from 'lucide-react';

export function StudentHero({ onBookSlot }: { onBookSlot: () => void }) {
  return (
    <section className="relative bg-gradient-to-br from-[#0F2942] via-[#1a3a54] to-[#0F2942] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#D32F2F] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium">Chandigarh University Excellence Initiative</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Personal Conversations.<br />
              Stronger Connections.<br />
              <span className="text-[#D32F2F]">Higher Retention.</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Get direct video access to faculty experts, department heads, and academic advisors.
              Address your concerns, clarify your doubts, and get personalized guidance—all within minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookSlot}
                className="px-8 py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold rounded-xl shadow-lg shadow-[#D32F2F]/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#D32F2F]/40"
              >
                Book Your Faculty Interaction Slot
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 transition-all">
                Learn More
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D32F2F] to-[#D4AF37] border-2 border-[#0F2942]"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-300">2,500+ students connected</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-[#D32F2F]/20 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-[#D32F2F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Live Video Interactions</h3>
                    <p className="text-sm text-gray-400">Face-to-face sessions with faculty experts</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Flexible Scheduling</h3>
                    <p className="text-sm text-gray-400">Book slots that fit your timetable</p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-[#D32F2F]/20 to-[#D4AF37]/10 rounded-xl border border-[#D32F2F]/30">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#D4AF37] mb-2">94%</div>
                    <div className="text-sm text-gray-300">Student Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
