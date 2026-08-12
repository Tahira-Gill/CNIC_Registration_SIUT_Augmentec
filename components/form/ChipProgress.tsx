'use client';

export function ChipProgress({
  steps,
  current,
  onJump,
}: {
  steps: string[];
  current: number;
  onJump?: (i: number) => void;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5">
        {steps.map((label, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'pending';
          return (
            <button
              type="button"
              key={label + i}
              disabled={!onJump || i > current}
              onClick={() => onJump?.(i)}
              title={label}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                state === 'done'
                  ? 'bg-pine-500'
                  : state === 'active'
                  ? 'bg-gold'
                  : 'bg-pine-100'
              } ${onJump && i <= current ? 'cursor-pointer' : 'cursor-default'}`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink/45">
        <span>
          Step {current + 1} of {steps.length}
        </span>
        <span className="truncate max-w-[60%] text-right text-pine-700">{steps[current]}</span>
      </div>
    </div>
  );
}
