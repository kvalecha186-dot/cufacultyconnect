import { useState } from 'react';
import { X, Star, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

interface LuxuryFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export function LuxuryFeedbackModal({ isOpen, onClose, studentName }: LuxuryFeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [concernResolved, setConcernResolved] = useState<boolean | null>(null);
  const [confidenceBefore] = useState(35);
  const [confidenceAfter, setConfidenceAfter] = useState(75);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log({ rating, concernResolved, confidenceBefore, confidenceAfter });
    onClose();
  };

  const confidenceImprovement = confidenceAfter - confidenceBefore;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-6">
      {/* Floating Modal */}
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D32F2F]/5 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 p-8 pb-0">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#0F2942] mb-2">Session Feedback</h2>
              <p className="text-gray-500 font-light">{studentName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all border border-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 pb-8 space-y-10">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-[#0F2942] mb-4 uppercase tracking-wider">
              Session Quality
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-10 h-10 transition-all ${
                      star <= (hoverRating || rating)
                        ? 'fill-[#D32F2F] text-[#D32F2F] drop-shadow-[0_2px_8px_rgba(211,47,47,0.4)]'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-4 text-lg font-semibold text-[#0F2942]">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                </span>
              )}
            </div>
          </div>

          {/* Binary Resolution */}
          <div>
            <label className="block text-sm font-semibold text-[#0F2942] mb-4 uppercase tracking-wider">
              Concern Status
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setConcernResolved(true)}
                className={`group relative p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                  concernResolved === true
                    ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                  concernResolved === true ? 'bg-emerald-500' : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <CheckCircle2 className={`w-6 h-6 ${concernResolved === true ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className={`font-semibold ${concernResolved === true ? 'text-emerald-700' : 'text-gray-700'}`}>
                  Resolved
                </div>
                <div className={`text-sm font-light ${concernResolved === true ? 'text-emerald-600' : 'text-gray-500'}`}>
                  Issue fully addressed
                </div>
              </button>

              <button
                onClick={() => setConcernResolved(false)}
                className={`group relative p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                  concernResolved === false
                    ? 'bg-gradient-to-br from-[#D32F2F]/10 to-[#D32F2F]/20 border-[#D32F2F]'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                  concernResolved === false ? 'bg-[#D32F2F]' : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <XCircle className={`w-6 h-6 ${concernResolved === false ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className={`font-semibold ${concernResolved === false ? 'text-[#D32F2F]' : 'text-gray-700'}`}>
                  Needs Follow-up
                </div>
                <div className={`text-sm font-light ${concernResolved === false ? 'text-[#D32F2F]' : 'text-gray-500'}`}>
                  Requires more support
                </div>
              </button>
            </div>
          </div>

          {/* Haptic-Style Confidence Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-[#0F2942] uppercase tracking-wider">
                Post-Call Confidence
              </label>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Before</div>
                  <div className="text-lg font-bold text-gray-400">{confidenceBefore}%</div>
                </div>
                <TrendingUp className="w-5 h-5 text-[#D32F2F]" />
                <div>
                  <div className="text-xs text-gray-500">After</div>
                  <div className="text-lg font-bold text-[#D32F2F]">{confidenceAfter}%</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Custom Slider Track */}
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D32F2F] to-[#D32F2F] rounded-full transition-all duration-300"
                  style={{ width: `${confidenceAfter}%` }}
                ></div>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={confidenceAfter}
                onChange={(e) => setConfidenceAfter(Number(e.target.value))}
                className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
              />

              {/* Slider Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-[#D32F2F] transition-all pointer-events-none"
                style={{ left: `calc(${confidenceAfter}% - 12px)` }}
              >
                <div className="absolute inset-0 bg-[#D32F2F]/20 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Improvement Badge */}
            {confidenceImprovement > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-full border border-emerald-200">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  +{confidenceImprovement}% confidence boost
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="relative z-10 px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || concernResolved === null}
            className="flex-1 px-6 py-3 bg-[#D32F2F] hover:bg-[#D32F2F]/90 text-white rounded-2xl transition-all font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#D32F2F]/20 hover:shadow-[#D32F2F]/30"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
