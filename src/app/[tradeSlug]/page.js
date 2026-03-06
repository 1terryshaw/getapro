import { supabase } from '@/lib/supabase';
import { generateTrade } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import ListingCard from '@/components/ListingCard';
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

export async function generateMetadata({ params }) {
  const { tradeSlug } = await params;
  const tradeName = TRADES_MAP[tradeSlug];
  if (!tradeName) return {};
  return generateTrade(tradeName);
}

export default async function TradePage({ params }) {
  const { tradeSlug } = await params;
  const tradeName = TRADES_MAP[tradeSlug];
  if (!tradeName) notFound();

  // Fetch cities with listing counts for this trade
  const { data: listings } = await supabase
    .from('getapro_listings')
    .select('city, city_slug')
    .eq('trade_category', tradeName);

  const cityCountMap = {};
  (listings || []).forEach((l) => {
    if (!cityCountMap[l.city_slug]) {
      cityCountMap[l.city_slug] = { name: l.city, slug: l.city_slug, count: 0 };
    }
    cityCountMap[l.city_slug].count++;
  });
  const cities = Object.values(cityCountMap).sort((a, b) => b.count - a.count);

  // Fetch top-rated listings across Ontario
  const { data: topListings } = await supabase
    .from('getapro_listings')
    .select('*')
    .eq('trade_category', tradeName)
    .order('google_rating', { ascending: false })
    .order('google_review_count', { ascending: false })
    .limit(10);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: tradeName },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

      <section className="bg-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl md:text-4xl font-bold">
            {tradeName} in <span className="text-primary">Ontario</span>
          </h1>
          <p className="text-accent mt-2">
            Find the best {tradeName.toLowerCase()} professionals in Ontario. Rated &amp; reviewed by local homeowners.
          </p>
        </div>
      </section>

      {/* Cities for this trade */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-dark mb-6">Browse {tradeName} by City</h2>
        {cities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${tradeSlug}/${city.slug}`}
                className="bg-white rounded-lg px-4 py-3 text-center border border-gray-100 hover:border-primary hover:shadow-sm transition-all"
              >
                <span className="block text-sm font-medium text-dark">{city.name}</span>
                <span className="text-xs text-accent">{city.count} listings</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-accent">No listings found yet. Check back soon!</p>
        )}
      </section>

      {/* Top-rated listings */}
      {topListings && topListings.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark mb-6">Top Rated {tradeName} in Ontario</h2>
            <div className="grid gap-4">
              {topListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Are you a {tradeName.toLowerCase()} professional?</h2>
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
