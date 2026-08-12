'use client';

import { ReactNode } from 'react';

export function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-pine-700/80 mb-1.5">
      {children}
      {required && <span className="text-coral ml-1">*</span>}
    </label>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-pine-200 bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/35 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
    />
  );
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-pine-200 bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/35 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25 resize-y"
    />
  );
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <select
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-pine-200 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25 appearance-none"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%231F6650'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.75rem center',
        backgroundSize: '1.1em',
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function CoversToggle({
  covers,
  onToggle,
}: {
  covers: Record<'rollout' | 'evaluate_sustain', boolean>;
  onToggle: (key: 'rollout' | 'evaluate_sustain') => void;
}) {
  const opts: { key: 'rollout' | 'evaluate_sustain'; label: string }[] = [
    { key: 'rollout', label: 'Rollout monitoring (weeks 1–12)' },
    { key: 'evaluate_sustain', label: 'Evaluate & sustain checkpoint' },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-2.5">
      {opts.map((o) => {
        const active = covers[o.key];
        return (
          <button
            type="button"
            key={o.key}
            onClick={() => onToggle(o.key)}
            className={`flex items-center gap-3 rounded-md border px-4 py-3 text-left text-[14px] transition ${
              active
                ? 'border-gold bg-gold/10 ring-1 ring-gold text-ink'
                : 'border-pine-200 bg-white hover:border-pine-300 text-ink/80'
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                active ? 'border-gold bg-gold' : 'border-pine-300 bg-white'
              }`}
            >
              {active && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function OrgToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: 'SIUT' | 'Augmentec') => void;
}) {
  const opts: { value: 'SIUT' | 'Augmentec'; hue: string }[] = [
    { value: 'SIUT', hue: 'pine' },
    { value: 'Augmentec', hue: 'verify' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {opts.map((o) => {
        const active = value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-md border px-4 py-3 text-left transition ${
              active
                ? o.value === 'SIUT'
                  ? 'border-pine-500 bg-pine-500/10 ring-1 ring-pine-500'
                  : 'border-verify bg-verify/10 ring-1 ring-verify'
                : 'border-pine-200 bg-white hover:border-pine-300'
            }`}
          >
            <span
              className={`block font-display font-semibold text-[15px] ${
                active ? (o.value === 'SIUT' ? 'text-pine-700' : 'text-verify-dark') : 'text-ink'
              }`}
            >
              {o.value}
            </span>
            <span className="block text-xs text-ink/50 mt-0.5">
              {o.value === 'SIUT' ? 'Hospital respondent' : 'Vendor respondent'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
