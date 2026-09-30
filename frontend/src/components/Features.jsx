import {
  ArrowRight,
  BellRing,
  ClipboardCheck,
  FileText,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    title: 'Random Inspection Assignment',
    description: 'Automatically assign projects and inspectors.',
    icon: Sparkles,
  },
  {
    title: 'GPS Verification',
    description: 'Verify inspector location using GPS and geo-fencing.',
    icon: MapPinned,
  },
  {
    title: 'Geo-Tagged Evidence',
    description: 'Capture timestamped and location-linked photographs.',
    icon: ShieldCheck,
  },
  {
    title: 'AI Risk Detection',
    description: 'Analyze inspection data for unusual patterns.',
    icon: BellRing,
  },
  {
    title: 'Real-Time Dashboard',
    description: 'Monitor projects, inspections and alerts.',
    icon: ClipboardCheck,
  },
  {
    title: 'Digital Reports',
    description: 'Generate structured inspection reports.',
    icon: FileText,
  },
];

function Features() {
  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Platform capabilities</p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
            Everything needed for smarter inspections.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_42px_rgba(37,99,235,0.08)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
