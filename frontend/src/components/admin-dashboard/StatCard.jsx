function StatCard({ label, value, change, icon: Icon, tone }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-800 ring-blue-100',
    amber: 'bg-amber-50 text-amber-800 ring-amber-100',
    green: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    red: 'bg-rose-50 text-rose-800 ring-rose-100',
  };

  return (
    <article className="group min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium leading-5 text-slate-500">{label}</p>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <p className="font-heading text-3xl font-semibold leading-none text-slate-900">{value}</p>
        <span className="text-xs font-medium text-slate-500">{change}</span>
      </div>
    </article>
  );
}

export default StatCard;