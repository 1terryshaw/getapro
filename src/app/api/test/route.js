export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ error: 'ENV VARS MISSING', url: url ? 'SET' : 'MISSING', key: key ? 'SET' : 'MISSING' });
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const { data, error, count } = await supabase.from('getapro_listings').select('id, business_name, trade_category, city_slug', { count: 'exact' }).limit(3);
  return Response.json({ env: 'OK', count, data, error });
}
