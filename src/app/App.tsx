import { useState, useCallback, useEffect } from 'react';
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

type View = 'landing' | 'dashboard';
type LoginType = 'student' | 'faculty' | 'hod';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [view, setView] = useState<View>('landing');
  const [showAbout, setShowAbout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState<LoginType>('student');
  const [dashboardRole, setDashboardRole] = useState<DashboardRole>('student');
  const [showBooking, setShowBooking] = useState(false);

  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  // Browser back button support
  useEffect(() => {
    const handlePopState = () => {
      if (view === 'dashboard') setView('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view]);

  const handleLoginClick = (type: LoginType) => {
    setLoginType(type);
    setShowLogin(true);
  };

  /* Receives the resolved role from LoginModal (student/faculty/senior/hod/director) */
  const handleLoginSuccess = (role: ResolvedRole) => {
    setShowLogin(false);
    setDashboardRole(role as DashboardRole);
    setTimeout(() => {
      setView('dashboard');
      window.history.pushState({ view: 'dashboard' }, '');
    }, 300);
  };

  const renderDashboardContent = (role: DashboardRole, activeTab: string) => {
    switch (role) {
      case 'student':   return <StudentView activeTab={activeTab} onBookSession={() => setShowBooking(true)} />;
      case 'senior':    return <SeniorBuddyView activeTab={activeTab} />;
      case 'faculty':   return <FacultyMentorView activeTab={activeTab} />;
      case 'hod':       return <HODCentralView activeTab={activeTab} />;
      case 'director':  return <DirectorView activeTab={activeTab} />;
      default:          return <StudentView activeTab={activeTab} />;
    }
  };

  return (
    <MentorshipProvider>
    <div className="min-h-screen bg-white">
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      {view === 'landing' && (
        <div>
          <CUIMSLanding
            onLoginClick={handleLoginClick}
            onFacultyPortal={() => { setDashboardRole('faculty'); setView('dashboard'); window.history.pushState({ view: 'dashboard' }, ''); }}
            onAboutClick={() => setShowAbout(true)}
            onBookSlot={() => {}}
          />
          <LoginModal
            isOpen={showLogin}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setShowLogin(false)}
            loginType={loginType}
          />
          <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
        </div>
      )}

      {view === 'dashboard' && (
        <DashboardShell role={dashboardRole} onBack={() => setView('landing')}>
          {(currentRole: DashboardRole, activeTab: string) => renderDashboardContent(currentRole, activeTab)}
        </DashboardShell>
      )}

      <BookInteractionModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </div>
    </MentorshipProvider>
  );
}