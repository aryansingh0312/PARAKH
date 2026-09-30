import { ArrowUpRight, MapPin } from 'lucide-react';

const riskStyles = {
  low: 'bg-emerald-600 ring-emerald-100',
  medium: 'bg-amber-500 ring-amber-100',
  high: 'bg-rose-600 ring-rose-100',
};

function ProjectLocations({ locations, onViewMap }) {
  return (
    <section id="project-locations" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="locations-heading">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
        <div>
          <h2 id="locations-heading" className="font-heading text-base font-semibold text-slate-900">Project Locations</h2>
          <p className="mt-1 text-xs text-slate-500">Monitored projects across regions</p>
        </div>
        <button type="button" onClick={onViewMap} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">
          View Full Map <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {locations.length ? (
        <div className="relative mx-4 mb-4 h-[260px] overflow-hidden rounded-lg border border-slate-200 bg-[#eef3ef] sm:mx-5 sm:mb-5 sm:h-[320px]" aria-label="Map-style overview of monitored project locations">
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(28deg, transparent 46%, #fff 47%, #fff 48%, transparent 49%), linear-gradient(112deg, transparent 44%, #fff 45%, #fff 46%, transparent 47%), linear-gradient(0deg, transparent 48%, #d9e2dd 49%, #d9e2dd 50%, transparent 51%), linear-gradient(90deg, transparent 48%, #d9e2dd 49%, #d9e2dd 50%, transparent 51%)', backgroundSize: '180px 145px, 210px 175px, 96px 82px, 96px 82px' }} />
          <div className="absolute -left-[8%] top-[38%] h-10 w-[120%] rotate-[-15deg] rounded-[50%] border-y-[7px] border-sky-200/80" />
          <div className="absolute left-[58%] top-[-20%] h-[145%] w-8 rotate-[18deg] rounded-[50%] border-x-[6px] border-white/90" />
          <div className="absolute left-[14%] top-[18%] h-16 w-24 rounded-[45%] bg-emerald-100/80" />
          <div className="absolute bottom-[12%] right-[17%] h-20 w-28 rounded-[45%] bg-emerald-100/80" />
          {locations.map((location) => (
            <button
              type="button"
              key={location.id}
              title={`${location.name} · ${location.risk} risk`}
              aria-label={`${location.name}, ${location.region}, ${location.risk} risk`}
              className={`absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white ring-4 ${riskStyles[location.risk] || riskStyles.low} shadow-md transition hover:z-20 hover:scale-125`}
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
            >
              <MapPin className="h-4 w-4" />
            </button>
          ))}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 rounded-lg border border-slate-200/80 bg-white/95 px-3 py-2 shadow-sm">
            {segments.map(([label, color]) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                <span className={`h-2 w-2 rounded-full ${color}`} />{label}
              </span>
            ))}
          </div>
          <span className="absolute right-3 top-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-500">Regional overview</span>
        </div>
      ) : (
        <div className="m-4 flex h-52 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">Project locations will appear here.</div>
      )}
    </section>
  );
}

const segments = [
  ['Low Risk', 'bg-emerald-600'],
  ['Medium Risk', 'bg-amber-500'],
  ['High Risk', 'bg-rose-600'],
];

export default ProjectLocations;