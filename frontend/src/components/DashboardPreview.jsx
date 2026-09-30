import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Map,
  ShieldCheck,
} from 'lucide-react';

function DashboardPreview() {
  return (
    <section id="dashboard" className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Government oversight</p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
            A single source of truth for officials.
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Monitoring dashboard</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">National Portfolio Overview</h3>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              92% compliance trend
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Projects</span>
                    <Map className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">124</p>
                  <p className="mt-2 text-xs text-emerald-600">+8 this week</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Inspections</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">106</p>
                  <p className="mt-2 text-xs text-blue-600">+14 completed</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Risk alerts</span>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">12</p>
                  <p className="mt-2 text-xs text-amber-600">4 high priority</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Inspection Trends</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    18.4%
                  </div>
                </div>
                <div className="flex h-32 items-end gap-2">
                  {[22, 26, 20, 32, 28, 40, 52, 56, 48, 64, 60, 72].map((height, idx) => (
                    <div key={idx} className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-300" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Pending inspections</p>
                  <Clock3 className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-3">
                  {[
                    ['ABC Skill Centre', '2 days'],
                    ['Rural Health Unit', '4 days'],
                    ['MGNREGA Cluster', '1 day'],
                  ].map(([name, age]) => (
                    <div key={name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-slate-600">
                      <span>{name}</span>
                      <span className="font-medium text-slate-700">{age}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-4 text-sm font-semibold text-slate-700">Recent alerts</p>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-amber-700">
                    <span>Location mismatch</span>
                    <span>High</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 text-rose-700">
                    <span>Delayed reporting</span>
                    <span>High</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 text-blue-700">
                    <span>Field verification complete</span>
                    <span>Clear</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.6fr] gap-2 border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span>Project</span>
              <span>Inspector</span>
              <span>Status</span>
              <span>Risk</span>
            </div>

            {[
              ['ABC Skill Development Centre', 'A. Sharma', 'Verified', 'Low'],
              ['Rural Health Unit', 'R. Mehta', 'Pending', 'Medium'],
              ['MGNREGA Cluster', 'P. Nair', 'Review', 'High'],
            ].map(([project, inspector, status, risk]) => (
              <div key={project} className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.6fr] gap-2 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-700">{project}</span>
                <span>{inspector}</span>
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-1 text-[10px] font-semibold ${
                    status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-700'
                      : status === 'Pending'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {status}
                </span>
                <span className="font-medium text-slate-700">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;
