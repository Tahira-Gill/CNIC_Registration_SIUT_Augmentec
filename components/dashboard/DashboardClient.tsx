'use client';

import { useMemo, useState } from 'react';
import {
  CHECKPOINTS,
  Organization,
  PART_1,
  PART_2,
  PART_3,
  PART_4,
  SUBMISSION_TYPES,
  SubmissionType,
} from '@/lib/questions';
import { filterRows, itemAverage, ResponseRow, toCSV } from '@/lib/scoring';
import { StatCard } from './StatCard';
import { SectionCompareChart } from './SectionCompareChart';
import { CompareItemRow } from './CompareItemRow';
import { RecommendationChart } from './RecommendationChart';
import { ResponseTable } from './ResponseTable';

const TABS = ['Overview', "Proctor's", 'RE-AIM', 'Service & end-user', 'Overall assessment', 'All responses'] as const;
type Tab = (typeof TABS)[number];

export default function DashboardClient({ rows }: { rows: ResponseRow[] }) {
  const [tab, setTab] = useState<Tab>('Overview');
  const [org, setOrg] = useState<Organization | 'All'>('All');
  const [subType, setSubType] = useState<SubmissionType | 'All'>('All');
  const [checkpoint, setCheckpoint] = useState<string | 'All'>('All');

  const filtered = useMemo(
    () => filterRows(rows, { organization: org, submissionType: subType, checkpoint }),
    [rows, org, subType, checkpoint]
  );

  const siutRows = useMemo(() => filtered.filter((r) => r.organization === 'SIUT'), [filtered]);
  const augmentecRows = useMemo(() => filtered.filter((r) => r.organization === 'Augmentec'), [filtered]);

  const allSectionsForOverview = [...PART_1.sections, ...PART_2.sections, ...PART_3.sections, ...PART_4.sections];

  const overallAvg = useMemo(() => {
    const items = allSectionsForOverview.flatMap((s) => s.items);
    const scores: number[] = [];
    for (const item of items) {
      const avg = itemAverage(filtered, item.id);
      if (avg !== null) scores.push(avg);
    }
    if (scores.length === 0) return null;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [filtered]);

  function handleExport() {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cnic-assessment-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-6">
        <FilterPills
          value={org}
          onChange={(v) => setOrg(v as Organization | 'All')}
          options={[
            { value: 'All', label: 'All orgs' },
            { value: 'SIUT', label: 'SIUT' },
            { value: 'Augmentec', label: 'Augmentec' },
          ]}
        />
        <span className="text-pine-200">|</span>
        <FilterPills
          value={subType}
          onChange={(v) => setSubType(v as SubmissionType | 'All')}
          options={[{ value: 'All', label: 'All phases' }, ...SUBMISSION_TYPES]}
        />
        {subType !== 'rollout' && (
          <>
            <span className="text-pine-200">|</span>
            <FilterPills
              value={checkpoint}
              onChange={setCheckpoint}
              options={[{ value: 'All', label: 'All checkpoints' }, ...CHECKPOINTS]}
            />
          </>
        )}

        <button
          onClick={handleExport}
          className="ml-auto rounded-md border border-pine-200 bg-white px-3.5 py-1.5 text-xs font-medium text-pine-700 hover:bg-pine-50 transition"
        >
          Export CSV
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        <StatCard label="Total responses" value={String(filtered.length)} />
        <StatCard label="SIUT" value={String(siutRows.length)} accent="pine" />
        <StatCard label="Augmentec" value={String(augmentecRows.length)} accent="verify" />
        <StatCard label="Overall avg. rating" value={overallAvg ? `${overallAvg.toFixed(2)} / 5` : '—'} accent="gold" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-pine-100 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap px-3.5 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition ${
              tab === t ? 'border-gold text-pine-800' : 'border-transparent text-ink/45 hover:text-ink/70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-6">
          <Panel title="Section averages — SIUT vs Augmentec" subtitle="Mean rating per section, 1 (Strongly Disagree) to 5 (Strongly Agree), N/A excluded.">
            <SectionCompareChart sections={allSectionsForOverview} siutRows={siutRows} augmentecRows={augmentecRows} />
          </Panel>
          <Panel title="Overall recommendation">
            <RecommendationChart siutRows={siutRows} augmentecRows={augmentecRows} />
          </Panel>
        </div>
      )}

      {tab === "Proctor's" && (
        <Panel title={PART_1.title} subtitle={PART_1.subtitle}>
          {PART_1.sections.map((section) => (
            <div key={section.id} className="mb-2">
              {section.items.map((item, i) => (
                <CompareItemRow key={item.id} item={item} index={i} siutRows={siutRows} augmentecRows={augmentecRows} />
              ))}
            </div>
          ))}
        </Panel>
      )}

      {tab === 'RE-AIM' && (
        <div className="space-y-6">
          {PART_2.sections.map((section) => (
            <Panel key={section.id} title={section.title} subtitle={section.guidingQuestion}>
              {section.items.map((item, i) => (
                <CompareItemRow key={item.id} item={item} index={i} siutRows={siutRows} augmentecRows={augmentecRows} />
              ))}
            </Panel>
          ))}
        </div>
      )}

      {tab === 'Service & end-user' && (
        <div className="space-y-6">
          <Panel title={PART_3.title} subtitle={PART_3.subtitle}>
            {PART_3.sections[0].items.map((item, i) => (
              <CompareItemRow key={item.id} item={item} index={i} siutRows={siutRows} augmentecRows={augmentecRows} />
            ))}
          </Panel>
          <Panel title={PART_4.title} subtitle={PART_4.subtitle}>
            {PART_4.sections[0].items.map((item, i) => (
              <CompareItemRow key={item.id} item={item} index={i} siutRows={siutRows} augmentecRows={augmentecRows} />
            ))}
          </Panel>
        </div>
      )}

      {tab === 'Overall assessment' && (
        <div className="space-y-6">
          <Panel title="Recommendation distribution">
            <RecommendationChart siutRows={siutRows} augmentecRows={augmentecRows} />
          </Panel>
          <div className="grid sm:grid-cols-2 gap-6">
            <FreeTextPanel title="Top strengths" rows={filtered} field="strengths" />
            <FreeTextPanel title="Top risks / concerns" rows={filtered} field="risks" />
          </div>
          <FreeTextPanel title="Conditions or safeguards needed" rows={filtered} field="safeguards" />
        </div>
      )}

      {tab === 'All responses' && <ResponseTable rows={filtered} />}
    </div>
  );
}

function FilterPills({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            value === o.value ? 'bg-pine-600 text-bone' : 'bg-white border border-pine-200 text-ink/60 hover:border-pine-300'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-pine-100 bg-white p-5">
      <h3 className="font-display font-semibold text-[15px] text-pine-800">{title}</h3>
      {subtitle && <p className="text-[12.5px] text-ink/50 mt-0.5 mb-2 italic">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function FreeTextPanel({
  title,
  rows,
  field,
}: {
  title: string;
  rows: ResponseRow[];
  field: 'strengths' | 'risks' | 'safeguards';
}) {
  const entries = rows.filter((r) => r.overall && r.overall[field]);
  return (
    <div className="rounded-lg border border-pine-100 bg-white p-5">
      <h3 className="font-display font-semibold text-[15px] text-pine-800">{title}</h3>
      <div className="mt-3 space-y-3 max-h-72 overflow-y-auto pr-1">
        {entries.length === 0 && <p className="text-[13px] text-ink/40">No entries yet.</p>}
        {entries.map((r) => (
          <div key={r.id} className="rounded-md bg-pine-50/50 px-3.5 py-2.5">
            <p className="text-[13px] text-ink/80 leading-relaxed">{r.overall![field]}</p>
            <p className="mt-1 text-[11px] font-mono uppercase tracking-wide text-ink/35">
              {r.organization} · {r.respondent_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
