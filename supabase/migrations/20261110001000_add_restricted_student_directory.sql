-- Restricted student directory for authorized mentoring staff.
-- The view intentionally exposes only the fields needed to coordinate mentoring.
create or replace view public.public_student_directory
with (security_barrier = true)
as
select p.id, p.full_name, p.uid_or_empid, p.section, p.course, p.semester, p.batch
from public.profiles p
where p.role = 'student'
  and (select public.current_cu_role()) in ('faculty', 'senior', 'hod', 'director');

revoke all on public.public_student_directory from public, anon;
grant select on public.public_student_directory to authenticated;
