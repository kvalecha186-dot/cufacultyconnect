import { User, AlertCircle, BookOpen, Briefcase, Phone, Mail } from 'lucide-react';

interface StudentProfile {
  name: string;
  rollNumber: string;
  department: string;
  semester: string;
  email: string;
  phone: string;
  concernType: 'Academic' | 'Placement' | 'Career' | 'Personal';
  concernSummary: string;
  confidenceLevel: number;
  priorityLevel: 'High' | 'Medium' | 'Low';
}

interface StudentProfileCardProps {
  student: StudentProfile;
}

export function StudentProfileCard({ student }: StudentProfileCardProps) {
  const concernColors = {
    Academic: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    Placement: { bg: 'bg-[#D32F2F]/10', text: 'text-[#D32F2F]', border: 'border-[#D32F2F]/30' },
    Career: { bg: 'bg-[#D4AF37]/10', text: 'text-[#D4AF37]', border: 'border-[#D4AF37]/30' },
    Personal: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' }
  };

  const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500'
  };

  const concernColor = concernColors[student.concernType];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#0F2942] to-[#1a3a54] p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{student.name}</h3>
              <p className="text-sm text-gray-300">{student.rollNumber}</p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${priorityColors[student.priorityLevel]} animate-pulse`}></div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Department</div>
            <div className="font-semibold text-[#0F2942]">{student.department}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Semester</div>
            <div className="font-semibold text-[#0F2942]">{student.semester}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{student.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{student.phone}</span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-[#D32F2F]" />
            <span className="font-semibold text-[#0F2942]">Concern Submitted</span>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1 ${concernColor.bg} ${concernColor.text} rounded-lg border ${concernColor.border} mb-3`}>
            {student.concernType === 'Academic' && <BookOpen className="w-4 h-4" />}
            {student.concernType === 'Placement' && <Briefcase className="w-4 h-4" />}
            {student.concernType === 'Career' && <Briefcase className="w-4 h-4" />}
            {student.concernType === 'Personal' && <User className="w-4 h-4" />}
            <span className="font-medium">{student.concernType}</span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            {student.concernSummary}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Pre-Call Confidence Level</span>
            <span className="text-sm font-bold text-[#0F2942]">{student.confidenceLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${
                student.confidenceLevel < 40 ? 'bg-red-500' :
                student.confidenceLevel < 70 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${student.confidenceLevel}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
