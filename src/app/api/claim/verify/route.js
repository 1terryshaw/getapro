import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.redirect(new URL('/claim?error=config', request.url));
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/claim?error=missing-token', request.url));
    }

    // Find user with this claim token
    const { data: user, error: userError } = await supabaseAdmin
      .from('getapro_users')
      .select('id, listing_id, claim_verified')
      .eq('claim_token', token)
      .single();

    if (userError || !user) {
      return NextResponse.redirect(new URL('/claim?error=invalid-token', request.url));
    }

    if (user.claim_verified) {
      return NextResponse.redirect(new URL('/claim/success?already=true', request.url));
    }

    // Verify the user
    await supabaseAdmin
      .from('getapro_users')
      .update({ claim_verified: true })
      .eq('id', user.id);

    // Mark listing as claimed
    if (user.listing_id) {
      await supabaseAdmin
        .from('getapro_listings')
        .update({
          is_claimed: true,
          claimed_by: user.id,
          claimed_at: new Date().toISOString(),
        })
        .eq('id', user.listing_id);
    }

    return NextResponse.redirect(new URL(`/claim/success?listing=${user.listing_id}`, request.url));
  } catch (err) {
    console.error('Claim verify error:', err);
    return NextResponse.redirect(new URL('/claim?error=server', request.url));
  }
}
