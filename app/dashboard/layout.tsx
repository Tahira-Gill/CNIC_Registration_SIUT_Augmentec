import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/dashboard/SignOutButton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-bone">
      <header className="sticky top-0 z-10 border-b border-pine-100 bg-bone/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">SIUT × Augmentec</p>
            <h1 className="font-display font-semibold text-[17px] text-pine-800 leading-tight">
              CNIC Registration — Response Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-ink/45 truncate max-w-[180px]">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">{children}</div>
    </div>
  );
}
