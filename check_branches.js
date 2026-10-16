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
  const { data: b, error: be } = await s.from('branches').insert({
    name: 'Cabang Test',
    code: 'TST',
    city: 'Bandung',
    phone: '022-123456',
    email: 'test@example.com',
    is_active: true,
    is_head_office: false
  }).select();
  console.log('INSERT BRANCH:', b, be);
  if (b && b[0]) {
    const { error: de } = await s.from('branches').delete().eq('id', b[0].id);
    console.log('DELETE BRANCH:', de);
  }
}
run();
