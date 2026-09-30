import { ArrowRight } from 'lucide-react';

const badgeStyle = {
  Completed: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-800',
  'In Progress': 'bg-blue-50 text-blue-700',
};

const riskStyle = {
  High: 'bg-rose-50 text-rose-700',
  Medium: 'bg-amber-50 text-amber-800',
  Low: 'bg-emerald-50 text-emerald-700',
};

function RecentInspections({ inspections, onViewAll }) {
  return (
    <section id="recent-inspections" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="inspections-heading">
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <h2 id="inspections-heading" className="font-heading text-base font-semibold text-slate-900">Recent Inspections</h2>
          <p className="mt-1 text-xs text-slate-500">Latest field activity and project status</p>
        </div>
        <button type="button" onClick={onViewAll} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      {inspections.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                <th className="px-5 py-3">Project</th>
                <th className="px-4 py-3">Inspector</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((inspection) => (
                <tr key={inspection.id} className="border-b border-slate-100 text-slate-600 transition hover:bg-slate-50 last:border-0">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{inspection.project}</td>
                  <td className="px-4 py-3.5">{inspection.inspector}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{inspection.date}</td>
                  <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeStyle[inspection.status] || 'bg-slate-100 text-slate-600'}`}>{inspection.status}</span></td>
                  <td className="px-4 py-3.5">{inspection.risk ? <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskStyle[inspection.risk] || 'bg-slate-100 text-slate-600'}`}>{inspection.risk}</span> : <span className="text-slate-400">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 pb-6 text-sm text-slate-500">
          <p className="font-medium text-slate-700">No inspections yet</p>
          <p className="mt-1">Assigned inspections will appear here.</p>
        </div>
      )}
    </section>
  );
}

export default RecentInspections;