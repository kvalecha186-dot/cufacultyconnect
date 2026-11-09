import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router';
import { SplashScreen } from './components/SplashScreen';
import { CUIMSLanding } from './components/CUIMSLanding';
import { LoginModal, type ResolvedRole } from './components/LoginModal';
import { DashboardShell, type DashboardRole } from './components/DashboardShell';
import { AboutModal } from './components/AboutModal';
import { StudentView } from './components/dashboards/StudentView';
import { SeniorBuddyView } from './components/dashboards/SeniorBuddyView';
import { FacultyMentorView } from './components/dashboards/FacultyMentorView';
import { HODCentralView } from './components/dashboards/HODCentralView';
import { DirectorView } from './components/dashboards/DirectorView';
import { BookInteractionModal } from './components/BookInteractionModal';
import { MentorshipProvider } from './data/mentorshipStore';

type LoginType = 'student' | 'faculty' | 'hod';

function LandingPage() {
  const [showAbout, setShowAbout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState<LoginType>('student');
  const navigate = useNavigate();

  const handleLoginClick = (type: LoginType) => {
    setLoginType(type);
    setShowLogin(true);
  };

  const handleLoginSuccess = (role: ResolvedRole) => {
    setShowLogin(false);
    setTimeout(() => {
      navigate(`/${role}`);
    }, 300);
  };

  return (
    <div>
      <CUIMSLanding
        onLoginClick={handleLoginClick}
        onFacultyPortal={() => navigate('/faculty')}
        onAboutClick={() => setShowAbout(true)}
        onBookSlot={() => navigate('/student')}
      />
      <LoginModal
        isOpen={showLogin}
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setShowLogin(false)}
        loginType={loginType}
      />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}

function DashboardPage({ role }: { role: DashboardRole }) {
  const [showBooking, setShowBooking] = useState(false);
  const navigate = useNavigate();

  const renderDashboardContent = (currentRole: DashboardRole, activeTab: string) => {
    switch (currentRole) {
      case 'student':   return <StudentView activeTab={activeTab} onBookSession={() => setShowBooking(true)} />;
      case 'senior':    return <SeniorBuddyView activeTab={activeTab} />;
      case 'faculty':   return <FacultyMentorView activeTab={activeTab} />;
      case 'hod':       return <HODCentralView activeTab={activeTab} />;
      case 'director':  return <DirectorView activeTab={activeTab} />;
      default:          return <StudentView activeTab={activeTab} />;
    }
  };

  return (
    <>
      <DashboardShell role={role} onBack={() => navigate('/')}>
        {(currentRole: DashboardRole, activeTab: string) => renderDashboardContent(currentRole, activeTab)}
      </DashboardShell>
      <BookInteractionModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(() => {
    return window.location.pathname !== '/' && window.location.pathname !== '';
  });

  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  return (
    <MentorshipProvider>
      <div className="min-h-screen bg-white">
        {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student" element={<DashboardPage role="student" />} />
          <Route path="/faculty" element={<DashboardPage role="faculty" />} />
          <Route path="/senior" element={<DashboardPage role="senior" />} />
          <Route path="/hod" element={<DashboardPage role="hod" />} />
          <Route path="/director" element={<DashboardPage role="director" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </MentorshipProvider>
  );
}
