# GetAPro.org — Operations Guide

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Email**: Nodemailer via Gmail SMTP
- **Hosting**: Vercel (recommended)

## Environment Variables

All required env vars are documented in `.env.local.example`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `SMTP_HOST` | SMTP server hostname (default: smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (default: 587) |
| `SMTP_USER` | Gmail address for sending emails |
| `SMTP_PASS` | Gmail App Password (not your regular password) |
| `SMTP_FROM` | From address for outgoing emails |
| `ADMIN_PASSWORD` | Password for /admin dashboard |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (https://getapro.org) |

## Gmail SMTP Setup

1. Enable 2-Factor Authentication on the Gmail account
2. Go to Google Account > Security > App Passwords
3. Generate an App Password for "Mail"
4. Use that 16-character password as `SMTP_PASS`

## Database

Schema is defined in `supabase/migrations/001_create_tables.sql`. Key table:

- `getapro_listings` — all business listings with trade category, city, ratings, contact info, claim status

## Data Seeding

Run `scripts/seed-google-places.js` to populate listings from Google Places API. Requires `GOOGLE_PLACES_API_KEY`.

## Key Routes

| Route | Purpose |
|---|---|
| `/` | Homepage with search, trade grid, top cities |
| `/[tradeSlug]` | Trade category page (e.g., /plumbing) |
| `/[tradeSlug]/[citySlug]` | Trade + city directory (e.g., /plumbing/toronto) |
| `/pro/[slug]` | Individual business profile |
| `/cities` | All cities index |
| `/about` | How it works page |
| `/claim` | Business listing claim flow |
| `/admin/getapro` | Admin dashboard (password protected) |
| `/sitemap.xml` | Auto-generated sitemap |

## API Routes

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/inquiries` | POST | Submit customer inquiry, sends email notification |
| `/api/claim/start` | POST | Start claim process, sends verification email |
| `/api/claim/verify` | GET | Verify claim token, mark listing as claimed |
| `/api/admin/login` | POST | Admin authentication |

## Monitoring

- Check Vercel deployment logs for build/runtime errors
- Monitor Supabase dashboard for database health
- Check email delivery via Gmail Sent folder
- Admin dashboard at `/admin/getapro` shows inquiry/claim metrics

## Common Tasks

### Add a new trade category
1. Add slug/name to `TRADES_MAP` in `src/app/[tradeSlug]/page.js` and `src/app/[tradeSlug]/[citySlug]/page.js`
2. Add to `TRADE_SLUGS` in `src/app/pro/[slug]/page.js`
3. Add to `TRADES` array in `src/components/TradeGrid.js` and `src/components/SearchBar.js`
4. Add to `TRADE_SLUGS` array in `src/app/sitemap.js`
5. Seed listings for the new trade via the seed script

### Add a new city to search dropdown
1. Add to `CITIES` array in `src/components/SearchBar.js`
2. Add to `TOP_CITIES` in `src/app/page.js` if it should appear on homepage
