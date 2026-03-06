#!/usr/bin/env node

/**
 * Google Places Seeder for GetAPro.org
 *
 * Seeds Ontario trades businesses into the getapro_listings table
 * using the Google Places Nearby Search API.
 *
 * Usage:
 *   node scripts/seed-google-places.js                          # Seed all Tier 1 cities, all trades
 *   node scripts/seed-google-places.js --trade plumbing         # Seed one trade, all Tier 1 cities
 *   node scripts/seed-google-places.js --city toronto           # Seed one city, all trades
 *   node scripts/seed-google-places.js --trade plumbing --city toronto  # Seed one combo
 *   node scripts/seed-google-places.js --tier 2                 # Seed Tier 2 cities
 *   node scripts/seed-google-places.js --all                    # Seed all tiers
 *   node scripts/seed-google-places.js --dry-run                # Preview without inserting
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GOOGLE_API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY in .env.local');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Trade definitions: slug -> Google Places search keyword
const TRADES = {
  plumbing: { name: 'Plumbing', keyword: 'plumber' },
  hvac: { name: 'HVAC & Heating', keyword: 'HVAC heating cooling' },
  electrical: { name: 'Electrical', keyword: 'electrician' },
  landscaping: { name: 'Landscaping', keyword: 'landscaping lawn care' },
  roofing: { name: 'Roofing', keyword: 'roofing roofer' },
  'general-contractor': { name: 'General Contractor', keyword: 'general contractor' },
  painting: { name: 'Painting', keyword: 'painter painting contractor' },
  fencing: { name: 'Fencing', keyword: 'fencing contractor fence installation' },
  paving: { name: 'Paving & Concrete', keyword: 'paving concrete contractor' },
  'pest-control': { name: 'Pest Control', keyword: 'pest control exterminator' },
  locksmith: { name: 'Locksmith', keyword: 'locksmith' },
  'appliance-repair': { name: 'Appliance Repair', keyword: 'appliance repair' },
  'garage-door': { name: 'Garage Door', keyword: 'garage door repair installation' },
  cleaning: { name: 'Cleaning', keyword: 'cleaning service janitorial' },
  'tree-service': { name: 'Tree Service', keyword: 'tree service arborist tree removal' },
  other: { name: 'Other', keyword: 'handyman home repair' },
};

// City definitions with lat/lng for Nearby Search
const TIER_1_CITIES = {
  toronto: { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
  mississauga: { name: 'Mississauga', lat: 43.5890, lng: -79.6441 },
  brampton: { name: 'Brampton', lat: 43.7315, lng: -79.7624 },
  markham: { name: 'Markham', lat: 43.8561, lng: -79.3370 },
  vaughan: { name: 'Vaughan', lat: 43.8361, lng: -79.4983 },
  hamilton: { name: 'Hamilton', lat: 43.2557, lng: -79.8711 },
  ottawa: { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },
  london: { name: 'London', lat: 42.9849, lng: -81.2453 },
  'kitchener-waterloo': { name: 'Kitchener-Waterloo', lat: 43.4516, lng: -80.4925 },
  oshawa: { name: 'Oshawa', lat: 43.8971, lng: -78.8658 },
};

const TIER_2_CITIES = {
  barrie: { name: 'Barrie', lat: 44.3894, lng: -79.6903 },
  guelph: { name: 'Guelph', lat: 43.5448, lng: -80.2482 },
  kingston: { name: 'Kingston', lat: 44.2312, lng: -76.4860 },
  'st-catharines': { name: 'St. Catharines', lat: 43.1594, lng: -79.2469 },
  'niagara-falls': { name: 'Niagara Falls', lat: 43.0896, lng: -79.0849 },
  windsor: { name: 'Windsor', lat: 42.3149, lng: -83.0364 },
  'thunder-bay': { name: 'Thunder Bay', lat: 48.3809, lng: -89.2477 },
  sudbury: { name: 'Sudbury', lat: 46.4917, lng: -80.9930 },
  peterborough: { name: 'Peterborough', lat: 44.3091, lng: -78.3197 },
  brantford: { name: 'Brantford', lat: 43.1394, lng: -80.2644 },
  cambridge: { name: 'Cambridge', lat: 43.3616, lng: -80.3144 },
  burlington: { name: 'Burlington', lat: 43.3255, lng: -79.7990 },
  oakville: { name: 'Oakville', lat: 43.4675, lng: -79.6877 },
  'richmond-hill': { name: 'Richmond Hill', lat: 43.8828, lng: -79.4403 },
  ajax: { name: 'Ajax', lat: 43.8509, lng: -79.0204 },
  pickering: { name: 'Pickering', lat: 43.8354, lng: -79.0868 },
  whitby: { name: 'Whitby', lat: 43.8975, lng: -78.9429 },
  newmarket: { name: 'Newmarket', lat: 44.0592, lng: -79.4613 },
  aurora: { name: 'Aurora', lat: 44.0065, lng: -79.4504 },
  milton: { name: 'Milton', lat: 43.5183, lng: -79.8774 },
};

const SEARCH_RADIUS = 15000; // 15km radius
const RATE_LIMIT_MS = 300; // delay between API calls to stay under quota

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateListingSlug(businessName, citySlug) {
  const nameSlug = slugify(businessName);
  return `${nameSlug}-${citySlug}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--trade' && args[i + 1]) {
      flags.trade = args[++i];
    } else if (args[i] === '--city' && args[i + 1]) {
      flags.city = args[++i];
    } else if (args[i] === '--tier' && args[i + 1]) {
      flags.tier = parseInt(args[++i], 10);
    } else if (args[i] === '--all') {
      flags.all = true;
    } else if (args[i] === '--dry-run') {
      flags.dryRun = true;
    }
  }
  return flags;
}

// ---------------------------------------------------------------------------
// Google Places API (Nearby Search)
// ---------------------------------------------------------------------------

async function searchNearby(keyword, lat, lng, pageToken) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('key', GOOGLE_API_KEY);
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', SEARCH_RADIUS);
  url.searchParams.set('keyword', keyword);
  url.searchParams.set('type', 'establishment');
  if (pageToken) {
    url.searchParams.set('pagetoken', pageToken);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Places API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function getPlaceDetails(placeId) {
  const fields = [
    'place_id',
    'name',
    'formatted_address',
    'formatted_phone_number',
    'website',
    'rating',
    'user_ratings_total',
    'url',
    'opening_hours',
    'photos',
    'address_components',
  ].join(',');

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('key', GOOGLE_API_KEY);
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', fields);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Place Details API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.result;
}

function extractAddressComponent(components, type) {
  if (!components) return null;
  const c = components.find((comp) => comp.types.includes(type));
  return c ? c.long_name : null;
}

function extractPostalCode(components) {
  return extractAddressComponent(components, 'postal_code');
}

function extractCity(components) {
  return extractAddressComponent(components, 'locality');
}

function buildPhotoUrls(photos) {
  if (!photos || photos.length === 0) return null;
  return photos.slice(0, 5).map((p) => ({
    url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${GOOGLE_API_KEY}`,
    width: p.width,
    height: p.height,
  }));
}

function formatHours(openingHours) {
  if (!openingHours || !openingHours.weekday_text) return null;
  return openingHours.weekday_text;
}

// ---------------------------------------------------------------------------
// Seeding Logic
// ---------------------------------------------------------------------------

async function seedTradeCity(tradeSlug, trade, citySlug, city, dryRun) {
  console.log(`\n--- Seeding: ${trade.name} in ${city.name} ---`);

  const keyword = `${trade.keyword} ${city.name} Ontario`;
  let allPlaceIds = new Set();
  let pageToken = null;
  let page = 0;

  // Collect place IDs from Nearby Search (up to 3 pages = 60 results)
  do {
    if (pageToken) {
      // Google requires a short delay before using next_page_token
      await sleep(2000);
    }
    const data = await searchNearby(keyword, city.lat, city.lng, pageToken);

    if (data.status === 'ZERO_RESULTS') {
      console.log(`  No results found.`);
      break;
    }
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`  API error: ${data.status} - ${data.error_message || ''}`);
      break;
    }

    for (const place of data.results || []) {
      allPlaceIds.add(place.place_id);
    }
    page++;
    pageToken = data.next_page_token || null;
    console.log(`  Page ${page}: found ${(data.results || []).length} results (total unique: ${allPlaceIds.size})`);
  } while (pageToken && page < 3);

  if (allPlaceIds.size === 0) {
    console.log(`  Skipping - no results.`);
    return { inserted: 0, skipped: 0, errors: 0 };
  }

  // Check which place IDs already exist in the database
  const { data: existing } = await supabase
    .from('getapro_listings')
    .select('google_place_id')
    .in('google_place_id', [...allPlaceIds]);

  const existingIds = new Set((existing || []).map((r) => r.google_place_id));
  const newPlaceIds = [...allPlaceIds].filter((id) => !existingIds.has(id));

  console.log(`  ${existingIds.size} already in DB, ${newPlaceIds.length} new to fetch details for.`);

  if (dryRun) {
    console.log(`  [DRY RUN] Would fetch details for ${newPlaceIds.length} places.`);
    return { inserted: 0, skipped: existingIds.size, errors: 0 };
  }

  let inserted = 0;
  let errors = 0;

  for (const placeId of newPlaceIds) {
    try {
      await sleep(RATE_LIMIT_MS);
      const details = await getPlaceDetails(placeId);
      if (!details || !details.name) {
        errors++;
        continue;
      }

      const detailCity = extractCity(details.address_components) || city.name;
      const listingCitySlug = slugify(detailCity);
      const baseSlug = generateListingSlug(details.name, listingCitySlug);

      // Ensure slug uniqueness by checking DB
      let slug = baseSlug;
      let slugSuffix = 1;
      while (true) {
        const { data: slugCheck } = await supabase
          .from('getapro_listings')
          .select('id')
          .eq('slug', slug)
          .limit(1);
        if (!slugCheck || slugCheck.length === 0) break;
        slugSuffix++;
        slug = `${baseSlug}-${slugSuffix}`;
      }

      const listing = {
        google_place_id: placeId,
        business_name: details.name,
        slug,
        trade_category: tradeSlug,
        address: details.formatted_address || null,
        city: detailCity,
        city_slug: listingCitySlug,
        province: 'ON',
        postal_code: extractPostalCode(details.address_components),
        phone: details.formatted_phone_number || null,
        website: details.website || null,
        google_rating: details.rating || null,
        google_review_count: details.user_ratings_total || 0,
        google_maps_url: details.url || null,
        hours: formatHours(details.opening_hours),
        photos: buildPhotoUrls(details.photos),
      };

      const { error } = await supabase
        .from('getapro_listings')
        .upsert(listing, { onConflict: 'google_place_id' });

      if (error) {
        console.error(`  Error inserting ${details.name}: ${error.message}`);
        errors++;
      } else {
        inserted++;
        if (inserted % 10 === 0) {
          console.log(`  Inserted ${inserted}/${newPlaceIds.length}...`);
        }
      }
    } catch (err) {
      console.error(`  Error processing place ${placeId}: ${err.message}`);
      errors++;
    }
  }

  console.log(`  Done: ${inserted} inserted, ${existingIds.size} skipped (existing), ${errors} errors.`);
  return { inserted, skipped: existingIds.size, errors };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const flags = parseArgs();
  console.log('GetAPro.org — Google Places Seeder');
  console.log('==================================');
  if (flags.dryRun) console.log('[DRY RUN MODE]');

  // Determine which cities to seed
  let cities;
  if (flags.city) {
    const allCities = { ...TIER_1_CITIES, ...TIER_2_CITIES };
    if (!allCities[flags.city]) {
      console.error(`Unknown city: ${flags.city}`);
      console.error(`Valid cities: ${Object.keys(allCities).join(', ')}`);
      process.exit(1);
    }
    cities = { [flags.city]: allCities[flags.city] };
  } else if (flags.all) {
    cities = { ...TIER_1_CITIES, ...TIER_2_CITIES };
  } else if (flags.tier === 2) {
    cities = { ...TIER_2_CITIES };
  } else {
    // Default: Tier 1
    cities = { ...TIER_1_CITIES };
  }

  // Determine which trades to seed
  let trades;
  if (flags.trade) {
    if (!TRADES[flags.trade]) {
      console.error(`Unknown trade: ${flags.trade}`);
      console.error(`Valid trades: ${Object.keys(TRADES).join(', ')}`);
      process.exit(1);
    }
    trades = { [flags.trade]: TRADES[flags.trade] };
  } else {
    trades = { ...TRADES };
  }

  console.log(`\nCities (${Object.keys(cities).length}): ${Object.values(cities).map((c) => c.name).join(', ')}`);
  console.log(`Trades (${Object.keys(trades).length}): ${Object.values(trades).map((t) => t.name).join(', ')}`);
  console.log(`Total combinations: ${Object.keys(cities).length * Object.keys(trades).length}`);

  const totals = { inserted: 0, skipped: 0, errors: 0 };

  for (const [citySlug, city] of Object.entries(cities)) {
    for (const [tradeSlug, trade] of Object.entries(trades)) {
      const result = await seedTradeCity(tradeSlug, trade, citySlug, city, flags.dryRun);
      totals.inserted += result.inserted;
      totals.skipped += result.skipped;
      totals.errors += result.errors;

      // Rate limit between city+trade combos
      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log('\n==================================');
  console.log('Seeding Complete!');
  console.log(`  Total inserted: ${totals.inserted}`);
  console.log(`  Total skipped (existing): ${totals.skipped}`);
  console.log(`  Total errors: ${totals.errors}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
