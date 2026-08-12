'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError('Incorrect email or password.');
      return;
    }
    router.push(params.get('next') || '/dashboard');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-light">Restricted access</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-bone">Assessment dashboard</h1>
          <p className="mt-1.5 text-sm text-bone/50">Sign in to view SIUT × Augmentec responses.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-bone/10 bg-ink-soft/60 p-6 space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-bone/50 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-bone/15 bg-ink px-3.5 py-2.5 text-[15px] text-bone outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-bone/50 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-bone/15 bg-ink px-3.5 py-2.5 text-[15px] text-bone outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
          </div>

          {error && <p className="text-sm text-coral-light">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-ink shadow-sm hover:bg-gold-light transition disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
