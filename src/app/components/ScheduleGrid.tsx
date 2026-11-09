import { Video, Clock, AlertTriangle } from 'lucide-react';

interface TimeSlot {
  time: string;
  student?: {
    name: string;
    rollNumber: string;
    concernType: string;
    status: 'upcoming' | 'in-progress' | 'completed';
  };
}

interface ScheduleGridProps {
  onLaunchZoom: (slot: TimeSlot) => void;
  onEscalate: (slot: TimeSlot) => void;
  onViewProfile: (slot: TimeSlot) => void;
}

export function ScheduleGrid({ onLaunchZoom, onEscalate, onViewProfile }: ScheduleGridProps) {
  const slots: TimeSlot[] = [
    { time: '09:00 AM', student: { name: 'Rahul Kumar', rollNumber: '21CSE001', concernType: 'Academic', status: 'completed' } },
    { time: '09:07 AM', student: { name: 'Priya Sharma', rollNumber: '21CSE045', concernType: 'Placement', status: 'in-progress' } },
    { time: '09:14 AM', student: { name: 'Arjun Patel', rollNumber: '21CSE089', concernType: 'Career', status: 'upcoming' } },
    { time: '09:21 AM' },
    { time: '09:28 AM', student: { name: 'Sneha Gupta', rollNumber: '21CSE112', concernType: 'Academic', status: 'upcoming' } },
    { time: '09:35 AM' },
    { time: '09:42 AM', student: { name: 'Vikram Singh', rollNumber: '21CSE156', concernType: 'Placement', status: 'upcoming' } },
    { time: '09:49 AM' },
    { time: '09:56 AM', student: { name: 'Ananya Roy', rollNumber: '21CSE178', concernType: 'Personal', status: 'upcoming' } },
    { time: '10:03 AM' },
    { time: '10:10 AM', student: { name: 'Karan Mehta', rollNumber: '21CSE201', concernType: 'Academic', status: 'upcoming' } },
    { time: '10:17 AM' }
  ];

  const statusColors = {
    upcoming: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
    'in-progress': { bg: 'bg-[#D32F2F]/10', border: 'border-[#D32F2F]', text: 'text-[#D32F2F]' },
    completed: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' }
  };

  return (
    <div className="space-y-3">
      {slots.map((slot, index) => (
        <div
          key={index}
          className={`rounded-xl border-2 transition-all ${
            slot.student
              ? `${statusColors[slot.student.status].bg} ${statusColors[slot.student.status].border} hover:shadow-md`
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[100px]">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-[#0F2942]">{slot.time}</span>
                </div>

                {slot.student ? (
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold text-[#0F2942]">{slot.student.name}</div>
                      <div className="text-sm text-gray-600">{slot.student.rollNumber} • {slot.student.concernType}</div>
                    </div>

                    {slot.student.status === 'in-progress' && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#D32F2F] text-white rounded-full text-sm font-medium animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        Live Now
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Available Slot</span>
                )}
              </div>

              {slot.student && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewProfile(slot)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    View Profile
                  </button>

                  {slot.student.status === 'upcoming' && (
                    <button
                      onClick={() => onLaunchZoom(slot)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-[#B71C1C] transition-all font-medium shadow-sm"
                    >
                      <Video className="w-4 h-4" />
                      Launch Zoom
                    </button>
                  )}

                  {slot.student.status === 'in-progress' && (
                    <button
                      onClick={() => onLaunchZoom(slot)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm"
                    >
                      <Video className="w-4 h-4" />
                      Join Session
                    </button>
                  )}

                  <button
                    onClick={() => onEscalate(slot)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/30 transition-all font-medium"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Escalate to HoD
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
