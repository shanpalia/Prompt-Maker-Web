-- Run in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.prompts (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 category text not null default 'Portrait',
 prompt_text text not null,
 image_url text,
 status text not null default 'draft' check (status in ('draft','published')),
 created_at timestamptz not null default now(),
 published_at timestamptz
);
alter table public.prompts enable row level security;
create policy "Public read published prompts" on public.prompts for select using (status = 'published');
create policy "Admin insert prompts" on public.prompts for insert to authenticated with check ((auth.jwt()->'app_metadata'->>'role') = 'prompt_admin');
create policy "Admin update prompts" on public.prompts for update to authenticated using ((auth.jwt()->'app_metadata'->>'role') = 'prompt_admin') with check ((auth.jwt()->'app_metadata'->>'role') = 'prompt_admin');
create policy "Admin delete prompts" on public.prompts for delete to authenticated using ((auth.jwt()->'app_metadata'->>'role') = 'prompt_admin');
grant select on public.prompts to anon, authenticated;
grant insert, update, delete on public.prompts to authenticated;
