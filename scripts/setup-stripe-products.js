#!/usr/bin/env node
/**
 * One-time script to create Stripe products and prices for GetAPro.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe-products.js
 *
 * It will print the price IDs to paste into your .env / Vercel env vars.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Error: STRIPE_SECRET_KEY env var is required');
    process.exit(1);
  }

  console.log('Creating Stripe products and prices...\n');

  // --- Pro tier ---
  const proProduct = await stripe.products.create({
    name: 'GetAPro Pro',
    description:
      'Premium listing with priority placement, premium badge, and lead notifications',
    metadata: { tier: 'pro' },
  });
  const proPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2900, // $29.00
    currency: 'cad',
    recurring: { interval: 'month' },
  });
  console.log(`Pro  Product: ${proProduct.id}`);
  console.log(`Pro  Price:   ${proPrice.id}`);

  // --- Agency tier ---
  const agencyProduct = await stripe.products.create({
    name: 'GetAPro Agency',
    description:
      'Top placement in all searches, homepage featured listing, multi-city support, and analytics dashboard',
    metadata: { tier: 'agency' },
  });
  const agencyPrice = await stripe.prices.create({
    product: agencyProduct.id,
    unit_amount: 7900, // $79.00
    currency: 'cad',
    recurring: { interval: 'month' },
  });
  console.log(`Agency Product: ${agencyProduct.id}`);
  console.log(`Agency Price:   ${agencyPrice.id}`);

  console.log('\n--- Add these to your .env and Vercel ---');
  console.log(`NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=${proPrice.id}`);
  console.log(`NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=${agencyPrice.id}`);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
