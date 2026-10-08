import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const segments = [
  { key: 'low', label: 'Low', color: '#16a34a' },
  { key: 'medium', label: 'Medium', color: '#d99a16' },
  { key: 'high', label: 'High', color: '#dc4b4b' },
];

function RiskDistributionChart({ distribution }) {
  const data = segments.map(({ key, label, color }) => ({ name: label, value: distribution[key], color }));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="risk-heading">
      <div>
        <h2 id="risk-heading" className="font-heading text-base font-semibold text-slate-900">Risk Distribution</h2>
        <p className="mt-1 text-xs text-slate-500">Current project risk levels</p>
      </div>
      {total ? (
        <>
          <div className="relative mx-auto mt-2 h-56 w-full max-w-[280px]" role="img" aria-label={`Project risk distribution: ${data.map(({ name, value }) => `${name} ${value}`).join(', ')}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="88%" paddingAngle={3} stroke="none">
                  {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} projects`, name]} contentStyle={{ borderRadius: 10, borderColor: '#dbe2ea' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-3xl font-semibold text-slate-900">{total}</span>
              <span className="text-xs text-slate-500">Projects</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">No risk data available.</div>
      )}
    </section>
  );
}

export default RiskDistributionChart;