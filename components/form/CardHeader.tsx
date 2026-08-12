'use client';

export function CardHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pine-800 via-pine-700 to-pine-900 text-bone shadow-lg">
      <div className="absolute inset-0 bg-card-grid bg-grid opacity-40 pointer-events-none" />
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative flex items-start justify-between gap-6 px-6 py-7 sm:px-9 sm:py-9">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-light">{eyebrow}</p>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold leading-tight text-bone">
            {title}
          </h1>
          {subtitle && <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-bone/70">{subtitle}</p>}
        </div>

        <CardGlyph />
      </div>

      <div className="perforated-edge h-2 opacity-70" />
    </div>
  );
}

function CardGlyph() {
  return (
    <div className="relative hidden sm:block h-16 w-24 shrink-0 rounded-md border border-gold/40 bg-pine-900/60 overflow-hidden">
      <div className="absolute left-2.5 top-2.5 h-4 w-6 rounded-[3px] bg-gold/70" />
      <div className="absolute left-2.5 bottom-2.5 h-1 w-12 rounded-full bg-bone/25" />
      <div className="absolute left-2.5 bottom-4 h-1 w-8 rounded-full bg-bone/20" />
      <div
        className="absolute left-0 right-0 h-[2px] bg-gold shadow-[0_0_8px_1px_rgba(184,146,63,0.8)] animate-scan"
        aria-hidden
      />
    </div>
  );
}
