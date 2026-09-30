import { FileClock, MapPin, Shield, UserCog } from 'lucide-react';

const securityFeatures = [
  {
    title: 'Role-Based Access',
    description: 'Different users access only the information relevant to their responsibilities.',
    icon: UserCog,
  },
  {
    title: 'Location Verification',
    description: 'Inspection submissions can be linked to the physical project location.',
    icon: MapPin,
  },
  {
    title: 'Timestamped Evidence',
    description: 'Evidence is associated with inspection time and project information.',
    icon: FileClock,
  },
  {
    title: 'Transparent Risk Indicators',
    description: 'AI risk signals show the factors contributing to the generated score.',
    icon: Shield,
  },
];

function SecuritySection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Accountability</p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
            Built for accountability.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {securityFeatures.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Icon className="h-5 w-5" />
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

export default SecuritySection;
