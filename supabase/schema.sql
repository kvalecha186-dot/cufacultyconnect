-- ═════════════════════════════════════════════════════════════════════════════
-- CU FACULTY CONNECT — FULL DATABASE SCHEMA & MIGRATION (SUPABASE POSTGRESQL)
-- Run this script in your Supabase Project -> SQL Editor -> Click Run
-- ═════════════════════════════════════════════════════════════════════════════

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Unified identity for Students, Faculty, Seniors, HOD, Director)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'senior', 'hod', 'director')),
    uid_or_empid TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL DEFAULT 'Computer Science Engineering',
    course TEXT DEFAULT 'B.E. CSE (AI & ML)',
    section TEXT DEFAULT '25AML-304',
    block TEXT DEFAULT 'B1',
    semester INT DEFAULT 1,
    batch INT DEFAULT 2025,
    attendance INT DEFAULT 85,
    designation TEXT DEFAULT 'Student',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Mentorship Requests Table (Core scheduling & interaction engine)
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Academics',
    concern TEXT,
    mode TEXT NOT NULL DEFAULT 'Online' CHECK (mode IN ('Online', 'Offline')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'accepted', 'completed', 'cancelled')),
    preferred_date DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '1 day',
    preferred_time TEXT NOT NULL DEFAULT '02:00 PM',
    duration TEXT DEFAULT '30 min',
    meeting_link TEXT,
    meeting_location TEXT DEFAULT 'Google Meet',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Session Feedback Table (Ratings & Reviews)
CREATE TABLE IF NOT EXISTS public.session_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Notifications Table (Real-time live alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Peer Discussion Forum (Senior Buddy program)
CREATE TABLE IF NOT EXISTS public.discussion_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for app operations with anon key
DROP POLICY IF EXISTS "Allow anon read profiles" ON public.profiles;
CREATE POLICY "Allow anon read profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow anon all requests" ON public.mentorship_requests;
CREATE POLICY "Allow anon all requests" ON public.mentorship_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow anon all feedback" ON public.session_feedback;
CREATE POLICY "Allow anon all feedback" ON public.session_feedback FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow anon all notifications" ON public.notifications;
CREATE POLICY "Allow anon all notifications" ON public.notifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow anon all discussions" ON public.discussion_posts;
CREATE POLICY "Allow anon all discussions" ON public.discussion_posts FOR ALL USING (true);

-- ═════════════════════════════════════════════════════════════════════════════
-- REALTIME SUBSCRIPTIONS SETUP
-- ═════════════════════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'mentorship_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mentorship_requests;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

-- ═════════════════════════════════════════════════════════════════════════════
-- SEED INITIAL MOCK USERS & PROFILES (Chandigarh University Default Personas)
-- ═════════════════════════════════════════════════════════════════════════════
INSERT INTO public.profiles (email, full_name, role, uid_or_empid, department, course, section, block, semester, batch, attendance, designation)
VALUES
    ('25aml10304@cuchd.in', 'Khushi Valecha', 'student', '25AML10304', 'Computer Science Engineering', 'B.E. CSE (AI & ML)', '25AML-304', 'B1', 1, 2025, 92, 'Student'),
    ('sandeep.singh@cuchd.in', 'Dr. Sandeep Singh', 'faculty', 'CU-FAC-08421', 'Computer Science Engineering', 'B.E. CSE (AI & ML)', '25AML-301', 'B1', 1, 2024, 98, 'Associate Professor'),
    ('23aml12045@cuchd.in', 'Ananya Kapoor', 'senior', '23AML12045', 'Computer Science Engineering', 'B.E. CSE (AI & ML)', '23AML-301', 'B1', 5, 2023, 90, 'Senior Peer Mentor'),
    ('amritpal.singh@cuchd.in', 'Dr. Amrit Pal Singh', 'hod', 'CU-HOD-00112', 'Artificial Intelligence & Machine Learning', 'B.E. CSE (AI & ML)', 'AML', 'B1', 1, 2020, 100, 'Head of Department'),
    ('rajiv.gupta@cuchd.in', 'Dr. Rajiv Gupta', 'director', 'CU-DIR-00001', 'University Administration', 'All Programs', 'All Sections', 'A1-D7', 1, 2015, 100, 'University Director')
ON CONFLICT (uid_or_empid) DO NOTHING;
