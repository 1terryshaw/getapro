const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://getapro.org';

const DEFAULT_OG = {
  siteName: 'GetAPro.org',
  type: 'website',
  locale: 'en_CA',
};

export function generateTradeCity(tradeName, cityName, count) {
  const title = `Best ${tradeName} in ${cityName}, Ontario | GetAPro.org`;
  const description = `Find top-rated ${tradeName.toLowerCase()} professionals in ${cityName}. Compare ratings, read reviews, and get free quotes from trusted local pros.${count ? ` ${count} businesses listed.` : ''}`;
  return {
    title,
    description,
    openGraph: { ...DEFAULT_OG, title, description, url: BASE_URL },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function generateTrade(tradeName) {
  const title = `${tradeName} in Ontario | GetAPro.org`;
  const description = `Find the best ${tradeName.toLowerCase()} professionals in Ontario. Rated & reviewed by local homeowners.`;
  return {
    title,
    description,
    openGraph: { ...DEFAULT_OG, title, description, url: BASE_URL },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function generateProfile(businessName, tradeName, cityName) {
  const title = `${businessName} — ${tradeName} in ${cityName} | GetAPro.org`;
  const description = `${businessName} — trusted ${tradeName.toLowerCase()} professional in ${cityName}, Ontario. View ratings, reviews, and get a free quote.`;
  return {
    title,
    description,
    openGraph: { ...DEFAULT_OG, title, description, url: BASE_URL },
    twitter: { card: 'summary_large_image', title, description },
  };
}
