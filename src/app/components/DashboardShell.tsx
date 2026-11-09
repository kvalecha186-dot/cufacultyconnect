import { useState } from 'react';
import { useMentorship } from '../data/mentorshipStore';
import {
  ChevronDown, LogOut, User, X, Pencil, Save, Eye,
  Home, Target, HelpCircle, CalendarDays, FolderArchive,
  Users, BookOpen, MessageSquare, Megaphone, Trophy, Upload, Star,
  Activity, Zap, UserCheck, Send, AlertTriangle, ClipboardList,
  Crown, BarChart3, Layers, FileText, Award,
  Globe, TrendingUp, Building, Mail, Phone, MapPin, Calendar,
  GraduationCap, Briefcase, Clock, Hash, BookMarked, Shield,
} from 'lucide-react';

export type DashboardRole = 'student' | 'senior' | 'faculty' | 'hod' | 'director';

interface DashboardShellProps {
  role: DashboardRole;
  onBack: () => void;
  children: React.ReactNode;
}

const roleConfigs: Record<DashboardRole, {
  label: string;
  portalLabel: string;
  initials: string;
  userName: string;
  userSub: string;
  navItems: { id: string; label: string; icon: typeof Home }[];
}> = {
  student: {
    label: 'Student',
    portalLabel: 'B.E. CSE (AI & ML) • 25AML-304 • Block B1',
    initials: 'KV',
    userName: 'Khushi Valecha',
    userSub: '25AML10304 • Sem 1',
    navItems: [
      { id: 'overview', label: 'Dashboard', icon: Home },
    ],
  },
  senior: {
    label: 'Senior Mentor',
    portalLabel: 'Sections: 25AML-101, 25AML-102 • Block B1',
    initials: 'AK',
    userName: 'Ananya Kapoor',
    userSub: '23AML12045 • Sem 5',
    navItems: [
      { id: 'overview', label: 'Dashboard', icon: Home },
      { id: 'freshers', label: 'My Freshers', icon: Users },
      { id: 'forum', label: 'Discussion Forum', icon: MessageSquare },
      { id: 'requests', label: 'Mentorship Requests', icon: HelpCircle },
      { id: 'broadcast', label: 'Opportunities', icon: Megaphone },
      { id: 'ratings', label: 'Ratings & Feedback', icon: Star },
      { id: 'rewards', label: 'Rewards Ledger', icon: Trophy },
    ],
  },
  faculty: {
    label: 'Faculty',
    portalLabel: 'Sections: 25AML-301/302/303 • Block B1',
    initials: 'SS',
    userName: 'Dr. Sandeep Singh',
    userSub: 'CU-FAC-08421 • Assoc. Professor',
    navItems: [
      { id: 'overview', label: 'Dashboard', icon: Home },
      { id: 'mentees', label: 'Assigned Freshers', icon: UserCheck },
      { id: 'doubts', label: 'Student Doubts', icon: Zap },
      { id: 'sessions', label: 'Session Manager', icon: CalendarDays },
      { id: 'profiles', label: 'Student Profiles', icon: ClipboardList },
    ],
  },
  hod: {
    label: 'HOD',
    portalLabel: 'Dept: AI & ML (AML) • Blocks B1, B2',
    initials: 'AP',
    userName: 'Dr. Amrit Pal Singh',
    userSub: 'CU-HOD-00112 • HOD, AML',
    navItems: [
      { id: 'overview', label: 'Command Center', icon: Crown },
      { id: 'audit', label: 'Faculty Audit', icon: ClipboardList },
      { id: 'analytics', label: 'Dept Analytics', icon: BarChart3 },
    ],
  },
  director: {
    label: 'Director',
    portalLabel: 'Director, Chandigarh University',
    initials: 'RG',
    userName: 'Dr. Rajiv Gupta',
    userSub: 'CU-DIR-00001 • University Admin',
    navItems: [
      { id: 'overview', label: 'Global Overview', icon: Globe },
      { id: 'welfare', label: 'Student Welfare', icon: Activity },
      { id: 'recognition', label: 'Top Performers', icon: Award },
    ],
  },
};


const profileData: Record<DashboardRole, { sections: { title: string; rows: { label: string; value: string; icon: typeof Home }[] }[] }> = {
  student: { sections: [
    { title: 'Personal Information', rows: [
      { label: 'Full Name', value: 'Khushi Valecha', icon: User },
      { label: 'University ID', value: '25AML10304', icon: Hash },
      { label: 'Email', value: 'khushi.valecha@cumail.in', icon: Mail },
      { label: 'Phone', value: '+91 98765 43210', icon: Phone },
      { label: 'Address', value: 'Gharuan, Mohali, Punjab', icon: MapPin },
    ]},
    { title: 'Academic Details', rows: [
      { label: 'Course', value: 'B.E. CSE (AI & ML)', icon: GraduationCap },
      { label: 'Course Code', value: '25AML', icon: BookMarked },
      { label: 'Section', value: '25AML-304', icon: Hash },
      { label: 'Block', value: 'B1 — CSE/AI/ML Block', icon: Building },
      { label: 'Semester', value: '1st Semester', icon: Calendar },
      { label: 'Batch Year', value: '2025–2029', icon: Clock },
    ]},
    { title: 'Enrollment & Mentorship', rows: [
      { label: 'Admission Date', value: 'August 10, 2025', icon: Calendar },
      { label: 'Enrollment Status', value: 'Active — Regular', icon: Shield },
      { label: 'Mentor Assigned', value: 'Dr. Sandeep Singh', icon: UserCheck },
      { label: 'Senior Buddy', value: 'Ananya Kapoor (23AML12045)', icon: Users },
      { label: 'CGPA', value: '8.4 / 10.0 (Sem 1)', icon: Star },
    ]},
  ]},
  senior: { sections: [
    { title: 'Personal Information', rows: [
      { label: 'Full Name', value: 'Ananya Kapoor', icon: User },
      { label: 'University ID', value: '23AML12045', icon: Hash },
      { label: 'Email', value: 'ananya.kapoor@cumail.in', icon: Mail },
      { label: 'Phone', value: '+91 99887 76655', icon: Phone },
      { label: 'Address', value: 'New Delhi, India', icon: MapPin },
    ]},
    { title: 'Academic Details', rows: [
      { label: 'Course', value: 'B.E. CSE (AI & ML)', icon: GraduationCap },
      { label: 'Course Code', value: '23AML', icon: BookMarked },
      { label: 'Section', value: '23AML-301', icon: Hash },
      { label: 'Block', value: 'B1 — CSE/AI/ML Block', icon: Building },
      { label: 'Semester', value: '5th Semester', icon: Calendar },
      { label: 'Batch Year', value: '2023–2027', icon: Clock },
    ]},
    { title: 'Mentorship Role', rows: [
      { label: 'Role', value: 'Senior Peer Mentor', icon: Shield },
      { label: 'Assigned Sections', value: '25AML-101, 25AML-102', icon: Users },
      { label: 'Freshers Mentored', value: '15 students', icon: Users },
      { label: 'Mentor Since', value: 'June 2025', icon: Calendar },
      { label: 'Reward Points', value: '650 pts — Gold Tier', icon: Trophy },
      { label: 'DL Points Earned', value: '8 points', icon: Star },
    ]},
  ]},
  faculty: { sections: [
    { title: 'Personal Information', rows: [
      { label: 'Full Name', value: 'Dr. Sandeep Singh', icon: User },
      { label: 'Employee ID', value: 'CU-FAC-08421', icon: Hash },
      { label: 'Email', value: 'sandeep.singh@cu.ac.in', icon: Mail },
      { label: 'Phone', value: '+91 94123 56789', icon: Phone },
      { label: 'Office', value: 'Block B1, Room 312', icon: MapPin },
    ]},
    { title: 'Professional Details', rows: [
      { label: 'Designation', value: 'Associate Professor', icon: Briefcase },
      { label: 'Department', value: 'CSE (AI & ML)', icon: GraduationCap },
      { label: 'Block', value: 'B1 — CSE/AI/ML Block', icon: Building },
      { label: 'Joining Date', value: 'March 15, 2018', icon: Calendar },
      { label: 'Experience', value: '8+ years', icon: Clock },
    ]},
    { title: 'Teaching & Mentorship', rows: [
      { label: 'Courses Handled', value: 'Neural Networks, ML, Python for DS', icon: BookMarked },
      { label: 'Assigned Sections', value: '25AML-301, 302, 303, 25BCS-201, 202', icon: Hash },
      { label: 'Total Mentees', value: '25 freshers', icon: Users },
      { label: 'Specialization', value: 'Deep Learning, Computer Vision', icon: Star },
      { label: 'Publications', value: '12 papers (IEEE, Springer)', icon: FileText },
    ]},
  ]},
  hod: { sections: [
    { title: 'Personal Information', rows: [
      { label: 'Full Name', value: 'Dr. Amrit Pal Singh', icon: User },
      { label: 'Employee ID', value: 'CU-HOD-00112', icon: Hash },
      { label: 'Email', value: 'amritpal.singh@cu.ac.in', icon: Mail },
      { label: 'Phone', value: '+91 98100 12345', icon: Phone },
      { label: 'Office', value: 'Block B1, HOD Chamber', icon: MapPin },
    ]},
    { title: 'Department Details', rows: [
      { label: 'Department', value: 'CSE (AI & ML)', icon: GraduationCap },
      { label: 'Department Code', value: 'AML', icon: BookMarked },
      { label: 'Blocks Managed', value: 'B1, B2', icon: Building },
      { label: 'Tenure as HOD', value: 'Since January 2022 (4+ years)', icon: Clock },
      { label: 'Designation', value: 'Professor & HOD', icon: Briefcase },
    ]},
    { title: 'Administrative Scope', rows: [
      { label: 'Faculty Managed', value: '18 faculty members', icon: Users },
      { label: 'Senior Mentors', value: '24 senior students', icon: Users },
      { label: 'Total Sections', value: '12 sections (25AML-101 to 403)', icon: Hash },
      { label: 'Total Students', value: '1,200+ freshers', icon: Users },
      { label: 'Contact Hours', value: 'Mon–Fri, 9:00 AM – 5:00 PM', icon: Calendar },
    ]},
  ]},
  director: { sections: [
    { title: 'Personal Information', rows: [
      { label: 'Full Name', value: 'Dr. Rajiv Gupta', icon: User },
      { label: 'Employee ID', value: 'CU-DIR-00001', icon: Hash },
      { label: 'Email', value: 'director@cu.ac.in', icon: Mail },
      { label: 'Phone', value: '+91 98000 00001', icon: Phone },
      { label: 'Office', value: 'Administrative Block, Director Suite', icon: MapPin },
    ]},
    { title: 'Institutional Role', rows: [
      { label: 'Designation', value: 'Director, Chandigarh University', icon: Briefcase },
      { label: 'Tenure', value: 'Since August 2020 (6+ years)', icon: Clock },
      { label: 'Departments Supervised', value: 'All 10 departments (CSE, AML, IT, ECE, etc.)', icon: Building },
      { label: 'Blocks Overseen', value: 'A1–A3, B1–B3, C1–C3, D1–D7 (16 blocks)', icon: Building },
    ]},
    { title: 'Administrative Scope', rows: [
      { label: 'Total Faculty', value: '120+ faculty members', icon: Users },
      { label: 'Total Students', value: '7,750+ across 80 sections', icon: Users },
      { label: 'Total Senior Mentors', value: '180+ peer mentors', icon: Users },
      { label: 'Key Responsibilities', value: 'Academic governance, NAAC compliance, welfare', icon: Shield },
      { label: 'Contact Hours', value: 'Mon–Sat, 9:00 AM – 6:00 PM', icon: Calendar },
    ]},
  ]},
};

const allRoles: { value: DashboardRole; label: string }[] = [
  { value: 'student', label: 'Student View' },
  { value: 'senior', label: 'Senior Buddy' },
  { value: 'faculty', label: 'Faculty Mentor' },
  { value: 'hod', label: 'HOD Portal' },
  { value: 'director', label: 'Director View' },
];

export function DashboardShell({ role, onBack, children }: DashboardShellProps) {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [currentRole, setCurrentRole] = useState<DashboardRole>(role);
  const [showProfile, setShowProfile] = useState(false);
  const [profileMode, setProfileMode] = useState<'view' | 'edit'>('view');
  const [editableProfiles, setEditableProfiles] = useState(profileData);
  const { scrollToMyRequests } = useMentorship();

  const config = roleConfigs[currentRole];
  const profile = editableProfiles[currentRole];

  function updateProfileField(roleKey: DashboardRole, sectionIndex: number, rowIndex: number, value: string) {
    setEditableProfiles(prev => {
      const next = { ...prev, [roleKey]: { sections: prev[roleKey].sections.map((s, si) => si !== sectionIndex ? s : {
        ...s, rows: s.rows.map((r, ri) => ri !== rowIndex ? r : { ...r, value }),
      }) } };
      return next;
    });
  }

  const switchRole = (r: DashboardRole) => {
    setCurrentRole(r);
    setShowRoleSwitcher(false);
    setShowProfile(false);
    setProfileMode('view');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* ═══════ TOP BAR ═══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-white/90 backdrop-blur-2xl border-b border-[#E5E5E5] shadow-[0_1px_12px_rgba(0,0,0,0.03)]">
        <div className="h-full flex items-center justify-between px-4 lg:px-7">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button onClick={onBack}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] hover:border-[#D0D0D0] transition-all shadow-sm group">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-4 cursor-pointer pl-1 pr-4 py-1"
              onClick={onBack}>
              {/* ── CU Emblem — static, refined ── */}
              <div className="relative w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(155deg, #FAFAFA 0%, #EDEAE8 100%)',
                  boxShadow: '0 3px 10px rgba(20,20,20,0.10), 0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 2px rgba(0,0,0,0.04) inset',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}>
                {/* crisp inner highlight */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 50%)' }} />
                {/* emblem core */}
                <div className="relative w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(150deg, #5c0008 0%, #B0000D 55%, #E30613 100%)',
                    border: '1.2px solid rgba(255,214,140,0.5)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.22), inset 0 1px 2px rgba(255,255,255,0.22)',
                  }}>
                  <span className="text-[10px] font-extrabold tracking-tight text-white">CU</span>
                </div>
              </div>

              {/* ── Sole wordmark ── */}
              <div className="hidden sm:flex items-center">
                <span className="font-extrabold text-[17px] tracking-tight leading-none text-[#1A1A1A]">
                  Faculty Connect
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Role Switcher */}
            <div className="relative">
              <button onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-[#F5F5F5] hover:bg-[#EBEBEB] border border-[#E5E5E5] rounded-xl text-[12px] font-semibold text-[#444] transition-all">
                <span className="w-2 h-2 bg-[#E30613] rounded-full" />
                {config.label} View
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />
              </button>
              {showRoleSwitcher && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleSwitcher(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E5E5E5] py-2 z-50">
                    <div className="px-3 py-1.5 text-[9px] font-bold text-[#999] uppercase tracking-wider">Switch Role View</div>
                    {allRoles.map(r => (
                      <button key={r.value} onClick={() => switchRole(r.value)}
                        className={`w-full text-left px-3 py-2.5 text-[13px] font-medium transition-colors flex items-center gap-2.5 ${
                          currentRole === r.value ? 'bg-[#E30613]/[0.06] text-[#E30613] font-bold' : 'text-[#444] hover:bg-[#F5F5F5]'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${currentRole === r.value ? 'bg-[#E30613]' : 'bg-[#DDD]'}`} />
                        {r.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Clickable Profile */}
            <button onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 pl-2.5 pr-1 py-1 bg-[#F5F5F5] hover:bg-[#EBEBEB] rounded-2xl border border-[#E5E5E5] transition-all duration-200 cursor-pointer group">
              <div className="hidden sm:block text-right">
                <div className="text-[11px] font-bold text-[#1A1A1A] leading-tight group-hover:text-[#E30613] transition-colors">{config.userName}</div>
                <div className="text-[9px] text-[#999] font-medium">{config.userSub}</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-[#E30613] to-[#B0000D] rounded-xl flex items-center justify-center group-hover:shadow-md group-hover:shadow-red-600/20 transition-shadow">
                <span className="text-white font-bold text-[10px]">{config.initials}</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ PROFILE MODAL ═══════ */}
      {showProfile && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setShowProfile(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-white z-[70] shadow-2xl overflow-y-auto animate-slideInRight">
            {/* Profile Header */}
            <div className="sticky top-0 bg-gradient-to-br from-[#E30613] to-[#B0000D] p-6 pb-8 z-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-white/90">My Profile</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProfileMode(m => m === 'view' ? 'edit' : 'view')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
                  >
                    {profileMode === 'view' ? <><Pencil className="w-3.5 h-3.5" /> Edit Profile</> : <><Eye className="w-3.5 h-3.5" /> View Profile</>}
                  </button>
                  <button onClick={() => setShowProfile(false)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <span className="text-white font-extrabold text-[20px]">{config.initials}</span>
                </div>
                <div>
                  <div className="text-[20px] font-extrabold text-white">{config.userName}</div>
                  <div className="text-[12px] text-white/70 font-medium mt-0.5">{config.userSub}</div>
                  <div className="mt-1.5 px-2.5 py-0.5 bg-white/15 rounded-full inline-block">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{config.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Sections */}
            <div className="p-5 space-y-5 -mt-3">
              {profileMode === 'view' ? (
                profile.sections.map((section, si) => (
                  <div key={si} className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm">
                    <div className="px-5 py-3 bg-[#F5F5F5] border-b border-[#E5E5E5]">
                      <h3 className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-wider">{section.title}</h3>
                    </div>
                    <div className="divide-y divide-[#F5F5F5]">
                      {section.rows.map((row, ri) => {
                        const Icon = row.icon;
                        return (
                          <div key={ri} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F5F5F5]/50 transition-colors">
                            <div className="w-8 h-8 bg-[#E30613]/[0.06] rounded-lg flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-[#E30613]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-[#999] font-bold uppercase tracking-wider">{row.label}</div>
                              <div className="text-[13px] font-semibold text-[#1A1A1A] mt-0.5 truncate">{row.value}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {profile.sections.map((section, si) => (
                    <div key={si} className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm">
                      <div className="px-5 py-3 bg-[#F5F5F5] border-b border-[#E5E5E5]">
                        <h3 className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-wider">{section.title}</h3>
                      </div>
                      <div className="p-4 space-y-3.5">
                        {section.rows.map((row, ri) => {
                          const Icon = row.icon;
                          return (
                            <div key={ri} className="px-1 pb-3 last:pb-0">
                              <label className="flex items-center gap-1.5 text-[10px] text-[#999] font-bold uppercase tracking-wider mb-1.5">
                                <Icon className="w-3 h-3 text-[#E30613]" />
                                {row.label}
                              </label>
                              <input
                                type="text"
                                value={row.value}
                                onChange={e => updateProfileField(currentRole, si, ri, e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-[13px] font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#E30613]/50 focus:ring-2 focus:ring-[#E30613]/10 transition-all"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Save bar */}
                  <button
                    onClick={() => setProfileMode('view')}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#E30613] hover:bg-[#B0000D] rounded-xl text-white text-[13px] font-bold transition-all shadow-sm"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="flex items-center justify-center gap-2 py-3 bg-[#F5F5F5] hover:bg-[#EBEBEB] rounded-xl border border-[#E5E5E5] text-[11px] font-bold text-[#444] transition-all">
                  <Mail className="w-3.5 h-3.5" /> Contact Support
                </button>
                <button onClick={() => { setShowProfile(false); onBack(); }} className="flex items-center justify-center gap-2 py-3 bg-[#E30613]/[0.06] hover:bg-[#E30613]/10 rounded-xl border border-[#E30613]/15 text-[11px] font-bold text-[#E30613] transition-all">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>

              <div className="text-center pb-4">
                <p className="text-[10px] text-[#CCC] font-medium">CU Faculty Connect • Chandigarh University</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="pt-[64px] flex min-h-screen">
        {/* ═══════ SIDEBAR REMOVED — ONE PAGE LAYOUT ═══════ */}

        {/* ═══════ MAIN CONTENT ═══════ */}
        <main className="flex-1 p-4 lg:p-7">
          <div key={currentRole} className="animate-fadeSlideIn">
            {typeof children === 'function'
              ? (children as any)(currentRole, 'overview')
              : children
            }
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}
