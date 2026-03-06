import Link from 'next/link';

export const metadata = {
  title: 'About GetAPro.org — How It Works | GetAPro.org',
  description:
    'Learn how GetAPro.org connects Ontario homeowners with trusted trade professionals. Free for consumers, free for businesses.',
  openGraph: {
    siteName: 'GetAPro.org',
    type: 'website',
    locale: 'en_CA',
    title: 'About GetAPro.org — How It Works',
    description: 'Learn how GetAPro.org connects Ontario homeowners with trusted trade professionals. Free for consumers, free for businesses.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About GetAPro.org — How It Works',
    description: 'Learn how GetAPro.org connects Ontario homeowners with trusted trade professionals.',
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-primary">GetAPro</span>.org
          </h1>
          <p className="text-accent text-lg max-w-2xl mx-auto">
            Ontario&apos;s free directory connecting homeowners with trusted, rated trade professionals.
          </p>
        </div>
      </section>

      {/* How it works for consumers */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-dark mb-8 text-center">How It Works for Homeowners</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold text-dark mb-2">Search by Trade & City</h3>
            <p className="text-sm text-secondary">
              Browse 15 trade categories across hundreds of Ontario cities. Find exactly what you need, where you need it.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold text-dark mb-2">Compare Ratings & Reviews</h3>
            <p className="text-sm text-secondary">
              Every listing includes Google ratings, review counts, contact information, and business hours so you can make informed decisions.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold text-dark mb-2">Get a Free Quote</h3>
            <p className="text-sm text-secondary">
              Send an inquiry directly to any pro through our site. No sign-up required, no fees, no obligation.
            </p>
          </div>
        </div>
      </section>

      {/* How it works for businesses */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-dark mb-8 text-center">How It Works for Businesses</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-dark mb-2">You&apos;re Already Listed</h3>
              <p className="text-sm text-secondary">
                We pull listings from Google Places so your business may already be on GetAPro.org with your ratings and reviews.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-dark mb-2">Claim Your Profile</h3>
              <p className="text-sm text-secondary">
                Verify your email to claim your listing. Update your contact details, hours, photos, and description for free.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-dark mb-2">Receive Leads</h3>
              <p className="text-sm text-secondary">
                Get inquiry notifications sent directly to your email when homeowners request quotes through your listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-dark mb-8 text-center">Why GetAPro.org?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-semibold text-dark mb-2">100% Free</h3>
            <p className="text-sm text-secondary">
              No fees for homeowners or businesses. No hidden charges, no pay-per-lead, no subscriptions.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-semibold text-dark mb-2">Real Google Ratings</h3>
            <p className="text-sm text-secondary">
              Listings display actual Google ratings and review counts so you see what real customers think.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-semibold text-dark mb-2">Ontario Focused</h3>
            <p className="text-sm text-secondary">
              Built specifically for Ontario homeowners and trade professionals. Local expertise, local results.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="font-semibold text-dark mb-2">No Sign-Up Required</h3>
            <p className="text-sm text-secondary">
              Browse listings and send inquiries without creating an account. Get connected to pros in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find a Pro?</h2>
          <p className="text-lg mb-6 opacity-90">
            Browse thousands of rated trade professionals across Ontario.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-white text-primary px-8 py-3 rounded font-semibold hover:bg-light transition-colors"
            >
              Search for a Pro
            </Link>
            <Link
              href="/claim"
              className="inline-block bg-dark text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors"
            >
              Claim Your Business
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
