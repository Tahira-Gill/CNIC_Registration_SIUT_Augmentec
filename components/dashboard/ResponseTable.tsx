'use client';

import { useState } from 'react';
import { LIKERT_OPTIONS } from '@/lib/questions';
import { ResponseRow } from '@/lib/scoring';

function coversLabel(r: ResponseRow) {
  const parts: string[] = [];
  if (r.covers_rollout) parts.push('Rollout');
  if (r.covers_evaluate_sustain) parts.push(`Evaluate & sustain${r.checkpoint_month ? ` · M${r.checkpoint_month}` : ''}`);
  return parts.join(' + ') || '—';
}

export function ResponseTable({ rows }: { rows: ResponseRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-pine-200 py-12 text-center text-sm text-ink/45">
        No responses match the current filters yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-pine-100 bg-white overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-pine-100 bg-pine-50/60 text-left">
            <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-ink/45">Org</th>
            <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-ink/45">Respondent</th>
            <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-ink/45">Covers</th>
            <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-ink/45">Date</th>
            <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-ink/45">Items rated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const open = openId === r.id;
            const itemsRated = Object.keys(r.answers || {}).length;
            return (
              <>
                <tr
                  key={r.id}
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="border-b border-pine-50 last:border-b-0 cursor-pointer hover:bg-pine-50/40 transition"
                >
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${
                        r.organization === 'SIUT' ? 'bg-pine-100 text-pine-700' : 'bg-verify/10 text-verify-dark'
                      }`}
                    >
                      {r.organization}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-ink">{r.respondent_name}</div>
                    <div className="text-ink/45 text-[12px]">{r.role_designation || '—'}</div>
                  </td>
                  <td className="px-4 py-2.5 text-ink/70">
                    {coversLabel(r)}
                  </td>
                  <td className="px-4 py-2.5 text-ink/70">{r.response_date}</td>
                  <td className="px-4 py-2.5 text-ink/70">{itemsRated}</td>
                  <td className="px-4 py-2.5 text-right text-ink/30">{open ? '▲' : '▼'}</td>
                </tr>
                {open && (
                  <tr className="bg-pine-50/30">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-ink/40 mb-1.5">Answers</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(r.answers || {}).map(([k, v]) => (
                              <span
                                key={k}
                                title={k}
                                className="rounded bg-white border border-pine-100 px-1.5 py-0.5 text-[11px] font-mono text-ink/70"
                              >
                                {k}: {LIKERT_OPTIONS.find((o) => o.value === v)?.short || v}
                              </span>
                            ))}
                            {Object.keys(r.answers || {}).length === 0 && (
                              <span className="text-ink/35 text-[12px]">No items rated.</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {r.overall?.recommendation && (
                            <p className="text-[12px] text-ink/70">
                              <span className="font-mono uppercase text-[10px] text-ink/40">Recommendation: </span>
                              {r.overall.recommendation.replace(/_/g, ' ')}
                            </p>
                          )}
                          {r.overall?.strengths && (
                            <p className="text-[12px] text-ink/70">
                              <span className="font-mono uppercase text-[10px] text-ink/40 block">Strengths</span>
                              {r.overall.strengths}
                            </p>
                          )}
                          {r.overall?.risks && (
                            <p className="text-[12px] text-ink/70">
                              <span className="font-mono uppercase text-[10px] text-ink/40 block">Risks</span>
                              {r.overall.risks}
                            </p>
                          )}
                          {r.overall?.safeguards && (
                            <p className="text-[12px] text-ink/70">
                              <span className="font-mono uppercase text-[10px] text-ink/40 block">Safeguards</span>
                              {r.overall.safeguards}
                            </p>
                          )}
                        </div>
                      </div>
                      {Object.keys(r.comments || {}).length > 0 && (
                        <div className="mt-3">
                          <p className="font-mono text-[10px] uppercase tracking-wide text-ink/40 mb-1.5">
                            Section comments
                          </p>
                          <div className="space-y-1">
                            {Object.entries(r.comments).map(
                              ([k, v]) =>
                                v && (
                                  <p key={k} className="text-[12px] text-ink/65">
                                    <span className="font-mono text-ink/35">{k}: </span>
                                    {v}
                                  </p>
                                )
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
