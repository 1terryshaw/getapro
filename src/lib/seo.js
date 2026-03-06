export function generateTradeCity(tradeName, cityName, count) {
  return {
    title: `Best ${tradeName} in ${cityName}, Ontario | GetAPro.org`,
    description: `Find top-rated ${tradeName.toLowerCase()} professionals in ${cityName}. Compare ratings, read reviews, and get free quotes from trusted local pros.${count ? ` ${count} businesses listed.` : ''}`,
  };
}

export function generateTrade(tradeName) {
  return {
    title: `${tradeName} in Ontario | GetAPro.org`,
    description: `Find the best ${tradeName.toLowerCase()} professionals in Ontario. Rated & reviewed by local homeowners.`,
  };
}

export function generateProfile(businessName, tradeName, cityName) {
  return {
    title: `${businessName} — ${tradeName} in ${cityName} | GetAPro.org`,
    description: `${businessName} — trusted ${tradeName.toLowerCase()} professional in ${cityName}, Ontario. View ratings, reviews, and get a free quote.`,
  };
}
