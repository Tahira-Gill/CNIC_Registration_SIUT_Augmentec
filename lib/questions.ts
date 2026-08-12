// Data model for the CNIC-Based Patient Registration System (Augmentec) technology
// assessment. Mirrors "Technology Assessment Questionnaire — CNIC-Based Patient
// Registration System (Augmentec)" (RE-AIM + Proctor's implementation outcomes).

export type LikertValue = 'SD' | 'D' | 'N' | 'A' | 'SA' | 'NA';

export const LIKERT_OPTIONS: { value: LikertValue; label: string; short: string }[] = [
  { value: 'SD', label: 'Strongly Disagree', short: 'SD' },
  { value: 'D', label: 'Disagree', short: 'D' },
  { value: 'N', label: 'Neutral', short: 'N' },
  { value: 'A', label: 'Agree', short: 'A' },
  { value: 'SA', label: 'Strongly Agree', short: 'SA' },
  { value: 'NA', label: 'Not able to comment / N/A', short: 'N/A' },
];

// Numeric mapping used purely for dashboard scoring. 'NA' is excluded from averages.
export const LIKERT_SCORE: Record<LikertValue, number | null> = {
  SD: 1,
  D: 2,
  N: 3,
  A: 4,
  SA: 5,
  NA: null,
};

export type QuestionItem = {
  id: string;
  label: string;
  description: string;
};

export type Section = {
  id: string;
  title: string;
  guidingQuestion?: string;
  items: QuestionItem[];
  commentsId: string;
};

export type Part = {
  id: 'part1' | 'part2' | 'part3' | 'part4' | 'part5';
  title: string;
  subtitle: string;
  sections: Section[];
};

export const ORGANIZATIONS = ['SIUT', 'Augmentec'] as const;
export type Organization = (typeof ORGANIZATIONS)[number];

export const SUBMISSION_TYPES = [
  { value: 'rollout', label: 'Rollout monitoring (weeks 1–12)' },
  { value: 'evaluate_sustain', label: 'Evaluate & sustain checkpoint' },
] as const;
export type SubmissionType = (typeof SUBMISSION_TYPES)[number]['value'];

export const CHECKPOINTS = [
  { value: '1', label: 'Month 1' },
  { value: '3', label: 'Month 3' },
  { value: '6', label: 'Month 6' },
  { value: '12', label: 'Month 12' },
] as const;

// ---------------------------------------------------------------------------
// Part I — Proctor's Implementation Outcomes (rollout, weeks 1–12)
// ---------------------------------------------------------------------------
export const PART_1: Part = {
  id: 'part1',
  title: "Part I — Proctor's Implementation Outcomes",
  subtitle: 'Complete during rollout — weeks 1 to 12 after go-live.',
  sections: [
    {
      id: 'proctors',
      title: "Proctor's implementation outcomes",
      items: [
        {
          id: 'p1_acceptability',
          label: 'Acceptability',
          description:
            'Registration staff and patients find this system agreeable and appropriate for registration.',
        },
        {
          id: 'p1_adoption',
          label: 'Adoption',
          description: 'The decision or intention to adopt this system at SIUT is confirmed.',
        },
        {
          id: 'p1_appropriateness',
          label: 'Appropriateness',
          description: "This system is a good fit for SIUT's registration needs and patient population.",
        },
        {
          id: 'p1_cost',
          label: 'Cost',
          description:
            'The full cost of this system (hardware, licensing, training, maintenance, IT support) is clearly defined and affordable.',
        },
        {
          id: 'p1_feasibility',
          label: 'Feasibility',
          description: "This system can realistically be implemented within SIUT's current IT and network infrastructure.",
        },
        {
          id: 'p1_fidelity',
          label: 'Fidelity',
          description:
            "This system can be used exactly as designed and intended within SIUT's day-to-day registration workflow.",
        },
        {
          id: 'p1_penetration',
          label: 'Penetration',
          description:
            'This system is designed to be integrated across all relevant registration desks and shifts, not limited to a single pilot point.',
        },
        {
          id: 'p1_sustainability',
          label: 'Sustainability',
          description: 'This system and its support model can be sustained long-term without major additional investment.',
        },
      ],
      commentsId: 'p1_comments',
    },
  ],
};

// ---------------------------------------------------------------------------
// Part II — RE-AIM Assessment (evaluate & sustain checkpoints)
// ---------------------------------------------------------------------------
export const PART_2: Part = {
  id: 'part2',
  title: 'Part II — RE-AIM Assessment',
  subtitle: 'Complete at each evaluate & sustain checkpoint — months 1, 3, 6 and 12 after go-live.',
  sections: [
    {
      id: 'reach',
      title: 'Reach',
      guidingQuestion: 'How do I reach the targeted population?',
      items: [
        {
          id: 'reach_1',
          label: 'Identification coverage',
          description:
            'The system can capture identification data for all patient types, including those with a standard CNIC, children/minors with a B-form, and patients without any standard national ID (e.g., foreign nationals, undocumented patients).',
        },
        {
          id: 'reach_2',
          label: 'No systematic barriers',
          description:
            'The registration process does not create systematic barriers for elderly, illiterate, or first-time patients.',
        },
      ],
      commentsId: 'reach_comments',
    },
    {
      id: 'effectiveness',
      title: 'Effectiveness',
      guidingQuestion: 'How do I know my intervention is effective?',
      items: [
        {
          id: 'eff_1',
          label: 'Fewer duplicate MRNs / errors',
          description: 'The system is expected to reduce duplicate medical record numbers (MRNs) and registration data-entry errors.',
        },
        {
          id: 'eff_2',
          label: 'Faster registration',
          description: 'The system is expected to speed up the overall registration process compared to the current manual process.',
        },
        {
          id: 'eff_3',
          label: 'Unintended consequences considered',
          description:
            'Potential unintended consequences (e.g., patient refusal to share CNIC, registration delays for edge cases) have been identified and considered.',
        },
      ],
      commentsId: 'eff_comments',
    },
    {
      id: 'adoption_org',
      title: 'Adoption (organizational)',
      guidingQuestion: 'How do I develop organizational support to deliver my intervention?',
      items: [
        {
          id: 'adopt_1',
          label: 'Leadership commitment',
          description:
            'Hospital leadership (registration department, administration) has committed the organizational support needed to roll this system out.',
        },
        {
          id: 'adopt_2',
          label: 'Documented rollout plan',
          description: 'There is a clear, documented plan for which registration desks and shifts will adopt the system, and when.',
        },
      ],
      commentsId: 'adopt_comments',
    },
    {
      id: 'implementation',
      title: 'Implementation',
      guidingQuestion: 'How do I ensure the intervention is delivered properly?',
      items: [
        {
          id: 'impl_1',
          label: 'Clear operating protocol',
          description: 'There is a clear protocol for scanning, handling missing/damaged CNICs, and correcting registration errors.',
        },
        {
          id: 'impl_2',
          label: 'Training & support materials',
          description: 'Staff training and support materials for this system are planned or already available.',
        },
      ],
      commentsId: 'impl_comments',
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      guidingQuestion: 'How do I incorporate the intervention so it is delivered over the long term?',
      items: [
        {
          id: 'maint_1',
          label: 'Technical maintenance plan',
          description: 'There is a plan for ongoing technical maintenance, device servicing, and software updates.',
        },
        {
          id: 'maint_2',
          label: 'Sustained beyond pilot',
          description: 'There is a plan to sustain use of the system beyond an initial pilot (e.g., written into registration SOPs).',
        },
      ],
      commentsId: 'maint_comments',
    },
  ],
};

// ---------------------------------------------------------------------------
// Part III — Service Outcomes
// ---------------------------------------------------------------------------
export const PART_3: Part = {
  id: 'part3',
  title: 'Part III — Service Outcomes',
  subtitle: 'Complete alongside Part II, at each evaluate & sustain checkpoint.',
  sections: [
    {
      id: 'service',
      title: 'Service outcomes',
      items: [
        {
          id: 'svc_efficiency',
          label: 'Efficiency',
          description: 'This system reduces the time and administrative burden of patient registration.',
        },
        {
          id: 'svc_safety',
          label: 'Safety',
          description: "This system does not introduce new risks (e.g., breach of patients' personal identification data).",
        },
        {
          id: 'svc_effectiveness',
          label: 'Effectiveness',
          description: 'This system produces accurate, reliable patient identification and registration records.',
        },
        {
          id: 'svc_equity',
          label: 'Equity',
          description:
            'This system performs equally well for all patient groups (with/without CNIC, children, elderly, non-Pakistani nationals).',
        },
        {
          id: 'svc_patient_centeredness',
          label: 'Patient-centeredness',
          description: 'This system respects patient dignity, privacy, and consent in how identification data is collected and used.',
        },
        {
          id: 'svc_timeliness',
          label: 'Timeliness',
          description: 'Registration is completed promptly without adding to patient wait times.',
        },
      ],
      commentsId: 'svc_comments',
    },
  ],
};

// ---------------------------------------------------------------------------
// Part IV — End-User Outcomes
// ---------------------------------------------------------------------------
export const PART_4: Part = {
  id: 'part4',
  title: 'Part IV — End-User Outcomes',
  subtitle: 'Complete alongside Part II, at each evaluate & sustain checkpoint.',
  sections: [
    {
      id: 'end_user',
      title: 'End-user outcomes',
      items: [
        {
          id: 'user_satisfaction',
          label: 'Satisfaction',
          description: 'Patients are satisfied with their experience during registration using this system.',
        },
        {
          id: 'user_functional_impact',
          label: 'Functional impact',
          description: "This system fits smoothly into the patient's visit without adding unnecessary steps or confusion.",
        },
        {
          id: 'user_downstream_care',
          label: 'Downstream care impact',
          description:
            "Registration delays or errors related to this system do not negatively affect a patient's timely access to care.",
        },
      ],
      commentsId: 'user_comments',
    },
  ],
};

export const RECOMMENDATION_OPTIONS = [
  { value: 'proceed_pilot', label: 'Proceed to pilot' },
  { value: 'proceed_modifications', label: 'Proceed with modifications' },
  { value: 'do_not_proceed', label: 'Do not proceed at this time' },
  { value: 'need_more_info', label: 'Need more information' },
] as const;
export type RecommendationValue = (typeof RECOMMENDATION_OPTIONS)[number]['value'];

export const REAIM_PARTS: Part[] = [PART_2, PART_3, PART_4];

export function allItemsFor(parts: Part[]): QuestionItem[] {
  return parts.flatMap((p) => p.sections.flatMap((s) => s.items));
}

export const PART_1_ITEM_COUNT = allItemsFor([PART_1]).length;
export const REAIM_ITEM_COUNT = allItemsFor(REAIM_PARTS).length;
