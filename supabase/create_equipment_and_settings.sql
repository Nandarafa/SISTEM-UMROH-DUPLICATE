-- SQL Script: Create equipment table and settings table if not exist
-- Run in Supabase SQL Editor if you want database-backed equipment

CREATE TABLE IF NOT EXISTS public.equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pilgrim_id UUID REFERENCES public.pilgrims(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    size TEXT DEFAULT '-',
    quantity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Belum Disiapkan',
    handed_over_at DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and add public access policies
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on equipment" ON public.equipment FOR ALL USING (true) WITH CHECK (true);

-- Settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    "group" TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
