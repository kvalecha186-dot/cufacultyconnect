import { User, Mail, Phone, BookOpen, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StudentProfile {
  name: string;
  rollNumber: string;
  department: string;
  semester: string;
  email: string;
  phone: string;
  concernType: 'Academic' | 'Placement' | 'Career' | 'Personal';
  concernSummary: string;
  confidenceBefore: number;
  confidenceAfter?: number;
  priorityLevel: 'High' | 'Medium' | 'Low';
}

interface StudentInsightSheetProps {
  student: StudentProfile;
}

export function StudentInsightSheet({ student }: StudentInsightSheetProps) {
  const confidenceData = [
    { value: 20 },
    { value: 25 },
    { value: student.confidenceBefore },
    { value: student.confidenceAfter || student.confidenceBefore },
    { value: (student.confidenceAfter || student.confidenceBefore) + 5 }
  ];

  const concernIcons = {
    Academic: BookOpen,
    Placement: Briefcase,
    Career: TrendingUp,
    Personal: User
  };

  const ConcernIcon = concernIcons[student.concernType];

  const priorityColors = {
    High: 'bg-[#D32F2F]',
    Medium: 'bg-orange-500',
    Low: 'bg-emerald-500'
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-100 shadow-2xl shadow-black/5">
      {/* Header */}
      <div className="relative bg-[#0F2942] p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D32F2F]/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{student.name}</h3>
                <p className="text-white/60 text-sm font-light">{student.rollNumber}</p>
              </div>
            </div>
            <div className={`w-3 h-3 ${priorityColors[student.priorityLevel]} rounded-full shadow-lg animate-pulse`}></div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Mail className="w-4 h-4 text-white/40" />
              <span className="font-light">{student.email}</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Phone className="w-4 h-4 text-white/40" />
              <span className="font-light">{student.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Academic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Department</div>
            <div className="font-semibold text-[#0F2942]">{student.department}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Semester</div>
            <div className="font-semibold text-[#0F2942]">{student.semester}</div>
          </div>
        </div>

        {/* Concern Details */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-[#D32F2F]" />
            <span className="text-sm font-semibold text-[#0F2942] uppercase tracking-wider">Student Concern</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D32F2F]/10 rounded-full border border-[#D32F2F]/20 mb-4">
            <ConcernIcon className="w-4 h-4 text-[#D32F2F]" />
            <span className="text-sm font-semibold text-[#D32F2F]">{student.concernType}</span>
          </div>

          <p className="text-gray-600 leading-relaxed font-light bg-gray-50 p-6 rounded-2xl border border-gray-100">
            {student.concernSummary}
          </p>
        </div>

        {/* Confidence Velocity Graph */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D32F2F]" />
              <span className="text-sm font-semibold text-[#0F2942] uppercase tracking-wider">Confidence Velocity</span>
            </div>
            {student.confidenceAfter && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-full border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600">
                  +{student.confidenceAfter - student.confidenceBefore}%
                </span>
              </div>
            )}
          </div>

          {/* Minimalist Line Graph */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Before Call</div>
                <div className="text-3xl font-bold text-[#D32F2F]">{student.confidenceBefore}%</div>
              </div>
              {student.confidenceAfter && (
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">After Call</div>
                  <div className="text-3xl font-bold text-emerald-600">{student.confidenceAfter}%</div>
                </div>
              )}
            </div>

            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={confidenceData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#D32F2F"
                  strokeWidth={3}
                  dot={false}
                  strokeLinecap="round"
                />
              </LineChart>
            </ResponsiveContainer>

            {!student.confidenceAfter && (
              <div className="text-xs text-gray-400 text-center mt-2 font-light">
                Post-call confidence will be tracked here
              </div>
            )}
          </div>
        </div>

        {/* Risk Indicator */}
        {student.confidenceBefore < 40 && (
          <div className="flex items-center gap-3 p-4 bg-[#D32F2F]/5 rounded-2xl border border-[#D32F2F]/20">
            <div className="w-2 h-2 bg-[#D32F2F] rounded-full animate-pulse"></div>
            <span className="text-sm text-[#D32F2F] font-medium">
              Low confidence detected • Priority intervention recommended
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
