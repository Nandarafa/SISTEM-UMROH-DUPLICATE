const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
const envObj = {};
lines.forEach(l => {
  const parts = l.split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    envObj[k] = v;
  }
});
const { createClient } = require('@supabase/supabase-js');
const s = createClient(envObj.NEXT_PUBLIC_SUPABASE_URL, envObj.SUPABASE_SERVICE_ROLE_KEY || envObj.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const hotelsToSeed = [
  { name: 'Anwar Al Madinah Mövenpick', city: 'Madinah', star: 5, distance_to_masjid: 80, is_active: true },
  { name: 'Dallah Taibah Hotel', city: 'Madinah', star: 4, distance_to_masjid: 150, is_active: true },
  { name: 'Anjum Hotel Makkah', city: 'Mekah', star: 4, distance_to_masjid: 400, is_active: true },
  { name: 'Hilton Makkah Convention', city: 'Mekah', star: 5, distance_to_masjid: 250, is_active: true },
  { name: 'Swissôtel Al Maqam Makkah', city: 'Mekah', star: 5, distance_to_masjid: 100, is_active: true },
];

const airlinesToSeed = [
  { name: 'Garuda Indonesia', code: 'GA', transit: 'Langsung', is_active: true },
  { name: 'Saudi Arabian Airlines', code: 'SV', transit: 'Langsung', is_active: true },
];

async function run() {
  const { error: hErr } = await s.from('hotels').insert(hotelsToSeed);
  console.log('SEED HOTELS ERROR:', hErr);

  const { error: aErr } = await s.from('airlines').insert(airlinesToSeed);
  console.log('SEED AIRLINES ERROR:', aErr);

  const { data: hList } = await s.from('hotels').select('*');
  console.log('TOTAL HOTELS NOW:', hList ? hList.length : 0);

  const { data: aList } = await s.from('airlines').select('*');
  console.log('TOTAL AIRLINES NOW:', aList ? aList.length : 0);
}
run();
