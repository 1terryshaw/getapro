'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/cities', label: 'Cities' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
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

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 text-white"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-dark border-t border-gray-700 z-50">
          <div className="px-4 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-white hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/claim"
              onClick={() => setOpen(false)}
              className="block bg-primary text-white px-4 py-2 rounded text-sm font-medium text-center hover:bg-orange-600 transition-colors"
            >
              Claim Your Listing
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
