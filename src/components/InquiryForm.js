'use client';

import { useState } from 'react';

export default function InquiryForm({ listingId, businessName }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          consumer_name: form.name,
          consumer_email: form.email,
          consumer_phone: form.phone,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send inquiry');
      }

      setStatus('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-green-800 mb-2">Inquiry Sent!</h3>
        <p className="text-green-700 text-sm">
          Your message has been sent to {businessName}. They&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-dark mb-4">Get a Free Quote</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="inquiry-name" className="block text-sm font-medium text-dark mb-1">
            Your Name *
          </label>
          <input
            id="inquiry-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="inquiry-email" className="block text-sm font-medium text-dark mb-1">
            Email *
          </label>
          <input
            id="inquiry-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="inquiry-phone" className="block text-sm font-medium text-dark mb-1">
            Phone
          </label>
          <input
            id="inquiry-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="(416) 555-1234"
          />
        </div>
        <div>
          <label htmlFor="inquiry-message" className="block text-sm font-medium text-dark mb-1">
            Message *
          </label>
          <textarea
            id="inquiry-message"
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            placeholder="Describe your project or question..."
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
        {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
      </button>
      <p className="text-xs text-accent mt-2 text-center">
        Free &middot; No obligation &middot; Direct to {businessName}
      </p>
    </form>
  );
}
