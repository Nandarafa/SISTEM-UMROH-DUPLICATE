-- =========================================================================
-- Tambahkan kolom muthawif / guide ke tabel pilgrims di Supabase
-- =========================================================================

-- 1. Tambah kolom guide_id dan muthawif_name ke tabel pilgrims
ALTER TABLE public.pilgrims
ADD COLUMN IF NOT EXISTS guide_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.pilgrims
ADD COLUMN IF NOT EXISTS muthawif_name text DEFAULT 'Ustadz Abdullah';

-- 2. Update jamaah Ahmad Fauzi agar terhubung ke muthawif Ustadz Abdullah
UPDATE public.pilgrims
SET 
  guide_id = '6e28a7c4-55b7-4635-a963-ad5d36f7a373',
  muthawif_name = 'Ustadz Abdullah'
WHERE name = 'Ahmad Fauzi';

-- 3. Update jamaah lainnya dengan default muthawif Ustadz Abdullah
UPDATE public.pilgrims
SET 
  guide_id = '6e28a7c4-55b7-4635-a963-ad5d36f7a373',
  muthawif_name = 'Ustadz Abdullah'
WHERE guide_id IS NULL;

-- 4. Pastikan RLS mengizinkan SELECT & UPDATE pada kolom baru
NOTIFY pgrst, 'reload schema';
