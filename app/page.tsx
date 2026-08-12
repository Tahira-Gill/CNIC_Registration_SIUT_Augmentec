'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CHECKPOINTS,
  LikertValue,
  Organization,
  PART_1,
  PART_2,
  PART_3,
  PART_4,
  RECOMMENDATION_OPTIONS,
  Section,
  SUBMISSION_TYPES,
} from '@/lib/questions';
import { createClient } from '@/lib/supabase/client';
import { CardHeader } from '@/components/form/CardHeader';
import { ChipProgress } from '@/components/form/ChipProgress';
import { ScaleLegend } from '@/components/form/ScaleLegend';
import { SectionBlock } from '@/components/form/QuestionBlocks';
import { CoversToggle, FieldLabel, OrgToggle, SelectField, TextAreaField, TextField } from '@/components/form/Fields';

type Step = { type: 'respondent' } | { type: 'section'; section: Section } | { type: 'overall' } | { type: 'review' };

const today = () => new Date().toISOString().slice(0, 10);

export default function HomePage() {
  const router = useRouter();

  const [organization, setOrganization] = useState<Organization | ''>('');
  const [respondentName, setRespondentName] = useState('');
  const [roleDesignation, setRoleDesignation] = useState('');
  const [departmentTeam, setDepartmentTeam] = useState('');
  const [responseDate, setResponseDate] = useState(today());
  const [coversRollout, setCoversRollout] = useState(false);
  const [coversEvaluateSustain, setCoversEvaluateSustain] = useState(false);
  const [checkpointMonth, setCheckpointMonth] = useState('');

  const [answers, setAnswers] = useState<Record<string, LikertValue>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const [strengths, setStrengths] = useState('');
  const [risks, setRisks] = useState('');
  const [safeguards, setSafeguards] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [specify, setSpecify] = useState('');

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function toggleCovers(key: 'rollout' | 'evaluate_sustain') {
    if (key === 'rollout') setCoversRollout((v) => !v);
    else setCoversEvaluateSustain((v) => !v);
  }

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [{ type: 'respondent' }];
    if (coversRollout) {
      PART_1.sections.forEach((sec) => s.push({ type: 'section', section: sec }));
    }
    if (coversEvaluateSustain) {
      [...PART_2.sections, ...PART_3.sections, ...PART_4.sections].forEach((sec) =>
        s.push({ type: 'section', section: sec })
      );
      s.push({ type: 'overall' });
    }
    s.push({ type: 'review' });
    return s;
  }, [coversRollout, coversEvaluateSustain]);

  const stepLabels = steps.map((s) =>
    s.type === 'respondent' ? 'Respondent' : s.type === 'overall' ? 'Overall' : s.type === 'review' ? 'Review' : s.section.title
  );

  const current = steps[Math.min(step, steps.length - 1)];

  const respondentValid =
    organization !== '' &&
    respondentName.trim().length > 0 &&
    (coversRollout || coversEvaluateSustain) &&
    (!coversEvaluateSustain || checkpointMonth !== '');

  function goNext() {
    setError('');
    if (step === 0 && !respondentValid) {
      setError('Please fill in organization, name, and at least one submission type before continuing.');
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('responses').insert({
        organization,
        respondent_name: respondentName.trim(),
        role_designation: roleDesignation.trim() || null,
        department_team: departmentTeam.trim() || null,
        response_date: responseDate,
        covers_rollout: coversRollout,
        covers_evaluate_sustain: coversEvaluateSustain,
        checkpoint_month: coversEvaluateSustain ? checkpointMonth : null,
        answers,
        comments,
        overall: coversEvaluateSustain ? { strengths, risks, safeguards, recommendation, specify } : {},
      });
      if (insertError) throw insertError;
      router.push('/thank-you');
    } catch (e: any) {
      setError(e?.message || 'Something went wrong submitting your response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = Object.keys(answers).length;

  const coversLabel = [
    coversRollout && SUBMISSION_TYPES[0].label,
    coversEvaluateSustain &&
      `${SUBMISSION_TYPES[1].label}${checkpointMonth ? ` (${CHECKPOINTS.find((c) => c.value === checkpointMonth)?.label})` : ''}`,
  ]
    .filter(Boolean)
    .join('  +  ');

  return (
    <main className="min-h-screen bg-bone">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
        <CardHeader
          eyebrow="Secure Assessment · SIUT × Augmentec"
          title="CNIC Registration — Technology Assessment"
          subtitle="A joint RE-AIM and Proctor's-framework evaluation of the CNIC-based outpatient registration system. Your organization's honest rating shapes whether, and how, this rolls out further."
        />

        <ScaleLegend />

        <div className="mt-6">
          <ChipProgress steps={stepLabels} current={step} onJump={(i) => setStep(i)} />
        </div>

        <div className="mt-7 rounded-xl bg-white/60 p-5 sm:p-7 shadow-sm border border-pine-100">
          {current.type === 'respondent' && (
            <div className="space-y-5 animate-fadeUp">
              <div>
                <FieldLabel required>Organization</FieldLabel>
                <OrgToggle value={organization} onChange={setOrganization} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Name</FieldLabel>
                  <TextField value={respondentName} onChange={setRespondentName} placeholder="Your full name" required />
                </div>
                <div>
                  <FieldLabel>Role / designation</FieldLabel>
                  <TextField value={roleDesignation} onChange={setRoleDesignation} placeholder="e.g. Registration Supervisor" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Department / team</FieldLabel>
                  <TextField value={departmentTeam} onChange={setDepartmentTeam} placeholder="e.g. Outpatient Registration" />
                </div>
                <div>
                  <FieldLabel required>Date</FieldLabel>
                  <TextField type="date" value={responseDate} onChange={setResponseDate} required />
                </div>
              </div>

              <div>
                <FieldLabel required>
                  This submission covers <span className="normal-case text-ink/35">(select one or both)</span>
                </FieldLabel>
                <CoversToggle covers={{ rollout: coversRollout, evaluate_sustain: coversEvaluateSustain }} onToggle={toggleCovers} />
              </div>

              {coversEvaluateSustain && (
                <div className="animate-fadeUp">
                  <FieldLabel required>Checkpoint</FieldLabel>
                  <SelectField
                    value={checkpointMonth}
                    onChange={setCheckpointMonth}
                    options={CHECKPOINTS}
                    placeholder="Select checkpoint month"
                    required
                  />
                </div>
              )}
            </div>
          )}

          {current.type === 'section' && (
            <SectionBlock
              section={current.section}
              answers={answers}
              onAnswer={(id, v) => setAnswers((a) => ({ ...a, [id]: v }))}
              comment={comments[current.section.commentsId] || ''}
              onComment={(v) => setComments((c) => ({ ...c, [current.section.commentsId]: v }))}
            />
          )}

          {current.type === 'overall' && (
            <div className="space-y-5 animate-fadeUp">
              <div>
                <h2 className="font-display text-xl font-semibold text-pine-800">Part V — Overall Assessment</h2>
                <p className="mt-1 text-sm text-ink/55">Complete after reviewing the sections above at this checkpoint.</p>
              </div>

              <div>
                <FieldLabel>Top strengths of this system for SIUT's context</FieldLabel>
                <TextAreaField value={strengths} onChange={setStrengths} rows={3} />
              </div>
              <div>
                <FieldLabel>Top risks or concerns</FieldLabel>
                <TextAreaField value={risks} onChange={setRisks} rows={3} />
              </div>
              <div>
                <FieldLabel>Conditions or safeguards needed before full rollout</FieldLabel>
                <TextAreaField value={safeguards} onChange={setSafeguards} rows={3} />
              </div>
              <div>
                <FieldLabel required>Overall recommendation</FieldLabel>
                <SelectField
                  value={recommendation}
                  onChange={setRecommendation}
                  options={RECOMMENDATION_OPTIONS}
                  placeholder="Select a recommendation"
                  required
                />
              </div>
              {(recommendation === 'proceed_modifications' || recommendation === 'need_more_info') && (
                <div className="animate-fadeUp">
                  <FieldLabel>Please specify</FieldLabel>
                  <TextAreaField value={specify} onChange={setSpecify} rows={2} />
                </div>
              )}
            </div>
          )}

          {current.type === 'review' && (
            <div className="space-y-5 animate-fadeUp">
              <div>
                <h2 className="font-display text-xl font-semibold text-pine-800">Review & submit</h2>
                <p className="mt-1 text-sm text-ink/55">
                  Double-check the summary below, then send your assessment to SIUT's Data Analytics & Improvement
                  Sciences section.
                </p>
              </div>

              <dl className="rounded-lg border border-pine-100 bg-pine-50/50 p-4 text-[14px] divide-y divide-pine-100">
                <Row k="Organization" v={organization || '—'} />
                <Row k="Name" v={respondentName || '—'} />
                <Row k="Role" v={roleDesignation || '—'} />
                <Row k="Department / team" v={departmentTeam || '—'} />
                <Row k="Date" v={responseDate} />
                <Row k="Submission covers" v={coversLabel || '—'} />
                <Row k="Items rated" v={String(answeredCount)} />
              </dl>

              {error && (
                <p className="rounded-md border border-coral/30 bg-coral/5 px-3.5 py-2.5 text-sm text-coral">{error}</p>
              )}
            </div>
          )}
        </div>

        {error && current.type !== 'review' && (
          <p className="mt-3 rounded-md border border-coral/30 bg-coral/5 px-3.5 py-2.5 text-sm text-coral">{error}</p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="rounded-md px-4 py-2.5 text-sm font-medium text-pine-700 disabled:opacity-30 hover:bg-pine-50 transition"
          >
            ← Back
          </button>

          {current.type === 'review' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-md bg-pine-600 px-6 py-2.5 text-sm font-semibold text-bone shadow-sm hover:bg-pine-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit assessment'}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="rounded-md bg-pine-600 px-6 py-2.5 text-sm font-semibold text-bone shadow-sm hover:bg-pine-700 transition"
            >
              Continue →
            </button>
          )}
        </div>

        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-widest text-ink/30">
          SIUT · DCTS · Data Analytics &amp; Improvement Sciences
        </p>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0">
      <dt className="text-ink/50">{k}</dt>
      <dd className="font-medium text-ink text-right">{v}</dd>
    </div>
  );
}
