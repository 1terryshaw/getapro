'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TRADES = [
  { name: 'Plumbing', slug: 'plumbing' },
  { name: 'HVAC & Heating', slug: 'hvac' },
  { name: 'Electrical', slug: 'electrical' },
  { name: 'Landscaping', slug: 'landscaping' },
  { name: 'Roofing', slug: 'roofing' },
  { name: 'General Contractor', slug: 'general-contractor' },
  { name: 'Painting', slug: 'painting' },
  { name: 'Fencing', slug: 'fencing' },
  { name: 'Paving & Concrete', slug: 'paving' },
  { name: 'Pest Control', slug: 'pest-control' },
  { name: 'Locksmith', slug: 'locksmith' },
  { name: 'Appliance Repair', slug: 'appliance-repair' },
  { name: 'Garage Door', slug: 'garage-door' },
  { name: 'Cleaning', slug: 'cleaning' },
  { name: 'Tree Service', slug: 'tree-service' },
];

const CITIES = [
  'Toronto', 'Mississauga', 'Brampton', 'Markham', 'Vaughan',
  'Hamilton', 'Ottawa', 'London', 'Kitchener', 'Oshawa',
  'Barrie', 'Guelph', 'Kingston', 'St. Catharines', 'Windsor',
];

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function SearchBar() {
  const router = useRouter();
  const [trade, setTrade] = useState('');
  const [city, setCity] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (!trade) return;
    const path = city ? `/${trade}/${toSlug(city)}` : `/${trade}`;
    router.push(path);
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
      <select
        value={trade}
        onChange={(e) => setTrade(e.target.value)}
        className="flex-1 px-4 py-3 rounded border border-accent bg-white text-dark focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Select a trade...</option>
        {TRADES.map((t) => (
          <option key={t.slug} value={t.slug}>{t.name}</option>
        ))}
      </select>
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 px-4 py-3 rounded border border-accent bg-white text-dark focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All cities</option>
        {CITIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-primary text-white px-8 py-3 rounded font-semibold hover:bg-orange-600 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
