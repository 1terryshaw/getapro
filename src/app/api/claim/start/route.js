import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendClaimVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await request.json();
    const { listing_id, email, business_name, phone } = body;

    if (!listing_id || !email || !business_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check listing exists and is not already claimed
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('getapro_listings')
      .select('id, is_claimed, business_name')
      .eq('id', listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.is_claimed) {
      return NextResponse.json({ error: 'This listing has already been claimed' }, { status: 409 });
    }

    // Generate claim token
    const claimToken = crypto.randomBytes(32).toString('hex');

    // Upsert user with claim token
    const { error: userError } = await supabaseAdmin
      .from('getapro_users')
      .upsert(
        {
          email,
          business_name,
          phone: phone || null,
          listing_id: listing_id,
          claim_token: claimToken,
          claim_verified: false,
        },
        { onConflict: 'email' }
      );

    if (userError) {
      console.error('User upsert error:', userError);
      return NextResponse.json({ error: 'Failed to process claim' }, { status: 500 });
    }

    // Send verification email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getapro.org';
    const verifyUrl = `${siteUrl}/api/claim/verify?token=${claimToken}`;

    await sendClaimVerificationEmail({
      email,
      businessName: listing.business_name,
      verifyUrl,
    });

    return NextResponse.json({ success: true, message: 'Verification email sent' });
  } catch (err) {
    console.error('Claim start error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
