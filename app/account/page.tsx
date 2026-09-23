import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LogoutButton from '@/components/LogoutButton';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // This check runs on the server, before anything renders — there's no
  // flash of protected content before the redirect kicks in, the way
  // there could be with a client-side-only check.
  if (!user) redirect('/login');

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-zinc-50">Account</h1>
        <p className="mt-4 text-sm text-zinc-400">Signed in as {user.email}</p>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </main>
    </>
  );
}
