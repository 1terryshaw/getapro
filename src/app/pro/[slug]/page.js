export const dynamic = 'force-dynamic';

import { getSupabase } from '@/lib/supabase';
import { generateProfile } from '@/lib/seo';
import { localBusinessSchema, breadcrumbSchema } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import InquiryForm from '@/components/InquiryForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const TRADE_SLUGS = {
  Plumbing: 'plumbing',
  'HVAC & Heating': 'hvac',
  Electrical: 'electrical',
  Landscaping: 'landscaping',
  Roofing: 'roofing',
  'General Contractor': 'general-contractor',
  Painting: 'painting',
  Fencing: 'fencing',
  'Paving & Concrete': 'paving',
  'Pest Control': 'pest-control',
  Locksmith: 'locksmith',
  'Appliance Repair': 'appliance-repair',
  'Garage Door': 'garage-door',
  Cleaning: 'cleaning',
  'Tree Service': 'tree-service',
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: listing } = await getSupabase()
    .from('getapro_listings')
    .select('business_name, trade_category, city')
    .eq('slug', slug)
    .single();

  if (!listing) return {};
  return generateProfile(listing.business_name, listing.trade_category, listing.city);
}

export default async function ProProfilePage({ params }) {
  const { slug } = await params;
  const { data: listing } = await getSupabase()
    .from('getapro_listings')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!listing) notFound();

  const tradeSlug = TRADE_SLUGS[listing.trade_category] || 'other';

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: listing.trade_category, href: `/${tradeSlug}` },
    { label: listing.city, href: `/${tradeSlug}/${listing.city_slug}` },
    { label: listing.business_name },
  ];

  const schema = localBusinessSchema(listing);

  // Parse hours if available
  let hoursDisplay = null;
  if (listing.hours && typeof listing.hours === 'object') {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    hoursDisplay = days
      .map((day) => {
        const val = listing.hours[day] || listing.hours[day.toLowerCase()];
        return val ? { day, hours: val } : null;
      })
      .filter(Boolean);
  }

  // Parse photos
  const photos = Array.isArray(listing.photos) ? listing.photos : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

      <section className="bg-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl md:text-4xl font-bold">{listing.business_name}</h1>
          <p className="text-accent mt-1">
            {listing.trade_category} in {listing.city}, Ontario
          </p>
          {listing.google_rating && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-primary text-xl font-bold">{listing.google_rating}</span>
              <span className="text-accent">/ 5</span>
              {listing.google_review_count > 0 && (
                <span className="text-accent">({listing.google_review_count} Google reviews)</span>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            {listing.description && (
              <div>
                <h2 className="text-xl font-bold text-dark mb-3">About</h2>
                <p className="text-dark leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Photos */}
            {photos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-dark mb-3">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {photos.slice(0, 6).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${listing.business_name} photo ${i + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Hours */}
            {hoursDisplay && hoursDisplay.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-dark mb-3">Hours of Operation</h2>
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                  {hoursDisplay.map((h) => (
                    <div key={h.day} className="flex justify-between py-1 text-sm">
                      <span className="font-medium text-dark">{h.day}</span>
                      <span className="text-accent">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Maps */}
            {listing.google_maps_url && (
              <div>
                <h2 className="text-xl font-bold text-dark mb-3">Location</h2>
                <a
                  href={listing.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  View on Google Maps &rarr;
                </a>
              </div>
            )}

            {/* Claim banner for unclaimed */}
            {!listing.is_claimed && (
              <div className="bg-light border border-primary/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-dark mb-2">Is this your business?</h3>
                <p className="text-accent text-sm mb-4">
                  Claim this listing for free to update your information, respond to inquiries, and get more leads.
                </p>
                <Link
                  href={`/claim/${listing.id}`}
                  className="inline-block bg-primary text-white px-6 py-2 rounded font-medium hover:bg-orange-600 transition-colors"
                >
                  Claim This Listing
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4">Contact Information</h2>
              <div className="space-y-3 text-sm">
                {listing.address && (
                  <div>
                    <span className="block text-accent">Address</span>
                    <span className="text-dark">{listing.address}</span>
                  </div>
                )}
                {listing.phone && (
                  <div>
                    <span className="block text-accent">Phone</span>
                    <a href={`tel:${listing.phone}`} className="text-primary hover:underline font-medium">
                      {listing.phone}
                    </a>
                  </div>
                )}
                {listing.email && (
                  <div>
                    <span className="block text-accent">Email</span>
                    <a href={`mailto:${listing.email}`} className="text-primary hover:underline">
                      {listing.email}
                    </a>
                  </div>
                )}
                {listing.website && (
                  <div>
                    <span className="block text-accent">Website</span>
                    <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block">
                      {listing.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Inquiry Form */}
            <InquiryForm listingId={listing.id} businessName={listing.business_name} />

            {/* Call CTA */}
            {listing.phone && (
              <div className="bg-primary rounded-lg p-6 text-white text-center">
                <h3 className="text-lg font-bold mb-2">Call Now</h3>
                <p className="text-sm opacity-90 mb-3">
                  Speak directly with {listing.business_name}
                </p>
                <a
                  href={`tel:${listing.phone}`}
                  className="inline-block bg-white text-primary px-6 py-2 rounded font-semibold hover:bg-light transition-colors w-full"
                >
                  {listing.phone}
                </a>
              </div>
            )}

            {/* MTB badge for MTB clients */}
            {listing.is_mtb_client && (
              <div className="bg-dark text-white rounded-lg p-4 text-center">
                <span className="text-primary font-bold text-sm">Premium Partner</span>
                <p className="text-xs text-accent mt-1">Verified by Marketing Team in a Box</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
