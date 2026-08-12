'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-md border border-pine-200 px-3.5 py-1.5 text-xs font-medium text-pine-700 hover:bg-pine-50 transition"
    >
      Sign out
    </button>
  );
}
