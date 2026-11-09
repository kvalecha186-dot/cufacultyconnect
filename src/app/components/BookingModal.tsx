import { useState } from 'react';
import { X, Calendar, Clock, User, FileText, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: '',
    semester: '',
    email: '',
    phone: '',
    concernType: '',
    concernDetails: '',
    preferredDate: '',
    preferredTime: '',
    confidenceLevel: 50
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Booking submitted:', formData);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#0F2942] to-[#1a3a54] p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Book Faculty Interaction</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-2 rounded-full transition-all ${s <= step ? 'bg-[#D32F2F]' : 'bg-white/20'}`}></div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-300">
            Step {step} of 3: {step === 1 ? 'Personal Details' : step === 2 ? 'Concern Details' : 'Schedule & Confirm'}
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F2942] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F2942] mb-2">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="21CSE001"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F2942] mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="MBA">Business Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F2942] mb-2">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F2942] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="your.email@cumail.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F2942] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0F2942] mb-2">Concern Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Academic', 'Placement', 'Career', 'Personal'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, concernType: type })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.concernType === type
                          ? 'bg-[#D32F2F]/10 border-[#D32F2F] text-[#D32F2F]'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F2942] mb-2">Describe Your Concern</label>
                <textarea
                  value={formData.concernDetails}
                  onChange={(e) => setFormData({ ...formData, concernDetails: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F] resize-none"
                  rows={6}
                  placeholder="Please provide details about your concern so the faculty can prepare better..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F2942] mb-3">
                  Current Confidence Level: {formData.confidenceLevel}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.confidenceLevel}
                  onChange={(e) => setFormData({ ...formData, confidenceLevel: Number(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #D32F2F 0%, #D32F2F ${formData.confidenceLevel}%, #e5e7eb ${formData.confidenceLevel}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Not Confident</span>
                  <span>Very Confident</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F2942] mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F2942] mb-2">Preferred Time</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                  >
                    <option value="">Select Time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                    <option value="evening">Evening (3 PM - 6 PM)</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-[#0F2942] mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-[#0F2942]">{formData.name || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Roll Number:</span>
                    <span className="font-medium text-[#0F2942]">{formData.rollNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Concern Type:</span>
                    <span className="font-medium text-[#D32F2F]">{formData.concernType || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preferred Date:</span>
                    <span className="font-medium text-[#0F2942]">{formData.preferredDate || 'Not selected'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F2942] mb-3">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your faculty interaction slot has been successfully booked.</p>
              <div className="bg-[#D32F2F]/10 border border-[#D32F2F]/30 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-700">
                  You will receive a confirmation email with Zoom meeting details shortly.
                  Check your CUIMS dashboard for updates.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#D32F2F] text-white rounded-lg hover:bg-[#B71C1C] transition-all font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {step < 4 && (
          <div className="sticky bottom-0 bg-gray-50 p-6 flex gap-4 border-t border-gray-200">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#B71C1C] transition-all font-semibold shadow-lg shadow-[#D32F2F]/30"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#B71C1C] transition-all font-semibold shadow-lg shadow-[#D32F2F]/30"
              >
                Confirm Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
