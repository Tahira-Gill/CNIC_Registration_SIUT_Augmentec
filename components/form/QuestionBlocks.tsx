'use client';

import { LIKERT_OPTIONS, LikertValue, QuestionItem, Section } from '@/lib/questions';
import { TextAreaField } from './Fields';

export function LikertScan({
  value,
  onChange,
}: {
  value: LikertValue | undefined;
  onChange: (v: LikertValue) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5" role="radiogroup">
      {LIKERT_OPTIONS.map((opt) => {
        const active = value === opt.value;
        const isNA = opt.value === 'NA';
        return (
          <button
            type="button"
            key={opt.value}
            role="radio"
            aria-checked={active}
            title={opt.label}
            onClick={() => onChange(opt.value)}
            className={`group relative rounded-md border py-2.5 text-center transition ${
              active
                ? isNA
                  ? 'border-ink/30 bg-ink/5'
                  : 'border-gold bg-gold/12'
                : 'border-pine-200 bg-white hover:border-pine-300 hover:bg-pine-50'
            }`}
          >
            <span
              className={`block font-mono text-[12px] font-semibold tracking-wide ${
                active ? (isNA ? 'text-ink/70' : 'text-gold-dark') : 'text-ink/55'
              }`}
            >
              {opt.short}
            </span>
            <span
              className={`mt-1.5 block h-[3px] rounded-full transition-all ${
                active ? (isNA ? 'bg-ink/30' : 'bg-gold') : 'bg-pine-100 group-hover:bg-pine-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export function QuestionRow({
  item,
  value,
  onChange,
  index,
}: {
  item: QuestionItem;
  value: LikertValue | undefined;
  onChange: (v: LikertValue) => void;
  index: number;
}) {
  return (
    <div className="py-5 border-b border-pine-100 last:border-b-0">
      <div className="flex items-baseline gap-2.5 mb-2.5">
        <span className="font-mono text-[11px] text-gold-dark/80 shrink-0">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <span className="font-display font-semibold text-[15px] text-ink">{item.label}</span>
          <span className="text-[14px] text-ink/65">
            {item.label ? ': ' : ''}
            {item.description}
          </span>
        </div>
      </div>
      <LikertScan value={value} onChange={onChange} />
    </div>
  );
}

export function SectionBlock({
  section,
  answers,
  onAnswer,
  comment,
  onComment,
}: {
  section: Section;
  answers: Record<string, LikertValue>;
  onAnswer: (id: string, v: LikertValue) => void;
  comment: string;
  onComment: (v: string) => void;
}) {
  return (
    <div className="animate-fadeUp">
      <div className="mb-1">
        <h2 className="font-display text-xl font-semibold text-pine-800">{section.title}</h2>
        {section.guidingQuestion && (
          <p className="mt-1 text-sm italic text-ink/55">{section.guidingQuestion}</p>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-pine-100 bg-white px-5">
        {section.items.map((item, i) => (
          <QuestionRow
            key={item.id}
            item={item}
            index={i}
            value={answers[item.id]}
            onChange={(v) => onAnswer(item.id, v)}
          />
        ))}
      </div>

      <div className="mt-4">
        <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-pine-700/80 mb-1.5">
          Comments <span className="normal-case text-ink/35">(optional)</span>
        </label>
        <TextAreaField value={comment} onChange={onComment} placeholder="Anything worth flagging for this section…" />
      </div>
    </div>
  );
}
