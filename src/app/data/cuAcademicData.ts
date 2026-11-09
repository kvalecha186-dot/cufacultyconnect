/* ═══════════════════════════════════════════════════════════════
   CU FACULTY CONNECT — Chandigarh University Academic Data Module
   Blocks, Course Codes, Sections, and Academic Hierarchy
   ═══════════════════════════════════════════════════════════════ */

/* ─── BLOCK STRUCTURE ─── */
export const CU_BLOCKS: Record<string, { name: string; departments: string[] }> = {
  A1: { name: 'Block A1', departments: ['Pharmacy (B.Pharm, M.Pharm)', 'Arts & Humanities'] },
  A2: { name: 'Block A2', departments: ['Arts', 'Liberal Arts', 'Psychology', 'English', 'Social Sciences'] },
  A3: { name: 'Block A3', departments: ['Pharmacy', 'Humanities', 'Allied Health Sciences'] },
  B1: { name: 'Block B1', departments: ['CSE (Core)', 'CSE (AI & ML)', 'CSE (Data Science)'] },
  B2: { name: 'Block B2', departments: ['CSE (IT)', 'CSE (Software Engineering)', 'Information Technology'] },
  B3: { name: 'Block B3', departments: ['CSE (AI)', 'CSE (Cyber Security)', 'CSE (IoT)'] },
  C1: { name: 'Block C1', departments: ['BCA', 'MCA', 'Computing Programs'] },
  C2: { name: 'Block C2', departments: ['CSE (AI/ML)', 'Computer Applications'] },
  C3: { name: 'Block C3', departments: ['Advanced Computing Labs'] },
  D1: { name: 'Block D1', departments: ['BBA', 'Business Studies'] },
  D2: { name: 'Block D2', departments: ['MBA', 'Management & Commerce'] },
  D3: { name: 'Block D3', departments: ['MBA (Finance)', 'Business Analytics'] },
  D4: { name: 'Block D4', departments: ['Management Classrooms & Seminar Halls'] },
  D5: { name: 'Block D5', departments: ['Management Academic Spaces'] },
  D6: { name: 'Block D6', departments: ['MBA Corporate Studies', 'Placement Activities'] },
  D7: { name: 'Block D7', departments: ['Management Conferences', 'Academic Events'] },
};

/* ─── COURSE CODE MAPPING ─── */
export interface CourseInfo {
  code: string;
  name: string;
  fullName: string;
  block: string;
  department: string;
}

export const CU_COURSES: Record<string, CourseInfo> = {
  BCS: { code: 'BCS', name: 'B.E. CSE (Core)', fullName: 'B.E. Computer Science Engineering', block: 'B1', department: 'Computer Science Engineering' },
  AML: { code: 'AML', name: 'B.E. CSE (AI & ML)', fullName: 'B.E. Computer Science Engineering (Artificial Intelligence & Machine Learning)', block: 'B1', department: 'Computer Science Engineering' },
  ADS: { code: 'ADS', name: 'B.E. CSE (Data Science)', fullName: 'B.E. Computer Science Engineering (Data Science)', block: 'B1', department: 'Computer Science Engineering' },
  CCS: { code: 'CCS', name: 'B.E. CSE (Cyber Security)', fullName: 'B.E. Computer Science Engineering (Cyber Security)', block: 'B3', department: 'Computer Science Engineering' },
  CAI: { code: 'CAI', name: 'B.E. CSE (AI)', fullName: 'B.E. Computer Science Engineering (Artificial Intelligence)', block: 'B3', department: 'Computer Science Engineering' },
  IOT: { code: 'IOT', name: 'B.E. CSE (IoT)', fullName: 'B.E. Computer Science Engineering (Internet of Things)', block: 'B3', department: 'Computer Science Engineering' },
  AIM: { code: 'AIM', name: 'B.E. AI & ML', fullName: 'B.E. Artificial Intelligence & Machine Learning', block: 'B1', department: 'AI & Machine Learning' },
  BIT: { code: 'BIT', name: 'B.E. IT', fullName: 'B.E. Information Technology', block: 'B2', department: 'Information Technology' },
  BEC: { code: 'BEC', name: 'B.E. ECE', fullName: 'B.E. Electronics & Communication Engineering', block: 'B2', department: 'Electronics & Communication' },
  BME: { code: 'BME', name: 'B.E. Mechanical', fullName: 'B.E. Mechanical Engineering', block: 'B2', department: 'Mechanical Engineering' },
  BCE: { code: 'BCE', name: 'B.E. Civil', fullName: 'B.E. Civil Engineering', block: 'B2', department: 'Civil Engineering' },
  BAE: { code: 'BAE', name: 'B.E. Aerospace', fullName: 'B.E. Aerospace Engineering', block: 'B2', department: 'Aerospace Engineering' },
  BAU: { code: 'BAU', name: 'B.E. Automobile', fullName: 'B.E. Automobile Engineering', block: 'B2', department: 'Automobile Engineering' },
  BTE: { code: 'BTE', name: 'B.E. Biotech', fullName: 'B.E. Biotechnology Engineering', block: 'B2', department: 'Biotechnology' },
  BCA: { code: 'BCA', name: 'BCA', fullName: 'Bachelor of Computer Applications', block: 'C1', department: 'Computer Applications' },
  MCA: { code: 'MCA', name: 'MCA', fullName: 'Master of Computer Applications', block: 'C1', department: 'Computer Applications' },
  BBA: { code: 'BBA', name: 'BBA', fullName: 'Bachelor of Business Administration', block: 'D1', department: 'Business Administration' },
  MBA: { code: 'MBA', name: 'MBA', fullName: 'Master of Business Administration', block: 'D2', department: 'Business Administration' },
  BCM: { code: 'BCM', name: 'B.Com', fullName: 'Bachelor of Commerce', block: 'D2', department: 'Commerce' },
  BAL: { code: 'BAL', name: 'BA LLB', fullName: 'BA LLB (Integrated)', block: 'A2', department: 'Law' },
  BCL: { code: 'BCL', name: 'B.Com LLB', fullName: 'B.Com LLB (Integrated)', block: 'A2', department: 'Law' },
  BPH: { code: 'BPH', name: 'B.Pharm', fullName: 'Bachelor of Pharmacy', block: 'A1', department: 'Pharmacy' },
};

/* ─── USER PROFILES ─── */
export interface StudentProfile {
  name: string;
  uid: string;
  course: string;
  courseCode: string;
  section: string;
  block: string;
  semester: number;
  batch: number;
  mentor: string;
  initials: string;
}

export interface FacultyProfile {
  name: string;
  empId: string;
  department: string;
  assignedSections: string[];
  block: string;
  designation: string;
  initials: string;
}

export interface SeniorProfile {
  name: string;
  uid: string;
  course: string;
  courseCode: string;
  section: string;
  block: string;
  semester: number;
  assignedSections: string[];
  initials: string;
}

export interface HODProfile {
  name: string;
  empId: string;
  department: string;
  departmentCode: string;
  blocks: string[];
  initials: string;
}

export interface DirectorProfile {
  name: string;
  empId: string;
  designation: string;
  initials: string;
}

/* ─── CURRENT LOGGED-IN USER DATA ─── */
export const CURRENT_STUDENT: StudentProfile = {
  name: 'Khushi Valecha',
  uid: '25AML10304',
  course: 'B.E. CSE (AI & ML)',
  courseCode: 'AML',
  section: '25AML-304',
  block: 'B1',
  semester: 1,
  batch: 2025,
  mentor: 'Dr. Sandeep Singh',
  initials: 'KV',
};

export const CURRENT_FACULTY: FacultyProfile = {
  name: 'Dr. Sandeep Singh',
  empId: 'CU-FAC-08421',
  department: 'Computer Science Engineering',
  assignedSections: ['25AML-301', '25AML-302', '25AML-303', '25BCS-201', '25BCS-202'],
  block: 'B1',
  designation: 'Associate Professor',
  initials: 'SS',
};

export const CURRENT_SENIOR: SeniorProfile = {
  name: 'Ananya Kapoor',
  uid: '23AML12045',
  course: 'B.E. CSE (AI & ML)',
  courseCode: 'AML',
  section: '23AML-301',
  block: 'B1',
  semester: 5,
  assignedSections: ['25AML-101', '25AML-102'],
  initials: 'AK',
};

export const CURRENT_HOD: HODProfile = {
  name: 'Dr. Amrit Pal Singh',
  empId: 'CU-HOD-00112',
  department: 'Artificial Intelligence & Machine Learning',
  departmentCode: 'AML',
  blocks: ['B1', 'B2'],
  initials: 'AP',
};

export const CURRENT_DIRECTOR: DirectorProfile = {
  name: 'Dr. Rajiv Gupta',
  empId: 'CU-DIR-00001',
  designation: 'Director, Chandigarh University',
  initials: 'RG',
};

/* ─── STUDENT MOCK DATA (Section-aware) ─── */
export const SECTION_STUDENTS: StudentProfile[] = [
  { name: 'Khushi Valecha', uid: '25AML10304', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-304', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'KV' },
  { name: 'Aryan Sharma', uid: '25AML10244', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-301', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'AS' },
  { name: 'Priya Mehta', uid: '25AML11034', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-302', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'PM' },
  { name: 'Rohit Singh', uid: '25AML12890', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-301', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'RS' },
  { name: 'Neha Gupta', uid: '25AML13456', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-303', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'NG' },
  { name: 'Karan Verma', uid: '25BCS14021', course: 'B.E. CSE (Core)', courseCode: 'BCS', section: '25BCS-201', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'KVe' },
  { name: 'Simran Kaur', uid: '25AML14522', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-302', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'SK' },
  { name: 'Aditya Raj', uid: '25BCS15033', course: 'B.E. CSE (Core)', courseCode: 'BCS', section: '25BCS-202', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'AR' },
  { name: 'Divya Nair', uid: '25AML15544', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-303', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'DN' },
  { name: 'Manish Tiwari', uid: '25BCS16055', course: 'B.E. CSE (Core)', courseCode: 'BCS', section: '25BCS-201', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'MT' },
  { name: 'Ritu Sharma', uid: '25AML16566', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-301', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'RSh' },
  { name: 'Amit Kumar', uid: '25AML10101', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-101', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'AK' },
  { name: 'Deepa Iyer', uid: '25AML10633', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-102', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'DI' },
  { name: 'Vikram Singh', uid: '25AML10520', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-101', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'VS' },
  { name: 'Kavita Shah', uid: '25AML10851', course: 'B.E. CSE (AI & ML)', courseCode: 'AML', section: '25AML-102', block: 'B1', semester: 1, batch: 2025, mentor: 'Dr. Sandeep Singh', initials: 'KSh' },
];

/* ─── ENGAGEMENT STATUS CALCULATOR ─── */
export type EngagementLevel = 'Active' | 'Needs Attention' | 'Requires Support';

export interface StudentEngagement {
  student: StudentProfile;
  attendance: number;
  milestones: number;
  doubtsSubmitted: number;
  sessionsAttended: number;
  resourcesAccessed: number;
  profileComplete: boolean;
  lastActive: string;
  level: EngagementLevel;
}

export function getEngagementLevel(att: number, milestones: number, sessions: number): EngagementLevel {
  if (att >= 85 && milestones >= 3 && sessions >= 3) return 'Active';
  if (att >= 70 || milestones >= 2) return 'Needs Attention';
  return 'Requires Support';
}

export const STUDENT_ENGAGEMENTS: StudentEngagement[] = [
  { student: SECTION_STUDENTS[0], attendance: 92, milestones: 4, doubtsSubmitted: 3, sessionsAttended: 5, resourcesAccessed: 18, profileComplete: true, lastActive: '30m ago', level: 'Active' },
  { student: SECTION_STUDENTS[1], attendance: 94, milestones: 4, doubtsSubmitted: 3, sessionsAttended: 5, resourcesAccessed: 22, profileComplete: true, lastActive: '2h ago', level: 'Active' },
  { student: SECTION_STUDENTS[2], attendance: 72, milestones: 2, doubtsSubmitted: 7, sessionsAttended: 2, resourcesAccessed: 8, profileComplete: true, lastActive: '1d ago', level: 'Needs Attention' },
  { student: SECTION_STUDENTS[3], attendance: 88, milestones: 3, doubtsSubmitted: 2, sessionsAttended: 4, resourcesAccessed: 15, profileComplete: true, lastActive: '5h ago', level: 'Active' },
  { student: SECTION_STUDENTS[4], attendance: 58, milestones: 1, doubtsSubmitted: 12, sessionsAttended: 1, resourcesAccessed: 3, profileComplete: false, lastActive: '5d ago', level: 'Requires Support' },
  { student: SECTION_STUDENTS[5], attendance: 91, milestones: 5, doubtsSubmitted: 1, sessionsAttended: 6, resourcesAccessed: 25, profileComplete: true, lastActive: '1h ago', level: 'Active' },
  { student: SECTION_STUDENTS[6], attendance: 76, milestones: 2, doubtsSubmitted: 5, sessionsAttended: 2, resourcesAccessed: 10, profileComplete: true, lastActive: '3d ago', level: 'Needs Attention' },
  { student: SECTION_STUDENTS[7], attendance: 96, milestones: 4, doubtsSubmitted: 0, sessionsAttended: 7, resourcesAccessed: 30, profileComplete: true, lastActive: '20m ago', level: 'Active' },
  { student: SECTION_STUDENTS[8], attendance: 52, milestones: 1, doubtsSubmitted: 9, sessionsAttended: 0, resourcesAccessed: 2, profileComplete: false, lastActive: '8d ago', level: 'Requires Support' },
  { student: SECTION_STUDENTS[9], attendance: 85, milestones: 3, doubtsSubmitted: 4, sessionsAttended: 3, resourcesAccessed: 14, profileComplete: true, lastActive: '6h ago', level: 'Active' },
  { student: SECTION_STUDENTS[10], attendance: 78, milestones: 2, doubtsSubmitted: 6, sessionsAttended: 2, resourcesAccessed: 9, profileComplete: true, lastActive: '2d ago', level: 'Needs Attention' },
  { student: SECTION_STUDENTS[11], attendance: 90, milestones: 3, doubtsSubmitted: 2, sessionsAttended: 4, resourcesAccessed: 16, profileComplete: true, lastActive: '1h ago', level: 'Active' },
  { student: SECTION_STUDENTS[12], attendance: 68, milestones: 2, doubtsSubmitted: 4, sessionsAttended: 2, resourcesAccessed: 7, profileComplete: false, lastActive: '4d ago', level: 'Needs Attention' },
  { student: SECTION_STUDENTS[13], attendance: 93, milestones: 4, doubtsSubmitted: 1, sessionsAttended: 5, resourcesAccessed: 20, profileComplete: true, lastActive: '2h ago', level: 'Active' },
  { student: SECTION_STUDENTS[14], attendance: 80, milestones: 3, doubtsSubmitted: 3, sessionsAttended: 3, resourcesAccessed: 12, profileComplete: true, lastActive: '4h ago', level: 'Active' },
];

/* ─── DEPARTMENT-LEVEL STATS (for HOD/Director) ─── */
export interface DepartmentStats {
  name: string;
  code: string;
  blocks: string[];
  totalStudents: number;
  totalSections: number;
  facultyAssigned: number;
  seniorMentors: number;
  hodsAssigned: number;
  sessionsConducted: number;
  avgAttendance: number;
  satisfaction: number;
  engagement: number;
  doubtsResolved: number;
}

export const DEPARTMENT_STATS: DepartmentStats[] = [
  { name: 'CSE (AI & ML)', code: 'AML', blocks: ['B1'], totalStudents: 1200, totalSections: 12, facultyAssigned: 16, seniorMentors: 36, hodsAssigned: 1, sessionsConducted: 342, avgAttendance: 86, satisfaction: 94, engagement: 89, doubtsResolved: 1842 },
  { name: 'CSE (Core)', code: 'BCS', blocks: ['B1', 'B2'], totalStudents: 1800, totalSections: 18, facultyAssigned: 24, seniorMentors: 48, hodsAssigned: 1, sessionsConducted: 512, avgAttendance: 84, satisfaction: 92, engagement: 87, doubtsResolved: 2456 },
  { name: 'CSE (Data Science)', code: 'ADS', blocks: ['B1'], totalStudents: 600, totalSections: 6, facultyAssigned: 8, seniorMentors: 18, hodsAssigned: 1, sessionsConducted: 168, avgAttendance: 88, satisfaction: 93, engagement: 91, doubtsResolved: 834 },
  { name: 'CSE (Cyber Security)', code: 'CCS', blocks: ['B3'], totalStudents: 450, totalSections: 5, facultyAssigned: 6, seniorMentors: 12, hodsAssigned: 1, sessionsConducted: 124, avgAttendance: 82, satisfaction: 90, engagement: 85, doubtsResolved: 623 },
  { name: 'Information Technology', code: 'BIT', blocks: ['B2'], totalStudents: 900, totalSections: 9, facultyAssigned: 12, seniorMentors: 24, hodsAssigned: 1, sessionsConducted: 256, avgAttendance: 83, satisfaction: 91, engagement: 86, doubtsResolved: 1245 },
  { name: 'BCA', code: 'BCA', blocks: ['C1'], totalStudents: 800, totalSections: 8, facultyAssigned: 10, seniorMentors: 20, hodsAssigned: 1, sessionsConducted: 198, avgAttendance: 80, satisfaction: 89, engagement: 83, doubtsResolved: 978 },
  { name: 'MBA', code: 'MBA', blocks: ['D2', 'D3'], totalStudents: 600, totalSections: 6, facultyAssigned: 8, seniorMentors: 14, hodsAssigned: 1, sessionsConducted: 156, avgAttendance: 85, satisfaction: 91, engagement: 88, doubtsResolved: 534 },
  { name: 'BBA', code: 'BBA', blocks: ['D1'], totalStudents: 500, totalSections: 5, facultyAssigned: 7, seniorMentors: 12, hodsAssigned: 1, sessionsConducted: 132, avgAttendance: 81, satisfaction: 88, engagement: 82, doubtsResolved: 423 },
  { name: 'Pharmacy', code: 'BPH', blocks: ['A1', 'A3'], totalStudents: 400, totalSections: 4, facultyAssigned: 6, seniorMentors: 10, hodsAssigned: 1, sessionsConducted: 98, avgAttendance: 87, satisfaction: 90, engagement: 84, doubtsResolved: 312 },
  { name: 'ECE', code: 'BEC', blocks: ['B2'], totalStudents: 700, totalSections: 7, facultyAssigned: 10, seniorMentors: 18, hodsAssigned: 1, sessionsConducted: 210, avgAttendance: 82, satisfaction: 89, engagement: 84, doubtsResolved: 890 },
];

/* ─── SECTION GENERATOR HELPER ─── */
export function parseSectionCode(section: string): { batch: number; courseCode: string; sectionNum: number } | null {
  const match = section.match(/^(\d{2})([A-Z]{2,3})-(\d{3})$/);
  if (!match) return null;
  return { batch: 2000 + parseInt(match[1]), courseCode: match[2], sectionNum: parseInt(match[3]) };
}

export function getBlockForCourse(courseCode: string): string {
  return CU_COURSES[courseCode]?.block || 'B1';
}

export function getCourseFullName(courseCode: string): string {
  return CU_COURSES[courseCode]?.fullName || courseCode;
}
