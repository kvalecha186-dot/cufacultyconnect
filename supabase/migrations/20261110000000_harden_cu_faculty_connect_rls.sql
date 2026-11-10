-- Harden CU Faculty Connect before real users are onboarded.
-- Identity is resolved from the verified Supabase Auth JWT email; profile roles
-- are never accepted from browser-supplied values.
create or replace function public.current_cu_profile_id()
returns uuid language sql stable security definer set search_path = ''
as $$ select p.id from public.profiles p where lower(p.email) = lower((select auth.jwt() ->> 'email')) limit 1 $$;

create or replace function public.current_cu_role()
returns text language sql stable security definer set search_path = ''
as $$ select p.role from public.profiles p where lower(p.email) = lower((select auth.jwt() ->> 'email')) limit 1 $$;

revoke all on function public.current_cu_profile_id() from public;
revoke all on function public.current_cu_role() from public;
grant execute on function public.current_cu_profile_id() to authenticated;
grant execute on function public.current_cu_role() to authenticated;

alter table public.profiles enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.session_feedback enable row level security;
alter table public.notifications enable row level security;
alter table public.discussion_posts enable row level security;

drop policy if exists "Allow all profiles" on public.profiles;
drop policy if exists "Allow anon read profiles" on public.profiles;
drop policy if exists "Allow all requests" on public.mentorship_requests;
drop policy if exists "Allow anon all requests" on public.mentorship_requests;
drop policy if exists "Allow all feedback" on public.session_feedback;
drop policy if exists "Allow anon all feedback" on public.session_feedback;
drop policy if exists "Allow anon all notifications" on public.notifications;
drop policy if exists "Allow anon all discussions" on public.discussion_posts;

create policy "profiles_read_scoped" on public.profiles for select to authenticated
using (id = (select public.current_cu_profile_id()) or role in ('faculty','senior') or (select public.current_cu_role()) in ('hod','director'));

create policy "profiles_update_own" on public.profiles for update to authenticated
using (id = (select public.current_cu_profile_id()))
with check (id = (select public.current_cu_profile_id()) and role = (select public.current_cu_role()));
revoke update on public.profiles from anon, authenticated;
grant update (full_name, department, course, section, block, semester, batch) on public.profiles to authenticated;

create policy "requests_read_participants" on public.mentorship_requests for select to authenticated
using (student_id = (select public.current_cu_profile_id()) or mentor_id = (select public.current_cu_profile_id()) or (mentor_id is null and (select public.current_cu_role()) in ('faculty','senior')) or (select public.current_cu_role()) in ('hod','director'));
create policy "requests_insert_as_student" on public.mentorship_requests for insert to authenticated
with check (student_id = (select public.current_cu_profile_id()) and mentor_id is null and status = 'pending' and (select public.current_cu_role()) = 'student');
create policy "requests_update_by_mentor_or_admin" on public.mentorship_requests for update to authenticated
using (mentor_id = (select public.current_cu_profile_id()) or (mentor_id is null and (select public.current_cu_role()) in ('faculty','senior')) or (select public.current_cu_role()) in ('hod','director'))
with check ((mentor_id = (select public.current_cu_profile_id()) and (select public.current_cu_role()) in ('faculty','senior')) or (select public.current_cu_role()) in ('hod','director'));
revoke update on public.mentorship_requests from anon, authenticated;
grant update (mentor_id, status, meeting_link, meeting_location, updated_at) on public.mentorship_requests to authenticated;

create policy "feedback_read_participants" on public.session_feedback for select to authenticated
using (student_id = (select public.current_cu_profile_id()) or mentor_id = (select public.current_cu_profile_id()) or (select public.current_cu_role()) in ('hod','director'));
create policy "feedback_insert_after_completed_session" on public.session_feedback for insert to authenticated
with check (student_id = (select public.current_cu_profile_id()) and exists (select 1 from public.mentorship_requests r where r.id = request_id and r.student_id = (select public.current_cu_profile_id()) and r.status = 'completed'));

create policy "notifications_read_own" on public.notifications for select to authenticated
using (user_id = (select public.current_cu_profile_id()));
create policy "notifications_mark_own_read" on public.notifications for update to authenticated
using (user_id = (select public.current_cu_profile_id()))
with check (user_id = (select public.current_cu_profile_id()) and read = true);
revoke update on public.notifications from anon, authenticated;
grant update (read) on public.notifications to authenticated;

create policy "discussion_read_authenticated" on public.discussion_posts for select to authenticated using (true);
create policy "discussion_insert_own" on public.discussion_posts for insert to authenticated
with check (author_id = (select public.current_cu_profile_id()));
create policy "discussion_update_own" on public.discussion_posts for update to authenticated
using (author_id = (select public.current_cu_profile_id())) with check (author_id = (select public.current_cu_profile_id()));
create policy "discussion_delete_own" on public.discussion_posts for delete to authenticated
using (author_id = (select public.current_cu_profile_id()));

revoke all on public.profiles, public.mentorship_requests, public.session_feedback, public.notifications, public.discussion_posts from anon;
grant select on public.profiles, public.mentorship_requests, public.session_feedback, public.notifications, public.discussion_posts to authenticated;
grant insert on public.mentorship_requests, public.session_feedback, public.discussion_posts to authenticated;
grant delete on public.discussion_posts to authenticated;
