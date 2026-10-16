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
  const { data, error } = await s.from('commissions').select(`
    id,
    amount,
    status,
    agents ( name ),
    registrations (
      id,
      code,
      total_price,
      pilgrims ( name ),
      packages ( name, price )
    )
  `);
  console.log('COMMISSIONS JOIN:', JSON.stringify(data, null, 2), error);
}
run();
