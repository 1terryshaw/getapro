import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendInquiryNotification } from '@/lib/email';

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await request.json();
    const { listing_id, consumer_name, consumer_email, consumer_phone, message } = body;

    if (!listing_id || !consumer_name || !consumer_email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch listing to get trade_category, city, and email
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('getapro_listings')
      .select('id, business_name, trade_category, city, email, lead_count')
      .eq('id', listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Save inquiry
    const { data: inquiry, error: insertError } = await supabaseAdmin
      .from('getapro_inquiries')
      .insert({
        listing_id,
        consumer_name,
        consumer_email,
        consumer_phone: consumer_phone || null,
        message,
        city: listing.city,
        trade_category: listing.trade_category,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }

    // Increment lead_count on listing
    await supabaseAdmin.rpc('increment_lead_count', { row_id: listing_id }).catch(() => {
      // Fallback: manual increment if RPC doesn't exist
      return supabaseAdmin
        .from('getapro_listings')
        .update({ lead_count: (listing.lead_count || 0) + 1 })
        .eq('id', listing_id);
    });

    // Send email notification (non-blocking)
    sendInquiryNotification({ listing, inquiry }).catch((err) => {
      console.error('Failed to send inquiry email:', err.message);
    });

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error('Inquiry API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
