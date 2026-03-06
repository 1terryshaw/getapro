export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { getSupabase } from '@/lib/supabase';
import { generateTradeCity } from '@/lib/seo';
import { localBusinessSchema, breadcrumbSchema } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const TRADES_MAP = {
  plumbing: 'Plumbing',
  hvac: 'HVAC & Heating',
  electrical: 'Electrical',
  landscaping: 'Landscaping',
  roofing: 'Roofing',
  'general-contractor': 'General Contractor',
  painting: 'Painting',
  fencing: 'Fencing',
  paving: 'Paving & Concrete',
  'pest-control': 'Pest Control',
  locksmith: 'Locksmith',
  'appliance-repair': 'Appliance Repair',
  'garage-door': 'Garage Door',
  cleaning: 'Cleaning',
  'tree-service': 'Tree Service',
};

function toCityName(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }) {
  const { tradeSlug, citySlug } = await params;
  const tradeName = TRADES_MAP[tradeSlug];
  if (!tradeName) return {};
  const cityName = toCityName(citySlug);

  const { count } = await getSupabase()
    .from('getapro_listings')
    .select('id', { count: 'exact', head: true })
    .eq('trade_category', tradeName)
    .eq('city_slug', citySlug);

  return generateTradeCity(tradeName, cityName, count);
}

export default async function TradeCityPage({ params, searchParams }) {
  const { tradeSlug, citySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const tradeName = TRADES_MAP[tradeSlug];
  if (!tradeName) notFound();
  const cityName = toCityName(citySlug);

  const sortParam = resolvedSearchParams?.sort || 'rating';
  let query = getSupabase()
    .from('getapro_listings')
    .select('*')
    .eq('trade_category', tradeName)
    .eq('city_slug', citySlug);

  if (sortParam === 'reviews') {
    query = query.order('google_review_count', { ascending: false });
  } else if (sortParam === 'name') {
    query = query.order('business_name', { ascending: true });
  } else {
    query = query.order('is_featured', { ascending: false }).order('google_rating', { ascending: false }).order('google_review_count', { ascending: false });
  }

  const { data: listings, error: listingsError } = await query;
  if (listingsError) console.error('[TradeCityPage] listings query error:', listingsError);
  const count = listings?.length || 0;

  // Cross-links: other trades in same city
  const { data: otherTrades, error: otherTradesError } = await getSupabase()
    .from('getapro_listings')
    .select('trade_category')
    .eq('city_slug', citySlug)
    .neq('trade_category', tradeName);
  if (otherTradesError) console.error('[TradeCityPage] otherTrades query error:', otherTradesError);

  const otherTradeSet = new Set((otherTrades || []).map((l) => l.trade_category));
  const otherTradeLinks = Object.entries(TRADES_MAP)
    .filter(([, name]) => otherTradeSet.has(name))
    .map(([slug, name]) => ({ slug, name }));

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: tradeName, href: `/${tradeSlug}` },
    { label: cityName },
  ];

  // JSON-LD for each listing
  const schemas = (listings || []).map((l) => localBusinessSchema(l));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <section className="bg-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl md:text-4xl font-bold">
            {tradeName} in <span className="text-primary">{cityName}</span>
          </h1>
          <p className="text-accent mt-2">
            {count} {tradeName.toLowerCase()} {count === 1 ? 'business' : 'businesses'} listed in {cityName}, Ontario.
            Compare ratings, read reviews, and get free quotes.
          </p>
          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Sort controls */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-accent">Sort by:</span>
          {[
            { key: 'rating', label: 'Rating' },
            { key: 'reviews', label: 'Most Reviews' },
            { key: 'name', label: 'Name' },
          ].map((opt) => (
            <Link
              key={opt.key}
              href={`/${tradeSlug}/${citySlug}?sort=${opt.key}`}
              className={`px-3 py-1 rounded ${
                sortParam === opt.key
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark border border-gray-200 hover:border-primary'
              } transition-colors`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {count > 0 ? (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-accent mb-4">No {tradeName.toLowerCase()} listings found in {cityName} yet.</p>
            <Link href={`/${tradeSlug}`} className="text-primary font-medium hover:underline">
              Browse all {tradeName} in Ontario &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Cross-links: other trades in this city */}
      {otherTradeLinks.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-bold text-dark mb-4">Other Trades in {cityName}</h2>
            <div className="flex flex-wrap gap-2">
              {otherTradeLinks.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}/${citySlug}`}
                  className="bg-light rounded px-3 py-2 text-sm text-dark hover:bg-primary hover:text-white transition-colors"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Are you a {tradeName.toLowerCase()} pro in {cityName}?</h2>
          <p className="opacity-90 mb-6">Claim your free listing and start getting leads from local homeowners.</p>
          <Link
            href="/claim"
            className="inline-block bg-white text-primary px-8 py-3 rounded font-semibold hover:bg-light transition-colors"
          >
            Claim Your Free Listing
          </Link>
        </div>
      </section>
    </>
  );
}
