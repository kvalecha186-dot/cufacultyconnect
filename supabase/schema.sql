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

-- Authenticated identity and role-scoped row-level security.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.current_cu_profile_id()
returns uuid language sql stable security definer set search_path = ''
as $$ select p.id from public.profiles p where lower(p.email) = lower((select auth.jwt() ->> 'email')) limit 1 $$;
create or replace function private.current_cu_role()
returns text language sql stable security definer set search_path = ''
as $$ select p.role from public.profiles p where lower(p.email) = lower((select auth.jwt() ->> 'email')) limit 1 $$;
revoke all on function private.current_cu_profile_id() from public, anon;
revoke all on function private.current_cu_role() from public, anon;
grant execute on function private.current_cu_profile_id() to authenticated;
grant execute on function private.current_cu_role() to authenticated;

alter table public.profiles enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.session_feedback enable row level security;
alter table public.notifications enable row level security;
alter table public.discussion_posts enable row level security;

drop policy if exists "Allow anon read profiles" on public.profiles;
drop policy if exists "Allow anon all requests" on public.mentorship_requests;
drop policy if exists "Allow anon all feedback" on public.session_feedback;
drop policy if exists "Allow anon all notifications" on public.notifications;
drop policy if exists "Allow anon all discussions" on public.discussion_posts;
drop policy if exists "Allow all profiles" on public.profiles;
drop policy if exists "Allow all requests" on public.mentorship_requests;
drop policy if exists "Allow all feedback" on public.session_feedback;

create policy "profiles_read_scoped" on public.profiles for select to authenticated
using (
  id = (select private.current_cu_profile_id())
  or role in ('faculty','senior')
  or (role = 'student' and (select private.current_cu_role()) in ('faculty','senior','hod','director'))
  or (select private.current_cu_role()) in ('hod','director')
);
create policy "profiles_update_own" on public.profiles for update to authenticated
using (id = (select private.current_cu_profile_id()))
with check (id = (select private.current_cu_profile_id()) and role = (select private.current_cu_role()));
revoke update on public.profiles from anon, authenticated;
grant update (full_name, department, course, section, block, semester, batch, avatar_url) on public.profiles to authenticated;

create policy "requests_read_participants" on public.mentorship_requests for select to authenticated
using (
  student_id = (select private.current_cu_profile_id())
  or mentor_id = (select private.current_cu_profile_id())
  or (mentor_id is null and (select private.current_cu_role()) in ('faculty','senior'))
  or (select private.current_cu_role()) in ('hod','director')
);
create policy "requests_insert_as_student" on public.mentorship_requests for insert to authenticated
with check (student_id = (select private.current_cu_profile_id()) and mentor_id is null and status = 'pending' and (select private.current_cu_role()) = 'student');
create policy "requests_update_by_mentor_or_admin" on public.mentorship_requests for update to authenticated
using (
  mentor_id = (select private.current_cu_profile_id())
  or (mentor_id is null and (select private.current_cu_role()) in ('faculty','senior'))
  or (select private.current_cu_role()) in ('hod','director')
)
with check (
  (mentor_id = (select private.current_cu_profile_id()) and (select private.current_cu_role()) in ('faculty','senior'))
  or (select private.current_cu_role()) in ('hod','director')
);
revoke update on public.mentorship_requests from anon, authenticated;
grant update (mentor_id, status, meeting_link, meeting_location, updated_at) on public.mentorship_requests to authenticated;

create policy "feedback_read_participants" on public.session_feedback for select to authenticated
using (student_id = (select private.current_cu_profile_id()) or mentor_id = (select private.current_cu_profile_id()) or (select private.current_cu_role()) in ('hod','director'));
create policy "feedback_insert_after_completed_session" on public.session_feedback for insert to authenticated
with check (
  student_id = (select private.current_cu_profile_id())
  and exists (select 1 from public.mentorship_requests r where r.id = request_id and r.student_id = (select private.current_cu_profile_id()) and r.status = 'completed')
);

create policy "notifications_read_own" on public.notifications for select to authenticated
using (user_id = (select private.current_cu_profile_id()));
create policy "notifications_mark_own_read" on public.notifications for update to authenticated
using (user_id = (select private.current_cu_profile_id()))
with check (user_id = (select private.current_cu_profile_id()) and read = true);
revoke update on public.notifications from anon, authenticated;
grant update (read) on public.notifications to authenticated;

create policy "discussion_read_authenticated" on public.discussion_posts for select to authenticated using (true);
create policy "discussion_insert_own" on public.discussion_posts for insert to authenticated
with check (author_id = (select private.current_cu_profile_id()));
create policy "discussion_update_own" on public.discussion_posts for update to authenticated
using (author_id = (select private.current_cu_profile_id())) with check (author_id = (select private.current_cu_profile_id()));
create policy "discussion_delete_own" on public.discussion_posts for delete to authenticated
using (author_id = (select private.current_cu_profile_id()));

revoke all on public.profiles, public.mentorship_requests, public.session_feedback, public.notifications, public.discussion_posts from anon;
revoke select on public.profiles from authenticated;
grant select (id, email, full_name, role, uid_or_empid, department, course, section, block, semester, batch, designation, avatar_url, created_at, updated_at) on public.profiles to authenticated;
grant select on public.mentorship_requests, public.session_feedback, public.notifications, public.discussion_posts to authenticated;
grant insert on public.mentorship_requests, public.session_feedback, public.discussion_posts to authenticated;
grant delete on public.discussion_posts to authenticated;

create index if not exists mentorship_requests_student_id_idx on public.mentorship_requests(student_id);
create index if not exists mentorship_requests_mentor_id_idx on public.mentorship_requests(mentor_id);
create index if not exists session_feedback_request_id_idx on public.session_feedback(request_id);
create index if not exists session_feedback_student_id_idx on public.session_feedback(student_id);
create index if not exists session_feedback_mentor_id_idx on public.session_feedback(mentor_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_request_id_idx on public.notifications(request_id);
create index if not exists discussion_posts_author_id_idx on public.discussion_posts(author_id);

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
