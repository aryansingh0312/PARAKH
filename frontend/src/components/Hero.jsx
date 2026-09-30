import { ArrowRight, BadgeCheck, MapPinned, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pb-16 pt-8 sm:pb-20 lg:pb-24">
      <div className="absolute inset-x-0 top-[-5rem] -z-10 mx-auto h-[26rem] w-[70rem] rounded-full bg-blue-100/70 blur-3xl" />
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-800 shadow-sm">
            <BadgeCheck className="h-3.5 w-3.5" />
            AI-POWERED GOVERNMENT MONITORING
          </div>

          <h1 className="font-heading text-4xl font-semibold leading-[1.04] tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-[4.2rem]">
            Smarter Inspections.
            <span className="mt-2 block text-slate-900">Stronger Accountability.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
            PARAKH brings intelligent monitoring, surprise inspections, geo-verified evidence and
            AI-powered risk detection together in one centralized platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-base font-medium text-white shadow-[0_18px_32px_rgba(37,99,235,0.30)] transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              Access Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
            >
              Explore Platform
            </a>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-sm text-slate-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            Built for transparent, data-driven monitoring.
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[620px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-5">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Monitoring Overview
                  </p>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  Live
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">124</p>
                  <p className="mt-1 text-xs text-slate-500">Projects</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">18</p>
                  <p className="mt-1 text-xs text-slate-500">Pending</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">106</p>
                  <p className="mt-1 text-xs text-slate-500">Completed</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">12</p>
                  <p className="mt-1 text-xs text-slate-500">High Risk</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Project Map</p>
                    <MapPinned className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="relative h-32 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.18),transparent_35%),linear-gradient(135deg,#e2e8f0,#f8fafc)]">
                    <div className="absolute left-8 top-8 h-3 w-3 rounded-full bg-blue-600" />
                    <div className="absolute left-14 top-16 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <div className="absolute right-10 top-9 h-3 w-3 rounded-full bg-amber-500" />
                    <div className="absolute bottom-7 left-12 h-12 w-20 rounded-full border border-dashed border-slate-300" />
                    <div className="absolute bottom-4 right-9 h-10 w-16 rounded-full border border-dashed border-slate-300" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Risk Distribution</p>
                    <TriangleAlert className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="space-y-3">
                    {[72, 48, 83, 58].map((value, index) => (
                      <div key={index}>
                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Region {index + 1}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              index % 2 === 0 ? 'bg-blue-600' : index === 1 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Inspection Activity</p>
                    <span className="text-[11px] font-medium text-slate-500">This week</span>
                  </div>
                  <div className="flex h-20 items-end gap-2">
                    {[18, 30, 24, 42, 36, 48, 56].map((height, index) => (
                      <span
                        key={`${height}-${index}`}
                        className={`w-full rounded-t-lg ${
                          index === 6 ? 'bg-blue-600' : index % 2 === 0 ? 'bg-sky-200' : 'bg-blue-100'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Recent Alerts</p>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between rounded-xl bg-amber-50 px-2 py-2 text-amber-700">
                      <span>Signal drift</span>
                      <span>2m</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-blue-50 px-2 py-2 text-blue-700">
                      <span>New assignment</span>
                      <span>15m</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-2 py-2 text-emerald-700">
                      <span>Verified visit</span>
                      <span>28m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="grid grid-cols-[1.05fr_0.95fr_0.75fr] border-b border-slate-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span>Project</span>
                  <span>Status</span>
                  <span>Risk</span>
                </div>
                {[
                  ['ABC Skill', 'Verified', 'Low'],
                  ['Rural Health', 'Pending', 'Medium'],
                  ['MGNREGA Unit', 'Review', 'High'],
                ].map(([project, status, risk]) => (
                  <div key={project} className="grid grid-cols-[1.05fr_0.95fr_0.75fr] items-center px-3 py-2.5 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{project}</span>
                    <span
                      className={`inline-flex w-fit rounded-full px-2 py-1 text-[10px] font-semibold ${
                        status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700'
                          : status === 'Pending'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-amber-50 text-amber-700'
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

          <div className="absolute -left-4 top-8 animate-[float_6s_ease-in-out_infinite] rounded-2xl border border-emerald-200 bg-white px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </span>
              GPS Verified
            </div>
          </div>

          <div className="absolute -right-3 bottom-10 animate-[float_7s_ease-in-out_infinite] rounded-2xl border border-amber-200 bg-white px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                Risk Score 82/100
              </span>
            </div>
          </div>

          <div className="absolute left-1/2 top-2 -translate-x-1/2 animate-[float_5.5s_ease-in-out_infinite] rounded-2xl border border-blue-200 bg-white px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <BadgeCheck className="h-4 w-4" />
              </span>
              Inspection Assigned
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
