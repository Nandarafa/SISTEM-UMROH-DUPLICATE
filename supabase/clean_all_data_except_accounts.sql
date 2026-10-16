-- ==============================================================================
-- SQL RESET / TRUNCATE TRANSAKSI & INPUT DATA (KECUALI AKUN & DASHBOARD)
-- Sistem Manajemen Umroh & Haji
-- ==============================================================================
-- Script ini menghapus seluruh data operasional, pendaftaran, transaksi, dan input
-- tetapi TETAP MEMPERTAHANKAN:
-- 1. Akun Pengguna / User (auth.users & public.profiles)
-- 2. Kantor Cabang Utama / Pusat (public.branches)
-- 3. Konfigurasi Sistem / White-label (public.settings)
-- 4. Hak Akses & Dashboard Metrics dasar
-- ==============================================================================

-- Nonaktifkan Foreign Key Check sementara agar pembersihan tidak terhalang constraints
SET session_replication_role = 'replica';

BEGIN;

-- 1. Bersihkan Riwayat Audit & Log Aktivitas
TRUNCATE TABLE public.activity_logs RESTART IDENTITY CASCADE;

-- 2. Bersihkan Pengumuman / Broadcast
TRUNCATE TABLE public.announcements RESTART IDENTITY CASCADE;

-- 3. Bersihkan Komisi Agen
TRUNCATE TABLE public.commissions RESTART IDENTITY CASCADE;

-- 4. Bersihkan Distribusi Perlengkapan Jamaah
-- (koper, seragam, ihram, tas paspor)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'equipment_distributions') THEN
    TRUNCATE TABLE public.equipment_distributions RESTART IDENTITY CASCADE;
  END IF;
END $$;

-- 5. Bersihkan Manifest Bus & Rooming Hotel
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roomings') THEN
    TRUNCATE TABLE public.roomings RESTART IDENTITY CASCADE;
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'manifests') THEN
    TRUNCATE TABLE public.manifests RESTART IDENTITY CASCADE;
  END IF;
END $$;

-- 6. Bersihkan Absensi Manasik & Jadwal Manasik
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'manasik_attendances') THEN
    TRUNCATE TABLE public.manasik_attendances RESTART IDENTITY CASCADE;
  END IF;
END $$;
TRUNCATE TABLE public.manasik_schedules RESTART IDENTITY CASCADE;

-- 7. Bersihkan Pembayaran & Invoice Tagihan
TRUNCATE TABLE public.payments RESTART IDENTITY CASCADE;

-- 8. Bersihkan Dokumen Berkas & Foto Jamaah
TRUNCATE TABLE public.documents RESTART IDENTITY CASCADE;

-- 9. Bersihkan Pendaftaran / Registrasi Paket
TRUNCATE TABLE public.registrations RESTART IDENTITY CASCADE;

-- 10. Bersihkan Data Jamaah
TRUNCATE TABLE public.pilgrims RESTART IDENTITY CASCADE;

-- 11. Bersihkan Paket Perjalanan Umroh & Haji
TRUNCATE TABLE public.packages RESTART IDENTITY CASCADE;

-- 12. Bersihkan Master Rekening Bank
TRUNCATE TABLE public.bank_accounts RESTART IDENTITY CASCADE;

-- 13. Bersihkan Master Maskapai Penerbangan
TRUNCATE TABLE public.airlines RESTART IDENTITY CASCADE;

-- 14. Bersihkan Master Hotel
TRUNCATE TABLE public.hotels RESTART IDENTITY CASCADE;

-- 15. Bersihkan Master Agen & Muthawif (Biodata Master)
-- Catatan: Akun login mereka di public.profiles TETAP ADA & AMAN.
TRUNCATE TABLE public.agents RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.guides RESTART IDENTITY CASCADE;

-- 16. Opsional: Hapus Cabang Tambahan (Pertahankan Kantor Pusat Jakarta)
DELETE FROM public.branches WHERE is_head_office = false;

COMMIT;

-- Kembalikan setting replication role ke origin
SET session_replication_role = 'origin';

-- ==============================================================================
-- HASIL:
-- Database sekarang BERSIH dari segala inputan transaksi, pendaftaran, hotel,
-- paket, jadwal manasik, dokumen, pembayaran, dan perlengkapan.
-- Akun Login (Super Admin, Admin, Agen, Jamaah, Muthawif) di auth.users & profiles
-- serta konfigurasi White-label dashboard tetap utuh 100%.
-- ==============================================================================
