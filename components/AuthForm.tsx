'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const supabase = createBrowserSupabaseClient();

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        // With Supabase's default "Confirm email" setting on, the
        // session isn't active until the confirmation link is clicked.
        setMessage('Check your email to confirm your account.');
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/account');
        router.refresh();
      }
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-500"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-zinc-700 bg-transparent px-4 py-3 text-sm text-zinc-50 focus:border-zinc-400"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-500"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-zinc-700 bg-transparent px-4 py-3 text-sm text-zinc-50 focus:border-zinc-400"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {message && <p className="text-xs text-bronze-400">{message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 bg-zinc-50 py-3.5 text-xs font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-bronze-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        {mode === 'signup' ? 'Create Account' : 'Log In'}
      </button>

      <p className="text-center text-xs text-zinc-500">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link href="/login" className="text-bronze-400">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-bronze-400">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
