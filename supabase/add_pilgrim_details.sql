-- ========================================================
-- Schema Migration: Add All Detail Columns to 'pilgrims' Table
-- Jalankan script SQL ini di SQL Editor Supabase Anda
-- ========================================================

alter table public.pilgrims 
  add column if not exists birth_place text,
  add column if not exists birth_date date,
  add column if not exists blood_type text,
  add column if not exists address text,
  add column if not exists passport_issued_place text,
  add column if not exists passport_issued_at date,
  add column if not exists passport_expired_at date,
  add column if not exists mahram_name text,
  add column if not exists mahram_relation text,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text,
  add column if not exists health_notes text;

-- Pastikan tabel activity_logs juga memiliki izin RLS yang terbuka
alter table public.activity_logs enable row level security;
drop policy if exists "allow all access activity_logs" on public.activity_logs;
create policy "allow all access activity_logs" on public.activity_logs for all using (true) with check (true);

-- Refresh schema cache
notify pgrst, 'reload schema';
