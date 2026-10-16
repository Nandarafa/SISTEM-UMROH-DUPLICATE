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
async function run() {
  const { data: hotels, error: hErr } = await s.from('hotels').select('*');
  console.log('HOTELS IN DB:', hotels ? hotels.length : 0, hErr);
  if (hotels) console.log(hotels);

  const { data: airlines, error: aErr } = await s.from('airlines').select('*');
  console.log('AIRLINES IN DB:', airlines ? airlines.length : 0, aErr);
  if (airlines) console.log(airlines);
}
run();
