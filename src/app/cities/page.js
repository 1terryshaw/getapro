export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { getSupabase } from '@/lib/supabase';
import { breadcrumbSchema } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const metadata = {
  title: 'All Cities — Find Pros Across Ontario | GetAPro.org',
  description:
    'Browse all Ontario cities with trusted trade professionals. Find plumbers, electricians, HVAC techs, roofers, and more in your city.',
  openGraph: {
    siteName: 'GetAPro.org',
    type: 'website',
    locale: 'en_CA',
    title: 'All Cities — Find Pros Across Ontario | GetAPro.org',
    description: 'Browse all Ontario cities with trusted trade professionals. Find plumbers, electricians, HVAC techs, roofers, and more in your city.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Cities — Find Pros Across Ontario | GetAPro.org',
    description: 'Browse all Ontario cities with trusted trade professionals. Find plumbers, electricians, HVAC techs, roofers, and more in your city.',
  },
};

export default async function CitiesPage() {
  const { data: listings, error: listingsError } = await getSupabase()
    .from('getapro_listings')
    .select('city, city_slug');
  if (listingsError) console.error('[CitiesPage] listings query error:', listingsError);

  const cityMap = {};
  (listings || []).forEach((l) => {
    if (!cityMap[l.city_slug]) {
      cityMap[l.city_slug] = { name: l.city, slug: l.city_slug, count: 0 };
    }
    cityMap[l.city_slug].count++;
  });

  const cities = Object.values(cityMap).sort((a, b) => a.name.localeCompare(b.name));

  // Group by first letter
  const grouped = {};
  cities.forEach((city) => {
    const letter = city.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(city);
  });
  const letters = Object.keys(grouped).sort();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'All Cities' },
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
            All Cities in <span className="text-primary">Ontario</span>
          </h1>
          <p className="text-accent mt-2">
            Browse {cities.length} cities with trade professionals listed on GetAPro.org.
          </p>
        </div>
      </section>

      {/* Letter navigation */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex flex-wrap gap-2">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-sm font-medium text-dark hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      </section>

      {/* City listings grouped by letter */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {letters.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="mb-8">
            <h2 className="text-xl font-bold text-dark mb-3 border-b border-gray-200 pb-2">{letter}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {grouped[letter].map((city) => (
                <Link
                  key={city.slug}
                  href={`/plumbing/${city.slug}`}
                  className="bg-white rounded-lg px-4 py-3 border border-gray-100 hover:border-primary hover:shadow-sm transition-all flex justify-between items-center"
                >
                  <span className="font-medium text-dark">{city.name}</span>
                  <span className="text-xs text-accent">{city.count} pros</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {cities.length === 0 && (
          <p className="text-center text-accent py-16">No cities with listings found yet. Check back soon!</p>
        )}
      </section>
    </>
  );
}
