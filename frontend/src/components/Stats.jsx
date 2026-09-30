import { Activity, ClipboardCheck, Map, Shield } from 'lucide-react';

const stats = [
  { value: '124+', label: 'Projects Monitored', icon: ClipboardCheck },
  { value: '106+', label: 'Inspections Completed', icon: Activity },
  { value: '98%', label: 'Location Verification', icon: Map },
  { value: '24/7', label: 'Monitoring Capability', icon: Shield },
];

function Stats() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_16px_38px_rgba(37,99,235,0.09)]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-3xl font-semibold tracking-[-0.06em] text-slate-900">{value}</div>
              <p className="mt-2 text-sm text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
