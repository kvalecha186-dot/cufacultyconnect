import { Calendar, Video, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    title: 'Choose Your Slot',
    description: 'Select a convenient time from available faculty schedules. Automatic matching based on your concerns.',
    color: '#D32F2F',
    bgColor: 'bg-[#D32F2F]/10',
    step: 1
  },
  {
    icon: Video,
    title: 'Meet Faculty via Zoom',
    description: 'Connect instantly through integrated video. Discuss academic queries, placement concerns, or career guidance.',
    color: '#D4AF37',
    bgColor: 'bg-[#D4AF37]/10',
    step: 2
  },
  {
    icon: CheckCircle2,
    title: 'Get Resolution & Support',
    description: 'Receive personalized guidance and immediate solutions. Automatic follow-up for complex issues.',
    color: '#0F2942',
    bgColor: 'bg-[#0F2942]/10',
    step: 3
  }
];

export function OnboardingSteps() {
  return (
    <section className="py-20 px-6 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F2942] mb-4">
            Your Journey to Success in Three Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From booking to resolution—experience seamless faculty interaction designed for your academic growth
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all h-full">
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mb-4`}
                    style={{ borderLeft: `4px solid ${step.color}` }}
                  >
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F2942] text-white text-sm font-semibold rounded-full">
                    Step {step.step}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#0F2942] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-[#D32F2F]" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-[#0F2942] to-[#1a3a54] rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#D32F2F] mb-2">5-7 min</div>
              <div className="text-sm text-gray-300">Average Session Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">100+</div>
              <div className="text-sm text-gray-300">Faculty Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D32F2F] mb-2">24/7</div>
              <div className="text-sm text-gray-300">Booking Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">98%</div>
              <div className="text-sm text-gray-300">Resolution Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
