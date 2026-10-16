const { createClient } = require('@supabase/supabase-js');

const url = 'https://sodzhjbdlroicfwbpwze.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZHpoamJkbHJvaWNmd2Jwd3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NDEwMDYsImV4cCI6MjEwNzIxNzAwNn0.WGsuO_yailt9kWf9nyxLcSC_Oq_ExauR-aqnRUFjcJA';
const supabase = createClient(url, key);

async function seed() {
  console.log('--- Cleaning previous test data ---');
  await supabase.from('manasik_attendances').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('manasik_schedules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('pilgrims').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('packages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('guides').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('agents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('branches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('1. Seeding Branches...');
  const { data: branch, error: bErr } = await supabase.from('branches').insert([
    {
      code: 'JKT',
      name: 'Kantor Pusat Jakarta',
      phone: '021-7654321',
      email: 'pusat@example.com',
      address: 'Jl. Melati Indah No. 17, Jakarta Selatan',
      city: 'Jakarta',
      is_active: true,
      is_head_office: true,
    },
    {
      code: 'SBY',
      name: 'Cabang Surabaya',
      phone: '031-1234567',
      email: 'surabaya@example.com',
      address: 'Jl. Pahlawan No. 45, Surabaya',
      city: 'Surabaya',
      is_active: true,
      is_head_office: false,
    }
  ]).select();
  if (bErr) throw bErr;
  const branchJkt = branch[0].id;
  const branchSby = branch[1].id;

  console.log('2. Seeding Guides & Agents...');
  const { data: guide, error: gErr } = await supabase.from('guides').insert([
    {
      branch_id: branchJkt,
      code: 'GD-DEMO1',
      name: 'Ustadz Abdullah',
      specialization: 'Fiqih Manasik',
      is_active: true,
    },
    {
      branch_id: branchJkt,
      code: 'GD-DEMO2',
      name: 'Ustadz Fauzan',
      specialization: 'Fiqih Manasik',
      is_active: true,
    }
  ]).select();
  if (gErr) throw gErr;
  const guideAbdullah = guide[0].id;

  const { data: agent, error: aErr } = await supabase.from('agents').insert([
    {
      branch_id: branchJkt,
      code: 'AG-DEMO1',
      name: 'Hasan Basri',
      phone: '081234560001',
      email: 'agent@example.com',
      commission_rate: 5.0,
      is_active: true,
    }
  ]).select();
  if (aErr) throw aErr;
  const agentHasan = agent[0].id;

  console.log('3. Seeding Packages...');
  const { data: pkgs, error: pErr } = await supabase.from('packages').insert([
    {
      branch_id: branchJkt,
      code: 'PKG-REG9',
      name: 'Umroh Reguler 9 Hari',
      type: 'umroh',
      price: 27500000,
      down_payment: 5000000,
      quota: 45,
      duration_days: 9,
      departure_date: '2026-10-15',
      departure_city: 'Jakarta',
      status: 'active'
    },
    {
      branch_id: branchJkt,
      code: 'PKG-HJPLUS',
      name: 'Haji Plus Eksklusif',
      type: 'haji',
      price: 185000000,
      down_payment: 25000000,
      quota: 30,
      duration_days: 25,
      departure_date: '2027-05-10',
      departure_city: 'Jakarta',
      status: 'active'
    }
  ]).select();
  if (pErr) throw pErr;
  const pkgUmroh = pkgs[0].id;
  const pkgHaji = pkgs[1].id;

  console.log('4. Seeding Pilgrims...');
  const { data: pilgrims, error: pilErr } = await supabase.from('pilgrims').insert([
    {
      branch_id: branchJkt,
      agent_id: agentHasan,
      code: 'JM-0001',
      name: 'Ahmad Fauzi',
      gender: 'male',
      nik: '3201000000000001',
      phone: '081200000001',
      email: 'jamaah@example.com',
      city: 'Jakarta',
      passport_number: 'A1000000',
      is_active: true
    },
    {
      branch_id: branchJkt,
      agent_id: agentHasan,
      code: 'JM-0004',
      name: 'Dewi Anggraini',
      gender: 'female',
      nik: '3201000000000004',
      phone: '081200000004',
      email: 'jamaah4@example.com',
      city: 'Surabaya',
      passport_number: 'A1000003',
      is_active: true
    },
    {
      branch_id: branchJkt,
      agent_id: agentHasan,
      code: 'JM-0007',
      name: 'Gunawan Wibowo',
      gender: 'male',
      nik: '3201000000000007',
      phone: '081200000007',
      email: 'jamaah7@example.com',
      city: 'Bandung',
      passport_number: 'A1000006',
      is_active: true
    },
    {
      branch_id: branchJkt,
      agent_id: agentHasan,
      code: 'JM-0010',
      name: 'Joko Widodo',
      gender: 'male',
      nik: '3201000000000010',
      phone: '081200000010',
      email: 'jamaah10@example.com',
      city: 'Solo',
      passport_number: 'A1000009',
      is_active: true
    },
    {
      branch_id: branchJkt,
      agent_id: agentHasan,
      code: 'JM-0009',
      name: 'Indra Kusuma',
      gender: 'male',
      nik: '3201000000000009',
      phone: '081200000009',
      email: 'jamaah9@example.com',
      city: 'Semarang',
      passport_number: 'A1000008',
      is_active: true
    }
  ]).select();
  if (pilErr) throw pilErr;

  console.log('5. Seeding Manasik Schedules...');
  const { data: schedules, error: sErr } = await supabase.from('manasik_schedules').insert([
    {
      branch_id: branchJkt,
      package_id: pkgHaji,
      guide_id: guideAbdullah,
      title: 'Manasik Haji Plus Eksklusif #2',
      date: '2026-09-23',
      start_time: '08:00:00',
      end_time: '12:00:00',
      location: 'Aula Kantor Pusat Jakarta'
    },
    {
      branch_id: branchJkt,
      package_id: pkgUmroh,
      guide_id: guideAbdullah,
      title: 'Manasik Umroh Reguler 9 Hari #2',
      date: '2026-09-20',
      start_time: '08:00:00',
      end_time: '12:00:00',
      location: 'Aula Kantor Pusat Jakarta'
    },
    {
      branch_id: branchJkt,
      package_id: pkgHaji,
      guide_id: guideAbdullah,
      title: 'Manasik Haji Plus Eksklusif #1',
      date: '2026-08-24',
      start_time: '08:00:00',
      end_time: '12:00:00',
      location: 'Aula Kantor Pusat Jakarta'
    },
    {
      branch_id: branchJkt,
      package_id: pkgUmroh,
      guide_id: guideAbdullah,
      title: 'Manasik Umroh Reguler 9 Hari #1',
      date: '2026-08-21',
      start_time: '08:00:00',
      end_time: '12:00:00',
      location: 'Aula Kantor Pusat Jakarta'
    }
  ]).select();
  if (sErr) throw sErr;

  console.log('6. Seeding Initial Manasik Attendances (Dewi: Izin, Indra: Hadir)...');
  const dewi = pilgrims.find(p => p.name === 'Dewi Anggraini');
  const indra = pilgrims.find(p => p.name === 'Indra Kusuma');
  const ahmad = pilgrims.find(p => p.name === 'Ahmad Fauzi');
  const gunawan = pilgrims.find(p => p.name === 'Gunawan Wibowo');
  const joko = pilgrims.find(p => p.name === 'Joko Widodo');

  const { error: attErr } = await supabase.from('manasik_attendances').insert([
    {
      schedule_id: schedules[0].id,
      pilgrim_id: dewi.id,
      status: 'excused' // Izin
    },
    {
      schedule_id: schedules[0].id,
      pilgrim_id: indra.id,
      status: 'present' // Hadir
    },
    {
      schedule_id: schedules[3].id,
      pilgrim_id: ahmad.id,
      status: 'present'
    },
    {
      schedule_id: schedules[3].id,
      pilgrim_id: gunawan.id,
      status: 'present'
    },
    {
      schedule_id: schedules[3].id,
      pilgrim_id: joko.id,
      status: 'absent'
    }
  ]);
  if (attErr) throw attErr;

  console.log('7. Seeding Announcements...');
  await supabase.from('announcements').insert([
    {
      branch_id: branchJkt,
      title: 'Jadwal Manasik Akbar',
      body: 'Manasik akbar akan dilaksanakan akhir bulan ini di aula utama. Wajib hadir.',
      audience: 'all',
      is_published: true
    }
  ]);

  console.log('SUCCESS_ALL_SEEDED');
}

seed().catch(err => console.error('Seed Error:', err));
