import { AlertTriangle, ShieldAlert } from 'lucide-react';

const factors = [
  { label: 'Attendance discrepancy', value: '+25' },
  { label: 'Previous compliance issue', value: '+20' },
  { label: 'Location inconsistency', value: '+25' },
  { label: 'Delayed reporting', value: '+12' },
];

function RiskDetection() {
  return (
    <section className="bg-slate-900 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">AI risk intelligence</p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            Turn inspection data into actionable insights.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
            PARAKH analyzes inspection data to identify unusual patterns and help officials
            prioritize follow-up actions.
          </p>
        </div>

        <div className="mt-12 rounded-[2rem] border border-slate-700 bg-slate-950/70 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.45)] sm:p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-slate-700 bg-slate-900 p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Project</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">ABC Skill Development Centre</h3>
                </div>
                <div className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-rose-200">
                  High Risk
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                <div className="mb-5 flex items-center justify-between text-slate-300">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Risk Score</p>
                  <p className="text-sm font-medium text-slate-400">82 / 100</p>
                </div>

                <div className="mb-4 flex items-center justify-center">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[8px] border-slate-700 bg-slate-950">
                    <div
                      className="absolute inset-0 rounded-full border-[8px] border-transparent"
                      style={{
                        background: 'conic-gradient(#f97316 0 82%, rgba(51,65,85,0.5) 82% 100%)',
                        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black 0)',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black 0)',
                      }}
                    />
                    <div className="relative flex flex-col items-center">
                      <span className="text-3xl font-semibold text-white">82</span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-700 bg-slate-900 p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-semibold text-white">Detected Factors</h3>
              </div>

              <div className="space-y-4">
                {factors.map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-slate-700 bg-slate-950 p-3">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                      <span>{label}</span>
                      <span className="font-semibold text-amber-300">{value}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                        style={{ width: value.replace('+', '') + '%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-blue-200">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="font-medium">Why was this flagged?</span>
                </div>
                <p className="text-sm leading-6 text-slate-200">
                  Multiple inconsistencies were detected across recent inspection records.
                </p>
              </div>

              <p className="mt-4 text-xs leading-6 text-slate-400">
                Risk indicators support official review and do not replace human decision-making.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RiskDetection;
