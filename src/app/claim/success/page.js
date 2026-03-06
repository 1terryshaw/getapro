import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'Claim Verified — GetAPro.org',
  description: 'Your business listing has been successfully claimed on GetAPro.org.',
};

export default async function ClaimSuccessPage({ searchParams }) {
  const params = await searchParams;
  const listingId = params?.listing;
  const alreadyVerified = params?.already === 'true';

  let listing = null;
  if (listingId) {
    const { data } = await supabase
      .from('getapro_listings')
      .select('id, business_name, slug, trade_category, city')
      .eq('id', listingId)
      .single();
    listing = data;
  }

  return (
    <>
      <section className="bg-dark text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            {alreadyVerified ? 'Already Verified' : 'Listing Claimed!'}
          </h1>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-8">
          <div className="text-4xl mb-3">&#10003;</div>
          <h2 className="text-xl font-bold text-green-800 mb-2">
            {alreadyVerified
              ? 'Your listing was already verified.'
              : 'Your listing has been claimed successfully!'}
          </h2>
          {listing && (
            <p className="text-green-700">
              <strong>{listing.business_name}</strong> — {listing.trade_category} in {listing.city}
            </p>
          )}
        </div>

        {listing && (
          <div className="text-center mb-8">
            <Link
              href={`/pro/${listing.slug}`}
              className="inline-block bg-primary text-white px-6 py-2 rounded font-medium hover:bg-orange-600 transition-colors"
            >
              View Your Listing
            </Link>
          </div>
        )}

        {/* MTB Upsell Section */}
        <div className="bg-dark rounded-lg p-8 text-white">
          <div className="text-center mb-6">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Recommended for You</span>
            <h3 className="text-2xl font-bold mt-2">Grow Your Business with Marketing Team in a Box</h3>
            <p className="text-accent mt-2">
              You&apos;ve claimed your listing — now let&apos;s get you more customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl mb-2">&#128200;</div>
              <h4 className="font-semibold mb-1">Priority Placement</h4>
              <p className="text-accent text-sm">
                Featured badge and top-of-page visibility on all directory searches.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">&#128231;</div>
              <h4 className="font-semibold mb-1">Lead Management</h4>
              <p className="text-accent text-sm">
                Professional CRM, automated follow-ups, and lead tracking dashboard.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">&#127919;</div>
              <h4 className="font-semibold mb-1">Full Marketing Suite</h4>
              <p className="text-accent text-sm">
                Google Ads, SEO, social media, and reputation management — all done for you.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="https://marketingteaminabox.ca?ref=getapro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
            >
              Learn More About MTB
            </a>
            <p className="text-accent text-xs mt-3">
              GetAPro.org is powered by Marketing Team in a Box
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
