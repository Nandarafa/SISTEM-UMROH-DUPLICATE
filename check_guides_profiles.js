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
  const { data: cols } = await s.from('pilgrims').select('*').limit(1);
  console.log('PILGRIMS COLS:', cols ? Object.keys(cols[0]) : []);
  const { data: guides } = await s.from('guides').select('*');
  console.log('GUIDES:', guides);
  const { data: profiles } = await s.from('profiles').select('*');
  console.log('PROFILES:', profiles);
  const { data: ahmad } = await s.from('pilgrims').select('*').eq('name', 'Ahmad Fauzi');
  console.log('AHMAD FAUZI PILGRIM:', ahmad);
}
run();
