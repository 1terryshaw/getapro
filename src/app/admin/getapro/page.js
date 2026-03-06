import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLoginForm from '@/components/AdminLoginForm';

export const metadata = {
  title: 'Admin Dashboard — GetAPro.org',
  robots: 'noindex, nofollow',
};

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('getapro_admin');
  return token?.value === process.env.ADMIN_PASSWORD;
}

async function getDashboardData() {
  // Listings by trade
  const { data: allListings } = await supabase
    .from('getapro_listings')
    .select('trade_category, city, is_claimed, is_featured, is_mtb_client, lead_count');

  // Claims data from users table
  const { data: allUsers } = await supabase
    .from('getapro_users')
    .select('id, email, business_name, claim_verified, created_at');

  // Inquiries
  const { data: allInquiries } = await supabase
    .from('getapro_inquiries')
    .select('id, listing_id, consumer_name, consumer_email, trade_category, city, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  const listings = allListings || [];
  const users = allUsers || [];
  const inquiries = allInquiries || [];

  // Aggregate by trade
  const byTrade = {};
  listings.forEach((l) => {
    if (!byTrade[l.trade_category]) byTrade[l.trade_category] = { total: 0, claimed: 0 };
    byTrade[l.trade_category].total++;
    if (l.is_claimed) byTrade[l.trade_category].claimed++;
  });

  // Aggregate by city
  const byCity = {};
  listings.forEach((l) => {
    if (!byCity[l.city]) byCity[l.city] = { total: 0, claimed: 0 };
    byCity[l.city].total++;
    if (l.is_claimed) byCity[l.city].claimed++;
  });

  // Claims stats
  const claimsPending = users.filter((u) => !u.claim_verified).length;
  const claimsVerified = users.filter((u) => u.claim_verified).length;

  // Lead metrics
  const totalLeads = listings.reduce((sum, l) => sum + (l.lead_count || 0), 0);
  const totalInquiries = inquiries.length;

  return {
    totals: {
      listings: listings.length,
      claimed: listings.filter((l) => l.is_claimed).length,
      featured: listings.filter((l) => l.is_featured).length,
      mtbClients: listings.filter((l) => l.is_mtb_client).length,
    },
    byTrade: Object.entries(byTrade).sort((a, b) => b[1].total - a[1].total),
    byCity: Object.entries(byCity).sort((a, b) => b[1].total - a[1].total),
    claims: { pending: claimsPending, verified: claimsVerified },
    leads: { totalLeads, totalInquiries },
    recentInquiries: inquiries,
  };
}

export default async function AdminDashboardPage({ searchParams }) {
  const params = await searchParams;
  const authed = await isAuthenticated();

  // Handle login via query param (POST from form redirects here)
  if (params?.password) {
    if (params.password === process.env.ADMIN_PASSWORD) {
      // Set via API route
    }
  }

  if (!authed) {
    return <AdminLoginForm />;
  }

  const data = await getDashboardData();

  return (
    <>
      <section className="bg-dark text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold">GetAPro Admin Dashboard</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Listings" value={data.totals.listings} />
          <StatCard label="Claimed" value={data.totals.claimed} color="text-green-600" />
          <StatCard label="Featured" value={data.totals.featured} color="text-primary" />
          <StatCard label="MTB Clients" value={data.totals.mtbClients} color="text-blue-600" />
        </div>

        {/* Claims + Leads row */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-bold text-dark mb-3">Claims</h2>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{data.claims.pending}</p>
                <p className="text-sm text-accent">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{data.claims.verified}</p>
                <p className="text-sm text-accent">Verified</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-bold text-dark mb-3">Lead Metrics</h2>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-primary">{data.leads.totalLeads}</p>
                <p className="text-sm text-accent">Total Leads (all time)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-dark">{data.leads.totalInquiries}</p>
                <p className="text-sm text-accent">Recent Inquiries</p>
              </div>
            </div>
          </div>
        </div>

        {/* By Trade and City */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-bold text-dark mb-4">Listings by Trade</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-accent font-medium">Trade</th>
                  <th className="text-right py-2 text-accent font-medium">Total</th>
                  <th className="text-right py-2 text-accent font-medium">Claimed</th>
                </tr>
              </thead>
              <tbody>
                {data.byTrade.map(([trade, counts]) => (
                  <tr key={trade} className="border-b border-gray-50">
                    <td className="py-2 text-dark">{trade}</td>
                    <td className="py-2 text-right text-dark">{counts.total}</td>
                    <td className="py-2 text-right text-green-600">{counts.claimed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-bold text-dark mb-4">Listings by City</h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-accent font-medium">City</th>
                    <th className="text-right py-2 text-accent font-medium">Total</th>
                    <th className="text-right py-2 text-accent font-medium">Claimed</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byCity.map(([city, counts]) => (
                    <tr key={city} className="border-b border-gray-50">
                      <td className="py-2 text-dark">{city}</td>
                      <td className="py-2 text-right text-dark">{counts.total}</td>
                      <td className="py-2 text-right text-green-600">{counts.claimed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-bold text-dark mb-4">Recent Inquiries</h2>
          {data.recentInquiries.length === 0 ? (
            <p className="text-accent text-sm">No inquiries yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-accent font-medium">Date</th>
                    <th className="text-left py-2 text-accent font-medium">Name</th>
                    <th className="text-left py-2 text-accent font-medium">Email</th>
                    <th className="text-left py-2 text-accent font-medium">Trade</th>
                    <th className="text-left py-2 text-accent font-medium">City</th>
                    <th className="text-left py-2 text-accent font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentInquiries.map((inq) => (
                    <tr key={inq.id} className="border-b border-gray-50">
                      <td className="py-2 text-dark whitespace-nowrap">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-dark">{inq.consumer_name}</td>
                      <td className="py-2 text-dark">{inq.consumer_email}</td>
                      <td className="py-2 text-dark">{inq.trade_category}</td>
                      <td className="py-2 text-dark">{inq.city}</td>
                      <td className="py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          inq.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, color = 'text-dark' }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-accent mt-1">{label}</p>
    </div>
  );
}
