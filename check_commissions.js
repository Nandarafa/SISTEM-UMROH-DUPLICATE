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
  const { data: pilgrims } = await s.from('pilgrims').select('*');
  console.log('PILGRIMS:', pilgrims.map(p => ({ id: p.id, name: p.name, code: p.code, agent_id: p.agent_id })));

  const { data: commissions } = await s.from('commissions').select('*');
  console.log('COMMISSIONS:', commissions);

  const { data: registrations } = await s.from('registrations').select('*, packages(*)');
  console.log('REGISTRATIONS:', registrations);
}
run();
