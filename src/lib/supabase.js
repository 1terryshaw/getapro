import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

function createMockClient() {
  const mockQuery = {
    select: () => mockQuery,
    eq: () => mockQuery,
    neq: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    single: () => Promise.resolve({ data: null, error: null, count: 0 }),
    then: (resolve) => resolve({ data: [], error: null, count: 0 }),
  };
  return { from: () => mockQuery };
}
