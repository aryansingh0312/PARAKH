import {
  AlertTriangle,
  ClipboardList,
  Eye,
  NotebookPen,
  SearchCheck,
} from 'lucide-react';

const issues = [
  {
    title: 'Manual Processes',
    description: 'Paper-based workflows create delays.',
    icon: ClipboardList,
  },
  {
    title: 'Limited Visibility',
    description: 'Officials may not have real-time information.',
    icon: Eye,
  },
  {
    title: 'Difficult Verification',
    description: 'Physical inspection claims can be difficult to verify.',
    icon: SearchCheck,
  },
  {
    title: 'Predictable Inspections',
    description: 'Fixed inspection patterns can reduce effectiveness.',
    icon: NotebookPen,
  },
  {
    title: 'Hidden Anomalies',
    description: 'Important patterns can remain buried in historical data.',
    icon: AlertTriangle,
  },
];

function ProblemSection() {
  return (
    <section id="about" className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Why it matters</p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
            Monitoring shouldn&apos;t stop at paperwork.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            Traditional inspection workflows can make it difficult to verify field activity,
            identify irregularities and maintain real-time visibility.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {issues.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_36px_rgba(37,99,235,0.08)]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
