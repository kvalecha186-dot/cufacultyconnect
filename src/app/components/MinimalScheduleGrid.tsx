import { Video, Clock, AlertTriangle } from 'lucide-react';

interface TimeSlot {
  time: string;
  student?: {
    name: string;
    rollNumber: string;
    concernType: string;
    status: 'upcoming' | 'in-progress' | 'completed';
    priority?: 'High' | 'Medium' | 'Low';
  };
}

interface MinimalScheduleGridProps {
  onLaunchZoom: (slot: TimeSlot) => void;
  onViewProfile: (slot: TimeSlot) => void;
}

export function MinimalScheduleGrid({ onLaunchZoom, onViewProfile }: MinimalScheduleGridProps) {
  const slots: TimeSlot[] = [
    { time: '09:00', student: { name: 'Rahul Kumar', rollNumber: '21CSE001', concernType: 'Academic', status: 'completed', priority: 'Medium' } },
    { time: '09:07', student: { name: 'Priya Sharma', rollNumber: '21CSE045', concernType: 'Placement', status: 'in-progress', priority: 'High' } },
    { time: '09:14', student: { name: 'Arjun Patel', rollNumber: '21CSE089', concernType: 'Career', status: 'upcoming', priority: 'Medium' } },
    { time: '09:21' },
    { time: '09:28', student: { name: 'Sneha Gupta', rollNumber: '21CSE112', concernType: 'Academic', status: 'upcoming', priority: 'High' } },
    { time: '09:35' },
    { time: '09:42', student: { name: 'Vikram Singh', rollNumber: '21CSE156', concernType: 'Placement', status: 'upcoming', priority: 'Low' } },
    { time: '09:49' },
    { time: '09:56', student: { name: 'Ananya Roy', rollNumber: '21CSE178', concernType: 'Personal', status: 'upcoming', priority: 'Medium' } },
    { time: '10:03' },
    { time: '10:10', student: { name: 'Karan Mehta', rollNumber: '21CSE201', concernType: 'Academic', status: 'upcoming', priority: 'High' } },
    { time: '10:17' }
  ];

  const priorityIndicators = {
    High: 'bg-[#D32F2F]',
    Medium: 'bg-orange-500',
    Low: 'bg-emerald-500'
  };

  return (
    <div className="space-y-4">
      {slots.map((slot, index) => (
        <div
          key={index}
          onClick={() => slot.student && onViewProfile(slot)}
          className={`group rounded-2xl transition-all ${
            slot.student
              ? 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg cursor-pointer'
              : 'bg-gray-50 border border-transparent'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8 flex-1">
                {/* Time Badge */}
                <div className="flex items-center gap-2 min-w-[80px]">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-[#0F2942] tabular-nums">{slot.time}</span>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-gray-100"></div>

                {/* Student Info or Empty State */}
                {slot.student ? (
                  <div className="flex items-center gap-4 flex-1">
                    {/* Priority Indicator */}
                    {slot.student.priority && (
                      <div className={`w-1 h-10 ${priorityIndicators[slot.student.priority]} rounded-full`}></div>
                    )}

                    {/* Student Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-[#0F2942]">{slot.student.name}</span>
                        {slot.student.status === 'in-progress' && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-[#D32F2F]/10 text-[#D32F2F] rounded-full border border-[#D32F2F]/20">
                            <div className="w-1.5 h-1.5 bg-[#D32F2F] rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold tracking-wide">LIVE</span>
                          </div>
                        )}
                        {slot.student.status === 'completed' && (
                          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
                            <span className="text-xs font-semibold">COMPLETED</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-light">{slot.student.rollNumber}</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-light">{slot.student.concernType}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 font-light italic">Available</span>
                )}
              </div>

              {/* Action Buttons */}
              {slot.student && (
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {slot.student.status === 'upcoming' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLaunchZoom(slot);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#D32F2F] hover:bg-[#D32F2F]/90 text-white rounded-xl transition-all shadow-lg shadow-[#D32F2F]/20 hover:shadow-[#D32F2F]/30 font-medium"
                    >
                      <Video className="w-4 h-4" />
                      <span>Launch</span>
                    </button>
                  )}
                  {slot.student.status === 'in-progress' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLaunchZoom(slot);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all font-medium"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join</span>
                    </button>
                  )}
                  {slot.student.priority === 'High' && slot.student.status === 'upcoming' && (
                    <button className="p-2.5 bg-[#D32F2F]/10 hover:bg-[#D32F2F]/20 text-[#D32F2F] rounded-xl transition-all border border-[#D32F2F]/20">
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
