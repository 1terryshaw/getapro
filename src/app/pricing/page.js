'use client';

import { useState } from 'react';
import Link from 'next/link';

const TIERS = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Get listed and start receiving inquiries from local homeowners.',
    features: [
      'Business listing on GetAPro.org',
      'Google data auto-imported',
      'Inquiry form on your profile',
      'Basic SEO visibility',
    ],
    cta: 'Claim Your Free Listing',
    href: '/claim',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'Stand out from competitors and get more leads with premium features.',
    features: [
      'Everything in Basic',
      'Premium badge on listing',
      'Priority placement in search',
      'Featured in city pages',
      'Lead notifications via email',
    ],
    cta: 'Upgrade to Pro',
    tier: 'pro',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$79',
    period: '/mo',
    description: 'For businesses that want maximum exposure and top placement.',
    features: [
      'Everything in Pro',
      'Top placement in all searches',
      'Homepage featured listing',
      'Dedicated account support',
      'Multi-city listing support',
      'Analytics dashboard',
    ],
    cta: 'Upgrade to Agency',
    tier: 'agency',
    highlight: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(null);

  async function handleCheckout(tier) {
    setLoading(tier);
    try {
      // Prompt user for listing ID (in production this would come from auth session)
      const listingId = prompt('Enter your listing ID to upgrade:');
      if (!listingId) {
        setLoading(null);
        return;
      }

      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          priceId: tier === 'pro'
            ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
            : process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID,
          tier,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <section className="bg-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-accent text-lg">
            Choose the plan that fits your business. Upgrade or cancel anytime.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg border p-8 flex flex-col ${
                tier.highlight
                  ? 'border-primary ring-2 ring-primary bg-white'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {tier.highlight && (
                <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4 self-start">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl font-bold text-dark">{tier.name}</h2>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-dark">{tier.price}</span>
                {tier.period && (
                  <span className="text-accent text-lg">{tier.period}</span>
                )}
              </div>
              <p className="text-accent text-sm mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-dark">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.href ? (
                <Link
                  href={tier.href}
                  className="block text-center bg-dark text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors"
                >
                  {tier.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleCheckout(tier.tier)}
                  disabled={loading === tier.tier}
                  className={`w-full px-6 py-3 rounded font-medium transition-colors ${
                    tier.highlight
                      ? 'bg-primary text-white hover:bg-orange-600'
                      : 'bg-dark text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === tier.tier ? 'Redirecting...' : tier.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-accent text-sm">
          <p>All plans include a 14-day money-back guarantee. Cancel anytime.</p>
          <p className="mt-2">
            Questions? Email us at{' '}
            <a href="mailto:support@getapro.org" className="text-primary hover:underline">
              support@getapro.org
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
