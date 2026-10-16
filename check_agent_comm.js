const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envObj = {};
env.split('\n').forEach(l => {
  const parts = l.split('=');
  if (parts.length >= 2) envObj[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
});
const { createClient } = require('@supabase/supabase-js');
const s = createClient(envObj.NEXT_PUBLIC_SUPABASE_URL, envObj.SUPABASE_SERVICE_ROLE_KEY || envObj.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data: agents } = await s.from('agents').select('*');
  console.log('Agents:', agents);
  const { data: regs } = await s.from('registrations').select('*');
  console.log('Registrations:', regs);
  const { data: comms } = await s.from('commissions').select('*');
  console.log('Commissions:', comms);
  const { data: pays } = await s.from('payments').select('*');
  console.log('Payments count:', pays?.length, pays?.map(p => ({ code: p.code, amount: p.amount, paid_amount: p.paid_amount, status: p.status })));
}
run();
