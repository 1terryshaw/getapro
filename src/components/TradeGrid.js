import Link from 'next/link';

const TRADES = [
  { name: 'Plumbing', slug: 'plumbing', icon: '🔧' },
  { name: 'HVAC & Heating', slug: 'hvac', icon: '❄️' },
  { name: 'Electrical', slug: 'electrical', icon: '⚡' },
  { name: 'Landscaping', slug: 'landscaping', icon: '🌿' },
  { name: 'Roofing', slug: 'roofing', icon: '🏠' },
  { name: 'General Contractor', slug: 'general-contractor', icon: '🔨' },
  { name: 'Painting', slug: 'painting', icon: '🎨' },
  { name: 'Fencing', slug: 'fencing', icon: '🏗️' },
  { name: 'Paving & Concrete', slug: 'paving', icon: '🧱' },
  { name: 'Pest Control', slug: 'pest-control', icon: '🐜' },
  { name: 'Locksmith', slug: 'locksmith', icon: '🔑' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: '🔌' },
  { name: 'Garage Door', slug: 'garage-door', icon: '🚪' },
  { name: 'Cleaning', slug: 'cleaning', icon: '🧹' },
  { name: 'Tree Service', slug: 'tree-service', icon: '🌳' },
];

export default function TradeGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {TRADES.map((trade) => (
        <Link
          key={trade.slug}
          href={`/${trade.slug}`}
          className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-100 hover:border-primary"
        >
          <span className="text-3xl block mb-2">{trade.icon}</span>
          <span className="text-sm font-medium text-dark">{trade.name}</span>
        </Link>
      ))}
    </div>
  );
}
