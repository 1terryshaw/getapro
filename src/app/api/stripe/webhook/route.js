import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const listingId = session.metadata?.listing_id;

    if (listingId) {
      const { error } = await supabaseAdmin
        .from('getapro_listings')
        .update({
          is_premium: true,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
        })
        .eq('id', listingId);

      if (error) {
        console.error('[Stripe Webhook] Failed to update listing:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
      console.log(`[Stripe Webhook] Listing ${listingId} upgraded to premium`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;

    const { error } = await supabaseAdmin
      .from('getapro_listings')
      .update({ is_premium: false })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('[Stripe Webhook] Failed to downgrade listing:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
    console.log(`[Stripe Webhook] Subscription ${subscription.id} cancelled, listing downgraded`);
  }

  return NextResponse.json({ received: true });
}
