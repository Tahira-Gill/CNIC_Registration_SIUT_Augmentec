'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RECOMMENDATION_OPTIONS } from '@/lib/questions';
import { ResponseRow } from '@/lib/scoring';

export function RecommendationChart({ siutRows, augmentecRows }: { siutRows: ResponseRow[]; augmentecRows: ResponseRow[] }) {
  const data = RECOMMENDATION_OPTIONS.map((opt) => ({
    name: opt.label,
    SIUT: siutRows.filter((r) => r.overall?.recommendation === opt.value).length,
    Augmentec: augmentecRows.filter((r) => r.overall?.recommendation === opt.value).length,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF3EF" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10.5, fill: '#0E1F1B99' }}
            interval={0}
            angle={-14}
            textAnchor="end"
            height={70}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#0E1F1B99' }} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#CDE4DA', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="SIUT" fill="#1F6650" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Augmentec" fill="#2C5F78" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
