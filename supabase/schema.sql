-- Jalankan di Supabase SQL Editor.
-- Setelah ini: Authentication → Users (buat akun), lalu isi public.profiles.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('super_admin', 'admin', 'agent', 'pilgrim', 'guide');

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  phone text,
  email text,
  address text,
  city text,
  is_active boolean not null default true,
  is_head_office boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role public.user_role not null default 'pilgrim',
  branch_id uuid references public.branches(id) on delete set null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  star int not null default 3,
  distance_to_masjid int,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.airlines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text,
  transit text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid references public.branches(id) on delete cascade,
  bank_name text not null,
  account_number text not null,
  account_holder text not null,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.agents (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  code text unique not null,
  name text not null,
  phone text,
  email text,
  commission_rate numeric(5,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.guides (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  code text unique not null,
  name text not null,
  specialization text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  name text not null,
  code text unique not null,
  type text not null default 'umroh',
  price numeric(15,2) not null default 0,
  down_payment numeric(15,2) not null default 0,
  quota int not null default 0,
  duration_days int not null default 9,
  departure_date date,
  departure_city text,
  hotel_makkah_id uuid references public.hotels(id),
  hotel_madinah_id uuid references public.hotels(id),
  airline_id uuid references public.airlines(id),
  status text not null default 'draft',
  created_at timestamptz default now()
);

create table public.pilgrims (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  code text unique not null,
  name text not null,
  gender text not null default 'male',
  nik text,
  phone text,
  email text,
  city text,
  passport_number text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  pilgrim_id uuid not null references public.pilgrims(id) on delete cascade,
  package_id uuid not null references public.packages(id) on delete cascade,
  agent_id uuid references public.agents(id),
  guide_id uuid references public.guides(id),
  code text unique not null,
  status text not null default 'pending',
  total_price numeric(15,2) not null default 0,
  registered_at date default current_date,
  unique (pilgrim_id, package_id)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  registration_id uuid not null references public.registrations(id) on delete cascade,
  code text unique not null,
  type text not null default 'installment',
  amount numeric(15,2) not null default 0,
  paid_amount numeric(15,2) not null default 0,
  status text not null default 'unpaid',
  due_date date
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  pilgrim_id uuid not null references public.pilgrims(id) on delete cascade,
  type text not null,
  label text not null,
  status text not null default 'pending',
  file_path text
);

create table public.manasik_schedules (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  package_id uuid references public.packages(id),
  guide_id uuid references public.guides(id),
  title text not null,
  date date not null,
  location text
);

create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  registration_id uuid not null references public.registrations(id) on delete cascade,
  amount numeric(15,2) not null default 0,
  status text not null default 'pending'
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid references public.branches(id),
  title text not null,
  body text not null,
  audience text not null default 'all',
  is_published boolean not null default true
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  description text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.branches enable row level security;
alter table public.packages enable row level security;
alter table public.pilgrims enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;

create policy "authenticated read profiles" on public.profiles for select to authenticated using (true);
create policy "authenticated read branches" on public.branches for select to authenticated using (true);
create policy "authenticated read packages" on public.packages for select to authenticated using (true);
create policy "authenticated read pilgrims" on public.pilgrims for select to authenticated using (true);
create policy "authenticated read registrations" on public.registrations for select to authenticated using (true);
create policy "authenticated read payments" on public.payments for select to authenticated using (true);
