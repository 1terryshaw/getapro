export function localBusinessSchema(listing) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.business_name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address || undefined,
      addressLocality: listing.city,
      addressRegion: listing.province || 'ON',
      postalCode: listing.postal_code || undefined,
      addressCountry: 'CA',
    },
  };

  if (listing.phone) schema.telephone = listing.phone;
  if (listing.website) schema.url = listing.website;

  if (listing.google_rating && listing.google_review_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(listing.google_rating),
      reviewCount: String(listing.google_review_count),
    };
  }

  if (listing.hours) {
    schema.openingHours = listing.hours;
  }

  return schema;
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `https://getapro.org${item.href}` : undefined,
    })),
  };
}
