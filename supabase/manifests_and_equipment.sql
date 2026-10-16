-- ========================================================
-- Schema Migration: Manifests & Equipment (Perlengkapan)
-- Jalankan di SQL Editor Supabase jika tabel belum ada
-- ========================================================

-- 1. Tabel manifests / rooming jamaah per registrasi
create table if not exists public.manifests (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade unique,
  room_number text,
  room_type text default 'Quad', -- Quad, Triple, Double, Single
  bus_number text,
  seat_number text,
  mahram_group text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Tabel equipment / perlengkapan jamaah
create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  pilgrim_id uuid not null references public.pilgrims(id) on delete cascade,
  item text not null, -- Koper, Seragam, Kain Ihram, Tas Paspor
  size text, -- 24 inch, 28 inch, S, M, L, XL, XXL, atau '-'
  quantity int not null default 1,
  status text not null default 'Belum Disiapkan', -- Belum Disiapkan, Disiapkan, Sudah Diserahkan
  handed_over_at date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS setup
alter table public.manifests enable row level security;
alter table public.equipment enable row level security;

-- Policies for public / authenticated access
drop policy if exists "allow all access manifests" on public.manifests;
create policy "allow all access manifests" on public.manifests for all using (true) with check (true);

drop policy if exists "allow all access equipment" on public.equipment;
create policy "allow all access equipment" on public.equipment for all using (true) with check (true);
