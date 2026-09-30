import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, CheckCircle2, ChevronDown, ClipboardCheck, CircleAlert, Plus, Timer, TriangleAlert } from 'lucide-react';
import AdminSectionLayout from '../../components/admin-dashboard/AdminSectionLayout';
import StatCard from '../../components/admin-dashboard/StatCard';
import InspectionStatusBadge from '../../components/inspections/InspectionStatusBadge';
import { inspectionService } from '../../services/inspectionService';
import { useAuth } from '../../hooks/useAuth';

const stats = [
  { key: 'assigned', label: 'Assigned', icon: ClipboardCheck, tone: 'blue' },
  { key: 'inProgress', label: 'In Progress', icon: Timer, tone: 'amber' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, tone: 'green' },
  { key: 'overdue', label: 'Overdue', icon: TriangleAlert, tone: 'red' },
];

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function InspectionSkeleton() {
  return <div className="animate-pulse divide-y divide-slate-100" aria-label="Loading inspections" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <div key={index} className="grid grid-cols-5 gap-4 px-5 py-5"><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /></div>)}</div>;
}

function InspectionRow({ inspection }) {
  return <tr className="border-b border-slate-100 text-sm text-slate-600 transition hover:bg-slate-50/70 last:border-0">
      <td className="px-5 py-3.5"><Link to={`/admin/inspections/${inspection.id}`} className="font-semibold text-blue-800 hover:text-blue-950">{inspection.inspectionCode}</Link></td>
      <td className="px-4 py-3.5"><Link to={`/admin/inspections/${inspection.id}`} className="font-medium text-slate-800 hover:text-blue-800">{inspection.project?.name || 'Project unavailable'}</Link></td>
      <td className="px-4 py-3.5">{inspection.inspector?.name || 'Inspector unavailable'}</td>
      <td className="px-4 py-3.5 capitalize">{inspection.assignmentType}</td>
      <td className="px-4 py-3.5 whitespace-nowrap">{formatDate(inspection.assignedAt)}</td>
      <td className="px-4 py-3.5 whitespace-nowrap">{formatDate(inspection.deadline)}</td>
      <td className="px-4 py-3.5"><InspectionStatusBadge status={inspection.status} /></td>
      <td className="px-4 py-3.5"><Link to={`/admin/inspections/${inspection.id}`} aria-label={`View ${inspection.inspectionCode}`} className="text-xs font-semibold text-blue-800 hover:underline">View</Link></td>
    </tr>;
}

function InspectionMobileCard({ inspection }) {
  return <article className="p-4">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link to={`/admin/inspections/${inspection.id}`} className="text-xs font-semibold text-blue-800">{inspection.inspectionCode}</Link><h3 className="mt-1 break-words font-semibold text-slate-900">{inspection.project?.name || 'Project unavailable'}</h3></div><InspectionStatusBadge status={inspection.status} /></div>
      <p className="mt-2 text-sm text-slate-600">{inspection.inspector?.name || 'Inspector unavailable'} · <span className="capitalize">{inspection.assignmentType}</span></p>
      <p className="mt-1 text-xs text-slate-500">Assigned {formatDate(inspection.assignedAt)} · Due {formatDate(inspection.deadline)}</p>
      <Link to={`/admin/inspections/${inspection.id}`} className="mt-3 inline-flex text-sm font-semibold text-blue-800">View assignment</Link>
  </article>;
}

function InspectionsPage() {
  const { token } = useAuth();
  const [data, setData] = useState({ inspections: [], stats: { assigned: 0, inProgress: 0, completed: 0, overdue: 0 }, pagination: { page: 1, totalPages: 0, total: 0 } });
  const [status, setStatus] = useState('all');
  const [assignmentType, setAssignmentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    inspectionService.list(token, { page: String(page), limit: '10', status, assignmentType, dateRange }, controller.signal)
      .then((result) => { setData(result); setError(''); })
      .catch((requestError) => { if (!controller.signal.aborted) setError(requestError.message || 'Unable to load inspections.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, page, status, assignmentType, dateRange, retry]);

  const updateFilter = (setter) => (event) => { setter(event.target.value); setPage(1); setLoading(true); };

  return (
    <AdminSectionLayout title="Inspections" subtitle="Manage field inspections and assignments" activeId="inspections">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">Field operations</p><h2 className="mt-2 font-heading text-2xl font-semibold text-slate-900 sm:text-3xl">Inspections</h2><p className="mt-1 text-sm text-slate-600">Manage field inspections and assignments</p></div>
          <Link to="/admin/inspections/new" className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 sm:self-auto"><Plus className="h-4 w-4" />Assign Random Inspection</Link>
        </div>

        <section aria-label="Inspection statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => <StatCard key={stat.key} label={stat.label} value={data.stats[stat.key]} change="Current total" icon={stat.icon} tone={stat.tone} />)}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="relative"><span className="sr-only">Filter inspection status</span><select value={status} onChange={updateFilter(setStatus)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"><option value="all">All statuses</option><option value="assigned">Assigned</option><option value="accepted">Accepted</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></label>
            <label className="relative"><span className="sr-only">Filter assignment type</span><select value={assignmentType} onChange={updateFilter(setAssignmentType)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"><option value="all">All assignment types</option><option value="random">Random</option><option value="manual">Manual</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></label>
            <label className="relative"><span className="sr-only">Filter assignment date</span><CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><select value={dateRange} onChange={updateFilter(setDateRange)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"><option value="all">Any date</option><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></label>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? <InspectionSkeleton /> : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center"><CircleAlert className="h-8 w-8 text-rose-700" /><h3 className="mt-3 font-heading font-semibold text-slate-900">Unable to load inspections</h3><p className="mt-1 text-sm text-slate-500">Please try again.</p><button type="button" onClick={() => { setLoading(true); setRetry((value) => value + 1); }} className="mt-4 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white">Retry</button></div>
          ) : !data.inspections.length ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600"><ClipboardCheck className="h-6 w-6" /></span><h3 className="mt-4 font-heading font-semibold text-slate-900">No inspections found</h3><p className="mt-1 text-sm text-slate-500">Create a random assignment to get an inspection started.</p><Link to="/admin/inspections/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Assign Random Inspection</Link></div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1050px] border-collapse text-left"><thead><tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500"><th className="px-5 py-3">Inspection ID</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Inspector</th><th className="px-4 py-3">Assignment Type</th><th className="px-4 py-3">Assigned</th><th className="px-4 py-3">Deadline</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{data.inspections.map((inspection) => <InspectionRow key={inspection.id} inspection={inspection} />)}</tbody></table></div>
              <div className="divide-y divide-slate-100 md:hidden">{data.inspections.map((inspection) => <InspectionMobileCard key={inspection.id} inspection={inspection} />)}</div>
              {data.pagination.totalPages > 1 && <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3"><span className="text-xs text-slate-500">Page {page} of {data.pagination.totalPages}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => { setPage((value) => value - 1); setLoading(true); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40">Previous</button><button type="button" disabled={page >= data.pagination.totalPages} onClick={() => { setPage((value) => value + 1); setLoading(true); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40">Next</button></div></div>}
            </>
          )}
        </section>
      </div>
    </AdminSectionLayout>
  );
}

export default InspectionsPage;