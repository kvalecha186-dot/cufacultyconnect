-- Keep security-definer identity helpers outside the exposed public API schema.
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

drop policy if exists "profiles_read_scoped" on public.profiles;
create policy "profiles_read_scoped" on public.profiles for select to authenticated
using (
  id = (select private.current_cu_profile_id())
  or role in ('faculty','senior')
  or (role = 'student' and (select private.current_cu_role()) in ('faculty','senior','hod','director'))
  or (select private.current_cu_role()) in ('hod','director')
);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated
using (id = (select private.current_cu_profile_id()))
with check (id = (select private.current_cu_profile_id()) and role = (select private.current_cu_role()));

drop policy if exists "requests_read_participants" on public.mentorship_requests;
create policy "requests_read_participants" on public.mentorship_requests for select to authenticated
using (
  student_id = (select private.current_cu_profile_id())
  or mentor_id = (select private.current_cu_profile_id())
  or (mentor_id is null and (select private.current_cu_role()) in ('faculty','senior'))
  or (select private.current_cu_role()) in ('hod','director')
);
drop policy if exists "requests_insert_as_student" on public.mentorship_requests;
create policy "requests_insert_as_student" on public.mentorship_requests for insert to authenticated
with check (
  student_id = (select private.current_cu_profile_id())
  and mentor_id is null and status = 'pending'
  and (select private.current_cu_role()) = 'student'
);
drop policy if exists "requests_update_by_mentor_or_admin" on public.mentorship_requests;
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

drop policy if exists "feedback_read_participants" on public.session_feedback;
create policy "feedback_read_participants" on public.session_feedback for select to authenticated
using (
  student_id = (select private.current_cu_profile_id())
  or mentor_id = (select private.current_cu_profile_id())
  or (select private.current_cu_role()) in ('hod','director')
);
drop policy if exists "feedback_insert_after_completed_session" on public.session_feedback;
create policy "feedback_insert_after_completed_session" on public.session_feedback for insert to authenticated
with check (
  student_id = (select private.current_cu_profile_id())
  and exists (
    select 1 from public.mentorship_requests r
    where r.id = request_id
      and r.student_id = (select private.current_cu_profile_id())
      and r.status = 'completed'
  )
);

drop policy if exists "notifications_read_own" on public.notifications;
create policy "notifications_read_own" on public.notifications for select to authenticated
using (user_id = (select private.current_cu_profile_id()));
drop policy if exists "notifications_mark_own_read" on public.notifications;
create policy "notifications_mark_own_read" on public.notifications for update to authenticated
using (user_id = (select private.current_cu_profile_id()))
with check (user_id = (select private.current_cu_profile_id()) and read = true);

drop policy if exists "discussion_insert_own" on public.discussion_posts;
create policy "discussion_insert_own" on public.discussion_posts for insert to authenticated
with check (author_id = (select private.current_cu_profile_id()));
drop policy if exists "discussion_update_own" on public.discussion_posts;
create policy "discussion_update_own" on public.discussion_posts for update to authenticated
using (author_id = (select private.current_cu_profile_id()))
with check (author_id = (select private.current_cu_profile_id()));
drop policy if exists "discussion_delete_own" on public.discussion_posts;
create policy "discussion_delete_own" on public.discussion_posts for delete to authenticated
using (author_id = (select private.current_cu_profile_id()));

drop view if exists public.public_student_directory;
drop function if exists public.current_cu_profile_id();
drop function if exists public.current_cu_role();

-- Expose only the profile columns required by the application.
revoke select on public.profiles from anon, authenticated;
grant select (id, email, full_name, role, uid_or_empid, department, course, section, block, semester, batch, designation, avatar_url, created_at, updated_at)
on public.profiles to authenticated;

create index if not exists mentorship_requests_student_id_idx on public.mentorship_requests(student_id);
create index if not exists mentorship_requests_mentor_id_idx on public.mentorship_requests(mentor_id);
create index if not exists session_feedback_request_id_idx on public.session_feedback(request_id);
create index if not exists session_feedback_student_id_idx on public.session_feedback(student_id);
create index if not exists session_feedback_mentor_id_idx on public.session_feedback(mentor_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_request_id_idx on public.notifications(request_id);
create index if not exists discussion_posts_author_id_idx on public.discussion_posts(author_id);
