-- =========================================================================
-- SEED DATA HOTEL & MASKAPAI (SUPABASE SQL)
-- =========================================================================

-- 1. Table Hotel
CREATE TABLE IF NOT EXISTS public.hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  star int NOT NULL DEFAULT 3,
  distance_to_masjid int,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insert Data Hotel
INSERT INTO public.hotels (name, city, star, distance_to_masjid, is_active)
VALUES
  ('Al Eiman Royal Hotel', 'Madinah', 4, 300, true),
  ('Anwar Al Madinah Mövenpick', 'Madinah', 5, 80, true),
  ('Dallah Taibah Hotel', 'Madinah', 4, 150, true),
  ('Anjum Hotel Makkah', 'Mekah', 4, 400, true),
  ('Hilton Makkah Convention', 'Mekah', 5, 250, true),
  ('Swissôtel Al Maqam Makkah', 'Mekah', 5, 100, true)
ON CONFLICT DO NOTHING;

-- 2. Table Maskapai
CREATE TABLE IF NOT EXISTS public.airlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text,
  transit text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insert Data Maskapai
INSERT INTO public.airlines (name, code, transit, is_active)
VALUES
  ('Emirates', 'EK', 'Transit Dubai', true),
  ('Garuda Indonesia', 'GA', 'Langsung', true),
  ('Saudi Arabian Airlines', 'SV', 'Langsung', true)
ON CONFLICT DO NOTHING;

-- 3. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
