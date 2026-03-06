import { getSupabase } from '@/lib/supabase';
import ClaimForm from '@/components/ClaimForm';
import Link from 'next/link';

export const metadata = {
  title: 'Claim Your Listing — GetAPro.org',
  description: 'Claim your free business listing on GetAPro.org to manage your profile, respond to inquiries, and get more leads.',
  openGraph: {
    siteName: 'GetAPro.org',
    type: 'website',
    locale: 'en_CA',
    title: 'Claim Your Listing — GetAPro.org',
    description: 'Claim your free business listing on GetAPro.org to manage your profile, respond to inquiries, and get more leads.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claim Your Listing — GetAPro.org',
    description: 'Claim your free business listing on GetAPro.org to manage your profile, respond to inquiries, and get more leads.',
  },
};

export default async function ClaimPage({ searchParams }) {
  const params = await searchParams;
  const listingId = params?.listing;
  const error = params?.error;

  let listing = null;
  if (listingId) {
    const { data } = await getSupabase()
      .from('getapro_listings')
      .select('id, business_name, trade_category, city, is_claimed')
      .eq('id', listingId)
      .single();
    listing = data;
  }

  const errorMessages = {
    'missing-token': 'Verification link is invalid. Please try claiming again.',
    'invalid-token': 'Verification link has expired or is invalid. Please try again.',
    'config': 'Server configuration error. Please try again later.',
    'server': 'An unexpected error occurred. Please try again.',
  };

  return (
    <>
      <section className="bg-dark text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Claim Your Business Listing</h1>
          <p className="text-accent mt-3">
            Take control of your GetAPro.org profile — it&apos;s 100% free.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {error && errorMessages[error] && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{errorMessages[error]}</p>
          </div>
        )}

        {listing?.is_claimed ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold text-yellow-800 mb-2">Already Claimed</h2>
            <p className="text-yellow-700 text-sm">
              <strong>{listing.business_name}</strong> has already been claimed by another user.
            </p>
            <Link href="/" className="inline-block mt-4 text-primary hover:underline text-sm">
              Back to Home
            </Link>
          </div>
        ) : listing ? (
          <div>
            <div className="bg-light rounded-lg p-4 mb-6">
              <p className="text-sm text-accent">Claiming listing for:</p>
              <p className="font-bold text-dark text-lg">{listing.business_name}</p>
              <p className="text-sm text-accent">
                {listing.trade_category} in {listing.city}
              </p>
            </div>
            <ClaimForm listingId={listing.id} businessName={listing.business_name} />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-accent mb-4">
              Search for your business to get started, or enter your listing ID directly.
            </p>
            <ClaimSearchForm />
          </div>
        )}

        <div className="mt-10 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-dark mb-4">Why Claim Your Listing?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-dark">Update Info</p>
              <p className="text-sm text-accent mt-1">Keep your contact details, hours, and photos up to date.</p>
            </div>
            <div>
              <p className="font-semibold text-dark">Get Leads</p>
              <p className="text-sm text-accent mt-1">Receive inquiry notifications directly to your email.</p>
            </div>
            <div>
              <p className="font-semibold text-dark">Stand Out</p>
              <p className="text-sm text-accent mt-1">Claimed listings get priority placement in search results.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ClaimSearchForm() {
  return (
    <form action="/claim" method="GET" className="max-w-md mx-auto">
      <label htmlFor="listing-search" className="block text-sm font-medium text-dark mb-2">
        Enter your listing ID or contact us to find your business
      </label>
      <div className="flex gap-2">
        <input
          id="listing-search"
          name="listing"
          type="text"
          placeholder="Listing ID"
          className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Find
        </button>
      </div>
    </form>
  );
}
