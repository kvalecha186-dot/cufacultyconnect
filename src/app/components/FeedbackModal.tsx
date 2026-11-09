import { useState } from 'react';
import { X, Star, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export function FeedbackModal({ isOpen, onClose, studentName }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [concernResolved, setConcernResolved] = useState<boolean | null>(null);
  const [confidenceBefore, setConfidenceBefore] = useState(30);
  const [confidenceAfter, setConfidenceAfter] = useState(75);
  const [additionalComments, setAdditionalComments] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log({
      rating,
      concernResolved,
      confidenceBefore,
      confidenceAfter,
      additionalComments
    });
    onClose();
  };

  const confidenceImprovement = confidenceAfter - confidenceBefore;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#0F2942] to-[#1a3a54] p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Session Feedback</h2>
            <p className="text-sm text-gray-300 mt-1">Help us improve: {studentName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-lg font-semibold text-[#0F2942] mb-4">
              How would you rate this session?
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoverRating || rating)
                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-4 text-lg font-semibold text-[#0F2942]">
                  {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Needs Improvement'}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-[#0F2942] mb-4">
              Was your concern resolved?
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setConcernResolved(true)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  concernResolved === true
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Yes, Resolved</div>
              </button>
              <button
                onClick={() => setConcernResolved(false)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  concernResolved === false
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <XCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">No, Still Concerned</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-[#0F2942] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D32F2F]" />
              Confidence Level Tracking
            </label>

            <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Before the call</span>
                  <span className="text-lg font-bold text-[#0F2942]">{confidenceBefore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceBefore}
                  onChange={(e) => setConfidenceBefore(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #D32F2F 0%, #D32F2F ${confidenceBefore}%, #e5e7eb ${confidenceBefore}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">After the call</span>
                  <span className="text-lg font-bold text-[#0F2942]">{confidenceAfter}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceAfter}
                  onChange={(e) => setConfidenceAfter(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${confidenceAfter}%, #e5e7eb ${confidenceAfter}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              <div className={`p-4 rounded-lg ${
                confidenceImprovement > 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className={`w-5 h-5 ${confidenceImprovement > 0 ? 'text-green-600' : 'text-yellow-600'}`} />
                  <span className="font-semibold text-[#0F2942]">
                    {confidenceImprovement > 0 ? '+' : ''}{confidenceImprovement}%
                    <span className={confidenceImprovement > 0 ? 'text-green-600' : 'text-yellow-600'}>
                      {' '}Improvement
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-[#0F2942] mb-3">
              Additional Comments (Optional)
            </label>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Share any additional feedback or suggestions..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-6 flex gap-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || concernResolved === null}
            className="flex-1 px-6 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#B71C1C] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#D32F2F]/30"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
