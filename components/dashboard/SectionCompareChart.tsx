'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Section } from '@/lib/questions';
import { ResponseRow, sectionAverage } from '@/lib/scoring';

export function SectionCompareChart({
  sections,
  siutRows,
  augmentecRows,
}: {
  sections: Section[];
  siutRows: ResponseRow[];
  augmentecRows: ResponseRow[];
}) {
  const data = sections.map((s) => ({
    name: s.title,
    SIUT: sectionAverage(siutRows, s) ?? 0,
    Augmentec: sectionAverage(augmentecRows, s) ?? 0,
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF3EF" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#0E1F1B99' }}
            interval={0}
            angle={-18}
            textAnchor="end"
            height={64}
          />
          <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#0E1F1B99' }} />
          <Tooltip
            contentStyle={{ borderRadius: 8, borderColor: '#CDE4DA', fontSize: 12 }}
            formatter={(v: any) => (typeof v === 'number' ? v.toFixed(2) : v)}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="SIUT" fill="#1F6650" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Augmentec" fill="#2C5F78" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
