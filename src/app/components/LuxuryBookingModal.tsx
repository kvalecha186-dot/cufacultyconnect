import { useState } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LuxuryBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LuxuryBookingModal({ isOpen, onClose }: LuxuryBookingModalProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    preferredTime: ''
  });

  if (!isOpen) return null;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.rollNumber.trim()) newErrors.rollNumber = 'University ID is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.semester) newErrors.semester = 'Semester is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Valid email is required';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (currentStep === 2) {
      if (!formData.concernType) newErrors.concernType = 'Please select a concern type';
      if (!formData.concernDetails.trim()) {
        newErrors.concernDetails = 'Please describe your concern';
      }
    }

    if (currentStep === 3) {
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';
      if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time slot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      console.log('Booking submitted:', formData);
      setStep(4);
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-6">
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Ambient Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D32F2F]/5 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 p-8 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#0F2942] mb-2">Book Your Interaction</h2>
              <p className="text-gray-500 font-light">Connect with faculty experts in minutes</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all border border-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Progress Indicator */}
          {step < 4 && (
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1">
                  <div className={`h-1 rounded-full transition-all ${s <= step ? 'bg-[#D32F2F]' : 'bg-gray-200'}`}></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 pb-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-light ${
                      errors.name
                        ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                        : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-xs text-[#D32F2F] mt-1 font-medium">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">University ID (UID)</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, rollNumber: e.target.value });
                      if (errors.rollNumber) setErrors({ ...errors, rollNumber: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-light ${
                      errors.rollNumber
                        ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                        : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                    }`}
                    placeholder="21CSE001"
                  />
                  {errors.rollNumber && (
                    <p className="text-xs text-[#D32F2F] mt-1 font-medium">{errors.rollNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ ...formData, department: e.target.value });
                      if (errors.department) setErrors({ ...errors, department: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-light ${
                      errors.department
                        ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                        : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                    }`}
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="MBA">Business Administration</option>
                  </select>
                  {errors.department && (
                    <p className="text-xs text-[#D32F2F] mt-1 font-medium">{errors.department}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => {
                      setFormData({ ...formData, semester: e.target.value });
                      if (errors.semester) setErrors({ ...errors, semester: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-light ${
                      errors.semester
                        ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                        : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                    }`}
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="text-xs text-[#D32F2F] mt-1 font-medium">{errors.semester}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-light ${
                      errors.email
                        ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                        : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                    }`}
                    placeholder="your.email@cumail.in"
                  />
                  {errors.email && (
                    <p className="text-xs text-[#D32F2F] mt-1 font-medium">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-light ${
                      errors.phone
                        ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                        : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#D32F2F] mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">Concern Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Academic', 'Placement', 'Career', 'Personal'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, concernType: type })}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        formData.concernType === type
                          ? 'bg-gradient-to-br from-[#FF3B30]/10 to-[#E5A93C]/10 border-[#D32F2F] shadow-lg shadow-[#D32F2F]/10'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-semibold ${formData.concernType === type ? 'text-[#D32F2F]' : 'text-gray-700'}`}>
                        {type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Primary Academic/Placement Concern</label>
                <textarea
                  value={formData.concernDetails}
                  onChange={(e) => {
                    setFormData({ ...formData, concernDetails: e.target.value });
                    if (errors.concernDetails) setErrors({ ...errors, concernDetails: '' });
                  }}
                  className={`w-full px-4 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all resize-none font-light ${
                    errors.concernDetails
                      ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                      : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                  }`}
                  rows={8}
                  placeholder="Briefly describe your primary concern so faculty can prepare better for your session..."
                />
                {errors.concernDetails ? (
                  <p className="text-xs text-[#D32F2F] mt-2 font-medium">{errors.concernDetails}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2 font-light">
                    Your confidence level will be tracked during the post-call feedback
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredDate: e.target.value });
                      if (errors.preferredDate) setErrors({ ...errors, preferredDate: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-light ${
                      errors.preferredDate
                        ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                        : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                    }`}
                  />
                  {errors.preferredDate && (
                    <p className="text-xs text-[#D32F2F] mt-1 font-medium">{errors.preferredDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Time Slot</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredTime: e.target.value });
                      if (errors.preferredTime) setErrors({ ...errors, preferredTime: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-light ${
                      errors.preferredTime
                        ? 'border-[#D32F2F] focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                        : 'border-gray-200 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]'
                    }`}
                  >
                    <option value="">Select Time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                    <option value="evening">Evening (3 PM - 6 PM)</option>
                  </select>
                  {errors.preferredTime && (
                    <p className="text-xs text-[#D32F2F] mt-1 font-medium">{errors.preferredTime}</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-semibold text-[#0F2942] mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-light">Name</span>
                    <span className="font-semibold text-[#0F2942]">{formData.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-light">Concern Type</span>
                    <span className="font-semibold text-[#D32F2F]">{formData.concernType || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-light">Date</span>
                    <span className="font-semibold text-[#0F2942]">{formData.preferredDate || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-[#0F2942] mb-3">Booking Confirmed</h3>
              <p className="text-gray-500 font-light mb-8 max-w-md mx-auto">
                Your faculty interaction has been scheduled. Check your email for Zoom details.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#D32F2F] text-white rounded-2xl hover:bg-[#D32F2F]/90 transition-all font-semibold shadow-lg shadow-[#D32F2F]/20"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step < 4 && (
          <div className="relative z-10 px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-medium"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#D32F2F] text-white rounded-2xl hover:bg-[#D32F2F]/90 transition-all font-semibold shadow-lg shadow-[#D32F2F]/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#D32F2F] text-white rounded-2xl hover:bg-[#D32F2F]/90 transition-all font-semibold shadow-lg shadow-[#D32F2F]/20"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Booking</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
