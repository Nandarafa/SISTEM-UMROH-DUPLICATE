-- ========================================================
-- ADD EMAIL, PASSWORD, AND ACCOUNT DELETION TABLES / COLUMNS
-- Jalankan di Supabase SQL Editor
-- ========================================================

-- 1. Tambah kolom email & password ke tabel profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS password text DEFAULT 'password',
  ADD COLUMN IF NOT EXISTS deletion_status text DEFAULT 'active'; -- 'active', 'pending_deletion', 'deleted'

-- 2. Buat tabel user_accounts terpisah untuk kredensial lengkap jika dibutuhkan
CREATE TABLE IF NOT EXISTS public.user_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'guide',
  is_active boolean NOT NULL DEFAULT true,
  deletion_status text NOT NULL DEFAULT 'active', -- 'active', 'pending_deletion', 'deleted'
  deletion_reason text,
  requested_deletion_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Buat tabel permohonan hapus akun untuk approval Super Admin
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL,
  user_role text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'restored'
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- 4. Disable RLS agar bisa dibaca dan ditulis oleh aplikasi
ALTER TABLE public.user_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests DISABLE ROW LEVEL SECURITY;

-- 5. Masukkan / Update data akun demo otomatis ke profiles & user_accounts
INSERT INTO public.user_accounts (name, email, password, role, is_active, deletion_status)
VALUES 
  ('Ustadz Abdullah', 'muthawif@example.com', 'password', 'guide', true, 'active'),
  ('Ahmad Fauzi', 'jamaah@example.com', 'password', 'pilgrim', true, 'active'),
  ('Hasan Basri', 'agent@example.com', 'password', 'agent', true, 'active'),
  ('Admin Cabang', 'admin@example.com', 'password', 'admin', true, 'active'),
  ('Super Admin', 'superadmin@example.com', 'password', 'super_admin', true, 'active')
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password, name = EXCLUDED.name, updated_at = now();

-- Update data email dan password di tabel profiles yang sudah ada
UPDATE public.profiles
SET 
  email = 'muthawif@example.com',
  password = 'password',
  deletion_status = 'active'
WHERE role = 'guide' AND (email IS NULL OR email = '');
