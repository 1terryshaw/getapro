# GetAPro.org — Build Spec
## Ontario Trades Directory → MTB Flywheel

**Date:** March 5, 2026
**Stack:** Next.js 14, Supabase (shared instance: msqiynbhoeruqctaesqk), Vercel, Gmail SMTP
**Playbook:** FindYourAccountant.ca fork adapted for trades
**Domain:** getapro.org

---

## The Flywheel

```
Consumer has a problem
    → DoINeedAPro.info helps them decide
        → "Yes, you need a plumber"
            → Sends them to GetAPro.org/plumbers/toronto
                → Consumer contacts listed business
                    → Business owner sees leads coming in
                        → Claims their listing
                            → Discovers MTB
                                → Upgrades to done-for-you marketing ($197-397/mo)
```

**Revenue model:** Free listings (seeded). Claimed listings get enhanced profile. MTB upsell for full marketing system.

---

## Phase 1: MVP Build (This Sprint)

### 1. Google Places Seeder

Seed Ontario trades businesses using Google Places API. Same approach as FindYourAccountant seeder.

**Trades to seed (all at once):**
- Plumbing / Plumber
- HVAC / Heating & Cooling
- Electrical / Electrician
- Landscaping / Lawn Care
- Roofing / Roofer
- General Contractor
- Painting / Painter
- Fencing
- Paving / Concrete
- Pest Control
- Locksmith
- Appliance Repair
- Garage Door
- Cleaning / Janitorial
- Tree Service / Arborist
- Other

**Ontario cities to seed (priority order):**

Tier 1 (GTA + major):
- Toronto
- Mississauga
- Brampton
- Markham
- Vaughan
- Hamilton
- Ottawa
- London
- Kitchener-Waterloo
- Oshawa

Tier 2 (mid-size):
- Barrie
- Guelph
- Kingston
- St. Catharines
- Niagara Falls
- Windsor
- Thunder Bay
- Sudbury
- Peterborough
- Brantford
- Cambridge
- Burlington
- Oakville
- Richmond Hill
- Ajax
- Pickering
- Whitby
- Newmarket
- Aurora
- Milton

**Seeder output per listing:**
- Business name
- Address / city / province / postal code
- Phone number
- Google rating + review count
- Google Place ID (for deduplication)
- Category/trade type
- Website URL (if available)
- Google Maps link
- Hours of operation (if available)
- Photos (if available — store URLs, don't download)

**Supabase table:** `getapro_listings`

```sql
CREATE TABLE getapro_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  google_place_id TEXT UNIQUE,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  trade_category TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  province TEXT DEFAULT 'ON',
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  google_rating NUMERIC(2,1),
  google_review_count INTEGER DEFAULT 0,
  google_maps_url TEXT,
  hours JSONB,
  photos JSONB,
  description TEXT,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by UUID REFERENCES getapro_users(id),
  claimed_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT false,
  is_mtb_client BOOLEAN DEFAULT false,
  mtb_tier TEXT, -- 'starter' ($197) or 'growth' ($397)
  lead_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_getapro_trade_city ON getapro_listings(trade_category, city_slug);
CREATE INDEX idx_getapro_city ON getapro_listings(city_slug);
CREATE INDEX idx_getapro_claimed ON getapro_listings(is_claimed);
```

**Supabase table:** `getapro_users` (business owners who claim)

```sql
CREATE TABLE getapro_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  business_name TEXT,
  phone TEXT,
  listing_id UUID REFERENCES getapro_listings(id),
  claim_token TEXT UNIQUE,
  claim_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Supabase table:** `getapro_inquiries` (consumer → business)

```sql
CREATE TABLE getapro_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES getapro_listings(id) NOT NULL,
  consumer_name TEXT NOT NULL,
  consumer_email TEXT NOT NULL,
  consumer_phone TEXT,
  message TEXT NOT NULL,
  city TEXT,
  trade_category TEXT,
  status TEXT DEFAULT 'new', -- new, forwarded, responded
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Supabase table:** `getapro_trades` (trade category reference)

```sql
CREATE TABLE getapro_trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT, -- emoji or icon class
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Seed trade categories
INSERT INTO getapro_trades (name, slug, icon, sort_order) VALUES
('Plumbing', 'plumbing', '🔧', 1),
('HVAC & Heating', 'hvac', '❄️', 2),
('Electrical', 'electrical', '⚡', 3),
('Landscaping', 'landscaping', '🌿', 4),
('Roofing', 'roofing', '🏠', 5),
('General Contractor', 'general-contractor', '🔨', 6),
('Painting', 'painting', '🎨', 7),
('Fencing', 'fencing', '🏗️', 8),
('Paving & Concrete', 'paving', '🧱', 9),
('Pest Control', 'pest-control', '🐜', 10),
('Locksmith', 'locksmith', '🔑', 11),
('Appliance Repair', 'appliance-repair', '🔌', 12),
('Garage Door', 'garage-door', '🚪', 13),
('Cleaning', 'cleaning', '🧹', 14),
('Tree Service', 'tree-service', '🌳', 15),
('Other', 'other', '🛠️', 99);
```

---

### 2. Frontend Pages

**Tech:** Next.js 14 App Router, Tailwind CSS, server-side rendering for SEO

**Brand colors:**
- Primary: #FA7818 (MTB Orange)
- Secondary: #678289 (MTB Teal)
- Accent: #B4B4B6 (Silver)
- Dark: #26282C
- Light: #f4f1ec (Off-white)
- White: #FFFFFF

#### Page Structure:

**`/` — Homepage**
- Hero: "Find Trusted Pros in Ontario" + search bar (trade dropdown + city)
- Trade category grid (icons + counts)
- Top cities quick links
- "Are you a pro? Claim your free listing" CTA
- SEO: "Ontario's trusted directory for plumbers, electricians, HVAC techs, and more"

**`/[trade-slug]` — Trade category page**
- e.g., `/plumbing` → "Plumbers in Ontario"
- City list with listing counts for this trade
- Top-rated businesses across Ontario for this trade
- SEO: "Find the best plumbers in Ontario. Rated & reviewed by local homeowners."

**`/[trade-slug]/[city-slug]` — THE MONEY PAGE (trade + city)**
- e.g., `/plumbing/toronto` → "Plumbers in Toronto"
- This is the primary SEO target: "plumber toronto", "toronto plumber", "best plumber in toronto"
- Listing cards: business name, rating, review count, phone, address, "Get a Quote" button
- Sort by: rating, review count, name
- Filter by: sub-area/neighbourhood (if data available)
- Each listing card links to individual profile
- Inquiry form (consumer fills out, we forward to business)
- SEO-optimized H1, meta title, meta description per trade+city combo

**`/pro/[slug]` — Individual business profile**
- Full business details: name, address, phone, hours, Google rating, reviews count
- Google Maps embed
- Photo gallery (if available)
- "Get a Quote" inquiry form
- If unclaimed: "Is this your business? Claim it for free" banner
- If claimed: enhanced profile with description, services list, response time
- If MTB client: premium badge, featured placement, full website link

**`/claim/[listing-id]` — Claim flow**
- Step 1: Verify business ownership (email or phone verification)
- Step 2: Create account (email, password)
- Step 3: Enhance profile (add description, services, photos)
- Step 4: "Want more leads? See what Marketing Team in a Box can do" → MTB CTA
- Email notification to admin on new claims

**`/cities` — All cities page**
- Alphabetical list of all Ontario cities with listing counts
- Internal linking goldmine for SEO

**`/about` — About page**
- "Ontario's free directory for finding trusted trade professionals"
- How it works (for consumers + for businesses)
- Claim your listing CTA

**`/admin/getapro` — Admin dashboard (password-protected)**
- Total listings by trade, by city
- Claims pending / verified
- Inquiries log
- Lead metrics (inquiries per listing, conversion to MTB)
- Seeder status / run controls

---

### 3. Inquiry System (Consumer → Business)

When a consumer submits "Get a Quote" on a listing:

1. Save to `getapro_inquiries` table
2. If business has email → forward inquiry via Gmail SMTP
3. If business is unclaimed (no email) → store for when they claim
4. Increment `lead_count` on listing
5. Send consumer a confirmation email
6. If unclaimed business gets 3+ inquiries → trigger "claim prompt" email to business (if we can find email from Google data)

**Email template (forwarded to business):**
```
Subject: New Lead from GetAPro.org — [Consumer Name] needs [Trade]

Hi [Business Name],

Someone in [City] is looking for a [trade] and found you on GetAPro.org.

Name: [consumer_name]
Email: [consumer_email]
Phone: [consumer_phone]
Message: [message]

Reply directly to this email to respond to them.

---
Want more leads like this? Claim your free listing at getapro.org/claim/[id]
```

---

### 4. Claim-to-MTB Bridge

The MTB upsell happens at two points:

**Point 1: Post-claim onboarding**
After claiming, business owner sees a dashboard with:
- Their listing stats (views, inquiries)
- "Your competitors in [city] are getting more leads. Here's why."
- Free marketing audit (Bullshit Detector scan of their current website)
- CTA: "Get Marketing Team in a Box — $197/mo, everything handled"
- Link to: marketingteaminabox.com/call?source=getapro&trade=[trade]&city=[city]

**Point 2: Inquiry notification emails**
Every forwarded lead includes a footer:
- "You're getting [X] leads/month from GetAPro. Want 10x more?"
- "Marketing Team in a Box handles your website, Google, reviews, and follow-up. $197/mo."
- Link to MTB /call with UTM params

---

### 5. DoINeedAPro.info Integration

Update DoINeedAPro to include outbound links to GetAPro:

- When AI chat responds "Yes, you should hire a professional" → show GetAPro link
- "Find trusted [plumbers] in your area → getapro.org/plumbing/[city]"
- If user shares their city in chat, deep-link to that specific city+trade page
- Add a sidebar/footer section: "Ready to hire? Find a pro → getapro.org"

---

### 6. SEO Strategy

**Primary target pages:** `/[trade]/[city]` combinations
- 16 trades × 30 cities = **480 SEO landing pages**
- Each with unique H1, meta title, meta description
- Schema markup: LocalBusiness JSON-LD on each listing

**Meta title formula:**
`Best [Trade] in [City], Ontario | GetAPro.org`
e.g., "Best Plumbers in Toronto, Ontario | GetAPro.org"

**Meta description formula:**
`Find top-rated [trade professionals] in [City]. Compare ratings, read reviews, and get free quotes from trusted local pros. [X] [trade] businesses listed.`

**Schema per listing:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "address": { "@type": "PostalAddress", "addressLocality": "Toronto", "addressRegion": "ON" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "123" },
  "telephone": "+1-416-555-0000"
}
```

**Internal linking:**
- Homepage → trade pages → city pages → individual profiles
- City pages cross-link to other trades in same city
- Trade pages cross-link to same trade in other cities
- Breadcrumbs on every page: Home > [Trade] > [City] > [Business]

**Sitemap:** Auto-generated, submitted to Google Search Console

---

## File Structure

```
getapro/
├── CLAUDE.md
├── OPERATIONS.md
├── POST-BUILD.md
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
├── public/
│   ├── favicon.ico
│   ├── logos/
│   │   └── getapro-logo.svg
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.js          (root layout, nav, footer)
│   │   ├── page.js            (homepage)
│   │   ├── cities/
│   │   │   └── page.js        (all cities)
│   │   ├── about/
│   │   │   └── page.js
│   │   ├── claim/
│   │   │   └── [listingId]/
│   │   │       └── page.js    (claim flow)
│   │   ├── pro/
│   │   │   └── [slug]/
│   │   │       └── page.js    (individual profile)
│   │   ├── admin/
│   │   │   └── getapro/
│   │   │       └── page.js    (admin dashboard)
│   │   └── [tradeSlug]/
│   │       ├── page.js        (trade category)
│   │       └── [citySlug]/
│   │           └── page.js    (trade + city = money page)
│   ├── components/
│   │   ├── ListingCard.js
│   │   ├── InquiryForm.js
│   │   ├── SearchBar.js
│   │   ├── TradeGrid.js
│   │   ├── ClaimBanner.js
│   │   ├── MTBUpsell.js
│   │   └── Breadcrumbs.js
│   └── lib/
│       ├── supabase.js
│       ├── email.js           (Gmail SMTP via nodemailer)
│       └── seo.js             (meta generators)
├── scripts/
│   └── seed-google-places.js  (seeder script)
```

---

## Environment Variables (.env.local)

```bash
# ============================================
# GetAPro.org Environment Variables
# ============================================

# --- Supabase (shared instance) ---
# Dashboard: https://supabase.com/dashboard/project/msqiynbhoeruqctaesqk
NEXT_PUBLIC_SUPABASE_URL=https://msqiynbhoeruqctaesqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_HERE
SUPABASE_SERVICE_ROLE_KEY=PASTE_HERE

# --- Google Places API ---
# Console: https://console.cloud.google.com/apis/credentials
GOOGLE_PLACES_API_KEY=PASTE_HERE

# --- Gmail SMTP ---
# App Password: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=PASTE_HERE
SMTP_PASS=PASTE_HERE
SMTP_FROM=noreply@getapro.org

# --- Admin ---
ADMIN_PASSWORD=PASTE_HERE

# --- Site ---
NEXT_PUBLIC_SITE_URL=https://getapro.org
```

---

## OPERATIONS.md Template

```markdown
# GetAPro.org — Operations

## Live URLs
- Production: https://getapro.org
- Admin: https://getapro.org/admin/getapro
- Vercel: https://vercel.com/terrys-projects/getapro

## Database
- Instance: msqiynbhoeruqctaesqk (shared)
- Tables: getapro_listings, getapro_users, getapro_inquiries, getapro_trades
- Dashboard: https://supabase.com/dashboard/project/msqiynbhoeruqctaesqk

## Email
- Gmail SMTP (nodemailer)
- Inquiry forwarding: consumer → business
- Claim notifications: business → admin

## Seeder
- Script: scripts/seed-google-places.js
- API: Google Places Nearby Search
- Run: node scripts/seed-google-places.js --trade plumbing --city toronto

## Deploy
- git pull && npx vercel --prod

## Key Metrics
- Total listings: check admin dashboard
- Claims: check admin dashboard
- Inquiries: check admin dashboard
- MTB conversions: track via UTM params on /call
```

---

## Phase 2: Post-MVP (After seeding + launch)

- **Bullshit Detector integration** — offer free website scan during claim flow
- **MTB client badge** — premium placement, verified badge, priority in listings
- **Review aggregation** — pull Google reviews for richer profiles
- **Blog/content** — "How to choose a plumber in Toronto" style SEO articles
- **US expansion** — re-run seeder against Boise, Knoxville, Greenville, Colorado Springs, Raleigh, Tucson
- **Neighbourhood pages** — `/plumbing/toronto/north-york` for deeper local SEO
- **Automated claim outreach** — email businesses with 3+ unclaimed inquiries

---

## GSD Session Plan

### Session 1: Foundation
1. `git init → gh repo create getapro → push` (then CCW disconnect/reconnect cycle)
2. Next.js 14 scaffold with App Router
3. Tailwind config with brand colors
4. Supabase tables (all 4)
5. Root layout with nav + footer
6. Homepage with search bar + trade grid
7. Favicon

### Session 2: Seeder
1. Google Places seeder script
2. Seed Tier 1 cities (10 cities × 16 trades)
3. Verify data in Supabase
4. Seed Tier 2 cities

### Session 3: Directory Pages
1. `/[tradeSlug]` trade category pages
2. `/[tradeSlug]/[citySlug]` money pages with listings
3. `/pro/[slug]` individual profiles
4. `/cities` all cities page
5. ListingCard, Breadcrumbs, SearchBar components
6. SEO meta tags + JSON-LD schema on all pages

### Session 4: Inquiry + Claim
1. InquiryForm component + API route
2. Gmail SMTP forwarding
3. `/claim/[listingId]` flow
4. Claim verification (email)
5. Post-claim MTB upsell page
6. Admin dashboard

### Session 5: Polish + Launch
1. DoINeedAPro.info integration links
2. Sitemap generation
3. Google Search Console setup
4. OG images
5. Mobile responsiveness pass
6. Deploy to Vercel on getapro.org domain
7. Smoke test all flows

---

## Success Metrics

| Metric | Target (30 days) | Target (90 days) |
|--------|-------------------|-------------------|
| Listings seeded | 5,000+ | 10,000+ |
| Pages indexed by Google | 200+ | 500+ |
| Organic search impressions | 1,000+ | 10,000+ |
| Consumer inquiries | 10+ | 100+ |
| Business claims | 5+ | 50+ |
| MTB conversions | 1+ | 5+ |
