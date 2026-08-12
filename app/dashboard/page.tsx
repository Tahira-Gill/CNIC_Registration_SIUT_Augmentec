import { createClient } from '@/lib/supabase/server';
import { ResponseRow } from '@/lib/scoring';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg border border-coral/30 bg-coral/5 p-5 text-coral text-sm">
        Could not load responses: {error.message}
      </div>
    );
  }

  return <DashboardClient rows={(data as ResponseRow[]) || []} />;
}
