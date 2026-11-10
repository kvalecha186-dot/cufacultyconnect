-- Align profile fields used by the application and keep schema reproducible.
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
grant update (avatar_url) on public.profiles to authenticated;
