import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
  isSupabaseConfigured,
  getMentorshipRequests,
  createMentorshipRequest,
  acceptMentorshipRequest,
  shareMeetingLinkSupabase,
  completeMentorshipRequest,
  submitSessionFeedbackSupabase,
  subscribeToMentorshipChanges,
} from '../services/supabase';

export type RequestStatus = 'pending' | 'assigned' | 'completed';
export type RequestType = 'session' | 'senior';
export type SessionMode = 'Online' | 'Offline';

// ── Shared Meeting Links ────────────────────────────────────────────────────
export interface SharedMeetingLink {
  facultyRequestId: string;
  studentRequestId?: string;
  link: string;
  sharedAt: Date;
}

// ── Session Feedback ─────────────────────────────────────────────────────────
export interface SessionFeedback {
  sessionId: string;       // links to FacultyIncomingRequest.id
  rating: number;          // 1–5
  comment: string;
  submittedAt: Date;
}

export interface CompletedSession {
  id: string;              // same as FacultyIncomingRequest.id
  completedAt: Date;
}

export interface MentorInfo {
  name: string;
  designation: string;
  availability: string;
  initials: string;
}

export interface MentorshipRequest {
  id: string;
  topic: string;
  type: RequestType;
  dateSubmitted: string;
  status: RequestStatus;
  mentor?: MentorInfo;
  sessionDate?: string;
  sessionTime?: string;
  mode?: SessionMode;
  // Student details (visible to faculty)
  studentName?: string;
  studentUID?: string;
  studentSection?: string;
  studentCourse?: string;
  studentSemester?: string;
  studentBatch?: string;
  studentCity?: string;
  studentHostel?: string;
  submittedAt?: string; // ISO timestamp for "X mins ago"
  concernPreview?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  requestId: string;
  createdAt: string;
}

const FACULTY_MENTOR: MentorInfo = {
  name: 'Dr. Sandeep Singh',
  designation: 'Associate Professor, CSE (AI & ML)',
  availability: 'Available: Mon–Fri, 2:00 PM – 4:00 PM',
  initials: 'SS',
};

const SENIOR_MENTOR: MentorInfo = {
  name: 'Rahul Sharma',
  designation: '4th Year, CSE (AI & ML)',
  availability: 'Available Today: 5:00 PM – 8:00 PM',
  initials: 'RS',
};

function fmtDate() {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export interface AddRequestOptions {
  sessionDate?: string;
  sessionTime?: string;
  mode?: SessionMode;
}

// ── Seed incoming requests visible on Faculty side ──────────────────────────
export interface FacultyIncomingRequest {
  id: string;
  studentName: string;
  studentInitials: string;
  studentUID: string;
  studentSection: string;
  studentCourse: string;
  studentSemester: string;
  studentBatch: string;
  studentCity: string;
  studentHostel: string;
  category: string;
  categoryKey: string;
  concern: string;
  submittedAt: Date;
  status: 'pending' | 'accepted' | 'completed';
  assignedMentorRequestId?: string; // links back to student's MentorshipRequest
  // Meeting scheduling fields
  preferredDate: string;      // e.g. "17 Jun 2025"
  preferredTime: string;      // e.g. "2:30 PM"
  meetingMode: 'Online' | 'Offline';
  meetingLocation: string;    // e.g. "Zoom" or "Block B1, Cabin 312"
  duration?: string;          // e.g. "30 min"
}

const SEED_REQUESTS: FacultyIncomingRequest[] = [
  {
    id: 'FR-000',
    studentName: 'Mannu Singh',
    studentInitials: 'MS',
    studentUID: '24BCE10099',
    studentSection: '25AML-304',
    studentCourse: 'B.E. CSE (AI & ML)',
    studentSemester: '1st',
    studentBatch: '2024–2028',
    studentCity: 'Indore, MP',
    studentHostel: 'Hostel (Boys Block-A)',
    category: 'Campus Life',
    categoryKey: 'campus',
    concern: 'Wanted guidance on joining coding clubs and balancing academics with extracurricular activities in first semester.',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'completed',
    assignedMentorRequestId: 'REQ-COMPLETED-DEMO',
    preferredDate: '14 Jun 2026',
    preferredTime: '3:00 PM',
    meetingMode: 'Online',
    meetingLocation: 'Google Meet',
    duration: '30 min',
  },
  {
    id: 'FR-001',
    studentName: 'Khushi Valecha',
    studentInitials: 'KV',
    studentUID: '24BCE10244',
    studentSection: '25AML-304',
    studentCourse: 'B.E. CSE (AI & ML)',
    studentSemester: '1st',
    studentBatch: '2024–2028',
    studentCity: 'Amritsar, Punjab',
    studentHostel: 'Hostel (Girls Block-C)',
    category: 'Hostel & Academics',
    categoryKey: 'hostel',
    concern: 'I am confused about my timetable and also having trouble adjusting to hostel life. Need guidance on how to balance both.',
    submittedAt: new Date(Date.now() - 10 * 60 * 1000),
    status: 'pending',
    preferredDate: '17 Jun 2026',
    preferredTime: '2:30 PM',
    meetingMode: 'Online',
    meetingLocation: 'Google Meet',
    duration: '30 min',
  },
  {
    id: 'FR-002',
    studentName: 'Aarav Sharma',
    studentInitials: 'AS',
    studentUID: '24BCE10312',
    studentSection: '25AML-301',
    studentCourse: 'B.E. CSE (AI & ML)',
    studentSemester: '1st',
    studentBatch: '2024–2028',
    studentCity: 'Delhi',
    studentHostel: 'Day Scholar',
    category: 'Placement Query',
    categoryKey: 'placement',
    concern: 'Want to understand how placements work in CU and what skills I should develop from semester 1 itself.',
    submittedAt: new Date(Date.now() - 65 * 60 * 1000),
    status: 'pending',
    preferredDate: '18 Jun 2026',
    preferredTime: '11:00 AM',
    meetingMode: 'Online',
    meetingLocation: 'Google Meet',
    duration: '45 min',
  },
  {
    id: 'FR-003',
    studentName: 'Priya Gupta',
    studentInitials: 'PG',
    studentUID: '24BCE10488',
    studentSection: '25AML-302',
    studentCourse: 'B.E. CSE (AI & ML)',
    studentSemester: '1st',
    studentBatch: '2024–2028',
    studentCity: 'Chandigarh',
    studentHostel: 'Day Scholar',
    category: 'Personal Guidance',
    categoryKey: 'personal',
    concern: 'Feeling overwhelmed in the first few weeks. Need someone to talk to about managing expectations and stress.',
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'pending',
    preferredDate: '19 Jun 2026',
    preferredTime: '3:00 PM',
    meetingMode: 'Online',
    meetingLocation: 'Google Meet',
    duration: '30 min',
  },
];

interface MentorshipContextValue {
  requests: MentorshipRequest[];
  notifications: AppNotification[];
  unreadCount: number;
  addRequest: (topic: string, type: RequestType, options?: AddRequestOptions) => string;
  markAllNotificationsRead: () => void;
  highlightRequestId: string | null;
  setHighlightRequestId: (id: string | null) => void;
  registerScrollToRequests: (fn: () => void) => void;
  scrollToMyRequests: (id?: string) => void;
  // Faculty side
  facultyIncoming: FacultyIncomingRequest[];
  acceptFacultyRequest: (requestId: string) => void;
  markSessionComplete: (requestId: string) => void;
  completedSessions: CompletedSession[];
  // Feedback (student only)
  sessionFeedbacks: SessionFeedback[];
  submitFeedback: (sessionId: string, rating: number, comment: string) => void;
  // Meeting links
  sharedMeetingLinks: SharedMeetingLink[];
  shareMeetingLink: (facultyRequestId: string, link: string) => void;
  getMeetingLink: (facultyRequestId: string) => string | null;
  // Demo helper
  seedDemoSessions: () => void;
}

const MentorshipContext = createContext<MentorshipContextValue>({
  requests: [],
  notifications: [],
  unreadCount: 0,
  addRequest: () => '',
  markAllNotificationsRead: () => {},
  highlightRequestId: null,
  setHighlightRequestId: () => {},
  registerScrollToRequests: () => {},
  scrollToMyRequests: () => {},
  facultyIncoming: SEED_REQUESTS,
  acceptFacultyRequest: () => {},
  markSessionComplete: () => {},
  completedSessions: [],
  sessionFeedbacks: [],
  submitFeedback: () => {},
  sharedMeetingLinks: [],
  shareMeetingLink: () => {},
  getMeetingLink: () => null,
  seedDemoSessions: () => {},
});

export function MentorshipProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<MentorshipRequest[]>([
    {
      id: 'REQ-COMPLETED-DEMO',
      topic: 'Campus Life',
      type: 'session',
      dateSubmitted: '14 Jun 2026',
      status: 'completed',
      mentor: FACULTY_MENTOR,
      sessionDate: '14 Jun 2026',
      sessionTime: '3:00 PM',
      mode: 'Offline',
      concernPreview: 'Guidance on joining coding clubs and balancing academics.',
    },
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [highlightRequestId, setHighlightRequestId] = useState<string | null>(null);
  const [facultyIncoming, setFacultyIncoming] = useState<FacultyIncomingRequest[]>(SEED_REQUESTS);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([
    { id: 'FR-000', completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  ]);
  const [sessionFeedbacks, setSessionFeedbacks] = useState<SessionFeedback[]>([]);
  const [sharedMeetingLinks, setSharedMeetingLinks] = useState<SharedMeetingLink[]>([]);
  const scrollFnRef = useRef<(() => void) | null>(null);

  // ── Sync with Supabase in Realtime when configured ────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadData = async () => {
      try {
        const dbReqs = await getMentorshipRequests();
        if (dbReqs && dbReqs.length > 0) {
          const mappedIncoming: FacultyIncomingRequest[] = dbReqs.map(r => ({
            id: r.id,
            studentName: r.student_profile?.full_name || 'Khushi Valecha',
            studentInitials: (r.student_profile?.full_name || 'KV').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            studentUID: r.student_profile?.uid_or_empid || '25AML10304',
            studentSection: r.student_profile?.section || '25AML-304',
            studentCourse: r.student_profile?.course || 'B.E. CSE (AI & ML)',
            studentSemester: String(r.student_profile?.semester || '1st'),
            studentBatch: String(r.student_profile?.batch || '2024–2028'),
            studentCity: 'Chandigarh',
            studentHostel: 'Hostel',
            category: r.category || 'Academics',
            categoryKey: r.category?.toLowerCase() || 'academic',
            concern: r.concern || r.topic,
            submittedAt: r.created_at ? new Date(r.created_at) : new Date(),
            status: r.status === 'completed' ? 'completed' : r.status === 'accepted' ? 'accepted' : 'pending',
            preferredDate: r.preferred_date || 'Tomorrow',
            preferredTime: r.preferred_time || '2:00 PM',
            meetingMode: r.mode || 'Online',
            meetingLocation: r.meeting_location || (r.mode === 'Offline' ? 'Block B1, Cabin 312' : 'Google Meet'),
            duration: r.duration || '30 min',
          }));
          setFacultyIncoming(mappedIncoming);

          const dbLinks: SharedMeetingLink[] = dbReqs
            .filter(r => r.meeting_link)
            .map(r => ({
              facultyRequestId: r.id,
              link: r.meeting_link!,
              sharedAt: new Date(r.created_at || Date.now()),
            }));
          if (dbLinks.length > 0) {
            setSharedMeetingLinks(dbLinks);
          }
        }
      } catch (err) {
        console.error('Supabase load error:', err);
      }
    };

    loadData();
    const unsubscribe = subscribeToMentorshipChanges(loadData);
    return () => unsubscribe();
  }, []);

  const addRequest = useCallback((topic: string, type: RequestType, options?: AddRequestOptions) => {
    const id = `REQ-${Date.now()}`;
    const newReq: MentorshipRequest = {
      id, topic, type,
      dateSubmitted: fmtDate(),
      status: 'pending',
      sessionDate: options?.sessionDate,
      sessionTime: options?.sessionTime,
      mode: options?.mode,
    };
    setRequests(prev => [newReq, ...prev]);

    // Also add to faculty incoming so the faculty dashboard sees it live
    setFacultyIncoming(prev => [{
      id: `FR-${Date.now()}`,
      studentName: 'You (Test)',
      studentInitials: 'YT',
      studentUID: '24BCE99999',
      studentSection: '25AML-304',
      studentCourse: 'B.E. CSE (AI & ML)',
      studentSemester: '1st',
      studentBatch: '2024–2028',
      studentCity: 'Chandigarh',
      studentHostel: 'Hostel',
      category: topic,
      categoryKey: type === 'session' ? 'academic' : 'personal',
      concern: topic,
      submittedAt: new Date(),
      status: 'pending',
      assignedMentorRequestId: id,
      preferredDate: options?.sessionDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      preferredTime: options?.sessionTime || '2:00 PM',
      meetingMode: options?.mode || 'Online',
      meetingLocation: options?.mode === 'Offline' ? 'Block B1, Cabin 312' : 'Google Meet',
      duration: '30 min',
    }, ...prev]);

    // If Supabase is configured, sync to database
    if (isSupabaseConfigured) {
      createMentorshipRequest({
        topic,
        category: type === 'session' ? 'Academics' : 'Peer Mentorship',
        mode: options?.mode || 'Online',
        preferredDate: options?.sessionDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        preferredTime: options?.sessionTime || '2:00 PM',
      });
    }

    // Simulate auto-assign after 6s (existing behaviour)
    setTimeout(() => {
      const assignedMentor = type === 'session' ? FACULTY_MENTOR : SENIOR_MENTOR;
      setRequests(prev => prev.map(r => r.id === id
        ? { ...r, status: 'assigned', mentor: assignedMentor }
        : r
      ));
      setNotifications(prev => [{
        id: `NOTIF-${Date.now()}`,
        title: type === 'session' ? 'Faculty Mentor Assigned' : 'Senior Mentor Assigned',
        body: `${assignedMentor.name} has been assigned to help with your query.`,
        read: false,
        requestId: id,
        createdAt: fmtDate(),
      }, ...prev]);
    }, 6000);

    return id;
  }, []);

  // Faculty manually accepts a request
  const acceptFacultyRequest = useCallback((reqId: string) => {
    if (isSupabaseConfigured) {
      acceptMentorshipRequest(reqId);
    }
    setFacultyIncoming(prev => prev.map(r =>
      r.id === reqId ? { ...r, status: 'accepted' } : r
    ));
    // If there's a linked student request, assign the faculty mentor immediately
    setFacultyIncoming(prev => {
      const req = prev.find(r => r.id === reqId);
      if (req?.assignedMentorRequestId) {
        setRequests(rqs => rqs.map(r =>
          r.id === req.assignedMentorRequestId
            ? { ...r, status: 'assigned', mentor: FACULTY_MENTOR }
            : r
        ));
        setNotifications(ns => [{
          id: `NOTIF-${Date.now()}`,
          title: 'Faculty Mentor Assigned',
          body: `${FACULTY_MENTOR.name} has accepted your request and is now your assigned mentor.`,
          read: false,
          requestId: req.assignedMentorRequestId,
          createdAt: fmtDate(),
        }, ...ns]);
      }
      return prev;
    });
  }, []);

  const markSessionComplete = useCallback((reqId: string) => {
    if (isSupabaseConfigured) {
      completeMentorshipRequest(reqId);
    }
    setFacultyIncoming(prev => prev.map(r =>
      r.id === reqId ? { ...r, status: 'completed' } : r
    ));
    setCompletedSessions(prev => [
      { id: reqId, completedAt: new Date() },
      ...prev.filter(s => s.id !== reqId),
    ]);
    // Notify linked student request
    setFacultyIncoming(prev => {
      const req = prev.find(r => r.id === reqId);
      if (req?.assignedMentorRequestId) {
        setRequests(rqs => rqs.map(r =>
          r.id === req.assignedMentorRequestId
            ? { ...r, status: 'completed' as any }
            : r
        ));
      }
      return prev;
    });
  }, []);

  const submitFeedback = useCallback((sessionId: string, rating: number, comment: string) => {
    if (isSupabaseConfigured) {
      submitSessionFeedbackSupabase({ requestId: sessionId, rating, comment });
    }
    // Store feedback under both student request id and faculty request id
    const facultyReq = facultyIncoming.find(r => r.assignedMentorRequestId === sessionId);
    const entries: SessionFeedback[] = [
      { sessionId, rating, comment, submittedAt: new Date() },
      ...(facultyReq ? [{ sessionId: facultyReq.id, rating, comment, submittedAt: new Date() }] : []),
    ];
    setSessionFeedbacks(prev => [
      ...entries,
      ...prev.filter(f => f.sessionId !== sessionId && (!facultyReq || f.sessionId !== facultyReq.id)),
    ]);
  }, [facultyIncoming]);

  const shareMeetingLink = useCallback((facultyRequestId: string, link: string) => {
    if (isSupabaseConfigured) {
      shareMeetingLinkSupabase(facultyRequestId, link);
    }
    const facultyReq = facultyIncoming.find(r => r.id === facultyRequestId);
    setSharedMeetingLinks(prev => [
      { facultyRequestId, studentRequestId: facultyReq?.assignedMentorRequestId, link, sharedAt: new Date() },
      ...prev.filter(l => l.facultyRequestId !== facultyRequestId),
    ]);
    // Push notification to student
    if (facultyReq?.assignedMentorRequestId) {
      setNotifications(ns => [{
        id: `NOTIF-${Date.now()}`,
        title: '🎥 Meeting Link Shared',
        body: `${FACULTY_MENTOR.name} has shared the meeting link. You can now join!`,
        read: false,
        requestId: facultyReq.assignedMentorRequestId!,
        createdAt: fmtDate(),
      }, ...ns]);
    }
  }, [facultyIncoming]);

  const getMeetingLink = useCallback((facultyRequestId: string): string | null => {
    return sharedMeetingLinks.find(l => l.facultyRequestId === facultyRequestId)?.link ?? null;
  }, [sharedMeetingLinks]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const registerScrollToRequests = useCallback((fn: () => void) => {
    scrollFnRef.current = fn;
  }, []);

  const scrollToMyRequests = useCallback((id?: string) => {
    if (id) setHighlightRequestId(id);
    scrollFnRef.current?.();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── DEMO: seed one request for each of the 4 example states ──────────────
  const seedDemoSessions = useCallback(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmtDateObj = (d: Date) =>
      d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const fmtTimeObj = (d: Date) => {
      let h = d.getHours();
      const m = d.getMinutes();
      const period = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${pad(m)} ${period}`;
    };

    // 1. Live now — started 5 min ago, duration 30 min → still in progress
    const liveStart = new Date(now.getTime() - 5 * 60000);
    // 2. Ready to join — starts in 4 min (within the 10-min early-access window)
    const readyStart = new Date(now.getTime() + 4 * 60000);
    // 3. Confirmed / locked — starts in 72 hours
    const confirmedStart = new Date(now.getTime() + 72 * 60 * 60000);

    const demoRequests: MentorshipRequest[] = [
      {
        id: 'DEMO-LIVE',
        topic: 'Academics',
        type: 'session',
        dateSubmitted: fmtDateObj(now),
        status: 'assigned',
        mentor: FACULTY_MENTOR,
        sessionDate: fmtDateObj(liveStart),
        sessionTime: fmtTimeObj(liveStart),
        mode: 'Offline',
      },
      {
        id: 'DEMO-READY',
        topic: 'Career Guidance',
        type: 'session',
        dateSubmitted: fmtDateObj(now),
        status: 'assigned',
        mentor: FACULTY_MENTOR,
        sessionDate: fmtDateObj(readyStart),
        sessionTime: fmtTimeObj(readyStart),
        mode: 'Online',
      },
      {
        id: 'DEMO-CONFIRMED',
        topic: 'Project Mentorship',
        type: 'session',
        dateSubmitted: fmtDateObj(now),
        status: 'assigned',
        mentor: FACULTY_MENTOR,
        sessionDate: fmtDateObj(confirmedStart),
        sessionTime: fmtTimeObj(confirmedStart),
        mode: 'Offline',
      },
      {
        id: 'DEMO-AWAITING',
        topic: 'Hostel Concern',
        type: 'session',
        dateSubmitted: fmtDateObj(now),
        status: 'pending',
      },
    ];

    setRequests(prev => [...demoRequests, ...prev.filter(r => !r.id.startsWith('DEMO-'))]);
  }, []);

  return (
    <MentorshipContext.Provider value={{
      requests, notifications, unreadCount, addRequest,
      markAllNotificationsRead, highlightRequestId, setHighlightRequestId,
      registerScrollToRequests, scrollToMyRequests,
      facultyIncoming, acceptFacultyRequest,
      markSessionComplete, completedSessions,
      sessionFeedbacks, submitFeedback,
      sharedMeetingLinks, shareMeetingLink, getMeetingLink,
      seedDemoSessions,
    }}>
      {children}
    </MentorshipContext.Provider>
  );
}

export function useMentorship() {
  return useContext(MentorshipContext);
}
