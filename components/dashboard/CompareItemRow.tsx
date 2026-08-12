'use client';

import { QuestionItem } from '@/lib/questions';
import { itemAverage, respondedCount, ResponseRow } from '@/lib/scoring';

function Bar({ value, max, colorClass }: { value: number | null; max: number; colorClass: string }) {
  const pct = value ? Math.max(4, (value / max) * 100) : 0;
  return (
    <div className="h-2 flex-1 rounded-full bg-pine-50 overflow-hidden">
      <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function CompareItemRow({
  item,
  index,
  siutRows,
  augmentecRows,
}: {
  item: QuestionItem;
  index: number;
  siutRows: ResponseRow[];
  augmentecRows: ResponseRow[];
}) {
  const siutAvg = itemAverage(siutRows, item.id);
  const augAvg = itemAverage(augmentecRows, item.id);
  const siutN = respondedCount(siutRows, item.id);
  const augN = respondedCount(augmentecRows, item.id);

  return (
    <div className="py-4 border-b border-pine-100 last:border-b-0">
      <div className="flex items-baseline gap-2.5 mb-2">
        <span className="font-mono text-[11px] text-gold-dark/80 shrink-0">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <span className="font-display font-semibold text-[14px] text-ink">{item.label}</span>
          <span className="text-[13px] text-ink/55">{item.label ? ': ' : ''}{item.description}</span>
        </div>
      </div>

      <div className="space-y-1.5 pl-6">
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-[11px] font-mono uppercase tracking-wide text-pine-700">SIUT</span>
          <Bar value={siutAvg} max={5} colorClass="bg-pine-500" />
          <span className="w-16 shrink-0 text-right text-[12px] tabular-nums text-ink/60">
            {siutAvg ? siutAvg.toFixed(1) : '—'}{' '}
            <span className="text-ink/35">(n={siutN})</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-[11px] font-mono uppercase tracking-wide text-verify">Augmentec</span>
          <Bar value={augAvg} max={5} colorClass="bg-verify" />
          <span className="w-16 shrink-0 text-right text-[12px] tabular-nums text-ink/60">
            {augAvg ? augAvg.toFixed(1) : '—'}{' '}
            <span className="text-ink/35">(n={augN})</span>
          </span>
        </div>
      </div>
    </div>
  );
}
