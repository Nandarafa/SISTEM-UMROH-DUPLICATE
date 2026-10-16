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
  const { data, error } = await s.from('pilgrims').select('id, name, code, agent_id, is_active, created_at').order('created_at', { ascending: false });
  console.log('ALL PILGRIMS IN DB (' + (data ? data.length : 0) + '):');
  data && data.forEach(p => console.log(p.code, p.name, 'agent:', p.agent_id, 'is_active:', p.is_active));
}
run();
