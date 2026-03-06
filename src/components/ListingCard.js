import Link from 'next/link';

function StarRating({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = [];
  for (let i = 0; i < full; i++) stars.push('full');
  if (half) stars.push('half');
  while (stars.length < 5) stars.push('empty');

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {stars.map((type, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={type === 'empty' ? '#D1D5DB' : '#FA7818'}>
          {type === 'half' ? (
            <>
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="#FA7818" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              <path fill={`url(#half-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </>
          ) : (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          )}
        </svg>
      ))}
    </span>
  );
}

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 hover:border-primary hover:shadow-md transition-all p-5">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <Link href={`/pro/${listing.slug}`} className="block group">
            <h3 className="font-semibold text-dark text-lg group-hover:text-primary transition-colors truncate">
              {listing.business_name}
            </h3>
          </Link>
          {listing.address && (
            <p className="text-sm text-accent mt-1 truncate">{listing.address}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {listing.google_rating && (
              <>
                <StarRating rating={listing.google_rating} />
                <span className="text-sm font-medium text-dark">{listing.google_rating}</span>
              </>
            )}
            {listing.google_review_count > 0 && (
              <span className="text-sm text-accent">({listing.google_review_count} reviews)</span>
            )}
          </div>
          {listing.phone && (
            <p className="text-sm text-secondary mt-2">
              <a href={`tel:${listing.phone}`} className="hover:text-primary">{listing.phone}</a>
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {listing.is_featured && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded font-medium">Featured</span>
          )}
          <Link
            href={`/pro/${listing.slug}`}
            className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors whitespace-nowrap"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
