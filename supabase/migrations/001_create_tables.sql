-- GetAPro.org Database Schema
-- Run against Supabase instance: msqiynbhoeruqctaesqk

-- 1. Users table (must be created before listings due to FK)
CREATE TABLE IF NOT EXISTS getapro_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  business_name TEXT,
  phone TEXT,
  listing_id UUID,
  claim_token TEXT UNIQUE,
  claim_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Listings table
CREATE TABLE IF NOT EXISTS getapro_listings (
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
  mtb_tier TEXT,
  lead_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK from users back to listings
ALTER TABLE getapro_users
  ADD CONSTRAINT fk_getapro_users_listing
  FOREIGN KEY (listing_id) REFERENCES getapro_listings(id);

CREATE INDEX idx_getapro_trade_city ON getapro_listings(trade_category, city_slug);
CREATE INDEX idx_getapro_city ON getapro_listings(city_slug);
CREATE INDEX idx_getapro_claimed ON getapro_listings(is_claimed);

-- 3. Inquiries table
CREATE TABLE IF NOT EXISTS getapro_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES getapro_listings(id) NOT NULL,
  consumer_name TEXT NOT NULL,
  consumer_email TEXT NOT NULL,
  consumer_phone TEXT,
  message TEXT NOT NULL,
  city TEXT,
  trade_category TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Trades reference table
CREATE TABLE IF NOT EXISTS getapro_trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
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
('Other', 'other', '🛠️', 99)
ON CONFLICT (slug) DO NOTHING;
