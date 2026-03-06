import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: "GetAPro.org — Find Trusted Pros in Ontario",
  description: "Ontario's trusted directory for plumbers, electricians, HVAC techs, and more. Compare ratings, read reviews, and get free quotes.",
  icons: { icon: '/favicon.ico' },
};

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/cities', label: 'Cities' },
  { href: '/about', label: 'About' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-dark text-white">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-primary">Get</span>
              <span className="text-white">A</span>
              <span className="text-primary">Pro</span>
            </Link>
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/claim"
                className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Claim Your Listing
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-dark text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-3">
                  <span className="text-primary">Get</span>A<span className="text-primary">Pro</span>
                </h3>
                <p className="text-accent text-sm">
                  Ontario&apos;s free directory for finding trusted trade professionals.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Popular Trades</h4>
                <ul className="space-y-1 text-sm text-accent">
                  <li><Link href="/plumbing" className="hover:text-primary">Plumbing</Link></li>
                  <li><Link href="/hvac" className="hover:text-primary">HVAC &amp; Heating</Link></li>
                  <li><Link href="/electrical" className="hover:text-primary">Electrical</Link></li>
                  <li><Link href="/roofing" className="hover:text-primary">Roofing</Link></li>
                  <li><Link href="/landscaping" className="hover:text-primary">Landscaping</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Top Cities</h4>
                <ul className="space-y-1 text-sm text-accent">
                  <li><Link href="/plumbing/toronto" className="hover:text-primary">Toronto</Link></li>
                  <li><Link href="/plumbing/mississauga" className="hover:text-primary">Mississauga</Link></li>
                  <li><Link href="/plumbing/ottawa" className="hover:text-primary">Ottawa</Link></li>
                  <li><Link href="/plumbing/hamilton" className="hover:text-primary">Hamilton</Link></li>
                  <li><Link href="/plumbing/london" className="hover:text-primary">London</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-accent">
              &copy; {new Date().getFullYear()} GetAPro.org. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
