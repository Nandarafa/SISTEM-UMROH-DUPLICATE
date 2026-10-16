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
  const { data, error } = await s
    .from("pilgrims")
    .select(`
      *,
      branches ( name ),
      agents ( name ),
      registrations (
        id,
        code,
        registered_at,
        status,
        packages ( name )
      )
    `)
    .limit(1);
  console.log('PILGRIM DETAIL QUERY:', data, error);
}
run();
