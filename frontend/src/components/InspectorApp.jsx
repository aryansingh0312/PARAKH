import { Camera, Check, CheckCircle2, CircleDashed, MapPin, Smartphone } from 'lucide-react';

function InspectorApp() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="flex justify-center">
          <div className="relative mx-auto flex h-[540px] w-[290px] items-center justify-center rounded-[2.7rem] border-[10px] border-slate-900 bg-slate-950 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
            <div className="absolute top-3 h-2 w-24 rounded-full bg-slate-700" />
            <div className="h-full w-full overflow-hidden rounded-[2rem] bg-slate-100 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">My Inspections</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Smartphone className="h-4 w-4" />
                </div>
              </div>

              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">ABC Skill Development Centre</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  4.2 km away
                </div>
                <div className="mt-4 rounded-xl bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-700">
                  Status: Pending
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_20px_rgba(37,99,235,0.20)]"
                >
                  Start Inspection
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <Check className="h-4 w-4" />
                    Location Verified
                  </div>
                  <span className="text-xl text-emerald-600">✓</span>
                </div>
                <div className="mt-4 grid gap-2">
                  <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                    <span>Take Evidence</span>
                    <Camera className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                    <span>Inspection Checklist</span>
                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <button type="button" className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Field operations</p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
            Powerful tools for the field.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            Inspectors can complete inspections directly from their mobile device while capturing
            location, evidence and observations in real time.
          </p>

          <div className="mt-6 space-y-4">
            {[
              'GPS verification',
              'Camera evidence',
              'Digital checklist',
              'Offline-friendly workflow',
              'Instant submission',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <CircleDashed className="h-4 w-4" />
                </span>
                <span className="text-base font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InspectorApp;
