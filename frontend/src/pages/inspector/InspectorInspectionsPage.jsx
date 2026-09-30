import { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, ClipboardCheck, CircleAlert, Timer, TriangleAlert } from 'lucide-react';
import InspectorSectionLayout from '../../components/inspections/InspectorSectionLayout';
import InspectionCard from '../../components/inspections/InspectionCard';
import { inspectionService } from '../../services/inspectionService';
import { useAuth } from '../../hooks/useAuth';

const statCards = [
  { key: 'assigned', label: 'Pending', icon: ClipboardCheck, tone: 'blue' },
  { key: 'inProgress', label: 'In Progress', icon: Timer, tone: 'amber' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, tone: 'green' },
  { key: 'overdue', label: 'Overdue', icon: TriangleAlert, tone: 'red' },
];
const statColors = { blue: 'bg-blue-50 text-blue-800', amber: 'bg-amber-50 text-amber-800', green: 'bg-emerald-50 text-emerald-800', red: 'bg-rose-50 text-rose-800' };

function InspectorInspectionsPage() {
  const { token } = useAuth();
  const [data, setData] = useState({ inspections: [], stats: { assigned: 0, inProgress: 0, completed: 0, overdue: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    inspectionService.list(token, { page: '1', limit: '100' }, controller.signal)
      .then(setData)
      .catch((requestError) => { if (!controller.signal.aborted) setError(requestError.message || 'Unable to load inspections.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, retry]);

  return (
    <InspectorSectionLayout title="My Inspections" subtitle="Assignments for your field visits">
      <div className="space-y-6">
        <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">Field work</p><h2 className="mt-2 font-heading text-2xl font-semibold text-slate-900 sm:text-3xl">My Inspections</h2><p className="mt-1 text-sm text-slate-600">Your assigned project inspections and deadlines.</p></div><div className="inline-flex items-center gap-2 text-xs text-slate-500"><CalendarClock className="h-4 w-4" />Assignments update automatically</div></section>
        <section aria-label="My inspection statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon, tone }) => <article key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${statColors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 font-heading text-2xl font-semibold text-slate-900">{loading ? '—' : data.stats[key]}</p></article>)}
        </section>
        {loading ? <div className="grid gap-4 md:grid-cols-2"><div className="h-52 animate-pulse rounded-xl bg-white" /><div className="h-52 animate-pulse rounded-xl bg-white" /></div> : error ? <div className="rounded-xl border border-rose-200 bg-white p-6 text-center"><CircleAlert className="mx-auto h-8 w-8 text-rose-700" /><p className="mt-3 text-sm text-slate-700">Unable to load your inspections.</p><button type="button" onClick={() => { setLoading(true); setError(''); setRetry((value) => value + 1); }} className="mt-4 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white">Retry</button></div> : data.inspections.length ? <section aria-label="Assigned inspections" className="grid gap-4 md:grid-cols-2">{data.inspections.map((inspection) => <InspectionCard key={inspection.id} inspection={inspection} />)}</section> : <div className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600"><ClipboardCheck className="h-6 w-6" /></span><h3 className="mt-4 font-heading font-semibold text-slate-900">No inspections assigned</h3><p className="mt-1 text-sm text-slate-500">New assignments will appear here.</p></div>}
      </div>
    </InspectorSectionLayout>
  );
}

export default InspectorInspectionsPage;