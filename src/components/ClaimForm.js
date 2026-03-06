'use client';

import { useState } from 'react';

export default function ClaimForm({ listingId, businessName }) {
  const [form, setForm] = useState({ email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/claim/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          email: form.email,
          phone: form.phone,
          business_name: businessName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit claim');
      }

      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-green-800 mb-2">Check Your Email</h3>
        <p className="text-green-700 text-sm">
          We&apos;ve sent a verification link to <strong>{form.email}</strong>.
          Click the link to complete your claim for {businessName}.
        </p>
        <p className="text-green-600 text-xs mt-3">
          Don&apos;t see it? Check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-dark mb-4">Verify Your Identity</h3>
      <p className="text-sm text-accent mb-4">
        Enter your business email. We&apos;ll send a verification link to confirm you own this listing.
      </p>
      <div className="space-y-3">
        <div>
          <label htmlFor="claim-email" className="block text-sm font-medium text-dark mb-1">
            Business Email *
          </label>
          <input
            id="claim-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="you@yourbusiness.com"
          />
        </div>
        <div>
          <label htmlFor="claim-phone" className="block text-sm font-medium text-dark mb-1">
            Phone (optional)
          </label>
          <input
            id="claim-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="(416) 555-1234"
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm mt-2">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-4 w-full bg-primary text-white py-2.5 rounded font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send Verification Email'}
      </button>
    </form>
  );
}
