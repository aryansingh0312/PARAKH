import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function InspectionActivityChart({ data }) {
  const [period, setPeriod] = useState('7 days');

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="activity-heading">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="activity-heading" className="font-heading text-base font-semibold text-slate-900">Inspection Activity</h2>
          <p className="mt-1 text-xs text-slate-500">Inspections completed over the last 7 days</p>
        </div>
        <label className="sr-only" htmlFor="activity-period">Activity period</label>
        <select
          id="activity-period"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="7 days">Last 7 days</option>
        </select>
      </div>
      {data.length ? (
        <div className="h-64 w-full" role="img" aria-label="Area chart of completed inspections for the last seven days">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="inspectionActivityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#e8edf3" strokeDasharray="3 4" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, borderColor: '#dbe2ea', boxShadow: '0 8px 24px rgba(15,23,42,.08)' }}
                labelStyle={{ color: '#334155', fontWeight: 600 }}
                formatter={(value) => [`${value} inspections`, 'Completed']}
              />
              <Area type="monotone" dataKey="completed" stroke="#2563eb" strokeWidth={2.5} fill="url(#inspectionActivityFill)" activeDot={{ r: 5, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">No inspection activity yet.</div>
      )}
    </section>
  );
}

export default InspectionActivityChart;