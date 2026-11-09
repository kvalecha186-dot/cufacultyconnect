import { useState } from 'react';
import { LayoutDashboard, Calendar, Users, BarChart3, Bell } from 'lucide-react';
import { MinimalScheduleGrid } from './MinimalScheduleGrid';
import { StudentInsightSheet } from './StudentInsightSheet';
import { LuxuryFeedbackModal } from './LuxuryFeedbackModal';

export function LuxuryDashboard() {
  const [selectedStudent, setSelectedStudent] = useState({
    name: 'Priya Sharma',
    rollNumber: '21CSE045',
    department: 'Computer Science & Engineering',
    semester: 'VI (Spring 2026)',
    email: 'priya.sharma@cumail.in',
    phone: '+91 98765 43210',
    concernType: 'Placement' as const,
    concernSummary: 'I have been applying for software development roles but not getting interview calls. I need guidance on improving my resume, building relevant projects, and preparing for technical interviews. Also concerned about placement statistics for CSE students.',
    confidenceBefore: 35,
    priorityLevel: 'High' as const
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackStudent, setFeedbackStudent] = useState('');

  const menuItems = [
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'students', icon: Users, label: 'Students' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' }
  ];

  const [activeTab, setActiveTab] = useState('schedule');

  const handleLaunchZoom = (slot: any) => {
    console.log('Launching Zoom for:', slot);
    setTimeout(() => {
      setFeedbackStudent(slot.student.name);
      setShowFeedback(true);
    }, 2000);
  };

  const handleViewProfile = (slot: any) => {
    console.log('Viewing profile:', slot);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Minimal Sidebar */}
      <aside className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8">
        {/* Logo */}
        <div className="w-10 h-10 bg-[#D32F2F] rounded-2xl mb-12 flex items-center justify-center shadow-lg shadow-[#D32F2F]/30">
          <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative w-12 h-12 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-[#D32F2F] text-white shadow-lg shadow-[#D32F2F]/30'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5 mx-auto" />
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#D32F2F] rounded-r-full -ml-5"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Avatar */}
        <button className="w-12 h-12 bg-[#0F2942] rounded-2xl flex items-center justify-center text-white font-bold border border-white/10">
          DK
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Minimal Header */}
        <header className="bg-white px-12 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold text-[#0F2942] tracking-tight">Today's Schedule</h1>
                <div className="px-4 py-1.5 bg-[#D32F2F]/10 text-[#D32F2F] text-xs font-semibold rounded-full">
                  5 ACTIVE
                </div>
              </div>
              <p className="text-gray-400 font-light">Saturday, May 16, 2026</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-light mb-1">Completed</div>
                  <div className="text-2xl font-bold text-[#0F2942]">8</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-light mb-1">Resolution</div>
                  <div className="text-2xl font-bold text-[#D32F2F]">96%</div>
                </div>
              </div>

              {/* Notifications */}
              <button className="relative w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all border border-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#D32F2F] rounded-full"></div>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-[1800px]">
              {/* Schedule Grid - 2 columns */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#0F2942]">Micro-Slot Schedule</h2>
                  <div className="flex items-center gap-8 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-400 font-light">Upcoming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#D32F2F] rounded-full"></div>
                      <span className="text-gray-400 font-light">Live</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-gray-400 font-light">Done</span>
                    </div>
                  </div>
                </div>

                <MinimalScheduleGrid
                  onLaunchZoom={handleLaunchZoom}
                  onViewProfile={handleViewProfile}
                />
              </div>

              {/* Student Insight - 1 column */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F2942] mb-8">Student Insight</h2>

                  <StudentInsightSheet student={selectedStudent} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LuxuryFeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        studentName={feedbackStudent}
      />
    </div>
  );
}
