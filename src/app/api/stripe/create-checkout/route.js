import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { listingId, priceId, tier } = await req.json();

    if (!listingId || !priceId) {
      return NextResponse.json({ error: 'Missing listingId or priceId' }, { status: 400 });
    }

    // Verify the listing exists
    const { data: listing, error } = await supabaseAdmin
      .from('getapro_listings')
      .select('id, slug, business_name')
      .eq('id', listingId)
      .single();

    if (error || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getapro.org';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { listing_id: listingId, tier: tier || 'pro' },
      success_url: `${siteUrl}/pro/${listing.slug}?upgraded=true`,
      cancel_url: `${siteUrl}/pro/${listing.slug}?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe Checkout] Error creating session:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
