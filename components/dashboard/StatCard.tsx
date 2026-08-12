'use client';

export function StatCard({
  label,
  value,
  accent = 'pine',
  sub,
}: {
  label: string;
  value: string;
  accent?: 'pine' | 'verify' | 'gold';
  sub?: string;
}) {
  const accentClass =
    accent === 'verify' ? 'text-verify-dark' : accent === 'gold' ? 'text-gold-dark' : 'text-pine-700';
  return (
    <div className="rounded-lg border border-pine-100 bg-white px-4 py-3.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${accentClass}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-ink/40">{sub}</p>}
    </div>
  );
}
