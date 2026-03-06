'use client';

import { useState } from 'react';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid password');
      }

      window.location.reload();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-100 p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold text-dark mb-4 text-center">Admin Login</h2>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium text-dark mb-1">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="Enter admin password"
          />
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-dark text-white py-2.5 rounded font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
