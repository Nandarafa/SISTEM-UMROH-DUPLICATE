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
  const { data: pkgs, error: pErr } = await s.from('packages').select('id, name, code, type, departure_date');
  console.log('PACKAGES:', pkgs);
  const { data: regs, error: rErr } = await s.from('registrations').select('id, code, pilgrim_id, package_id, pilgrims(name)');
  console.log('REGISTRATIONS:', regs);
}
run();
