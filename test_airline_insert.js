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
  const { data: cols } = await s.from('airlines').select('*').limit(1);
  console.log('AIRLINES COLS:', cols ? Object.keys(cols[0] || {}) : 'empty');
  
  // Try insert one airline
  const { data: insA, error: errA } = await s.from('airlines').insert([
    {
      name: 'Emirates',
      code: 'EK',
      transit: 'Transit Dubai',
      is_active: true
    }
  ]).select();
  console.log('INSERT AIRLINE TEST:', insA, errA);
}
run();
