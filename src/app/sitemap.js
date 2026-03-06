import { getSupabase } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://getapro.org';

const TRADE_SLUGS = [
  'plumbing', 'hvac', 'electrical', 'landscaping', 'roofing',
  'general-contractor', 'painting', 'fencing', 'paving', 'pest-control',
  'locksmith', 'appliance-repair', 'garage-door', 'cleaning', 'tree-service',
];

export default async function sitemap() {
  const entries = [];

  // Static pages
  entries.push(
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/cities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  );

  // Trade pages
  for (const slug of TRADE_SLUGS) {
    entries.push({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Fetch all listings for trade/city combos and pro profiles
  const { data: listings } = await getSupabase()
    .from('getapro_listings')
    .select('slug, trade_category, city_slug, updated_at');

  if (listings) {
    // Trade/city combo pages (deduplicated)
    const tradeCityCombos = new Set();
    for (const l of listings) {
      const key = `${l.trade_category}/${l.city_slug}`;
      if (!tradeCityCombos.has(key)) {
        tradeCityCombos.add(key);
        entries.push({
          url: `${BASE_URL}/${l.trade_category}/${l.city_slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }

    // City pages (deduplicated)
    const citySet = new Set();
    for (const l of listings) {
      if (!citySet.has(l.city_slug)) {
        citySet.add(l.city_slug);
        // Cities link to /plumbing/{city} by default, but that's a trade/city page
        // The /cities page is already added as static
      }
    }

    // Individual pro profile pages
    for (const l of listings) {
      entries.push({
        url: `${BASE_URL}/pro/${l.slug}`,
        lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
