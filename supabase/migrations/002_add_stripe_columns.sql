-- Add Stripe-related columns to getapro_listings
ALTER TABLE getapro_listings
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

CREATE INDEX IF NOT EXISTS idx_getapro_stripe_subscription
  ON getapro_listings(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
