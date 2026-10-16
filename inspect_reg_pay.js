const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  const k = parts[0]?.trim();
  const v = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  if (k) envVars[k] = v;
});

const { createClient } = require('@supabase/supabase-js');
const s = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function run() {
  const r = await s.from('registrations').select('id, code, pilgrim_id, package_id, status, registered_at, pilgrims(name), packages(name)');
  console.log('--- REGISTRATIONS ---');
  console.log(JSON.stringify(r.data, null, 2));

  const p = await s.from('payments').select('id, code, registration_id, amount, paid_amount, status');
  console.log('--- PAYMENTS ---');
  console.log(JSON.stringify(p.data, null, 2));
}

run();
