-- ============================================================
-- FIX: Jalankan di Supabase SQL Editor
-- 1. Buat tabel manasik_attendances yang belum ada
-- 2. Tambah kolom start_time & end_time ke manasik_schedules
-- 3. Disable RLS supaya anon key bisa write (mode demo/dev)
-- ============================================================

-- 1. Buat tabel manasik_attendances
CREATE TABLE IF NOT EXISTS public.manasik_attendances (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid NOT NULL REFERENCES public.manasik_schedules(id) ON DELETE CASCADE,
  pilgrim_id  uuid NOT NULL REFERENCES public.pilgrims(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'absent',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (schedule_id, pilgrim_id)
);

-- 2. Tambah kolom start_time & end_time ke manasik_schedules jika belum ada
ALTER TABLE public.manasik_schedules
  ADD COLUMN IF NOT EXISTS start_time time,
  ADD COLUMN IF NOT EXISTS end_time   time;

-- 3. Disable RLS pada semua tabel agar anon key bisa INSERT/UPDATE
--    (untuk mode demo / development — kalau mau production, gunakan service_role key atau buat RLS policies)
ALTER TABLE public.profiles            DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches            DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages            DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilgrims            DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations       DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments            DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.manasik_schedules   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.manasik_attendances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides              DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents              DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements       DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents           DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions         DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs       DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels              DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.airlines            DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts       DISABLE ROW LEVEL SECURITY;
