function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading dashboard" aria-busy="true">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-7 w-64 rounded bg-slate-200" />
          <div className="h-4 w-80 max-w-full rounded bg-slate-100" />
        </div>
        <div className="h-10 w-40 rounded-lg bg-slate-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 rounded-xl border border-slate-200 bg-white p-5"><div className="h-4 w-28 rounded bg-slate-100" /><div className="mt-6 h-8 w-20 rounded bg-slate-200" /></div>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="h-80 rounded-xl border border-slate-200 bg-white" />
        <div className="h-80 rounded-xl border border-slate-200 bg-white" />
      </div>
      <div className="h-72 rounded-xl border border-slate-200 bg-white" />
    </div>
  );
}

export default DashboardSkeleton;