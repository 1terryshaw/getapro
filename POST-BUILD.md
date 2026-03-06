# GetAPro.org — Post-Build Checklist

## Pre-Launch

- [ ] Set all environment variables in Vercel project settings
- [ ] Verify Supabase database has listings populated
- [ ] Test Gmail SMTP by submitting an inquiry on a listing
- [ ] Test claim flow end-to-end (start claim > receive email > verify)
- [ ] Verify admin dashboard login works at `/admin/getapro`
- [ ] Check sitemap.xml renders correctly at `/sitemap.xml`
- [ ] Submit sitemap to Google Search Console
- [ ] Verify OG tags render correctly (use https://developers.facebook.com/tools/debug/)
- [ ] Test all pages on mobile (iPhone Safari, Android Chrome)
- [ ] Verify favicon displays correctly

## DNS & Domain

- [ ] Point `getapro.org` DNS to Vercel
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://getapro.org` in production env

## SEO

- [ ] Submit sitemap to Google Search Console: `https://getapro.org/sitemap.xml`
- [ ] Verify site in Google Search Console
- [ ] Confirm all trade/city pages are indexed
- [ ] Check robots.txt (Next.js generates default)
- [ ] Test structured data with Google Rich Results Test

## Ongoing Maintenance

- [ ] Monitor Google Search Console for crawl errors weekly
- [ ] Check admin dashboard for new inquiries/claims daily
- [ ] Re-run seed script periodically to pull new Google Places data
- [ ] Review and respond to claim requests promptly
- [ ] Update trade categories or cities as market demands

## Scaling Considerations

- Add Supabase row-level security if multi-tenant admin access is needed
- Consider Redis caching for high-traffic trade/city pages
- Add rate limiting to API routes if abuse is detected
- Consider adding Google Analytics or Plausible for traffic monitoring

## Support

- Supabase Dashboard: Check database queries and row counts
- Vercel Dashboard: Check deployment status, function logs, and analytics
- Gmail: Check Sent folder for email delivery confirmation
