import { LIKERT_SCORE, LikertValue, Organization, Section } from './questions';

export type ResponseRow = {
  id: string;
  created_at: string;
  organization: Organization;
  respondent_name: string;
  role_designation: string | null;
  department_team: string | null;
  response_date: string;
  covers_rollout: boolean;
  covers_evaluate_sustain: boolean;
  checkpoint_month: string | null;
  answers: Record<string, LikertValue>;
  comments: Record<string, string>;
  overall: {
    strengths?: string;
    risks?: string;
    safeguards?: string;
    recommendation?: string;
    specify?: string;
  } | null;
};

export function filterRows(
  rows: ResponseRow[],
  opts: { organization?: Organization | 'All'; submissionType?: 'rollout' | 'evaluate_sustain' | 'All'; checkpoint?: string | 'All' }
) {
  return rows.filter((r) => {
    if (opts.organization && opts.organization !== 'All' && r.organization !== opts.organization) return false;
    if (opts.submissionType === 'rollout' && !r.covers_rollout) return false;
    if (opts.submissionType === 'evaluate_sustain' && !r.covers_evaluate_sustain) return false;
    if (opts.checkpoint && opts.checkpoint !== 'All' && r.checkpoint_month !== opts.checkpoint) return false;
    return true;
  });
}

export function itemDistribution(rows: ResponseRow[], itemId: string): Record<LikertValue, number> {
  const dist: Record<LikertValue, number> = { SD: 0, D: 0, N: 0, A: 0, SA: 0, NA: 0 };
  for (const r of rows) {
    const v = r.answers?.[itemId];
    if (v && v in dist) dist[v] += 1;
  }
  return dist;
}

export function itemAverage(rows: ResponseRow[], itemId: string): number | null {
  const scores: number[] = [];
  for (const r of rows) {
    const v = r.answers?.[itemId];
    const score = v ? LIKERT_SCORE[v] : null;
    if (score !== null && score !== undefined) scores.push(score);
  }
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function sectionAverage(rows: ResponseRow[], section: Section): number | null {
  const scores: number[] = [];
  for (const item of section.items) {
    for (const r of rows) {
      const v = r.answers?.[item.id];
      const score = v ? LIKERT_SCORE[v] : null;
      if (score !== null && score !== undefined) scores.push(score);
    }
  }
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function respondedCount(rows: ResponseRow[], itemId: string): number {
  return rows.filter((r) => r.answers?.[itemId]).length;
}

export function toCSV(rows: ResponseRow[]): string {
  const headers = [
    'id',
    'created_at',
    'organization',
    'respondent_name',
    'role_designation',
    'department_team',
    'response_date',
    'covers_rollout',
    'covers_evaluate_sustain',
    'checkpoint_month',
    'answers',
    'comments',
    'overall',
  ];
  const escape = (v: unknown) => {
    const s = typeof v === 'string' ? v : JSON.stringify(v ?? '');
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.created_at,
        r.organization,
        r.respondent_name,
        r.role_designation ?? '',
        r.department_team ?? '',
        r.response_date,
        r.covers_rollout,
        r.covers_evaluate_sustain,
        r.checkpoint_month ?? '',
        r.answers,
        r.comments,
        r.overall,
      ]
        .map(escape)
        .join(',')
    );
  }
  return lines.join('\n');
}
