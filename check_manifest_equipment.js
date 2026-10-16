const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envObj = {};
env.split('\n').forEach(l => {
  const parts = l.split('=');
  if (parts.length >= 2) envObj[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});
const { createClient } = require('@supabase/supabase-js');
const s = createClient(envObj.NEXT_PUBLIC_SUPABASE_URL, envObj.SUPABASE_SERVICE_ROLE_KEY || envObj.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const t1 = await s.from('equipment').select('*').limit(1);
  console.log('equipment:', t1.error ? t1.error.message : (t1.data[0] ? Object.keys(t1.data[0]) : 'empty table exists'));
  const t2 = await s.from('manifests').select('*').limit(1);
  console.log('manifests:', t2.error ? t2.error.message : (t2.data[0] ? Object.keys(t2.data[0]) : 'empty table exists'));
  const t3 = await s.from('registrations').select('*').limit(1);
  console.log('registrations cols:', t3.data ? Object.keys(t3.data[0] || {}) : t3.error?.message);
}
run();
