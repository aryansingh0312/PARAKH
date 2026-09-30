import { ArrowRight, CheckCircle2, FileCheck2, MapPinned, PencilLine, Radar } from 'lucide-react';

const steps = [
  { number: '01', title: 'Assign', description: 'Randomly assign an inspection.', icon: Radar },
  { number: '02', title: 'Verify', description: 'Inspector reaches the project and GPS verifies the location.', icon: MapPinned },
  { number: '03', title: 'Inspect', description: 'Complete the digital inspection checklist.', icon: FileCheck2 },
  { number: '04', title: 'Capture', description: 'Upload geo-tagged photographs and evidence.', icon: PencilLine },
  { number: '05', title: 'Analyze', description: 'AI analyzes the inspection data and generates a risk indicator.', icon: CheckCircle2 },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Workflow</p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
            From assignment to action.
          </h2>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent lg:block" />
          <div className="grid gap-6 lg:grid-cols-5">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <div key={number} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-white shadow-[0_15px_30px_rgba(37,99,235,0.10)]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">{number}</span>
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                {title !== 'Analyze' && (
                  <ArrowRight className="mt-4 hidden h-4 w-4 text-slate-400 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
