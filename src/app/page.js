export const dynamic = 'force-dynamic';

import SearchBar from '@/components/SearchBar';
import TradeGrid from '@/components/TradeGrid';
import Link from 'next/link';

const TOP_CITIES = [
  { name: 'Toronto', slug: 'toronto' },
  { name: 'Mississauga', slug: 'mississauga' },
  { name: 'Brampton', slug: 'brampton' },
  { name: 'Hamilton', slug: 'hamilton' },
  { name: 'Ottawa', slug: 'ottawa' },
  { name: 'London', slug: 'london' },
  { name: 'Kitchener', slug: 'kitchener' },
  { name: 'Markham', slug: 'markham' },
  { name: 'Vaughan', slug: 'vaughan' },
  { name: 'Oshawa', slug: 'oshawa' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Trusted <span className="text-primary">Pros</span> in Ontario
          </h1>
          <p className="text-accent text-lg mb-8">
            Ontario&apos;s trusted directory for plumbers, electricians, HVAC techs, and more.
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Trade Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-dark mb-6 text-center">Browse by Trade</h2>
        <TradeGrid />
      </section>

      {/* Top Cities */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-dark mb-6 text-center">Top Cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {TOP_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/plumbing/${city.slug}`}
                className="bg-light rounded-lg px-4 py-3 text-center text-sm font-medium text-dark hover:bg-primary hover:text-white transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/cities" className="text-primary font-medium hover:underline">
              View all cities &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA for Pros */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a pro?</h2>
          <p className="text-lg mb-6 opacity-90">
            Claim your free listing and start getting leads from local homeowners.
          </p>
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
