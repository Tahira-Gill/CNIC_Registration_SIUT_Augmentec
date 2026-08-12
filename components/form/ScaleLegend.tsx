'use client';

import { LIKERT_OPTIONS } from '@/lib/questions';

export function ScaleLegend() {
  return (
    <div className="mt-4 rounded-lg border border-pine-100 bg-pine-50/50 px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-pine-700/70 shrink-0">Scale</span>
        {LIKERT_OPTIONS.map((o) => (
          <span key={o.value} className="text-[12.5px] text-ink/65 whitespace-nowrap">
            <span className="font-mono font-semibold text-pine-700">{o.short}</span>
            <span className="text-ink/35"> = </span>
            {o.label}
          </span>
        ))}
      </div>
    </div>
  );
}
